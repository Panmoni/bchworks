---
title: 'BigInt: aritmética de alta precisión para Bitcoin Cash'
code: CHIP-2024-07
owners:
  - Jason Dreyzehner
status: activated
upgrade: 2025-05-vm-limits-bigint
summary: Elimina el límite de longitud de los números en script, de modo que los contratos pueden hacer aritmética con números de hasta 10.000 bytes, el tamaño máximo de un elemento de la pila.
spec: https://github.com/bitjson/bch-bigint
discussion: https://bitcoincashresearch.org/t/chip-2024-07-bigint-high-precision-arithmetic-for-bitcoin-cash/
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: BCHD
    position: support
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Bitcoin Verde
    position: support
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Libauth
    position: support
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Bitcoin Unlimited
    position: neutral
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Knuth
    position: oppose
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Flowee
    position: oppose
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Paytaca
    position: support
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - name: Selene Wallet
    position: support
    source: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: Especificación de BigInt CHIP-2024-07
    url: https://github.com/bitjson/bch-bigint
  - title: Respuestas de las partes interesadas sobre BigInt
    url: https://github.com/bitjson/bch-bigint/blob/master/stakeholders.md
  - title: Especificación de la actualización de la red del 15/05/2025
    url: https://upgradespecs.bitcoincashnode.org/2025-05-15-upgrade/
translation:
  sourceHash: 7214ec650a913a3c
  status: machine
  translator: Claude
---

## Resumen

BigInt (aritmética de alta precisión) se basa en [Límites de la VM](/chips/chip-2021-05-vm-limits) y elimina un límite más: la longitud máxima de los números de la VM (`nMaxNumSize`). Los números estaban limitados a 8 bytes (64 bits) desde [2022](/chips/chip-2021-03-bigger-script-integers). Consulta [BigInt](/glossary#bigint).

## Motivación

“Muchas aplicaciones financieras y criptográficas requieren aritmética de mayor precisión que la disponible actualmente para los contratos de Bitcoin Cash” (traducción nuestra). Antes de los límites de la VM, el diseño anti-DoS no podía permitir números más grandes de forma segura. Una vez que los límites de la VM cobran la aritmética según su costo real, se puede habilitar una mayor precisión “sin aumentar los requisitos de procesamiento o de memoria de la VM” (traducción nuestra).

CHIP enumera dos beneficios:

- **Contratos más seguros.** Se acaba la emulación matemática, que es difícil de revisar. Menos desbordamientos significan menos errores que podrían exponer a los usuarios a pérdidas.
- **Transacciones más pequeñas.** Eliminar el código de emulación reduce el tamaño de los contratos y baja las comisiones.

## Qué especifica

- Se elimina el límite de longitud de los números.
- El límite de 10.000 bytes por elemento de la pila, establecido por los límites de la VM, sigue acotando tanto los operandos como los resultados.
- Las operaciones aritméticas se cobran según las reglas de costo de operación de los límites de la VM, así que una multiplicación enorme cuesta más que una pequeña.

## Estado actual

Final. Se activó el 15 de mayo de 2025. Se propuso junto con los límites de la VM, de los que depende.

La tabla de partes interesadas registra 124 aprobaciones, 4 rechazos (Flowee, Knuth, Flowee Pay, Flowee Products) y 345 neutrales; las faltas de respuesta se contaron como neutrales.
