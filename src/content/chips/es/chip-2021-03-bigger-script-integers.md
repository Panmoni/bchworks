---
title: Enteros más grandes en Script
code: CHIP-2021-03
owners:
  - Jason Dreyzehner
  - Rosco Kalis
  - Jonathan Silverblood
status: activated
upgrade: 2022-05-upgrade
summary: Amplió los números de script de 32 a 64 bits y volvió a habilitar OP_MUL, con aritmética con detección de desbordamiento.
spec: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
discussion: https://bitcoincashresearch.org/t/chip-2021-03-bigger-script-integers/39
stakeholders:
  - name: Bitcoin Unlimited
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
  - name: Bitcoin Cash Node
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
  - name: Knuth
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
  - name: Bitcoin Verde
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
  - name: Bitauth
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 'CHIP-2021-03: Bigger Script Integers'
    url: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
  - title: 2022-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
translation:
  sourceHash: ef6c5c3e0d8098a7
  status: machine
  translator: Claude
  qaHash: 04d6bb28bb57fe8b
---

## Resumen

Este CHIP amplía el rango de enteros en los contratos de BCH de números de 32 bits a 64 bits y vuelve a habilitar la multiplicación
([`OP_MUL`](/opcodes/op_mul)).

Nota sobre el nombre: la especificación de la actualización BCHN lo llama CHIP-2021-03, mientras que el archivo publicado se llama
`CHIP-2021-02-Bigger-Script-Integers.md`. Son la misma propuesta.

## Motivación

Las operaciones matemáticas de la VM estaban limitadas a enteros con signo de 32 bits, así que los contratos no podían manejar valores superiores a 2.147.483.647. En satoshis,
eso equivale a unos 21 BCH. Las soluciones alternativas para emular operaciones con números más grandes eran “a menudo poco prácticas, difíciles de asegurar y
aumentaban considerablemente el tamaño de las transacciones” (traducción nuestra). El CHIP señala que Bitcoin siempre hizo operaciones de 64 bits internamente; el límite de 32 bits
solo evitaba tener que definir el comportamiento ante desbordamientos.

## Qué especifica

- Los números de script pueden tener hasta 8 bytes, lo que cubre valores de hasta 9.223.372.036.854.775.807. Eso supera el valor total posible
  en satoshi de cualquier salida (unos 2,1 mil billones).
- Toda la aritmética usa operaciones de 64 bits con signo y detección de desbordamiento. Un desbordamiento hace fallar el script.
- Un resultado igual al valor mínimo (−9.223.372.036.854.775.808), que necesitaría 9 bytes, también hace fallar el script.
- `OP_MUL` se vuelve a habilitar en su punto de código original `0x95`, con multiplicación con detección de desbordamiento.
- Las operaciones criptográficas y las aritméticas se mantienen separadas.

## Estado actual

Se activó el 15 de mayo de 2022 junto con [Native Introspection](/chips/chip-2021-02-native-introspection-opcodes). Los hitos del CHIP
registran la aceptación por parte de Bitcoin Unlimited, Bitcoin Cash Node, Knuth, Bitcoin Verde y Bitauth. La declaración de General
Protocols dice que sortear el límite de 32 bits le había costado “una gran cantidad de tiempo y dinero” (traducción nuestra).

El límite de tamaño de los números se eliminó por completo en 2025 con [BigInt (aritmética de alta precisión)](/chips/chip-2024-07-bigint).
