---
title: 'Mayo de 2022: introspección nativa y aritmética de 64 bits'
date: 2022-05-15T12:00:00.000Z
status: activated
height: 740238
summary: Los contratos pueden leer directamente su propia transacción (opcodes de introspección nativa), hacer aritmética de 64 bits y multiplicar con OP_MUL.
keywords:
  - may 2022 upgrade
  - native introspection
  - bigger script integers
  - op_mul
  - 64-bit integers bitcoin cash
  - bch covenants 2022
chips:
  - chip-2021-02-native-introspection-opcodes
  - chip-2021-03-bigger-script-integers
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2022-05-15 Network Upgrade Specification (especificaciones de actualizaciones de BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
  - title: 'CHIP-2021-02: Native Introspection Opcodes'
    url: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - title: 'CHIP-2021-03: Bigger Script Integers'
    url: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Bigger-Script-Integers.md
  - title: Bitcoin Cash Node chainparams.cpp (nota sobre la altura de upgrade8)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
  - title: Datos de bloques de Blockchair (comprobación de la mediana del tiempo pasado)
    url: https://api.blockchair.com/bitcoin-cash/raw/block/740237
translation:
  sourceHash: 207c6f1171c19cb8
  status: machine
  translator: Claude
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1652616000`
(15 de mayo de 2022, 12:00 UTC). El bloque 740.237 fue el primero con una mediana del tiempo pasado posterior a esa marca, así que el bloque 740.238 es el
primer bloque con las nuevas reglas.

Se activaron dos CHIPs:

- **[CHIP-2021-02 Native Introspection](/chips/chip-2021-02-native-introspection-opcodes)** añadió 14 opcodes
  (códigos de operación, `0xc0`–`0xcd`) que colocan en la pila datos sobre la transacción actual:
  - Transacción completa: [`OP_INPUTINDEX`](/opcodes/op_inputindex), [`OP_ACTIVEBYTECODE`](/opcodes/op_activebytecode),
    [`OP_TXVERSION`](/opcodes/op_txversion), [`OP_TXINPUTCOUNT`](/opcodes/op_txinputcount),
    [`OP_TXOUTPUTCOUNT`](/opcodes/op_txoutputcount), [`OP_TXLOCKTIME`](/opcodes/op_txlocktime).
  - Por entrada: [`OP_UTXOVALUE`](/opcodes/op_utxovalue), [`OP_UTXOBYTECODE`](/opcodes/op_utxobytecode),
    [`OP_OUTPOINTTXHASH`](/opcodes/op_outpointtxhash), [`OP_OUTPOINTINDEX`](/opcodes/op_outpointindex),
    [`OP_INPUTBYTECODE`](/opcodes/op_inputbytecode), [`OP_INPUTSEQUENCENUMBER`](/opcodes/op_inputsequencenumber).
  - Por salida: [`OP_OUTPUTVALUE`](/opcodes/op_outputvalue), [`OP_OUTPUTBYTECODE`](/opcodes/op_outputbytecode).
- **[CHIP-2021-03 Bigger Script Integers](/chips/chip-2021-03-bigger-script-integers)** amplió los números de script de
  32 bits a 64 bits y volvió a habilitar [`OP_MUL`](/opcodes/op_mul). Ahora los desbordamientos hacen fallar el script en lugar de producir
  resultados extraños.

## Por qué

**Introspección.** Los [covenants](/glossary#covenant) (contratos que limitan cómo se pueden gastar las monedas) ya
funcionaban en BCH, pero solo mediante un truco: colocar una copia de los datos de firma de la transacción, verificarla con
`OP_CHECKSIG` y con `OP_CHECKDATASIG`, y luego desmenuzarla. El CHIP indica que esto duplicaba o triplicaba el tamaño incluso de transacciones de covenants sencillos, y
los más avanzados chocaban con el límite de 1650 bytes del script de desbloqueo. El CHIP da a los contratos
acceso directo a esos mismos datos “sin aumentar los costos de validación de las transacciones” (traducción nuestra).

**Enteros más grandes.** La aritmética de 32 bits limitaba los valores a 2.147.483.647. En satoshis, eso son unos 21 BCH. Cualquier contrato que guardara
más tenía que emular una aritmética más grande, lo que era difícil de asegurar y engordaba las transacciones. Los números de 64 bits cubren cualquier valor posible
de una salida (el suministro total es de unos 2,1 mil billones de satoshis).

El CHIPs recomendó lanzar ambos a la vez: `OP_UTXOVALUE` y `OP_OUTPUTVALUE` devuelven montos que solo caben en
números de 64 bits.

## Qué permite

- **Covenants mucho más pequeños.** Comprobar “la salida 0 debe pagar al menos X a la dirección Y” se reduce a un puñado de opcodes.
- **Contratos de cualquier tamaño.** Una bóveda, un depósito en garantía o un fondo común puede guardar con seguridad miles de BCH.
- **Cálculos financieros reales.** La multiplicación junto con el rango de 64 bits hace prácticos los cálculos de intereses, precios y proporciones.
- **Soporte en las herramientas.** El autor de CashScript se comprometió en el CHIP a dar soporte al conjunto completo de opcodes de introspección.

El CHIP enumera a los primeros desarrolladores que dependieron de estas funciones: General Protocols (AnyHedge), be.cash, los pagos recurrentes de Causes Cash,
Mistcoin, Flipstarter y otros. Junto con
[CashTokens en 2023](/upgrades/2023-05-cashtokens), esta actualización sentó las bases de apps basadas en [UTXO](/glossary#utxo),
como DEXs (exchanges descentralizados) y préstamos en BCH.
