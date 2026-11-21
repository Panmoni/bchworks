// Opcodes in the "reserved" group (OP_NOP1–OP_NOP10 expansion slots, reserved
// and undefined bytes) are too thin to rank (PAN-425). Their pages are noindex,
// and astro.config.mjs keeps them out of the sitemap. One rule for both.
/** @param {{ group: string }} opcode */
export const isNoindexOpcode = (opcode) => opcode.group === "reserved";
