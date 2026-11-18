---
title: 'Mayo de 2020: SigChecks y OP_REVERSEBYTES'
date: 2020-05-15T12:00:00.000Z
status: activated
height: 635259
summary: Reemplazó el conteo de SigOps por SigChecks, que cuenta las comprobaciones de firma que realmente se ejecutan, y añadió OP_REVERSEBYTES.
keywords:
  - may 2020 upgrade
  - sigchecks
  - op_reversebytes
  - bitcoin cash phonon
  - sigops limit
chips: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2020-MAY-15 Network Upgrade Specification (BCHN upgrade specs)
    url: https://upgradespecs.bitcoincashnode.org/2020-05-15-upgrade/
  - title: 2020-MAY-15 SigChecks specification
    url: https://upgradespecs.bitcoincashnode.org/2020-05-15-sigchecks/
  - title: OP_REVERSEBYTES specification
    url: https://upgradespecs.bitcoincashnode.org/2020-05-15-op_reversebytes/
  - title: Bitcoin Cash Node chainparams.cpp (phononHeight)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: 5260693752b4aa34
  status: machine
  translator: Claude
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1589544000`
(15 de mayo de 2020, 12:00 UTC). El primer bloque con las nuevas reglas es el de altura 635.259. El código de Bitcoin Cash Node llama a esta
actualización “Phonon”.

Cambios de consenso:

- **SigChecks reemplaza a SigOps.** La regla anterior contaba los opcodes (códigos de operación) de firma escaneando los scripts. La nueva regla cuenta las
  comprobaciones de firma que un script realmente realiza mientras se ejecuta. Un bloque puede contener como máximo un SigCheck por cada 141 bytes de
  tamaño máximo de bloque (226.950 para un límite de 32 MB). Las transacciones y las entradas también tienen sus propios límites.
  Consulta [SigChecks](/glossary#sigchecks).
- **[`OP_REVERSEBYTES`](/opcodes/op_reversebytes).** Un nuevo opcode que invierte el orden de los bytes de un elemento de la pila. Sirve
  sobre todo para pasar de little-endian a big-endian y viceversa.

Cambios de política (no de consenso): los límites predeterminados de ancestros y descendientes sin confirmar en la mempool pasaron de
25 a 50.

## Por qué

La especificación de SigChecks explica el problema. Las SigOps se evaluaban analizando los scripts, no ejecutándolos. El script que
crea una moneda y el script que la gasta están en transacciones distintas, pero el trabajo de CPU solo ocurre al
gastar. Así, un bloque podía puntuar alto en SigOps y ser barato de verificar, o puntuar bajo y ser costoso.

SigChecks cuenta el trabajo real, en la transacción que gasta, en el momento en que ocurre. Eso hace que el límite se ajuste al
costo que pretende limitar.

`OP_REVERSEBYTES` (especificación de Tobias Ruck) resuelve un problema práctico. El protocolo de Bitcoin es casi todo little-endian, pero
muchos protocolos externos son big-endian, incluido el estándar de tokens Simple Ledger Protocol (SLP). Los oráculos que firman datos
para `OP_CHECKDATASIG` pueden usar cualquiera de los dos órdenes. Antes de este opcode, los contratos tenían que invertir los bytes con una larga cadena de
`OP_SPLIT`, `OP_SWAP` y `OP_CAT`.

## Qué permite

- **Límites más justos y seguros.** Los mineros y los operadores de nodos obtienen un límite contra DoS que sigue el costo real de CPU. Los autores de contratos
  ya no son penalizados por opcodes de firma que nunca se ejecutan.
- **El orden de bytes en un solo opcode.** Los contratos pueden leer cantidades de tokens en big-endian y datos de oráculos sin reordenar bytes
  a mano. La especificación menciona los exchanges descentralizados de SLP y los contratos de reparto de ingresos como casos de uso.
- **Cadenas sin confirmar más largas** por defecto (50 en lugar de 25). Más tarde, el límite de cadena se
  [eliminó por completo en 2021](/upgrades/2021-05-upgrade).
