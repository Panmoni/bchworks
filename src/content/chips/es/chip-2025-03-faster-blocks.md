---
title: Bloques más rápidos para Bitcoin Cash (bloques de 1 minuto)
code: CHIP-2025-03
owners:
  - bitcoincashautist
status: proposed
upgrade: 2027-05-upgrade
summary: Propone reducir el tiempo de bloque objetivo de 10 minutos a 1 minuto y ajustar la recompensa, la dificultad y el tamaño de bloque por bloque a 1/10, de modo que la emisión y la capacidad de procesamiento por hora sigan iguales. No está fijada.
spec: https://gitlab.com/0353F40E/fablous
discussion: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-for-bitcoin-cash/1513
stakeholders:
  - name: The Bitcoin Cash Podcast / BCH Bullet
    position: support
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/3
  - name: Selene Wallet
    position: support
    source: https://gitlab.com/0353F40E/fablous/-/blob/master/stakeholders.md
  - name: BCH-1
    position: support
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/11
  - name: Maxbit Digital Asset / Maxme
    position: support
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/26
  - name: Jonathan Silverblood
    position: support
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/31
  - name: Kallisti.cash (kzKallisti)
    position: support
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/33
  - name: Joemar Taganna (Paytaca)
    position: support
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/70
  - name: Mainnet.cash
    position: support
    source: https://gitlab.com/0353F40E/fablous/-/blob/master/stakeholders.md
  - name: TapSwap
    position: support
    source: https://gitlab.com/0353F40E/fablous/-/blob/master/stakeholders.md
  - name: General Protocols
    position: neutral
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/32
  - name: OPTN Wallet developer (personal view)
    position: neutral
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/73
  - name: Calin Culianu (BCHN lead developer)
    position: oppose
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/4
  - name: Tom Zander (Flowee)
    position: oppose
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/20
  - name: Richard Brady (cashflow.dev, Coinbooth, ParyonUSD)
    position: oppose
    source: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095/12
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP-2025-03 Faster Blocks for Bitcoin Cash (readme)
    url: https://gitlab.com/0353F40E/fablous
  - title: 'CHIP-2025-03: respuestas de las partes interesadas'
    url: https://gitlab.com/0353F40E/fablous/-/blob/master/stakeholders.md
  - title: CHIP-2025-03 Faster Blocks for Bitcoin Cash (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-for-bitcoin-cash/1513
  - title: 'CHIP-2025-03 Faster Blocks: gathering statements of support (and dissent)'
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095
  - title: 2027 protocol upgrade ideas (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/2027-protocol-upgrade-ideas/1719
  - title: Bitcoin Cash Node chainparams.cpp (upgrade2027ActivationTime)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: f2197bf239b04f97
  status: machine
  translator: Claude
---

## Resumen

“El CHIP propone reducir el tiempo de bloque objetivo de Bitcoin Cash de 10 minutos a 1 minuto para mejorar la velocidad de las transacciones, la fiabilidad y la experiencia de usuario” (traducción nuestra). La versión del autor en una sola frase: los bloques llegan 10 veces más a menudo, y la recompensa, la dificultad y el límite de tamaño por bloque se reducen cada uno a 1/10, “para que la emisión de monedas, la capacidad de procesamiento, ABLA, los bloqueos temporales y el DAA conserven su significado” (traducción nuestra).

Es la principal candidata para la [actualización de mayo de 2027](/upgrades/2027-05-upgrade). **No está fijada.**

## Motivación

El argumento central del CHIP: los bloques de 10 minutos tienen un costo real; no son un valor por defecto neutral.

- Hoy, según el CHIP, alrededor del 25 % de las confirmaciones simples tarda más de 14 minutos. Con bloques de 1 minuto, el 95 % llegaría en menos de 3 minutos.
- Las esperas de varias confirmaciones se vuelven más estables: un objetivo de 60 minutos (60 bloques de 1 minuto) se completa en menos de 73 minutos el 95 % de las veces, frente a un 20 % de probabilidad de superar los 79 minutos con 6 bloques de 10 minutos.
- [0-conf](/glossary#zero-conf) (transacción sin confirmar) cubre la mayoría de los pagos BCH. Pero en muchos casos hay que volver a esperar un bloque: transacciones marcadas, exchanges, billeteras multimoneda. El CHIP afirma que los usuarios actuales se benefician directamente, antes de cualquier nueva adopción.
- El autor sostiene que, excluyendo BTC, BCH tiene los bloques más lentos de todas las monedas principales y del conjunto de prueba de trabajo de UTXO.

## Qué especifica

- **Tiempo de bloque objetivo de 1 minuto.** La recompensa por bloque y la dificultad por bloque bajan a 1/10; la emisión por hora no cambia.
- **El calendario de 21 millones y el momento de los halvings no cambian.** Una salvaguarda de activación ancla los halvings a la cuadrícula original.
- **Ticks.** Una nueva unidad, un segundo de tiempo objetivo, reexpresa las reglas basadas en la altura. Un futuro cambio del tiempo de bloque sería una entrada en un calendario, no una reescritura del protocolo.
- **Bloqueos temporales.** `nLockTime` y `nSequence` en los contratos existentes se normalizan a la antigua escala de 10 minutos.
- **[ABLA](/glossary#abla)** se reescala a 1/10 por bloque, de modo que los bytes por minuto siguen siendo los mismos.
- **[ASERT](/glossary#asert-daa)** conserva sus propiedades de resistencia al timewarp.
- **La maduración de Coinbase, el parking de bloques y la finalización** se redefinen en ticks para mantener su significado en tiempo real (la finalización sigue en unos 120 minutos).
- **La [mediana del tiempo pasado](/glossary#median-time-past)** se reduce de unos 110 a unos 11 minutos.
- **El crecimiento de los encabezados** se multiplica por 10, de unos 4,2 a unos 42 MB por año. El CHIP lo combina con [Simplified Header Verification](/chips/chip-2026-02-simplified-header-verification) para que las billeteras ligeras puedan mantener una prueba de encabezados de tamaño fijo.
- **Las tasas de bloques huérfanos** se modelan entre 0,41 y 1,94 %, por debajo de la tolerancia del 2 % del CHIP.

Activación propuesta: chipnet (la red de pruebas de los CHIPs) en el MTP `1794744000` (15 de noviembre de 2026) y red principal en el MTP `1810382400` (15 de mayo de 2027). La rama master de Bitcoin Cash Node incluye la fecha de 2027 como tiempo de activación “provisional”. El CHIP estima el bloque de activación en la red principal cerca de la altura 1.003.670, pero es una estimación, no una altura fija.

## Estado actual (26 de septiembre de 2026)

- **Estado en el CHIP:** Propuesta. Última edición: 5 de septiembre de 2026.
- **Declaraciones:** la recopilación se abrió en Bitcoin Cash Research el 15 de septiembre de 2026, unos dos meses antes de la ventana de fijación del 15 de noviembre.
- **Implementación:** el trabajo de Bitcoin Cash Node está en una rama en desarrollo. El autor dijo que estaba casi terminado, a falta del manejo de locktime, correcciones del parking y actualizaciones de las pruebas.
- **Objeción principal:** la madurez del código. El desarrollador principal de BCHN, Calin Culianu, lo desaprueba “por ahora”: el código “no está listo y probablemente tenga bugs nuevos y emocionantes” (traducción nuestra), y dividir los bloques actuales entre 10 implica muchas menos transacciones y mucho menos trabajo por bloque. General Protocols se abstiene hasta que expertos revisen los costos y riesgos de la implementación, y afirma que “el costo de apresurar una propuesta supera con creces el costo de no lanzar una actualización en 2027” (traducción nuestra).
- **Otras objeciones:** “Si no está roto, no lo arregles” (Richard Brady y otros); preocupaciones sobre SPV (verificación simplificada de pagos) y el crecimiento de los encabezados (Tom Zander, Flowee). El autor del CHIP respondió a estas en los hilos, y en el hilo de declaraciones se publicó una reproducción independiente y una prueba de estrés de las cifras de seguridad del CHIP. Esta se describe a sí misma como “descriptiva, no prescriptiva”.
- **Cambios de postura:** Joemar Taganna (Paytaca) pasó de “desaprobar por ahora” a aprobar el 26 de septiembre de 2026.

El CHIP podría quedar fijado para mayo de 2027 o retrasarse un año. Si se retrasa, la activación más temprana sería en mayo de 2028. Las posturas indicadas arriba son solo las que aparecen en el archivo de partes interesadas del CHIP y en el hilo de declaraciones; muchas organizaciones de la lista de contacto del CHIP aún no habían sido contactadas.
