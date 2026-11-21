---
title: Límite de cadena de transacciones sin confirmar
code: CHIP (unnumbered, 2021)
owners:
  - Josh Green (Software Verde)
  - John Jamiel (Software Verde)
  - Doug McCollough (City of Dublin, OH)
  - Emil Oldenburg (Bitcoin.com)
  - Mark Lamb (CoinFLEX)
status: activated
upgrade: 2021-05-upgrade
summary: Se eliminó el límite de la política de retransmisión de 50 transacciones sin confirmar encadenadas, para que las apps puedan enviar pagos dependientes sin esperar un bloque.
spec: https://github.com/softwareverde/bitcoin-cash-chips/blob/master/unconfirmed-transaction-chain-limit.md
discussion: https://bitcoincashresearch.org/t/chip-unconfirmed-transaction-chain-limit/302
stakeholders:
  - name: Software Verde
    position: support
    source: https://upgradespecs.bitcoincashnode.org/unconfirmed-transaction-chain-limit/
  - name: Bitcoin.com
    position: support
    source: https://upgradespecs.bitcoincashnode.org/unconfirmed-transaction-chain-limit/
  - name: CoinFLEX
    position: support
    source: https://upgradespecs.bitcoincashnode.org/unconfirmed-transaction-chain-limit/
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: Unconfirmed Transaction Chain Limit (BCHN upgrade specs copy, v1.2)
    url: https://upgradespecs.bitcoincashnode.org/unconfirmed-transaction-chain-limit/
  - title: 2021-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2021-05-15-upgrade/
translation:
  sourceHash: 94a1d1cc6f9d3578
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Antes de mayo de 2021, los nodos retransmitían una cadena de 50 transacciones sin confirmar como máximo, cada una gastando una salida de la
anterior. Todo lo que pasaba del eslabón 50 solía descartarse, aunque fuera válido. Este CHIP eliminó el límite por completo
en la [actualización de mayo de 2021](/upgrades/2021-05-upgrade).

Es un cambio en la política de retransmisión, no un cambio de consenso. No cambió ninguna regla de validez de bloques.

## Motivación

El CHIP enumera los problemas:

- Una transacción difundida no se puede retirar. Si la red la ignora, el dinero queda en el limbo.
- Los nodos solían rechazar en silencio las transacciones que superaban el límite, y las billeteras no podían saber qué tan larga era ya una cadena.
- Los intervalos largos entre bloques empeoraban la situación.
- El límite servía sobre todo para Child-Pays-For-Parent, que, según una investigación de Tom Zander, casi no se usaba en BCH.

Los casos de los propios autores: fallaron los pagos de dividendos en tokens de CoinFLEX; en una beta de identidad de la ciudad de Dublín fallaron los registros;
los nuevos usuarios en encuentros chocaban con el límite al pasarse monedas entre sí.

## Qué especifica

Una vez que la [mediana del tiempo pasado](/glossary#median-time-past) alcanza `1621080000` (15 de mayo de 2021, 12:00 UTC), se elimina el límite de la política
de 50 ancestros o descendientes sin confirmar. La eliminación sigue vigente aunque una reorganización haga retroceder la cadena
por debajo de ese momento.

El CHIP advierte que el cambio debe coordinarse: si los nodos retransmiten cadenas distintas, los comercios que aceptan
pagos [0-conf](/glossary#zero-conf) (transacción sin confirmar) enfrentan un mayor riesgo de doble gasto.

## Estado actual

Activado el 15 de mayo de 2021. Las partes interesadas que figuran son las organizaciones cuyos integrantes son coautores del CHIP.
