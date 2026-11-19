---
publishDate: 2023-08-15T00:00:00.000Z
title: Acuña tus primeros NFTs en Bitcoin Cash (tutorial 2 de Token Pioneers)
description: ninguno
excerpt: Aprende a acuñar tus primeros NFTs con CashTokens en Bitcoin Cash.
image: ~/assets/images/blog/token-pioneers-2.png
category: Tutorial
tags:
  - cashtokens
  - token pioneers
metadata:
  title: Acuña tus primeros NFTs en Bitcoin Cash
translation:
  sourceHash: 078d00558eaf20a9
  status: machine
  translator: Claude
---

## Tabla de contenidos

  * [Casos de uso](#heading-use-cases)
  * [Desarrolla con nosotros](#heading-build-with-us)
- [Cómo funcionan los NFTs en la cadena](#heading-how-nfts-work-on-chain)
  * [Mi BCH Guru (un NFT de ejemplo)](#heading-my-bch-guru-a-sample-nft)
    + [Rastreando el `authhead` ](#heading-tracking-down-the-authhead)
      - [Usando el Paytaca BCMR Indexer](#heading-using-the-paytaca-bcmr-indexer)
      - [Usando el indexador Chaingraph ](#heading-using-the-chaingraph-indexer-)
  * [Entender los compromisos](#heading-understanding-commitments)
    + [Emerald DAO](#heading-emerald-dao)
- [Metadatos de NFT](#heading-nft-metadata)
  * [Metadatos de BCH Guru](#heading-bch-guru-metadata)
- [¡Acuña tu primer CashToken no fungible (NFT)!](#heading-mint-your-first-non-fungible-cashtoken-nft)
  * [Paso 0. Configura tu billetera](#heading-step-0-set-up-your-wallet)
    + [(a) Si quieres usar Chipnet…](#heading-a-if-you-want-to-use-chipnet)
  * [Paso 1. Prepara tu arte ](#heading-step-1-ready-your-art)
    + [(a) Crea tus íconos fácilmente](#heading-a-easily-create-your-icons)
  * [Paso 2. Sube tu arte](#heading-step-2-upload-your-art)
  * [Paso 3. Escribe tus metadatos ](#heading-step-3-write-your-metadata)
    + [(a) Generar el BCMR de una serie de NFTs](#heading-a-generating-nft-series-bcmr)
    + [(b) Sube tu archivo BCMR a IPFS](#heading-b-upload-your-bcmr-file-to-ipfs)
  * [Paso 4. ¡Hora de acuñar!](#heading-step-4-return-to-cashonize)
    + [(a) Crea tu NFT de acuñación](#heading-a-create-your-minting-nft)
    + [(b) Crea tus NFTs hijos inmutables](#heading-b-create-your-immutable-child-nfts-)
    + [(c) ¡Mira tus nuevos NFTs!](#heading-c-check-out-your-new-nfts)
    + [(d) Asegura el `authbase` ](#heading-d-secure-the-authbase)
    + [(e) ¡Ups! ¡`authUpdate.js` al rescate!](#heading-e-oops-authupdatejs-to-the-rescue)
      - [Posibles errores](#heading-possible-errors)
  * [Paso 5. ¡Envía algunos NFTs!](#heading-step-5-send-some-nfts)
    + [(a) NFTs en la billetera Electron Cash](#heading-a-nfts-in-the-electron-cash-wallet)
    + [(b) NFTs en la billetera Paytaca](#heading-b-nfts-in-the-paytaca-wallet)
  * [Paso 6. Quema el NFT de acuñación](#heading-step-6-burn-the-minting-nft)
  * [Paso 7. Genera confianza y visibilidad en la comunidad](#heading-step-7-build-community-trust-and-awareness)
  * [Extra: ¡consigue tus NFTs BCH Vision!](#heading-bonus-grab-your-bch-vision-nfts)
- [Lo que sigue](#heading-next)
- [Apoya la serie de tutoriales “Token Pioneers”](#heading-support-the-token-pioneers-tutorial-series)
  * [¡Con cariño de la comunidad incluido! ](#heading-community-love-included)
  * [Gracias](#heading-thank-you)
- [Tu opinión importa](#heading-your-feedback-matters)

Los NFTs en BCH son, sencillamente, **INCREÍBLES**. ¡Son mucho más que simples JPEGs bonitos!

Esto es lo que pueden hacer los NFTs de BCH CashTokens:

- Ser los NFTs de toda la vida y representar un archivo en la cadena, demostrando que tienes un derecho de propiedad irrevocable sobre ese archivo, igual que los Bored Apes y todo ese divertido coleccionismo e intercambio de NFTs.
- Funcionar como fragmentos de texto irrevocables en la cadena (“strings” en lenguaje de programadores; es decir, una secuencia de caracteres). A estos los llamamos **compromisos**.
- Crear aplicaciones descentralizadas (dapps) que se benefician de la seguridad de la blockchain (cadena de bloques) de BCH. ¡Incluso dapps que llaman a otras dapps, que se coordinan entre sí y que se coordinan con cadenas laterales! **¡Esto es muy importante!**

Los NFTs de BCH también son fáciles de acuñar y no requieren puentes complejos ni cadenas laterales, como en otras cadenas. Cuando usas CashTokens, estás creando NFTs en la L1 de BCH. Los validan los mineros, lo que significa que existen en la cadena al mismo nivel que el propio BCH, con los mismos beneficios de seguridad e irrevocabilidad.

No olvidemos que acuñar e intercambiar NFTs de CashTokens es muy barato, porque existen en BCH, una blockchain importante con [comisiones de menos de un centavo](https://bitcoinfees.cash/). Esto hace más fácil construir con tus NFTs y crecer.

<a name="heading-use-cases"></a>
### Casos de uso

Estas son solo algunas de las cosas que puedes crear con NFTs de BCH:

- juegos con NFTs
- mercados de NFTs
- aplicaciones de venta de entradas con NFTs
- plataformas de coleccionables NFT
- bienes raíces virtuales
- modelos de suscripción a contenidos
- sistemas de nombres de dominio
- soluciones de identidad descentralizada
- programas de fidelización y recompensas
- licencias de activos, por ejemplo, de música
- venta directa de música y películas.

<a name="heading-build-with-us"></a>
### Desarrolla con nosotros

¡La comunidad de desarrolladores de BCH CashTokens está creciendo rápido! Únete a uno de estos grupos de Telegram, o a los dos, para recibir ayuda y hablar con otros desarrolladores: 

- [Panmoni CashTokens Builders](https://t.me/Panmoni/315)
- [CashToken Devs](https://t.me/cashtoken_devs)

Para una introducción a BCH CashTokens en general y a los CashTokens fungibles, consulta el [tutorial 1 de la serie Token Pioneers](/blog/token-pioneers-cashtokens-tutorial-1).

<a name="heading-how-nfts-work-on-chain"></a>
## Cómo funcionan los NFTs en la cadena

Como se mencionó en el [tutorial 1 de esta serie](/blog/token-pioneers-cashtokens-tutorial-1#cashtokens-explained), la actualización BCH CashTokens de mayo de 2023 añadió a las UTXOs un nuevo campo llamado `token_data`. Este campo tiene varios subcampos. Los FTs (tokens fungibles) solo usan los campos `amount` y `category`.

Los NFTs (tokens no fungibles) usan `category`, igual que los [tokens fungibles](/blog/token-pioneers-cashtokens-tutorial-1), y los dos campos `nft`:

- `capability`: si el valor es `minting`, permite a quien lo tiene crear más NFTs de la misma `category` y con cualquier `commitment`. Estos nuevos NFTs pueden tener capacidad `minting` o `mutable`. Si el valor es `mutable`, permite cambiar el campo `commitment` al gastar el NFT hacia una nueva UTXO. Si la capacidad es `none`, el NFT se puede gastar (es decir, mover a otra UTXO), pero el `commitment` no se puede cambiar y no se puede usar para acuñar nuevos NFTs. Los NFTs con la `none` `capability` suelen mostrarse como “Immutable” en las billeteras y los exploradores de bloques.
- `commitment`: el mensaje del NFT, que puede tener hasta 40 bytes.

Los NFTs no usan el campo `amount`, ya que solo puede haber 1 NFT por UTXO. Así, la cantidad de NFTs en una UTXO queda implícita. Si hay datos en los campos `nft`, hay 1 NFT. Si no, hay 0 NFTs en esa UTXO y los campos `nft` se omiten.

Los NFTs y los FTs pueden compartir la misma `category`. A diferencia de los FTs, los NFTs no se pueden fusionar ni dividir. Sin embargo, probablemente sea posible fraccionar un NFT guardándolo en un contrato y emitiendo tokens fungibles respaldados por él.

<a name="heading-my-bch-guru-a-sample-nft"></a>
### Mi BCH Guru (un NFT de ejemplo)

Este es mi [BCH Guru #2447](https://nfts.bch.guru/guru-viewer?nft=2447), un ninja muy apuesto que entrena en la naturaleza y sabe qué activo conservar.

[![](../../../assets/images/posts/tp2/Screenshot%202023-08-09%20at%204.19.29%20PM.png "BCH Guru #2447")](https://nfts.bch.guru/guru-viewer?nft=2447)

Se acuñó en [esta transacción](https://explorer.salemkode.com/tx/a972fcfd7b79fca0c7fe69f81aee0ceab5157cc327d5bd5e7fafb4a4273750b9), que encontré porque el sitio web de BCH Guru me dio el ID de la transacción:

`a972fcfd7b79fca0c7fe69f81aee0ceab5157cc327d5bd5e7fafb4a4273750b9`

Así se ve la transacción en el explorador SalemKode.

[![](../../../assets/images/posts/tp2/Screenshot%202023-08-09%20at%205.17.45%20PM.png)](https://explorer.salemkode.com/tx/a972fcfd7b79fca0c7fe69f81aee0ceab5157cc327d5bd5e7fafb4a4273750b9)

Tanto en el lado de origen (entrada) como en el de destino (salida) de la transacción, puedes ver que muestra el campo `category` del token no fungible, el campo `commitment` (¡bastante pequeño!) y el campo `capability` (`none`).

Y así se ve esa transacción de acuñación en la cadena. (El [tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#a-sample-bch-transaction-vanilla-no-cashtokens) te enseña a obtener la transacción en bruto en formato JSON para cualquier transacción).

```json
{
    "txid": "a972fcfd7b79fca0c7fe69f81aee0ceab5157cc327d5bd5e7fafb4a4273750b9",
    "hash": "a972fcfd7b79fca0c7fe69f81aee0ceab5157cc327d5bd5e7fafb4a4273750b9",
    "version": 2,
    "size": 397,
    "locktime": 0,
    "vin": [
        {
            "txid": "03e0a28decfc08fc136449397526960d65c5a3cdd8dc9236b202d49146d5b77b",
            "vout": 447,
            "scriptSig": {
                "asm": "114266f9531557d8f090c78a74fdb5884dd2e908ddb4aeefd802bab9362adbf859904a2ea508a9ba14332125be0aa120ca48760e69f1055870c80abd20bfb921[ALL|FORKID] 031cd9371f9f7c8b5d1a2b2b75663f85621efc82fe32eed6b869b9dd4234ebdc2f",
                "hex": "41114266f9531557d8f090c78a74fdb5884dd2e908ddb4aeefd802bab9362adbf859904a2ea508a9ba14332125be0aa120ca48760e69f1055870c80abd20bfb9214121031cd9371f9f7c8b5d1a2b2b75663f85621efc82fe32eed6b869b9dd4234ebdc2f"
            },
            "sequence": 0
        },
        {
            "txid": "411cbe00cafb6438e7716e304c03b0ed0ec570d8cefdf355c8437efa6da78a5a",
            "vout": 1,
            "scriptSig": {
                "asm": "6e2e4eaff06aac33f8087c6767d40d4e9da74f9642a989a5ff5d332651b213406d664aba1fb5ff107c9890e9be96dc2c781c6fc5d0cc92cc9ede0262c38a933f[ALL|FORKID] 031cd9371f9f7c8b5d1a2b2b75663f85621efc82fe32eed6b869b9dd4234ebdc2f",
                "hex": "416e2e4eaff06aac33f8087c6767d40d4e9da74f9642a989a5ff5d332651b213406d664aba1fb5ff107c9890e9be96dc2c781c6fc5d0cc92cc9ede0262c38a933f4121031cd9371f9f7c8b5d1a2b2b75663f85621efc82fe32eed6b869b9dd4234ebdc2f"
            },
            "sequence": 0
        }
    ],
    "vout": [
        {
            "value": 0.00001,
            "n": 0,
            "scriptPubKey": {
                "asm": "OP_DUP OP_HASH160 ffaca33707e70569d3677c53f5ca80fe090cb8f7 OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a914ffaca33707e70569d3677c53f5ca80fe090cb8f788ac",
                "reqSigs": 1,
                "type": "pubkeyhash",
                "addresses": [
                    "bitcoincash:qrl6egehqlns26wnva798aw2srlqjr9c7ucgw898pu"
                ]
            },
            "tokenData": {
                "category": "f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301",
                "amount": "0",
                "nft": {
                    "capability": "none",
                    "commitment": "098f"
                }
            }
        },
        {
            "value": 0.07790415,
            "n": 1,
            "scriptPubKey": {
                "asm": "OP_DUP OP_HASH160 f11d96b3ccbaee778fd52bc131ae782020e445a3 OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a914f11d96b3ccbaee778fd52bc131ae782020e445a388ac",
                "reqSigs": 1,
                "type": "pubkeyhash",
                "addresses": [
                    "bitcoincash:qrc3m94nejawuau0654uzvdw0qszpez95v0wgqjfjc"
                ]
            }
        }
    ]
}
```

Este es el NFT en sí, en la salida 0 de la transacción:

```json
{
            "value": 0.00001,
            "n": 0,
            "scriptPubKey": {
                "asm": "OP_DUP OP_HASH160 ffaca33707e70569d3677c53f5ca80fe090cb8f7 OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a914ffaca33707e70569d3677c53f5ca80fe090cb8f788ac",
                "reqSigs": 1,
                "type": "pubkeyhash",
                "addresses": [
                    "bitcoincash:qrl6egehqlns26wnva798aw2srlqjr9c7ucgw898pu"
                ]
            },
            "tokenData": {
                "category": "f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301",
                "amount": "0",
                "nft": {
                    "capability": "none",
                    "commitment": "098f"
                }
            }
        },
```

Bajo `tokenData`, puedes ver el valor `category` de BCH Guru:

`f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301`

Puedes verificar que este es el valor `category` correcto visitando [nfts.bch.guru](https://nfts.bch.guru/#faqs) y leyendo las preguntas frecuentes. Busca en la página el valor `category` que estás comprando y comprueba que coincida.

[![](../../../assets/images/posts/tp2/Screenshot%202023-08-10%20at%209.03.39%20AM.png)](https://nfts.bch.guru/#faqs)

> Al comprar CashTokens, intenta siempre verificar que estás comprando el valor `category` correcto. Como [recordamos en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#cashtokens-metadata), es importante tener en cuenta que los nombres de los tokens, sus tickers, descripciones, etc. (es decir, todo lo relativo a la marca) no se guardan en la cadena. Se guardan en archivos de metadatos fuera de la cadena. Pronto aprenderemos más sobre los metadatos.

El valor `amount` de mi NFT BCH Guru es cero porque la cantidad de NFTs es implícita, como se mencionó arriba. El valor `capability` es `none`, lo que significa que no puedo cambiar el valor `commitment` de mi NFT ni acuñar más de la misma `category`. Y el valor `commitment` es “098f”. La notación hexadecimal de 2447 es 098f.

¡Sí, así de sencillo! Y sí, **tú también puedes acuñar tus propios NFTs**. Te enseño cómo más abajo.

<a name="heading-tracking-down-the-authhead"></a>
#### Rastreando el `authhead` 

Hablando de metadatos, vamos a rastrear los metadatos [BCMR](https://github.com/bitjson/chip-bcmr) de mi [NFT BCH Guru # 2447](https://nfts.bch.guru/guru-viewer?nft=2447). Podemos hacerlo de un par de maneras.

Podría visitar [otr.cash](https://otr.cash/) u otro registro (servidor) BCMR y ver si tiene los metadatos de BCH Gurus. Sin embargo, [otr.cash](https://raw.githubusercontent.com/OpenTokenRegistry/otr.cash/master/static/.well-known/bitcoin-cash-metadata-registry.json) solo tiene datos de los Gurus hasta el número 2000.

Así que el mío no está ahí. 

<a name="heading-using-the-paytaca-bcmr-indexer"></a>
##### Usando el Paytaca BCMR Indexer

Por suerte, [Paytaca](https://www.paytaca.com/) está construyendo un [indexador BCMR](https://github.com/paytaca/bcmr-indexer), así que podemos consultarlo. Podemos encontrar el `authhead` a través de su API, así:

`https://bcmr.paytaca.com/api/authchain/CATEGORY/head/`

Quiero el `authhead` de BCH Gurus, así que visitaré [este enlace](https://bcmr.paytaca.com/api/authchain/f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301/head/) en mi navegador:

> Nota al margen: el `authhead` forma parte de la especificación BCMR (Bitcoin Cash Metadata Registries). En términos simples, el `authhead` de una `category` dada es la [actualización más reciente de sus metadatos](https://cashtokens.org/docs/bcmr/chip/#zeroth-descendant-transaction-chains), algo parecido a cómo la “punta de la cadena” es el bloque creado más recientemente en una blockchain. Hablaremos más sobre metadatos en un próximo tutorial, ¡así que no te preocupes!

La API del indexador BCMR de Paytaca me dio este resultado:

```
{"authchain_head": {"txid": "6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572", "owner": "bitcoincash:qz8mrhv7ahv3w5fvuatv2s289j652650rcaytjezke"}}
```

Toma de aquí el valor de `txid`, que es:

`6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572`

Y pégalo en tu explorador de bloques de BCH favorito, por ejemplo [SalemKode](https://explorer.salemkode.com/) o [Blockchair](https://blockchair.com/).

Esta es la transacción en [SalemKode](https://explorer.salemkode.com/tx/6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572): 

[![](../../../assets/images/posts/tp2/Screenshot%202023-08-09%20at%206.11.09%20PM.png)](https://explorer.salemkode.com/tx/6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572)

Y aquí está en [Blockchair](https://blockchair.com/bitcoin-cash/transaction/6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572). Desplázate hacia abajo para ver el OP_RETURN decodificado.

[![](../../../assets/images/posts/tp2/Screenshot%202023-08-10%20at%2010.06.19%20AM.png)](https://blockchair.com/bitcoin-cash/transaction/6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572)

La URL de IPFS resaltada es la actualización más reciente de los metadatos BCH Gurus al momento de escribir esto. Para verla, toma el CID de IPFS ([explicado en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#4-create-the-token-metadata)), pon `https://ipfs.io/ipfs/` delante y visita [la URL resultante](https://ipfs.io/ipfs/bafybeigdbfo7k2f4kfkntbn4vu4gjlsp7vnkinwsf2gsnexbqz2uidbf7u):

Buscaremos en este archivo JSON “098f”, el valor `commitment` de mi NFT BCH Guru # 2447, y encontraremos esto. Estos son los metadatos BCMR de mi NFT.

```json
    "098f": {
    "name": "BCH Guru #2447",
    "description": "Guru #2447 from the BCH Guru NFT collection",
    "uris": {
      "icon": "ipfs://bafybeiarpxly2a5edilhb53bkurmuw2ddudn5keifxoixf46qsyghtfzra/2447-icon.png",
      "image": "ipfs://bafybeiarpxly2a5edilhb53bkurmuw2ddudn5keifxoixf46qsyghtfzra/2447.png"
    },
    "extensions": {
      "attributes": {
        "Background": "Mountain Top Scene",
        "Tone": "Tone 3",
        "Ear Right": "",
        "Ear Left": "",
        "Clothes": "Tang Suit Guru",
        "Mouth": "Drooling",
        "Eyes": "Raised Eyebrow Left",
        "Head": "Ninja Hat",
        "Glasses": "Rectangle Shades",
        "Crystal Ball": "Crystal Gaze Oracle",
        "Asset": "Bitcoin Cash",
        "Hand Right": "Digital Watch",
        "Hand Left": "",
        "Lyrics": ""
      }
    }
  },
```

<a name="heading-using-the-chaingraph-indexer-"></a>
##### Usando el indexador Chaingraph

También puedes rastrear el `authhead` con [Chaingraph](https://chaingraph.cash/), un indexador de BCH con una API [GraphQL](https://graphql.org/).

Visita [try.chaingraph.cash](https://try.chaingraph.cash/) y ejecuta esta consulta:

```graphql
query GetTransactionDetails {
  transaction(where: { hash: { _eq:
  "\\xf54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301"
  } } ) {
    authchains {
      authchain_length
      authhead_transaction_hash
      authhead {
        block_inclusions {
          block {
            height
          }
        }
      }
      migrations {
        migration_index
        transaction {
          hash
        }
      }
      unspent_authhead
    }
}
}
```

Este es el resultado de Chaingraph al momento de escribir esto:

```json
{
  "data": {
    "transaction": [
      {
        "authchains": [
          {
            "authchain_length": 4,
            "authhead_transaction_hash": "\\x6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572",
            "authhead": {
              "block_inclusions": [
                {
                  "block": {
                    "height": "804413"
                  }
                }
              ]
            },
            "migrations": [
              {
                "migration_index": "0",
                "transaction": [
                  {
                    "hash": "\\xf54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301"
                  }
                ]
              },
              {
                "migration_index": "1",
                "transaction": [
                  {
                    "hash": "\\x13e44d46044deeb677854165b57d1070ccb3ccdd1e0ca9e81afb7e8966d51333"
                  }
                ]
              },
              {
                "migration_index": "2",
                "transaction": [
                  {
                    "hash": "\\x7f970e6b92a926df1251466611105f6775520487b957c2fc07191453b027ad17"
                  }
                ]
              },
              {
                "migration_index": "3",
                "transaction": [
                  {
                    "hash": "\\x6472de227a3d71fc8b2f18e4507a858f8b0cfd56f1b4ec2bede9f367e84b8572"
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

Esto muestra el `authchain` completo y, como puedes ver, el `authhead_transaction_hash` tiene el mismo valor que nos dio el indexador BCMR de Paytaca.

> Nota: los resultados que obtengas de estos indexadores pueden haber cambiado cuando leas esto, ya que BCH Gurus actualiza con frecuencia sus metadatos para incluir los Gurus recién acuñados.

Los próximos tutoriales tratarán Chaingraph con más detalle, pero, como puedes ver, su salida (al igual que la de los archivos de metadatos BCMR) es muy fácil de leer para las personas. 

Si Chaingraph te interesa, considera unirte al [canal de Telegram Chaingraph_dev](https://t.me/chaingraph_dev).

<a name="heading-understanding-commitments"></a>
### Entender los compromisos

Los NFTs de BCH Cash Tokens pueden entenderse como **strings**, es decir, una secuencia de caracteres. En cambio, los tokens fungibles son **números**. En cierto nivel, es así de simple.

Sí, puedes crear, vender e intercambiar los NFTs en JPEG que todos conocemos y queremos. Dicho esto, el propósito más importante de estos NFTs es aprovechar la tasa de hash (hashrate) de la blockchain de BCH y la irreversibilidad de las transacciones de BCH para crear **compromisos**.

Estos compromisos de NFT, cadenas de bytes de unos 40 caracteres, no se pueden suplantar y son irrevocables, lo que significa que otros contratos pueden leerlos y actuar con confianza en función de ellos. Así, los NFTs de Cash Tokens permiten que los contratos en la cadena “llamen” a otros contratos.

Los contratos pueden interoperar en la cadena en grupos que trabajan juntos sin necesidad de confianza. Así, los contratos se convierten en bloques de construcción, Legos de DeFi si quieres, que pueden colaborar aunque los hayan desarrollado y desplegado personas distintas y en momentos distintos. Cada UTXO hace lo suyo, a veces incluso en paralelo.

Los NFTs que tienen la misma `category` pueden tener valores `commitment` idénticos; sin embargo, también se puede imponer la unicidad con **covenants** (contratos que limitan cómo se pueden gastar las monedas), que sin duda veremos en esta serie.

Lo más importante que debes recordar sobre los compromisos es que son mensajes en la cadena. Aunque a primera vista parezcan misteriosos, no son más que eso. ¡Claro que la capacidad de pasar mensajes cortos en la cadena es tremendamente potente y se puede usar de muchísimas maneras increíbles!

Esto es un poco abstracto, ¡lo sé! Pero todo quedará claro a medida que avance esta serie de tutoriales. En próximos tutoriales exploraremos qué se puede hacer con el campo `commitment`. ¡Es más de lo que imaginas!

<a name="heading-emerald-dao"></a>
#### Emerald DAO

[Emerald DAO](https://emerald-dao.cash/) es un proyecto pionero de CashTokens del desarrollador [BitcoinCashAutist](https://twitter.com/bchautist) que busca ser una plantilla para crear DAOs ([organizaciones autónomas descentralizadas](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization)) en BCH con CashTokens.

Cuando [compras un NFT de Emerald DAO](https://tapswap.cash/trade/180f0db4465c2af5ef9363f46bacde732fa6ffb3bfe65844452078085b2e7c93) (lo siento, la acuñación ya terminó), obtienes una especie de “caja de seguridad” en la cadena con algo de BCH dentro, bloqueado temporalmente. Cuando vence el bloqueo temporal, puedes abrirla, o no.

Veamos qué hizo Emerald DAO con los compromisos de sus NFTs.

Visitando [emerald-dao.cash](https://emerald-dao.cash/#deployments), podemos obtener la transacción génesis:

`00003c40fa202816c357350eaa2e7ec2b47766209604941789ecf814f98ba4a6`

Aquí está en [SalemKode](https://explorer.salemkode.com/tx/00003c40fa202816c357350eaa2e7ec2b47766209604941789ecf814f98ba4a6).

[![](../../../assets/images/posts/tp2/DraggedImage.png)](https://explorer.salemkode.com/tx/00003c40fa202816c357350eaa2e7ec2b47766209604941789ecf814f98ba4a6)

Si miras las salidas de esta transacción, verás que este explorador muestra `category`, `commitment` y `capability`:

- `category`: `180f0db4465c2af5ef9363f46bacde732fa6ffb3bfe65844452078085b2e7c93`
- `commitment`: `0000` (“0” en base 10)
- `capability`: `minting`

Aquí es donde se acuñó el **NFT de acuñación** de Emerald DAO, el que se usó para crear todos los demás.

Entra a la [página](https://explorer.salemkode.com/token/180f0db4465c2af5ef9363f46bacde732fa6ffb3bfe65844452078085b2e7c93) de `category` y verás todos los NFTs hijos de esta categoría, con sus compromisos correspondientes.

Puedes ver que algunos tienen como compromiso un número hexadecimal de 2 bytes (por ejemplo, `0700` o `0b00`), mientras que otros son mucho más largos e incluyen esos 2 bytes al principio de sus compromisos. Los más cortos son “tarjetas llave” que abren los correspondientes que empiezan con el mismo número hexadecimal. Los dígitos restantes son la cantidad de satoshis bloqueados en el NFT.

Si hay interés, podemos tratar Emerald DAO en un próximo tutorial. Solo quería mostrarte otro ejemplo de cómo se pueden usar los compromisos.

<a name="heading-nft-metadata"></a>
## Metadatos de NFT

Como ves, ¡hay mucha información importante que no está en la cadena! Aquí es donde entran los **metadatos**, en particular el [estándar BCMR](https://github.com/bitjson/chip-bcmr), o Bitcoin Cash Metadata Registries.

Para repasar cómo son los metadatos básicos de BCMR, [consulta el tutorial 1 de esta serie](/blog/token-pioneers-cashtokens-tutorial-1#sample-bcmr-metadata). Los metadatos de los NFTs son bastante parecidos, pero hay un par de diferencias destacables:

- No hay campo `token.decimals` (ya que los NFTs no son divisibles).
- Hay un campo `token.nfts` que tiene varios subcampos y puede contener muchos NFTs. Veremos ejemplos de esto más abajo.

[El estándar BCMR](https://github.com/bitjson/chip-bcmr#associating-information-with-nfts) contempla dos tipos de NFTs:

1. **Secuenciales**: estos NFTs usan un número entero positivo como `commitment`. Mira, por ejemplo, más arriba, donde el `commitment` de mi BCH Guru # 2447 es simplemente “098f” (que es “2447” en hexadecimal).
2. **Analizables**: estos NFTs tienen subcampos analizables (es decir, componentes que se pueden descomponer para analizarlos). Los NFTs analizables pueden codificar más datos y, por lo tanto, son menos eficientes y requieren más BCH bloqueados y comisiones de transacción más altas. ¡Pero con ellos puedes hacer muchas cosas divertidas!

¡No te preocupes! En un próximo tutorial veremos a fondo los metadatos BCMR y los NFTs analizables.

<a name="heading-bch-guru-metadata"></a>
### Metadatos de BCH Guru

Veamos [la actualización de metadatos que encontramos antes](https://ipfs.io/ipfs/bafybeigdbfo7k2f4kfkntbn4vu4gjlsp7vnkinwsf2gsnexbqz2uidbf7u) buscando el `authhead` de los Gurus. Fíjate en que `category`, `symbol` y `uris` son iguales que para los tokens fungibles (FTs).

```json
  "identities": {
    "f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301": {
      "2023-07-30T21:35:28.982Z": {
        "name": "BCH Gurus",
        "description": "BCH Guru Collectible NFTs, associated with the bch.guru price-prediction game.",
        "token": {
          "category": "f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301",
          "symbol": "GURU",
          "nfts": {
            "description": "BCH Guru Collectible NFTs, associated with the bch.guru price-prediction game.",
            "parse": {
              "types": {
                "10": {
                  "name": "BCH Guru #16",
                  "description": "Guru #16 from the BCH Guru NFT collection",
                  "uris": {
                    "icon": "ipfs://bafybeigw5korsj6gfjc54xetmatbmas7dev5l52jnmavnotzn2zkbqqnee/16-icon.png",
                    "image": "ipfs://bafybeigw5korsj6gfjc54xetmatbmas7dev5l52jnmavnotzn2zkbqqnee/16.png"
                  },
                  "extensions": {
                    "attributes": {
                      "Background": "Cloud Scene",
                      "Tone": "Tone 1",
                      "Ear Right": "",
                      "Ear Left": "Pearl Earring",
                      "Clothes": "Casual Guru",
                      "Mouth": "Bubblegum",
                      "Eyes": "Eye Patch Left",
                      "Head": "Pork Pie Hat",
                      "Glasses": "",
                      "Crystal Ball": "Fiery Fortune Oracle",
                      "Asset": "Bitcoin Cash",
                      "Hand Right": "",
                      "Hand Left": "",
                      "Lyrics": ""
                    }
                  }
                },
...
```

Como ves bajo `token.nfts`, hay una entrada para cada NFT hijo. Aquí se muestra el BCH Guru #16, identificado por el valor `10`, que es “16” en hexadecimal. Cada NFT tiene `uris` para `icon` (400px x 400px), así como `image`, que tiene dimensiones mucho mayores.

Bajo `extensions` están los `attributes` del NFT. Estos datos se pueden analizar y mostrar en billeteras, en [tapswap.cash](https://tapswap.cash/trade/f54ce0297a4017cc922aacde5f7abe7a8397a1058b879f5eb9e2a643d4ec2301), etc.

Veamos más de cerca los metadatos de mi BCH Guru # 2447.

```json
        "098f": {
          "name": "BCH Guru #2447",
          "description": "Guru #2447 from the BCH Guru NFT collection",
          "uris": {
            "icon": "ipfs://bafybeiarpxly2a5edilhb53bkurmuw2ddudn5keifxoixf46qsyghtfzra/2447-icon.png",
            "image": "ipfs://bafybeiarpxly2a5edilhb53bkurmuw2ddudn5keifxoixf46qsyghtfzra/2447.png"
          },
          "extensions": {
            "attributes": {
              "Background": "Mountain Top Scene",
              "Tone": "Tone 3",
              "Ear Right": "",
              "Ear Left": "",
              "Clothes": "Tang Suit Guru",
              "Mouth": "Drooling",
              "Eyes": "Raised Eyebrow Left",
              "Head": "Ninja Hat",
              "Glasses": "Rectangle Shades",
              "Crystal Ball": "Crystal Gaze Oracle",
              "Asset": "Bitcoin Cash",
              "Hand Right": "Digital Watch",
              "Hand Left": "",
              "Lyrics": ""
            }
          }
        },
```

Los datos de `attributes` son los mismos que se muestran en [nfts.bch.guru](https://nfts.bch.guru/guru-viewer?nft=2447) para este NFT.

<a name="heading-mint-your-first-non-fungible-cashtoken-nft"></a>
## ¡Acuña tu primer NFT!

¡Se acabó la espera! ¡Es hora de empezar a crear nuestros propios compromisos en la cadena con BCH CashTokens! Estos son los pasos:

<a name="heading-step-0-set-up-your-wallet"></a>
### Paso 0. Configura tu billetera

Este tutorial da por hecho que ya tienes tu billetera configurada. Puedes [repasar el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#1-install-electron-cash) para ver los detalles.

<a name="heading-a-if-you-want-to-use-chipnet"></a>
#### (a) Si quieres usar Chipnet…

Si no quieres gastar BCH real para crear tus NFTs la primera vez, puedes probar el proceso usando chipnet (la red de pruebas de los CHIPs). Chipnet es una red de pruebas de BCH.

1. En la [billetera Cashonize](https://cashonize.com/), haz clic en el menú del engranaje.
2. Donde dice “Change network”, selecciona “chipnet”.
3. Usa el faucet [tbch.googol.cash](https://tbch.googol.cash/) para conseguir algunas monedas tBCH de chipnet, que necesitarás para acuñar.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%2012.24.31%20PM.png "Aquí es donde cambias a chipnet, si quieres")

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%2012.19.38%20PM.png "tbch.google.cash")

<a name="heading-step-1-ready-your-art"></a>
### Paso 1. Prepara tu arte 

Preparemos tu arte en una carpeta en tu escritorio. Cada NFT necesita un `icon` pequeño. Si además tiene una versión de mejor calidad y mayor resolución, ¡también es una gran idea! Supondré que empiezas con un conjunto de imágenes cuadradas de alta resolución.

1. **Prepara el arte**: de forma manual o como prefieras, pon tus imágenes de alta resolución en una carpeta y numéralas `1-img.png`, `2-img.png`, etc. El mejor formato de archivo es SVG, aunque AVIF, WebP y PNG también sirven. Numera tus íconos más pequeños (400 px x 400 px) `1.png`, `2.png`, etc.
	1. Recuerda que también necesitas un `image` y un `icon` que representen la serie en sí.

<a name="heading-a-easily-create-your-icons"></a>
#### (a) Crea tus íconos fácilmente

Si ya tienes tus imágenes del tamaño de `icon`, puedes saltarte este paso. Si no, crearemos nuevas imágenes de 400 px x 400 px aptas para usarse como `icon`s en una computadora con Ubuntu 23.04, con un script de Python3, la biblioteca [Pillow](https://pillow.readthedocs.io/en/stable/), la biblioteca [tinify](https://tinypng.com/developers/reference/python) y la [API de TinyPNG](https://tinypng.com/developers).

_Si quieres saber cómo hacerlo en otro sistema operativo_, pide ayuda en el [Telegram de Panmoni](https://t.me/Panmoni/315). Con gusto te ayudamos.

1. Puedes usar [Cyberduck](https://cyberduck.io/) para subir los archivos a un servidor por SFTP.
2. Configura un entorno virtual de Python:
	1. (como root) `apt update` && `apt install python3-venv`.
	2. Usa `cd` para ir al directorio donde están tus archivos de imagen. Supongo que es un directorio llamado `nftSeriesFolder` en la carpeta personal de tu usuario sin privilegios.
	3. (como el usuario sin privilegios) Crea el entorno virtual: `python3 -m venv myenv`.
3. Entra al entorno virtual: `source myenv/bin/activate`.
4.  Instala las bibliotecas de Python tinify y Pillow `pip install tinify Pillow`.
5. Usa tu editor favorito (a mí me gusta [vi](https://en.wikipedia.org/wiki/Vi), pero para usuarios nuevos se recomienda [nano](https://linuxhint.com/nano-editor-beginner-guide/))  para crear el script `createIcons.py` o súbelo. Mira el código más abajo.
	1. Edita el script para poner tu clave de API de TinyPNG ([consigue una aquí](https://tinypng.com/developers)) y la ruta a la carpeta con tus imágenes. Donde veas el número “26”, puedes cambiarlo por el número de imágenes de tu colección más uno. Guarda el script editado.
6. Crea los íconos: `python3 createIcons.py` (tardará un momento).
7. Sal del entorno virtual: `deactivate`. Si ya terminaste con este entorno virtual, bórralo junto con el script y la carpeta `temp`: `rm -rf temp myenv createIcons.py`.
8. Puedes usar Cyberduck para descargar la carpeta a tu escritorio y revisar la calidad del resultado final.

```python
# createIcons.py
import tinify
import os
from PIL import Image

# Set up tinify API key
tinify.key = "YOUR_TINYPNG_API_KEY"

input_folder = '/home/YOUR_USERNAME/nftSeriesFolder'
temp_folder = '/home/YOUR_USERNAME/nftSeriesFolder/temp'
output_folder = '/home/YOUR_USERNAME/nftSeriesFolder'

# Ensure the temp and output folders are created
for folder in [temp_folder, output_folder]:
    if not os.path.exists(folder):
        os.makedirs(folder)

for i in range(1, 26):
    # Try the filename with a leading zero first
    input_filename = f"{str(i).zfill(2)}-img.png"
    input_path = os.path.join(input_folder, input_filename)

    output_filename = f"{str(i).zfill(2)}.png"

    # If the file doesn't exist with a leading zero, try without the leading zero
    if not os.path.exists(input_path):
        input_filename = f"{i}-img.png"
        input_path = os.path.join(input_folder, input_filename)

        output_filename = f"{i}.png"

    temp_path = os.path.join(temp_folder, output_filename)
    output_path = os.path.join(output_folder, output_filename)

    # Resize the image first with PIL
    with Image.open(input_path) as img:
        img_resized = img.resize((400, 400), Image.LANCZOS)
        img_resized.save(temp_path, "PNG", quality=95)

    # Use tinify to optimize
    source = tinify.from_file(temp_path)
    source.to_file(output_path)

print("Resizing and optimization complete!")
```

<a name="heading-step-2-upload-your-art"></a>
### Paso 2. Sube tu arte

Ahora que tu arte está listo, puedes subirlo al servidor que lo alojará. Es importante que este servidor siga en línea, ya que otros desarrolladores de BCH mostrarán tu arte en billeteras, mercados y otros lugares. Por eso se recomienda subirlo a IPFS. Volveremos a usar [nft.storage](https://nft.storage/), que se espera que [sea siempre gratuito](https://nft.storage/faq/#how-is-nft-storage-free-to-use).

1. Inicia sesión o regístrate en [nft.storage](https://nft.storage/), descarga su [cliente de escritorio](https://nft.storage/docs/how-to/nftup/) (“NFT UP”) para tu sistema operativo, instálalo y ábrelo. Puedes volver a consultar el [tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#4-create-the-token-metadata), donde hablamos por primera vez de nft.storage.
2. Puede que necesites una clave de API de nft.storage, que puedes conseguir [aquí](https://nft.storage/manage/) sin costo.
3. Haz clic en la ventana de NFT UP y selecciona la carpeta que quieres subir. Es buena idea incluir en la carpeta la imagen de alta resolución y el ícono que representan toda tu serie.
4. Cuando termine la subida, te dará los datos que necesitas:
	1. **CID**: identificador de contenido (único).
	2. **URL de IPFS**: es simplemente “ipfs://“ y el CID. La necesitarás para el archivo de metadatos.
	3. **URL de la pasarela**: es un enlace https donde puedes ver lo que subiste. ¡Visítalo y mira todas tus imágenes!

![](../../../assets/images/posts/tp2/Screenshot%202023-08-11%20at%205.20.22%20PM.png "La pantalla de subida exitosa del directorio en nft.storage.")

<a name="heading-step-3-write-your-metadata"></a>
### Paso 3. Escribe tus metadatos 

Quiero que mi serie de NFTs sea aceptada por el registro BCMR [otr.cash](https://otr.cash/), así que revisé sus [requisitos de listado](https://otr.cash/docs/list/). Estos requisitos son bastante específicos y me parecieron algo estrictos. Aun así, te recomiendo echarles un vistazo antes de crear tus metadatos, sobre todo al [elegir tu ticker (`symbol`)](https://github.com/bitjson/chip-bcmr#guidelines-for-token-issuers).

BCH CashTokens se puede adoptar para tokenizar muchos activos, como acciones, bonos, apuestas, bienes raíces y más. Para lograrlo, como comunidad nos conviene guiarnos por los [requisitos de otr.cash](https://otr.cash/docs/list/) y así no crear nuevos obstáculos, como crear un token con el ticker “AAPL” cuando, más adelante, queramos crear acciones sintéticas de Apple.

1. Visita el [BCMR Generator](https://bcmr-generator.netlify.app/) de Mathieu Geukens y completa tus datos. Puedes compartir tus datos en el grupo de [Telegram de Panmoni](https://t.me/Panmoni/315) y te daremos nuestra opinión.
2. Puedes referirte a las imágenes que subiste a IPFS con la URL de IPFS y el nombre del archivo, así: `ipfs://YOUR_IPFS_CID/YOUR-FILENAME.EXT`
3. Asegúrate de activar las opciones “Has NFTs” y “Has High-resolution Image for NFTs (besides 400x400px icon)”.
4. Para obtener tu “TokenId”, visita la [billetera Cashonize](https://cashonize.com/) y selecciona la pestaña “CreateTokens”. Copia el “Planned tokenId” que te sugiere ahí. Si no ves ninguno, puede que no tengas saldo de BCH o que tengas que hacer una [transacción de consolidación](/blog/token-pioneers-cashtokens-tutorial-1#2-open-cashonizecom), como se describe en el tutorial 1.
5. Cuando estés conforme con los datos, haz clic en “Download BCMR json file” para descargar el archivo JSON BCMR de tu serie.
6. Abre el archivo en un editor de texto como [VSCode](https://code.visualstudio.com/) y edítalo con cuidado para adaptar el archivo de metadatos a tus necesidades y preferencias.

Mira mis datos de BCMR como referencia. Esto es lo que ingresé en el BCMR Generator:

![](../../../assets/images/posts/tp2/Screenshot%202023-08-11%20at%206.01.18%20PM.png "Los datos de BCMR de mi serie de NFTs")

Y este es (el comienzo de) mi resultado final, después de hacer algunas ediciones:

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
...
```

Para ver el archivo completo, [carga esta URL](https://bafkreihscx6uszzeninqknk54fp7pykhophkdb2jffpxukaebngqlo2pii.ipfs.nftstorage.link/) en tu navegador.

<a name="heading-a-generating-nft-series-bcmr"></a>
#### (a) Generar el BCMR de una serie de NFTs

Si tienes problemas con el generador de BCMR, siempre puedes tomar un archivo BCMR genérico, como [el ejemplo del tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#sample-bcmr-metadata), abrirlo en VSCode, quitar las partes específicas de los FTs y añadir las partes específicas de los NFTs.

Este script de Python te ayudará a generar las secciones individuales de cada uno de tus NFTs, si decides ir por este camino.

1. Asegúrate de cambiar 26 por tu número de imágenes de NFT únicas más uno.
2. Reemplaza “YOUR NFT SERIES” con tu marca.
3. Reemplaza “YOUR_IPFS_CID” con tu CID de IPFS.
4. Cuando esté listo, ejecuta `python3 genNFTsBCMR.py` y generará un archivo `output.json` en el mismo directorio.

```python
#genNFTsBCMR.py
import json

def generate_sections():
    sections = {}

    for i in range(1, 26):
        hex_value = format(i, '02x')
        sections[hex_value] = {
            "name": f"YOUR NFT SERIES #{i}",
            "description": f"NFT #{i} from YOUR NFT SERIES.",
            "uris": {
                "icon": f"ipfs://YOUR_IPFS_CID/{i}.png",
                "image": f"ipfs://YOUR_IPFS_CID/{i}-img.png"
            }
        }

    return sections

def main():
    sections = generate_sections()

    # Writing the result to a JSON file
    with open('output.json', 'w') as json_file:
        json.dump(sections, json_file, indent=4)

    print("JSON output has been saved to output.json")

if __name__ == "__main__":
    main()
```

<a name="heading-b-upload-your-bcmr-file-to-ipfs"></a>
#### (b) Sube tu archivo BCMR a IPFS

Cuando estés conforme con tu archivo BCMR, puedes subirlo a IPFS usando [nft.storage](https://nft.storage/new-file/). Toma el CID del menú “Actions” en la [página de archivos](https://nft.storage/files/). Lo necesitarás en el siguiente paso.

**¿Confundido?** Avísanos en el [Telegram de Panmoni](https://t.me/Panmoni/315). ¡Estamos listos para ayudarte con cualquier pregunta o duda!

<a name="heading-step-4-return-to-cashonize"></a>
### Paso 4. ¡Hora de acuñar!

Vuelve a [Cashonize.com](https://cashonize.com/); deberías seguir en la pestaña “CreateTokens”.

<a name="heading-a-create-your-minting-nft"></a>
#### (a) Crea tu NFT de acuñación

1. Despliega la sección que dice “Optionally link metadata to this token”.
2. Donde dice “Select which method to use:”, selecciona IPFS (recomendado).
3. Pega en el área de texto el CID de tu archivo BCMR.

Así se veía el formulario antes de enviarlo:
![](../../../assets/images/posts/tp2/Screenshot%202023-08-12%20at%204.51.17%20PM.png "Creando el NFT de acuñación")

Este es el mensaje de éxito:
![](../../../assets/images/posts/tp2/Screenshot%202023-08-12%20at%205.04.43%20PM.png "NFT de acuñación creado con éxito.")

Mira la transacción génesis en [Blockchair](https://blockchair.com/bitcoin-cash/transaction/b60397c8ad8f5286aca765449c973dd278691c743b31598a2a70f1b2e2af0af9). Esta es la `tokenData` relevante del nuevo **NFT de acuñación**. Fíjate en que dice que su `capability` es “minting”. Esto significa que puede crear más de la misma categoría y con cualquier `commitment` que quieras.

```json
      "tokenData": {
          "category": "792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2",
          "amount": "0",
          "nft": {
              "capability": "minting",
              "commitment": ""
          }
      }
```

Esta es la OP_RETURN con los metadatos BCMR, es decir, el `authhead` actual. Y como es la transacción génesis, siempre será el `authbase`, incluso después de que actualice el `authhead` cambiando algunos metadatos y actualizando el archivo en la cadena.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-12%20at%205.09.05%20PM.png)

En la billetera web Cashonize, haz clic en la pestaña “MyTokens” y ahí encontrarás tu **NFT de acuñación**. Haz clic en “info” para ver algunos de los metadatos de tu serie de NFTs.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-12%20at%205.14.02%20PM.png)

**¡Lo lograste!** ¡Buen trabajo! ¡Ahora a crear los NFTs hijos!

<a name="heading-b-create-your-immutable-child-nfts-"></a>
#### (b) Crea tus NFTs hijos inmutables

1. En Cashonize, en la página “MyTokens”, busca tu **NFT de acuñación** y haz clic en “mint NFTs” debajo de él.
2. Ingresa la cantidad de NFTs de tu serie, el número desde el que empiezas y una [dirección sin usar de tu billetera](/blog/token-pioneers-cashtokens-tutorial-1#1-install-electron-cash). Asegúrate de seleccionar la versión de la dirección compatible con tokens (empieza con “z”).
3. Haz clic en “Mint NFTs”.

Así se ve el mío:

![](../../../assets/images/posts/tp2/Screenshot%202023-08-12%20at%205.26.33%20PM.png)

Este es un ejemplo de mensaje de éxito de Cashonize:

![](../../../assets/images/posts/tp2/Screenshot%202023-08-12%20at%205.27.22%20PM.png)

Un próximo tutorial explicará cómo acuñar NFTs de forma programática y pondrá a disposición un script, para que no tengas que hacer esto a mano con tu propia colección.

<a name="heading-c-check-out-your-new-nfts"></a>
#### (c) ¡Mira tus nuevos NFTs!

1. Copia tu `category`, visita [explorer.salemkode.com](https://explorer.salemkode.com/) y pégalo en el cuadro de búsqueda. Haz clic en “Open token page” a la izquierda y ¡mira todos tus nuevos NFTs! Recórrelos y mira los valores de sus compromisos.
2. Toma el ID de la transacción más reciente de tu nuevo `category` de NFTs y pégalo en [Blockchair.com](https://blockchair.com/). Examina la transacción en bruto.

[Aquí está la mía](https://blockchair.com/bitcoin-cash/transaction/f9cde0d11929afa45a9699926e689acc579c270408bb29b22b3921b90379593a), que tiene 27 salidas. Aquí también está la [página de SalemKode](https://explorer.salemkode.com/token/792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2) de mi serie de NFTs. Y esta es la `tokenData` de uno de mis nuevos NFTs. Fíjate en que el valor `capability` es `none` (“Immutable”) y que el valor `commitment` corresponde al NFT #8 de mi serie, como puedes ver en el archivo de metadatos de arriba.

```json
            "tokenData": {
                "category": "792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2",
                "amount": "0",
                "nft": {
                    "capability": "none",
                    "commitment": "08"
                }
```

¡Buen trabajo! ¡Pero todavía no terminamos!

<a name="heading-d-secure-the-authbase"></a>
#### (d) Asegura el `authbase` 

[Como vimos en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#7-freeze-your-tokens-authbase), es importante mover tu `authbase` y luego asegurarlo para no perder el control de los metadatos de tu nueva serie de NFTs.

> **Nota:** mientras que el `authhead` es la actualización más reciente del `authchain` de una `category` dada, el `authbase` es la OP_RETURN donde definiste por primera vez los metadatos (BCMR) de tu token en la transacción génesis del token.

<a name="heading-e-oops-authupdatejs-to-the-rescue"></a>
#### (e) ¡Ups! ¡`authUpdate.js` al rescate!

Si, como yo, te equivocaste al escribir tu archivo BCMR, puedes corregir los errores gracias al nuevo y estupendo script [AuthUpdate](https://github.com/mr-zwets/AuthUpdate/tree/main) de [Mathieu Geukens](https://twitter.com/GeukensMathieu).

Si todo está perfecto en tus metadatos, ¡puedes saltarte este paso!

1. Sube tu archivo BCMR actualizado y corregido a IPFS (o donde prefieras) y copia su CID (no es posible editar archivos en IPFS).
2. Decide dónde quieres ejecutar el script. En mi caso, empezaré desde la carpeta personal de mi usuario sin privilegios en mi computadora con Ubuntu 23.04.
3. Descarga el repositorio de AuthUpdate: `git clone https://github.com/mr-zwets/AuthUpdate.git`.
4. Entra al repositorio git: `cd AuthUpdate`.
5.  Instala las dependencias (sobre todo [mainnet-js](https://mainnet.cash/)): `npm install`.
6.  Edita el script con tu editor de texto favorito: `vi authUpdate.js`.
	1. En la variable `tokenId`, ingresa el `category` de la serie de NFTs que quieres actualizar.
	2. Si tu nuevo archivo BCMR está alojado en un enlace https, ingresa ese enlace donde dice `bcmrURL`. Si usas IPFS, ingresa solo el CID en la variable `bcmrIpfsCID`. Completa solo una de estas dos variables.
	3. En la variable `seedphase`, ingresa el texto de tu frase semilla BIP39. Puedes copiarla de Electron Cash ([consulta el tutorial 1 para ver las instrucciones](/blog/token-pioneers-cashtokens-tutorial-1#1-install-electron-cash)). **¡Ten mucho cuidado de proteger tu frase semilla!**
	4. Si tu dirección con el `authbase` no está en el índice 0 de tu billetera, cambia el `derivationPathAddress` de “m/44'/145’/0’/0/0” a “m/44'/145’/0’/0/X”, donde X es el número de índice de la dirección en Electron Cash. [Consulta el tutorial 1 para más información sobre los índices de direcciones](/blog/token-pioneers-cashtokens-tutorial-1#2-open-cashonizecom).
7. Asegúrate de que la dirección `authbase` tenga UTXOs que sumen más de 1347 satoshis. Si no, simplemente envía suficientes satoshis a esa dirección.
8. Ejecuta `node authUpdate.js`.

<a name="heading-possible-errors"></a>
##### Posibles errores

Si no tienes suficientes BCH en esa dirección, puede que recibas un error como: `required: 1347n, available: 1000n`. Simplemente envía más satoshis a esa dirección.

Si usas una billetera o ingresas una ruta de derivación incorrecta, puede que recibas un error como este: `wallet does not hold the authority to update the metadata`. Revisa que tus variables sean correctas.

Cuando lo logres, recibirás un mensaje como este:

```text
wallet address: bitcoincash:qzmz2smphv3pt6yzxxpjc54ezxz006qw8ye57ulqzk
Bch amount in walletAddress is 0.00051bch or 51000sats
The authHead is the first output of the transaction with id 32c1bbc0a657cb7413d571cf43263d655bc38ae0b6f155353fa70e7e5f473a32
{
  txid: '32c1bbc0a657cb7413d571cf43263d655bc38ae0b6f155353fa70e7e5f473a32',
  vout: 0,
  satoshis: 1000,
  height: 0,
  token: undefined
}
Published Auth update in tx 32c1bbc0a657cb7413d5...7e5f473a32, returned Auth to bitcoincash:qzmz2smphv3pt6yzxxpjc54ezxz006qw8ye57ulqzk 
$https://explorer.bitcoinunlimited.info/tx/6632ec4e851b51aa02e8c9b8a272a8a30f3d5ac2bda76a4b874dab6ab7eeadcf
```

- `qzmz2smphv3pt6yzxxpjc54ezxz006qw8ye57ulqzk` es la dirección a la que transferí el `authbase` antes.
- `32c1bbc0a657cb7413d5...7e5f473a32` es la nueva transacción que hizo que se actualizara el `authhead`.
- Visita el enlace del [Bitcoin Unlimited Explorer](https://explorer.bitcoinunlimited.info/tx/6632ec4e851b51aa02e8c9b8a272a8a30f3d5ac2bda76a4b874dab6ab7eeadcf) para ver la transacción. Como puedes ver, la salida 1 es un OPRETURN y tiene un enlace de IPFS.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.07.10%20PM.png "La transacción de actualización del authhead de mi serie de NFTs.")

- También puedes ingresar tu `category` en el [explorador SalemKode](https://explorer.salemkode.com/). Debería mostrarte un símbolo verde para tu **AuthChain** abajo a la izquierda, y tus imágenes deberían aparecer con tus NFTs hijos.

> **Nota:** cuando termines, vuelve a editar `authUpdate.js` y borra tu frase semilla, o borra toda la carpeta en la que trabajaste. **¡Esto es importante para proteger la frase semilla de tu billetera!**

<a name="heading-step-5-send-some-nfts"></a>
### Paso 5. ¡Envía algunos NFTs!

Cashonize, [como se mencionó en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#2-open-cashonizecom), es una billetera de una sola dirección, así que veamos estos nuevos NFTs en un par de billeteras más.

<a name="heading-a-nfts-in-the-electron-cash-wallet"></a>
#### (a) NFTs en la billetera Electron Cash

En Electron Cash, puedo inspeccionar la transacción de acuñación y ver que mis NFTs están ahí con sus respectivos compromisos.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.21.59%20PM.png)

[Como se explicó en el tutorial 1](/blog/token-pioneers-cashtokens-tutorial-1#8-spend-some-tokens), puedes añadir manualmente los metadatos de tu serie de NFTs en tu billetera Electron Cash. Sin embargo, incluso en la pestaña CashTokens, por ahora no verás mucho más que esto en Electron Cash.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.26.27%20PM.png)

Enviemos el NFT # 15 a mi billetera Paytaca.

1. Ve a la pestaña CashTokens y haz clic derecho en el NFT que quieres enviar.
2. En la siguiente pantalla, pega tu dirección compatible con tokens de [tu billetera Paytaca](https://www.paytaca.com/#wallet) y asegúrate de seleccionar el NFT. Te recomiendo enviar 800 satoshis (0,000008 BCH) junto con el NFT para asegurarte de que se pueda volver a enviar.
3. Ahora previsualiza (Preview), firma (Sign) y transmite (Broadcast) la transacción.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.32.27%20PM.png "Enviando un NFT con Electron Cash")

Esta es [mi transacción](https://blockchair.com/bitcoin-cash/transaction/a062d89c743ccc2912a05474c481ae3e98e75d77d8e47ee6442f359c5810414e) en la que envié BCH Vision 2021 # 15. Y esta es la parte importante de las salidas, donde se ven los 800 satoshis y el `tokenData` del NFT.

```json
{
            "value": 0.000008,
            "n": 0,
            "scriptPubKey": {
                "asm": "OP_DUP OP_HASH160 df18b53126ca56807c3f7485b93c81d67415d4fc OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a914df18b53126ca56807c3f7485b93c81d67415d4fc88ac",
                "reqSigs": 1,
                "type": "pubkeyhash",
                "addresses": [
                    "bitcoincash:qr033df3ym99dqru8a6gtwfus8t8g9w5lsve42m0df"
                ]
            }
        },
        {
            "value": 0.000008,
            "n": 1,
            "scriptPubKey": {
                "asm": "OP_DUP OP_HASH160 df18b53126ca56807c3f7485b93c81d67415d4fc OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a914df18b53126ca56807c3f7485b93c81d67415d4fc88ac",
                "reqSigs": 1,
                "type": "pubkeyhash",
                "addresses": [
                    "bitcoincash:qr033df3ym99dqru8a6gtwfus8t8g9w5lsve42m0df"
                ]
            },
            "tokenData": {
                "category": "792eb291fee60820bc04fcdde48c73fa23a2a35756fe01c7164f5b5ce783f5f2",
                "amount": "0",
                "nft": {
                    "capability": "none",
                    "commitment": "0f"
                }
            }
        },
```

Como puedes ver, tiene un `commitment` de `0f` (15 en base 10) y tiene el `category` correcto.

<a name="heading-b-nfts-in-the-paytaca-wallet"></a>
#### (b) NFTs en la billetera Paytaca

En tu billetera Paytaca, haz clic en “Apps” en la fila inferior y luego en “Collectibles”. Tu NFT debería estar ahí. Este es el mío:

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.36.57%20PM.png "NFT en la billetera Paytaca")

Incluso se muestran los metadatos BCMR:

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.37.28%20PM.png "Metadatos del NFT en la billetera Paytaca")

![](../../../assets/images/posts/tp2/paytaca-attributes.png "Atributos del NFT en la billetera Paytaca")


> **Nota:** te recomiendo crear una **billetera nueva** para Paytaca, ya que a veces puede dar resultados inesperados con billeteras importadas.

<a name="heading-step-6-burn-the-minting-nft"></a>
### Paso 6. Quema el NFT de acuñación (opcional)

Si ya terminaste de acuñar tu serie, puedes ir a Cashonize > “MyTokens” y buscar tu **NFT de acuñación**. Donde dice “burn NFT”, haz clic. Asegúrate de hacer clic en el **NFT de acuñación** correcto. Cuando estés seguro de que no quieres acuñar más NFTs en esta `category`, haz clic en el botón rojo “burn NFT”. No hay forma de deshacer esta acción, así que tómate tu tiempo y quizá incluso déjalo para otro día.

![](../../../assets/images/posts/tp2/Screenshot%202023-08-14%20at%203.17.02%20PM.png "Cuadro de diálogo de éxito tras quemar el NFT de acuñación")

<a name="heading-step-7-build-community-trust-and-awareness"></a>
### Paso 7. Genera confianza y visibilidad en la comunidad

Para generar confianza en la comunidad, asegúrate de que tu serie de NFTs tenga un sitio web y de que los nuevos compradores puedan encontrar fácilmente en la página principal el `category` de tu serie de NFTs.

Para dar visibilidad a tu nueva serie de NFTs, tuitea sobre ella y etiqueta a **@BitcoinCashSite** para que pueda retuitearte.

<a name="heading-bonus-grab-your-bch-vision-nfts"></a>
### Extra: ¡consigue tus NFTs BCH Vision!

¿Quieres uno de la serie de NFTs BCH Vision? [Los estoy regalando GRATIS](https://www.dropbox.com/scl/fo/rfrgos6pdlcvvto5oripx/h?rlkey=x610g076rej4xky6sqx7uoq3w&dl=0) a quienes publiquen primero su dirección compatible con tokens en [este hilo de r/cashtokens](https://redd.it/15rv8ml).

Puede que tengas que esperar 24 horas para recibirlos, ya que primero los pongo a disposición de algunos de mis mayores financiadores. 

Si consigues uno, prueba a ponerlo a la venta en [tapswap.cash](https://tapswap.cash/). ¿Quién sabe? ¡Puede pasar cualquier cosa!

<a name="earn-xrbf"></a>
### ¡Gana XRBF!

¡Aprovecha todas las tareas de aprendizaje de esta serie para ganar algo de XRBF mientras construyes tu perfil de desarrollador de BCH! 

XRBF es uno de los tokens fungibles de CashTokens más destacados y con mejor rendimiento. En el futuro, quienes tengan XRBF podrían formar una DAO para apoyar la misión de [Real Bitcoin Fam](https://RealBitcoinFam.com) de atraer y apoyar a nuevos desarrolladores de BCH.

- Tutorial 1: gana hasta 110 XRBF.
- Tutorial 2: gana hasta 1000 XRBF creando un NFT. 

Comparte tu trabajo en el grupo de [Telegram de Panmoni](https://t.me/Panmoni/315) ¡y te ayudaremos a conseguir los XRBF que mereces!

<a name="heading-next"></a>
## Lo que sigue

¡Vienen muchos más tutoriales! [Vota aquí](https://twitter.com/BitcoinCashSite/status/1689381586016313344) por tus temas de tutorial favoritos.

<a name="heading-support-the-token-pioneers-tutorial-series"></a>
## Apoya la serie de tutoriales “Token Pioneers”

¿Quieres más tutoriales? Acepto donaciones para financiar este trabajo fundamental de enseñar a nuevos desarrolladores de BCH a crear dapps sin permisos e imparables con Cash Tokens en Bitcoin Cash.

Dirección de BCH:
[bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8](bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8)

Dirección compatible con tokens: [bitcoincash:zz3pxmwda8gd42wa8k9yfxcwhcaapeuhyg4j59kny5](bitcoincash:zz3pxmwda8gd42wa8k9yfxcwhcaapeuhyg4j59kny5)

[tipb.ch/bitcoincashsite](https://tipb.ch/bitcoincashsite)

<a name="heading-community-love-included"></a>
### ¡Con cariño de la comunidad incluido! 

Por cada donación de 2 BCH en apoyo de esta serie de tutoriales, puedes elegir 1 tutorial o video de marketing para patrocinar. Los patrocinadores reciben una mención con texto e imagen dentro del entregable, dentro de límites razonables.

También estoy trabajando en más de 68 videos tutoriales cortos adicionales ([ejemplos 1](https://www.youtube.com/playlist?list=PLfCBnMrjKRClnfdFU86KhlbuyBCkbgo6m), [2](https://www.youtube.com/playlist?list=PLfCBnMrjKRCnQ6jh4Sb4g5Njw0dVaIiLY)) además de lo mencionado en el [flipstarter de Token Pioneers](https://archive.li/UznMe), y también se pueden patrocinar a razón de 0,25 BCH por video (negociable). En estos videos puedes influir en el contenido. Incluso puedo hacer tutoriales sobre tu producto, servicio o proyecto.

Los entregables patrocinados se asignan por orden de llegada. Si quieres aprovechar esta oferta, [completa este formulario](https://panmoni.zapier.app/sign-up).

<a name="heading-thank-you"></a>
### Gracias

Gracias a [toorik](https://twitter.com/toorik), anónimo, William Patrick, S0me_N0b0dy y na por su apoyo al [flipstarter](https://archive.li/UznMe) que hace posible esta serie de tutoriales “Token Pioneers”. Visita [BitcoinCashSite.com/about](/about) para ver la lista completa de más de 55 miembros de la comunidad que han financiado mi trabajo desde 2019.

Gracias también a los creadores de herramientas importantes, sin las cuales este tutorial habría sido mucho más difícil de crear, y quizá imposible:

- Mathieu Geukens (Cashonize, authUpdate.js, BCMR Generator)
- Paytaca (billetera, indexador BCMR)
- Jason Dreyzehner (CashTokens, el estándar BCMR, otr.cash, Chaingraph)
- mainnet_pat (mainnet.js, tapswap.cash)
- Electron Cash
- El explorador SalemKode, de Salem Shamakh
- Emerald DAO, de BitcoinCashAutist
- Blockchair.com
- El explorador de BU
- BCH Gurus
- nft.storage
- tbch.googol.cash 
- los mineros de Chipnet

Si me olvidé de alguien, ¡avísame!

<a name="heading-your-feedback-matters"></a>
## Tu opinión importa

Después de que este tutorial pase por algunas revisiones y comentarios de la comunidad, publicaré un video que lo acompañe. Tus comentarios e ideas son importantes para mí. Escríbeme cuando quieras. Envía un correo a [george@panmoni.com](mailto:george@panmoni.com) o [únete al canal de Telegram de Panmoni](https://t.me/Panmoni/315).
