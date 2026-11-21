---
title: 'Funciones: operaciones de definición e invocación de funciones'
code: CHIP-2025-05
owners:
  - Jason Dreyzehner
status: activated
upgrade: 2026-05-upgrade
summary: Añade OP_DEFINE y OP_INVOKE, para que el bytecode de los contratos pueda dividirse en funciones reutilizables e inmutables.
spec: https://github.com/bitjson/bch-functions
discussion: https://bitcoincashresearch.org/t/chip-2025-05-functions-function-definition-and-invocation-operations/1576
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Knuth
    position: support
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Libauth
    position: support
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: AlbaDsl
    position: support
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: BCHD
    position: neutral
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Bitcoin Verde
    position: neutral
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Flowee
    position: neutral
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Paytaca
    position: support
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Cashonize
    position: support
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - name: Coin Wallet
    position: oppose
    source: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: Especificación de CHIP-2025-05 Functions
    url: https://github.com/bitjson/bch-functions
  - title: Respuestas de las partes interesadas sobre Functions
    url: https://github.com/bitjson/bch-functions/blob/master/stakeholders.md
  - title: Discusión de CHIP-2025-08 Functions (Takes 2 & 3)
    url: https://bitcoincashresearch.org/t/chip-2025-08-functions-takes-2-3/
  - title: 'CHIP 2024-12 OP_EVAL: publicación de retirada'
    url: https://bitcoincashresearch.org/t/chip-2024-12-op-eval-function-evaluation/1450/91
  - title: Especificación de la actualización de la red del 15 de mayo de 2026
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
translation:
  sourceHash: dd0c870420eb0e13
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Este CHIP introduce [`OP_DEFINE`](/opcodes/op_define) (`0x89`) y [`OP_INVOKE`](/opcodes/op_invoke) (`0x8a`),
“lo que permite factorizar el bytecode de los contratos Bitcoin Cash en funciones reutilizables” (traducción nuestra).

## Motivación

El CHIP menciona tres beneficios:

- **Transacciones más pequeñas.** Eliminar el bytecode duplicado deja espacio para la aritmética de campos finitos, la criptografía
  basada en emparejamientos, las pruebas de conocimiento cero, el cifrado homomórfico y la criptografía poscuántica.
- **Privacidad y seguridad operativa.** Los contratos pueden diseñarse para revelar menos sobre sus medidas de seguridad, sus activos
  y su historial.
- **Auditabilidad.** La lógica compartida vive en un solo lugar, así que los contratos son más cortos y más fáciles de revisar.

## Qué especifica

- La VM incorpora una **tabla de funciones**: un mapa que asocia un identificador de función con un vector de bytes inmutable (el cuerpo de la función).
- `OP_DEFINE` extrae un identificador (de 0 a 7 bytes) y luego un cuerpo, y guarda el cuerpo en la tabla. Redefinir un
  identificador existente es un error, por lo que las funciones son inmutables.
- `OP_INVOKE` extrae un identificador, guarda la posición de ejecución actual en la pila de control, ejecuta el cuerpo guardado y luego
  continúa después del `OP_INVOKE`.
- La cantidad de funciones y su tamaño están acotados por los límites de la VM existentes (las ranuras de memoria y el límite de 10.000 bytes por elemento
  de la pila). La ejecución se cobra según las reglas de costo de [Límites de la VM](/chips/chip-2021-05-vm-limits).

## Historia

Este CHIP reemplazó a [CHIP-2024-12 OP_EVAL](/chips/chip-2024-12-op-eval), que proponía un único opcode (código de operación) para “evaluar este
bytecode”. Jason Dreyzehner retiró OP_EVAL el 28 de mayo de 2025 y abrió este tema con el nuevo diseño. La
especificación de la actualización de Bitcoin Cash Node enlaza el hilo de discusión “CHIP-2025-08 Functions (Takes 2 & 3)”, que refleja revisiones
posteriores.

## Estado actual

Activado el 15 de mayo de 2026 (la versión 2.0.2 se congeló para su adopción definitiva). La tabla de partes interesadas registra 88 aprobaciones, 1
desaprobación (Coin Wallet) y 423 neutrales; las faltas de respuesta se contaron como neutrales.
