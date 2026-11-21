---
title: Bitcoin Cash frente a Bitcoin Core (BCH frente a BTC)
description: 'BCH frente a BTC, sin rodeos: la división de 2017, bloques más grandes frente a SegWit y Lightning, tokens nativos y covenants, y dónde Bitcoin lleva clara ventaja.'
verified: 2026-09-26T00:00:00.000Z
rival: Bitcoin Core
ticker: BTC
faq:
  - q: ¿Es Bitcoin Cash mejor que Bitcoin?
    a: Depende del uso. Bitcoin tiene mucha más tasa de hash, liquidez, soporte en exchanges y productos institucionales, incluidos los ETFs al contado en EE. UU. Bitcoin Cash está diseñado para pagos baratos en la cadena y tiene un sistema de contratos más capaz. Elige BTC como reserva de valor a largo plazo con los mercados más profundos; elige BCH para pagar y desarrollar en la cadena por fracciones de centavo.
  - q: ¿Por qué Bitcoin Cash se bifurcó de Bitcoin?
    a: Un grupo de desarrolladores, activistas y mineros se opuso a la actualización SegWit y quería, en cambio, bloques más grandes. Dividieron la cadena el 1 de agosto de 2017, en el bloque 478559. Quien tuviera BTC en ese momento recibió la misma cantidad de BCH.
  - q: ¿Tienen Bitcoin y Bitcoin Cash el mismo suministro?
    a: Sí. Ambas tienen un límite fijo de 21 millones de monedas y ambas usan prueba de trabajo SHA-256. Comparten el mismo historial de transacciones hasta la división de 2017.
  - q: ¿Tiene Bitcoin Cash la Lightning Network?
    a: No. Bitcoin Cash, en cambio, escala en la cadena con bloques más grandes. Su límite de tamaño de bloque tiene un mínimo de 32 MB y, desde mayo de 2024, crece automáticamente con la demanda sostenida según el algoritmo ABLA.
  - q: ¿Puede Bitcoin Cash hacer cosas que Bitcoin no puede?
    a: Sí, a nivel de script. BCH tiene introspección nativa (2022), tokens nativos llamados CashTokens (2023), aritmética con enteros grandes (2025) y bucles acotados y funciones (2026). Los desarrolladores de Bitcoin aún debaten propuestas de covenants de este tipo.
  - q: ¿Existe un ETF de Bitcoin Cash?
    a: No en EE. UU., a septiembre de 2026. Grayscale presentó el 11 de septiembre de 2026 una solicitud para convertir su Bitcoin Cash Trust (BCHG) en un ETF en NYSE Arca, pero la cotización depende de una aprobación de la SEC que no se había producido al momento de esa solicitud. Los ETFs al contado de Bitcoin cotizan en EE. UU. desde el 11 de enero de 2024.
