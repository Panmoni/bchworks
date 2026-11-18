---
title: Los riesgos de Bitcoin Cash, sin rodeos
description: 'Las debilidades reales de Bitcoin Cash: poca liquidez, sin USDT ni USDC, baja participación en la tasa de hash, bloques de 10 minutos, historial de bifurcaciones y límites de 0-conf. Con fuentes.'
verified: 2026-09-26T00:00:00.000Z
faq:
  - q: Is Bitcoin Cash a good investment?
    a: This page cannot tell you that, and nobody can promise a return. BCH is a volatile asset with thin liquidity compared with Bitcoin. It fell about 88% from its December 2017 peak by August 2018. Buy only what you can afford to lose, and read the risks below first.
  - q: Can Bitcoin Cash be 51% attacked?
    a: In principle, yes. BCH shares the SHA-256 algorithm with Bitcoin but has a small share of its hashrate, so a large Bitcoin miner could point hash at BCH. BCH nodes add a 10-block rolling checkpoint that limits deep reorgs, and no successful attack for profit is on record in our sources. The risk is real but has not played out.
  - q: Is USDT available on Bitcoin Cash?
    a: Not in any supported form. Tether stopped minting USDT on Bitcoin Cash SLP on 17 August 2023 and ended redemptions on 1 September 2025. USDC was never issued on BCH. ParyonUSD (PUSD) and MUSD are BCH-native stablecoins, backed by BCH collateral, with their own smart-contract and oracle risks.
  - q: Are zero-confirmation BCH payments safe?
    a: Safe enough for small, everyday payments, not a guarantee. Double-spend proofs (DSProofs) alert merchants to a competing spend within seconds, but they cover only simple P2PKH transactions and cannot stop a miner who chooses to include the other transaction. For large amounts, wait for a confirmation.
  - q: Is Bitcoin Cash private?
    a: No. BCH is a transparent public ledger, like Bitcoin. CashFusion is an optional mixing tool that users must turn on in a supporting wallet. Privacy is opt-in, not the default.
  - q: Why did Bitcoin Cash split so many times?
    a: BCH forked from Bitcoin on 1 August 2017. It split again in November 2018 (Bitcoin SV) and in November 2020 (Bitcoin ABC, now eCash), the last over a plan to divert part of the block reward to developers. Each split cost users, liquidity and trust.
sources:
  - title: Bitcoin Cash — Wikipedia
    url: https://en.wikipedia.org/wiki/Bitcoin_Cash
  - title: Tether discontinues USDT on Bitcoin, Kusama and Bitcoin Cash — The Block (agosto de 2023)
    url: https://www.theblock.co/post/245976/tether-discontinues-usdt-bitcoin-kusama-bitcoin-cash
  - title: Tether to wind down USD₮ support for five legacy blockchains — Tether (julio de 2025)
    url: https://tether.io/news/tether-to-wind-down-usdt-support-for-five-legacy-blockchains-as-part-of-strategic-infrastructure-review/
  - title: USDC contract addresses — Circle Developer Docs
    url: https://developers.circle.com/stablecoins/usdc-contract-addresses
  - title: ParyonUSD — Decentralized stablecoin on Bitcoin Cash
    url: https://paryonusd.com/
  - title: Moria Protocol documentation — General
    url: https://docs.moria.money/general/
  - title: On the Miner Infrastructure Funding Plan — Bitcoin ABC (febrero de 2020)
    url: https://www.bitcoinabc.org/2020-02-15-miner-fund/
  - title: 'Bitcoin Cash: the dawn of a new hard fork — Young Platform Academy'
    url: https://academy.youngplatform.com/en/cryptocurrencies/bitcoin-cash-fork/
  - title: Is low hashrate a problem? — The Bitcoin Cash Podcast
    url: https://bitcoincashpodcast.com/faqs/BCH-vs-BTC/is-low-hashrate-a-problem
  - title: CHIP-2025-03 Faster Blocks for Bitcoin Cash — Bitcoin Cash Research
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-for-bitcoin-cash/1513
  - title: 'CHIP-2025-03 Faster Blocks: statements of support (and dissent) — Bitcoin Cash Research'
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/33
  - title: BCH Weekly Recap, September 20, 2026 — KuCoin News
    url: https://www.kucoin.com/news/community/BCH/6ab0ee5274fd460007c479bc
  - title: CashFusion — Privacy for Bitcoin Cash
    url: https://cashfusion.org/
  - title: Transaction Lifecycle (UTXO contention) — CashScript docs
    url: https://cashscript.org/docs/guides/lifecycle
  - title: Cauldron whitepaper — Riften Labs
    url: https://docs.riftenlabs.com/cauldron/whitepaper/
  - title: Double Spend Proofs — Bitcoin Cash upgrade specifications
    url: https://upgradespecs.bitcoincashnode.org/dsproof/
  - title: DSProof implementation notes — Bitcoin Cash Node
    url: https://docs.bitcoincashnode.org/doc/dsproof-implementation-notes/
  - title: OKCoin delists Bitcoin Cash, Bitcoin SV — CoinDesk (febrero de 2021)
    url: https://www.coindesk.com/tech/2021/02/19/okcoin-delists-bitcoin-cash-bitcoin-sv-to-avoid-misleading-new-bitcoin-clients
  - title: Coinbase Wallet delists XRP, Bitcoin Cash and Ethereum Classic — Decrypt (noviembre de 2022)
    url: https://decrypt.co/115955/coinbase-wallet-delists-ripple-xrp-bitcoin-cash-ethereum-classic
  - title: CME Group to expand crypto derivatives suite with Bitcoin Cash and Uniswap futures — PR Newswire (septiembre de 2026)
    url: https://www.prnewswire.com/news-releases/cme-group-to-expand-crypto-derivatives-suite-with-bitcoin-cash-and-uniswap-futures-302886066.html
