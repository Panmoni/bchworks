---
title: Varios OP_RETURNs para Bitcoin Cash
code: CHIP-2021-03-12
owners:
  - Benjamin Scherrey
  - Jonathan Silverblood
  - BigBlockIfTrue
status: activated
upgrade: 2021-05-upgrade
summary: Convirtió en estándar las transacciones con más de una salida de datos OP_RETURN, manteniendo el límite total de 223 bytes.
spec: https://github.com/ActorForth/Auction-Protocol/blob/main/CHIP-2021-03-12_Multiple_OP_RETURN_for_Bitcoin_Cash.md
discussion: https://bitcoincashresearch.org/t/multiple-op-returns-this-time-for-real/315
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: Multiple OP_RETURNs for Bitcoin Cash (BCHN upgrade specs copy)
    url: https://upgradespecs.bitcoincashnode.org/CHIP-2021-03-12_Multiple_OP_RETURN_for_Bitcoin_Cash/
  - title: 2021-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2021-05-15-upgrade/
translation:
  sourceHash: a455e9e6ed8913ab
  status: machine
  translator: Claude
---

## Resumen

Antes de mayo de 2021, una transacción estándar solo podía llevar una salida de datos [`OP_RETURN`](/glossary#op-return). Este
CHIP permite que una transacción lleve varias. El límite existente de 223 bytes ahora se aplica al total de todas ellas.

Benjamin Scherrey fue el responsable del documento, Jonathan Silverblood tuvo el concepto previo y BigBlockIfTrue escribió la
especificación técnica. Se publicó por primera vez en el repositorio del protocolo de subastas de ActorForth.

## Motivación

`OP_RETURN` es el lugar acordado para los datos que los nodos pueden ignorar y que nunca necesitan guardar en el conjunto UTXO. Cada uno de los protocolos construidos
sobre él (tokens, apps sociales, subastas) quiere su propia salida. Con solo una permitida, dos protocolos no podían compartir
una misma transacción. La solución alternativa, guardar datos en salidas gastables, infla el conjunto UTXO, algo que el CHIP describe como
una alternativa indeseable.

Los autores mantuvieron sin cambios el tope de bytes a propósito. Se mantuvieron “en silencio” sobre si 223 bytes es la cifra correcta, para que el
cambio fuera lo más pequeño y de menor riesgo posible, y fácil de acordar para mayo de 2021.

## Qué especifica

- Las transacciones con varias salidas `OP_RETURN` son estándar.
- El límite de 223 bytes se aplica a todas las salidas `OP_RETURN` de la transacción en conjunto.
- Solo es una regla de política. No cambió ninguna regla de consenso.

## Estado actual

Se activó con la [actualización de mayo de 2021](/upgrades/2021-05-upgrade). Más tarde,
el [CHIP P2S](/chips/chip-2024-12-p2s) (2026) mantuvo la misma regla acumulativa de 223 bytes para las salidas de datos.
