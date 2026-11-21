---
title: Tamaño mínimo de transacción (permitir transacciones más pequeñas)
code: CHIP-2021-01
owners:
  - Tom Zander
status: activated
upgrade: 2023-05-cashtokens
summary: Se redujo el tamaño mínimo de transacción de 100 bytes a 65 bytes, sin dejar de bloquear el ataque de 64 bytes contra el árbol de Merkle.
spec: https://gitlab.com/bitcoin.cash/chips/-/blob/00e55fbfdaacf1436e455289086d9b4c6b3e7306/CHIP-2021-01-Allow%20Smaller%20Transactions.md
discussion: https://bitcoincashresearch.org/t/chip-2021-01-allow-transactions-to-be-smaller-in-size/154
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2023-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
  - title: CHIP 2021-01 Allow Transactions to be smaller in size (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2021-01-allow-transactions-to-be-smaller-in-size/154
  - title: 'BCHN MR !1598: Allow for txn sizes as small as 65 bytes'
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/merge_requests/1598
  - title: Bitcoin Cash Upgrade 2023 (blog de bitjson)
    url: https://blog.bitjson.com/bitcoin-cash-upgrade-2023/
translation:
  sourceHash: afb0b28fc4b45c4d
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

La [actualización de noviembre de 2018](/upgrades/2018-11-upgrade) hizo inválidas las transacciones de menos de 100 bytes. Este CHIP redujo
el mínimo a 65 bytes.

## Motivación

La regla de los 100 bytes bloquea una debilidad conocida del árbol de Merkle de Bitcoin: una transacción de 64 bytes puede confundirse con un
nodo interno del árbol, lo que permite a un atacante engañar a las billeteras [SPV](/glossary#spv) (verificación simplificada de pagos). Pero 100 bytes era más de lo necesario.

La publicación original de Tom Zander enumera los costos:

- Una transacción coinbase predeterminada ocupa menos de 100 bytes, así que el software de minería tenía que rellenarla o arriesgarse a producir bloques inválidos.
- Muchas transacciones válidas y útiles que no son P2PKH caben en menos de 100 bytes.

El primer borrador proponía prohibir exactamente los 64 bytes. En cambio, la discusión se decidió por un mínimo simple de 65, para que el rango
de tamaños válidos siga siendo un único intervalo continuo. Calin Culianu lo implementó en Bitcoin Cash Node.

## Qué especifica

A partir de la actualización de mayo de 2023, una transacción debe tener al menos 65 bytes. Las transacciones de 64 bytes o menos son inválidas.

## Estado actual

Se activó el 15 de mayo de 2023 con [CashTokens](/upgrades/2023-05-cashtokens). El resumen de bitjson sobre la actualización: “Permitir
que las transacciones sean de apenas 65 bytes evita desperdiciar ancho de banda y almacenamiento” (traducción nuestra).

No se encontró una tabla formal de partes interesadas para este CHIP.
