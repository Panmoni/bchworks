---
title: Verificación simplificada de encabezados (SHV)
code: CHIP-2026-02
owners:
  - bitcoincashautist
status: draft
summary: Propone un compromiso Merkle Mountain Range sobre los encabezados de bloque para que las billeteras ligeras puedan verificar el historial de encabezados con un estado pequeño y de tamaño fijo, en lugar de descargar todos los encabezados.
spec: https://gitlab.com/0353F40E/mmr
discussion: https://bitcoincashresearch.org/t/chip-2026-02-simplified-header-verification-for-bitcoin-cash/1750
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 'CHIP-2026-02: Simplified Header Verification for Bitcoin Cash (Bitcoin Cash Research)'
    url: https://bitcoincashresearch.org/t/chip-2026-02-simplified-header-verification-for-bitcoin-cash/1750
  - title: CHIP-2025-03 Faster Blocks, sección “Deployment”
    url: https://gitlab.com/0353F40E/fablous
translation:
  sourceHash: d555f7f5cea06d08
  status: machine
  translator: Claude
---

## Resumen

SHV aplica a los encabezados de bloque la idea detrás de [SPV](/glossary#spv) (verificación simplificada de pagos). Un servidor mantiene un Merkle Mountain Range (MMR),
un acumulador de solo anexión sobre todos los encabezados, y puede demostrar cualquier encabezado pasado frente a la raíz más reciente. Una billetera ligera guarda
solo el estado más reciente del acumulador, O(log n) hashes, y puede extenderlo por sí misma a medida que llegan nuevos encabezados.

## Motivación

El autor encontró esta estructura de datos mientras trabajaba en [Bloques más rápidos](/chips/chip-2025-03-faster-blocks), que haría
crecer la cadena de encabezados 10×, de unos 4,2 a unos 42 MB por año. SHV hace que los datos de encabezados que una billetera ligera debe guardar
sean de tamaño fijo, sea cual sea la frecuencia de bloques. Es útil incluso si los tiempos de bloque nunca cambian.

El autor cita trabajos previos: el “History Tree” (Crosby y Wallach, 2009), más tarde llamado Merkle Mountain Range (Todd,
2012), y trabajos que lo describen como el acumulador óptimo para datos de solo anexión.

## Qué especifica

- Un MMR de la cadena de encabezados que los nodos pueden calcular y servir.
- Una extensión del protocolo P2P para raíces de encabezados y pruebas de Merkle.
- Una especificación de cliente, revisada en marzo de 2026 para protegerse de CVE-2012-2459 (problema de subárbol duplicado en la
  construcción del árbol de Merkle de Bitcoin), que de otro modo permitiría a un servidor mentir sobre la altura de un encabezado.

El CHIP de Faster Blocks enumera el trabajo de SHV, incluido un merge request de Bitcoin Cash Node y pull requests de Electron Cash, como
acciones relacionadas que pueden hacerse “en cualquier momento, antes o después de cambiar las reglas de consenso” (traducción nuestra).

## Estado actual

Borrador, publicado el 25 de febrero de 2026. No se encontraron declaraciones formales de las partes interesadas.
