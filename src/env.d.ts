// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />

// Plain `tsc` (the lane types gate) cannot resolve .astro files; `astro check`
// can, and there the real component types win over this fallback.
declare module "*.astro" {
	const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
	export default Component;
}

// Stamped by astro.config.mjs from scripts/version.mjs.
declare const __APP_VERSION__: string;
declare const __GIT_COMMIT__: string;