translation:
  sourceHash: ff45759b2b5462df
  status: machine
  translator: Claude
---

Publicamos esta página porque un sitio que solo enumera fortalezas es un folleto publicitario. Bitcoin Cash funciona como dinero y ejecuta contratos reales. También tiene debilidades. Aquí están, con fuentes. Cuando algo reduce un riesgo, lo decimos. Cuando nada lo reduce, también lo decimos.

El panel de métricas en vivo junto a este texto muestra el uso, las comisiones y la tasa de hash (hashrate) actuales. No fijamos esas cifras aquí porque cambian a diario.

## 1. Poco uso y poca liquidez

**Qué es.** BCH es una red pequeña al lado de Bitcoin, Ethereum o Solana. Las transacciones diarias, los depósitos en DeFi y la profundidad de los libros de órdenes son modestos. Consulta el panel en vivo para ver las cifras de hoy.

**Por qué importa.** Los libros de órdenes poco profundos se mueven más con operaciones grandes. Pocos usuarios significa menos lugares donde gastar BCH y menos apps entre las que elegir. Tether citó la caída del volumen cuando dejó de ofrecer USDT en la antigua capa de tokens SLP de BCH.

**Qué ayuda.** El poco uso también significa comisiones bajas y bloques vacíos, así que la red tiene margen para crecer. Uso no es lo mismo que capacidad. Consulta el [directorio](/directory) para ver lo que está activo hoy.

## 2. Sin USDT ni USDC en BCH

**Qué es.** Tether dejó de acuñar USDT en Bitcoin Cash SLP el 17 de agosto de 2023. Puso fin a los reembolsos ahí el 1 de septiembre de 2025. La lista de cadenas de USDC de Circle no incluye Bitcoin Cash.

**Por qué importa.** La mayor parte del comercio cripto y de las remesas funciona con USDT y USDC. Sin ellas, los usuarios de BCH que quieren dólares deben salir de la cadena o usar alternativas más pequeñas.

