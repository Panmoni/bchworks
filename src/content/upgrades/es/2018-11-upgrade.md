---
title: 'Noviembre de 2018: CTOR, OP_CHECKDATASIG y la división de BSV'
date: 2018-11-15T16:40:00.000Z
status: activated
height: 556767
summary: Orden canónico de transacciones (CTOR), OP_CHECKDATASIG, un tamaño mínimo de transacción de 100 bytes y las reglas de solo apilamiento y de pila limpia. Un grupo rival se separó mediante una bifurcación y formó Bitcoin SV.
keywords:
  - november 2018 upgrade
  - ctor
  - op_checkdatasig
  - bitcoin sv split
  - bch bsv hash war
  - magnetic anomaly
chips: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2018 November 15 Network Upgrade Specification (BCHN upgrade specs)
    url: https://upgradespecs.bitcoincashnode.org/2018-nov-upgrade/
  - title: OP_CHECKDATASIG and OP_CHECKDATASIGVERIFY Specification
    url: https://upgradespecs.bitcoincashnode.org/op_checkdatasig/
  - title: Bitcoin Cash Node chainparams.cpp (magneticAnomalyHeight)
    url: https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node/-/blob/master/src/chainparams.cpp
  - title: Bitcoin Satoshi Vision (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin_Satoshi_Vision
  - title: The November 2018 Bitcoin Cash Fork (Bitwise)
    url: https://bitwiseinvestments.com/crypto-market-insights/the-november-2018-bitcoin-cash-fork
translation:
  sourceHash: fb65984a114304a8
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Qué cambió

La activación se produjo cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1542300000`
(15 de noviembre de 2018, 16:40 UTC). El primer bloque con las nuevas reglas es el de altura 556767.

Cambios de consenso:

- **Orden canónico de transacciones ([CTOR](/glossary#ctor)).** Después de la coinbase, las transacciones de un bloque deben ordenarse por
  ID de transacción. Se eliminó la regla anterior (un hijo después de su padre).
- **[`OP_CHECKDATASIG`](/opcodes/op_checkdatasig) y [`OP_CHECKDATASIGVERIFY`](/opcodes/op_checkdatasigverify).**
  Verifican una firma frente a cualquier mensaje y clave pública, no solo frente a la transacción que gasta.
- **Tamaño mínimo de transacción: 100 bytes.** Esto bloqueó una debilidad conocida del árbol de Merkle que permite a un atacante engañar
  a las billeteras [SPV](/glossary#spv) (verificación simplificada de pagos) con una transacción de 64 bytes.
- **scriptSig de solo apilamiento.** Los scripts de desbloqueo solo pueden apilar datos (regla 2 de BIP 62).
- **Pila limpia.** Debe quedar exactamente un valor verdadero tras ejecutar el script (regla 6 de BIP 62).

## Por qué

- **CTOR** fue impulsado por desarrolladores que esperaban que un orden fijo de transacciones ayudara al futuro trabajo de escalado, como
  la propagación y la validación de bloques.
- **CHECKDATASIG** fue la función de contrato inteligente más destacada. Permite que un script acepte datos firmados por un tercero,
  como un [oráculo](/glossary#oracle) que publica un precio.
- **Solo apilamiento y pila limpia** impidieron que terceros pudieran modificar las transacciones (maleabilidad).

## La división

No todos estuvieron de acuerdo. Un grupo respaldado por Craig Wright y Calvin Ayre se opuso a CTOR y a `OP_CHECKDATASIG`. Lanzaron
Bitcoin SV con un límite de bloque de 128 MB y sin protección contra repetición. La cadena se dividió el 15 de noviembre de 2018. Ambos bandos gastaron
potencia de hash con pérdidas durante semanas en una “guerra de hash”. La cadena que siguió estas reglas conservó el nombre y el ticker de Bitcoin Cash;
la otra pasó a ser BSV.

## Qué permite

- **Contratos con oráculos.** Un contrato puede pagar según un precio o un evento firmado, verificado en la cadena.
- **Primeros [covenants](/glossary#covenant) (contratos que limitan cómo se pueden gastar las monedas).** Verificar la misma firma con `OP_CHECKDATASIG` y con
  `OP_CHECKSIG` permite que un script vea partes de su propia transacción de gasto. Los contratos usaron soluciones alternativas como esta hasta que
  [llegó la introspección nativa en 2022](/upgrades/2022-05-upgrade).

El mínimo de 100 bytes resultó luego demasiado estricto y se redujo a 65 bytes [en 2023](/upgrades/2023-05-cashtokens).
