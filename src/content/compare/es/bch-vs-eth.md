---
title: Bitcoin Cash frente a Ethereum (BCH frente a ETH)
description: 'BCH frente a ETH, con honestidad: covenants de UTXO frente a la EVM, comisiones por byte frente a gas, tokens nativos frente a aprobaciones ERC-20 y dónde Ethereum lleva una clara ventaja.'
verified: 2026-09-26T00:00:00.000Z
rival: Ethereum
ticker: ETH
faq:
  - q: ¿Es Bitcoin Cash mejor que Ethereum?
    a: 'Depende del uso. Ethereum tiene mucha más liquidez, stablecoins, desarrolladores y aplicaciones. Bitcoin Cash es dinero más simple: comisiones fijas por byte, tokens nativos sin el paso approve(), contratos sin claves de administrador y seguridad por prueba de trabajo. Elige BCH para pagos baratos y contratos de UTXO; elige Ethereum para DeFi profundo y mercados de stablecoins.'
  - q: ¿Puede Bitcoin Cash ejecutar contratos inteligentes?
    a: 'Sí. Bitcoin Cash ejecuta contratos de UTXO llamados covenants. Desde mayo de 2022 los contratos pueden inspeccionar su propia transacción (introspección), desde 2023 pueden contener tokens nativos (CashTokens) y las actualizaciones de 2025 y 2026 añadieron aritmética de enteros grandes, bucles y funciones. El modelo es distinto al de la EVM: cada contrato protege sus propias monedas en lugar de compartir un único estado global.'
  - q: ¿Tiene Bitcoin Cash comisiones de gas?
    a: No hay mercado de gas. La comisión en BCH se fija según el tamaño de la transacción en bytes; el valor predeterminado habitual es 1 satoshi por byte. Ethereum cobra gas por el cómputo, con una comisión base que se quema más una propina de prioridad.
  - q: ¿Bitcoin Cash usa prueba de trabajo y Ethereum prueba de participación?
    a: Sí. Bitcoin Cash usa prueba de trabajo SHA-256, como Bitcoin. Ethereum pasó de prueba de trabajo a prueba de participación con The Merge el 15 de septiembre de 2022.
  - q: ¿Tiene Bitcoin Cash tokens como los ERC-20?
    a: Sí. CashTokens (activado el 15 de mayo de 2023) colocó los tokens fungibles y los NFTs directamente dentro de las salidas de las transacciones. No hay ningún contrato de token que desplegar ni ninguna autorización approve() de la que un drainer pueda abusar.
  - q: ¿Tiene Bitcoin Cash MEV?
    a: 'BCH deja mucho menos margen para el front-running que Ethereum, porque los contratos mantienen un estado local y las comisiones son fijas por byte en lugar de una subasta de prioridad. No es cero: los mineros siguen ordenando las transacciones y los contratos de pool compartido con mucho uso pueden sufrir contención.'
