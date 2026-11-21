---
title: OP_SIGHASH
code: CHIP-2026-06
owners:
  - bitcoincashautist
status: draft
upgrade: 2027-05-upgrade
summary: Propone un opcode que calcula el hash de firma de la transacción y lo apila, sin verificar ninguna firma.
spec: https://gitlab.com/0353F40E/sighash
discussion: https://bitcoincashresearch.org/t/chip-2026-06-op-sighash/1869
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 'Chip-2026-06: OP_SIGHASH (Bitcoin Cash Research)'
    url: https://bitcoincashresearch.org/t/chip-2026-06-op-sighash/1869
  - title: OP_SIGHASH early discussion (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/op-sighash-early-discussion-exploration-use-cases/1718
  - title: OP_SIGHASH CHIP repository
    url: https://gitlab.com/0353F40E/sighash
translation:
  sourceHash: e7614c2a7db0935b
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

`OP_SIGHASH` sacaría de la pila un byte de tipo de sighash y apilaría el hash de firma (sighash) de 32 bytes resultante de la
transacción actual. No verifica ninguna firma. El autor lo presenta como la culminación de la “desagregación de checksig”: una
verificación de firma consiste en calcular un sighash y luego verificar una firma sobre ese resumen, como
[`OP_CHECKDATASIG`](/opcodes/op_checkdatasig) ya hace con mensajes arbitrarios.

## Motivación

El autor lo describe como “una mejora fácil que podemos obtener casi gratis” (traducción nuestra): la VM ya calcula sighashes dentro de
[`OP_CHECKSIG`](/opcodes/op_checksig). Exponer el resumen permite que los contratos razonen sobre aquello con lo que se compromete exactamente una firma,
lo que ayuda a los patrones de oráculo y de covenant (un contrato que limita cómo se pueden gastar las monedas).

## Qué especifica

- Usa el mismo algoritmo de sighash, los mismos indicadores de tipo y las mismas convenciones de scriptCode que `OP_CHECKSIG`.
- No introduce criptografía nueva ni un nuevo algoritmo de sighash.

El revisor Calin Culianu (Bitcoin Cash Node) señaló que la sección detallada del CHIP usa un solo SHA-256 para el
resumen final, mientras que `OP_CHECKSIG` usa doble SHA-256, así que la afirmación de “resumen idéntico” debe corregirse. También pidió
un resultado definido para el caso límite de `SIGHASH_SINGLE` en el que el índice de la entrada supera el número de salidas.

## Estado actual

Borrador, publicado el 14 de junio de 2026; el autor propone mayo de 2027. En agosto de 2026, Calin Culianu dijo que había sorteado
sus objeciones, abrió una merge request en Bitcoin Cash Node que lo implementa y que “quizá termine recomendando que lo hagamos para
2027” (traducción nuestra). No está confirmado. No se encontraron declaraciones formales de las partes interesadas.
