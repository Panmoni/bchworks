---
title: 'OP_EVAL: evaluación de funciones'
code: CHIP-2024-12
owners:
  - Jason Dreyzehner
status: superseded
summary: Proponía un único opcode OP_EVAL para ejecutar bytecode de la pila como una función. Se retiró en mayo de 2025 y fue sustituido por el CHIP de funciones (OP_DEFINE/OP_INVOKE), que se activó en 2026.
spec: https://github.com/bitjson/bch-eval
discussion: https://bitcoincashresearch.org/t/chip-2024-12-op-eval-function-evaluation/1450
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 'CHIP 2024-12 OP_EVAL: Function Evaluation (Bitcoin Cash Research)'
    url: https://bitcoincashresearch.org/t/chip-2024-12-op-eval-function-evaluation/1450
  - title: Withdrawing OP_EVAL (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2024-12-op-eval-function-evaluation/1450/91
  - title: CHIP-2025-05 Functions specification
    url: https://github.com/bitjson/bch-functions
translation:
  sourceHash: cdb0f6f0e5aa8065
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

OP_EVAL (Function Evaluation) “permitiría factorizar de forma eficiente los contratos de Bitcoin Cash en funciones reutilizables” (traducción nuestra), para
reducir el tamaño de los contratos de aritmética de cuerpos finitos, criptografía basada en emparejamientos, pruebas de conocimiento cero, cifrado homomórfico
y criptografía poscuántica.

Nota: comparte el prefijo “CHIP-2024-12” con [P2S](/chips/chip-2024-12-p2s), un CHIP distinto.

## Motivación

La misma que la de su sucesor: eliminar el bytecode duplicado de los contratos. OP_EVAL tomó el camino más sencillo, un opcode (código de operación) que
ejecuta un elemento de la pila como código.

## Estado actual

**Sustituido.** El 28 de mayo de 2025, Jason Dreyzehner publicó “Withdrawing OP_EVAL” y abrió un nuevo tema para
[CHIP-2025-05 Functions](/chips/chip-2025-05-functions), que usa `OP_DEFINE` y `OP_INVOKE` con cuerpos de función inmutables y
predefinidos. El hilo debatió extensamente el análisis estático de contratos. Las funciones se activaron en la
[actualización de mayo de 2026](/upgrades/2026-05-upgrade).