sources:
  - title: Fusaka Mainnet Announcement (Ethereum Foundation)
    url: https://blog.ethereum.org/2025/11/06/fusaka-mainnet-announcement
  - title: Ethereum forks timeline (ethereum.org)
    url: https://ethereum.org/ethereum-forks/
  - title: The Merge (ethereum.org)
    url: https://ethereum.org/roadmap/merge/
  - title: ETH issuance and burn (ethereum.org)
    url: https://ethereum.org/roadmap/merge/issuance/
  - title: Blocks (ethereum.org)
    url: https://ethereum.org/developers/docs/blocks/
  - title: Gas and fees (ethereum.org)
    url: https://ethereum.org/developers/docs/gas/
  - title: Maximal extractable value (ethereum.org)
    url: https://ethereum.org/developers/docs/mev/
  - title: ERC-20 token standard (ethereum.org)
    url: https://ethereum.org/developers/docs/standards/tokens/erc-20/
  - title: Upgrading smart contracts (ethereum.org)
    url: https://ethereum.org/developers/docs/smart-contracts/upgrading/
  - title: Layer 2 (ethereum.org)
    url: https://ethereum.org/layer-2/
  - title: 'Glamsterdam date: Sepolia fork (CryptoTicker, agosto de 2026)'
    url: https://cryptoticker.io/en/ethereum-glamsterdam-date-sepolia-fork/
  - title: Network upgrades (EIPsInsight)
    url: https://eipsinsight.com/upgrade
  - title: Stablecoin supply by chain (DefiLlama API)
    url: https://stablecoins.llama.fi/stablecoinchains
  - title: Ethereum adds 16K developers in 2025 (Yahoo Finance, citando a Electric Capital)
    url: https://finance.yahoo.com/news/ethereum-adds-16k-developers-2025-091310770.html
  - title: Bitcoin Cash (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin_Cash
  - title: CashTokens CHIP specification
    url: https://cashtokens.org/docs/spec/chip
  - title: Bitcoin Cash Node v27.0.0 release notes (ABLA)
    url: https://docs.bitcoincashnode.org/doc/release-notes/release-notes-27.0.0/
  - title: Bitcoin Cash Node v28.0.0 release notes (VM Limits, BigInt)
    url: https://docs.bitcoincashnode.org/doc/release-notes/release-notes-28.0.0/
  - title: Announcing Bitcoin Cash Node v29.0.0
    url: https://bitcoincashnode.org/en/newsroom/announcing-bitcoin-cash-node-v29-0-0
  - title: Bitcoin Cash Upgrade 2026 (bitjson)
    url: https://blog.bitjson.com/bitcoin-cash-upgrade-2026/
  - title: About Bitcoin Cash (documentación de CashScript)
    url: https://cashscript.org/docs/basics/about-bch
  - title: Lower the default relay fee (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/lower-the-default-relay-fee-create-a-fee-estimation-algorithm/440
  - title: May 15, 2022 upgrade specification (native introspection)
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
  - title: Double Spend Proofs specification
    url: https://upgradespecs.bitcoincashnode.org/dsproof/
translation:
  sourceHash: c88cd21894a6dc0c
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

Bitcoin Cash y Ethereum ejecutan contratos inteligentes. Parten de extremos opuestos. Bitcoin Cash es el diseño de [UTXO](/glossary#utxo) de Bitcoin con contratos añadidos encima. Ethereum es una computadora mundial con dinero añadido encima. Esa sola diferencia explica casi todo lo que sigue.

## Cómo llegaron hasta aquí

Ethereum se lanzó el 30 de julio de 2015 (la versión Frontier). Pasó de prueba de trabajo a prueba de participación con The Merge el 15 de septiembre de 2022. Desde entonces ha lanzado Dencun (marzo de 2024), Pectra (mayo de 2025) y Fusaka (3 de diciembre de 2025). Fusaka añadió PeerDAS, para que los nodos tomen muestras de los datos de los blobs en lugar de descargarlos completos, y elevó el límite de gas a 60 millones. La próxima actualización, Glamsterdam, trae la separación entre proponente y constructor integrada en el protocolo (ePBS) y listas de acceso a nivel de bloque. A finales de septiembre de 2026 está en fase de red de pruebas pública, y los sitios de seguimiento no coinciden en la fecha final para la red principal.

Bitcoin Cash se separó de Bitcoin el 1 de agosto de 2017 por el tamaño de bloque. Mantiene el tope de 21 millones de Bitcoin, la minería SHA-256 y los bloques de 10 minutos. Desde entonces se ha actualizado cada mayo: [CashTokens](/upgrades/2023-05-cashtokens) en 2023, el límite de tamaño de bloque adaptativo en 2024, [los límites de la VM y los enteros grandes](/upgrades/2025-05-vm-limits-bigint) en 2025 y [bucles, funciones, operaciones a nivel de bits y pay-to-script](/upgrades/2026-05-upgrade) en 2026.

Las dos cadenas no están relacionadas por una bifurcación. Son dos respuestas a la pregunta “¿cómo debería una blockchain hacer algo más que enviar monedas?”

## Diferencias de diseño

| | Bitcoin Cash (BCH) | Ethereum (ETH) |
|---|---|---|
| Tiempo de bloque | ~10 minutos (prueba de trabajo) | Slots de 12 segundos |
| Política de tamaño de bloque | Límite adaptativo (ABLA), mínimo de 32 MB, crece con el uso sostenido | Límite de gas fijado por votos de los validadores, hasta 1/1024 por bloque |
| Modelo de comisiones | Tasa fija por byte; 1 sat/byte por defecto | Gas por cada paso de cómputo; comisión base quemada más propina de prioridad (EIP-1559) |
| Modelo de contratos inteligentes | [Covenants](/glossary#covenant) de UTXO (contratos que limitan cómo se pueden gastar las monedas); cada contrato protege sus propias monedas | Modelo de cuentas; los contratos de la EVM comparten un único estado global |
| Tokens | [CashTokens](/glossary#cashtokens) nativos dentro de las salidas; sin contrato de token | Contratos ERC-20 / ERC-721 con autorizaciones `approve()` |
| Capacidad de actualización | El código del contrato queda fijo una vez que se bloquean monedas en él | Los patrones de proxy permiten a un administrador cambiar la lógica del contrato |
| Privacidad | Registro transparente | Registro transparente |
| Consenso | Prueba de trabajo SHA-256 | Prueba de participación |
| Suministro | Fijo en 21 millones | Sin tope fijo; emisión para quienes hacen staking, comisiones base quemadas |

## Dónde gana Bitcoin Cash

**Tokens sin aprobaciones.** Un token ERC-20 es un contrato. Para negociarlo, normalmente llamas a `approve()` para que otro contrato pueda gastar tu saldo mediante `transferFrom()`. Los drainers de aprobaciones explotan justo esto. En BCH, un token es parte de la propia moneda. Lo gastas firmando, como cualquier otra moneda. No hay ninguna autorización esperando en la cadena a que alguien abuse de ella. Consulta [CashTokens](/cashtokens).

**Sin claves de administrador ni proxies actualizables.** En Ethereum, un contrato proxy puede apuntar a una lógica nueva, y ethereum.org advierte que quien tenga los derechos de actualización “puede cambiar todo el contrato” (traducción nuestra). Un covenant de BCH es bytecode fijado en la dirección de la moneda. Nadie puede cambiarlo después. Eso elimina toda una clase de rug pulls. No elimina los errores: un covenant mal escrito sigue estando mal escrito. Nuestra [página de riesgos](/risks) lo explica.

**Franqueo, no gas.** Ethereum pone precio al cómputo en gas, y los usuarios pujan con propinas por espacio en el bloque. Las billeteras de BCH suelen pagar 1 satoshi por byte, haga lo que haga el script. Las comisiones son fáciles de prever antes de firmar. El panel en vivo de esta página muestra la comisión mediana de hoy en ambas cadenas.

**Mucho menos margen para el front-running.** El MEV en Ethereum surge de reordenar transacciones frente al estado compartido: los bots vigilan la mempool y pujan más que tú. Los contratos de BCH solo ven su propia transacción ([estado local](/glossary#introspection)) y no hay subasta de gas por prioridad. Eso deja mucho menos margen para el front-running. No es cero: los mineros siguen eligiendo el orden y los contratos de pool compartido con mucho uso pueden competir por la misma moneda.

**Paralelo por defecto.** Cada UTXO se gasta una sola vez. Las transacciones que tocan monedas distintas pueden validarse en paralelo. La documentación de CashScript señala este estado local como la razón por la que BCH escala con comisiones bajas.

**Prueba de trabajo.** Algunos usuarios quieren que la emisión y la seguridad estén ligadas a la energía y al hardware, no al capital en staking. BCH ofrece eso, con el suministro fijo de Bitcoin. La contrapartida es real: BCH tiene una pequeña parte de la tasa de hash (hashrate) SHA-256.

**Pagos baratos que aparecen rápido.** Los pagos en BCH aparecen en las billeteras en segundos como transacciones [0-conf](/glossary#zero-conf) (transacciones sin confirmar). [Las pruebas de doble gasto](/glossary#dsproof) avisan a los comercios si alguien intenta gastar la misma moneda dos veces.

## Dónde gana Ethereum

Hay que ser claros. En la mayoría de los indicadores del ecosistema, Ethereum lleva una ventaja de órdenes de magnitud.

- **Liquidez y DeFi.** Los préstamos, los DEXs (exchanges descentralizados) y los derivados en Ethereum empequeñecen cualquier cosa en BCH.
- **Stablecoins.** Ethereum tiene la mayor oferta de stablecoins (monedas estables) de todas las cadenas (DefiLlama, septiembre de 2026). BCH no tiene USDT ni USDC en su capa base.
- **Desarrolladores.** Los datos de Electric Capital situaron a Ethereum en primer lugar por desarrolladores activos en 2025. BCH tiene una base de desarrolladores pequeña y no tiene tesorería.
- **Capas 2.** Arbitrum, Base, Optimism, Starknet y otras heredan la seguridad de Ethereum y ofrecen comisiones bajas. BCH no tiene un ecosistema de rollups comparable.
- **Herramientas y contratación.** Solidity, Foundry, Hardhat, las firmas de auditoría y las billeteras están maduras y es fácil contratar gente que las conozca. Los contratos de UTXO son más difíciles de escribir y menos gente sabe hacerlo.
- **Bloques rápidos.** Los slots de 12 segundos superan a los bloques de 10 minutos en la confirmación en la cadena, aunque el 0-conf de BCH cubre muchos casos de pago.

## Quién debería usar cuál

**Usa Ethereum** (o una L2 de Ethereum) si necesitas liquidez profunda, stablecoins en dólares, un gran ecosistema DeFi o una gran reserva de talento para contratar.

**Usa Bitcoin Cash** si quieres enviar dinero por mucho menos de un centavo, emitir tokens sin desplegar un contrato o crear contratos que ningún administrador pueda cambiar. También es adecuado para desarrolladores de Bitcoin que quieren probar ideas de covenants en una cadena real. Empieza en [/build](/build), aprende [CashScript](/glossary#cashscript) y explora la [referencia de opcodes (códigos de operación)](/opcodes). Los metadatos de los tokens usan [BCMR](/glossary#bcmr); los listados de tokens están en [TokenStork](https://tokenstork.com).

Muchos desarrolladores usan ambas. Para otras comparaciones, consulta [BCH frente a Solana](/compare/bch-vs-sol) y [BCH frente a Cardano](/compare/bch-vs-ada).
