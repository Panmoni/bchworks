---
title: Bitcoin Cash frente a Kaspa (BCH frente a KAS)
description: 'BCH frente a KAS: bloques de 10 minutos frente a una blockDAG de 10 bloques por segundo, CashTokens frente a los nuevos covenants de Kaspa y lo que mejor hace cada cadena de prueba de trabajo.'
verified: 2026-09-26T00:00:00.000Z
rival: Kaspa
ticker: KAS
faq:
  - q: ¿Es Kaspa más rápida que Bitcoin Cash?
    a: Sí, en confirmaciones. Kaspa produce 10 bloques por segundo en una blockDAG, así que una transacción recibe su primera confirmación en aproximadamente un segundo. Bitcoin Cash tiene como objetivo un bloque cada 10 minutos. Los pagos en BCH aparecen igualmente en las billeteras en segundos como transacciones sin confirmar, protegidas por pruebas de doble gasto, pero no se confirman tan rápido.
  - q: ¿Tiene Kaspa contratos inteligentes?
    a: Sí, desde que el hard fork Toccata se activó el 30 de junio de 2026. Añadió contratos tipo covenant, emisión nativa de tokens, opcodes de verificación de pruebas de conocimiento cero y el lenguaje de contratos SilverScript. Bitcoin Cash admite covenants de UTXO desde su actualización de introspección de 2022 y tokens nativos desde 2023.
  - q: ¿Es Bitcoin Cash mejor que Kaspa?
    a: Responden a necesidades distintas. Kaspa va por delante en velocidad de confirmación y tiene una historia reciente de lanzamiento justo. Bitcoin Cash tiene una trayectoria más larga, la minería SHA-256 y la historia de Bitcoin, y una plataforma de contratos que ha publicado actualizaciones cada mayo desde 2022. Elige según lo que necesite tu aplicación.
  - q: ¿Qué es GHOSTDAG?
    a: GHOSTDAG es el protocolo de consenso de Kaspa. En lugar de descartar los bloques minados al mismo tiempo, los conserva todos y los ordena en un grafo acíclico dirigido (una blockDAG). Eso permite a Kaspa producir muchos bloques por segundo sin desperdiciar trabajo en bloques huérfanos.
  - q: ¿Qué es DAGKnight?
    a: DAGKnight es el sucesor previsto de GHOSTDAG en Kaspa. A septiembre de 2026, es el siguiente punto de la hoja de ruta de Kaspa después de Toccata y no tiene fecha de activación fija.
  - q: ¿Cuál es la oferta máxima de Kaspa frente a Bitcoin Cash?
    a: Kaspa tiene una oferta máxima fija de unos 28.700 millones de KAS. Bitcoin Cash tiene un límite fijo de 21 millones de BCH.
