---
title: Bitcoin Cash frente a Cardano (BCH frente a ADA)
description: 'BCH frente a ADA: dos cadenas UTXO comparadas. Covenants frente a eUTXO, tokens nativos en ambas, prueba de trabajo frente a la prueba de participación Ouroboros y en qué lleva ventaja Cardano.'
verified: 2026-09-26T00:00:00.000Z
rival: Cardano
ticker: ADA
faq:
  - q: ¿Es Bitcoin Cash mejor que Cardano?
    a: 'Comparten más que la mayoría de las parejas: ambas usan UTXOs y ambas tienen tokens nativos. Cardano lleva ventaja en métodos formales, gobernanza en la cadena, una tesorería con fondos y staking. Bitcoin Cash lleva ventaja en seguridad por prueba de trabajo, un suministro fijo de 21 millones y un modelo de comisiones y tokens más simple. Cuál es mejor depende de lo que construyas.'
  - q: ¿Son Bitcoin Cash y Cardano blockchains UTXO?
    a: 'Sí. Cardano usa el modelo UTXO extendido (eUTXO), en el que las salidas llevan un datum y los scripts reciben un redeemer y el contexto completo de la transacción. Bitcoin Cash usa covenants UTXO: los scripts leen la transacción mediante opcodes de introspección y pueden guardar estado en el compromiso del NFT de un CashToken.'
  - q: ¿Puede Bitcoin Cash ejecutar contratos inteligentes como Plutus?
    a: Sí. Los contratos de BCH se escriben en CashScript o directamente en script BCH y se ejecutan en la VM de Bitcoin Cash. Desde mayo de 2026 esa VM tiene bucles y funciones. Los contratos de Cardano se escriben en Aiken, Plutus y otros lenguajes que compilan a Untyped Plutus Core.
  - q: ¿Tiene Bitcoin Cash tokens nativos como Cardano?
    a: Sí. CashTokens (mayo de 2023) puso los tokens fungibles y los NFTs directamente en las salidas BCH, sin contrato de token. Los activos nativos de Cardano también los gestiona el propio libro contable, regidos por una política de acuñación.
  - q: ¿Cardano es de prueba de participación y Bitcoin Cash de prueba de trabajo?
    a: Sí. Cardano funciona con la prueba de participación Ouroboros, con un staking sin bloqueo de fondos y sin penalizaciones (slashing). Bitcoin Cash funciona con prueba de trabajo SHA-256, como Bitcoin.
