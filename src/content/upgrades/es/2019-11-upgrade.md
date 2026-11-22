---
title: 'Noviembre de 2019: multifirma Schnorr y MINIMALDATA'
date: 2019-11-15T12:00:00.000Z
status: activated
height: 609136
summary: OP_CHECKMULTISIG obtuvo el modo Schnorr, y el apilado mínimo de datos y la codificación mínima de números pasaron a ser reglas de consenso.
keywords:
  - november 2019 upgrade
  - schnorr multisig
  - minimaldata
  - bitcoin cash graviton
  - checkmultisig schnorr
chips: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2019-NOV-15 Network Upgrade Specification (BCHN upgrade specs)
    url: https://upgradespecs.bitcoincashnode.org/2019-11-15-upgrade/
  - title: 2019-NOV-15 Schnorr multisig specification
    url: https://upgradespecs.bitcoincashnode.org/2019-11-15-schnorrmultisig/
  - title: 2019-NOV-15 MINIMALDATA specification
    url: https://upgradespecs.bitcoincashnode.org/2019-11-15-minimaldata/
  - title: Bitcoin Cash Node chainparams.cpp (gravitonHeight)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: f4080578632a954f
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1573819200`
(15 de noviembre de 2019, 12:00 UTC). El primer bloque con las nuevas reglas es el de altura 609136. El código de Bitcoin Cash Node llama
a esta actualización “Graviton”.

Cambios de consenso:

- **Multifirma Schnorr.** [`OP_CHECKMULTISIG`](/opcodes/op_checkmultisig) y
  [`OP_CHECKMULTISIGVERIFY`](/opcodes/op_checkmultisigverify) aceptan firmas [Schnorr](/glossary#schnorr-signatures). El elemento de pila
  “ficticio” sin uso que la multifirma siempre consumía se reaprovecha. Cuando no está vacío, el opcode (código de operación) se ejecuta en
  modo Schnorr, y el elemento ficticio se convierte en un campo de bits que indica qué claves públicas firmaron.
- **MINIMALDATA.** Cada operación ejecutada que apila datos debe usar el opcode de apilado más pequeño, y cada número debe usar su codificación
  mínima. Esto ya era una regla de estandaridad (de retransmisión). Ahora es de consenso.

## Por qué

- **Completar el despliegue de Schnorr.** La [actualización de mayo de 2019](/upgrades/2019-05-upgrade) añadió Schnorr solo a las verificaciones
  de firma única. La multifirma quedó para después porque necesitaba una nueva forma de emparejar firmas con claves.
- **Verificaciones de multifirma más rápidas.** Con el campo de bits, el nodo sabe exactamente qué clave corresponde a cada firma. En modo
  ECDSA puede tener que probar varias claves por firma.
- **Acabar con la maleabilidad.** Las operaciones de apilado no mínimas permitían que un tercero cambiara los bytes de una transacción (y su ID) sin
  invalidarla. Convertir MINIMALDATA en regla de consenso cierra esa puerta para siempre.

## Qué permite

- **Schnorr para billeteras compartidas y depósitos en garantía.** Las configuraciones M de N, como una billetera empresarial 2 de 3 o un depósito en garantía con un
  árbitro, pueden usar firmas más pequeñas y de tamaño fijo.
- **ID de transacción estables.** Los contratos y las apps que encadenan transacciones sin confirmar dependen de que los ID no cambien. Esta
  actualización eliminó una forma más de que cambien.
- **Una contabilidad más limpia para límites posteriores.** El campo de bits de la multifirma permitió que la
  [regla SigChecks de mayo de 2020](/upgrades/2020-05-upgrade) contara la multifirma en modo Schnorr como M verificaciones en lugar de N.
