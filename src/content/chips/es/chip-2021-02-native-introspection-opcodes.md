---
title: Opcodes de introspección nativa
code: CHIP-2021-02
owners:
  - Jason Dreyzehner
  - Jonathan Silverblood
status: activated
upgrade: 2022-05-upgrade
summary: 'Añadió 14 opcodes que permiten a los contratos leer directamente la transacción actual: valores de entradas y salidas, bytecode, conteos, locktime y más.'
spec: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
discussion: https://bitcoincashresearch.org/t/chip-2021-02-add-native-introspection-opcodes/307
stakeholders:
  - name: Bitcoin Unlimited
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - name: Bitcoin Cash Node
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - name: Knuth
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - name: Bitcoin Verde
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - name: Bitauth
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - name: Flowee (Tom Zander)
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - name: CashScript (Rosco Kalis)
    position: support
    source: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 'CHIP-2021-02: Native Introspection Opcodes'
    url: https://gitlab.com/GeneralProtocols/research/chips/-/blob/master/CHIP-2021-02-Add-Native-Introspection-Opcodes.md
  - title: 2022-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
translation:
  sourceHash: 5c1da0ff13624470
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Este CHIP añade operaciones de la máquina virtual que permiten a un contrato leer detalles de la transacción que lo gasta: valores de las salidas, destinatarios, bytecode de las entradas y más. Lo hace “sin aumentar los costos de validación de las transacciones” (traducción nuestra), porque los nodos ya tienen todos esos datos mientras validan.

## Motivación

Los covenants (contratos que limitan cómo se pueden gastar las monedas) se hicieron posibles en BCH con [`OP_CHECKDATASIG`](/opcodes/op_checkdatasig) en 2018. Pero usaban un rodeo: verificar la misma firma con `OP_CHECKSIG` y con `OP_CHECKDATASIG`, y luego analizar una copia de los datos de firma de la transacción que apila quien gasta.

El CHIP dice que esto “duplica o triplica el tamaño incluso de las transacciones de covenant más simples” (traducción nuestra), y los covenants avanzados chocaban con el límite estándar de 1650 bytes para el script de desbloqueo. Los opcodes (códigos de operación) nativos eliminan esa duplicación.

## Qué especifica

Catorce opcodes en los puntos de código `0xc0`–`0xcd`:

| Opcode | Apila |
|---|---|
| [`OP_INPUTINDEX`](/opcodes/op_inputindex) | índice de la entrada que se está evaluando |
| [`OP_ACTIVEBYTECODE`](/opcodes/op_activebytecode) | bytecode que se está evaluando |
| [`OP_TXVERSION`](/opcodes/op_txversion) | versión de la transacción |
| [`OP_TXINPUTCOUNT`](/opcodes/op_txinputcount) | número de entradas |
| [`OP_TXOUTPUTCOUNT`](/opcodes/op_txoutputcount) | número de salidas |
| [`OP_TXLOCKTIME`](/opcodes/op_txlocktime) | locktime de la transacción |
| [`OP_UTXOVALUE`](/opcodes/op_utxovalue) | valor de la moneda gastada por la entrada N |
| [`OP_UTXOBYTECODE`](/opcodes/op_utxobytecode) | bytecode de bloqueo de esa moneda |
| [`OP_OUTPOINTTXHASH`](/opcodes/op_outpointtxhash) | txid referenciado por la entrada N |
| [`OP_OUTPOINTINDEX`](/opcodes/op_outpointindex) | índice de salida referenciado por la entrada N |
| [`OP_INPUTBYTECODE`](/opcodes/op_inputbytecode) | bytecode de desbloqueo de la entrada N |
| [`OP_INPUTSEQUENCENUMBER`](/opcodes/op_inputsequencenumber) | número de secuencia de la entrada N |
| [`OP_OUTPUTVALUE`](/opcodes/op_outputvalue) | valor de la salida N |
| [`OP_OUTPUTBYTECODE`](/opcodes/op_outputbytecode) | bytecode de bloqueo de la salida N |

El CHIP recomendaba desplegarlo junto con [Bigger Script Integers](/chips/chip-2021-03-bigger-script-integers), ya que los valores pueden superar el rango de 32 bits.

## Estado actual

Activado el 15 de mayo de 2022. El CHIP registra la aceptación por parte de Bitcoin Unlimited, Bitcoin Cash Node, Knuth, Bitcoin Verde y Bitauth. Su sección de declaraciones incluye el apoyo de Tom Zander, fundador de Flowee, y de Rosco Kalis, quien se comprometió a dar soporte a todos los opcodes en [CashScript](/glossary#cashscript). La declaración inicial de General Protocols decía que el CHIP necesitaba más análisis antes de poder adoptar una postura firme, aunque comprometía recursos para apoyarlo.
