---
title: 'Límites de la VM: límites reajustados de la máquina virtual'
code: CHIP-2021-05
owners:
  - Jason Dreyzehner
status: activated
upgrade: 2025-05-vm-limits-bigint
summary: Reemplaza el límite de 201 opcodes y el límite de 520 bytes por elemento de pila con límites de costo de operación y de hashing basados en la densidad, y eleva los elementos de pila a 10.000 bytes.
spec: https://github.com/bitjson/bch-vm-limits
discussion: https://bitcoincashresearch.org/t/chip-2021-05-targeted-virtual-machine-limits/437
stakeholders:
  - name: Bitcoin Cash Node
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: BCHD
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Bitcoin Verde
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Knuth
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Libauth
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Bitcoin Unlimited
    position: neutral
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Flowee
    position: oppose
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Paytaca
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Cashonize
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - name: Bitcoin.com Wallet
    position: support
    source: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP-2021-05 VM Limits specification
    url: https://github.com/bitjson/bch-vm-limits
  - title: VM Limits stakeholder responses
    url: https://github.com/bitjson/bch-vm-limits/blob/master/stakeholders.md
  - title: 2025-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2025-05-15-upgrade/
translation:
  sourceHash: b3bd3dbf24de2991
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Este CHIP “reajusta los límites de la máquina virtual (VM) para permitir contratos Bitcoin Cash más avanzados, reducir el tamaño de las transacciones y reducir los requisitos de cómputo de los nodos completos” (traducción nuestra). Consulta [límites de la VM](/glossary#vm-limits).

## Motivación

- **Contratos más avanzados.** El límite de 201 opcodes (códigos de operación) y el límite de 520 bytes para contratos P2SH obligaban a los autores a recortar funciones
  o a dividir la lógica en “sistemas de varias entradas, más difíciles de auditar” (traducción nuestra).
- **Elementos de pila más grandes.** Los elementos más grandes permiten criptografía poscuántica, estrategias más sólidas de depósito en garantía y de liquidación,
  preimágenes de hash más grandes, pruebas de conocimiento cero y cifrado homomórfico.
- **Contabilidad precisa de costos.** Los límites anteriores eran toscos: bloqueaban contratos útiles sin medir bien el costo real
  de validación.

## Qué especifica

- Se **elimina el límite de 201 operaciones**, que se reemplaza por un **límite de costo de operación** de 800 por byte de “longitud de control
  de densidad” (la longitud del bytecode de desbloqueo de la entrada más 41). Cada valor que se apila cuesta su longitud; el hashing, las verificaciones de firmas
  y la aritmética costosa cuestan más.
- El **límite de elementos de pila** sube de 520 a 10.000 bytes, igual al tamaño máximo de un script.
- Un **límite de hashing**: unas 3,5 iteraciones de digest por byte de densidad en los bloques y 0,5 para las transacciones estándar.
- Un **límite de la pila de control** mantiene la profundidad máxima de anidamiento `OP_IF`/`OP_NOTIF` existente, de 100.
- El límite estándar del bytecode de desbloqueo (1650 bytes) no cambia, para acotar el alcance. El
  [CHIP P2S de 2026](/chips/chip-2024-12-p2s) lo eliminó más adelante.

Como cada límite escala con el tamaño de la transacción, un contrato más grande obtiene un presupuesto mayor, pero el costo de validación
por byte en el peor caso sigue acotado.

## Estado actual

Final. Se activó el 15 de mayo de 2025 junto con [BigInt](/chips/chip-2024-07-bigint) (aritmética de alta precisión). La tabla de partes interesadas registra 127
aprobaciones, 3 desaprobaciones (Flowee, Flowee Pay y Flowee Products) y 343 neutrales; las faltas de respuesta se contaron como neutrales.

El sistema de costos que introdujo es lo que hizo seguro añadir [bucles](/chips/chip-2021-05-loops),
[funciones](/chips/chip-2025-05-functions) y [operaciones a nivel de bits](/chips/chip-2025-05-bitwise) en 2026.