**Qué ayuda, con salvedades.** Ahora funcionan dos stablecoins (monedas estables) nativas en [CashTokens](/glossary#cashtokens):

- **ParyonUSD (PUSD)** entró en funcionamiento el 30 de abril de 2026. Los usuarios piden PUSD prestado con BCH como garantía, con una relación de garantía mínima del 110 %. El equipo informa de una auditoría del contrato inteligente ya completada.
- **MUSD** de Moria Protocol funciona igual: bloqueas BCH y pides prestado MUSD. Usa un oráculo en la cadena para los precios.

Ambas son jóvenes, pequeñas y dependen de la garantía en BCH, de un oráculo y del código del contrato. Una caída brusca de BCH o un fallo del oráculo pone a prueba la paridad. Trátalas como experimentos, no como un reemplazo de USDT.

## 3. Pocos desarrolladores y sin tesorería del protocolo

**Qué es.** BCH no tiene un fondo de desarrollo integrado. En 2020, el equipo de Bitcoin ABC impulsó un Infrastructure Funding Plan que enviaría parte de cada recompensa por bloque a los desarrolladores. Gran parte de la comunidad lo rechazó. La cadena se dividió el 15 de noviembre de 2020, y el lado de ABC luego pasó a llamarse eCash (XEC).

**Por qué importa.** El trabajo en nodos y herramientas depende de donaciones, empresas y voluntarios. Un grupo pequeño de revisores significa que un solo desarrollador escéptico puede mover el calendario de una actualización. Eso pasó en septiembre de 2026, cuando un desarrollador conocido dijo que el código de Faster Blocks “no está listo” (traducción nuestra) y propuso esperar hasta 2028.

**Qué ayuda.** Las actualizaciones siguen saliendo cada mayo según lo previsto. Consulta [/upgrades](/upgrades/2026-05-upgrade) y [¿Está muerto Bitcoin Cash?](/is-bitcoin-cash-dead) para ver el historial de versiones.

## 4. Poca participación en la tasa de hash compartida de SHA-256

**Qué es.** BCH usa la misma prueba de trabajo SHA-256 que Bitcoin. Recibe solo una pequeña parte de la tasa de hash total de SHA-256. Un gran minero de Bitcoin o hash alquilado podría, en teoría, superar a la cadena de BCH durante un tiempo. Eso es un ataque del 51 %.

**Por qué importa.** Un atacante con la mayoría del hash podría revertir pagos recientes o censurar transacciones. La tasa de hash también puede oscilar mientras los mineros persiguen la cadena que pague más.

**Qué ayuda.** BCH ajusta la dificultad en cada bloque, así que las oscilaciones de hash se estabilizan rápido. Los nodos aplican un punto de control móvil de 10 bloques que rechaza reorganizaciones profundas. Nuestras fuentes no registran ningún ataque exitoso con fines de lucro. Unas preguntas frecuentes de un grupo que promueve BCH calculaban el costo de alquilar un ataque en unos 8000 US$ por hora (enero de 2024), pero sostienen que hay muy poco hash en alquiler para mantenerlo. Toma ambas afirmaciones con cautela: la fuente no es neutral y los mercados de alquiler cambian.

## 5. Bloques de diez minutos

**Qué es.** BCH apunta a un bloque cada 10 minutos, igual que Bitcoin.

**Por qué importa.** Un comercio o un exchange que espera una confirmación espera minutos, a veces más.

**Qué ayuda.** La mayoría de los pagos pequeños usan 0-conf (transacción sin confirmar; ver el punto 10). Una propuesta, CHIP-2025-03 Faster Blocks, reduciría el objetivo a 1 minuto. Su calendario marca el bloqueo definitivo el 15 de noviembre de 2026 y la activación el 15 de mayo de 2027. A finales de septiembre de 2026 tiene apoyos públicos, una abstención de General Protocols y disenso abierto. Todavía no hay consenso. Síguela en [/upgrades/2027-05-upgrade](/upgrades/2027-05-upgrade).

## 6. Sin privacidad por defecto

**Qué es.** BCH es un registro transparente. Cualquiera puede rastrear las monedas entre direcciones.

**Por qué importa.** Las empresas de análisis de cadenas pueden vincular tus pagos. Los negocios revelan sus ingresos en la cadena.

**Qué ayuda.** [CashFusion](/glossary#cashfusion) mezcla monedas en una transacción conjunta, pero tienes que activarlo en una billetera que lo admita. Los pagos privados de conocimiento cero solo se han probado en Chipnet, la red de pruebas de los CHIPs, no en la red principal (septiembre de 2026). No digas que BCH es privado.

## 7. Los contratos de UTXO son más difíciles de escribir

**Qué es.** Los contratos de BCH viven en [UTXOs](/glossary#utxo), no en cuentas con estado global. Cada moneda lleva sus propias reglas. Los desarrolladores deben pensar en entradas y salidas, no en llamadas a funciones sobre un objeto compartido.

**Por qué importa.** La mayoría de los desarrolladores de contratos inteligentes aprendieron Solidity. BCH les pide aprender un modelo nuevo, con menos tutoriales y bibliotecas.

**Qué ayuda.** CashScript ofrece un lenguaje de alto nivel, y la actualización de 2026 añadió bucles y funciones. El modelo también se aplica a Cardano, Kaspa y a los diseños de covenant (un contrato que limita cómo se pueden gastar las monedas) del propio Bitcoin. Compáralos en [/compare/bch-vs-btc](/compare/bch-vs-btc).

## 8. Contención de UTXO en pools compartidos

**Qué es.** Cuando dos usuarios intentan gastar el mismo UTXO de un contrato al mismo tiempo, solo gana el primero que se ve. La propia documentación de CashScript llama a esto contención de UTXO.

**Por qué importa.** Un pool muy usado puede rechazar operaciones, y las billeteras deben reintentar. Los diseños que suponen un único pool global, como en Ethereum, no se trasladan directamente.

**Qué ayuda.** Los desarrolladores dividen el estado en muchos UTXOs. CashScript recomienda “múltiples UTXOs duplicados para covenants públicos” (traducción nuestra), cada uno como un hilo separado. El DEX (exchange descentralizado) Cauldron usa muchos micropools y permite que una operación use varios a la vez.

## 9. El lastre de las bifurcaciones

**Qué es.** BCH se separó de Bitcoin el 1 de agosto de 2017. Se dividió otra vez en noviembre de 2018, cuando se fue Bitcoin SV. Se dividió por tercera vez en noviembre de 2020, cuando se fue Bitcoin ABC, que pasó a ser eCash.

**Por qué importa.** Las divisiones separan a usuarios, mineros y liquidez. Algunas plataformas retiraron BCH para evitar confusiones. OKCoin retiró BCH y BSV en febrero de 2021, alegando que los usuarios nuevos los confundían con Bitcoin. Coinbase Wallet retiró BCH en enero de 2023 por su bajo uso; el exchange de Coinbase lo mantuvo.

**Qué ayuda.** BCH no se ha dividido desde 2020. Las actualizaciones desde entonces se han activado sin división de la cadena.

## 10. Límites de la confirmación cero

**Qué es.** Las billeteras de BCH muestran un pago en segundos, antes de que ningún bloque lo confirme. Las [DSProofs](/glossary#dsproof) (pruebas de doble gasto) avisan a un comercio si alguien transmite un gasto competidor.

**Por qué importa.** Una DSProof es un aviso, no una garantía. La especificación solo protege transacciones P2PKH firmadas de cierta manera. No puede detener a un minero que decida minar el doble gasto. Si la transacción víctima tiene transacciones hijas en la mempool, solo la madre recibe una prueba.

**Qué ayuda.** Para pagos del tamaño de un café, el riesgo es pequeño. Para sumas grandes, espera una confirmación. La propia especificación aconseja a los comercios “esperar la confirmación o aplicar una gestión de riesgos más estricta” (traducción nuestra).

## 11. Volatilidad del precio

**Qué es.** El precio de BCH oscila con fuerza. Alcanzó un máximo de 4355,62 US$ en diciembre de 2017 y cayó alrededor de un 88 % para agosto de 2018.

**Por qué importa.** Es difícil fijar precios o ahorrar en un activo de pago que se mueve dos dígitos en una semana.

**Qué ayuda.** Los comercios pueden convertir a moneda local al recibir el pago. Las stablecoins (ver el punto 2) son una opción parcial. Nada hace de BCH una reserva de valor segura.

## 12. Acceso regulatorio y a exchanges

**Qué es.** El acceso a BCH depende de los exchanges, los brókers y los reguladores de tu país. Ya ha habido retiros de listados (punto 9).

**Por qué importa.** Si tu exchange local retira BCH, comprar y vender se vuelve más difícil.

**Qué ayuda.** CME Group planea listar futuros de Bitcoin Cash el 19 de octubre de 2026, sujeto a revisión regulatoria. Los futuros no cambian el acceso en la cadena, pero indican que plataformas reguladas siguen listando BCH. Consulta [/wallet](/wallet) para ver opciones de autocustodia (tú guardas tus propias claves) y [El estado de BCH](/state-of-bch) para ver las cifras mensuales.
