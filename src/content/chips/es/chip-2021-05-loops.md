---
title: 'Bucles: operaciones de bucle acotadas'
code: CHIP-2021-05
owners:
  - Jason Dreyzehner
status: activated
upgrade: 2026-05-upgrade
summary: Añade OP_BEGIN y OP_UNTIL para que los contratos puedan ejecutar bucles, y los límites de costo de la VM contabilizan cada iteración.
spec: https://github.com/bitjson/bch-loops
discussion: https://bitcoincashresearch.org/t/chip-2021-05-bounded-looping-operations/
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Knuth
    position: support
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Libauth
    position: support
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: AlbaDsl
    position: support
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: BCHD
    position: neutral
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Bitcoin Verde
    position: neutral
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Flowee
    position: neutral
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Cashonize
    position: support
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Selene Wallet
    position: support
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - name: Coin Wallet
    position: oppose
    source: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: Especificación de bucles CHIP-2021-05
    url: https://github.com/bitjson/bch-loops
  - title: Respuestas de las partes interesadas sobre los bucles
    url: https://github.com/bitjson/bch-loops/blob/master/stakeholders.md
  - title: Especificación de la actualización de la red del 15/05/2026
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
translation:
  sourceHash: 94dd5c1cd3ca34b3
  status: machine
  translator: Claude
---

## Resumen

Este CHIP añade dos opcodes (códigos de operación), [`OP_BEGIN`](/opcodes/op_begin) (`0x65`) y [`OP_UNTIL`](/opcodes/op_until) (`0x66`),
“lo que permite diversas construcciones de bucles en contratos BCH sin aumentar los requisitos de procesamiento o de memoria de
la VM” (traducción nuestra). Es el patrón `BEGIN … UNTIL` que usan la mayoría de los lenguajes similares a Forth.

Se publicó por primera vez el 28 de mayo de 2021 y se activó cinco años después, una vez que [Límites de la VM](/chips/chip-2021-05-vm-limits) implementó
el sistema de costos del que depende.

## Motivación

Los bucles quedaron fuera de la VM de Bitcoin como parte de un enfoque temprano contra ataques DoS. El CHIP señala que ese enfoque se
abandonó discretamente en favor de límites explícitos ya en 2010, pero los bucles nunca regresaron. El resultado: los contratos duplican el bytecode en
cada paso repetido, lo que desperdicia espacio y comisiones.

Según el CHIP, los bucles ayudan de dos maneras:

- **Agregación.** Algunas tareas, como sumar valores de un número desconocido de entradas o salidas, son poco prácticas o
  imposibles de expresar solo con `OP_IF`.
- **Contratos más cortos.** Los procedimientos repetidos ya no tienen que copiarse completos.

## Qué especifica

- `OP_BEGIN` coloca la posición de la siguiente instrucción en la pila de control.
- `OP_UNTIL` extrae el elemento superior de la pila. Si es `0`, la ejecución salta de vuelta justo después del `OP_BEGIN` correspondiente;
  de lo contrario, la ejecución continúa.
- Desde [Límites de la VM](/chips/chip-2021-05-vm-limits), cada operación cuenta para los límites de costo basados en densidad, así que un bucle
  no puede hacer la validación más costosa que el mismo código escrito completo. El CHIP incluye vectores de prueba para
  el rendimiento de validación en el peor caso.

## Estado actual

Se activó el 15 de mayo de 2026 (la versión 1.2.3 quedó congelada para su adopción definitiva). La tabla de partes interesadas registra 86 aprobaciones, 1
desaprobación (Coin Wallet) y 425 posturas neutrales; quienes no respondieron se contaron como neutrales.