sources:
  - title: LORE (Kaspa.org)
    url: https://kaspa.org/lore
  - title: What is Kaspa (KAS)? The Fastest Proof-of-Work Blockchain (Coinstancy)
    url: https://coinstancy.com/academy/guides/kaspa/
  - title: 'Kaspa in 2025: Crescendo Hard Fork Leads Major Updates (BSC News)'
    url: https://bsc.news/post/kaspa-crescendo-hard-fork-updates
  - title: Kaspa Price Jumps 10% as Toccata Hard Fork Introduces Smart Contracts (CoinAlertNews)
    url: https://coinalertnews.com/news/2026/06/30/kaspa-toccata-hard-fork-upgrade
  - title: Kaspa Roadmap 2026-2027 (Our Crypto Talk)
    url: https://ourcryptotalk.com/blog/kaspa-roadmap-2026-2027
  - title: Bitcoin Cash (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin_Cash
  - title: BCH upgrade specifications (Bitcoin Cash Node)
    url: https://upgradespecs.bitcoincashnode.org/
  - title: '2022-05-15 upgrade: introspection and 64-bit integers (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
  - title: '2023-05-15 upgrade: CashTokens (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
  - title: '2024-05-15 upgrade: ABLA (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2024-05-15-upgrade/
  - title: '2025-05-15 upgrade: VM Limits and BigInt (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2025-05-15-upgrade/
  - title: '2026-05-15 upgrade: loops, functions, bitwise, P2S (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
  - title: Double-spend proofs specification (BCHN)
    url: https://upgradespecs.bitcoincashnode.org/dsproof/
  - title: CHIP-2023-04 Adaptive Blocksize Limit Algorithm
    url: https://gitlab.com/0353F40E/ebaa/-/raw/main/README.md
  - title: CashTokens specification
    url: https://github.com/cashtokens/cashtokens
  - title: CHIP-2025-03 Faster Blocks for Bitcoin Cash (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-for-bitcoin-cash/1513/189
translation:
  sourceHash: 577eb24e2581f24f
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

Bitcoin Cash y Kaspa son cadenas de prueba de trabajo basadas en UTXO. No comparten historia. BCH desciende de Bitcoin y mantiene la cadena de bloques de 10 minutos de Bitcoin. Kaspa empezó desde cero con una estructura diferente: una blockDAG que acepta muchos bloques a la vez.

## Dos puntos de partida diferentes

Bitcoin Cash se separó de Bitcoin el 1 de agosto de 2017. Heredó el historial completo de Bitcoin, la minería SHA-256 y el límite de 21 millones. Desde 2022 usa una actualización anual en mayo para ampliar Bitcoin Script hasta convertirlo en una plataforma de contratos completa.

Kaspa nació el 7 de noviembre de 2021 con un lanzamiento justo: sin preminado, sin ICO y sin asignación para los fundadores. Usa el protocolo GHOSTDAG. En una cadena normal, dos bloques encontrados en el mismo momento compiten y uno se descarta. GHOSTDAG conserva ambos y los ordena en un grafo acíclico dirigido. Ese diseño permite a Kaspa producir muchos más bloques por segundo.

Kaspa ha avanzado rápido en dos años:

- **Crescendo, 5 de mayo de 2025:** la tasa de bloques pasó de 1 a 10 bloques por segundo. El nodo se reescribió en Rust para hacerlo posible.
- **Toccata, 30 de junio de 2026:** Kaspa incorporó contratos tipo covenant (un contrato que limita cómo se pueden gastar las monedas) en la capa 1, emisión nativa de tokens, opcodes (códigos de operación) de verificación de pruebas de conocimiento cero y SilverScript, un lenguaje de contratos de alto nivel.
- **Lo siguiente:** DAGKnight, un protocolo de consenso sucesor, es el paso previsto después de Toccata. No tiene fecha fija. La hoja de ruta de Kaspa fija 100 bloques por segundo como objetivo a largo plazo. VProgs, una capa de programabilidad más amplia, sigue en fase de investigación.

## Diferencias de diseño

| | Bitcoin Cash (BCH) | Kaspa (KAS) |
|---|---|---|
| Lanzamiento | ago. de 2017, separada de Bitcoin | nov. de 2021, lanzamiento justo |
| Estructura | Cadena de bloques | BlockDAG (GHOSTDAG) |
| Tiempo de bloque | 10 minutos | 10 bloques por segundo (desde mayo de 2025) |
| Política de tamaño de bloque | Mínimo de 32 MB; [ABLA](/glossary#abla) eleva el límite con demanda sostenida | Muchos bloques pequeños; la capacidad viene de la tasa de bloques |
| Modelo de comisiones | Comisiones por byte | Comisiones por transacción |
| Contratos inteligentes | [Covenants](/glossary#covenant) desde 2022; bucles y funciones desde 2026 | Covenants desde Toccata (junio de 2026); lenguaje SilverScript |
| Tokens | [CashTokens](/cashtokens) nativos (2023) | Emisión nativa de tokens (Toccata, 2026) |
| Conocimiento cero | Posible en script con BigInt (aritmética de alta precisión); sin opcode dedicado | Opcodes dedicados de verificación ZK (Toccata) |
| Pagos sin confirmar | [0-conf (transacción sin confirmar)](/glossary#zero-conf) con [pruebas de doble gasto](/glossary#dsproof) | Primera confirmación en aproximadamente un segundo |
| Privacidad | Transparente; [CashFusion](/glossary#cashfusion) opcional | Transparente |
| Consenso / minería | Prueba de trabajo SHA-256 | Prueba de trabajo kHeavyHash |
| Oferta | 21 millones | Unos 28.700 millones |

Las comisiones, la tasa de hash (hashrate) y el número de transacciones cambian cada día. El panel Real Numbers de esta página muestra las cifras en tiempo real.

## Dónde gana Bitcoin Cash

**Madurez de los contratos.** Los contratos de BCH pueden leer su propia transacción desde la [actualización de introspección de 2022](/upgrades/2022-05-upgrade). Los [CashTokens](/upgrades/2023-05-cashtokens) funcionan en la red principal desde mayo de 2023. La [actualización de límites de la VM y BigInt de 2025](/upgrades/2025-05-vm-limits-bigint) y la [actualización de 2026](/upgrades/2026-05-upgrade) añadieron aritmética de números grandes, bucles y funciones. La capa de contratos de Kaspa entró en funcionamiento en junio de 2026. BCH ha tenido años más para que salgan a la luz los errores, las billeteras adopten los tokens y las herramientas se consoliden.

**Linaje de Bitcoin.** BCH comparte el registro de Bitcoin hasta 2017, su minería SHA-256 y su límite de 21 millones. Los desarrolladores de Bitcoin pueden aplicar directamente sus conocimientos de script, y los [covenants](/glossary#covenant) de BCH muestran lo que Bitcoin podría ejecutar.

**Margen para crecer en la cadena.** El límite [ABLA](/upgrades/2024-05-abla) empieza en 32 MB y sube según una regla, y hoy los bloques usan una pequeña fracción de él.

**Consenso simple y bien estudiado.** Una sola cadena con bloques de 10 minutos es el diseño más analizado de la prueba de trabajo. La contrapartida es una confirmación más lenta.

## Dónde gana Kaspa

**Velocidad de confirmación.** Con 10 bloques por segundo, Kaspa incluye una transacción en un bloque en unos 100 milisegundos. La primera confirmación llega en aproximadamente un segundo y la seguridad probabilística completa en unos 10 segundos, según Coinstancy. Los comercios de BCH pueden aceptar pagos [0-conf](/glossary#zero-conf) en segundos, pero la primera confirmación tarda unos 10 minutos en promedio. Una propuesta de BCH para pasar a bloques de 1 minuto (CHIP-2025-03) sigue en revisión y no forma parte del consenso.

**Verificación ZK nativa.** Toccata añadió opcodes que verifican directamente pruebas de conocimiento cero. BCH puede hacer cálculos pesados en script, pero no tiene un opcode ZK dedicado.

**Historia de lanzamiento justo.** Kaspa no tuvo preminado ni asignación para personas internas. Cada moneda se minó a la vista de todos. La distribución inicial de BCH copió la de Bitcoin.

**Impulso.** Kaspa ha lanzado dos grandes hard forks en unos 14 meses y publica una ambiciosa hoja de ruta de escalado. Atrae una atención que BCH actualmente no tiene.

## Quién debería usar cuál

- **Elige KAS** si lo que más te importa es la velocidad de confirmación o si quieres desarrollar sobre una nueva plataforma de covenants con verificación ZK nativa.
- **Elige BCH** si quieres una plataforma de contratos con años de historial en la red principal, tokens nativos con un soporte maduro en las billeteras y el linaje SHA-256 de Bitcoin.
- **Desarrolladores:** los conocimientos de UTXO y de covenants sirven en ambas. Aprender en una ayuda en la otra.

Bitcoin Cash tiene debilidades reconocidas: un ecosistema pequeño, poca liquidez, poco revuelo y bloques de 10 minutos. Lee la [página Riesgos, sin rodeos](/risks). Compara también [BCH frente a Bitcoin Core](/compare/bch-vs-btc).
