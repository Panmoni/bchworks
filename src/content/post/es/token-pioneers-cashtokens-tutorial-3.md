---
publishDate: 2023-12-22T00:00:00.000Z
title: 'Comprender y trabajar con BCMR: metadatos CashTokens (Token Pioneers, tutorial 3)'
description: En este tercer tutorial de la serie Token Pioneers, vamos a analizar a fondo los metadatos CashTokens.
excerpt: En este tercer tutorial de la serie Token Pioneers, vamos a analizar a fondo los metadatos CashTokens.
image: ~/assets/images/blog/token-pioneers-3.png
category: Tutorial
tags:
  - cashtokens
  - token pioneers
  - BCMR
metadata:
  title: 'BCMR: metadatos CashTokens en Bitcoin Cash'
translation:
  sourceHash: 5a133b792841d683
  status: machine
  translator: Claude
  qaHash: afbbc6d78a0bd695
---

## Índice

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [¿Qué es BCMR?](#what-is-bcmr)
  - [¡El BCMR hace que tus tokens se vean bien!](#the-bcmr-makes-your-tokens-look-good)
  - [Archivos de texto JSON sencillos](#simple-json-text-files)
  - [Metadatos BCMR en billeteras, sitios web y dapps](#bcmr-metadata-in-wallets-websites-dapps)
  - [Por qué el BCMR](#why-the-bcmr)
  - [Los archivos BCMR son fáciles de crear y leer](#bcmr-files-are-easy-to-make-and-read)
    - [1. BCMR de un token fungible](#1-fungible-token-bcmr)
    - [2. BCMR de un NFT](#2-nft-bcmr)
  - [8 conceptos clave de BCMR](#8-key-bcmr-concepts)
    - [1. Esquema JSON de BCMR](#1-bcmr-json-schema)
      - [Componentes clave del esquema BCMR](#key-components-of-the-bcmr-schema)
    - [2. Token, identidad y categoría](#2-token-vs-identity-vs-category)
    - [3. Authhead y authbase](#3-authhead-authbase)
      - [Actualizaciones de metadatos](#metadata-updates)
      - [El authhead](#the-authhead)
      - [Términos en la cadena](#on-chain-terms)
      - [Ejemplos de authhead y authbase](#authhead-and-authbase-examples)
    - [4. Authchain y ZDTC](#4-authchain-zdtc)
      - [Identidades en Bitcoin Cash](#identities-on-bitcoin-cash)
      - [La salida de identidad y el OP_RETURN](#identity-output-the-op_return)
      - [Quema y fusión](#burning-merging)
      - [Resolución de la authchain](#authchain-resolution)
      - [Validación SPV](#spv-validation)
    - [5. Historial de identidad e instantáneas de identidad de BCMR](#5-bcmr-identity-history-identity-snapshots)
      - [Authchain frente a historial de identidad](#authchain-vs-identity-history)
      - [El historial de identidad genera confianza](#identity-history-builds-trust)
      - [Reconstrucción del historial de identidad](#identity-history-reconstruction)
      - [Migración](#migration)
    - [6. Decimales en BCMR](#6-bcmr-decimal-places)
    - [7. Registros resueltos por DNS](#7-dns-resolved-registries)
    - [8. Registros resueltos por la cadena](#8-chain-resolved-registries)
      - [Ejemplos de registros resueltos por la cadena](#examples-of-chain-resolved-registries)
      - [Otros tipos de registro](#other-registry-types)
    - [Conclusión sobre los conceptos de BCMR](#bcmr-concepts-conclusion)
- [Construir con BCMR](#building-with-bcmr)
  - [1. Explorar una authchain](#1-explore-an-authchain)
    - [Usar TokenExplorer.cash](#use-tokenexplorercash)
    - [Usar el indexador BCMR de Paytaca](#use-paytacas-bcmr-indexer)
    - [Usar Chaingraph.cash](#use-chaingraphcash)
    - [TAREA: rastrear una authchain por 500 XRBF](#task-trace-an-authchain-for-50-xrbf)
  - [2. Crear tu identidad personal y/o corporativa en la blockchain](#2-create-your-personal-andor-corporate-identity-on-the-blockchain)
    - [Crear un proyecto de Mainnet-JS](#create-a-mainnet-js-project)
    - [Identificar la transacción pregénesis](#identify-the-pre-genesis-transaction)
      - [getPreGenesisTX.js](#getpregenesistxjs)
    - [Crear el authbase de tu identidad](#create-your-identitys-authbase)
    - [Verificar ](#verify)
    - [Analizar](#analyze)
    - [Casos de uso](#use-cases)
    - [TAREA: crear una identidad por 1000 XRBF](#task-create-an-identity-for-100-xrbf)
  - [3. Actualizar los archivos BCMR de tus tokens y NFTs](#3-update-your-token-and-nft-bcmr-files)
    - [Actualización de XRBF](#updating-xrbf)
      - [¿El hash no coincide?](#hash-doesnt-match)
    - [¿Todavía no has creado un FT o un NFT?](#havent-created-an-ft-or-nft-yet)
    - [Requisitos para otr.cash](#otrcash-eligibility)
    - [CashTokens Studio](#cashtokens-studio)
    - [TAREA: actualizar una identidad por 2500 XRBF ](#task-update-an-identity-for-250-xrbf)
  - [4. Listar tu(s) token(s) en otr.cash y/o TokenStork.com](#4-get-your-tokens-listed-on-otrcash-andor-tokenstorkcom)
    - [Cómo crear un pull request](#how-to-create-a-pull-request)
      - [Repositorios de los registros](#registry-repos)
      - [Envío por correo electrónico](#email-submission)
    - [Esto es opcional](#this-is-optional)
    - [TAREA: enviar tu pull request por 7500 XRBF](#task-submit-your-pull-request-for-750-xrbf)
  - [5. Crear tu propio registro de metadatos basado en un dominio](#5-create-your-own-domain-based-metadata-registry)
- [Conclusión](#conclusion)
  - [Habilidades invaluables para desarrolladores](#invaluable-developer-skills)
  - [Apenas estamos empezando](#were-just-beginning)
  - [¡Lo que viene!](#next-up)
  - [¡Gana XRBF!](#earn-xrbf)
  - [Gracias](#thank-you)
  - [Estado de Token Pioneers](#token-pioneers-status-update)
  - [Apoyar la serie de tutoriales](#support-the-tutorial-series)
- [Recursos adicionales para desarrolladores](#additional-builder-resources)
  - [Herramientas de BCMR](#bcmr-tools)
  - [Herramientas JSON](#json-tools)
  - [Contenido sobre BCMR](#bcmr-content)
  - [Guías técnicas de BCMR](#bcmr-technical-guides)

<!-- TOC end -->

<!-- TOC --><a name="understanding-and-working-with-bcmr-cashtokens-metadata-token-pioneers-tutorial-3"></a>

En este tercer tutorial de la serie _Token Pioneers_, vamos a analizar a fondo los metadatos CashTokens.

Los metadatos importan en el ecosistema de CashTokens porque toman datos complejos en la cadena y los presentan en formatos fáciles de entender para las personas. Se usan en [TokenStork.com](https://TokenStork.com/), en tus billeteras favoritas compatibles con CashTokens (como [Paytaca](https://paytaca.com) y [Cashonize](https://cashonize.com)), en las dapps de BCH y en cualquier otro lugar donde se muestren tokens fungibles (FTs) y NFTs de CashTokens a usuarios y poseedores.

En este tutorial, comprenderás por completo los metadatos CashTokens y harás algunos ejercicios **por los que te pueden pagar**. Este tutorial es adecuado para todos los desarrolladores de BCH CashTokens que quieran entender a fondo los metadatos BCMR.

¡Acompáñanos a llevar al siguiente nivel tu forma de construir con CashTokens!

<!-- TOC --><a name="build-together"></a>

### Construir juntos

¡La comunidad de desarrolladores de BCH CashTokens crece rápido! Únete a uno de estos grupos de Telegram, o a ambos, para recibir ayuda y conversar con otros desarrolladores:

- [Panmoni CashTokens Builders](https://t.me/Panmoni/315)
- [CashToken Devs](https://t.me/cashtoken_devs)

Para una introducción a BCH CashTokens en general y a los CashTokens fungibles, consulta el [tutorial 1 de la serie Token Pioneers](/blog/token-pioneers-cashtokens-tutorial-1). Para los NFTs, consulta el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2). Para encontrar más comunidades de desarrolladores de CashTokens, visita [BitcoinCashSite.com/cashtokens](/cashtokens).

<!-- TOC --><a name="what-is-bcmr"></a>

## ¿Qué es BCMR?

Como aprendiste en los tutoriales [1](/blog/token-pioneers-cashtokens-tutorial-1#cashtokens-metadata) y [2](/blog/token-pioneers-cashtokens-tutorial-2#nft-metadata) de la serie _Token Pioneers_, los tokens fungibles (FTs) y los tokens no fungibles (NFTs) en BCH tienen un formato específico en la cadena que usa una cantidad mínima de datos.

Sin embargo, los metadatos de los tokens de CashTokens, es decir, los [tickers](/blog/token-pioneers-cashtokens-tutorial-1#cashtokens-metadata) (p. ej., BCH, BTC, ETH), los nombres de las monedas (p. ej., Tether, USD Coin, etc.), los decimales, las imágenes de los NFTs, etc., **no** se guardan en la blockchain de BCH.

Por eso necesitamos un protocolo ligero y extensible para guardar estos metadatos fuera de la cadena. Aquí es donde entra en juego la especificación BCMR (Bitcoin Cash Metadata Registries). El BCMR ahorra espacio en los bloques al vincular datos en la cadena complejos y a veces misteriosos con metadatos legibles fuera de la cadena.

**Nota al margen**: si sientes que ya dominas bien el BCMR, puedes saltarte la “teoría” e ir directo a la práctica en la sección [“Construir con BCMR”](#building-with-bcmr) más abajo.

<!-- TOC --><a name="the-bcmr-makes-your-tokens-look-good"></a>

### ¡El BCMR hace que tus tokens se vean bien!

Sin metadatos BCMR, tus tokens en billeteras y sitios web se verían como cadenas alfanuméricas largas e indescifrables. Los metadatos BCMR toman activos en la cadena y hacen que se vean bien, lo que facilita el uso masivo de la tecnología BCH para tokenizar activos tanto digitales como del mundo real.

Así que necesitarás el BCMR cuando crees tus tokens, NFTs y dapps en BCH. Pero no te preocupes: ¡trabajar con el BCMR es muy fácil!

<!-- TOC --><a name="simple-json-text-files"></a>

### Archivos de texto JSON sencillos

Los archivos BCMR son simples archivos de texto [JSON](https://en.wikipedia.org/wiki/JSON), alojados en un sitio web por https o en [IPFS](https://docs.ipfs.tech/concepts/what-is-ipfs/) (InterPlanetary File System). Este formato garantiza que sean fáciles de acceder, distribuir y actualizar.

Los archivos BCMR vinculan identidades (que pueden incluir tokens) con sus datos respectivos en la cadena al incluir el hash de la **transacción pregénesis**, también conocida como `category`.

<!-- TOC --><a name="bcmr-metadata-in-wallets-websites-dapps"></a>

### Metadatos BCMR en billeteras, sitios web y dapps

El BCMR les da a los proveedores de servicios y a los usuarios finales la autonomía para decidir qué metadatos usar. Este enfoque centrado en el usuario no solo aumenta la flexibilidad, sino que también está en línea con el espíritu de toma de decisiones descentralizada de la comunidad de BCH en general.

Y, a diferencia del estándar CRC-20, el BCMR no permite que nadie acapare símbolos de ticker.

<!-- TOC --><a name="why-the-bcmr"></a>

### Por qué el BCMR

BCH se distingue en el mundo de las criptomonedas como una expresión del whitepaper de Bitcoin que escala para cubrir las necesidades de transacciones resistentes a la censura de la humanidad sin usar soluciones de capa 2 (L2) como Lightning Network (BTC) o Polygon (Ethereum).

Como criptomoneda que, de forma única, busca escalar su capa 1 (L1, también conocida como red principal), el uso eficiente del espacio de bloque de BCH es fundamental. Al fin y al cabo, cada nodo de BCH tiene que guardar una copia de toda la cadena de bloques. Al momento de escribir esto, la blockchain de BCH se acerca a los [200 GB](https://blockchair.com/bitcoin-cash), y solo va a crecer con el tiempo.

De hecho, _tiene_ que crecer, y **mucho**, ya que el modelo de seguridad de BCH depende de escalar de modo que muchas comisiones de transacción pequeñas se sumen a la recompensa por bloque, cada vez menor, para competir por la tasa de hash (hashrate) de minería frente a otras blockchains.

<!-- TOC --><a name="bcmr-files-are-easy-to-make-and-read"></a>

### Los archivos BCMR son fáciles de crear y leer

Aquí tienes unos [metadatos BCMR de ejemplo](https://bafkreibvm5ferzeyo62x7lcocgrpwij2yrhz3d7vin4huervnr5z2s2ydm.ipfs.nftstorage.link/) de mi token fungible (FT) [Real Bitcoin Fam](https://RealBitcoinFam.com). Especifican el nombre de token “Real Bitcoin Fam Community Award Tokens”, el ticker XRBF y que este token tiene 2 decimales.

Como ves, ¡los archivos BCMR son muy fáciles de leer! También puedes usar un [formateador de JSON](https://jsonformatter.org/) o pegar el texto JSON BCMR en tu [editor de código](https://code.visualstudio.com/) para leerlo mejor.

<!-- TOC --><a name="1-fungible-token-bcmr"></a>

#### 1. BCMR de un token fungible

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": {
    "major": 0,
    "minor": 4,
    "patch": 0
  },
  "latestRevision": "2023-07-19T22:23:41.467Z",
  "registryIdentity": {
    "name": "BCMR for Real Bitcoin Fam",
    "description": "Self-published BCMR for Real Bitcoin Fam"
  },
  "identities": {
    "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887": {
      "2023-07-19T16:23:41.467Z": {
        "name": "Real Bitcoin Fam Community Award Tokens",
        "description": "Real Bitcoin Fam's community award token for rewarding new BCH builders who are building with CashTokens. Real Bitcoin Fam is a support network for Bitcoin, cryptocurrency and Web3 builders who align with an OG Bitcoin vibe.",
        "token": {
          "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
          "symbol": "XRBF",
          "decimals": 2
        },
        "uris": {
          "icon": "ipfs://bafkreiax4h2evyf4g7iuu6kuqkxwez4kvduxayngj5vxmvgrekipevptl4",
          "web": "https://RealBitcoinFam.com",
          "youtube": "https://www.youtube.com/@RealBitcoinCashSite",
          "support": "https://t.me/Panmoni",
          "telegram": "https://t.me/Panmoni",
          "twitter": "https://twitter.com/RealBitcoinFam",
          "discord": "https://discord.gg/MaybgkHs53",
          "instagram": "https://www.instagram.com/realbitcoinfam/"
        },
        "extensions": {
          "contact": {
            "phone": "+1 (215) 360-3513",
            "email": "hello@panmoni.com"
          }
        }
      }
    }
  }
}
```

<!-- TOC --><a name="2-nft-bcmr"></a>

#### 2. BCMR de un NFT

Y aquí tienes un fragmento de unos [metadatos de NFT de ejemplo](https://bafkreigiw3m4biu5bx6bc7ab7zcdu6vdsxlcz2e6bwvfha5mmj5dc3nexi.ipfs.nftstorage.link/) de mi [“BCH Vision NFT Series 2021”](/blog/bch-vision-2021-nft-series) ([¡Cómpralos en tapswap.cash!](https://tapswap.cash/trade/792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2))

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": {
    "major": 0,
    "minor": 1,
    "patch": 0
  },
  "latestRevision": "2023-08-12T21:41:35.901Z",
  "registryIdentity": {
    "name": "BCMR for BCH Vision NFT Series 2021",
    "description": "Self-published BCMR for BCH Vision NFT Series 2021."
  },
  "identities": {
    "792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2": {
      "2023-08-12T21:41:35.901Z": {
        "name": "BCH Vision Series 2021",
        "description": "The BCH Vision Series is a collection of 25 social media images that were first published in 2021. They lay out a vision for the future development of Bitcoin Cash.",
        "token": {
          "category": "792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2",
          "symbol": "BCHNFT-BCHVISION2021",
          "nfts": {
            "description": "The BCH Vision Series is a collection of 25 social media images that were first published in 2021. They lay out a vision for the future development of Bitcoin Cash.",
            "parse": {
              "types": {
                "01": {
                  "name": "BCH Vision 2021 NFT Series #1",
                  "description": "NFT #1 from the BCH Vision 2021 NFT Series.",
                  "uris": {
                    "icon": "ipfs://bafybeiax6xk6fb4u5cbgursnizylo7kcjtbxhjd6cadyq23iett653nyxi/1.png",
                    "image": "ipfs://bafybeiax6xk6fb4u5cbgursnizylo7kcjtbxhjd6cadyq23iett653nyxi/1-img.png"
                  },
                  "extensions": {
                    "attributes": {
                      "Title": "Bitcoin Cash Thinks Big"
                    }
                  }
                },
```

[Ve aquí el archivo completo de metadatos del NFT.](https://bafkreigiw3m4biu5bx6bc7ab7zcdu6vdsxlcz2e6bwvfha5mmj5dc3nexi.ipfs.nftstorage.link/)

<!-- TOC --><a name="8-key-bcmr-concepts"></a>

### 8 conceptos clave de BCMR

Estos son 8 conceptos clave de BCMR que deberías entender. No te preocupes: ¡solo uno de ellos te dará un breve dolor de cabeza, lo prometo!

No tienes que memorizar ni entender todos estos conceptos hoy. Recuerda que puedes empezar a crear tokens y NFTs hoy mismo con solo seguir el tutorial [1](/blog/token-pioneers-cashtokens-tutorial-1) (FTs) o el [2](/blog/token-pioneers-cashtokens-tutorial-2) (NFTs).

<!-- TOC --><a name="1-bcmr-json-schema"></a>

#### 1. Esquema JSON de BCMR

BCMR es un esquema, o formato estructurado, que debes seguir al crear tus archivos de metadatos (deben validar contra el [esquema raíz](https://cashtokens.org/bcmr-v2.schema.json)). Este esquema permite a los desarrolladores representar identidades asociadas con BCH UTXOs. Estas identidades pueden ser personas, organizaciones, etc. — y estas identidades pueden tener tokens.

Puedes consultar la definición completa del esquema en [https://cashtokens.org/bcmr-v2.schema.json](https://cashtokens.org/bcmr-v2.schema.json), ¡pero no es una lectura muy divertida!

Teniendo eso en cuenta, desglosaremos el esquema BCMR en sus secciones clave.

<!-- TOC --><a name="key-components-of-the-bcmr-schema"></a>

##### Componentes clave del esquema BCMR

Es importante tener en cuenta que cualquier archivo BCMR válido es, en sí mismo, un registro de metadatos de BCH (BCMR). Así, aunque [otr.cash](https://otr.cash/.well-known/bitcoin-cash-metadata-registry.json) y [tokenstork.com](https://tokenstork.com/.well-known/bitcoin-cash-metadata-registry.json) son registros porque alojan archivos JSON con muchas identidades, también lo es el [archivo BCMR de XRBF](https://bafkreibvm5ferzeyo62x7lcocgrpwij2yrhz3d7vin4huervnr5z2s2ydm.ipfs.nftstorage.link/) enlazado arriba, que solo aloja una identidad.

_¡Son registros hasta el fondo!_

- **version**: el versionado de BCMR usa [versionado semántico](https://semver.org/), así que el campo major debe incrementarse cuando se elimina una identidad; el minor, cuando se agrega una identidad o una nueva instantánea, y el patch, cuando se modifica una identidad o una instantánea de identidad existente, o cuando cambian el nombre, la descripción o los URIs del registro. Así, en el caso de XRBF, el minor debe ser 1, ya que se agregó 1 identidad, y el patch 4, ya que le he hecho 4 actualizaciones menores (creo). En otras palabras, 0.1.4.

```json
  "version": {
    "major": 0,
    "minor": 1,
    "patch": 4
  },
```

- **registryIdentity**: como cada archivo es su propio registro, ¡puedes ponerle nombre al tuyo! Esta sección puede tener nombre, descripción y URIs. El ejemplo de abajo proviene del registro de [tokenstork.com](https://tokenstork.com/.well-known/bitcoin-cash-metadata-registry.json) (que, al momento de escribir esto, es más que nada un espejo del registro de [otr.cash](https://otr.cash/.well-known/bitcoin-cash-metadata-registry.json), que tiene más autoridad).

```json
  "registryIdentity": {
    "name": "TokenStorkRegistry",
    "description": "A community-reviewed registry of tokens on Bitcoin Cash. Publishes names, symbols, icons, and other metadata about CashTokens via a Bitcoin Cash Metadata Registry (BCMR).",
    "uris": {
      "icon": "https://tokenstork.com/TokenStorkRegistry-icon.png",
      "web": "https://tokenstork.com/",
      "registry": "https://tokenstork.com/.well-known/bitcoin-cash-metadata-registry.json"
    }
```

- **identities**: la parte central del esquema; define cómo se representan las identidades individuales y de organizaciones.

Aquí tienes una identidad del [registro de otr.cash](https://otr.cash/.well-known/bitcoin-cash-metadata-registry.json) para unos FTs en Chipnet (la red de pruebas de los CHIPs), que es un tipo de red de pruebas de BCH. Fíjate en que usa `splitId` para indicar que este token está en una cadena distinta de la red principal de BCH.

```json
    "07a70ec6e0a325991e829daea5de1be1bb71e1ef4a04931cdddf567d8f60f676": {
      "2023-05-12T20:18:04.000Z": {
        "name": "OTR Chipnet Tokens",
        "description": "OpenTokenRegistry's example fungible token issued on Chipnet, a network used for Bitcoin Cash development.\n\nIn user interfaces with limited space, descriptions may be hidden beyond 140 characters or the first newline character; this example allows for testing of hiding and revealing extended descriptions.",
        "token": {
          "category": "0afd5f9ad130d043f627fad3b422ab17cfb5ff0fc69e4782eea7bd0853948428",
          "decimals": 6,
          "symbol": "OTRC"
        },
        "splitId": "00000000040ba9641ba98a37b2e5ceead38e4e2930ac8f145c8094f94c708727",
        "uris": {
          "icon": "ipfs://bafkreig32k6kowcldesjbytktvsh47wnr72qp67ig3aldcjkkkgkx4jmnq",
          "web": "https://otr.cash/docs/test",
          "chat": "https://t.me/cashtoken_devs"
        }
      }
    },
```

Aquí tienes otra identidad de otr.cash como referencia y para que la analices. Puedes aprender mucho con solo leer BCMRs existentes. Fíjate en que esta usa un `symbol` que cumple muy bien con las [pautas de listado de otr.cash](https://otr.cash/docs/list/).

```json
    "180f0db4465c2af5ef9363f46bacde732fa6ffb3bfe65844452078085b2e7c93": {
      "2023-05-26T17:10:00.000Z": {
        "name": "Emerald DAO U23",
        "description": "A series of 2000 keycard NFTs which entitle each holder to a unique, on-chain Emerald DAO safebox holding at least 0.101 BCH. Beginning May 15, 2024, each keycard NFT may be burned to unlock its matching safebox.\n\nThe Emerald DAO U23 series was created on May 15, 2023 to demonstrate new capabilities enabled by the CashTokens upgrade and to celebrate the 2023 upgrade event. Emerald DAO U23 is minted by an instance of Emerald DAO v2.1.0 with a minimum safebox size of 0.1 BCH and an initial endowment of 2 BCH into DAO's rewards pool.",
        "token": {
          "category": "180f0db4465c2af5ef9363f46bacde732fa6ffb3bfe65844452078085b2e7c93",
          "symbol": "EMRDAO-U23"
        },
        "uris": {
          "icon": "ipfs://bafybeigqogqx3n4cldk6nizl5vihopi2dkgvw4yqamc5rhleyqu25soe4e",
          "web": "https://emerald-dao.cash/",
          "chat": "https://t.me/emeralddao",
          "app": "https://emerald-dao.vercel.app"
        }
      }
    },
```

- **tags**: las etiquetas se definen en el nivel superior de un registro y se usan dentro de identidades individuales en la sección `identities`. Pueden ser útiles para categorizar y agrupar identidades dentro de un registro, aunque, al momento de escribir esto, pocos registros además de TokenStork las usan.

Esta es una lista de definiciones de etiquetas que se podría usar en el nivel superior de un BCMR. En esta estructura, las `tags` definidas en el nivel superior funcionan como un repositorio común de etiquetas que se pueden asociar con varias identidades, lo que garantiza coherencia y facilidad de gestión en todo el registro.

```json
{
  "tags": {
    "utility-token": {
      "name": "Utility Token",
      "description": "A token that provides users with access to a product or service offered by the issuing project."
    },
    "security-token": {
      "name": "Security Token",
      "description": "A token that represents investment in a project, often with expectations of profit, dividends, or voting rights."
    },
    "stablecoin": {
      "name": "Stablecoin",
      "description": "A type of cryptocurrency that aims to maintain a stable market value, often pegged to a fiat currency or commodity."
    },
    "governance-token": {
      "name": "Governance Token",
      "description": "A token that provides holders with voting rights in the governance of a decentralized project or protocol."
    },
    "defi-token": {
      "name": "DeFi Token",
      "description": "A token associated with decentralized finance (DeFi) applications, often used in lending, borrowing, or liquidity provision."
    },
    "nft": {
      "name": "NFT",
      "description": "A unique token representing ownership or proof of authenticity of a digital or physical asset."
    },
    "wrapped-token": {
      "name": "Wrapped Token",
      "description": "A token that represents another cryptocurrency on a different blockchain, allowing for cross-chain token utilization."
    },
    "payment-token": {
      "name": "Payment Token",
      "description": "A token primarily used as a medium of exchange or for payment purposes."
    },
    "exchange-token": {
      "name": "Exchange Token",
      "description": "A token issued by a cryptocurrency exchange, often offering benefits like reduced fees or participation in revenue sharing."
    },
    "privacy-token": {
      "name": "Privacy Token",
      "description": "A token designed with enhanced privacy features, offering greater anonymity for transactions."
    },
    "asset-backed-token": {
      "name": "Asset-Backed Token",
      "description": "A token backed by a tangible or intangible asset, like gold, real estate, or intellectual property."
    },
    "liquidity-provider-token": {
      "name": "Liquidity Provider Token",
      "description": "A token received in exchange for providing liquidity to a decentralized exchange or liquidity pool."
    },
    "memecoin": {
      "name": "Memecoin",
      "description": "A cryptocurrency, often created and shared as a joke or for fun, that may gain popularity or value through social media and community support."
    }
  }
}
```

Este es un ejemplo de cómo se podrían usar esas etiquetas dentro de una identidad. Fíjate en que las definiciones de etiquetas van en el nivel superior del archivo, pero el uso de las etiquetas va al mismo nivel que `name` y `description` en un objeto de identidad. Fíjate también en que, para usar etiquetas en una identidad, se necesita un [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array), como se muestra abajo.

```json
{
"482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887": {
      "2023-07-19T16:23:41.467Z": {
        "name": "Real Bitcoin Fam Community Award Tokens",
        "description": "Real Bitcoin Fam's community award token for rewarding new BCH builders who are building with CashTokens. Real Bitcoin Fam is a support network for Bitcoin, cryptocurrency and Web3 builders who align with an OG Bitcoin vibe.",
        "tags": ["payment-token", "governance-token"],
        "token": {
          "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
          "symbol": "XRBF",
          "decimals": 2
        },
```

- **extensions**: por definición, las extensiones sirven para que los desarrolladores agreguen información específica que no cubre el esquema estándar.

Aquí está mi NFT CashNinjas, que encontré buscando la serie de NFTs en [TokenExplorer.cash](https://tokenexplorer.cash/?tokenId=77a95410a07c2392c340384aef323aea902ebfa698a35815c4ef100062c6d8ac) (del desarrollador de BCH [Mathieu Geukens](https://twitter.com/GeukensMathieu)) y luego buscando dentro del [registro](https://api.ninjas.cash/.well-known/bitcoin-cash-metadata-registry.json) de esta serie.

Como ves, usa `extensions` para publicar metadatos sobre los atributos del NFT. Estas propiedades de atributos no están definidas en el estándar BCMR e incluyen hashes de la imagen y el ícono del NFT para que los usuarios finales puedan verificar su autenticidad.

```json
  "11":{
    "name":"Ninja #18 - Thunder Strider of the Midnight River",
	"description":"Meet Thunder Strider of the Midnight River, an elite CashNinja from the intense and charismatic Thunder clan. His skin, painted in the deep hues of midnight, compliments his ground color markings, a symbol of his raging thunder affiliation, perfect for scouting the dark landscapes undetected. His psychic eyes, a rare trait among Thunder clan members,  give him an uncanny ability to foresee adversaries' movements, making him a formidable opponent. Armed with his lethal bow and arrow, the Thunder Strider stands at the vanguard of his clan, prepared to uphold honor and tradition. This NFT, hand-drawn and steeped in mystery, allows you to immerse yourself in the lore of the CashNinjas, to partake in their epic tales of valor, and take part in a legacy that expands beyond the digital realm.",
    "uris":{
      "icon":"https://api.ninjas.cash/icons/18",
      "image":"https://api.ninjas.cash/images/18"
    },
    "extensions":{
      "attributes":{
        "Background":"River",
        "Primary Color":"Midnight",
        "Secondary Color":"Ground",
        "Marking":"Thunder",
        "Eyes":"Psychic",
        "Weapon":"Bow and Arrow"
        },
	"image-hash": "fd431e234ed79124b8afa28c70aab6b383b8bd1b23f08bcf2a8fc3128e71ce1a",
	"icon-hash": "ec5151b1153c99eccf14550fe3a89ea125879e57506f82f0e1e3dc2c254faf9d"
        }
      }
```

Por cierto, [puedes ver mi bonito NFT](https://viewer.sploit.cash/nft/bitcoincash:qr033df3ym99dqru8a6gtwfus8t8g9w5lsve42m0df/77a95410a07c2392c340384aef323aea902ebfa698a35815c4ef100062c6d8ac/11) con el nuevo visor de NFTs del desarrollador de BCH [sploit](https://twitter.com/acidsploit).

Otro ejemplo de `extensions` está en el registro de XRBF:

```json
        "extensions": {
          "contact": {
            "phone": "+1 (215) 360-3513",
            "email": "hello@panmoni.com"
          }
        }
```

- **token**: especifica información sobre los tokens asociados con una identidad, incluidos detalles como símbolos y decimales. Este componente también incluye los datos de los NFTs. Esta sección se trató en detalle en los tutoriales [1](/blog/token-pioneers-cashtokens-tutorial-1#cashtokens-metadata) y [2](/blog/token-pioneers-cashtokens-tutorial-2#nft-metadata).

- **chains**: esta sección sirve para identificar en qué cadena es válida la identidad y es especialmente útil para tokens creados en Chipnet. En caso de una futura división de la red de BCH, esta sección podría ayudar a las billeteras a mostrar a los usuarios qué activos están en qué cadena(s).

- **latestRevision**: indica la marca de tiempo de la última revisión hecha al registro (archivo), lo que sirve como punto de referencia para las actualizaciones. Se usa en el nivel superior del archivo JSON. Cada vez que actualices un BCMR, se recomienda actualizar este campo con la hora actual.

```json
"latestRevision": "2023-07-19T22:23:41.467Z",
```

En este ejemplo, el campo `latestRevision` indica que la última actualización de este archivo BCMR en concreto se hizo el 19 de julio de 2023 a las 22:23:41,467 UTC.

Para obtener la hora actual en este formato (formato ISO 8601 extendido simplificado), puedes abrir la [consola de JavaScript](https://webmasters.stackexchange.com/questions/8525/how-do-i-open-the-javascript-console-in-different-browsers) de tu navegador y ejecutar el código de abajo. Obtendrá la hora actual en el formato correcto y la mostrará en la consola. Puedes copiarla desde ahí.

```js
const currentTime = new Date().toISOString();
console.log(currentTime);
```

También puedes visitar [UTCTime.net](https://www.utctime.net/) para obtener este dato.

<!-- TOC --><a name="2-token-vs-identity-vs-category"></a>

#### 2. Token, identidad y categoría

Es importante tener claras las diferencias entre token, identidad y categoría, ya que pueden parecerse y a veces dar la impresión de solaparse un poco.

- **identity**: una identidad es aquello con lo que trabaja el BCMR. El BCMR no trata, ante todo, de tokens, sino de identidades. Las identidades pueden tener tokens o no.
- **token**: los tokens pueden ser fungibles o no fungibles y, desde la perspectiva del BCMR, existen dentro de una identidad. Cómo funcionan en la cadena es otro tema, que se trata en los tutoriales [1](/blog/token-pioneers-cashtokens-tutorial-1) (FTs) y [2](/blog/token-pioneers-cashtokens-tutorial-2) (NFTs). Una sola identidad puede tener varios FTs y NFTs bajo ella en un BCMR, por ejemplo, [como se muestra aquí](https://github.com/bitjson/chip-bcmr/blob/master/examples/payouts-or-dividends.json).
- **category**: en los archivos BCMR, la categoría es el identificador único de una identidad. En la práctica, la categoría es simplemente otro nombre para la transacción pregénesis de un token; a veces también se le llama token ID. La categoría es lo que se usa principalmente para identificar un token en [Cauldron Swap](https://cauldron.quest/), [TokenExplorer.cash](https://tokenexplorer.cash/) [TokenStork.com](https://TokenStork.com/), en exploradores, indexadores y, por supuesto, en los archivos BCMR.

<!-- TOC --><a name="3-authhead-authbase"></a>

#### 3. Authhead y authbase

Como se mencionó en el [tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#authbase-and-authchain), **authhead** y **authbase** son dos conceptos fundamentales de BCMR que te conviene entender y tener claros.

Cuando creas una identidad en la cadena (token, etc.), es una buena práctica crear un OP_RETURN que contenga un enlace a tu(s) BCMR para esa identidad. Este OP_RETURN va después de la primera salida de la transacción génesis (que se conoce tanto como **salida cero** como **salida de identidad**). Ese OP_RETURN en particular tiene este formato:

`OP_RETURN <'BCMR'> <hash> [<uri> <uri> ... <uri>]`

(¡Más adelante aprenderás a construir tu propio OP_RETURN!)

Los URIs hacen referencia a la(s) URL(s) donde está tu archivo BCMR, por ejemplo, `api.ninjas.cash` o `ipfs://bafkreiep4pnftxhhsckibfiifloduhymusaiqiojcggpkptizpdgasxfl4`. Puedes alojar tu BCMR en varios lugares para tener redundancia; solo asegúrate de que todos los archivos sean idénticos para que tengan el mismo hash.

Esta transacción en la que creaste por primera vez tu BCMR OP_RETURN de forma adecuada es (por convención) el **authbase**, el fundamento (o base) en la cadena de la identidad BCMR para esta `category` concreta de identidad/token. El **authbase** no cambia con el tiempo, a menos que vuelvas a acuñar tu token desde cero.

Si tu identidad no tiene authbase, aún puede tener metadatos BCMR mediante un registro resuelto por DNS (ver más abajo). Dicho esto, lo más recomendable es crear el authbase y mantenerlo correctamente.

<!-- TOC --><a name="metadata-updates"></a>

##### Actualizaciones de metadatos

Las identidades BCMR se pueden actualizar (ver la sección sobre el historial de identidad más abajo). ¡Pero actualizarlas no consiste solo en editar el archivo BCMR en su URL actual!

En el authbase, el BCMR está vinculado junto con su hash. Así que, si editas el archivo en su lugar, su contenido —y, por tanto, su hash— cambiará. Esto invalidará tu BCMR y tu token mostrará una X roja al final de su ficha en [TokenExplorer.cash](https://tokenexplorer.cash/).

Este es un ejemplo de un hash de metadatos que no coincide, por lo que clientes como las billeteras, etc., no pueden verificar la integridad de los datos BCMR. Esto es algo que te conviene evitar.

![](../../../assets/images/posts/tp3/Screenshot%202023-12-05%20at%203.09.38%20PM.png)

<!-- TOC --><a name="the-authhead"></a>

##### El authhead

Así que, cuando quieras actualizar una identidad, debes actualizar tanto el archivo (o simplemente crear un archivo nuevo en una URL nueva si, por ejemplo, usas IPFS) como la blockchain. Esta actualización crea una nueva transacción BCH, y esa transacción es el **authhead**.

El **authhead** de una identidad contiene un enlace a la actualización más reciente de sus metadatos, de forma parecida a cómo la “punta de la cadena” es el bloque creado más recientemente en una blockchain

Ya que lo opuesto a la cabeza (head) son los pies, ¿quizá sería mejor llamar authfoot al authbase? ¡Eso lo dejo a tu criterio!

<!-- TOC --><a name="on-chain-terms"></a>

##### Términos en la cadena

El authbase y el authhead son siempre conceptos en la cadena que hacen referencia a los IDs de las transacciones donde ocurrieron estas cosas. Estos términos no son propiedades del archivo BCMR en sí, aunque son muy relevantes para todos los temas de BCMR.

Este es otro ejemplo de lo elegante que es el diseño de CashTokens y BCMR, al menos en el sentido de que algunos conceptos están implícitos en la estructura de las cosas; es decir, en las relaciones entre ellas.

En este caso, los términos authbase y authhead solo adquieren un significado concreto en sus relaciones y no son campos ni propiedades explícitos.

<!-- TOC --><a name="authhead-and-authbase-examples"></a>

##### Ejemplos de authhead y authbase

Veamos algunos ejemplos de estos conceptos.

Para el token XRBF, [esta transacción](https://explorer.bitcoinunlimited.info/tx/5de87383470ec7d31a8eeb3da2f21952da42b300fd527c6bf3600f03caf122c4#output-0) del 19 de julio de 2023 es el authbase. Como ves, se creó todo el suministro del token y la segunda salida es un OP_RETURN con un enlace a los metadatos originales de este token.

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-05%20at%2011.21.29%20AM.png)](https://explorer.bitcoinunlimited.info/tx/5de87383470ec7d31a8eeb3da2f21952da42b300fd527c6bf3600f03caf122c4#output-0)

El 14 de noviembre de 2023, actualicé el archivo BCMR y creé [esta transacción](https://explorer.bitcoinunlimited.info/tx/7a1f732051b6804c991dc72d73faa15612324cbc64f5f081184466d031e3a902). Puedes ver que la segunda salida es un OP_RETURN con un enlace a un archivo de IPFS que contenía los metadatos revisados en ese momento. A partir del 14 de noviembre, esta pasó a ser el authhead de XRBF.

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-05%20at%2011.22.30%20AM.png)](https://explorer.bitcoinunlimited.info/tx/7a1f732051b6804c991dc72d73faa15612324cbc64f5f081184466d031e3a902)

<!-- TOC --><a name="4-authchain-zdtc"></a>

#### 4. Authchain y ZDTC

Ahora que sabes qué son el authbase y el authhead, solo debes saber que una authchain es el conjunto completo de actualizaciones (en la cadena) del authbase de una identidad. ¡Así de simple!

Una authchain es un ejemplo de **cadena de transacciones descendientes de la salida cero**, o ZDTC. Es solo un término elegante para la idea de actualizaciones de BCMR que se realizan como transacciones en la cadena en las que la primera salida (salida de identidad) de la actualización de BCMR anterior se gasta como primera entrada para crear la siguiente salida de identidad.

Esto solo significa que siempre puedes actualizar tu BCMR creando una nueva transacción que toma como entrada la primera salida anterior (es decir, la salida de identidad o authhead) y luego crea una salida cero (de identidad) seguida de un OP_RETURN con el formato adecuado, como vimos arriba.

Haremos este proceso de actualización más abajo, en la sección “Construir con BCMR”, ¡así que atento!

<!-- TOC --><a name="identities-on-bitcoin-cash"></a>

##### Identidades en Bitcoin Cash

[![](../../../assets/images/posts/tp3/authchain.png)](https://cashtokens.org/docs/bcmr/chip/#zeroth-descendant-transaction-chains)

Este diagrama de [CashTokens.org](https://cashtokens.org/docs/bcmr/chip/#zeroth-descendant-transaction-chains) puede ser muy útil para entender las authchains.

Empezando por la izquierda, vemos la transacción **authbase**, que podría ser la transacción génesis de un token. La primera salida es la **salida de identidad**, y la otra salida, en esencia, no es relevante para este tema.

Hay una segunda transacción en la que se gasta la **salida de identidad** de la transacción authbase, quizá para actualizar el BCMR del token creado en la transacción authbase. Luego, una tercera que hace lo mismo.

La transacción authhead es simplemente otra transacción en la que se gasta hacia adelante una **salida de identidad**.

En conjunto, estas transacciones que no aparecen en gris forman la **authchain** de una identidad (que normalmente incluye un token), también conocida en jerga elegante como ZDTC (cadena de transacciones descendientes de la salida cero).

Mira esta explicación en un video de YouTube:

[![Míralo como video de YouTube](https://img.youtube.com/vi/BxGmP9jAlUE/0.jpg)](https://www.youtube.com/watch?v=BxGmP9jAlUE)

<!-- TOC --><a name="identity-output-the-op_return"></a>

##### La salida de identidad y el OP_RETURN

Algo importante que hay que tener en cuenta es que el OP_RETURN y la salida de identidad son dos cosas distintas.

Esto me confundió al principio porque veía que se hablaba de la salida cero, pero el OP_RETURN con el enlace al BCMR siempre era la segunda salida.

Pero los OP_RETURNs no se pueden gastar. Son solo un marcador para las actualizaciones de BCMR, pero no tienen nada que ver con la **salida de identidad**.

Para quienes, como yo, prefieren que las cosas sean explícitas: en este caso, por desgracia, la **salida de identidad** se identifica de forma implícita y no explícita.

La salida cero (salida de identidad) está reservada para continuar la authchain, y la salida OP_RETURN que contiene el enlace al BCMR suele ir después. ¡Así es como funciona esto!

<!-- TOC --><a name="burning-merging"></a>

##### Quema y fusión

Es posible quemar una identidad gastando la salida de identidad del authhead en una transacción que incluya un OP_RETURN que contenga `0x6a`. Quemarla les indica a los clientes de BCMR que la identidad se puede archivar. Rara vez es necesario quemar una identidad, ya que actualizarlas es fácil, como vimos antes.

Si quieres fusionar dos o más identidades, puedes gastar juntas en una transacción las salidas de identidad de sus respectivos authheads.

<!-- TOC --><a name="authchain-resolution"></a>

##### Resolución de la authchain

La resolución de la authchain es simplemente el proceso de seguir una authchain, es decir, rastrear de forma recursiva las salidas de identidad relevantes desde la transacción authbase hasta el authhead.

<!-- TOC --><a name="spv-validation"></a>

##### Validación SPV

Así como SPV ([verificación simplificada de pagos](https://documentation.cash/protocol/spv.html)) permite verificar transacciones de BCH sin descargar toda la blockchain (sobre todo en billeteras móviles), también puede simplificar la verificación de las actualizaciones de BCMR. Esto hace que la especificación BCMR sea realmente ligera, rápida y versátil.

<!-- TOC --><a name="5-bcmr-identity-history-identity-snapshots"></a>

#### 5. Historial de identidad e instantáneas de identidad de BCMR

El historial de identidad y las instantáneas de identidad aparecen en el esquema raíz de BCMR, pero son conceptos, no campos en sí.

Una **instantánea de identidad** es simplemente un conjunto de metadatos de identidad con marca de tiempo. Esta es una instantánea de identidad:

```json
"2023-07-19T16:23:41.467Z": {
        "name": "Real Bitcoin Fam",
        "description": "Real Bitcoin Fam is a support network for Bitcoin, cryptocurrency and Web3 builders who align with an OG Bitcoin vibe.",
        "token": {
          "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
          "symbol": "RBF",
          "decimals": 2
        },
        "uris": {
          "icon": "https://www.realbitcoinfam.com/images/rbftoken.png",
          "web": "https://RealBitcoinFam.com",
          "youtube": "https://www.youtube.com/@RealBitcoinCashSite",
          "support": "https://t.me/Panmoni",
          "twitter": "https://twitter.com/RealBitcoinFam",
          "discord": "https://discord.gg/MaybgkHs53"
        }
      }
```

Como ves, empieza con una marca de tiempo. Es el momento a partir del cual estos metadatos son (o eran) válidos para el objeto `category` que los contiene.

El **historial de identidad** es el conjunto de instantáneas de identidad con marca de tiempo de una identidad. Este es un ejemplo de un historial de identidad con dos instantáneas de identidad:

```json
"identities": {
    "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887": {
      "2023-12-04T18:25:15.000Z": {
        "name": "Real Bitcoin Fam Community Award Tokens",
        "description": "Real Bitcoin Fam's community award token for rewarding new BCH builders who are building with CashTokens. Real Bitcoin Fam is a support network for Bitcoin, cryptocurrency and Web3 builders who align with an OG Bitcoin vibe.",
        "tags": ["payment-token", "governance-token"],
        "token": {
          "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
          "symbol": "XRBF",
          "decimals": 2
        },
        "uris": {
          "icon": "ipfs://bafkreiax4h2evyf4g7iuu6kuqkxwez4kvduxayngj5vxmvgrekipevptl4",
          "web": "https://RealBitcoinFam.com",
          "youtube": "https://www.youtube.com/@RealBitcoinCashSite",
          "support": "https://t.me/Panmoni",
          "telegram": "https://t.me/Panmoni",
          "twitter": "https://twitter.com/RealBitcoinFam",
          "discord": "https://discord.gg/MaybgkHs53",
          "instagram": "https://www.instagram.com/realbitcoinfam/"
        },
        "extensions": {
          "contact": {
            "phone": "+1 (215) 360-3513",
            "email": "hello@panmoni.com"
          }
        }
      },
      "2023-07-19T16:23:41.467Z": {
        "name": "Real Bitcoin Fam",
        "description": "Real Bitcoin Fam is a support network for Bitcoin, cryptocurrency and Web3 builders who align with an OG Bitcoin vibe.",
        "token": {
          "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
          "symbol": "RBF",
          "decimals": 2
        },
        "uris": {
          "icon": "https://www.realbitcoinfam.com/images/rbftoken.png",
          "web": "https://RealBitcoinFam.com",
          "youtube": "https://www.youtube.com/@RealBitcoinCashSite",
          "support": "https://t.me/Panmoni",
          "twitter": "https://twitter.com/RealBitcoinFam",
          "discord": "https://discord.gg/MaybgkHs53"
        }
      }
    }
  },
```

Como ves, contiene la instantánea de identidad de `2023-07-19T16:23:41.467Z` y agrega una nueva de `2023-12-04T18:25:15.000Z`. Juntas, estas instantáneas de identidad forman un historial de identidad.

<!-- TOC --><a name="authchain-vs-identity-history"></a>

##### Authchain frente a historial de identidad

Como vimos arriba, la authchain se encuentra en la cadena examinando una cadena de transacciones. Y el historial de identidad es el equivalente BCMR de la authchain. El historial de identidad, claro, existe fuera de la cadena.

<!-- TOC --><a name="identity-history-builds-trust"></a>

##### El historial de identidad genera confianza

Mantener el historial de identidad de tus identidades en tus BCMRs demuestra transparencia y puede generar confianza en ellas. Es una especie de control de versiones de metadatos que permite al ecosistema ver la historia de tus identidades.

Esto es importante porque todos los metadatos CashTokens se guardan fuera de la cadena y, por lo tanto, **no son inmutables**. Lo que hoy se llama X Token puede pasar a llamarse Y Token mañana con solo actualizar la authchain. Si no mantienes tu historial de identidad, esto puede confundir al ecosistema y provocar una pérdida de confianza.

¡La confianza importa cuando intentas construir en DeFi en 2024, eso seguro! Así que asegúrate de mantener tu historial de identidad de BCMR.

<!-- TOC --><a name="identity-history-reconstruction"></a>

##### Reconstrucción del historial de identidad

Si no aprovechabas la función de historial de identidad en tu BCMR pero ahora quieres hacerlo, solo necesitas reunir tus instantáneas de identidad anteriores y colocarlas debajo de la más reciente en tu BCMR.

Si siempre usaste el mismo gist de GitHub, puedes revisar las versiones anteriores para encontrar esas instantáneas de identidad antiguas.

Si usaste archivos de IPFS, puedes encontrarlos, por ejemplo, en [nft.storage](https://nft.storage/files/) (si usaste ese servicio) y obtener así los datos históricos.

Si quieres encontrar tus datos BCMR antiguos en la cadena, puedes visitar [TokenExplorer.cash](https://TokenExplorer.cash), ingresar el `category` de tu token y hacer clic en “authHead txid”. Esto te llevará al explorador de bloques de BU.

Rastrea hacia atrás las actualizaciones de tu authhead haciendo clic una y otra vez en la primera entrada de cada transacción, a menos que hayas hecho algo raro con tu authhead; en ese caso, explora un poco hasta encontrarlo.

Encuentra algunas o todas las URLs antiguas de BCMR, toma los datos y organízalos en orden en un historial de identidad. ¡Es simplemente una buena práctica de BCMR!

¿Necesitas ayuda? Pásate por el grupo de [desarrolladores de CashToken en Telegram](https://t.me/cashtoken_devs) ¡y te guiaremos!

<!-- TOC --><a name="migration"></a>

##### Migración

Si vas a hacer un cambio importante en la imagen de marca de tu token, es buena idea usar la propiedad `migrated` en el nivel superior de tu nueva instantánea de identidad. Así el ecosistema sabrá que la instantánea de identidad inmediatamente anterior sigue siendo relevante, ya que es de suponer que estás en proceso de avisar al ecosistema del cambio importante de imagen de marca (y de metadatos).

Este es un fragmento BCMR de un [ejemplo proporcionado por el creador de BCMR](https://github.com/bitjson/chip-bcmr/blob/master/examples/fungible-token.json), [Jason Dreyzehner](https://twitter.com/bitjson), que muestra el uso de la propiedad `migrated`:

```json
"identities": {
 "89cad9e3e34280eb1e8bc420542c00a7fcc01002b663dbf7f38bceddf80e680c": {
      "2023-01-13T00:00:00.000Z": {
        "name": "Example Asset",
        "description": "This is a short description of Example Asset. In most interfaces, it will be hidden beyond 140 characters or the first newline character.\n\nThis sentence should be hidden in user interfaces with limited space.\n\nNote that this snapshot was introduced on 2023-1-13, but the 'migrated' property indicates that the migration took place over the following month. During that month, most clients should have warned users about the upcoming change, referring users to the 'migrate' URI for information about the change. (Some clients may also offer clients the option to dismiss the migration period and immediately show the new metadata.) At 0 UTC on 2023-2-13, all clients should have switched their default display for this token to use the new metadata, i.e. ticker symbol XAMPL, with 6 decimal places. After the migrated timestamp, old metadata should only be displayed when providing historical context.",
        "token": {
          "category": "89cad9e3e34280eb1e8bc420542c00a7fcc01002b663dbf7f38bceddf80e680c",
          "decimals": 6,
          "symbol": "XAMPL"
        },
        "migrated": "2023-02-13T00:00:00.000Z",
```

<!-- TOC --><a name="6-bcmr-decimal-places"></a>

#### 6. Decimales en BCMR

Los decimales no son un concepto _importante_ de BCMR, pero veo confusión al respecto entre los nuevos desarrolladores de CashTokens.

¡En la cadena, tus tokens no tienen decimales! Ninguno, **en absoluto**. Los decimales solo existen en el estándar de metadatos BCMR.

Supongamos que quieres crear un FT con un suministro máximo de 1 millón de tokens, cada uno con 8 decimales. En este caso, necesitas crear en la cadena un suministro génesis de 1000000 + 00000000, es decir, 100000000000000 (100.000.000.000.000, o sea, 100 billones).

Las billeteras y las interfaces de usuario usarán los metadatos de tu token para mostrar su suministro como 1 millón, siempre que especifiques 8 decimales en tu archivo BCMR válido y vinculado.

<!-- TOC --><a name="7-dns-resolved-registries"></a>

#### 7. Registros resueltos por DNS

Un BCMR resuelto por DNS es simplemente un archivo de texto ubicado en domain/.well-known/bitcoin-cash-metadata-registry.json, donde bitcoin-cash-metadata-registry.json es el archivo BCMR.

Por ejemplo, estos son algunos registros resueltos por DNS:

1. `https://otr.cash/.well-known/bitcoin-cash-metadata-registry.json`
2. `https://api.ninjas.cash/.well-known/bitcoin-cash-metadata-registry.json`
3. `https://tokenstork.com/.well-known/bitcoin-cash-metadata-registry.json`

Ten en cuenta que los BCMRs resueltos por DNS deben ser accesibles por https.

Si decides poner tu BCMR en esta ubicación y también ponerlo en la cadena al crear un token o actualizar sus metadatos, puedes poner solo el dominio, es decir, `otr.cash` o `api.ninjas.cash`. El software del ecosistema deducirá el resto de la URL.

Por ejemplo, si miras el authhead de la serie de NFTs CashNinjas, verás que su URL de BCMR es solo `api.ninjas.cash`, y funciona perfectamente.

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-04%20at%202.48.12%20PM.png)](https://explorer.bitcoinunlimited.info/tx/9f74aae846694b1db53fd2b2eff4f925095024bff8cd36e44571fc49d127b8ce)

<!-- TOC --><a name="8-chain-resolved-registries"></a>

#### 8. Registros resueltos por la cadena

Los BCMRs resueltos por la cadena son simplemente los clásicos archivos BCMR enlazados desde un OP_RETURN en la cadena, según el formato que vimos arriba.

Los registros resueltos por la cadena pueden gozar de más confianza, ya que los enlaces en la cadena son inmutables. Al fin y al cabo, no solo el enlace al BCMR está en la cadena y, por tanto, es inmutable, sino que además contiene el hash del archivo. El hash permite que cualquiera verifique si el archivo cambió o sigue igual desde que se enlazó en la cadena.

<!-- TOC --><a name="examples-of-chain-resolved-registries"></a>

##### Ejemplos de registros resueltos por la cadena

Este es uno para los tokens FURU, parte del proyecto [BCH Guru](https://bch.guru/), y, como ves, enlaza a [ipfs://bafkreiep4pnftxhhsckibfiifloduhymusaiqiojcggpkptizpdgasxfl4](https://bafkreiep4pnftxhhsckibfiifloduhymusaiqiojcggpkptizpdgasxfl4.ipfs.dweb.link/).

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-05%20at%2010.34.53%20AM.png)](https://explorer.bitcoinunlimited.info/tx/5e3915d6ab19c7389a531c7e8144e6d286f48bbc2db48588c27975047ff400aa#output-0)

Este es uno para el token SPICE, que usa un [gist de GitHub](https://gist.githubusercontent.com/joemarct/b12e5b0d494590143b11fa9f5837bcdb/raw).

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-05%20at%2010.38.18%20AM.png)](https://explorer.bitcoinunlimited.info/tx/dcaadd7e29fdb706e8f5deac7ba4c50dcb1a0268347dcd04548573f1a5202801#output-0)

Ten en cuenta que “resuelto por la cadena” no significa que los metadatos estén alojados en la cadena, solo que se encuentran (se resuelven) a través de la blockchain. Ningún metadato BCMR se guarda realmente en la cadena.

<!-- TOC --><a name="other-registry-types"></a>

##### Otros tipos de registro

La especificación BCMR también contempla registros integrados e importados manualmente. Por ejemplo, en el [tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#8-spend-some-tokens) vimos cómo importar manualmente datos BCMR en la billetera Electron Cash. Puedes leer más sobre ellos en la [especificación BCMR](https://cashtokens.org/docs/bcmr/chip/#embedded-registries).

<!-- TOC --><a name="bcmr-concepts-conclusion"></a>

#### Conclusión sobre los conceptos de BCMR

Estos 8 conceptos de BCMR son mucho para asimilar de una vez, ¡pero no te preocupes! Puedes empezar de forma muy sencilla, como se muestra en el [tutorial 1 para tokens fungibles](/blog/token-pioneers-cashtokens-tutorial-1) y el [tutorial 2 para NFTs](/blog/token-pioneers-cashtokens-tutorial-2), e ir aprendiendo el resto de los conceptos sobre la marcha.

<!-- TOC --><a name="building-with-bcmr"></a>

## Construir con BCMR

Basta de teoría, ¿no? ¡Es hora de construir! Aquí tienes algunos proyectos de BCMR para afinar tus habilidades en esta área importante.

<!-- TOC --><a name="1-explore-an-authchain"></a>

### 1. Explorar una authchain

<!-- TOC --><a name="use-tokenexplorercash"></a>

#### Usar TokenExplorer.cash

Visita [TokenStork.com](https://TokenStork.com) y elige cualquier token de la lista. Luego ve a la columna del extremo derecho y, cuando los datos terminen de cargar, haz clic en el ícono de copiar para tomar la `category` del token cuya authchain quieres explorar.

Ahora visita [TokenExplorer.cash](https://TokenExplorer.cash) e ingresa la `category` que copiaste donde dice que ingreses el tokenID.

Yo elegí el token Popcorn!.

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-07%20at%2010.50.11%20AM.png)](https://tokenexplorer.cash/?tokenId=02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf)

Aquí hay muchos datos y te animo a explorarlos todos. Lo que nos interesa de inmediato es lo siguiente:

1. el **genesis tx**
2. que el token tiene metadatos BCMR vinculados en la cadena
3. el campo **location metadata**
4. los datos de **authChain** y **authHead** al final
5. el hecho de que el hash de los metadatos coincide con el contenido actual del archivo de metadatos vinculado.

Haz clic en el hash de la transacción génesis (`6f2383b2b2563e15393fc03c6cc225350509b4e5c014ab9d35925cbcdd62d45d`) y podrás explorarla [en el explorador de BU](https://explorer.bitcoinunlimited.info/tx/6f2383b2b2563e15393fc03c6cc225350509b4e5c014ab9d35925cbcdd62d45d).

[![](../../../assets/images/posts/tp3/Screenshot%202023-12-07%20at%2011.00.57%20AM.png)](https://explorer.bitcoinunlimited.info/tx/6f2383b2b2563e15393fc03c6cc225350509b4e5c014ab9d35925cbcdd62d45d)

En este caso, el OP_RETURN con el BCMR vinculado es en realidad la tercera salida, y no pasa nada. Lo único que importa es que esté entre las salidas. La primera salida es siempre la salida de identidad. Esta transacción es el **authbase** de la identidad/token Popcorn!.

Si vuelves al explorador de BU y haces clic en la única entrada de la transacción génesis, verás que se creó en la transacción con hash `02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf` (conocida como transacción pregénesis), que también es el valor de `category` y que se usa como identificador de la identidad en el [BCMR](https://ipfs.pat.mn/ipfs/QmVBiFzSAVujLnWwCsnWjaFWDrzPVsbvGABTE4LLqBviah) de Popcorn!.

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": {
    "major": 1,
    "minor": 0,
    "patch": 0
  },
  "latestRevision": "2023-09-06T08:00:00.000Z",
  "registryIdentity": {
    "name": "Self-certified token metadata",
    "description": ""
  },
  "identities": {
    "02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf": {
      "2023-09-06T08:00:00.000Z": {
        "name": "Popcorn!",
        "description": "Popcorn! (Created by a Decentralized Autonomous Popcorn Stand)",
        "token": {
          "category": "02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf",
          "decimals": 0,
          "symbol": "POPCORN",
          "nfts": {
            "parse": {
              "types": {
                "": {
                  "name": "Popcorn!",
                  "description": "A popcorn box. May or may not contain popcorn. (Created by a Decentralized Autonomous Popcorn Stand)",
                  "uris": {
                    "icon": "ipfs://QmZC72BMa2YGiNvK9iqNNEDGgDKRidsWxnDMiGEnTu6muF"
                  }
                }
              }
            }
          }
        },
        "uris": {
          "icon": "ipfs://QmQZiH5Qm793qsnhFjF3F8jB3ADYusofE5WBEu4tMuH7mv",
          "contract": "https://gitlab.com/0353F40E/popcorn-stand/-/raw/2243bdbd9004fa05686042925c64188eacd6426a/contract/popcorn.cash"
        }
      }
    }
  },
  "license": "CC0-1.0"
}
```

Espero que esto te ayude a ver cómo se conectan los datos CashTokens en la cadena con los metadatos BCMR fuera de la cadena.

<!-- TOC --><a name="use-paytacas-bcmr-indexer"></a>

#### Usar el indexador BCMR de Paytaca

Sigamos con el token Popcorn!, esta vez a través del utilísimo indexador BCMR de Paytaca. Visita `https://bcmr.paytaca.com/api/tokens/\{category\}` para obtener los metadatos de cualquier token, de forma parecida a lo que hiciste en [TokenExplorer.cash](https://tokenexplorer.cash/?tokenId=6f2383b2b2563e15393fc03c6cc225350509b4e5c014ab9d35925cbcdd62d45d). Este indexador siempre te dará los metadatos más recientes, es decir, el BCMR del authhead.

Este es el [resultado](https://bcmr.paytaca.com/api/tokens/02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf/) para Popcorn!.

```json
{
  "name": "Popcorn!",
  "uris": {
    "icon": "ipfs://QmQZiH5Qm793qsnhFjF3F8jB3ADYusofE5WBEu4tMuH7mv",
    "contract": "https://gitlab.com/0353F40E/popcorn-stand/-/raw/2243bdbd9004fa05686042925c64188eacd6426a/contract/popcorn.cash"
  },
  "token": {
    "symbol": "POPCORN",
    "category": "02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf",
    "decimals": 0
  },
  "description": "Popcorn! (Created by a Decentralized Autonomous Popcorn Stand)",
  "is_nft": false
}
```

<!-- TOC --><a name="use-chaingraphcash"></a>

#### Usar Chaingraph.cash

[Chaingraph](https://chaingraph.cash/) es un indexador de la blockchain de BCH con una API [GraphQL](https://graphql.org/) que vimos por primera vez en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#using-the-chaingraph-indexer). Mientras que el indexador BCMR mencionado arriba rastrea la blockchain para encontrar, reunir y presentar metadatos BCMR fuera de la cadena, Chaingraph indexa todo lo que está en la cadena.

Puedes usar la función `GetTransactionDetails` [del tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#using-the-chaingraph-indexer) para ver la authchain de una identidad. Copia el script, ponlo en tu editor de código y, donde aparece `transaction` al principio de la función, reemplaza ese hash de transacción por el que quieres consultar.

Ten en cuenta que el prefijo `\\x` en el script y en los resultados solo indica que lo que sigue está en [formato hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal). Asegúrate de conservarlo en tu consulta; si no, Chaingraph devolverá un conjunto de datos vacío.

Usemos `GetTransactionDetails` para ver la authchain de Popcorn!. Este es el resultado:

```json
{
  "data": {
    "transaction": [
      {
        "authchains": [
          {
            "authchain_length": 3,
            "authhead_transaction_hash": "\\xd39daf150aba899fe44771e9d90410ce326836e54726262aa4c4fc4fe4d676dd",
            "authhead": {
              "block_inclusions": [
                {
                  "block": {
                    "height": "809456"
                  }
                }
              ]
            },
            "migrations": [
              {
                "migration_index": "0",
                "transaction": [
                  {
                    "hash": "\\x02a690fadd8e3ff5539726c6eca6c2b8039bce945634d78ac46b1db26a8a0eaf"
                  }
                ]
              },
              {
                "migration_index": "1",
                "transaction": [
                  {
                    "hash": "\\x6f2383b2b2563e15393fc03c6cc225350509b4e5c014ab9d35925cbcdd62d45d"
                  }
                ]
              },
              {
                "migration_index": "2",
                "transaction": [
                  {
                    "hash": "\\xd39daf150aba899fe44771e9d90410ce326836e54726262aa4c4fc4fe4d676dd"
                  }
                ]
              }
            ],
            "unspent_authhead": true
          }
        ]
      }
    ]
  }
}
```

Como vemos, esta información coincide con los datos resumidos en [TokenExplorer.cash](https://tokenexplorer.cash/?tokenId=6f2383b2b2563e15393fc03c6cc225350509b4e5c014ab9d35925cbcdd62d45d) para esta identidad, e incluso nos muestra las transacciones en las que se gastó la salida de identidad de Popcorn! para que su authchain llegara a una longitud de 3.

<!-- TOC --><a name="task-trace-an-authchain-for-50-xrbf"></a>

#### TAREA: rastrear una authchain por 500 XRBF

Toma el token fungible [que creaste en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#create-your-first-fungible-cashtokens-fts) y rastrea su authchain con el script `GetTransactionDetails`. O hazlo con cualquier token que no se haya tratado ya en esta serie de tutoriales. Comparte el resultado de Chaingraph (con el formato correcto usando [comillas invertidas](https://www.wikihow.com/Send-Code-on-Telegram)) y tu análisis en el [canal Panmoni CashTokens de Telegram](https://t.me/Panmoni/315), junto con tu dirección de BCH.

La recompensa por completar la tarea con éxito es de **500 XRBF**. Más vale darse prisa con esta, porque por ahora hay pocos tokens para elegir para tu análisis, ¡y cada uno solo se puede recompensar una vez!

<!-- TOC --><a name="2-create-your-personal-andor-corporate-identity-on-the-blockchain"></a>

### 2. Crear tu identidad personal y/o corporativa en la blockchain

Aquí tienes un pequeño caso de uso divertido de BCMR. Como sabes, el BCMR no trata principalmente de tokens. El BCMR trata de **identidades**. Y las identidades pueden tener tokens (o no). Así que creé un BCMR para mi identidad personal.

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": {
    "major": 0,
    "minor": 1,
    "patch": 0
  },
  "latestRevision": "2023-11-30T22:23:41.467Z",
  "tags": {
    "developer": {
      "name": "Developer",
      "description": "An individual skilled in software development."
    },
    "writer": {
      "name": "Writer",
      "description": "An individual who expresses ideas through writing."
    },
    "blockchain-enthusiast": {
      "name": "Blockchain Enthusiast",
      "description": "Someone deeply interested in blockchain technology."
    },
    "individual": {
      "name": "Individual Person",
      "description": "An individual person, as opposed to a corporate entity."
    }
  },
  "registryIdentity": {
    "name": "George Donnelly Individual Registry",
    "description": "Self-published BCMR for George Donnelly.",

    "uris": {
      "icon": "ipfs://bafkreif3cexmrsqjxxfhzoxwlhlys63opwtm56sdijntddcso5vhwndddi",
      "web": "https://georgedonnelly.com/",
      "registry": "https://georgedonnelly.com/.well-known/bitcoin-cash-metadata-registry.json"
    }
  },
  "identities": {
    "??hash??": {
      "2023-11-30T22:23:41.467Z": {
        "name": "George Donnelly",
        "description": "I'm a content writer, project manager, Web3 coder, sci-fi author, weekend hiker and dad. I'm an idealistic pioneer in Bitcoin & Web3 adoption who's known for taking the initiative and inspiring people. I've delivered more than $5.5mm in global projects.",
        "tags": ["developer", "writer", "author", "individual"],
        "uris": {
          "icon": "ipfs://bafkreif3cexmrsqjxxfhzoxwlhlys63opwtm56sdijntddcso5vhwndddi",
          "web": "https://GeorgeDonnelly.com",
          "youtube": "https://www.youtube.com/@GeorgeDonnelly",
          "support": "https://t.me/GeorgeDonnelly",
          "telegram": "https://t.me/GeorgeDonnelly",
          "twitter": "https://twitter.com/GeorgeDonnelly",
          "x": "https://x.com/GeorgeDonnelly",
          "reddit": "https://www.reddit.com/user/georgedonnelly",
          "instagram": "https://www.instagram.com/GeorgeDonnelly",
          "linkedin": "https://www.linkedin.com/in/georgedonnelly",
          "github": "https://github.com/georgedonnelly"
        },
        "extensions": {
          "contact": {
            "phone": "+1 (215) 360-3513",
            "email": "me@georgedonnelly.com"
          },
          "pay": {
            "bch": "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a"
          }
        }
      }
    }
  },
  "license": "CC0-1.0"
}
```

¡Adelante, modifica esta plantilla con tu propia información!

<!-- TOC --><a name="create-a-mainnet-js-project"></a>

#### Crear un proyecto de Mainnet-JS

A continuación, vamos a crear un proyecto de Mainnet-JS. ¡Sígueme, porque es mucho más fácil de lo que parece!

Puedes encontrar el código de este proyecto en [GitHub](https://github.com/Panmoni/identity).

Abre tu app de terminal y haz `cd` a una ubicación adecuada. Crea un directorio para este proyecto y entra en él:

`mkdir identity && cd identity`

Si todavía no [instalaste NodeJS en tu sistema de desarrollo](https://nodejs.org/en/download), deberías hacerlo ahora. Yo lo instalé con [Homebrew](https://brew.sh/) en MacOS.

Luego, instala mainnet-js. Ejecuta este comando dentro del directorio que acabas de crear:

`npm i mainnet-js`

Si usas [Visual Studio Code](https://code.visualstudio.com/), quizá puedas ejecutar este comando para abrir este proyecto en el IDE.

`code .`

Si no, puedes abrir tu IDE o editor de texto favorito (no un editor de texto enriquecido) y abrir el directorio que acabas de crear.

Edita tu archivo `package.json` y anota la versión de mainnet-js que instalaste. Reemplaza el contenido del archivo con el texto de abajo, pero asegúrate de **conservar el mismo valor** de la versión de mainnet-js que aparecía cuando abriste el archivo por primera vez.

```json
{
  "name": "identity",
  "version": "0.0.1",
  "description": "",
  "main": "test.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "mainnet-js": "^2.3.0"
  }
}
```

En mi caso, al momento de publicar esto, usé la versión `^2.3.0` de mainnet-js.

<!-- TOC --><a name="identify-the-pre-genesis-transaction"></a>

#### Identificar la transacción pregénesis

Como vimos por primera vez en el [tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#cashtokens-explained) de esta serie, cada identidad tiene una `category`, y esta `category` es el hash, o id, de la **transacción pregénesis**. La transacción pregénesis es la transacción que creó el UTXO usado como primera entrada de la transacción génesis de la identidad.

Volvamos a este diagrama de [CashTokens.org](https://cashtokens.org/docs/bcmr/chip/#zeroth-descendant-transaction-chains).

![](../../../assets/images/posts/tp3/authchain.png 'Fuente: https://cashtokens.org/docs/bcmr/chip/#zeroth-descendant-transaction-chains')

El authbase de la identidad representada en el diagrama es la primera transacción de la izquierda. Como ves, tiene una entrada. La transacción que vino antes —aquella en la que esta única entrada era una salida—: _esa_ es la transacción pregénesis.

<!-- TOC --><a name="getpregenesistxjs"></a>

##### getPreGenesisTX.js

Quizá notaste este fragmento de texto en el BCMR de ejemplo: `??hash??`. Aquí es donde suele ir el valor de `category`.

Pero todavía no hemos creado esta identidad. Y no podemos crearla hasta subir el BCMR a IPFS. Algo que no podemos hacer hasta conocer el valor de `category`.

¡Es el dilema del huevo y la gallina!

Aquí es donde getPreGenesisTX.js viene al rescate. Robé la mayor parte de su [código](https://github.com/Panmoni/identity/blob/main/getPreGenesisTX.js) útil de la excelente billetera [Cashonize](https://cashonize.com) de Mathieu Geukens. (¡Puedes aprender mucho leyendo el código de otras personas!)

Adelante: crea el archivo `getPreGenesisTX.js` en tu proyecto y pega este código en él.

```js
// getPreGenesisTX.js
// ht https://github.com/cashonize/wallet/blob/main/script.js

import { Wallet, TestNetWallet } from 'mainnet-js';

// replace with your seedphrase and be sure to protect it
const seedphrase = 'gunter glieben glauten globen';

const derivationPathAddress = "m/44'/145'/0'/0/0";

const network = 'mainnet';

const walletClass = network == 'mainnet' ? Wallet : TestNetWallet;
const wallet = await walletClass.fromSeed(seedphrase, derivationPathAddress);

const balance = await wallet.getBalance();

async function getValidPreGenesis() {
  let walletUtxos = await wallet.getAddressUtxos();
  return walletUtxos.filter((utxo) => !utxo.token && utxo.vout === 0);
}
if (balance.sat) {
  let validPreGenesis = await getValidPreGenesis();
  if (validPreGenesis.length === 0) {
    await wallet.send([{ cashaddr: wallet.tokenaddr, value: 10000, unit: 'sat' }]);
    console.log('Created output with vout zero for token genesis');
    validPreGenesis = await getValidPreGenesis();
  }
  const tokenId = validPreGenesis[0].txid;
  console.log(`Pre-Genesis Transaction: ${tokenId}`);
} else {
  console.log('No BCH');
}

getValidPreGenesis();
```

Como se mencionó en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#e-oops-authupdatejs-to-the-rescue), ten mucho cuidado al trabajar con tu frase semilla. Es buena idea borrarla del archivo cuando termines de usarla. Sobre todo, ten mucho cuidado de no compartirla ni, uf, subir el archivo a GitHub con la frase semilla intacta.

Si quieres probar el script antes de usarlo en la red principal, puedes cambiar el valor de la variable `network` de `mainnet` a `chipnet`. Puedes obtener tBCH de Chipnet en [tbch.googol.cash](https://tbch.googol.cash/) para pagar las comisiones de transacción.

Como se mencionó en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#a-if-you-want-to-use-chipnet), puede ser útil usar para esto una billetera que hayas creado con Cashonize, ya que te permite cambiar fácilmente entre la red principal y Chipnet.

Cuando estés conforme con tu configuración, guarda el archivo y ejecútalo:

`node getPreGenesisTX.js`

Si no tienes (t)BCH en la billetera, te lo indicará. Si la billetera no tiene transacciones, creará una. De lo contrario, te dará el hash de transacción de tu primer UTXO sin token

Este es el resultado que obtuve:

```
$ node getPreGenesisTX.js
Pre-Genesis Transaction: 4fe0225c73b5a5f062cad58ee9222798dadece10f866e89305e8fb22b033ec24
```

Copia el resultado hexadecimal y, en tu archivo BCMR, reemplaza `??hash??` por el valor que obtuviste. En otras palabras, en mi caso, esto quedó como mi `category`:

`4fe0225c73b5a5f062cad58ee9222798dadece10f866e89305e8fb22b033ec24`

Guarda y sube tu archivo a IPFS, p. ej., a [NFT.storage](https://nft.storage/). Obtén el CID del archivo ([explicado en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#4-create-the-token-metadata)) y tenlo a mano. Usa el menú Actions de NFT.storage y haz clic en “View URL” para asegurarte de que tu archivo BCMR carga bien.

Subí mi BCMR a IPFS y también a mi propio dominio, solo por diversión.

```
ipfs://bafkreifbraez6v3uangbd2fsdtklnrfazei6gwyxhll5l6tp4t5kapbh4u
https://georgedonnelly.com/.well-known/bitcoin-cash-metadata-registry.json
```

<!-- TOC --><a name="create-your-identitys-authbase"></a>

#### Crear el authbase de tu identidad

¡Ahora ya puedes crear la transacción authbase de tu identidad!

Adelante: crea el archivo `createIdentity.js` en tu proyecto y pega este código en él. ¡Gracias al código de [AuthUpdate](https://github.com/mr-zwets/AuthUpdate) y [Cashonize](https://github.com/cashonize/wallet/blob/main/script.js) de Mathieu Geukens, y al excelente [tutorial de Mainnet.cash](https://mainnet.cash/tutorial/), por el código y la orientación!

Si no vas a subir también tu BCMR a tu propio dominio, deja vacío el campo `dnsBCMR`.

```js
// createIdentity.js
// ht https://github.com/mr-zwets/AuthUpdate & https://mainnet.cash/tutorial/ & https://github.com/cashonize/wallet/blob/main/script.js
// Make sure your BCMR is loading at the ipfs.nftstorage.link gateway before starting. Alternatively, adjust bcmrFile.

import { Wallet, TestNetWallet, utf8ToBin, sha256, OpReturnData } from 'mainnet-js';

//
// VARIABLES
//
const seedPhrase = 'gunter glieben glauten globen';

const derivationPathAddress = "m/44'/145'/0'/0/0"; // last number is the address index from electron cash, if you are using it.

// If using 2 BCMRs, both files must be identical as this script only hashes the IPFS one.
// the CID of your BCMR file uploaded to IPFS, starts with 'baf'. Recommend nft.storage.
const bcmrCID = 'bafxxx';
const dnsBCMR = 'example.com'; // FQDN

const network = 'mainnet'; // mainnet or chipnet

//
// SCRIPT
//
// establish wallet
const walletClass = network == 'mainnet' ? Wallet : TestNetWallet;
const wallet = await walletClass.fromSeed(seedPhrase, derivationPathAddress);

// test wallet for sufficient balance
const walletAddress = wallet.getDepositAddress();
const balance = await wallet.getBalance();

console.log(`wallet address: ${walletAddress}`);
console.log(`Bch amount in walletAddress is ${balance.bch}bch or ${balance.sat}sats`);

if (balance.sat < 1000) throw new Error('Not enough BCH to make the transaction!');

// hash the BCMR file
const bcmrFile = `https://${bcmrCID}.ipfs.nftstorage.link/`;
const reponse = await fetch(bcmrFile);
const bcmrContent = await reponse.text();
const bcmrHash = sha256.hash(utf8ToBin(bcmrContent));

// create BCMR opreturn
const ipfsBCMRLink = `ipfs://${bcmrCID}`;
let bcmrChunks = ['BCMR', bcmrHash, ipfsBCMRLink];
if (dnsBCMR) {
  bcmrChunks.push(dnsBCMR);
}
let opreturnData = OpReturnData.fromArray(bcmrChunks);

const authBase = { cashaddr: walletAddress, value: 800, unit: 'sats' };
const outputs = [authBase, opreturnData];

// create transaction,identity output and opreturn
// change output is automatic.
let walletUtxos = await wallet.getAddressUtxos();
const preGenesisUTXO = walletUtxos.filter((utxo) => !utxo.token && utxo.vout === 0)[0];

// output txid
const { txId } = await wallet.send(outputs, { ensureUtxos: [preGenesisUTXO] });

// Log transaction ID
const explorerUrl =
  network === 'mainnet' ? `https://explorer.bitcoinunlimited.info/tx/${txId}` : `https://chipnet.bch.ninja/tx/${txId}`;
console.log(`Transaction ID: ${explorerUrl}`);
```

Igual que con `getPreGenesisTX.js`, se aplican las mismas notas sobre las variables `seedPhrase` y `network`.

Además, pon el CID de tu BCMR como valor de la variable `bcmrCID`. Puedes dejar `dnsBCMR` vacío o completar el FQDN donde está tu BCMR (en la ruta `/.well-known/bitcoin-cash-metadata-registry.json`).

Cuando esté listo, puedes ejecutar el script:

`node createIdentity.js`

Yo primero experimenté con el mío en Chipnet. Este es un resultado de ejemplo del script de esa prueba:

```
$ node createIdentity.js
wallet address: bchtest:qphltzfypuy9ddlzge7lzayg3p2xnpa6qs3k5e0y5j
Bch amount in walletAddress is 1.40121226bch or 140121226sats
Transaction ID: https://chipnet.bch.ninja/tx/f1dcea41a49b1c2b3bc3f3dd616ca798f3e73667bcfcac41ab9a7bf003b2d653
```

Después de comprobar que funcionaba en Chipnet, cambié el valor de `network` a `mainnet` y lo ejecuté en la red principal. Este es el resultado:

```
$ node createIdentity.js
wallet address: bitcoincash:qphltzfypuy9ddlzge7lzayg3p2xnpa6qs4ys7dnnw
Bch amount in walletAddress is 0.04009803bch or 4009803sats
Transaction ID: https://explorer.bitcoinunlimited.info/tx/3d14d6f39b5508e24230086c2bc948cde741adb3d6614e2e14a91c53c18fcb34

```

<!-- TOC --><a name="verify"></a>

#### Verificar

El script `createIdentity.js` muestra un enlace a un explorador de bloques para la transacción que acabas de crear. ¡Adelante, ábrelo! ¡Explora!

Este es el mío: [explorer.bitcoinunlimited.info](https://explorer.bitcoinunlimited.info/tx/3d14d6f39b5508e24230086c2bc948cde741adb3d6614e2e14a91c53c18fcb34).

Mira la entrada 0 de la transacción. Haz clic en el texto enlazado `4fe0225c73b5a5f062cad58ee… #0`. Los datos hexadecimales serán distintos en tu caso.

![](../../../assets/images/posts/tp3/Screenshot%202023-12-21%20at%206.34.47%20PM.png)

Esto te llevará a la transacción pregénesis. Asegúrate de que su id de transacción coincida con lo que pusiste en tu BCMR. En mi caso, coincide.

<!-- TOC --><a name="analyze"></a>

#### Analizar

Vuelve a la transacción génesis de tu identidad y mira el OP_RETURN. Este es el mío.

![](../../../assets/images/posts/tp3/Screenshot%202023-12-21%20at%206.32.51%20PM.png)

Como ves, incluye `BCMR` y también mis dos enlaces de BCMR: IPFS y nombre de dominio.

¡Esto va bien!

Pero estamos aquí para aprender, ¡así que profundicemos! Haz clic en “show raw” para explorar otro nivel.

```json
`OP_RETURN
data(utf-8) - BCMR �� �WtL�ԶĠ��[:���o���<'�Bipfs://bafkreifbraez6v3uangbd2fsdtklnrfazei6gwyxhll5l6tp4t5kapbh4ugeorgedonnelly.com
data(hex) - OP_RETURN 1380795202 a188099f5774034c11e8b21cd4b6c4a0c911e35b173ad7d5fa6fe4faa03c27e5 697066733a2f2f6261666b72656966627261657a36763375616e67626432667364746b6c6e7266617a65693667777978686c6c356c3674703474356b617062683475 67656f726765646f6e6e656c6c792e636f6d
```

¿Qué es este `1380795202`? En realidad, representa los valores ASCII de los caracteres de 'BCMR' codificados como un entero de 32 bits en formato little-endian. En otras palabras, cada byte del entero de 32 bits corresponde a un carácter en la codificación ASCII.

Desglosémoslo:

- El código ASCII de 'B' es 66, que es 42 en hexadecimal.
- El código ASCII de 'C' es 67, que es 43 en hexadecimal.
- El código ASCII de 'M' es 77, que es 4D en hexadecimal.
- El código ASCII de 'R' es 82, que es 52 en hexadecimal.

Cuando estos valores hexadecimales se ordenan en formato little-endian (orden inverso), forman `0x524d4342`, que es `1380795202` en decimal.

Así, `1380795202` en decimal [equivale](https://www.rapidtables.com/convert/number/decimal-to-hex.html) a `0x524d4342` en hexadecimal, que se traduce como 'BCMR' en ASCII.

A mí me parece demasiado complejo, ¡pero así funciona!

El siguiente valor de mi OP_RETURN (el tuyo será distinto) es:

`a188099f5774034c11e8b21cd4b6c4a0c911e35b173ad7d5fa6fe4faa03c27e5`

Puedes usar el siguiente script de Python para comprobarlo.

Adelante: crea el archivo `verifyBCMRHash.py` en tu proyecto y pega este código en él. Actualiza `bcmr_cid` con el CID de tu BCMR.

```python
# verifyBCMRHash.py

import requests
import hashlib

def get_bcmr_hash(bcmr_cid):
    bcmr_file = f"https://{bcmr_cid}.ipfs.nftstorage.link/"
    response = requests.get(bcmr_file)
    bcmr_content = response.text
    bcmr_hash = hashlib.sha256(bcmr_content.encode('utf-8')).hexdigest()
    return bcmr_hash

# Example usage
bcmr_cid = "your_bcmr_cid_here"
bcmr_hash = get_bcmr_hash(bcmr_cid)
print("BCMR hash:", bcmr_hash)
```

¡Lo ejecuté con el mío y, efectivamente, los valores coinciden!

```
$ python3.10 verifyBCMRHash.py
BCMR hash: a188099f5774034c11e8b21cd4b6c4a0c911e35b173ad7d5fa6fe4faa03c27e5
```

Luego viene esta cadena hexadecimal más larga:

```
697066733a2f2f6261666b72656966627261657a36763375616e67626432667364746b6c6e7266617a65693667777978686c6c356c3674703474356b617062683475
```

Al [decodificarla de hexadecimal a ASCII](https://www.rapidtables.com/convert/number/hex-to-ascii.html), se traduce en un enlace de IPFS:

`ipfs://bafkreifbraez6v3uangbd2fsdtklnrfazei6gwyxhll5l6tp4t5kapbh4u`

Luego viene otra cadena hexadecimal:

`67656f726765646f6e6e656c6c792e636f6d`

Al [decodificarla de hexadecimal a ASCII](https://www.rapidtables.com/convert/number/hex-to-ascii.html), dice `georgedonnelly.com`.

Aunque esto puede parecer complejo al principio, después de analizarlo un poco todo parece bastante prosaico, ¿no?

¡Esa es la belleza de desarrollar en una cadena UTXO con protocolos elegantes como CashTokens y BCMR! ¡Disfrútalo!

<!-- TOC --><a name="use-cases"></a>

#### Casos de uso

Tener identidades creadas en la cadena podría ser útil en diversas situaciones, por ejemplo, para crear un clon descentralizado y resistente a la censura de [KeyBase](https://keybase.io/) o un sistema de reputación descentralizado que facilite la rendición de cuentas individual.

<!-- TOC --><a name="task-create-an-identity-for-100-xrbf"></a>

#### TAREA: crear una identidad por 1000 XRBF

Crea cualquier identidad BCMR registrada en la cadena, por ejemplo, para el token fungible [que creaste en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#create-your-first-fungible-cashtokens-fts), y comparte el enlace a la transacción con su OPRETURN en el [canal Panmoni CashTokens de Telegram](https://t.me/Panmoni/315), junto con tu dirección de BCH.

La recompensa por completar la tarea con éxito es de **1000 XRBF**.

<!-- TOC --><a name="3-update-your-token-and-nft-bcmr-files"></a>

### 3. Actualizar los archivos BCMR de tus tokens y NFTs

Cuando actualizas tu BCMR, también tienes que actualizar tu authchain. El desarrollador de BCH [Mathieu Geukens](https://www.youtube.com/@mrzwets) creó un script práctico para esto llamado [AuthUpdate](https://github.com/mr-zwets/AuthUpdate).

Lo [vimos en el tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#e-oops-authupdatejs-to-the-rescue), así que puedes volver a consultarlo para ver cómo funciona.

<!-- TOC --><a name="updating-xrbf"></a>

#### Actualización de XRBF

Ahora que actualicé el BCMR de XRBF para incluir etiquetas y una instantánea de identidad antigua, voy a actualizar su authhead así.

1. Sube el nuevo BCMR a [NFT.storage](https://NFT.storage/) o a tu servicio de pinning de IPFS favorito, como se muestra en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#b-upload-your-bcmr-file-to-ipfs).
2. Visita [TokenExplorer.cash](https://tokenexplorer.cash/) e ingresa la `category` del token que piensas actualizar. Desplázate hasta abajo y anota la **authchain length**.
3. Asegúrate de que tu archivo BCMR se muestre correctamente en https://ipfs.io/ipfs/`your-CID`. Si recibes un error 504, actualiza la página cada pocos minutos hasta que aparezcan tus datos BCMR. No sigas hasta que esto funcione.
4. Crea la transacción de actualización con authUpdate.js, como se muestra en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#e-oops-authupdatejs-to-the-rescue).
5. Comprueba que funcionó viendo si la **authchain length** de tu token aumentó en 1 en [TokenExplorer.cash](https://tokenexplorer.cash/).

<!-- TOC --><a name="hash-doesnt-match"></a>

##### ¿El hash no coincide?

Cuando authUpdate.js creó la nueva salida de identidad y su OP_RETURN correspondiente (es decir, una nueva transacción), calculó el hash del BCMR que le diste.

Exploradores como [SalemKode](https://explorer.salemkode.com/) y [TokenExplorer.cash](https://tokenexplorer.cash/), así como otras apps para usuarios finales, comprobarán que el hash del archivo actual en IPFS y el hash del OP_RETURN realmente coincidan.

Si no coinciden, verás una pequeña “x” roja en [TokenExplorer.cash](https://tokenexplorer.cash/) y un círculo rojo con un signo de exclamación en [SalemKode](https://explorer.salemkode.com/).

Curiosamente, esto me pasó en mi primer intento de actualizar los metadatos de XRBF, porque el archivo BCMR aún no se había propagado de NFT.storage al gateway de IPFS en ipfs.io.

Revisé https://ipfs.io/ipfs/`your-CID` y recibí este error; de ahí el paso 3 de arriba.

![](../../../assets/images/posts/tp3/Screenshot%202023-12-20%20at%202.25.26%20PM.png)

Si te pasa esto y ves una “x” roja en [TokenExplorer.cash](https://tokenexplorer.cash/), puedes esperar a que el BCMR se propague y volver a ejecutar authUpdate.js, o editar authUpdate.js para usar otro gateway de IPFS donde tu BCMR ya se haya propagado.

<!-- TOC --><a name="havent-created-an-ft-or-nft-yet"></a>

#### ¿Todavía no has creado un FT o un NFT?

Para crear tu primer CashTokens, consulta el [tutorial 1 para tokens fungibles](/blog/token-pioneers-cashtokens-tutorial-1) y el [tutorial 2 para NFTs](/blog/token-pioneers-cashtokens-tutorial-2). Como las comisiones de BCH son tan bajas, hacerlo casi no cuesta nada.

E incluso si solo agregas uno o dos dólares de liquidez para tu FT en [cauldron.quest](https://cauldron.quest/), puedo listarlo en [TokenStork.com](https://TokenStork.com/).

¡Así que no esperes! ¡Súmate hoy a la fiebre de CashTokens!

<!-- TOC --><a name="otrcash-eligibility"></a>

#### Requisitos para otr.cash

Si creaste tu token y quieres que aparezca [listado](https://otr.cash/docs/list) en otr.cash, pero, por ejemplo, elegiste un símbolo de ticker de menos de 4 caracteres, puedes corregirlo ahora y luego usar AuthUpdate para cumplir los requisitos antes de listar tu token en la siguiente sección.

<!-- TOC --><a name="cashtokens-studio"></a>

#### CashTokens Studio

Gracias al equipo de desarrollo de Paytaca, [CashTokens Studio](https://cashtokens.studio) ya está disponible para hacer pruebas de creación y actualización de tus FTs y NFTs con CashTokens. Probablemente lo trate con más detalle en un futuro tutorial. ¡Pero no dudes en [probarlo](https://cashtokens.studio)!

<!-- TOC --><a name="task-update-an-identity-for-250-xrbf"></a>

#### TAREA: actualizar una identidad por 2500 XRBF

Actualiza cualquier identidad BCMR bajo tu control que esté registrada en la cadena, por ejemplo, la del token fungible [que creaste en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#create-your-first-fungible-cashtokens-fts), y comparte el enlace a la transacción con su OP_RETURN en el [canal Panmoni CashTokens de Telegram](https://t.me/Panmoni/315).

La recompensa por completar la tarea con éxito es de **2500 XRBF**.

<!-- TOC --><a name="4-get-your-tokens-listed-on-otrcash-andor-tokenstorkcom"></a>

### 4. Listar tu(s) token(s) en otr.cash y/o TokenStork.com

[OTR.cash](https://otr.cash/.well-known/bitcoin-cash-metadata-registry.json) es un BCMR basado en DNS donde se listan varias identidades. Tiene [requisitos de listado](https://otr.cash/docs/list) estrictos y se considera el registro de referencia del ecosistema.

El [registro de TokenStork](https://tokenstork.com/.well-known/bitcoin-cash-metadata-registry.json) es más que nada un espejo de esos datos, aunque en el futuro quizá aloje allí datos BCMR que no cumplan las pautas de listado de otr.cash.

Aparecer en cualquiera de los dos registros es tan fácil como hacer un pull request en GitHub.

<!-- TOC --><a name="how-to-create-a-pull-request"></a>

#### Cómo crear un pull request

Un pull request es cuando copias (haces un fork de) el código de alguien, haces cambios en tu copia y luego ofreces que el código original incorpore tus cambios.

Aquí tienes la [documentación de GitHub sobre pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) y estos son los pasos básicos para un pull request exitoso.

1. Necesitas una cuenta de GitHub. [Crea una aquí](https://github.com/join/) si todavía no tienes.
2. Haz un fork del repositorio del código original; es decir, copia el código a un nuevo repositorio en tu cuenta de GitHub. Luego clona tu copia del repositorio en tu computadora. Puedes usar el comando `git clone` para esto.
3. Haz los cambios que quieras. En este caso, eso significa agregar tu identidad en el lugar correcto de la jerarquía JSON, cerca del final del archivo `bitcoin-cash-metadata-registry.json`.
4. Sube tus cambios a tu repositorio en GitHub, normalmente con el comando `git push`.
5. En GitHub.com, crea el pull request.

Este [tutorial sobre pull requests](https://www.youtube.com/watch?v=jRLGobWwA3Y) de 3 minutos es excelente. Dicho esto, puedes saltarte la parte de crear una nueva rama, ya que en este caso no es necesaria.

Para tu pull request al registro de otr.cash, debes usar [esta plantilla](https://github.com/OpenTokenRegistry/otr.cash/blob/master/.github/pull_request_template.md). Copia el markdown sin formato y pégalo en el campo de texto de tu pull request si por algún motivo no aparece automáticamente. Complétala con cuidado.

Vale la pena ser detallista al solicitar un listado, ya que otr.cash lo gestionan [voluntarios del ecosistema](https://github.com/orgs/OpenTokenRegistry/people) que tienen poco tiempo para revisar solicitudes mal hechas.

Como referencia, mira [mi pull request para agregar el token XRBF a otr.cash](https://github.com/OpenTokenRegistry/otr.cash/pull/13). ¡Se aceptó al primer intento!

<!-- TOC --><a name="registry-repos"></a>

##### Repositorios de los registros

Puedes encontrar el repositorio del registro de OTR.cash en [github.com/OpenTokenRegistry/otr.cash](https://github.com/OpenTokenRegistry/otr.cash) y el del registro de TokenStork.com en [github.com/Panmoni/tokenstork](https://github.com/Panmoni/tokenstork).

<!-- TOC --><a name="email-submission"></a>

##### Envío por correo electrónico

Si todo esto te parece demasiado, puedes enviar tu BCMR al registro de TokenStork por correo electrónico a [hello@panmoni.com](mailto:hello@panmoni.com). Asegúrate de incluir el enlace a tu archivo JSON (los enlaces de IPFS son los mejores). Por favor, no lo adjuntes ni incluyas el texto JSON en el cuerpo del mensaje.

<!-- TOC --><a name="this-is-optional"></a>

#### Esto es opcional

Recuerda que listar tu identidad/token en estos u otros registros es totalmente opcional, porque el que más importa es el que creas y enlazas en la cadena. ¡Basta con seguir los tutoriales [1](/blog/token-pioneers-cashtokens-tutorial-1) (FTs) y/o [2](/blog/token-pioneers-cashtokens-tutorial-2) (NFTs), según el caso, para crear con éxito un token en BCH!

<!-- TOC --><a name="task-submit-your-pull-request-for-750-xrbf"></a>

#### TAREA: enviar tu pull request por 7500 XRBF

Haz un pull request bien hecho, como se describe arriba, para tu FT y/o NFT y comparte el enlace en el [canal Panmoni CashTokens de Telegram](https://t.me/Panmoni/315).

La recompensa por completar la tarea con éxito es de **7500 XRBF**.

<!-- TOC --><a name="5-create-your-own-domain-based-metadata-registry"></a>

### 5. Crear tu propio registro de metadatos basado en un dominio

Crear tu propio registro basado en un dominio, como otr.cash o TokenStork.com, es muy fácil si ya tienes un dominio y un sitio web.

1. Crea un directorio en la raíz de tu sitio llamado `.well-known`.
2. Pon en ese directorio un archivo llamado `bitcoin-cash-metadata-registry.json`.
3. Pon datos BCMR válidos en el archivo. Por ejemplo, podrías hacer un espejo del registro de [otr.cash](https://otr.cash/.well-known/bitcoin-cash-metadata-registry.json) con solo copiarlo y pegarlo en tu BCMR.

Ten en cuenta que, por ahora, no conviene usar registros basados en dominio con varias identidades, como los descritos aquí, dentro de tus OP_RETURNs en la cadena, ya que el hash no coincidirá con el hash de un BCMR que contenga solo tus propias identidades.

<!-- TOC --><a name="conclusion"></a>

## Conclusión

En este tutorial, nos adentramos en el complejo mundo de los metadatos CashTokens, centrándonos en la especificación Bitcoin Cash Metadata Registries (BCMR). Este recorrido es clave para los desarrolladores de BCH CashTokens que buscan entender a fondo cómo los metadatos transforman datos complejos en la cadena en formatos legibles y fáciles de usar. BCMR no es solo un marco técnico. Es un puente que conecta los datos en bruto de la blockchain de BCH con presentaciones pulidas en billeteras, sitios web y aplicaciones descentralizadas (dapps), lo que hace que la tecnología BCH sea más accesible y apta para el público general.

Los archivos BCMR, estructurados como simples archivos de texto JSON, son ligeros y fáciles de actualizar, pero cumplen un papel fundamental al definir la identidad de los tokens fungibles y los NFTs dentro del ecosistema de BCH. Vinculan estos activos en la cadena con datos fuera de la cadena, lo que ahorra espacio en la blockchain y a la vez enriquece la experiencia del usuario. Ya sea para billeteras como [Paytaca](https://paytaca.com) y [Cashonize](https://cashonize.com) o para diversas dapps de BCH, los metadatos BCMR son el héroe invisible que hace que los tokens y los NFTs sean más que simples cadenas de caracteres.

<!-- TOC --><a name="invaluable-developer-skills"></a>

### Habilidades invaluables para desarrolladores

Este tutorial no solo ofreció conocimientos teóricos, sino también ejercicios prácticos, con la oportunidad de ganar experiencia práctica e incluso recompensas en tokens XRBF. Al explorar authchains, crear identidades personales o corporativas en la blockchain y actualizar archivos BCMR, adquiriste habilidades invaluables que se aplican directamente en el ecosistema de BCH CashTokens.

<!-- TOC --><a name="were-just-beginning"></a>

### Apenas estamos empezando

Al cerrar este tutorial, recuerda que el camino con CashTokens y BCMR apenas comienza. El ecosistema de BCH está prosperando y evoluciona constantemente, y hay mucho espacio para la innovación y el crecimiento. Los conceptos y habilidades que aprendiste aquí te servirán como base sólida para tus futuros proyectos, sea lo que sea que estés construyendo. Atento a lo que viene en esta serie, donde seguiremos explorando las interesantes posibilidades que ofrecen BCH y CashTokens.

<!-- TOC --><a name="next-up"></a>

### ¡Lo que viene!

En las próximas entregas de esta serie, construiremos una dapp de venta de entradas, un warrant canary y un contrato de ICO, y aprenderemos a construir transacciones con Libauth y el Bitauth IDE. ¡Atento!

Esta serie, “Token Pioneers”, está dedicada a darte las herramientas y la capacidad a ti, la nueva generación de desarrolladores de BCH. Tu camino acaba de empezar, y el potencial de innovación e impacto es enorme. Sigue construyendo, sigue explorando y mantente atento a este espacio para ver más tutoriales y novedades sobre el dinámico mundo de BCH CashTokens.

<!-- TOC --><a name="earn-xrbf"></a>

### ¡Gana XRBF!

¡Aprovecha todas las tareas de aprendizaje de esta serie para ganar algunos XRBF mientras construyes tu perfil de desarrollador de BCH!

XRBF es uno de los tokens fungibles de CashTokens más destacados y con mejor rendimiento. ¡En el futuro, los poseedores de XRBF podrían formar una DAO para apoyar la misión de
[Real Bitcoin Fam](https://RealBitcoinFam.com) de atraer y apoyar a nuevos desarrolladores de BCH!

- [Tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#bonus-get-some-xrbf-tokens-): gana hasta 110 XRBF.
- [Tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2): gana hasta 1000 XRBF.
- [Tutorial 3](/blog/token-pioneers-cashtokens-tutorial-3): ¡gana hasta 11.500 XRBF!

¡Son **13.160 XRBF** en juego! Y esa cantidad está disponible para todos los que estén dispuestos a ganar mientras aprenden.

¡Hay desarrolladores listos para ayudar a nuevos desarrolladores como tú en el [grupo de Telegram de Panmoni](https://t.me/Panmoni/315)!

### Recibir novedades

La mejor forma de recibir novedades es seguir a [@BitcoinCashSite](https://twitter.com/bitcoincashsite) en Twitter, [@RealBitcoinCashSite](https://www.youtube.com/@RealBitcoinCashSite) en YouTube y/o [@bchworks](https://t.me/bchworks) en Telegram.

<!-- TOC --><a name="thank-you"></a>

### Gracias

Gracias a Mathieu Geukens, BitcoinCashAutist y al proyecto [Mainnet.cash](https://mainnet.cash/) por su orientación técnica esencial, que aumentó el valor de este tutorial.

Gracias a [toorik](https://twitter.com/toorik), anonymous, William Patrick, S0me_N0b0dy y na por su apoyo al [flipstarter](https://archive.li/UznMe) que hace posible esta serie de tutoriales “Token Pioneers”. Visita [BitcoinCashSite.com/about](/about) para ver la lista completa de los más de 55 miembros de la comunidad que han financiado mi trabajo desde 2019.

<!-- TOC --><a name="token-pioneers-status-update"></a>

### Estado de Token Pioneers

Ha pasado un tiempo desde el tutorial número 2, así que gracias por tu paciencia. Me tomé un tiempo lejos de los tutoriales para trabajar en generar más entusiasmo y más dapps en el ecosistema, para que más desarrolladores puedan beneficiarse de esta serie. La buena noticia es que mi trabajo de desarrollo reciente alimentará los temas de futuros tutoriales.

Con el lanzamiento de nuevas herramientas, algunas cosas de los tutoriales [1](/blog/token-pioneers-cashtokens-tutorial-1) y [2](/blog/token-pioneers-cashtokens-tutorial-2) pueden ser más complejas de lo necesario. Dicho esto, sigo creyendo que es bueno que los nuevos desarrolladores de CashTokens tengan una comprensión más completa de cómo construir en BCH. Dominar los fundamentos es una base sólida para construir a largo plazo. Así que seguro que no te hará daño hacer esos tutoriales.

Cuando avance más con los tutoriales escritos de esta serie, volveré a ellos para actualizarlos con las nuevas herramientas y/o produciré videos que reflejen los últimos avances en las herramientas del ecosistema.

Así que puedes estar seguro de que [esta serie de tutoriales](https://gist.github.com/georgedonnelly/317aa1746159dc575c7f612eff475d56) está lejos de terminar y se seguirá actualizando con el tiempo.

<!-- TOC --><a name="support-the-tutorial-series"></a>

### Apoyar la serie de tutoriales

¿Quieres más tutoriales? Acepto donaciones para financiar este trabajo fundamental de enseñar a nuevos desarrolladores de BCH a construir dapps sin permisos e imparables con CashTokens en Bitcoin Cash. También puedes [patrocinar](/blog/token-pioneers-cashtokens-tutorial-1#sponsor-this-work) mi trabajo y recibir beneficios a cambio.

[bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8](bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8)

<!-- TOC --><a name="additional-builder-resources"></a>

## Recursos adicionales para desarrolladores

Puedes encontrar una lista completa de recursos de CashTokens en [BitcoinCashSite.com/cashtokens](/cashtokens), y aquí están los más relevantes para el BCMR.

¡[Avísame](mailto:hello@panmoni.com) si falta tu recurso favorito!

<!-- TOC --><a name="bcmr-tools"></a>

### Herramientas de BCMR

- [BCMR Generator](https://bcmr-generator.netlify.app/)
- [Token Metadata Explorer](https://tokenexplorer.cash/)
- [NFT Viewer](https://viewer.sploit.cash/)
- [API del indexador BCMR](https://bcmr.paytaca.com/)

<!-- TOC --><a name="json-tools"></a>

### Herramientas JSON

- [JSONLint.com](https://jsonlint.com/) (úsalo para validar tus BCMRs)
- [JSONing.com](https://jsoning.com/formatter/) (úsalo para formatear y validar tus BCMRs)

<!-- TOC --><a name="bcmr-content"></a>

### Contenido sobre BCMR

- [How To Add Metadata to CashTokens (The BCMR-standard explained)](https://www.youtube.com/watch?v=3Hr0_re135Q), de Mathieu Geukens
- [Acuña tus primeros CashTokens en Bitcoin Cash (Token Pioneers, tutorial 1)](/blog/token-pioneers-cashtokens-tutorial-1)
- [Acuña tus primeros NFTs en Bitcoin Cash (Token Pioneers, tutorial 2)](/blog/token-pioneers-cashtokens-tutorial-2)

<!-- TOC --><a name="bcmr-technical-guides"></a>

### Guías técnicas de BCMR

- [El esquema BCMR](https://github.com/bitjson/chip-bcmr/blob/master/bcmr-v2.schema.json)
- [Versión más legible del esquema](https://json-schema.app/view/%23?url=https%3A%2F%2Fcashtokens.org%2Fbcmr-v2.schema.json)
- [La especificación BCMR](https://cashtokens.org/docs/bcmr/chip/)
- [Requisitos de listado de otr.cash](https://otr.cash/docs/list/)

[![Token Pioneers](../../../assets/images/posts/tp1/token-pioneers-big.png)](https://gist.github.com/georgedonnelly/317aa1746159dc575c7f612eff475d56)
