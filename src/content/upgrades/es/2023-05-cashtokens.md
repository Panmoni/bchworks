---
title: 'Mayo de 2023: CashTokens, P2SH32 y transacciones más pequeñas'
date: 2023-05-15T12:00:00.000Z
status: activated
height: 792773
summary: Tokens fungibles y NFTs nativos (CashTokens), P2SH de 32 bytes para una mayor seguridad de los contratos, un tamaño mínimo de transacción de 65 bytes y versiones de transacción restringidas a 1 y 2.
keywords:
  - cashtokens upgrade
  - may 2023 upgrade
  - bitcoin cash tokens
  - bch nft
  - p2sh32
  - sighash_utxos
  - bitcoin cash native tokens
  - token primitives
chips:
  - chip-2022-02-cashtokens
  - chip-2022-05-p2sh32
  - chip-2021-01-restrict-transaction-version
  - chip-2021-01-minimum-transaction-size
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2023-05-15 Network Upgrade Specification (especificaciones de actualizaciones de BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
  - title: 'CHIP-2022-02 CashTokens: Token Primitives for Bitcoin Cash'
    url: https://github.com/cashtokens/cashtokens
  - title: Discusión de CHIP-2022-05 P2SH32 (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2022-05-pay-to-script-hash-32-p2sh32-for-bitcoin-cash/806
  - title: Bitcoin Cash Upgrade 2023 (blog de bitjson)
    url: https://blog.bitjson.com/bitcoin-cash-upgrade-2023/
  - title: 'BCHN MR !1598: Allow for txn sizes as small as 65 bytes'
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/merge_requests/1598
  - title: Bitcoin Cash Node chainparams.cpp (upgrade9Height)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: 34e847db14ebcfe0
  status: machine
  translator: Claude
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1684152000`
(15 de mayo de 2023, 12:00 UTC). El primer bloque con las nuevas reglas es la altura 792773. La red
[chipnet](/glossary#chipnet) (la red de pruebas de los CHIPs) aplicó las mismas reglas seis meses antes, desde el 15 de noviembre de 2022.

Se activaron cuatro CHIPs:

### CashTokens (CHIP-2022-02)

[CashTokens](/chips/chip-2022-02-cashtokens), de Jason Dreyzehner, añade dos tipos de token directamente a los
[UTXOs](/glossary#utxo):

- **[Tokens fungibles](/glossary#fungible-token)**: unidades intercambiables, como una stablecoin (moneda estable) o puntos. Una categoría puede
  tener hasta 9.223.372.036.854.775.807 unidades, todas creadas en su transacción de génesis.
- **[NFTs](/glossary#nft)**: cada uno lleva un **compromiso** de 0 a 40 bytes, definido por el emisor. Un NFT puede tener la
  capacidad `minting` (crear cualquier cantidad de NFTs nuevos), la capacidad `mutable` (editar su propio compromiso) o ninguna
  (inmutable).

El ID de cada categoría de token es el ID de transacción de una moneda de la salida 0 gastada en la transacción de génesis. Por eso los IDs de categoría
son únicos y no se pueden falsificar. Los tokens se ubican en una salida junto a BCH, marcados con un byte de prefijo (`0xef`).

Seis nuevos opcodes (códigos de operación) permiten que los contratos inspeccionen los tokens:
[`OP_UTXOTOKENCATEGORY`](/opcodes/op_utxotokencategory),
[`OP_UTXOTOKENCOMMITMENT`](/opcodes/op_utxotokencommitment),
[`OP_UTXOTOKENAMOUNT`](/opcodes/op_utxotokenamount),
[`OP_OUTPUTTOKENCATEGORY`](/opcodes/op_outputtokencategory),
[`OP_OUTPUTTOKENCOMMITMENT`](/opcodes/op_outputtokencommitment) y
[`OP_OUTPUTTOKENAMOUNT`](/opcodes/op_outputtokenamount).
El CHIP también añade un modo de firma `SIGHASH_UTXOS` y tipos de [CashAddress](/glossary#cashaddr) compatibles con tokens.

### P2SH32 (CHIP-2022-05)

[P2SH32](/chips/chip-2022-05-p2sh32), de bitcoincashautist, añade una versión de 32 bytes de pay-to-script-hash:
`OP_HASH256 <32-byte hash> OP_EQUAL`. El P2SH clásico usa un hash de 20 bytes, que es vulnerable a ataques de colisión con una seguridad de unos
80 bits. Consulta [P2SH](/glossary#p2sh).

### Tamaño mínimo de transacción (CHIP-2021-01)

El [tamaño mínimo](/chips/chip-2021-01-minimum-transaction-size) bajó de 100 bytes a 65 bytes. Lo propuso Tom
Zander.

### Restricción de la versión de transacción (CHIP-2021-01)

Las [versiones de transacción](/chips/chip-2021-01-restrict-transaction-version) distintas de 1 y 2 pasaron a ser inválidas por
consenso. Antes, solo la política de retransmisión lo imponía.

## Por qué

**Contratos que pueden dar fe de algo.** El CHIP de CashTokens parte de una carencia: antes de 2023, los únicos compromisos que un
contrato podía verificar eran firmas, y las firmas necesitan una clave privada. Un contrato no puede guardar una clave, así que todo lo que un
contrato “dijera” tenía que firmarlo una parte de confianza. Eso descartaba los oráculos descentralizados y muchos diseños con varios contratos. Los compromisos de los tokens dan a los contratos sus propios mensajes verificables, “sin aumentar los costos de validación de transacciones ni de bloques” (traducción nuestra).

**Tokens validados por consenso.** Cada nodo hace cumplir las reglas de los tokens, así que los contratos pueden leer y controlar los tokens
directamente. El CHIP también busca dar soporte a estándares de tokens de más alto nivel sobre estas primitivas.

**Seguridad de los contratos.** P2SH32 surgió de una discusión titulada “a long-term solution for 80-bit P2SH collision
attacks”. Un hash de 20 bytes ofrece solo unos 80 bits de resistencia a colisiones. Eso importa en los contratos entre varias partes,
donde una parte podría intentar fabricar dos scripts con el mismo hash. Un hash de 32 bytes cierra esa brecha.

**Mantenimiento.** El mínimo de 100 bytes (de [2018](/upgrades/2018-11-upgrade)) bloqueaba algunas transacciones pequeñas válidas y útiles
y causaba problemas a quienes construían transacciones coinbase; 65 bytes sigue bloqueando el ataque de 64 bytes contra SPV (verificación simplificada de pagos). Fijar las versiones en 1 y
2 significa que un futuro formato de transacción puede reclamar un número de versión nuevo que ninguna transacción antigua haya usado.

## Qué permite

- **Tokens que cuesta menos de un centavo acuñar o enviar.** Cualquiera puede emitir un token o una colección de NFTs sin desplegar ningún contrato,
  sin aprobaciones y sin claves de administrador. Consulta [CashTokens](/cashtokens) y la lista de tokens en vivo en
  [tokenstork.com](https://tokenstork.com).
- **DEXs (exchanges descentralizados) y DeFi en UTXOs.** Los compromisos de los NFTs pueden guardar el estado de un contrato: propiedad, autorizaciones, crédito, deuda.
  Los contratos pueden reconocer los tokens de otros contratos e interactuar sin un estado global compartido. Aplicaciones como Cauldron (DEX),
  Moria (pedir prestado MUSD) y TapSwap (mercado de NFTs) se basan en esto.
- **Covenants (contratos que limitan cómo se pueden gastar las monedas) más seguros.** Los contratos pueden usar un hash de script de 32 bytes para su dirección.
- **Menos tokens perdidos.** Las CashAddresses compatibles con tokens identifican las billeteras que aceptan tokens. Las billeteras compatibles con tokens deben negarse a
  enviar tokens a una dirección común.
- **Metadatos.** El estándar independiente [BCMR](/glossary#bcmr) permite a los emisores publicar nombres, símbolos e íconos para una
  categoría.

## Límites

Los compromisos de los NFTs se limitaron a 40 bytes. Ese límite se elevó a 128 bytes [en 2026](/upgrades/2026-05-upgrade).
