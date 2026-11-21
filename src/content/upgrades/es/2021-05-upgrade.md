---
title: 'Mayo de 2021: sin límite de cadena, varios OP_RETURN'
date: 2021-05-15T12:00:00.000Z
status: activated
summary: 'Una actualización de la política de retransmisión: se eliminó el límite de 50 transacciones en las cadenas de transacciones sin confirmar, y una transacción puede llevar varias salidas OP_RETURN. No cambió ninguna regla de consenso.'
keywords:
  - may 2021 upgrade
  - unconfirmed transaction chain limit
  - multiple op_return
  - bitcoin cash chain limit removed
  - first chip upgrade
chips:
  - chip-unconfirmed-transaction-chain-limit
  - chip-2021-03-multiple-op-return
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2021-05-15 Network Upgrade Specification (especificaciones de la actualización BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2021-05-15-upgrade/
  - title: Unconfirmed Transaction Chain Limit CHIP
    url: https://upgradespecs.bitcoincashnode.org/unconfirmed-transaction-chain-limit/
  - title: Multiple OP_RETURNs for Bitcoin Cash CHIP
    url: https://upgradespecs.bitcoincashnode.org/CHIP-2021-03-12_Multiple_OP_RETURN_for_Bitcoin_Cash/
  - title: Bitcoin Cash Node chainparams.cpp (nota sobre la actualización de 2021)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: dba0b73104eae87f
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Qué cambió

Esta actualización entró en vigor a las 12:00 UTC del 15 de mayo de 2021 (tiempo Unix `1621080000`, medido según la
[mediana del tiempo pasado](/glossary#median-time-past)). Ambos cambios llegaron como [CHIPs](/chips) (Cash Improvement Proposals).

Solo cambió la **política de retransmisión**, no el consenso. El código fuente de Bitcoin Cash Node lo dice directamente: la actualización “era solo para reglas de retransmisión” (traducción nuestra), así que el nodo no registra una altura de activación para ella. Ningún bloque era inválido antes y válido después.
Por eso esta página no indica ninguna altura.

Dos cambios:

- **Se eliminó el [límite de cadena de transacciones sin confirmar](/chips/chip-unconfirmed-transaction-chain-limit).** Antes, los nodos
  retransmitían una cadena de como máximo 50 transacciones sin confirmar (cada una gastando la anterior). Las transacciones posteriores a la 50.ª
  a menudo se ignoraban, aunque fueran válidas.
- **[Varias salidas OP_RETURN](/chips/chip-2021-03-multiple-op-return).** Una transacción estándar ahora puede tener más
  de una salida de datos [`OP_RETURN`](/glossary#op-return). El límite existente de 223 bytes ahora se aplica al total de
  todas ellas.

## Por qué

**Límite de cadena.** Los autores del CHIP (Software Verde, con Bitcoin.com, CoinFLEX y la ciudad de Dublin, Ohio) describieron
el problema: una vez que se difunde una transacción, no se puede retirar, y una transacción más allá del eslabón 50 podía simplemente
desaparecer de la retransmisión, a menudo sin aviso. Sus casos reales: fallaron los pagos de dividendos en tokens de CoinFLEX; en una beta de Dublin Identity
fallaron los registros; usuarios nuevos en encuentros se pasaban monedas más rápido de lo que llegaban los bloques y chocaban con el límite. El CHIP
también señala que el límite servía sobre todo a Child-Pays-For-Parent, una función de comisiones que, según una investigación de Tom Zander, casi no se usaba
en BCH. El límite añadía complejidad a servicios y billeteras, y hacía menos fiable el [0-conf](/glossary#zero-conf) (transacción sin confirmar).

**Varios OP_RETURN.** Cada protocolo en la cadena quiere su propia salida `OP_RETURN`. Con solo una permitida, dos
protocolos no podían compartir una transacción. El CHIP mantuvo sin cambios el tope de bytes para que el riesgo fuera mínimo y la actualización
fácil de acordar.

## Qué permite

- **Envía tan rápido como quieras.** Un servicio puede lanzar cientos de pagos dependientes sin esperar un bloque.
- **Billeteras más simples.** Se acabó el seguimiento de la profundidad de la cadena y los errores de “espera una confirmación” al gastar rápido.
- **Combinación de protocolos.** Una transacción puede llevar datos de dos protocolos, uno junto al otro, por ejemplo una
  transferencia de tokens y un mensaje aparte de una aplicación. El CHIP se publicó primero en el repositorio del protocolo de subastas de ActorForth.

## Nota sobre el proceso

Esta actualización solo de política se coordinó en la misma fecha, el 15 de mayo, que las actualizaciones de consenso. El CHIP del límite de cadena advierte
por qué: si los nodos retransmiten cadenas distintas de transacciones sin confirmar, los comercios que aceptan 0-conf enfrentan más riesgo de doble gasto. Aun así, un nodo que no la adoptara no se habría separado de la red.
