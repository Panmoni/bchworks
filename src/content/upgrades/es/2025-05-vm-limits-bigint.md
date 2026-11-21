---
title: 'Mayo de 2025: límites de la VM y BigInt'
date: 2025-05-15T12:00:00.000Z
status: activated
height: 898374
summary: Reemplazó los límites de 201 opcodes y 520 bytes por límites de densidad basados en el costo, elevó el tamaño de los elementos de la pila a 10.000 bytes y eliminó el límite de tamaño de los números para cálculos de alta precisión.
keywords:
  - may 2025 upgrade
  - vm limits
  - bigint
  - targeted virtual machine limits
  - bitcoin cash big integers
  - op cost limit
  - 520 byte limit removed
  - bch 2025 upgrade
chips:
  - chip-2021-05-vm-limits
  - chip-2024-07-bigint
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2025-05-15 Network Upgrade Specification (BCHN upgrade specs)
    url: https://upgradespecs.bitcoincashnode.org/2025-05-15-upgrade/
  - title: 'CHIP-2021-05 VM Limits: Targeted Virtual Machine Limits'
    url: https://github.com/bitjson/bch-vm-limits
  - title: 'CHIP-2024-07 BigInt: High-Precision Arithmetic for Bitcoin Cash'
    url: https://github.com/bitjson/bch-bigint
  - title: Discusión sobre Límites de la VM (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2021-05-targeted-virtual-machine-limits/437
  - title: Bitcoin Cash Node chainparams.cpp (upgrade11Height)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: 72f3600813f58927
  status: machine
  translator: Claude
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1747310400`
(15 de mayo de 2025, 12:00 UTC). El primer bloque bajo las nuevas reglas es el de altura 898374. [Chipnet](/glossary#chipnet) (la red de pruebas de los CHIPs)
las aplicaba desde el 15 de noviembre de 2024.

Se activaron dos CHIPs, ambos mantenidos por Jason Dreyzehner.

### Límites de la VM (CHIP-2021-05)

[Límites de la VM](/chips/chip-2021-05-vm-limits) reajusta los límites de la máquina virtual de BCH. Consulta
[límites de la VM](/glossary#vm-limits).

- **Desaparece el límite de 201 operaciones.** Lo reemplaza un **límite de costo de operaciones**: cada entrada puede gastar un presupuesto de
  800 unidades de costo por byte de su “longitud de control de densidad” (aproximadamente, el tamaño de la entrada que gasta). Apilar datos
  cuesta su longitud; el hashing, las verificaciones de firmas y la aritmética costosa cuestan más.
- **Los elementos de la pila pueden tener 10.000 bytes**, frente a 520. Esto coincide con el tamaño máximo de script ya existente y elimina el
  tope de 520 bytes en la longitud de los contratos de P2SH. Para mantener un alcance acotado, la política de retransmisión siguió limitando el bytecode de desbloqueo a 1650
  bytes. Ese tope se eliminó [en 2026](/upgrades/2026-05-upgrade).
- **Un límite de hashing.** Cada entrada puede hacer unas 3,5 iteraciones de resumen hash por byte en los bloques, y 0,5 por byte en las
  transacciones estándar (retransmitidas).
- **Un límite de la pila de control** mantiene la profundidad máxima de anidamiento de `OP_IF` existente, de 100.

La “longitud de control de densidad” es la longitud del bytecode de desbloqueo de la entrada más 41 bytes de sobrecarga fija por entrada.

La idea clave es la *densidad*. Los límites crecen según cuántos bytes paga la transacción. Un contrato más grande recibe un presupuesto
mayor, pero el costo de validación en el peor caso de un bloque de cualquier tamaño sigue acotado.

### BigInt (CHIP-2024-07)

[BigInt](/chips/chip-2024-07-bigint) (aritmética de alta precisión) elimina el límite de longitud de los números (`nMaxNumSize`). Los números de Script tenían 8 bytes
(64 bits) desde [2022](/upgrades/2022-05-upgrade). Ahora pueden ser tan largos como cualquier elemento de la pila: hasta 10.000 bytes. El
límite de costo de operaciones cobra la aritmética costosa, como multiplicar números enormes, en proporción a su costo real. Consulta
[BigInt](/glossary#bigint).

## Por qué

El CHIP de Límites de la VM enumera los problemas de los límites anteriores:

- Los límites de contrato de 201 opcodes (códigos de operación) y 520 bytes “elevan el costo de desarrollar productos de Bitcoin Cash” (traducción nuestra). Los autores tenían que
  recortar funciones o dividir un contrato en sistemas de múltiples entradas más difíciles de auditar.
- Los límites anteriores eran burdos. Bloqueaban contratos útiles y aun así no medían bien el costo real de la validación.

Los límites basados en densidad resuelven ambas cosas: más espacio para los contratos honestos y un tope firme al costo de validación. El resumen del CHIP
indica que además *reduce* los requisitos de cómputo de los nodos completos.

BigInt es la consecuencia natural. Una vez que la VM puede cobrar la aritmética según su costo real, no hay razón para limitar los números a 64
bits. Muchas aplicaciones financieras y criptográficas necesitan más precisión, y emularla en Script era lento, voluminoso y
propenso a errores.

## Qué permite

- **Contratos mucho mayores de 520 bytes** sin dividirlos entre varias entradas (hasta el límite estándar de desbloqueo de 1650 bytes
  hasta 2026). Diseños más simples, auditorías más fáciles.
- **Finanzas de alta precisión.** Intereses, curvas de AMM, precios de punto fijo y cálculos de participaciones sin trucos para evitar el desbordamiento.
- **Criptografía en Script.** El CHIP menciona como ahora viables los esquemas poscuánticos, estrategias más sólidas de depósito en garantía y liquidación, preimágenes de hash
  más grandes, pruebas de conocimiento cero y cifrado homomórfico. Los números grandes hacen posible la aritmética de cuerpos finitos en un contrato.
- **Transacciones más pequeñas.** Eliminar la emulación de cálculos reduce el tamaño de los contratos existentes, así que los usuarios pagan comisiones más bajas.
- **Una base para 2026.** Los bucles, las funciones y las operaciones a nivel de bits de la [actualización de mayo de 2026](/upgrades/2026-05-upgrade) dependen de
  este sistema de costos para seguir siendo seguros.

## Apoyo

Las tablas de partes interesadas de ambos CHIPs muestran una amplia aprobación. Bitcoin Cash Node, BCHD, Bitcoin Verde y Libauth aprobaron ambos.
Knuth aprobó Límites de la VM, pero figura como en contra de BigInt. Flowee rechazó ambos y Bitcoin Unlimited
figura como neutral en ambos. Nota: estas tablas cuentan la falta de respuesta como “neutral”. Consulta las páginas de CHIP para más detalles.
