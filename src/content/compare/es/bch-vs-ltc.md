---
title: Bitcoin Cash frente a Litecoin (BCH frente a LTC)
description: 'BCH frente a LTC, sin rodeos: dos monedas de pago comparadas en tiempo de bloque, comisiones, privacidad MWEB, tokens nativos, covenants, ETFs y soporte en exchanges.'
verified: 2026-09-26T00:00:00.000Z
rival: Litecoin
ticker: LTC
faq:
  - q: ¿Es Bitcoin Cash mejor que Litecoin?
    a: Para cosas distintas. Litecoin confirma bloques cuatro veces más seguido, ofrece privacidad opcional con MWEB y tiene un ETF al contado en EE. UU. Bitcoin Cash tiene mayor capacidad de bloque, tokens nativos (CashTokens) y un sistema de contratos más potente. Ambas apuntan a pagos cotidianos baratos.
  - q: ¿Cuál es más rápida, Bitcoin Cash o Litecoin?
    a: Litecoin apunta a un bloque cada 2,5 minutos; Bitcoin Cash, a uno cada 10 minutos. Los pagos en Bitcoin Cash aparecen en las billeteras en segundos, antes de confirmarse, y las pruebas de doble gasto hacen que sea más seguro aceptar esos pagos sin confirmar.
  - q: ¿Es Litecoin más privada que Bitcoin Cash?
    a: Puede serlo. MWEB de Litecoin, activado en mayo de 2022, es un bloque de extensión opcional que oculta montos y direcciones. Bitcoin Cash es un registro transparente; su principal herramienta de privacidad es CashFusion, una función de mezcla opcional en algunas billeteras.
  - q: ¿Existe un ETF de Litecoin?
    a: Sí. Canary Capital lanzó el Canary Litecoin ETF (LTCC), un ETF al contado de Litecoin, en Nasdaq el 28 de octubre de 2025. A septiembre de 2026 no hay un ETF al contado de Bitcoin Cash en EE. UU.; Grayscale solicitó convertir su Bitcoin Cash Trust, a la espera de la aprobación de la SEC.
  - q: ¿Son Bitcoin Cash y Litecoin bifurcaciones de Bitcoin?
    a: Ambas provienen del código de Bitcoin, de maneras distintas. Litecoin se lanzó en 2011 como una cadena separada con su propio historial. Bitcoin Cash se separó de la propia cadena de Bitcoin en agosto de 2017 y comparte el historial de Bitcoin hasta ese momento.
