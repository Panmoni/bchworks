---
title: 'Bitwise: reactivar las operaciones a nivel de bits'
code: CHIP-2025-05
owners:
  - Jason Dreyzehner
status: activated
upgrade: 2026-05-upgrade
summary: Habilita OP_INVERT y los desplazamientos numéricos y binarios a la izquierda y a la derecha, con lo que completa el conjunto de operaciones a nivel de bits de Script.
spec: https://github.com/bitjson/bch-bitwise
discussion: https://bitcoincashresearch.org/t/chip-2025-05-bitwise-re-enable-bitwise-operations/1580
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: Knuth
    position: support
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: Libauth
    position: support
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: AlbaDsl
    position: support
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: BCHD
    position: neutral
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: Bitcoin Verde
    position: neutral
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: Flowee
    position: neutral
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: Paytaca
    position: support
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: OPTN
    position: support
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - name: Coin Wallet
    position: oppose
    source: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP-2025-05 Bitwise specification
    url: https://github.com/bitjson/bch-bitwise
  - title: Bitwise stakeholder responses
    url: https://github.com/bitjson/bch-bitwise/blob/master/stakeholders.md
  - title: 2026-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
translation:
  sourceHash: 9e9865cddaad87fa
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Este CHIP “reactiva las operaciones a nivel de bits, lo que permite que los contratos de Bitcoin Cash implementen de forma más eficiente diversas
aplicaciones financieras y criptográficas” (traducción nuestra).

## Motivación

La [actualización de mayo de 2018](/upgrades/2018-05-upgrade) restauró [`OP_AND`](/opcodes/op_and), [`OP_OR`](/opcodes/op_or) y
[`OP_XOR`](/opcodes/op_xor), pero la inversión de bits y los desplazamientos siguieron desactivados. El resumen del CHIP da la razón para
activarlos: contratos financieros y criptográficos más eficientes. El CHIP en sí tiene pocos ejemplos; su
justificación y sus alternativas están en documentos aparte dentro del repositorio.

Con los [límites de la VM](/chips/chip-2021-05-vm-limits), que cobran cada operación según los bytes que apila, estos opcodes (códigos de operación) encajan en
el sistema de costos existente. Un desplazamiento cuyo resultado supere la longitud máxima de un elemento de la pila falla.

## Qué especifica

Cinco opcodes:

| Opcode | Código | Qué hace |
|---|---|---|
| [`OP_INVERT`](/opcodes/op_invert) | `0x83` | NOT bit a bit de cada byte |
| [`OP_LSHIFTNUM`](/opcodes/op_lshiftnum) | `0x8d` | desplazamiento numérico a la izquierda |
| [`OP_RSHIFTNUM`](/opcodes/op_rshiftnum) | `0x8e` | desplazamiento numérico a la derecha |
| [`OP_LSHIFTBIN`](/opcodes/op_lshiftbin) | `0x98` | desplazamiento binario (cadena de bits) a la izquierda |
| [`OP_RSHIFTBIN`](/opcodes/op_rshiftbin) | `0x99` | desplazamiento binario (cadena de bits) a la derecha |

A cada uno se le cobra el costo base de instrucción más la longitud de su resultado.

## Estado actual

Activado el 15 de mayo de 2026 (la versión 1.1.1 se congeló para su fijación). La tabla de partes interesadas registra 91 aprobaciones, 1
desaprobación (Coin Wallet) y 420 posiciones neutrales; las faltas de respuesta se contaron como neutrales.
