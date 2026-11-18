---
title: 'Mayo de 2026 (Layla): bucles, funciones, operaciones a nivel de bits y Pay-to-Script'
date: 2026-05-15T12:00:00.000Z
status: activated
height: 951145
summary: 'Cuatro CHIPs: bucles acotados (OP_BEGIN/OP_UNTIL), funciones reutilizables (OP_DEFINE/OP_INVOKE), operaciones a nivel de bits y de desplazamiento rehabilitadas y salidas Pay-to-Script estándar con compromisos del NFT de 128 bytes.'
keywords:
  - may 2026 upgrade
  - bitcoin cash 2026 upgrade
  - layla upgrade
  - bch loops
  - op_begin op_until
  - op_define op_invoke
  - bitcoin cash functions
  - p2s pay to script
  - 128 byte nft commitment
  - bitwise operations bch
chips:
  - chip-2024-12-p2s
  - chip-2021-05-loops
  - chip-2025-05-functions
  - chip-2025-05-bitwise
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2026-05-15 Network Upgrade Specification (especificaciones de actualizaciones de BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
  - title: 'CHIP-2024-12 P2S: Pay to Script'
    url: https://github.com/bitjson/bch-p2s
  - title: 'CHIP-2021-05 Loops: Bounded Looping Operations'
    url: https://github.com/bitjson/bch-loops
  - title: 'CHIP-2025-05 Functions: Function Definition and Invocation Operations'
    url: https://github.com/bitjson/bch-functions
  - title: 'CHIP-2025-05 Bitwise: Re-Enable Bitwise Operations'
    url: https://github.com/bitjson/bch-bitwise
  - title: 2026 Layla Upgrade Lock-in CHIP Endorsements Thread (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/2026-layla-upgrade-lock-in-chip-endorsements-thread/1672
  - title: Bitcoin Cash Node chainparams.cpp (upgrade12Height)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
translation:
  sourceHash: 012cc6a78245497c
  status: machine
  translator: Claude
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1778846400`
(15 de mayo de 2026, 12:00 UTC). El primer bloque con las nuevas reglas es el de altura 951.145. [Chipnet](/glossary#chipnet) (la red de pruebas de los CHIPs) las aplicaba
desde mediados de noviembre de 2025. El hilo comunitario de lock-in en Bitcoin Cash Research llamó a esta actualización “Layla”.

Se activaron cuatro CHIPs, todos mantenidos por Jason Dreyzehner.

### Bucles (CHIP-2021-05)

[Loops](/chips/chip-2021-05-loops) añade [`OP_BEGIN`](/opcodes/op_begin) (`0x65`) y [`OP_UNTIL`](/opcodes/op_until)
(`0x66`), la construcción de bucle que usan la mayoría de los lenguajes tipo Forth. Cuando `OP_UNTIL` extrae un cero, la ejecución vuelve a
justo después del `OP_BEGIN` correspondiente; cualquier otro valor termina el bucle. Cada iteración se cobra según los [límites de la VM de 2025](/upgrades/2025-05-vm-limits-bigint), así que los bucles no pueden disparar
el costo de validación.

### Funciones (CHIP-2025-05)

[Functions](/chips/chip-2025-05-functions) añade [`OP_DEFINE`](/opcodes/op_define) (`0x89`) y
[`OP_INVOKE`](/opcodes/op_invoke) (`0x8a`). Un contrato guarda un fragmento de bytecode en una tabla de funciones bajo un
identificador y luego lo llama tantas veces como haga falta. Las funciones definidas son inmutables. Este CHIP reemplazó un
diseño `OP_EVAL` anterior ([CHIP-2024-12 OP_EVAL](/chips/chip-2024-12-op-eval)), que su autor retiró en mayo de 2025.

### Operaciones a nivel de bits (CHIP-2025-05)

[Bitwise](/chips/chip-2025-05-bitwise) habilita cinco opcodes (códigos de operación):
[`OP_INVERT`](/opcodes/op_invert) (`0x83`),
[`OP_LSHIFTNUM`](/opcodes/op_lshiftnum) (`0x8d`),
[`OP_RSHIFTNUM`](/opcodes/op_rshiftnum) (`0x8e`),
[`OP_LSHIFTBIN`](/opcodes/op_lshiftbin) (`0x98`) y
[`OP_RSHIFTBIN`](/opcodes/op_rshiftbin) (`0x99`).
Estos completan el conjunto que [`OP_AND`](/opcodes/op_and), [`OP_OR`](/opcodes/op_or) y [`OP_XOR`](/opcodes/op_xor)
iniciaron en 2018: inversión de bits más desplazamientos numéricos y binarios.

### Pay to Script (CHIP-2024-12)

[P2S](/chips/chip-2024-12-p2s) cambia las reglas de estandaridad (retransmisión) y un límite de los tokens:

- **Las salidas Pay-to-Script son estándar.** Se puede retransmitir cualquier bytecode de bloqueo de hasta 201 bytes, no solo las antiguas
  plantillas (P2PKH, P2SH, multifirma directa, etc.). Consulta [P2S](/glossary#p2s).
- **Compromisos del NFT de hasta 128 bytes**, antes 40 (consenso).
- **Bytecode de desbloqueo de hasta 10.000 bytes** en transacciones estándar. El antiguo límite estándar de 1650 bytes desaparece, así que
  los límites estándar y de consenso ahora coinciden.

## Por qué

**Bucles.** La VM original de Bitcoin dejó fuera los bucles como parte de un enfoque temprano contra ataques DoS. Como los límites de la VM de 2025 ya
cobran cada operación, ese motivo desapareció. Sin bucles, los contratos copian el mismo código una y otra vez, lo que desperdicia
bytes y comisiones. El CHIP de Loops también señala que algunas tareas, como agregar datos de un número desconocido de entradas, son
poco prácticas o imposibles solo con `OP_IF`.

**Funciones.** El CHIP de Functions menciona tres ventajas: transacciones más pequeñas (sin bytecode duplicado), mayor privacidad
y seguridad operativa (los contratos revelan menos sobre su estructura) y mejor auditabilidad.

**Operaciones a nivel de bits.** El CHIP dice que estas operaciones permiten a los contratos “implementar de forma más eficiente una variedad de aplicaciones financieras y
criptográficas” (traducción nuestra). Las funciones hash, la aritmética de campos y el estado empaquetado en bits necesitan desplazamientos e inversión.

**P2S.** El CHIP de P2S menciona dos objetivos. Seguridad: los contratos P2SH siempre tienen una dirección a la que se puede pagar, así que los usuarios pueden enviar dinero
a una dirección de contrato por error y perderlo. Una salida P2S no tiene ninguna dirección a la que una billetera sencilla pueda pagar. Simplicidad: los covenants (un contrato que limita cómo se pueden gastar las monedas)
ya no construyen ni verifican un hash P2SH para cada salida, lo que ahorra al menos 34 bytes por salida.

## Qué permite

- **Programas reales en la cadena.** Los bucles junto con las funciones permiten a los contratos recorrer cualquier número de entradas y salidas y
  reutilizar rutinas auxiliares. El tamaño de los contratos baja cuando la lógica es repetitiva.
- **Criptografía avanzada.** La reutilización de funciones y los desplazamientos hacen más práctica la aritmética de campos finitos, la criptografía basada en emparejamientos,
  la verificación de pruebas de conocimiento cero y la comprobación de firmas poscuánticas, como enumera el CHIP de Functions.
- **NFTs más completos.** Un compromiso de 128 bytes puede contener más estado del contrato o más metadatos por token.
- **Covenants más ligeros.** P2S elimina la envoltura del hash, así que los pools de DEX (exchange descentralizado), las bóvedas y los covenants de varias partes se reducen.
- **Herramientas.** CashScript añadió bucles, operaciones a nivel de bits y P2S en la v0.13.

BTC todavía debate `OP_CAT` y los opcodes de covenants. En BCH, los bucles, las funciones y la introspección completa ya funcionan en la red principal.

## Apoyo

Las cuatro tablas de partes interesadas muestran un amplio apoyo de Bitcoin Cash Node, Knuth, Libauth y AlbaDsl, con BCHD, Bitcoin
Verde y Flowee como neutrales (estas tablas cuentan la falta de respuesta como neutral). Entre las billeteras, Coin Wallet desaprobó los
cuatro; Cashonize, Selene, OPTN, Zapit y Bitcoin.com Wallet aprobaron los cuatro.
