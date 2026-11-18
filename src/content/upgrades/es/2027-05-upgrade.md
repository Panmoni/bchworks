---
title: Actualización de mayo de 2027 (aún sin decidir)
date: 2027-05-15T12:00:00.000Z
status: proposed
summary: Todavía no hay nada fijado. El principal candidato es CHIP-2025-03 Faster Blocks (bloques de 1 minuto). La decisión de fijación se toma hacia el 15 de noviembre de 2026; 2027 también podría llegar sin cambios de consenso.
keywords:
  - may 2027 upgrade
  - bitcoin cash 2027 upgrade
  - 1 minute blocks
  - faster blocks bch
  - bitcoin cash block time
  - chip-2025-03
  - bch lock-in november 2026
chips:
  - chip-2025-03-faster-blocks
  - chip-2026-06-op-sighash
  - chip-2025-01-txv5
  - chip-2025-05-elliptic-curve-arithmetic
  - chip-2026-06-post-quantum-hybrid-signatures
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: Bitcoin Cash Node chainparams.cpp (upgrade2027ActivationTime, 'tentative')
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
  - title: CHIP-2025-03 Faster Blocks for Bitcoin Cash
    url: https://gitlab.com/0353F40E/fablous
  - title: 'CHIP-2025-03 Faster Blocks: gathering statements of support (and dissent)'
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-gathering-statements-of-support-and-dissent/2095
  - title: CHIP-2025-03 Faster Blocks stakeholder responses
    url: https://gitlab.com/0353F40E/fablous/-/blob/master/stakeholders.md
  - title: 2027 protocol upgrade ideas (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/2027-protocol-upgrade-ideas/1719
  - title: CHIP-2026-06 OP_SIGHASH (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2026-06-op-sighash/1869
  - title: CHIP-2025-01 TXv5 (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2025-01-txv5-transaction-version-5/1490
  - title: CHIP-2025-05 Native Elliptic Curve Arithmetic Operations (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2025-05-native-elliptic-curve-arithmetic-operations/1570
  - title: CHIP-2026-06 Post-Quantum and Hybrid Signatures (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2026-06-post-quantum-and-hybrid-signatures/1864
translation:
  sourceHash: 0d5f8e35014614a8
  status: machine
  translator: Claude
---

## Estado al 26 de septiembre de 2026

**No hay ningún CHIP fijado para mayo de 2027.** Esto es exactamente lo que está decidido y lo que no:

| Elemento | Estado |
|---|---|
| Fecha de la actualización | 15 de mayo de 2027, 12:00 UTC (MTP `1810382400`). El código de Bitcoin Cash Node la registra como hora de activación “tentativa”. |
| Fijación | Por convención, hacia el **15 de noviembre de 2026**, cuando Chipnet (la red de pruebas de los CHIPs) activa el CHIPs elegido con seis meses de antelación. |
| Faster Blocks (bloques de 1 minuto) | Propuesto. Se están recogiendo declaraciones de las partes interesadas. El código de los nodos no está terminado. |
| Otros CHIPs | Borradores. Ninguno se ha ganado un lugar con un apoyo claro. |
| Un año “sin cambios” | Posible. Algunos colaboradores han dicho que incluso podría demostrar disciplina. |

El `date` de esta página es la hora de activación tentativa. Cambiará a “fijada” solo si las versiones de los nodos
incluyen las reglas, y cuando lo hagan.

## El candidato principal: Faster Blocks

[CHIP-2025-03 Faster Blocks](/chips/chip-2025-03-faster-blocks), de bitcoincashautist, propone reducir el tiempo de bloque
objetivo de 10 minutos a **1 minuto**.

Lo que cambiaría, según el CHIP:

- Los bloques llegan 10 veces más a menudo. La recompensa por bloque, la dificultad y el límite de tamaño de bloque [ABLA](/glossary#abla) se reducen cada uno a
  1/10 por bloque, de modo que las monedas por hora y los bytes por minuto siguen igual.
- El suministro de 21 millones y el calendario de los halvings no cambian.
- Una nueva unidad, el “tick” (un segundo de tiempo objetivo), reexpresa las reglas basadas en la altura. Los bloqueos temporales de los contratos existentes conservan
  su significado.
- La [mediana del tiempo pasado](/glossary#median-time-past) se reduce de unos 110 a unos 11 minutos.
- El crecimiento de la cadena de cabeceras se multiplica por 10, de unos 4,2 a unos 42 MB al año.
- El CHIP estima tasas de bloques huérfanos del 0,41–1,94 %, por debajo de su tolerancia del 2 %.

La ventaja principal: el CHIP afirma que el 95 % de las primeras confirmaciones llegarían en menos de 3 minutos. Hoy, cerca del 25 % de
las confirmaciones individuales tarda más de 14 minutos.

Calendario propuesto: Chipnet el 15 de noviembre de 2026 (MTP `1794744000`), red principal el 15 de mayo de 2027.

## Cómo está el apoyo

La recogida de declaraciones comenzó el 15 de septiembre de 2026. Posiciones vistas hasta ahora (consulta la
[página de CHIP](/chips/chip-2025-03-faster-blocks) para ver las fuentes):

- **A favor:** The Bitcoin Cash Podcast, Selene Wallet, BCH-1, el CEO de Paytaca (que cambió de “en contra por ahora”
  el 26 de septiembre), Maxbit, Jonathan Silverblood, Kallisti.cash y otros.
- **Neutral o abstención:** General Protocols se abstuvo “hasta que se haya hecho una revisión suficiente de los costos y riesgos de la implementación” (traducción nuestra). Un desarrollador de OPTN Wallet, a título personal, respalda
  CHIP, pero es neutral sobre la activación hasta que el código esté listo.
- **En contra:** Calin Culianu, desarrollador principal de Bitcoin Cash Node, está en contra “por ahora”. Sus razones: el código
  no está listo y puede tener errores, y dividir los bloques actuales en 10 implica menos transacciones y menos trabajo por bloque.
  Flowee está en contra. Algunos usuarios se oponen con el argumento de “si no está roto, no lo arregles”.

La implementación de Bitcoin Cash Node está en una rama en desarrollo. El autor de CHIP dice que está casi terminada, a falta del
manejo del locktime y de las pruebas. La preparación de los nodos es la razón más común que da la gente para esperar.

**Qué significa esto:** los bloques de 1 minuto podrían fijarse este noviembre o pasar al ciclo de 2028. Todavía no hagas planes en función de ninguno
de los dos resultados.

## Otros borradores que mencionan 2027

- [CHIP-2026-06 OP_SIGHASH](/chips/chip-2026-06-op-sighash): un opcode (código de operación) que coloca en la pila el hash de firma de la transacción.
  Su autor sugirió mayo de 2027. El desarrollador principal de BCHN señaló problemas en la especificación, luego abrió una solicitud de fusión en BCHN
  que lo implementa y dijo que “quizá acabe recomendando que lo hagamos para 2027” (traducción nuestra).
- [CHIP-2025-01 TXv5](/chips/chip-2025-01-txv5): un nuevo formato de transacción con satoshis fraccionarios. Su autor propuso
  fijarlo en noviembre de 2026 y dijo que algunas partes más pequeñas podrían ir primero si el formato completo resulta demasiado disruptivo.
- [CHIP-2025-05 Elliptic Curve Arithmetic](/chips/chip-2025-05-elliptic-curve-arithmetic): `OP_ECADD` y `OP_ECMUL`.
  Al menos un colaborador conocido dijo que consideraría respaldar una versión bien especificada y con pruebas de rendimiento para 2027.
- [CHIP-2026-06 Post-Quantum and Hybrid Signatures](/chips/chip-2026-06-post-quantum-hybrid-signatures): borrador inicial.

Ninguno de ellos tiene una especificación congelada ni un impulso de las partes interesadas comparable al de Faster Blocks.
