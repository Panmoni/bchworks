---
title: 'Mayo de 2018: bloques de 32 MB y opcodes restaurados'
date: 2018-05-15T16:00:00.000Z
status: activated
height: 530356
summary: Elevó el límite de tamaño de bloque a 32 MB y volvió a habilitar OP_CAT, OP_SPLIT, AND/OR/XOR a nivel de bits, OP_DIV, OP_MOD, OP_NUM2BIN y OP_BIN2NUM.
keywords:
  - may 2018 upgrade
  - bitcoin cash 32mb
  - op_cat bitcoin cash
  - re-enabled opcodes
  - monolith upgrade
  - op_return 223 bytes
chips: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: May 2018 Hardfork Specification (especificaciones de actualizaciones de BCHN)
    url: https://upgradespecs.bitcoincashnode.org/may-2018-hardfork/
  - title: Restore disabled script opcodes, May 2018
    url: https://upgradespecs.bitcoincashnode.org/may-2018-reenabled-opcodes/
  - title: Datos de bloque de Blockchair (verificación de la mediana del tiempo pasado)
    url: https://api.blockchair.com/bitcoin-cash/raw/block/530355
translation:
  sourceHash: 044e4a178d11cab8
  status: machine
  translator: Claude
---

## Qué cambió

Esta actualización se activó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1526400000`
(15 de mayo de 2018, 16:00 UTC). El primer bloque con las nuevas reglas es el de altura 530356.

Cambios de consenso:

- **Límite de tamaño de bloque: 32 MB** (32.000.000 bytes), frente a los 8 MB anteriores.
- **Nueve opcodes (códigos de operación) restaurados o añadidos.** Bitcoin desactivó muchos opcodes en 2010–2011 tras errores graves. Esta actualización
  recuperó un conjunto revisado y rediseñado:
  - Empalme: [`OP_CAT`](/opcodes/op_cat) y [`OP_SPLIT`](/opcodes/op_split). `OP_SPLIT` es nuevo; reemplaza a los antiguos
    `OP_SUBSTR`, `OP_LEFT` y `OP_RIGHT`.
  - A nivel de bits: [`OP_AND`](/opcodes/op_and), [`OP_OR`](/opcodes/op_or), [`OP_XOR`](/opcodes/op_xor).
  - Aritmética: [`OP_DIV`](/opcodes/op_div), [`OP_MOD`](/opcodes/op_mod).
  - Conversión (nuevos): [`OP_NUM2BIN`](/opcodes/op_num2bin) y [`OP_BIN2NUM`](/opcodes/op_bin2num).

Cambios de política recomendados (no de consenso):

- Las salidas de datos [`OP_RETURN`](/glossary#op-return) pueden llevar hasta 223 bytes en total.
- Protección automática contra repetición para la siguiente actualización, como forma de retirar las versiones antiguas de nodos.

## Por qué

Los bloques en BCH estaban lejos de llenarse, pero el límite de 8 MB era un techo fijo. Elevarlo a 32 MB dejó un amplio margen
mientras el software de los nodos se seguía optimizando.

El trabajo con los opcodes se centró en el propio [Script](/glossary#bitcoin-script). La especificación dice que el objetivo era “restaurar la funcionalidad” (traducción nuestra)
que ofrecían estos opcodes, no copiar las versiones antiguas. Cada opcode se volvió a examinar y algunos se rediseñaron.

## Qué permite

- **Manejo de cadenas en los scripts.** `OP_CAT` y `OP_SPLIT` permiten que un script construya y descomponga cadenas de bytes. Esta es la
  base de técnicas posteriores, como verificar partes de un mensaje firmado.
- **Aritmética de verdad.** La división y el módulo permiten que los contratos calculen partes, comisiones y proporciones.
- **Conversión entre números y bytes.** `OP_NUM2BIN` y `OP_BIN2NUM` permiten que los scripts pasen de números a bytes de ancho fijo y viceversa.
- **Más espacio para datos.** El margen de 223 bytes de `OP_RETURN` dio a los protocolos de datos en la cadena más espacio por
  transacción.

Muchas de las ideas que Bitcoin (BTC) todavía debate, como `OP_CAT`, funcionan en BCH desde esta actualización.
