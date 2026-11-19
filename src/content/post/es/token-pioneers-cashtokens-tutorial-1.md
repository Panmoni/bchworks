---
publishDate: 2023-07-26T00:00:00.000Z
title: Acuña tus primeros CashTokens en Bitcoin Cash (Token Pioneers, tutorial 1)
description: ninguno
excerpt: Aprende a acuñar tus primeros tokens fungibles con CashTokens en Bitcoin Cash.
image: ~/assets/images/blog/token-pioneers-1.png
category: Tutorial
tags:
  - cashtokens
  - token pioneers
metadata:
  title: Acuña tus primeros CashTokens en Bitcoin Cash
translation:
  sourceHash: 7d96452f78467c4e
  status: machine
  translator: Claude
  qaHash: 5a65abb20777e57d
---

## Índice

- [¿Qué es CashTokens?](#heading-what-is-cashtokens)
  - [Lo que puedes hacer con CashTokens](#heading-what-you-can-do-with-cashtokens)
  - [Por qué importa CashTokens](#heading-why-cashtokens-matters)
- [¡Acuña tus primeros CashTokens!](#heading-mint-your-first-cashtokens)
  - [Una breve introducción al funcionamiento de las transacciones de Bitcoin](#heading-a-quick-intro-to-how-bitcoin-transactions-work)
    - [Un ejemplo de transacción de BCH](#heading-a-sample-bch-transaction)
  - [CashTokens explicado](#heading-cashtokens-explained)
    - [Metadatos de CashTokens](#heading-cashtokens-metadata)
      - [Ejemplo de metadatos de BCMR](#heading-sample-bcmr-metadata)
      - [Ejemplo de transacción de génesis de FT ](#heading-sample-ft-genesis-transaction)
      - [AuthBase y AuthChain](#heading-authbase-and-authchain)
  - [Crea tus primeros CashTokens fungibles (FTs)](#heading-create-your-first-fungible-cashtokens-fts)
    - [Instrucciones fáciles para acuñar FTs 🏁](#heading-easy-ft-minting-instructions-)
      - [1. Instala Electron Cash](#heading-1-install-electron-cash)
      - [2. Abre Cashonize.com](#heading-2-open-cashonizecom)
      - [3. Obtén el ID del token (`category`)](#heading-3-get-the-token-id-category)
      - [4. Crea los metadatos del token](#heading-4-create-the-token-metadata)
      - [5. Vuelve a Cashonize](#heading-5-return-to-cashonize)
      - [6. Verifica la creación del token](#heading-6-verify-token-creation)
      - [7. Congela el authbase de tu token](#heading-7-freeze-your-tokens-authbase)
        - [Cómo entender el AuthBase](#heading-understanding-authbase)
      - [8. ¡Gasta algunos tokens!](#heading-8-spend-some-tokens)
      - [EXTRA: consigue algunos tokens XRBF 💰💸](#heading-bonus-get-some-xrbf-tokens-)
- [Próximamente](#heading-coming-soon)
- [Apoya la serie de tutoriales “Token Pioneers”](#heading-support-the-token-pioneers-tutorial-series)
  - [Patrocina este trabajo](#heading-sponsor-this-work)
  - [Gracias 🙏](#heading-thank-you-)
- [Tu opinión importa](#heading-your-feedback-matters)

¡CashTokens es la forma en que estamos construyendo riqueza transparente e imparable para todos, y no solo para unos pocos privilegiados que pueden pagar las altas comisiones de ETH y BTC!

La funcionalidad de CashTokens es la siguiente evolución de Bitcoin. Permite no solo tokens simples, sino también contratos inteligentes realmente escalables y sin permisos en la blockchain (cadena de bloques) de BCH.

A diferencia de las blockchains con capacidad para contratos inteligentes como Ethereum, que sufren comisiones de transacción altas, BCH tiene comisiones de transacción de menos de un centavo, y eso no cambiará para los contratos inteligentes que crees con BCH CashTokens.

Las comisiones bajas significan que todos pueden participar, lo que genera economías de escala, lo que a su vez significa que tus dapps pueden ganar más usuarios más rápido y tu crecimiento a largo plazo no se verá interrumpido por comisiones altas. Eso significa más ingresos potenciales para ti.

Este tutorial es solo el primero de una serie que estoy escribiendo, con valiosa ayuda de la comunidad, sobre cómo crear aplicaciones descentralizadas y escalables con BCH CashTokens.

Este primer tutorial te dará una visión general y te mostrará cómo acuñar tus primeros tokens fungibles. ¡Pero no te preocupes por sentirte abrumado! Es fácil empezar con CashTokens y hay varias herramientas que puedes usar, con distintas curvas de aprendizaje. Con el tiempo, esto será más fácil y menos misterioso.

<a name="heading-cashtokens-is-worth-it"></a>

### CashTokens vale la pena

¡Y vale totalmente la pena! Es una oportunidad enorme para empezar a experimentar con CashTokens en Bitcoin Cash. Estas son las razones:

- ¡Las DeFi (finanzas descentralizadas) en BCH realmente pueden escalar (a diferencia de tantas otras cadenas)!
- Muchos de quienes actualmente desarrollan con CashTokens están publicando su código como código abierto, así que puedes aprender de estos desarrolladores de élite de Bitcoin.
- Desarrollar con CashTokens apenas está empezando, y eso significa que tus dapps pueden ser líderes en su segmento.
- El ecosistema de BCH ofrece apoyo a quienes desarrollan con CashTokens.
- El ecosistema de BCH es muy auténtico, así que sabrás a qué atenerte. Tratas con personas reales cuyas motivaciones son, en gran parte, filosóficas.

Así que, ¡únete a mí en esta serie de tutoriales de CashTokens “Token Pioneers”! ¡Va a ser genial! 🥳 🎉

<a name="heading-get-updates"></a>

### Mantente al día

La mejor forma de recibir novedades es seguir a [@BitcoinCashSite](https://twitter.com/bitcoincashsite) en Twitter, [@RealBitcoinCashSite](https://www.youtube.com/@RealBitcoinCashSite) en YouTube y/o [@bchworks](https://t.me/bchworks) en Telegram.

<a name="heading-what-is-cashtokens"></a>

## ¿Qué es CashTokens?

CashTokens es una ampliación del formato de las transacciones de Bitcoin (BCH) que entró en funcionamiento en la red principal de BCH el 15 de mayo de 2023, como parte de la actualización anual de la red.

CashTokens añade nuevos campos de token al formato de las transacciones en Bitcoin Cash. Como esta nueva funcionalidad de tokens ahora forma parte del formato básico de una transacción de BCH, los propios tokens son validados por los mineros. Esto significa que los nuevos tokens gozan de la misma seguridad, escalabilidad y resiliencia que siempre han tenido las transacciones normales de BCH en la red principal.

CashTokens incluye:

- **Tokens fungibles**: los FTs son simplemente números que te permiten crear tokens simples como en casi cualquier otra cadena, incluidas memecoins, acciones de empresas, tokens de utilidad, etc.
- **Tokens no fungibles**: los NFTs son las [fotos JPEG que todos conocemos y amamos](https://en.wikipedia.org/wiki/Non-fungible_token), pero los NFTs de BCH son mucho más que eso: permiten transmitir un mensaje (conocido como `commitment`) que facilita la creación de aplicaciones descentralizadas en la cadena.

La actualización CashTokens también añade nuevos opcodes (códigos de operación). Los [opcodes](https://documentation.cash/protocol/blockchain/script#operation-codes-opcodes) son funciones integradas que puedes usar en scripts de Bitcoin en la cadena.

CashTokens fue creado por el desarrollador de BCH [Jason Dreyzehner](https://blog.bitjson.com/), y después se perfeccionó e implementó mediante el proceso de [CHIP](https://bch.info/en/chips) (Cash Improvement Proposals) para la gobernanza del protocolo de Bitcoin Cash, con la participación de muchos miembros de la comunidad de BCH.

<a name="heading-what-you-can-do-with-cashtokens"></a>

### Lo que puedes hacer con CashTokens

Entre los casos de uso de CashTokens están los siguientes:

- NFTs en los que un hash en la cadena está vinculado a una imagen alojada fuera de la cadena.
- Tokens de acceso que, al tenerlos, pueden servir como una especie de llave para abrir puertas físicas o virtuales.
- Préstamos con garantía.
- Creación de una entidad empresarial con acciones tokenizadas que pueden recibir dividendos (security tokens).
- ICOs (ofertas iniciales de monedas).
- Subastas.
- Exchanges descentralizados (DEXs) que operan entre pares.
- DAOs (organizaciones autónomas descentralizadas) y votaciones en la cadena.
- Stablecoins (monedas estables) algorítmicas.
- Cadenas laterales, que podrían escribirse en un lenguaje rápido de bajo nivel como Rust para manejar tareas que no necesitan realizarse en la cadena.
- [Mercados de predicción](https://www.youtube.com/watch?v=QZJ1Al50xfc).
- Tokens de utilidad, que permiten a los usuarios pagar por un producto o servicio en la cadena.
- Monedas envueltas.

¿Qué te gustaría crear con CashTokens? Cuéntamelo en el chat de CashTokens de Panmoni en [Telegram](https://t.me/Panmoni/315) o [Discord](https://discord.gg/MaybgkHs53).

<a name="heading-why-cashtokens-matters"></a>

### Por qué importa CashTokens

A diferencia de los contratos inteligentes en Ethereum, que sufren comisiones altas y complicados esquemas de escalado en L2 (capa 2; es decir, con múltiples blockchains), los contratos inteligentes creados con BCH CashTokens realmente pueden escalar en L1, manteniendo bajas las comisiones de transacción y con la misma seguridad que el propio BCH.

Eso significa que puedes crear dapps (aplicaciones descentralizadas) igual que en Ethereum, pero sin preocuparte de que las comisiones de transacción se disparen cuando tengas éxito. En BCH, tus dapps pueden seguir creciendo sin interrupción y servir a todo el mundo, lo que te permite desarrollar economías de escala que son imposibles en Ethereum.

Y también igual que en Cosmos, pero sin preocuparte por los puentes ni por las comisiones, la complejidad de UX (experiencia de usuario) y las vulnerabilidades que traen. Tus dapps pueden seguir siendo fáciles de usar y accesibles incluso para los usuarios con menos conocimientos técnicos, sin tener que pasar por varios pasos para mover fondos entre cadenas ni lidiar con envolver y desenvolver monedas.

Con CashTokens, puedes crear dapps imparables, sin permisos, sin custodia y libres de intermediarios. Puedes crear Binance, pero sin tener que custodiar las monedas de los usuarios. Puedes crear DEXs que realicen intercambios complejos con comisiones de menos de un centavo. Puedes crear aplicaciones de efectivo electrónico en las que las transacciones se beneficien de la resistencia a la censura de L1 sin las comisiones impredecibles de L1 de BTC.

CashTokens permite construir y desplegar soluciones DeFi transfronterizas y sin permisos para todos, en todas partes, y no solo para unos pocos privilegiados que pueden pagar las elevadas comisiones de Ethereum.

<a name="heading-mint-your-first-cashtokens"></a>

## ¡Acuña tus primeros CashTokens!

En este tutorial, ¡acuñarás tus primeros CashTokens (fungibles)! Es fácil, así que ¡manos a la obra! 🚀

<a name="heading-a-quick-intro-to-how-bitcoin-transactions-work"></a>

### Una breve introducción al funcionamiento de las transacciones de Bitcoin

Las transacciones de Bitcoin se componen de entradas y salidas. Para que una transacción sea válida, entre otros requisitos, las salidas deben ser mayores, en términos del monto total de BCH, que la(s) entrada(s).

Cada una de las salidas de una transacción es una _salida de transacción no gastada_, o **UTXO**. Un UTXO suele ser un saldo de BCH en un par de claves (dirección) que tienes en tu billetera, disponible para gastar.

Cada una de las entradas de una transacción fue previamente una salida, o UTXO, de una transacción anterior.

Los términos UTXO, dirección y par de claves son, en muchos sentidos, bastante similares. Un par de claves incluye una clave pública y una clave privada. La clave pública es tu dirección de BCH. Para cada clave pública hay una clave privada correspondiente, que te conviene mantener segura y privada. No todos los pares de claves tienen saldo de BCH, pero los que lo tienen son UTXOs.

Tu billetera suele tener muchas direcciones de BCH, y el saldo total de BCH de tu billetera puede estar repartido entre varios UTXOs de tu billetera.

Por cierto, esta es la razón por la que a veces la comisión de tu transacción de BCH puede terminar siendo considerable: porque recibiste muchos pagos pequeños, por ejemplo de [read.cash](https://read.cash/) o [noise.app](https://noise.app/), y ahora estás combinando, o consolidando, esos muchos UTXOs pequeños en una salida más grande. Cuantos más UTXOs uses como entradas, más bytes se necesitan para almacenar la transacción en disco y más cara será probablemente la comisión de transacción recomendada.

Así que, en resumen, cuando oigas **UTXO**, recuerda que significa un saldo de BCH en una sola dirección de BCH. Una forma más sencilla de verlo es que un UTXO es una moneda de BCH de una denominación específica, ya sea 1,00000000, 2385,028495276, 0,00000578 u otra que siga el patrón de ser un número entero con hasta 8 dígitos después de la coma decimal que pueda tener.

Nota al margen: en realidad, no existen las “monedas” de BCH. Solo UTXOs.

<a name="heading-a-sample-bch-transaction"></a>

#### Un ejemplo de transacción de BCH (básica, sin CashTokens)

[![Ejemplo de transacción de BCH](../../../assets/images/posts/tp1/sample-bch-tx.png)](https://blockchair.com/bitcoin-cash/transaction/00ee4f1734dab5942866dccd293ba6785edacfc7beee1230cafb5b02fa920c8f)

<figcaption>El ejemplo de transacción básica de BCH.</figcaption>

Aquí tienes un [ejemplo de transacción básica de BCH](https://blockchair.com/bitcoin-cash/transaction/00ee4f1734dab5942866dccd293ba6785edacfc7beee1230cafb5b02fa920c8f) con 1 entrada de la dirección de BCH qpakksk9vsc3u4mj4e9zm85mylaxy3kh9syl9vtukh por 3,35141172 BCH y 2 salidas. La entrada aportó BCH a la transacción y las salidas recibieron BCH de la transacción. Esta transacción no tiene datos de CashTokens.

Las salidas son las siguientes:

0. qpu3ahzcxhqhntkuvrjkzkrxktvem5lcqqvm2c0qmu: 0,1 BCH
1. qq9nhrsvst9nf9zxxlg8h4k7gltkpus7xu4lqwmzcv: 3,25140722 BCH

La salida 0 probablemente es un pago de 0,1 BCH a otra persona. La salida 1 es el cambio de esa transacción y se devolvió a una dirección de la billetera del mismo usuario que controla la entrada y que creó esta transacción.

La salida 1 es la _dirección de cambio_. Aquí, cambio se usa en el mismo sentido que cuando le das a un cajero un billete de 20 dólares para pagar una cuenta de 15 dólares y el cajero te da un billete de 5 dólares de cambio, es decir, “dinero que se devuelve a alguien como diferencia de la suma pagada por algo”.

Si comparas el total de la entrada con el total de la salida, verás que la entrada es mayor que la salida por 0,0000045 BCH. Esta pequeña cantidad es la comisión de transacción pagada al minero y está implícita en la transacción.

`3.35141172 - (3.25140722+0.1) = 0.0000045`

En el [explorador de bloques de Blockchair](https://blockchair.com/bitcoin-cash/transaction/00ee4f1734dab5942866dccd293ba6785edacfc7beee1230cafb5b02fa920c8f), puedes obtener la transacción en bruto en distintos formatos, incluido [JSON](https://www.json.org/json-en.html) (un formato de datos de Javascript fácil de aprender), haciendo clic en “Raw tx”. A continuación está la transacción de ejemplo anterior en formato JSON.

Tómate un momento para compararla con la imagen y la página web enlazadas arriba y así familiarizarte con este formato. No te preocupes por las partes que no entiendas; solo busca las que sí entiendes. ¡Te prometo que es fácil!

A medida que avance esta serie, te explicaré más partes de esto de forma clara y fácil de entender.

```json
{
  "txid": "00ee4f1734dab5942866dccd293ba6785edacfc7beee1230cafb5b02fa920c8f",
  "hash": "00ee4f1734dab5942866dccd293ba6785edacfc7beee1230cafb5b02fa920c8f",
  "version": 2,
  "size": 225,
  "locktime": 0,
  "vin": [
    {
      "txid": "7230465bf9f76567672ba0f136816b37e92d0b6dc5d10bdd676648b32e192226",
      "vout": 0,
      "scriptSig": {
        "asm": "3044022037a59a21f56da586f32d70e976b84b22232e4d5de97a0842cb6ead23863e0d2702200842dafe37fcb3c270ef62df26ffb364cf35badcefeeb6e40ca4b4e3e2c55665[ALL|FORKID] 02f3452dfc0271696ebf45383a3b7491c3e68a3b9128b7183bfb4bd08846e6971d",
        "hex": "473044022037a59a21f56da586f32d70e976b84b22232e4d5de97a0842cb6ead23863e0d2702200842dafe37fcb3c270ef62df26ffb364cf35badcefeeb6e40ca4b4e3e2c55665412102f3452dfc0271696ebf45383a3b7491c3e68a3b9128b7183bfb4bd08846e6971d"
      },
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.1,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 791edc5835c179aedc60e5615866b2d99dd3f800 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914791edc5835c179aedc60e5615866b2d99dd3f80088ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": ["bitcoincash:qpu3ahzcxhqhntkuvrjkzkrxktvem5lcqqvm2c0qmu"]
      }
    },
    {
      "value": 3.25140722,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 0b3b8e0c82cb34944637d07bd6de47d760f21e37 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a9140b3b8e0c82cb34944637d07bd6de47d760f21e3788ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": ["bitcoincash:qq9nhrsvst9nf9zxxlg8h4k7gltkpus7xu4lqwmzcv"]
      }
    }
  ]
}
```

**Nota:** si te decepciona no encontrar datos de CashTokens en el ejemplo anterior de transacción básica de BCH, puedes saltar directamente al [Ejemplo de transacción de génesis de FT ](#heading-sample-ft-genesis-transaction).

<a name="heading-cashtokens-explained"></a>

### CashTokens explicado

La actualización BCH CashTokens añadió un nuevo campo, `token_data`, que tiene varios subcampos. En la práctica, es información que se puede añadir a cualquier UTXO nuevo, como añadir nuevas columnas a las filas de una hoja de cálculo.

- `amount`: el número de tokens fungibles (FTs) que hay en el UTXO. Puedes tener cualquier cantidad de una sola `category` de FT (hasta 9.223.372.036.854.775.807 unidades) en un solo UTXO. Para tener tokens de varias categorías, necesitarás al menos 1 UTXO por cada `category` de token. El número de tokens no fungibles (NFTs) en un UTXO es siempre 0 o 1, por lo que es implícito.
- `category`: el hash, o ID de transacción, de la transacción que creó el UTXO usado como primera entrada de la transacción de génesis del cashtoken. Esta se llama _transacción pre-génesis_. Este campo se usa tanto para NFTs como para FTs. Una categoría puede incluir tanto NFTs como FTs. El campo de categoría hace las veces de nombre/marca/ticker del token y se resuelve mediante el estándar de metadatos BCMR (ver más abajo).
- `nft`
  - `capability`: puede tener uno de tres valores: ‘none’, ‘mutable’ o ‘minting’. ‘None’ significa que puedes gastar el NFT, pero no cambiar su `commitment` ni crear más. ‘Mutable’ significa que puedes gastar el NFT y también cambiar su `commitment`. ‘Minting’ significa que puedes gastarlo, cambiar su `commitment` y crear más NFTs de la misma `category`.
  - `commitment`: el mensaje del NFT, que puede tener hasta 40 bytes.

Si no hay datos en los campos `nft`, entonces el UTXO no contiene NFTs y estos campos se omitirán.

<a name="heading-cashtokens-metadata"></a>

#### Metadatos de CashTokens

Los tickers (p. ej., BCH, BTC, ETH), los nombres de monedas (p. ej., Tether, USD Coin, etc.) y otros metadatos similares de CashTokens **no** se almacenan en la blockchain de BCH. Esto es para aprovechar al máximo el espacio de los bloques. Al fin y al cabo, cada byte de datos que entra en una transacción se almacena en decenas o cientos de nodos completos de BCH en todo el mundo (hasta que se poden, o a menos que se poden).

En cambio, los metadatos de CashTokens se ponen a disposición por iniciativa individual mediante un archivo JSON que usa un [esquema](https://github.com/bitjson/chip-bcmr#metadata-registry-json-schema) específico, llamado [Bitcoin Cash Metadata Registries](https://github.com/bitjson/chip-bcmr), o **BCMR** para abreviar. Estos metadatos pueden publicarse mediante IPFS y/o mediante DNS en un sitio web de tu elección por HTTPS, y pueden enlazarse en la cadena desde el OP_RETURN de la transacción de génesis, junto con un hash del archivo de metadatos en formato JSON.

Los creadores de tokens y/u otras entidades del ecosistema pueden crear y publicar archivos BCMR. Los registros pueden agregar estos archivos en grandes colecciones de datos JSON de BCMR, como [este del registro otr.cash](https://raw.githubusercontent.com/OpenTokenRegistry/otr.cash/master/static/.well-known/bitcoin-cash-metadata-registry.json). Puede haber cualquier número de registros, y cada registro puede tener sus propios estándares o especializaciones. Por ejemplo, [otr.cash](https://otr.cash/docs/list/) tiene estándares de listado muy específicos que cualquier proyecto de token serio haría bien en revisar.

O puedes prescindir por completo de los registros y simplemente publicar tu propio archivo BCMR. Luego, los registros pueden incorporarlo o no, según la iniciativa individual.

Sea cual sea el método que elijas, mi recomendación para proyectos serios es adoptar el [estándar BCMR](https://github.com/bitjson/chip-bcmr).

<a name="heading-sample-bcmr-metadata"></a>

##### Ejemplo de metadatos de BCMR

Aquí tienes un ejemplo de metadatos de BCMR de mi token fungible [“Real Bitcoin Fam” ](https://RealBitcoinFam.com). Especifica el nombre de token “Real Bitcoin Fam Community Award Tokens”, el ticker XRBF y que este token tiene 2 decimales.

Échale un vistazo. Te prometo que es muy fácil de leer. 😊

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": {
    "major": 0,
    "minor": 2,
    "patch": 0
  },
  "latestRevision": "2023-07-19T22:23:41.467Z",
  "registryIdentity": {
    "name": "bcmr for Real Bitcoin Fam",
    "description": "self-published bcmr for Real Bitcoin Fam"
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

<a name="heading-sample-ft-genesis-transaction"></a>

##### Ejemplo de transacción de génesis de FT

Copia el `category` de este token de arriba y visita el [explorador de bloques SalemKode](https://explorer.salemkode.com/). Pega el hash `category` en la barra de búsqueda.

`482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887`

A la izquierda, haz clic en “Open token page” para visitar la [página](https://explorer.salemkode.com/token/482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887) del Token ID de Real Bitcoin Fam (`category`) en este explorador de bloques. Busca la transacción de génesis del token, del 19 de julio de 2023, con este ID de transacción (hash):

`5de87383470ec7d31a8eeb3da2f21952da42b300fd527c6bf3600f03caf122c4`

Copia ese hash, visita [Blockchair.com](https://blockchair.com/) e introduce ese ID de transacción en el cuadro de búsqueda. En la [página de la transacción](https://blockchair.com/bitcoin-cash/transaction/5de87383470ec7d31a8eeb3da2f21952da42b300fd527c6bf3600f03caf122c4), haz clic en “Raw tx”, abajo a la derecha. Esta es la transacción de génesis en bruto de mi token fungible XRBF en formato JSON:

```json
{
  "txid": "5de87383470ec7d31a8eeb3da2f21952da42b300fd527c6bf3600f03caf122c4",
  "hash": "5de87383470ec7d31a8eeb3da2f21952da42b300fd527c6bf3600f03caf122c4",
  "version": 2,
  "size": 386,
  "locktime": 0,
  "vin": [
    {
      "txid": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
      "vout": 0,
      "scriptSig": {
        "asm": "d702d99cba05c4b2d8d6538712dbd74cecf5f7a602b9ba047e6b0f292a204d5218c94ba402635ec7389d1212af46af4acc7e4195c04362ddf44b67c4c6ce541d[ALL|FORKID] 03bc3bee1b12fe218a35d296af5788febbc01e8c169345e143addc86c338a726ef",
        "hex": "41d702d99cba05c4b2d8d6538712dbd74cecf5f7a602b9ba047e6b0f292a204d5218c94ba402635ec7389d1212af46af4acc7e4195c04362ddf44b67c4c6ce541d412103bc3bee1b12fe218a35d296af5788febbc01e8c169345e143addc86c338a726ef"
      },
      "sequence": 0
    }
  ],
  "vout": [
    {
      "value": 0.00001,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 6ff589240f0856b7e2467df1748888546987ba04 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a9146ff589240f0856b7e2467df1748888546987ba0488ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": ["bitcoincash:qphltzfypuy9ddlzge7lzayg3p2xnpa6qs4ys7dnnw"]
      },
      "tokenData": {
        "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
        "amount": "2100000000"
      }
    },
    {
      "value": 0,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_RETURN 1380795202 f54610c897b382070f92857e6d342247e27e51cac8b24217e435a317110d38cc 676973742e67697468756275736572636f6e74656e742e636f6d2f67656f726765646f6e6e656c6c792f33313137386133363239306135643365303732396532626337386330333737312f726177",
        "hex": "6a0442434d5220f54610c897b382070f92857e6d342247e27e51cac8b24217e435a317110d38cc4c4e676973742e67697468756275736572636f6e74656e742e636f6d2f67656f726765646f6e6e656c6c792f33313137386133363239306135643365303732396532626337386330333737312f726177",
        "type": "nulldata"
      }
    },
    {
      "value": 0.00008613,
      "n": 2,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 6ff589240f0856b7e2467df1748888546987ba04 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a9146ff589240f0856b7e2467df1748888546987ba0488ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": ["bitcoincash:qphltzfypuy9ddlzge7lzayg3p2xnpa6qs4ys7dnnw"]
      }
    }
  ]
}
```

Localiza la sección `vout` en la línea 18. La **primera salida de la transacción** tiene un valor de `n` de ‘0’ y un `value` de ‘0,00001’ BCH. Aquí está:

```json
    {
                "value": 0.00001,
                "n": 0,
                "scriptPubKey": {
                    "asm": "OP_DUP OP_HASH160 6ff589240f0856b7e2467df1748888546987ba04 OP_EQUALVERIFY OP_CHECKSIG",
                    "hex": "76a9146ff589240f0856b7e2467df1748888546987ba0488ac",
                    "reqSigs": 1,
                    "type": "pubkeyhash",
                    "addresses": [
                        "bitcoincash:qphltzfypuy9ddlzge7lzayg3p2xnpa6qs4ys7dnnw"
                    ]
                },
                "tokenData": {
                    "category": "482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887",
                    "amount": "2100000000"
                }
            },
```

Desplázate hasta la sección `tokenData` de ese UTXO y verás que `category` tiene el mismo valor que `category` en el archivo BCMR. Este es también el ID de transacción de la transacción que creó el UTXO que se usa como primera entrada de esta transacción de génesis (esta se llama _transacción pre-génesis_). Ese valor es:

`482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887`

Este es el identificador único del token XRBF de Real Bitcoin Fam, es decir, su `category`.

Como ves, el valor de `amount` es ‘2100000000’, es decir, dos mil cien millones. Si quitas los dos últimos ceros, es decir, los 2 decimales especificados por el subcampo `decimals` del archivo BCMR, el número queda en 21 millones, que es el suministro total previsto de este token fungible.

Ahora desplázate un poco más abajo en el archivo JSON de la transacción de génesis de XRBF y busca la salida de la transacción en la que `n` tiene el valor ‘1’. Este es el OP_RETURN donde se establece en la cadena el archivo BCMR de este token. Aquí está:

```json
    {
                "value": 0,
                "n": 1,
                "scriptPubKey": {
                    "asm": "OP_RETURN 1380795202 f54610c897b382070f92857e6d342247e27e51cac8b24217e435a317110d38cc 676973742e67697468756275736572636f6e74656e742e636f6d2f67656f726765646f6e6e656c6c792f33313137386133363239306135643365303732396532626337386330333737312f726177",
                    "hex": "6a0442434d5220f54610c897b382070f92857e6d342247e27e51cac8b24217e435a317110d38cc4c4e676973742e67697468756275736572636f6e74656e742e636f6d2f67656f726765646f6e6e656c6c792f33313137386133363239306135643365303732396532626337386330333737312f726177",
                    "type": "nulldata"
                }
            },
```

Una vez decodificada, esta salida de la transacción dice lo siguiente:

```
    BCMR Fȗ~m4"G~QȲB5
    8LNgist.githubusercontent.com/georgedonnelly/31178a36290a5d3e0729e2bc78c03771/raw
```

Puedes visitar la [URL](https://gist.github.com/georgedonnelly/31178a36290a5d3e0729e2bc78c03771) de la salida decodificada y comprobar que su contenido incluye los metadatos de XRBF compatibles con BCMR.

<a name="heading-authbase-and-authchain"></a>

##### AuthBase y AuthChain

Este UTXO que lleva el enlace a los metadatos de BCMR se llama **authbase**. Con la acuñación mostrada arriba, que se hizo mediante la billetera Cashonize, el authbase y todo el suministro del token fungible creado están en el mismo UTXO. Más abajo te mostraré cómo separarlos y después congelar tu authbase.

Cada vez que cambies el archivo BCMR, su hash cambiará y, por lo tanto, tendrás que publicar en la cadena una actualización con el nuevo hash. Con el tiempo, esta serie de cambios se llama **authchain**.

No te preocupes si todo esto todavía te resulta un poco confuso. Los próximos tutoriales de “Token Pioneers” ayudarán a resolver cualquier duda, y siempre puedes pedir ayuda en [mi grupo de Telegram](https://t.me/Panmoni/315) o en el [grupo CashTokens Developers](https://t.me/cashtoken_devs).

<a name="heading-create-your-first-fungible-cashtokens-fts"></a>

### Crea tus primeros CashTokens fungibles (FTs)

Los tokens fungibles son solo números: tokens simples. Son ideales para representar la cantidad de activos que tienes, como acciones de una empresa o memecoins. Son muy adecuados para pools de liquidez en DEXs, votaciones, etc.

Los FTs usan solo dos de los campos CashTokens `token_data`: `amount` y `category`. `amount` es el número de tokens y `category` es el ID único del que hablamos arriba. El campo `category` puede vincularse al nombre, ticker, logo, etc. que quieras para tu token mediante la especificación de metadatos BCMR mencionada más abajo.

Los tokens fungibles tienen algunas propiedades interesantes, entre ellas las siguientes.

- No se pueden falsificar, ya que son activos en la cadena al mismo nivel que el propio BCH. Esto es lo que significa “tokens validados por los mineros”.
- Todos los tokens fungibles de una `category` dada deben crearse cuando se crea la categoría del token. Esto significa que, si creas un token que quieres que tenga un suministro máximo de 21.000.000 de tokens, todo el suministro de tokens debe crearse de una vez en la transacción de génesis. Sin embargo, puedes [bloquear el suministro de estos tokens en un contrato inteligente](https://bitcoincashresearch.org/t/chip-2023-07-minting-baton-covenant-mbc-standard-for-fungible-tokens/1113) y solo repartirlos según ciertas condiciones. De esta forma, puedes crear contratos que repartan tokens en respuesta a la actividad en la cadena.
- Los FTs se pueden fusionar y dividir como quieras; sin embargo, cada BCH UTXO solo puede contener FTs (y NFTs) de 1 `category` de token. Esto significa que, si tienes tokens de varias categorías, no pueden estar en el mismo UTXO. Como puedes tener varios UTXOs en una billetera, esto no es un obstáculo; solo es algo que debes tener en cuenta.

<a name="heading-easy-ft-minting-instructions-"></a>

#### Instrucciones fáciles para acuñar FTs 🏁

Si solo quieres crear algunos tokens fungibles mediante una interfaz web, ¡estás de suerte! Mathieu Geukens, miembro de la comunidad de BCH, creó [Cashonize](https://cashonize.com/), una billetera web de BCH que te permite acuñar BCH CashTokens tanto fungibles como no fungibles.

¡Así es como puedes acuñar tus primeros tokens fungibles (FTs) con BCH CashTokens! 🤩😮

**Nota:** asegúrate de seguir este tutorial paso a paso para evitar errores.

<a name="heading-1-install-electron-cash"></a>

##### 1. Instala Electron Cash

1. Instala la [billetera de escritorio Electron Cash](https://electroncash.org/) y crea una billetera, o importa una billetera de BCH existente (solo si no es una billetera muy importante).
2. Asegúrate de que tu billetera tenga una pequeña cantidad de BCH. Aquí tienes [algunos lugares](/buy) donde puedes conseguir BCH. Intenta enviarlo a la _dirección principal_ de tu billetera.
   1. Puedes encontrar la _dirección principal_ de tu billetera en Electron Cash en la pestaña **Addresses**, buscando la que tenga un valor de `index` de ‘0’. Si no ves la pestaña **Addresses**, ve al menú **View** y selecciona “Show Addresses”.
3. Si creaste una billetera nueva, guarda tu frase semilla de forma segura, por ejemplo con [BitWarden](https://bitwarden.com/), [KeePass](https://keepass.info/), papel y lápiz, u otro método seguro que no vayas a perder.
4. Si usas una billetera existente, puedes encontrar tu frase semilla en Electron Cash en el menú **Wallet** \> **Seed**. Asegúrate de protegerla de miradas indiscretas.

![Dirección principal de la billetera](../../../assets/images/posts/tp1/wallet-primary-address.png)

<figcaption>La dirección principal de la billetera.</figcaption>

<a name="heading-2-open-cashonizecom"></a>

##### 2. Abre Cashonize.com

1. Abre la [billetera web Cashonize](https://cashonize.com/) en tu navegador y pega tu frase semilla (de tu billetera Electron Cash) en el cuadro de texto debajo de donde dice “Import existing wallet”. Deja la ruta de derivación con el valor predeterminado y haz clic en el botón Import.
   1. Si lo prefieres, puedes crear una billetera nueva en Cashonize y más adelante importarla en Electron Cash. Para hacerlo así, usa la función “Create new wallet” en Cashonize.com.
   2. Haz clic en el engranaje de la barra de pestañas.
   3. Haz clic en el botón “Show seed phrase” y guarda de forma segura la frase semilla que aparece ahí.
      1. Para importar esta frase semilla en Electron Cash, haz clic en el menú **File** \> New/Restore en Electron Cash.
      2. Sigue el cuadro de diálogo y selecciona “Standard wallet” \> “I already have a seed”.
      3. En la siguiente pantalla, pega tu frase semilla de Cashonize y, más adelante, acepta la ruta de derivación predeterminada.
      4. Termina el cuadro de diálogo y habrás “reflejado” con éxito tu billetera tanto en Cashonize como en Electron Cash.
2. Si usas una billetera existente, es importante tener en cuenta que Cashonize es una billetera de una sola dirección. Solo ve y usa la primera dirección (es decir, la _dirección principal_) de tu billetera. Así que esa primera dirección debe tener saldo de BCH. Si no lo tiene, puedes hacer una transacción de consolidación en Electron Cash.
   1. Si necesitas hacer una transacción de consolidación porque tu _dirección principal_ no tiene saldo de BCH o no es suficiente, haz lo siguiente.
      1. Ve a la pestaña Addresses en Electron Cash y busca la dirección que tenga un valor de `index` de ‘0’.
      2. Haz clic derecho sobre ella y selecciona Copy Address.
      3. Ahora ve a la pestaña Coins en Electron Cash y selecciona los UTXO con saldo de BCH que quieras consolidar (es decir, mover a la _dirección principal_).
      4. Una vez seleccionados (puedes seleccionar más de uno si quieres), haz clic derecho y selecciona Spend. Se abrirá la pantalla Send y en el campo From aparecerán los UTXO que estás consolidando.
      5. Pega en el campo “Pay to” la _dirección principal_ de tu billetera.
      6. Puedes escribir una descripción si quieres e indicar la cantidad que quieres consolidar en tu dirección principal, o simplemente pulsar Max.
      7. Si vas a consolidar muchos UTXOs, asegúrate de que la comisión no sea demasiado alta y haz clic en Send.
      8. Esto debería consolidar los UTXOs seleccionados en la _dirección principal_ de tu billetera.

<a name="heading-3-get-the-token-id-category"></a>

##### 3. Obtén el ID del token (`category`)

1. En tu billetera Cashonize, haz clic en la pestaña “CreateTokens”, arriba a la derecha. Deja “token-type” con su valor predeterminado, “Fungible Tokens”.
2. La billetera seleccionará un UTXO de _transacción pre-génesis_ para usarlo como entrada de la transacción que crea tu FT (es decir, la _transacción de génesis_). Cashonize lo mostrará como “Planned tokenId”, también conocido como el `category` de tu FT. Copia este hash al portapapeles.
3. Elige el suministro total (Total Supply). Esto puede ser complicado, porque la decisión depende de cuántos decimales quieras que tenga tu FT.
   1. Por ejemplo, si quieres un suministro total de 21 millones con 8 decimales, el número que debes introducir aquí es 2100000000000000. No introduzcas aquí puntos ni comas. En realidad, el separador decimal lo “colocan” los metadatos y no existe en la cadena. Así que tienes que poner el suministro total que quieras y luego añadirle los dígitos de los decimales. Otro ejemplo: si quieres un suministro total de mil con dos decimales, introduce 100000.
4. **Todavía no envíes el formulario.**

![Crear tokens en Cashonize](../../../assets/images/posts/tp1/cashonize-create-tokens.png)

<figcaption>La página de creación de tokens de Cashonize.</figcaption>

<a name="heading-4-create-the-token-metadata"></a>

##### 4. Crea los metadatos del token

1. Haz clic en la pequeña flecha negra para desplegar la sección de metadatos. Abre en otra pestaña la [herramienta BCMR Generator](https://bcmr-generator.netlify.app/).
   1. Ahora debes pegar el “Planned tokenId” de la página “Create Token” en el campo “Tokenid” de la página de la herramienta BCMR Generator, si no está ya rellenado.
   2. Introduce el nombre del token, su descripción, su símbolo (ticker), el enlace del icono, los decimales, la URL del sitio web y cualquier otra URL que quieras asociar a tu nuevo token.
      1. Si es solo un token de prueba, por diversión o desechable, puedes rellenar esta información como quieras. Además, siempre puedes actualizar los metadatos de tu token más adelante.
      2. Sin embargo, si crees que te gustaría que tu token alcance el mayor nivel posible de confianza y aceptación en la comunidad, puedes leer los [estándares de listado de otr.cash](https://otr.cash/docs/list/) antes de continuar.
      3. El enlace del icono es una URL de la imagen que representará a tu token en billeteras, exploradores de bloques y otras apps de todo el ecosistema de BCH. Si puedes, usa un SVG. AVIF, WebP y PNG también son aceptables. Si eliges un formato distinto de SVG, asegúrate de que la imagen mida exactamente 400px x 400px. Se admite transparencia.
         1. Se recomienda alojar tu icono en IPFS para asegurarte de que siempre esté disponible. [Nft.storage](https://nft.storage/) es una forma fácil y gratuita de hacerlo. También puedes usar el servicio de pinning de IPFS de [mainnet_pat](https://twitter.com/mainnet_pat), que actualmente cuesta 0,0025 BCH (unos 0,60 USD$ en el momento de la publicación).
         2. Una vez subido, copia el CID (“Content Identifier”) de [nft.storage](https://nft.storage/files/). Ahora crea una URL que empiece por `https://ipfs.io/ipfs/` y termine con el CID. Si aparece tu icono, lo hiciste bien. Por ejemplo, esta es la del [icono del token XRBF](https://ipfs.io/ipfs/bafkreiax4h2evyf4g7iuu6kuqkxwez4kvduxayngj5vxmvgrekipevptl4).
         3. En Actions de [nft.storage](https://nft.storage/files/), haz clic en “Copy IPFS URL”. Esta es la URL que pegarás en el campo Icon Link de la herramienta BCMR Generator.
         4. Si no necesitas que tu nuevo token tenga un alto nivel de confianza en la comunidad, puedes alojar la imagen en tu propio dominio o en un gist de GitHub.
   3. Haz clic en “Download BCMR JSON File”. No te preocupes, siempre puedes actualizar estos datos más adelante. El archivo de metadatos se descargará en tu computadora.
   4. Puedes simplemente subir este archivo a tu propio sitio web con HTTPS, a IPFS, o usar un gist de GitHub.
      1. Si usas un gist, abre el archivo descargado en un editor de texto como [VS Code](https://code.visualstudio.com/), selecciona todo su contenido y cópialo.
      2. Visita [gist.github.com](https://gist.github.com/). Este siguiente paso supone que tienes una cuenta de GitHub y que iniciaste sesión.
      3. Rellena el formulario con el nombre de archivo `your-token-bcmr.json` y pega el contenido del archivo BCMR que descargaste antes en el cuadro de texto principal.
      4. Abajo a la derecha, haz clic en la flecha del botón verde junto a “Create secret gist” y selecciona “Create public gist”.
      5. Si quieres alojar el icono de tu token en GitHub, puedes incluirlo en este mismo gist [siguiendo estas instrucciones](https://gist.github.com/remarkablemark/feff40b0a522f0c41c4eff0b77ea1d47). Esto requiere un conocimiento mínimo de git.
         1. Aquí tienes un [ejemplo](https://gist.github.com/mr-zwets/84b0057808af20df392815fb27d4a661) de cómo se ve en su estado final un gist que contiene tanto un archivo BCMR como un icono de token.
      6. Haz clic en “Create public gist” y tu archivo BCMR estará listo. Para obtener la URL, haz clic en “Raw”, arriba a la derecha de tu gist terminado. Copia la URL de la barra de direcciones. Se verá más o menos así:
         1. `https://gist.githubusercontent.com/mr-zwets/84b0057808af20df392815fb27d4a661/raw/5baa2e979e17f19df5aa62c4abb49e044cdfd2fc/bcmr.json`
         2. Borra el ‘https://’ y todo lo que va después de ‘raw’. Así te quedará un fragmento de URL como el siguiente:
         3. `gist.githubusercontent.com/mr-zwets/84b0057808af20df392815fb27d4a661/raw`

![Captura de pantalla del generador de metadatos](../../../assets/images/posts/tp1/bcmr-generator.png)

<figcaption>El generador de metadatos BCMR.</figcaption>

<a name="heading-5-return-to-cashonize"></a>

##### 5. Vuelve a Cashonize

1. Ahora toma este fragmento de URL y vuelve a la página “CreateTokens” de Cashonize. Busca donde dice “Upload the metadata to” y selecciona la opción adecuada. Si usaste un gist, selecciona “HTTPS: GitHub gist”.
2. Busca el campo de texto de abajo y pega en él tu fragmento de URL de BCMR.
3. Haz clic en el botón verde Create y deberías recibir un mensaje de éxito que dice que tus tokens fungibles se crearon en la cantidad que indicaste, con su `category` (tokenId). ¡Lo lograste! 🥳🎉

<a name="heading-6-verify-token-creation"></a>

##### 6. Verifica la creación del token

1. Una vez creado tu token, lo que puede tardar un par de minutos, revisa la pestaña “MyTokens” en Cashonize. Deberías ver tu token con todo su suministro en tu billetera y su `symbol` (ticker). También debería mostrarte el icono (aunque en algunos casos puede tardar hasta 48 horas en aparecer). Haz clic en “Info” para ver los metadatos más importantes.
2. Guarda tu Tokenid (`category`). Si tienes un sitio web para tu token, publícalo ahí para que los poseedores de tu token puedan comprobar por sí mismos si tienen tu token auténtico o una copia.
3. Busca la página de tu token en el explorador de bloques SalemKode. Visita [explorer.salemkode.com](https://explorer.salemkode.com/) y pega tu “Tokenid” en la barra de búsqueda. Luego haz clic en “Open token page”. Desde ahí puedes explorar la transacción de génesis de tu token.

Por ejemplo, esta es [la página de XRBF](https://explorer.salemkode.com/token/482d555258d3be69fef6ffcd0e5eeb23c4aaacec572b25ab1c21897600c45887). Y puedes explorar su transacción de génesis más arriba, en la sección “Ejemplo de transacción de génesis de FT”.

![Cashonize MyTokens](../../../assets/images/posts/tp1/cashonize-newly-minted-fts.png)

<figcaption>La página MyTokens de Cashonize antes de que haya leído los metadatos del token.</figcaption>

<a name="heading-7-freeze-your-tokens-authbase"></a>

##### 7. Congela el authbase de tu token

¡No envíes ningún token todavía! Primero debes congelar tu authbase para asegurarte de mantener el control de los metadatos de tu nuevo token fungible.

1. Vuelve a Cashonize y haz clic en la pestaña “MyTokens”. Debajo de tus nuevos tokens fungibles, haz clic en “auth transfer”. Se abrirá un cuadro de texto donde puedes poner una dirección de BCH.
2. Ve a Electron Cash y asegúrate de estar viendo la misma billetera que usaste en Cashonize.
3. Ve a la pestaña **Addresses** y elige una dirección cerca del final de la lista que no se haya usado y que tenga un valor de `index` mayor que ‘0’. Haz clic derecho sobre ella y copia esta dirección.
4. Vuelve a Cashonize e introduce esta dirección en el cuadro de texto.
5. Haz clic en el botón “Transfer Auth”. Aparecerá un mensaje que dice que el authbase de tu tokenID se transfirió a la dirección que introdujiste en Cashonize para este fin.
6. Vuelve a tu billetera Electron Cash y ve a la pestaña **Coins**. (Si no está visible, ve al menú **View** \> Show Coins). Busca la dirección a la que acabas de transferir tu authbase. Ahora debería tener un “Amount” al lado, probablemente 0,00001 BCH (1000 satoshis).
7. Haz clic derecho sobre la dirección y haz clic en “Freeze Coin”. El authbase de tu token ahora está congelado en Electron Cash (solo ahí).

![Transferencia del authbase](../../../assets/images/posts/tp1/separate-authbase.png)

<figcaption>La transferencia del authbase en Cashonize.</figcaption>

<a name="heading-understanding-authbase"></a>

###### Cómo entender el AuthBase

Para entender lo que pasó, vuelve a hacer clic derecho sobre la dirección del authbase y selecciona “Details”. Se abrirá una nueva ventana con la transacción que movió el authbase de tu nuevo token fungible.

La ventana te mostrará mucha información, incluidas las entradas y salidas de la transacción. Lo importante aquí es simplemente que la salida 0, es decir, la primera salida de esta transacción, sea la dirección que elegiste para guardar el authbase de este token fungible, y que la congeles.

Al hacerlo, te aseguraste de que la authchain de tu nuevo token fungible siga bajo tu control en tu billetera (¡comprueba que guardaste bien tu frase semilla!) cuando uses Electron Cash.

Como mencioné antes, el authbase es importante porque quien lo controla también controla la capacidad de actualizar los metadatos del token fungible que acabas de crear.

Pronto haré un tutorial extenso sobre los metadatos de CashTokens (es decir, el [BCMR](https://github.com/bitjson/chip-bcmr)).

<a name="heading-8-spend-some-tokens"></a>

##### 8. ¡Gasta algunos tokens!

¡Ahora puedes gastar tus nuevos tokens fungibles!

1. En el menú **View** de Electron Cash, haz clic en Show CashTokens y en Show Tokens History. Se abrirán dos pestañas nuevas en la interfaz principal de Electron Cash.
2. En la pestaña Token History debería aparecer el suministro total de tus tokens. Haz clic izquierdo sobre él y luego en “Category Properties…”.
3. Se abrirá un cuadro de diálogo. Busca el enlace cerca del final del cuadro que dice “Click here to apply it…”. Esto cargará el BCMR que creaste en tu instancia de Electron Cash. Deberían aparecer los metadatos de tu token. Haz clic en OK para cerrar el cuadro de diálogo.
4. Para gastar tus tokens desde Electron Cash, ve a la pestaña “CashTokens”.
   1. Selecciona el token que quieres gastar, haz clic derecho y selecciona “Send Token…”.
   2. Introduce la cantidad de tokens que quieres enviar y el “Pay to”, es decir, la dirección a la que enviarlos. Opcionalmente, puedes añadir una descripción y enviar BCH junto con ellos.
   3. Haz clic en “Preview Tx…”. De forma predeterminada, enviará 800 sats de polvo (dust) para que los tokens puedan volver a enviarse si es necesario.
   4. Si estás conforme con la transacción, haz clic en el botón “Sign” y luego en el botón “Broadcast”.
   5. Aparecerá un cuadro de diálogo “Payment sent” con el ID de la transacción. ¡Lo lograste! 🥳🎉
   6. Si quieres, copia el enlace del cuadro de diálogo y explora los datos en bruto de la transacción en [Blockchair.com](https://blockchair.com/).
5. Para gastar tus tokens desde Cashonize, ve a la pestaña “MyTokens” y haz clic en “send” en el token que quieres enviar. Aparecerá un formulario. Introduce la dirección a la que quieres enviar los tokens y cuántos tokens quieres enviar. Cuando estés conforme con tu transacción, haz clic en el botón “Send”. Aparecerá un cuadro de diálogo que confirma cuántas unidades de qué token enviaste y a qué dirección. ¡Lo lograste! 🥳🎉

![Enviar FTs con Electron Cash](../../../assets/images/posts/tp1/ec-send-fts.png)

<figcaption>Envío de FTs con Electron Cash.</figcaption>

![Enviar FTs con Cashonize](../../../assets/images/posts/tp1/cashonize-send-fts.png)

<figcaption>Envío de FTs con Cashonize.</figcaption>

<a name="heading-bonus-get-some-xrbf-tokens-"></a>

##### EXTRA: consigue algunos tokens XRBF 💰💸

¿Quieres algunos de mis nuevos tokens XRBF [“Real Bitcoin Fam”](https://www.realbitcoinfam.com/)? ¡Es fácil y divertido!

1. Únete a [mi grupo de Telegram](https://t.me/Panmoni/315).
2. Publica unas palabras sobre lo que quieres crear con CashTokens y tu dirección de BCH (idealmente la compatible con tokens).
3. ¡Te enviaré **10 XRBF** en tokens!
4. **¡Extra!** Comparte el enlace de tu nuevo token fungible de CashTokens (_el que creaste siguiendo este tutorial_) en [explorer.salemkode.com](https://explorer.salemkode.com/) ¡y te daré hasta **100 XRBF**!

<a name="heading-coming-soon"></a>

## Próximamente

Los próximos tutoriales tratarán sobre la acuñación de NFTs, los metadatos de BCMR, la gestión de la authchain y más. ¡[Vota aquí](https://twitter.com/BitcoinCashSite/status/1683919957367877632) por tus temas de tutorial favoritos!

<a name="heading-support-the-token-pioneers-tutorial-series"></a>

## Apoya la serie de tutoriales “Token Pioneers”

_¿Quieres más tutoriales?_ Acepto donaciones para financiar este trabajo fundamental de enseñar a nuevos desarrolladores de BCH a crear dapps imparables y sin permisos con CashTokens en Bitcoin Cash.

Sí, habrá tutoriales en video y sí, abordaré temas más avanzados en cuanto haya cubierto lo básico.

**Dirección de BCH**:
[bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8](bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8)

**Dirección compatible con tokens** (¡envíame 1 o más de cada FT que crees!): [bitcoincash:zz3pxmwda8gd42wa8k9yfxcwhcaapeuhyg4j59kny5](bitcoincash:zz3pxmwda8gd42wa8k9yfxcwhcaapeuhyg4j59kny5)

**Código QR**: [tipb.ch/bitcoincashsite](https://tipb.ch/bitcoincashsite)

![Token Pioneers](../../../assets/images/posts/tp1/token-pioneers-big.png)

<a name="heading-sponsor-this-work"></a>

### Patrocina este trabajo

Por cada donación de 2 BCH en apoyo de esta serie de tutoriales, puedes elegir 1 tutorial o video de marketing para patrocinar. Los patrocinadores reciben una mención con texto e imagen incluida en el entregable, dentro de límites razonables. Me reservo el derecho de elegir qué solicitudes de patrocinio aceptaré.

También estoy trabajando en más de 68 videos tutoriales cortos adicionales ([ejemplos 1](https://www.youtube.com/playlist?list=PLfCBnMrjKRClnfdFU86KhlbuyBCkbgo6m), [2](https://www.youtube.com/playlist?list=PLfCBnMrjKRCnQ6jh4Sb4g5Njw0dVaIiLY)) aparte de lo mencionado en el [flipstarter de Token Pioneers](https://archive.li/UznMe), y también están disponibles para patrocinio a 0,25 BCH por video (negociable). En estos videos, puedes influir en el contenido. Incluso puedo hacer tutoriales sobre tu producto, servicio o proyecto.

Los entregables patrocinados se asignan por orden de llegada. Si quieres aprovechar esta oferta, [rellena este formulario](https://panmoni.zapier.app/sign-up).

<a name="heading-thank-you-"></a>

### Gracias 🙏

Un enorme **gracias** a [toorik](https://twitter.com/toorik), anonymous, William Patrick, S0me_N0b0dy y na por su apoyo al [flipstarter](https://archive.li/UznMe) que hace posible esta serie de tutoriales “Token Pioneers”. Visita [nuestra página Acerca de](/about) para ver la lista completa de más de 55 miembros de la comunidad que han financiado mi trabajo desde 2019.

Gracias también a [Mathieu Geukens](https://twitter.com/GeukensMathieu) (alias mr-zwets), [BitcoinCashAutist](https://twitter.com/bchautist) y [OPReturn](https://twitter.com/OPReturnCode), cuya orientación en el [grupo CashTokens Developers](https://t.me/cashtoken_devs) ha sido sumamente valiosa.

Sin embargo, cualquier error u omisión es mío. 😳

<a name="heading-your-feedback-matters"></a>

## Tu opinión importa

Después de que este tutorial pase por algunas revisiones y comentarios de la comunidad, publicaré un video que lo acompañe. Tus comentarios e ideas son importantes para mí. Escríbeme cuando quieras. Envía un correo a [george@panmoni.com](mailto:george@panmoni.com) o [únete al canal de Telegram de Panmoni](https://t.me/Panmoni/315). 🔥