sources:
  - title: Bitcoin Cash (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin_Cash
  - title: Bitcoin (Wikipedia)
    url: https://en.wikipedia.org/wiki/Bitcoin
  - title: Lightning Network (Wikipedia)
    url: https://en.wikipedia.org/wiki/Lightning_Network
  - title: Especificaciones de las actualizaciones de BCH (Bitcoin Cash Node)
    url: https://upgradespecs.bitcoincashnode.org/
  - title: 'Actualización del 15 de mayo de 2019: firmas Schnorr (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2019-05-15-upgrade/
  - title: Ajuste de dificultad ASERT (BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2020-11-15-asert/
  - title: 'Actualización del 15 de mayo de 2022: introspección y enteros de 64 bits (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2022-05-15-upgrade/
  - title: 'Actualización del 15 de mayo de 2023: CashTokens (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
  - title: 'Actualización del 15 de mayo de 2024: ABLA (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2024-05-15-upgrade/
  - title: 'Actualización del 15 de mayo de 2025: límites de la VM y BigInt (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2025-05-15-upgrade/
  - title: 'Actualización del 15 de mayo de 2026: bucles, funciones, operaciones a nivel de bits y P2S (BCHN)'
    url: https://upgradespecs.bitcoincashnode.org/2026-05-15-upgrade/
  - title: Especificación de las pruebas de doble gasto (BCHN)
    url: https://upgradespecs.bitcoincashnode.org/dsproof/
  - title: CHIP-2023-04 Adaptive Blocksize Limit Algorithm
    url: https://gitlab.com/0353F40E/ebaa/-/raw/main/README.md
  - title: Especificación de CashTokens
    url: https://github.com/cashtokens/cashtokens
  - title: CashFusion
    url: https://cashfusion.org/
  - title: SEC Approves 11 Bitcoin Spot ETFs (Hunton)
    url: https://www.hunton.com/blockchain-legal-resource/sec-approves-11-bitcoin-spot-etfs
  - title: 'Bitcoin Cash and the Grayscale ETF Filing: What Counts (CryptoTicker)'
    url: https://cryptoticker.io/en/bitcoin-cash-grayscale-etf-filing-check/
  - title: CHIP-2025-03 Faster Blocks for Bitcoin Cash (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2025-03-faster-blocks-for-bitcoin-cash/1513/189
translation:
  sourceHash: 19babea6b11efb9f
  status: machine
  translator: Claude
  qaHash: 2784aeefc4ff9ac1
---

Bitcoin Cash y Bitcoin son la misma cadena hasta el 1 de agosto de 2017. En el bloque 478559 se dividieron. Todo poseedor de BTC en ese momento recibió también BCH. Ambas monedas siguen compartiendo minería SHA-256, bloques de 10 minutos y un límite de suministro de 21 millones.

La división fue por el escalado. Un bando apoyaba SegWit, un soft fork que cambió la forma de almacenar las firmas y preparó Bitcoin para canales de pago fuera de la cadena. Un grupo de desarrolladores, activistas y mineros con sede en China se opuso a SegWit y quería, en cambio, bloques más grandes. Bitcoin activó SegWit en agosto de 2017. Bitcoin Cash arrancó con bloques de 8 MB y subió el límite a 32 MB en 2018.

Desde entonces, las dos cadenas han tomado caminos distintos. Bitcoin avanza despacio y trata la capa base como capa de liquidación. Bitcoin Cash se actualiza una vez al año y trata la capa base como el lugar donde ocurren los pagos y los contratos.

## Diferencias de diseño

| | Bitcoin Cash (BCH) | Bitcoin (BTC) |
|---|---|---|
| Tiempo de bloque | 10 minutos | 10 minutos |
| Política de tamaño de bloque | Mínimo de 32 MB; [ABLA](/glossary#abla) sube el límite con la demanda sostenida (desde 2024) | 4 millones de unidades de peso (SegWit, 2017) |
| Ajuste de dificultad | [ASERT](/glossary#asert-daa), en cada bloque (desde noviembre de 2020) | Cada 2016 bloques (unas dos semanas) |
| Modelo de comisiones | Comisiones por byte; bloques muy por debajo del límite | Comisiones por byte (vbyte); los bloques compiten por un espacio limitado |
| Vía de escalado | En la cadena | Lightning Network (canales de pago fuera de la cadena) |
| Contratos inteligentes | Bitcoin Script más [introspección](/upgrades/2022-05-upgrade), enteros grandes, bucles y funciones | Bitcoin Script más Taproot (2021); opcodes (códigos de operación) de covenant (un contrato que limita cómo se pueden gastar las monedas) aún en debate |
| Tokens | [CashTokens](/cashtokens) nativos (2023) | Sin tipo de token nativo |
| Firmas | ECDSA y [Schnorr](/glossary#schnorr-signatures) (2019) | ECDSA y Schnorr mediante Taproot (2021) |
| Pagos sin confirmar | [0-conf (transacción sin confirmar)](/glossary#zero-conf) con [pruebas de doble gasto](/glossary#dsproof) | Esperar la confirmación o usar Lightning |
| Privacidad | Registro transparente; mezcla opcional con [CashFusion](/glossary#cashfusion) | Registro transparente; Lightning mantiene los pagos fuera de la cadena |
| Consenso | Prueba de trabajo SHA-256 | Prueba de trabajo SHA-256 |
| Suministro | 21 millones | 21 millones |

Las comisiones, la tasa de hash (hashrate) y el número de transacciones cambian a diario. El panel de cifras reales de esta página las muestra en vivo.

## Dónde gana Bitcoin Cash

**Pagos baratos en la cadena.** Los bloques de BCH están muy por debajo del mínimo de 32 MB, así que un pago normal no compite con otros usuarios por espacio en el bloque. Pagas una pequeña comisión por byte y el pago aparece en segundos. Los comercios que aceptan pagos antes de la confirmación pueden vigilar las [pruebas de doble gasto](/glossary#dsproof): los nodos retransmiten pruebas criptográficas si alguien intenta gastar la misma moneda dos veces.

**Un límite de tamaño de bloque que cambia según una regla.** La [actualización ABLA de 2024](/upgrades/2024-05-abla) sustituyó el enfoque de “discutirlo cada pocos años” por un algoritmo. El límite nunca baja de 32 MB. Crece cuando los bloques se mantienen llenos, con un tope de aproximadamente el doble por año bajo carga extrema.

**Contratos que Bitcoin todavía debate.** La comunidad de Bitcoin lleva años discutiendo propuestas de covenants. BCH ya los ejecuta. Los contratos pueden leer su propia transacción desde 2022. [CashTokens](/upgrades/2023-05-cashtokens) incorporó tokens fungibles y NFTs directamente en los [UTXOs](/glossary#utxo) en 2023, sin ningún contrato de token que desplegar. La [actualización de límites de la VM y BigInt de 2025](/upgrades/2025-05-vm-limits-bigint) aumentó el presupuesto de cómputo y añadió aritmética de alta precisión. La [actualización de 2026](/upgrades/2026-05-upgrade) añadió bucles acotados, funciones, operaciones a nivel de bits y pay-to-script. Si quieres probar el diseño de un [covenant](/glossary#covenant) en una cadena de prueba de trabajo en funcionamiento, BCH es un lugar barato para hacerlo.

**Actualizaciones predecibles.** BCH lanza actualizaciones de la red con un calendario fijo cada mayo, especificadas en CHIPs públicos. Una propuesta para reducir el tiempo de bloque a un minuto (CHIP-2025-03) está en revisión, pero no tiene consenso ni fecha de activación todavía.

## Dónde gana Bitcoin

**Presupuesto de seguridad y tasa de hash.** Ambas cadenas usan el mismo hardware SHA-256, y Bitcoin tiene, con diferencia, la mayor parte. Una tasa de hash mayor hace que un ataque del 51 % sea mucho más caro. Para liquidaciones grandes, las confirmaciones de BTC tienen más peso. Compara las cifras en vivo en el panel.

**Liquidez y soporte en exchanges.** Bitcoin tiene los mercados más profundos del mundo cripto y un soporte casi universal en los exchanges. La liquidez de BCH es real, pero mucho menor.

**Acceso institucional.** La SEC aprobó 11 ETFs al contado de Bitcoin en EE. UU. el 10 de enero de 2024, y empezaron a cotizar al día siguiente. BCH no tiene ETF al contado en EE. UU. Grayscale presentó el 11 de septiembre de 2026 una solicitud para convertir su Bitcoin Cash Trust (BCHG) en un ETF en NYSE Arca. La solicitud indica que la regla de cotización de la que depende aún no estaba aprobada y no da ninguna fecha.

**Lightning.** Lightning permite que dos partes abran un canal de pago y envíen muchos pagos fuera de la cadena, liquidando en la cadena solo al abrirlo o cerrarlo. Lightning Labs lo lanzó en la red principal en 2018. Tiene sus propias contrapartidas: los canales necesitan transacciones en la cadena y gestión de liquidez.

**Efecto de red y marca.** Para la mayoría de la gente, “Bitcoin” significa BTC. BCH carga con el costo de tener que explicarse. Además, pasó por sus propias divisiones, en 2018 y en 2020 (eCash).

## Quién debería usar cuál

- **Elige BTC** si quieres el activo de prueba de trabajo más líquido y seguro para guardar durante años, o si necesitas acceso a ETFs o institucional.
- **Elige BCH** si quieres pagar o cobrar en la cadena por fracciones de centavo, emitir tokens sin un contrato de token o crear y probar hoy covenants al estilo de Bitcoin.
- **Usa ambas.** Muchas personas guardan BTC como ahorro y usan BCH para gastar. Las dos monedas son complementarias más a menudo que rivales.

BCH también tiene debilidades que esta página no oculta: un ecosistema pequeño, poca liquidez y poco bombo. Lee la página [Riesgos, sin rodeos](/risks) antes de comprometer dinero. Para otras comparaciones, consulta [BCH frente a Litecoin](/compare/bch-vs-ltc) y [BCH frente a Kaspa](/compare/bch-vs-kas).