sources:
  - title: Litecoin (Wikipedia)
    url: https://en.wikipedia.org/wiki/Litecoin
  - title: Bitcoin Cash (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin_Cash
  - title: Litecoin Successfully Activates SegWit (CoinDesk)
    url: https://www.coindesk.com/markets/2017/05/10/litecoin-successfully-activates-segwit
  - title: Litecoin activates SegWit, completes first Lightning Network transaction (Bitcoin.com News)
    url: https://news.bitcoin.com/litecoin-activates-segwit-completes-first-lightning-network-transaction/
  - title: Major Korean exchanges delist Litecoin due to its new privacy features (The Block)
    url: https://www.theblock.co/post/150799/major-korean-exchanges-delist-litecoin-due-to-its-new-privacy-features
  - title: Why did Upbit and Bithumb just delist Litecoin? (CoinGeek)
    url: https://coingeek.com/why-did-upbit-and-bithumb-just-delist-litecoin/
  - title: Canary Capital Launches Canary Litecoin ETF (LTCC) (ETFGI)
    url: https://etfgi.com/news/stories/2025/10/canary-capital-launches-canary-litecoin-etf-ltcc
  - title: Canary Capital Launches Canary Litecoin ETF (LTCC) (Canary Capital)
    url: https://www.canary.capital/thought-leadership/canary-capital-launches-canary-litecoin-etf-ltcc
  - title: 'Bitcoin Cash and the Grayscale ETF Filing: What Counts (CryptoTicker)'
    url: https://cryptoticker.io/en/bitcoin-cash-grayscale-etf-filing-check/
  - title: BCH upgrade specifications (Bitcoin Cash Node)
    url: https://upgradespecs.bitcoincashnode.org/
  - title: '2023-05-15 upgrade: CashTokens (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
  - title: '2024-05-15 upgrade: ABLA (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2024-05-15-upgrade/
  - title: '2025-05-15 upgrade: VM Limits and BigInt (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2025-05-15-upgrade/
  - title: '2026-05-15 upgrade: loops, functions, bitwise, P2S (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
  - title: ASERT difficulty adjustment (BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2020-11-15-asert/
  - title: Double-spend proofs specification (BCHN)
    url: https://upgradespecs.bitcoincashnode.org/dsproof/
  - title: CHIP-2023-04 Adaptive Blocksize Limit Algorithm
    url: https://gitlab.com/0353F40E/ebaa/-/raw/main/README.md
  - title: CashTokens specification
    url: https://github.com/cashtokens/cashtokens
  - title: CashFusion
    url: https://cashfusion.org/
translation:
  sourceHash: 1bcf41a085ff2fea
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

Litecoin y Bitcoin Cash son dos de los intentos más antiguos de hacer que el dinero al estilo de Bitcoin sea más barato y rápido de usar. Tomaron caminos distintos.

Charlie Lee lanzó Litecoin en 2011 como una cadena separada. Cambió algunos parámetros de Bitcoin: minería Scrypt en lugar de SHA-256, un objetivo de bloque de 2,5 minutos y un tope de 84 millones de monedas. Funciona como red propia desde entonces, y Dogecoin se mina de forma combinada con ella desde septiembre de 2014.

Bitcoin Cash se separó del propio Bitcoin el 1 de agosto de 2017. Conservó el historial de Bitcoin, la minería SHA-256, los bloques de 10 minutos y el tope de 21 millones, y eligió bloques más grandes en lugar de SegWit.

Las dos monedas tomaron decisiones opuestas en 2017. Litecoin activó SegWit el 10 de mayo de 2017, y el primer pago con Lightning en su red principal llegó al día siguiente. Bitcoin Cash rechazó SegWit y, en cambio, escaló la capa base.

## Diferencias de diseño

| | Bitcoin Cash (BCH) | Litecoin (LTC) |
|---|---|---|
| Lanzamiento | ago. 2017, separada de Bitcoin | 2011, cadena separada |
| Tiempo de bloque | 10 minutos | 2,5 minutos |
| Política de tamaño de bloque | Mínimo de 32 MB; [ABLA](/glossary#abla) eleva el límite según la demanda (desde 2024) | Límite fijo; SegWit activado en mayo de 2017 |
| Modelo de comisiones | Comisiones por byte | Comisiones por byte |
| Vía de escalado | En la cadena | En la cadena más Lightning |
| Contratos inteligentes | Bitcoin Script con introspección, enteros grandes, bucles y funciones | Script al estilo de Bitcoin |
| Tokens | [CashTokens](/cashtokens) nativos (2023) | Sin tipo de token nativo |
| Privacidad | Transparente; [CashFusion](/glossary#cashfusion) opcional | Cadena principal transparente; bloque de extensión MWEB opcional (2022) |
| Pagos sin confirmar | [0-conf](/glossary#zero-conf) (transacción sin confirmar) con [pruebas de doble gasto](/glossary#dsproof) | Esperar un bloque de 2,5 minutos o usar Lightning |
| Consenso / minería | Prueba de trabajo SHA-256 | Prueba de trabajo Scrypt, minería combinada con Dogecoin |
| Suministro | 21 millones | 84 millones |

El precio, las comisiones y las transacciones diarias cambian constantemente. Consulta el panel de cifras reales de esta página para ver datos en vivo.

## Dónde gana Bitcoin Cash

**Espacio de bloque.** Los bloques de BCH pueden contener hasta 32 MB hoy, y la [actualización ABLA](/upgrades/2024-05-abla) permite que ese límite crezca por regla cuando la demanda se mantiene alta. Los bloques actuales usan una pequeña fracción de eso, así que las comisiones se mantienen bajas sin una segunda capa.

**Tokens nativos.** Desde la [actualización CashTokens](/upgrades/2023-05-cashtokens) de mayo de 2023, cualquier salida de BCH puede llevar tokens fungibles o un NFT. No hay que desplegar ningún contrato de token ni aprobar ninguna autorización. Litecoin no tiene nada equivalente integrado en sus reglas de consenso.

**Contratos.** BCH ha ampliado Bitcoin Script cada mayo desde 2022: introspección, luego tokens, luego la [actualización de 2025 de límites de la VM y BigInt (aritmética de alta precisión)](/upgrades/2025-05-vm-limits-bigint) y después bucles y funciones en la [actualización de 2026](/upgrades/2026-05-upgrade). Eso hace de BCH un lugar práctico para escribir [covenants](/glossary#covenant): contratos que controlan a dónde pueden ir sus monedas después.

**0-conf más seguro.** Los nodos de BCH retransmiten [pruebas de doble gasto](/glossary#dsproof) cuando alguien intenta gastar la misma moneda dos veces. Eso da a los comercios una señal antes de que llegue un bloque.

**El mismo historial que Bitcoin.** BCH comparte el registro de Bitcoin hasta 2017 y su minería SHA-256. Para algunos usuarios, ese vínculo importa.

## Dónde gana Litecoin

**Bloques más rápidos.** Un objetivo de 2,5 minutos significa que la primera confirmación llega, en promedio, unas cuatro veces antes. Para un comercio que espera una confirmación, es una diferencia real.

**Privacidad opcional con MWEB.** Litecoin activó los MimbleWimble Extension Blocks el 20 de mayo de 2022. MWEB es opcional. Las monedas que se mueven a él obtienen montos y direcciones confidenciales. BCH no tiene ninguna función de privacidad a nivel de protocolo; [CashFusion](/glossary#cashfusion) es una herramienta opcional de las billeteras. MWEB tuvo un costo: Upbit, Bithumb, Coinone, Korbit y Gopax, en Corea del Sur, retiraron Litecoin de sus listados en junio de 2022, alegando normas contra el lavado de dinero.

**Un ETF al contado en EE. UU.** Canary Capital lanzó el Canary Litecoin ETF (LTCC) en Nasdaq el 28 de octubre de 2025. Bitcoin Cash no tiene un ETF al contado en EE. UU. Grayscale presentó el 11 de septiembre de 2026 una solicitud para convertir su Bitcoin Cash Trust (BCHG) en uno, pero la norma de cotización en la que se apoya aún no estaba aprobada y la solicitud no fija ninguna fecha.

**Lightning.** Litecoin admite canales de pago de Lightning y fue la primera red principal en realizar un pago con Lightning, en mayo de 2017.

**Liquidez y soporte en exchanges.** Litecoin tiene amplio soporte en exchanges y procesadores de pago. Consulta el panel en vivo para ver el volumen actual de ambas monedas.

**Seguridad de minería gracias a la minería combinada.** Los mineros de Dogecoin también protegen Litecoin, lo que une a dos grandes comunidades de Scrypt.

## Cuál conviene a quién

- **Elige LTC** si quieres primeras confirmaciones más rápidas, privacidad opcional en la cadena, Lightning o un ETF al contado que cotice en EE. UU.
- **Elige BCH** si quieres gran capacidad en la cadena, tokens nativos o contratos de UTXO que van mucho más allá de Bitcoin Script.
- **Para pagos simples,** ambas funcionan y ambas son baratas. Elige la que ya admitan tu billetera, tu exchange y tus contrapartes.

Bitcoin Cash tiene debilidades conocidas: un ecosistema pequeño, poca liquidez y bloques de 10 minutos. Lee primero la [página de riesgos, sin rodeos](/risks). Consulta también [BCH frente a Bitcoin](/compare/bch-vs-btc) y [BCH frente a Kaspa](/compare/bch-vs-kas).
