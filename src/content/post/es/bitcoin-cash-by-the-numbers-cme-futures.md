---
publishDate: 2026-09-30T00:00:00.000Z
draft: false
title: Bitcoin Cash en cifras, antes de los futuros de CME
excerpt: 'CME planea listar futuros de Bitcoin Cash el 19 de octubre. Así se ve la cadena que hay debajo: comisiones, actividad, tasa de hash, actualizaciones y sus límites, sin rodeos.'
category: Data
tags:
  - state of bch
  - cme
  - fees
author: Cash Marlowe
metadata:
  title: Bitcoin Cash en cifras, antes de los futuros de CME
  description: "CME lista futuros de Bitcoin Cash el 19 de octubre. La cadena que hay debajo, en cifras: comisión mediana de 0,0013\_US$, ~12.000 transacciones al día, 3,9 EH/s y los límites que admitimos."
translation:
  sourceHash: 52c4ade6b6ee3935
  status: machine
  translator: Claude
---

El 22 de septiembre, CME Group anunció que planea listar [futuros de Bitcoin Cash](https://www.prnewswire.com/news-releases/cme-group-to-expand-crypto-derivatives-suite-with-bitcoin-cash-and-uniswap-futures-302886066.html) a partir del 19 de octubre, sujeto a revisión regulatoria. Un contrato estándar equivale a 250 BCH. Un contrato Micro equivale a 25 BCH.

Los futuros son un evento del mercado, no de la red. Cambian quién puede operar con exposición a BCH. No cambian ni un solo byte de la cadena. Así que, antes de que los gráficos de precio acaparen la atención, así se ve la cadena en sí.

Aquí no hablamos de precio. Todo lo que sigue trata sobre la red.

## La cadena, en una tabla

Instantánea de nuestro proceso diario de datos, 30 de septiembre de 2026 (UTC):

| Métrica | Valor |
|---|---|
| Altura de bloque | 970.863 |
| Transacciones, últimas 24 horas | 11.953 |
| Comisión mediana | 0,0013 US$ |
| Bloques, últimas 24 horas | 153 (objetivo: 144) |
| Tasa de hash | 3,85 EH/s |
| Nodos accesibles | 757 |
| Transacciones sin confirmar | 36 |
| Tamaño total de la cadena | 217 GB |

Las versiones en vivo de estas cifras están en la página [El estado de BCH](/state-of-bch).

## Comisiones: la cifra para la que se creó BCH

| Cadena | Comisión mediana |
|---|---|
| **Bitcoin Cash** | **0,0013 US$** |
| Bitcoin | 0,11 US$ |
| Ethereum | 0,12 US$ |
| Litecoin | 0,0006 US$ |

Un pago típico en BCH cuesta alrededor de una décima de centavo. Eso es unas 90 veces más barato que Bitcoin o la capa base de Ethereum ese mismo día. Litecoin fue aún más barato. Lo mostramos porque mostramos todas las cifras, no solo las que nos favorecen.

Por qué se mantiene baja: BCH cobra por byte, no por cómputo. No hay subasta de gas. Y los bloques tienen mucho más espacio del que llena la demanda. El piso del límite de tamaño de bloque es de 32 MB, y el algoritmo [ABLA](/glossary#abla) lo eleva a medida que crece la demanda sostenida. Los bloques de hoy usan una pequeña fracción de eso.

## Actividad: pequeña, y lo decimos

Unas 12.000 transacciones al día es poco. Bitcoin procesó unas 655.000 ese mismo día. Ethereum procesó unos 2 millones.

Esa brecha es el punto de partida honesto de cualquier relato sobre BCH. La red funciona y le sobra capacidad. Los usuarios todavía no están ahí a la escala de las cadenas más grandes. Consulta nuestra página de [riesgos, sin rodeos](/risks) para ver el resto de la lista.

## Seguridad: SHA-256 compartido, menor proporción

BCH se mina con SHA-256, el mismo algoritmo que Bitcoin. Con 3,85 EH/s, BCH tiene una pequeña fracción de la tasa de hash (hashrate) de Bitcoin. Eso lo hace más barato de atacar, en principio. Dos cosas lo contrarrestan:

- **Puntos de control móviles.** Los nodos se niegan a reorganizar más de unos 10 bloques de profundidad.
- **Pruebas de doble gasto.** Los nodos retransmiten una prueba cuando alguien intenta hacer un doble gasto de un pago sin confirmar. Los comercios que aceptan pagos en segundos pueden comprobar si existe una.

Ninguna de las dos hace que atacar BCH sea tan caro como atacar Bitcoin. Por esa razón, los exchanges y los mercados de futuros eligen su propia profundidad de confirmación.

## Protocolo: una actualización cada mayo

BCH se ha actualizado puntualmente cada 15 de mayo:

- **2023:** [CashTokens](/cashtokens). Tokens fungibles y NFTs nativos, sin contrato de token.
- **2024:** [ABLA](/upgrades/2024-05-abla). Un límite de tamaño de bloque adaptativo.
- **2025:** [Límites de la VM y BigInt](/upgrades/2025-05-vm-limits-bigint). Más capacidad de cómputo para los contratos y aritmética de precisión arbitraria.
- **2026:** [Layla](/upgrades/2026-05-upgrade). Bucles, funciones, operaciones a nivel de bits y pay-to-script.

La próxima decisión llega pronto. Se espera que la actualización de mayo de 2027 quede fijada alrededor del 15 de noviembre. La principal candidata es [Faster Blocks](/blog/faster-blocks-1-minute-blocks-bitcoin-cash), que reduciría el tiempo de bloque de 10 minutos a 1 minuto. Todavía no está fijada.

## Ecosistema: lo que sigue vivo

Nuestro [directorio](/directory) revisa a diario cada proyecto listado. De 371 proyectos al 26 de septiembre: 288 vivos, 26 inactivos, 24 muertos y 33 desconocidos. Trasladamos los proyectos muertos a un cementerio en lugar de dejar enlaces rotos. Para los tokens, [TokenStork](https://tokenstork.com) sigue cada categoría de CashToken.

## Qué cambian los futuros y qué no

**Cambian:** fondos y traders regulados pueden tomar una posición en BCH sin tener monedas ni confiar en un exchange en el extranjero. Eso puede traer liquidez y atención.

**No cambian:** las comisiones, los tiempos de bloque, la capacidad, las actualizaciones ni la posibilidad de cualquiera de enviar BCH. Nada de eso depende de un mercado de futuros.

Si llegaste aquí por los futuros, empieza por [por qué Bitcoin Cash](/bitcoin-cash) y luego [cómo se compara con Bitcoin](/compare/bch-vs-btc). Si quieres comprobar las cifras tú mismo, [consigue una billetera](/onboard) y envía un pago. Cuesta alrededor de una décima de centavo.

*Cash Marlowe es el seudónimo editorial de BCH Works. Editado por George Donnelly.*
