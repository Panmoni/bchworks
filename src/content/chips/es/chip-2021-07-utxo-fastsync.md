---
title: UTXO Fastsync
code: CHIP-2021-07
owners:
  - Josh Green
status: draft
summary: Propone una forma para que los nodos creen, compartan, verifiquen y carguen instantáneas del conjunto UTXO a través de la red P2P, de modo que los nodos nuevos puedan sincronizarse en horas en lugar de reprocesar toda la cadena.
spec: https://bitcoincashresearch.org/t/chip-2021-07-utxo-fastsync/502
discussion: https://bitcoincashresearch.org/t/chip-2021-07-utxo-fastsync/502
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP 2021-07 UTXO Fastsync (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2021-07-utxo-fastsync/502
  - title: 2027 protocol upgrade ideas (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/2027-protocol-upgrade-ideas/1719
translation:
  sourceHash: fd85239fbc8f8b42
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Esta propuesta “define un método para que los nodos generen, distribuyan, validen y consuman instantáneas UTXO a través de la red P2P de BCH” (traducción nuestra). Un nodo nuevo podría descargar una instantánea del conjunto [UTXO](/glossary#utxo) actual en lugar de procesar cada bloque desde 2009.

Es una propuesta de servicios entre pares. Por ahora no pide a los mineros que incluyan compromisos de los conjuntos UTXO, pero “allana el camino para compromisos UTXO en el futuro, si se desea” (traducción nuestra).

## Motivación

- Configuración más rápida: el CHIP dice que los nodos nuevos podrían unirse “en un par de horas (o menos), en lugar del promedio actual de más de 8 horas” (traducción nuestra).
- Escalado a largo plazo: combinadas con la poda de bloques, las instantáneas permiten que BCH mantenga los costos de los nodos en niveles manejables a medida que la cadena crece de gigabytes a terabytes.

## Qué especifica

Cómo generan los nodos las instantáneas, cómo los pares las anuncian y transfieren y cómo un nodo receptor valida una antes de usarla. La publicación original es la especificación (versión 0.1.1, julio de 2021).

## Estado actual

Borrador. La discusión seguía activa en 2026, incluidas ideas sobre pruebas de conocimiento cero para compromisos UTXO. El hilo “2027 protocol upgrade ideas” recoge una opinión general de que los compromisos UTXO no requieren cambios de consenso. No se encontraron declaraciones formales de las partes interesadas.