sources:
  - title: Extended UTXO model explained (Cardano Docs)
    url: https://docs.cardano.org/about-cardano/learn/eutxo-explainer
  - title: Native tokens (Cardano Docs)
    url: https://docs.cardano.org/developer-resources/native-tokens
  - title: Fee structure (Cardano Docs)
    url: https://docs.cardano.org/about-cardano/explore-more/fee-structure
  - title: Time handling on Cardano (Cardano Docs)
    url: https://docs.cardano.org/about-cardano/explore-more/time
  - title: Cardano.org
    url: https://cardano.org/
  - title: Cardano (Wikipedia)
    url: https://en.wikipedia.org/wiki/Cardano_(blockchain_platform)
  - title: Aiken language
    url: https://aiken-lang.org/
  - title: Cardano moves to full decentralized governance after Plomin hard fork (The Block)
    url: https://www.theblock.co/post/337680/cardano-plans-transition-to-full-decentralized-governance-after-wednesdays-plomin-hard-fork
  - title: Inside Cardano's van Rossem hard fork (CoinDesk, julio de 2026)
    url: https://www.coindesk.com/markets/2026/07/20/inside-cardano-s-van-rossum-hard-fork-and-what-it-means-for-users
  - title: Recent Cardano governance actions (Intersect)
    url: https://www.intersectmbo.org/news/recent-cardano-governance-actions
  - title: Bitcoin Cash (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin_Cash
  - title: CashTokens CHIP specification
    url: https://cashtokens.org/docs/spec/chip
  - title: May 15, 2022 upgrade specification (native introspection)
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
  - title: Bitcoin Cash Node v27.0.0 release notes (ABLA)
    url: https://docs.bitcoincashnode.org/doc/release-notes/release-notes-27.0.0/
  - title: Bitcoin Cash Node v28.0.0 release notes (VM Limits, BigInt)
    url: https://docs.bitcoincashnode.org/doc/release-notes/release-notes-28.0.0/
  - title: Announcing Bitcoin Cash Node v29.0.0
    url: https://bitcoincashnode.org/en/newsroom/announcing-bitcoin-cash-node-v29-0-0
  - title: Bitcoin Cash Upgrade 2026 (bitjson)
    url: https://blog.bitjson.com/bitcoin-cash-upgrade-2026/
  - title: About Bitcoin Cash (CashScript docs)
    url: https://cashscript.org/docs/basics/about-bch
  - title: Lower the default relay fee (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/lower-the-default-relay-fee-create-a-fee-estimation-algorithm/440
translation:
  sourceHash: 7dad31e4c20a8939
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

Cardano y Bitcoin Cash son parientes más cercanos que la mayoría de las parejas que se suelen comparar. Ambas conservan la idea de [UTXO](/glossary#utxo) de Bitcoin: las monedas son salidas discretas, cada una con su propio bloqueo. Ambas ponen los tokens en el propio libro contable. Se diferencian en el consenso, en cómo los contratos ven el mundo y en cómo se gobierna la cadena.

## Cómo llegaron hasta aquí

Bitcoin Cash se separó de Bitcoin el 1 de agosto de 2017. Conservó el tope de 21 millones, la minería SHA-256 y los bloques de 10 minutos. Las funciones de contratos llegaron en actualizaciones anuales de mayo: [introspección](/glossary#introspection) nativa en 2022, [CashTokens](/upgrades/2023-05-cashtokens) en 2023, un límite de tamaño de bloque adaptativo en 2024, [límites de la VM y enteros grandes](/upgrades/2025-05-vm-limits-bigint) en 2025 y [bucles, funciones, operaciones a nivel de bits y pago a script](/upgrades/2026-05-upgrade) en 2026.

Cardano se lanzó en 2017 como una nueva cadena de prueba de participación basada en Ouroboros, un protocolo de consenso revisado por pares. Su nodo está escrito en Haskell. El hard fork Plomin del 29 de enero de 2025 activó la gobernanza completa en la cadena según el CIP-1694: los DReps, los stake pools y un Comité Constitucional votan ahora los retiros de la tesorería, los hard forks y la constitución. El hard fork van Rossem (versión 11 del protocolo) se activó el 18 de julio de 2026. Fue el primer hard fork de Cardano propuesto y ratificado íntegramente mediante la gobernanza en la cadena. Redujo los costos de ejecución de los contratos inteligentes y prepara la actualización de escalado Ouroboros Leios, prevista para más adelante en 2026.

## Diferencias de diseño

| | Bitcoin Cash (BCH) | Cardano (ADA) |
|---|---|---|
| Tiempo de bloque | ~10 minutos (prueba de trabajo) | ~20 segundos (slots de 1 s, 5 % activos) |
| Política de tamaño de bloque | Límite adaptativo (ABLA), mínimo de 32 MB, crece con el uso sostenido | Parámetro del protocolo, modificado por voto de gobernanza |
| Modelo de comisiones | Tasa fija por byte; 1 sat/byte por defecto | `a × size + b`, más costos de ejecución de scripts |
| Modelo de contratos inteligentes | [Covenants](/glossary#covenant) de UTXO (contratos que limitan cómo se pueden gastar las monedas) con opcodes (códigos de operación) de introspección | eUTXO: datum, redeemer, contexto del script |
| Tokens | [CashTokens](/glossary#cashtokens) nativos dentro de las salidas | Activos nativos bajo una política de acuñación; las salidas necesitan un mínimo de ADA |
| Lenguajes de contratos | [CashScript](/glossary#cashscript), script BCH directo | Aiken, Plutus (compilan a Untyped Plutus Core) |
| Privacidad | Libro contable transparente | Libro contable transparente |
| Consenso | Prueba de trabajo SHA-256 | Prueba de participación Ouroboros |
| Gobernanza | Fuera de la cadena; los equipos de nodos lanzan actualizaciones anuales basadas en CHIP | En la cadena: DReps, stake pools, Comité Constitucional |
| Suministro | Fijo, 21 millones | Máximo 45.000 millones |

## Una equivalencia justa: eUTXO frente a covenants de BCH

Si conoces un modelo, puedes leer el otro. Los conceptos se corresponden de cerca:

| eUTXO de Cardano | Bitcoin Cash |
|---|---|
| Datum (datos que lleva una salida) | Compromiso del NFT en un CashToken, de hasta 128 bytes desde 2026 |
| Redeemer (datos aportados para desbloquear) | Bytecode de desbloqueo que apila quien gasta |
| Contexto del script (la transacción completa) | Opcodes de [introspección](/glossary#introspection) que leen las entradas y las salidas |
| Política de acuñación | Categoría de token creada en una transacción de génesis; todo el suministro fungible se fija ahí, y los nuevos NFTs requieren un NFT con capacidad de acuñación, que puede custodiar un covenant |
| Script validador | Bytecode de bloqueo, a menudo escrito en CashScript |

Ambos modelos comparten las mismas fortalezas. La documentación de Cardano dice que en eUTXO las comisiones se conocen antes de enviar, que una transacción nunca falla a mitad de un script y que los nodos pueden validar en paralelo transacciones no relacionadas. La documentación de CashScript señala lo mismo sobre el estado local de BCH. Ambos comparten también la misma dificultad: muchos usuarios que acceden a una misma salida de un pool compartido tienen que turnarse.

## Dónde gana Bitcoin Cash

**Prueba de trabajo y suministro fijo.** BCH mantiene el calendario de emisión y el tope de 21 millones de Bitcoin, protegidos por la minería SHA-256. Algunos usuarios prefieren eso a una seguridad basada en participación. La advertencia honesta: BCH tiene una parte pequeña de la tasa de hash (hashrate) SHA-256.

**Salidas de tokens más simples.** Cardano exige que toda salida que contenga tokens contenga también una cantidad mínima de ADA, y ese mínimo crece con el número de tipos de token. Los [CashTokens](/cashtokens) de BCH van dentro de salidas normales, con la misma comisión fija por byte que cualquier pago.

**Franqueo fijo.** Las comisiones de BCH dependen solo de los bytes. Cardano suma un cargo por la ejecución de scripts a su fórmula basada en el tamaño. Ambas son predecibles. BCH es más fácil de calcular a mano. El panel en vivo de esta página muestra las comisiones actuales.

**Sin claves de administrador ni aprobaciones.** Esto vale en ambas cadenas: los tokens no necesitan `approve()` y los scripts quedan fijos una vez que las monedas se bloquean con ellos. Es una fortaleza de la familia UTXO, no exclusiva de BCH. Sigue habiendo posibilidad de errores; consulta los [riesgos](/risks).

**Pagos baratos que aparecen rápido.** Los pagos en BCH aparecen en las billeteras en segundos como [transacciones 0-conf](/glossary#zero-conf) (transacciones sin confirmar), con [pruebas de doble gasto](/glossary#dsproof) que alertan a los comercios.

## Dónde gana Cardano

Cardano va por delante en varios frentes, y conviene decirlo.

- **Métodos formales.** Cardano basa su diseño en investigación revisada por pares y desarrolla con Haskell y métodos formales. Su consenso cuenta con pruebas académicas de seguridad.
- **Gobernanza en la cadena y tesorería.** Los poseedores delegan en DReps que votan sobre gastos y actualizaciones. La tesorería financia el desarrollo mediante votaciones públicas; el ciclo presupuestario de 2025 funcionó con un tope de 350 millones de ADA. BCH no tiene tesorería y su base de desarrolladores es pequeña.
- **Staking.** Los poseedores de ADA pueden hacer staking sin bloqueo de fondos y sin penalizaciones (slashing). BCH no ofrece rendimiento por staking.
- **Herramientas.** Aiken le da a Cardano un lenguaje de contratos moderno y diseñado para ese fin. Plutus y Hydra suman más opciones.
- **Bloques más rápidos.** Unos 20 segundos frente a unos 10 minutos.

## Quién debería usar cuál

**Usa Cardano** si quieres staking, una cultura de métodos formales, una tesorería con fondos o voz en la gobernanza en la cadena.

**Usa Bitcoin Cash** si quieres dinero de prueba de trabajo con suministro fijo, comisiones fijas por byte y tokens nativos baratos. BCH también es un buen lugar para probar covenants al estilo Bitcoin en una cadena en funcionamiento. Lo que sabes sirve en ambos sentidos: la forma de pensar UTXO de Cardano se traslada a BCH, y viceversa. Empieza en [/build](/build), lee la [referencia de opcodes](/opcodes) y consulta los metadatos de tokens mediante [BCMR](/glossary#bcmr) y los listados en [TokenStork](https://tokenstork.com).

Para otras comparaciones, consulta [BCH frente a Ethereum](/compare/bch-vs-eth) y [BCH frente a Solana](/compare/bch-vs-sol).
