---
title: Algoritmo de límite adaptativo de tamaño de bloque (ABLA)
code: CHIP-2023-04
owners:
  - bitcoincashautist
status: activated
upgrade: 2024-05-abla
summary: Reemplaza el límite fijo de tamaño de bloque de 32 MB por un algoritmo que eleva el límite a medida que crece la demanda sostenida, y mantiene 32 MB como mínimo.
spec: https://gitlab.com/0353F40E/ebaa
discussion: https://bitcoincashresearch.org/t/chip-2023-04-adaptive-blocksize-limit-algorithm-for-bitcoin-cash/1037
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Bitcoin Verde
    position: support
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: BCHD
    position: neutral
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Paytaca Wallet
    position: support
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Cashonize
    position: support
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Selene
    position: support
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Electron Cash
    position: neutral
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Coin Wallet
    position: oppose
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Bmap.app
    position: oppose
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Memo Technology, Inc.
    position: oppose
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: The Real Bitcoin Club
    position: oppose
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - name: Toomim Bros Bitcoin Mining Concern Ltd.
    position: neutral
    source: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP-2023-04 Adaptive Blocksize Limit Algorithm for Bitcoin Cash
    url: https://gitlab.com/0353F40E/ebaa
  - title: 'CHIP-2023-04: respuestas de las partes interesadas'
    url: https://gitlab.com/0353F40E/ebaa/-/blob/main/stakeholders.md
  - title: 2024-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2024-05-15-upgrade/
translation:
  sourceHash: 0775fa7cc19ec820
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

ABLA recalcula el límite de tamaño de bloque después de cada bloque, a partir de una media móvil ponderada exponencialmente de los tamaños de los bloques recientes. El límite de 32 MB se mantiene como un mínimo “de reserva”; cualquier aumento es “un extra por encima de eso, sostenido por la carga real de transacciones” (traducción nuestra). Consulta [ABLA](/glossary#abla).

## Motivación

Según el CHIP: “Tener que coordinar aumentos manuales del límite de tamaño de bloque de Bitcoin Cash impone un metacosto a todos los participantes de la red. La necesidad de llegar a acuerdos con regularidad hace que la red sea vulnerable a ataques sociales” (traducción nuestra).

El algoritmo cambia el comportamiento por defecto. Hoy, el comportamiento por defecto es “no hacer nada hasta que se decida algo”. El nuevo es “ajustar según este algoritmo (hasta que se decida otra cosa, si hace falta)” (traducción nuestra). El CHIP busca tener “un impacto mínimo o nulo en la teoría de juegos y los incentivos que Bitcoin Cash tiene hoy” (traducción nuestra).

## Qué especifica

- Una **función de control** sigue los tamaños de bloque con un factor de olvido. Su entrada se amplifica con un **factor de asimetría** (ζ = 1,5), de modo que el límite solo sube con una carga sostenida por encima de un umbral y vuelve a bajar cuando la carga disminuye.
- Un **búfer elástico** añade margen cuando la función de control sube rápido. El búfer propuesto puede “tomar prestado” alrededor de un año de crecimiento (por ejemplo, un 2× rápido en unos pocos meses) y luego decae con una vida media de aproximadamente medio año.
- El límite es el tamaño de bloque de control más el búfer, nunca por debajo de 32 MB.

El CHIP modela un ataque de spam por parte de un minero con el 50 % de la tasa de hash (hashrate) que llena sus propios bloques. Tardaría alrededor de 1,5 años en duplicar el límite y 2,5 años más en lograr otro +50 %, mientras los costos siguen subiendo.

## Estado actual

Aceptado y activado el 15 de mayo de 2024. La tabla de partes interesadas registra 60 aprobaciones, 8 neutrales y 4 rechazos. En la consulta, la falta de respuesta se contó como neutral.

Hasta ahora, el algoritmo no ha elevado el límite en la práctica, porque los bloques actuales están muy por debajo de 32 MB. El [CHIP de bloques más rápidos](/chips/chip-2025-03-faster-blocks) propuesto reescalaría ABLA a 1/10 por bloque para que la capacidad de procesamiento por minuto se mantenga igual.
