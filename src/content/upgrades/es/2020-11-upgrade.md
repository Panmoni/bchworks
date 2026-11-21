---
title: 'Noviembre de 2020: ajuste de dificultad ASERT (y la división de ABC)'
date: 2020-11-15T12:00:00.000Z
status: activated
height: 661648
summary: Reemplazó el DAA de 2017 por ASERT (aserti3-2d) y puso fin a las oscilaciones diarias de la dificultad. El conjunto de reglas rival de Bitcoin ABC, con un impuesto del 8 % sobre la coinbase, se separó casi sin poder de hash.
keywords:
  - november 2020 upgrade
  - asert
  - aserti3-2d
  - bitcoin cash difficulty algorithm
  - bch abc split
  - axion upgrade
  - ecash split
chips: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2020-NOV-15 Network Upgrade Specification (especificaciones de actualizaciones de BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2020-11-15-upgrade/
  - title: 2020-NOV-15 ASERT Difficulty Adjustment Algorithm (aserti3-2d)
    url: https://upgradespecs.bitcoincashnode.org/2020-11-15-asert/
  - title: Bitcoin Cash Node chainparams.cpp (bloque ancla de ASERT)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
  - title: Bitcoin Cash Has Split Into Two New Blockchains, Again (CoinDesk)
    url: https://www.coindesk.com/markets/2020/11/15/bitcoin-cash-has-split-into-two-new-blockchains-again
  - title: 'Bitcoin Cash Hard Fork: Here''s What Happened (Decrypt)'
    url: https://decrypt.co/48409/bitcoin-cash-hard-fork-heres-what-happened
  - title: BCHA has been rebranded to eCash (Bitcoin ABC)
    url: https://www.bitcoinabc.org/bcha/
translation:
  sourceHash: 937c10e04f8ec3af
  status: machine
  translator: Claude
  qaHash: b1695f2240a0e973
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1605441600`
(15 de noviembre de 2020, 12:00 UTC). El bloque 661.647 fue el último bajo el algoritmo anterior y sirve como ancla de ASERT.
El bloque 661.648 es el primero cuya dificultad calcula ASERT. El código de Bitcoin Cash Node llama a esta actualización “Axion”.

El único cambio de consenso: **el algoritmo de ajuste de dificultad pasó a ser ASERT** (`aserti3-2d`), diseñado por Mark
Lundeberg y especificado por freetrader, Jonathan Toomim, Calin Culianu y Mark Lundeberg. Consulta [ASERT](/glossary#asert-daa).

Cómo funciona, en una línea: el objetivo de cada bloque se calcula a partir del bloque ancla. Si la cadena va adelantada respecto al calendario ideal
de 10 minutos, la dificultad sube de forma exponencial; si va atrasada, baja. La vida media es de 172.800 segundos (dos días). Así,
si los bloques van dos días completos atrasados respecto al calendario, la dificultad se reduce a la mitad.

## Por qué

La especificación de ASERT plantea el problema sin rodeos. El DAA de 2017 usaba una media móvil simple, y eso causaba una oscilación
diaria. La dificultad bajaba, los mineros que cambian de cadena llegaban en masa, seguía una ráfaga de bloques rápidos, luego se iban y los bloques
avanzaban a paso lento. Los usuarios veían largas esperas seguidas de ráfagas de bloques casi vacíos, así que el tiempo medio de confirmación aumentó.

Los objetivos de ASERT, según la especificación:

- Eliminar las oscilaciones periódicas de la dificultad y de la tasa de hash (hashrate).
- Reducir la diferencia de rentabilidad entre los mineros constantes y los que cambian de cadena.
- Mantener los intervalos medios entre bloques cerca de 10 minutos.
- Acercar el tiempo medio de confirmación al objetivo.

En simulaciones frente a otros candidatos, ASERT obtuvo la mejor puntuación en esos criterios.

## La división

Bitcoin ABC, entonces uno de los equipos de nodos, publicó un conjunto de reglas distinto para esta fecha. Exigía que el 8 % de cada recompensa
por bloque fuera a una dirección que controlaba (la “regla de la coinbase”). Bitcoin Cash Node y la mayoría de los mineros la rechazaron. Más del 80 %
de los mineros había estado señalizando apoyo a BCHN antes de la división, y la cadena de ABC casi no obtuvo poder de hash. La cadena de ABC cotizó
como BCHA y cambió su nombre a eCash (XEC) el 1 de julio de 2021. La cadena de BCH es la que sigue las reglas de esta página.

## Qué hace posible

- **Confirmaciones más estables.** Desapareció el ciclo diario de bloques lentos y luego rápidos.
- **Minería justa.** Los mineros leales ya no están en desventaja frente a los que cambian de cadena para aprovechar las ventanas de dificultad baja.
- **Una fórmula simple y sin estado.** Un nodo solo necesita el bloque ancla y el bloque actual para calcular la dificultad.
  No hay ninguna ventana que manipular ni errores de redondeo que se acumulen con el tiempo.
- **Una base para bloques más rápidos.** La propuesta [Faster Blocks CHIP](/chips/chip-2025-03-faster-blocks) mantiene ASERT y
  lo reescala para un objetivo de 1 minuto.
