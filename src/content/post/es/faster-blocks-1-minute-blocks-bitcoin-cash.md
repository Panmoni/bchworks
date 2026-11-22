---
publishDate: 2026-10-01T00:00:00.000Z
draft: false
title: 'Bloques más rápidos: qué cambiarían los bloques de 1 minuto en Bitcoin Cash'
excerpt: CHIP-2025-03 reduciría el tiempo de bloque de Bitcoin Cash de 10 minutos a 1. Qué cambia, qué se mantiene igual, quién lo apoya, quién no y cuándo se decide.
category: Upgrades
tags:
  - faster blocks
  - upgrades
  - chips
author: Cash Marlowe
metadata:
  title: 'Bloques más rápidos: los bloques de 1 minuto en Bitcoin Cash, explicados'
  description: CHIP-2025-03 llevaría Bitcoin Cash a bloques de 1 minuto en mayo de 2027. Qué cambia, qué no, los argumentos a favor y en contra, y el cierre del 15 de noviembre.
translation:
  sourceHash: 2275643202fafab7
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

Bitcoin Cash produce un bloque aproximadamente cada 10 minutos. Una propuesta llamada [Bloques más rápidos (CHIP-2025-03)](/chips/chip-2025-03-faster-blocks) lo reduciría a 1 minuto, a partir de la actualización de mayo de 2027.

Es la mayor cuestión abierta en BCH en este momento. **No está cerrada**. La ventana de decisión es alrededor del 15 de noviembre de 2026.

Esto es lo que cambiaría, lo que no y en qué punto está el debate.

## La versión corta

Los bloques llegarían 10 veces más seguido. Todo lo que está ligado a un bloque se reduciría a una décima parte: la recompensa por bloque, la dificultad y el límite de tamaño de bloque. Así que, por hora, nada cambia en cuanto a emisión o capacidad. Lo que cambia es cuánto esperas una confirmación.

## Qué cambia

- **Las confirmaciones llegan más rápido.** Hoy, aproximadamente 1 de cada 4 primeras confirmaciones tarda más de 14 minutos. Con bloques de 1 minuto, el 95 % llegaría en menos de 3 minutos, según el CHIP.
- **Las esperas largas se vuelven más estables.** Una espera de 60 minutos formada por 60 bloques de un minuto termina en menos de 73 minutos el 95 % de las veces. Con seis bloques de 10 minutos, hay un 20 % de probabilidad de esperar más de 79 minutos.
- **Los encabezados de bloque crecen 10×**, de unos 4,2 MB a unos 42 MB al año. Una propuesta complementaria, [Verificación simplificada de encabezados](/chips/chip-2026-02-simplified-header-verification), permite que las billeteras ligeras guarden en su lugar una prueba de tamaño fijo.
- **La mediana del tiempo pasado** (un reloj que usan los contratos y los locktimes) se reduce de unos 110 minutos a unos 11.

## Qué se mantiene igual

- **La oferta de 21 millones y el calendario del halving.** La emisión por hora no cambia, y los halvings se mantienen en sus fechas originales.
- **La capacidad de procesamiento por hora.** El límite de tamaño de bloque se reduce a 1/10 por bloque, así que los bytes por minuto son los mismos.
- **Los bloqueos temporales de los contratos existentes.** Los locktimes escritos para bloques de 10 minutos conservan su significado. El CHIP reexpresa las reglas basadas en altura en “ticks” de un segundo de tiempo objetivo.
- **Las comisiones.** Las comisiones se cobran por byte, no por bloque. Los bloques más rápidos no cambian lo que cuesta un pago.
- **Pagos en segundos.** La mayoría de los pagos en BCH ya aparecen en segundos, antes de cualquier bloque. Eso no cambia.

## Por qué hacerlo

El argumento del CHIP es que los bloques de 10 minutos son un costo real, no un valor por defecto neutral. Muchos pagos ya se liquidan en segundos. Pero los exchanges, las transacciones marcadas y las billeteras multimoneda todavía esperan bloques, y esos usuarios notarían la diferencia de inmediato. El autor también señala que, excluyendo Bitcoin, BCH tiene los bloques más lentos entre las principales monedas y entre las cadenas UTXO de prueba de trabajo.

## Por qué no, o todavía no

Las declaraciones se abrieron en Bitcoin Cash Research el 15 de septiembre. El 26 de septiembre, el recuento público era de 9 a favor, 2 neutrales y 3 en contra. Ese recuento solo cubre las declaraciones publicadas hasta ahora; a muchas organizaciones todavía no se les había preguntado.

Las objeciones que más pesan:

- **Madurez del código.** Calin Culianu, desarrollador principal de Bitcoin Cash Node, la desaprueba “por ahora”. Dice que el código “no está listo y probablemente tenga bugs nuevos y emocionantes” (traducción nuestra).
- **Las prisas.** General Protocols se mantiene neutral hasta que expertos revisen los costos y riesgos: “el costo de apresurar una propuesta supera con creces el costo de no lanzar una actualización para 2027” (traducción nuestra).
- **“Si no está roto, no lo arregles.”** Richard Brady (cashflow.dev, Coinbooth, ParyonUSD) y otros no ven una necesidad urgente.
- **Clientes ligeros y crecimiento de los encabezados.** Tom Zander (Flowee) planteó inquietudes sobre las billeteras SPV (verificación simplificada de pagos).

Del lado a favor están el Bitcoin Cash Podcast, Selene Wallet, BCH-1, Paytaca, Mainnet.cash, TapSwap y otros. Joemar Taganna, de Paytaca, pasó de “desaprobar por ahora” a apoyarla el 26 de septiembre. La lista completa, con una fuente para cada postura, está en la [página del CHIP](/chips/chip-2025-03-faster-blocks).

## El calendario

| Fecha | Qué ocurre |
|---|---|
| ~15 de noviembre de 2026 | Cierre de la actualización de mayo de 2027 |
| 15 de noviembre de 2026 | Activación propuesta en chipnet (la red de pruebas de los CHIPs) |
| 15 de mayo de 2027 | Activación propuesta en la red principal, cerca del bloque 1003670 |
| Mayo de 2028 | Fecha más temprana en la red principal si se retrasa un año |

También es posible un año sin cambios de consenso. BCH ha lanzado una actualización cada mayo, pero nada lo exige.

## Qué significaría para ti

- **Si guardas o pagas:** no tienes que hacer nada. Las billeteras que siguen la actualización de la red siguen funcionando, y los pagos siguen apareciendo en segundos.
- **Comercios y exchanges:** las confirmaciones llegan más rápido. Quizás quieras aumentar tu número de confirmaciones, ya que cada bloque cubre menos tiempo.
- **Mineros:** recompensas más pequeñas por bloque, 10 veces más bloques. Los ingresos por hora no cambian. Las tasas de huérfanos se modelan en 0,41–1,94 %, por debajo del límite del 2 % del CHIP.
- **Desarrolladores:** los bloqueos temporales existentes conservan su significado. Los contratos nuevos que cuentan bloques deberían contar en la nueva unidad.

Actualizaremos esta publicación cuando se tome la decisión de cierre. Sigue la [página de la actualización de 2027](/upgrades/2027-05-upgrade) para la cuenta regresiva.

*Cash Marlowe es el seudónimo editorial de BCH Works. Editado por George Donnelly.*
