#!/usr/bin/env bash
# USAGE: scripts/ops/utxo-backfill-carson.sh dry-run|start|status|fetch
#
# Runs the first UTXO-stats backfill (scripts/utxo-stats.mjs from genesis) on
# carson, next to its BCHN, against loopback RPC. Run it from this repo on a
# machine with `ssh carson` and passwordless sudo there.
#
#   dry-run  2-minute run from genesis in a scratch dir, then times getblock
#            verbosity 3 at 8 heights across the chain and prints a runtime
#            estimate. Leaves the real run's state alone.
#   start    Starts (or resumes) the full backfill as the transient systemd
#            unit utxo-backfill, user bchn, idle CPU and I/O priority. It
#            survives a dropped ssh session. The output file carries its own
#            cursor and is saved every 2 minutes, so `start` after a crash or a
#            `systemctl stop` continues where it stopped, not from genesis.
#   status   Running / failed / finished, the last log lines, and progress.
#   fetch    Once finished, copies the stats file into src/data/utxo-stats.json.
#
# Why carson and not this workstation through the tunnel: verbosity-3 JSON for
# the whole chain is on the order of a terabyte. On loopback it never leaves
# the host; through the tunnel all of it would cross carson's uplink and
# Cloudflare, and bitcoind would do the same work either way.
#
# The RPC credentials are read from bitcoin.conf on carson, inside the unit, by
# the bchn user. They never cross ssh, land in a unit property or show in ps.
#
# ENV: SSH_HOST (carson).
{ set +x; } 2>/dev/null
set -euo pipefail

SSH_HOST="${SSH_HOST:-carson}"
UNIT=utxo-backfill
WORK=/var/tmp/utxo-backfill
DRY_UNIT=utxo-backfill-dryrun
DRY_WORK=/var/tmp/utxo-backfill-dryrun
BCHN_CONF=/var/lib/bchn/.bitcoin/bitcoin.conf
OUT=src/data/utxo-stats.json
cd "$(git rev-parse --show-toplevel)" || exit 1
SRC=scripts/utxo-stats.mjs

say() { printf '%s\n' "$*"; }
die() {
	printf 'FAIL: %s\n' "$*" >&2
	exit 1
}
remote() { ssh -o BatchMode=yes "$SSH_HOST" "$@"; }

