---
title: Corrección de la ambigüedad FT+NFT de CashTokens
code: CHIP-2026-06
owners:
  - bitcoincashautist
status: withdrawn
summary: Proponía prohibir nuevas salidas que contengan a la vez tokens fungibles y un NFT inmutable de cero bytes, que los contratos no pueden distinguir de las salidas que solo tienen tokens fungibles. Se retiró dos días después de su publicación.
spec: https://gitlab.com/0353F40E/nfta/-/blob/master/readme.md
discussion: https://bitcoincashresearch.org/t/retracted-chip-2026-06-cashtokens-ft-nft-ambiguity-fix/1870
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: RETIRADA CHIP-2026-06 CashTokens Corrección de la ambigüedad FT+NFT (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/retracted-chip-2026-06-cashtokens-ft-nft-ambiguity-fix/1870
translation:
  sourceHash: 5b5f61bca4a0ed83
  status: machine
  translator: Claude
---

## Resumen

Con los opcodes (códigos de operación) de introspección de [CashTokens](/chips/chip-2022-02-cashtokens), un UTXO que contiene a la vez una cantidad de tokens fungibles
y un NFT inmutable con un compromiso de cero bytes se ve igual que un UTXO que solo contiene los tokens fungibles. Este
CHIP de mantenimiento proponía una regla de consenso que prohibiera nuevas salidas con esa combinación. Las existentes seguirían
siendo gastables, pero tendrían que dividirse al gastarse.

## Motivación

El autor buscaba “preparar el futuro”: que un contrato pudiera comprometerse con una transacción completa, usando bucles e
introspección, sin que se filtraran estos bits “invisibles”. Un análisis de la blockchain (cadena de bloques) encontró la combinación solo unas pocas
veces.

## Estado actual

**Retirada.** Publicada el 14 de junio de 2026 y retirada el 16 de junio de 2026. El motivo del autor: la corrección “no es realmente gratis” (traducción nuestra). Trasladaría
deuda técnica a los desarrolladores de billeteras, que tendrían que manejar este caso límite al fusionar los saldos de un usuario en menos
UTXOs. En la discusión se señaló que los emisores pueden evitar el problema si nunca emiten NFTs nulos, aunque
los contratos que no distinguen categorías, como TapSwap, aún podrían verse afectados.

Nota: esta propuesta comparte el prefijo “CHIP-2026-06” con las propuestas no relacionadas [OP_SIGHASH](/chips/chip-2026-06-op-sighash) y
[Post-Quantum Signatures](/chips/chip-2026-06-post-quantum-hybrid-signatures).
