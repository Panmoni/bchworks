---
title: 'CashTokens: primitivas de tokens para Bitcoin Cash'
code: CHIP-2022-02
owners:
  - Jason Dreyzehner
status: activated
upgrade: 2023-05-cashtokens
summary: Agrega tokens fungibles y tokens no fungibles (NFTs) directamente a las salidas de Bitcoin Cash, validados por consenso y legibles por los contratos.
spec: https://github.com/cashtokens/cashtokens
discussion: https://bitcoincashresearch.org/t/chip-2022-02-cashtokens-token-primitives-for-bitcoin-cash/725
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Bitcoin Unlimited
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Bitcoin Verde
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Flowee
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Knuth
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: BCHD
    position: neutral
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Electron Cash
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Paytaca Wallet
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: General Protocols
    position: support
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - name: Memo Technology, Inc.
    position: oppose
    source: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP-2022-02 CashTokens specification
    url: https://github.com/cashtokens/cashtokens
  - title: CashTokens stakeholder responses
    url: https://github.com/cashtokens/cashtokens/blob/master/stakeholders.md
  - title: 2023-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
translation:
  sourceHash: 94c72a8ec3bfeba7
  status: machine
  translator: Claude
  qaHash: 1df8f227191a6668
---

## Resumen

CashTokens agrega dos primitivas de tokens a Bitcoin Cash: **tokens fungibles** y **tokens no fungibles**
([NFTs](/glossary#nft)). Los tokens viven dentro de salidas comunes, junto a BCH, y cada nodo hace cumplir sus reglas. Consulta
[CashTokens](/cashtokens) para ver una guía de uso y [tokenstork.com](https://tokenstork.com) para ver datos de tokens en tiempo real.

## Motivación

El CHIP parte de un límite del sistema de contratos. Antes de CashTokens, los únicos compromisos que un contrato podía verificar
eran las firmas de transacciones y las firmas de datos. Ambas requieren una clave privada de confianza, y un contrato no puede guardar una. Por eso
los contratos no podían emitir sus propios mensajes verificables, y los oráculos descentralizados y muchos diseños entre contratos quedaban
fuera de alcance.

Las primitivas de tokens dan a los contratos esa capacidad “sin aumentar los costos de validación de transacciones ni de bloques” (traducción nuestra), y mantienen
el modelo [UTXO](/glossary#utxo) sin estado de BCH. Los contratos pueden interactuar entre sí sin un estado global compartido.

## Qué especifica

- **Categorías de token.** Cada ID de categoría es un ID de transacción de 32 bytes. Debe provenir de una entrada que gaste la salida 0
  de su transacción madre (una “entrada de génesis”), así que los ID de categoría no se pueden falsificar.
- **Tokens fungibles.** Todas las unidades de una categoría se crean en su transacción de génesis, hasta
  9.223.372.036.854.775.807 en total.
- **NFTs.** Cada uno lleva un compromiso de 0 a 40 bytes (ampliado a 128 bytes en 2026 por [P2S](/chips/chip-2024-12-p2s)).
  Capacidades: `minting` (crear cualquier cantidad de NFTs nuevos de la categoría), `mutable` (crear un NFT de reemplazo con un
  compromiso nuevo) o ninguna (inmutable).
- **Codificación.** Un prefijo de token, marcado por el byte `0xef`, se ubica al inicio del campo de bytecode de bloqueo de la salida.
- **Seis opcodes (códigos de operación) de inspección:** [`OP_UTXOTOKENCATEGORY`](/opcodes/op_utxotokencategory),
  [`OP_UTXOTOKENCOMMITMENT`](/opcodes/op_utxotokencommitment), [`OP_UTXOTOKENAMOUNT`](/opcodes/op_utxotokenamount),
  [`OP_OUTPUTTOKENCATEGORY`](/opcodes/op_outputtokencategory),
  [`OP_OUTPUTTOKENCOMMITMENT`](/opcodes/op_outputtokencommitment),
  [`OP_OUTPUTTOKENAMOUNT`](/opcodes/op_outputtokenamount).
- **`SIGHASH_UTXOS`**, un modo de firma que cubre todas las salidas gastadas.
- **[CashAddresses](/glossary#cashaddr) compatibles con tokens.** Las billeteras compatibles con tokens deben negarse a enviar tokens a direcciones
  comunes, lo que reduce la pérdida accidental de tokens.

## Estado actual

Final (versión 2.2.2). Se activó el 15 de mayo de 2023; Chipnet (la red de pruebas de los CHIPs) lo ejecutaba desde el 15 de noviembre de 2022.

La tabla de partes interesadas registra 82 aprobaciones, 1 desaprobación (Memo Technology, Inc.) y 253 neutrales. La consulta del CHIP
contó las faltas de respuesta como neutrales, así que la cifra de neutrales refleja sobre todo silencio, no objeción. Todas las implementaciones
de nodo lo aprobaron, excepto BCHD (neutral).