[ $# -eq 1 ] || die "usage: $0 dry-run|start|status|fetch"
[ -r "$SRC" ] || die "$SRC is missing"

# run.sh: builds BCH_RPC_URL from bitcoin.conf (percent-encoded: the script
# decodes it) and execs utxo-stats.mjs or the timing sampler with its args.
RUN_SH=$(
	cat <<EOF
#!/bin/sh
set -eu
BCH_RPC_URL=\$(node -e '
const c = require("fs").readFileSync(process.argv[1], "utf8");
const g = (k) => c.match(new RegExp("^\\\\s*" + k + "=(.*)\$", "m"))?.[1].trim();
const u = g("rpcuser"), p = g("rpcpassword");
const port = g("rpcport") || "8332";
if (!u || !p) { console.error("run.sh: no rpcuser/rpcpassword in bitcoin.conf"); process.exit(1); }
process.stdout.write("http://" + encodeURIComponent(u) + ":" + encodeURIComponent(p) + "@127.0.0.1:" + port);
' $BCHN_CONF)
export BCH_RPC_URL
exec node "\$@"
EOF
)

# sample.mjs: times getblock verbosity 3 (fetch + JSON parse) at 8 heights and
# extrapolates. Serial, so an upper bound: utxo-stats keeps 4 fetches in flight.
SAMPLE_MJS=$(
	cat <<'EOF'
const url = new URL(process.env.BCH_RPC_URL);
const auth = "Basic " + Buffer.from(decodeURIComponent(url.username) + ":" + decodeURIComponent(url.password)).toString("base64");
url.username = url.password = "";
const rpc = async (method, params = []) => {
	const r = await fetch(url, { method: "POST", headers: { authorization: auth }, body: JSON.stringify({ id: 1, method, params }) });
	const b = await r.json();
	if (b.error) throw new Error(method + ": " + b.error.message);
	return b.result;
};
const tip = await rpc("getblockcount");
const N = 8;
const PER = 5; // consecutive blocks per sample height
let total = 0;
for (let i = 1; i <= N; i++) {
	const h0 = Math.floor((tip * i) / (N + 1));
	const t = Date.now();
	for (let h = h0; h < h0 + PER; h++) await rpc("getblock", [await rpc("getblockhash", [h]), 3]);
	const ms = (Date.now() - t) / PER;
	total += ms;
	console.log(`sample: height ${h0}: ${ms.toFixed(0)} ms/block`);
}
const hours = ((total / N) * tip) / 3_600_000;
console.log(`estimate: ${tip} blocks × ${(total / N).toFixed(0)} ms ≈ ${hours.toFixed(1)} h serial; expect less with 4 fetches in flight`);
EOF
)

# install_work DIR: copies utxo-stats.mjs, run.sh and sample.mjs into DIR on
# carson, owned by bchn. Keeps DIR's stats file, which is the resume cursor.
install_work() {
	local dir=$1
	{
		printf '%s\n' "$RUN_SH" | base64 -w0
		printf ' '
		base64 -w0 "$SRC"
		printf ' '
		printf '%s\n' "$SAMPLE_MJS" | base64 -w0
		printf '\n'
	} | remote "sudo -n bash -c '
set -eu
read -r run src sample
install -d -o bchn -g bchn $dir $dir/scripts $dir/src $dir/src/data
# install cannot read /dev/stdin over an existing file: decode to .new first.
put() { printf %s \"\$1\" | base64 -d >\"\$2.new\"; install -o bchn -g bchn -m \"\$3\" \"\$2.new\" \"\$2\"; rm -f \"\$2.new\"; }
put \"\$run\" $dir/run.sh 0755
put \"\$src\" $dir/scripts/utxo-stats.mjs 0644
put \"\$sample\" $dir/scripts/sample.mjs 0644
'"
}

# A unit that runs at idle CPU and I/O priority, as bchn, in DIR.
SYSTEMD_RUN="sudo -n systemd-run --quiet --uid=bchn --gid=bchn -p Nice=19 -p CPUSchedulingPolicy=idle -p IOSchedulingClass=idle -p MemoryMax=6G"

# progress DIR: cursor, tip and day count from DIR's stats file.
progress() {
	remote "sudo -n node -e '
const f = \"$1/$OUT\";
const fs = require(\"fs\");
if (!fs.existsSync(f)) { console.log(\"progress: no stats file yet\"); process.exit(0); }
let d; try { d = JSON.parse(fs.readFileSync(f, \"utf8\")); } catch { console.log(\"progress: CORRUPT stats file \" + f); process.exit(1); }
const done = d.cursor && d.tip !== undefined && d.cursor.height >= d.tip - 6;
console.log(\"progress: height \" + (d.cursor?.height ?? 0) + \" of \" + (d.tip ?? \"?\") + \", \" + d.rows.length + \" days, \" + d.awakenings.length + \" awakenings, saved \" + d.generatedAt + (done ? \" — FINISHED\" : \"\"));
console.log(\"verified: \" + JSON.stringify(d.verified));
'"
}

case "$1" in
dry-run)
	say "== dry run: 2 minutes from genesis in $DRY_WORK"
	remote "sudo -n systemctl stop $DRY_UNIT 2>/dev/null; sudo -n systemctl reset-failed $DRY_UNIT 2>/dev/null; sudo -n rm -f $DRY_WORK/$OUT" || true
	install_work "$DRY_WORK"
	remote "$SYSTEMD_RUN --unit=$DRY_UNIT --wait --pipe --collect --working-directory=$DRY_WORK /bin/sh $DRY_WORK/run.sh scripts/utxo-stats.mjs --budget-minutes 2" ||
		die "the dry run exited non-zero (output above)"
	progress "$DRY_WORK"
	say "== timing getblock verbosity 3 across the chain"
	remote "$SYSTEMD_RUN --unit=$DRY_UNIT --wait --pipe --collect --working-directory=$DRY_WORK /bin/sh $DRY_WORK/run.sh scripts/sample.mjs" ||
		die "the timing sampler exited non-zero (output above)"
	say "OK: dry run passed. Next: $0 start"
	;;
start)
	state=$(remote "systemctl is-active $UNIT 2>/dev/null || true")
	case "$state" in inactive | failed | unknown) ;; *) die "$UNIT is $state on $SSH_HOST: $0 status" ;; esac
	remote "sudo -n systemctl reset-failed $UNIT 2>/dev/null || true"
	install_work "$WORK"
	progress "$WORK"
	remote "$SYSTEMD_RUN --unit=$UNIT --working-directory=$WORK /bin/sh $WORK/run.sh scripts/utxo-stats.mjs"
	say "OK: $UNIT started on $SSH_HOST. Watch: $0 status (or ssh $SSH_HOST journalctl -fu $UNIT)"
	say "Stop: ssh $SSH_HOST sudo systemctl stop $UNIT — then '$0 start' resumes."
	;;
status)
	say "unit: $(remote "systemctl is-active $UNIT 2>/dev/null || true")"
	remote "sudo -n journalctl -u $UNIT -n 8 --no-pager -o cat 2>/dev/null || true"
	progress "$WORK"
	;;
fetch)
	state=$(remote "systemctl is-active $UNIT 2>/dev/null || true")
	[ "$state" = active ] && die "$UNIT is still running"
	[[ $(progress "$WORK") == *FINISHED* ]] || die "the backfill has not finished; '$0 start' resumes it"
	trap 'rm -f "$OUT.tmp"' EXIT
	remote "sudo -n cat $WORK/$OUT" >"$OUT.tmp"
	node -e 'const d = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); if (!d.verified?.matchesCoinstatsindex) process.exit(1);' "$OUT.tmp" ||
		die "$OUT.tmp does not carry a verified row"
	mv "$OUT.tmp" "$OUT"
	say "OK: $OUT updated ($(wc -c <"$OUT") bytes)."
	;;
*) die "usage: $0 dry-run|start|status|fetch" ;;
esac
