---
publishDate: 2023-12-30T00:00:00.000Z
title: Crear un boleto NFT y un canario de orden judicial con NFTs parseables de CashTokens (tutorial 4 de Token Pioneers)
description: En este cuarto tutorial de la serie Token Pioneers, vamos a analizar a fondo los mágicos NFTs parseables de CashTokens.
excerpt: En este cuarto tutorial de la serie Token Pioneers, vamos a analizar a fondo los mágicos NFTs parseables de CashTokens.
image: ~/assets/images/blog/token-pioneers-4.png
category: Tutorial
tags:
  - cashtokens
  - token pioneers
  - parsable NFTs
metadata:
  title: 'NFTs parseables: boletos y canarios de orden judicial en BCH'
translation:
  sourceHash: e50d852e4fa675ab
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Índice

- [Introducción](#intro)
- [Qué son los NFTs parseables](#what-are-parsable-nfts)
  - [Donde ocurre la magia](#where-the-magic-happens)
  - [A la altura de los contratos inteligentes de Ethereum](#rivaling-ethereum-smart-contracts)
  - [Los NFTs parseables sí escalan](#parsable-nfts-actually-scale)
  - [Ejemplo de NFT parseable](#parsable-nft-example)
    - [Campos](#fields)
    - [Parse.Types](#parsetypes)
    - [Parse.Bytecode](#parsebytecode)
      - [BCH Script](#bch-script)
      - [Análisis del bytecode del BCMR de ejemplo](#analyzing-the-example-bcmrs-bytecode)
      - [Cómo funcionan las pilas](#see-how-the-stacks-work)
      - [Orden de los elementos en la altstack](#order-of-items-on-the-altstack)
      - [El bytecode parsea el campo de compromiso del NFT parseable](#the-bytecode-parses-the-parsable-nft-commitment-field)
      - [Más análisis de bytecode](#more-bytecode-analysis)
      - [Una transacción BCH cualquiera](#a-random-bch-transaction)
      - [Bytecode de NFTs secuenciales](#sequential-nft-bytecode)
  - [Cuándo poner datos en la cadena](#when-to-put-data-on-chain)
    - [Matriz de decisión](#decision-matrix)
- [Crear con NFTs parseables](#building-with-parsable-nfts)
  - [1. Crear un boleto NFT básico](#1-build-a-basic-nft-ticket)
    - [21 de octubre de 1980](#october-21-1980)
    - [Diseñar el boleto](#designing-the-ticket)
    - [Borrador de BCMR](#draft-bcmr)
    - [Planificar el compromiso](#planning-the-commitment)
      - [Tipo 04](#type-04)
      - [Tipo 07](#type-07)
      - [Todos los demás tipos](#all-other-types)
        - [Notas](#notes)
    - [Escribir el bytecode](#writing-the-bytecode)
      - [1. Apilar el compromiso.](#1-push-the-commitment)
      - [2. Separar el tipo](#2-split-off-the-type)
      - [3. Si es de tipo 04](#3-if-it-is-type-04)
      - [4. Obtener seatLocation](#4-get-seatlocation)
      - [5. Queda dateTime](#5-datetime-is-left)
      - [6. Si es de tipo 07](#6-if-it-is-type-07)
      - [7. Si es de cualquier otro tipo](#7-if-it-is-any-other-type)
      - [8. Cerrar el if-else](#8-end-the-if-else)
      - [9. Limpiar la pila](#9-clean-up-the-stack)
      - [El script completo](#the-complete-script)
      - [Convertir el script a bytecode](#convert-the-script-to-bytecode)
    - [Crear el NFT de acuñación en Chipnet](#create-minting-nft-on-chipnet)
    - [Crear el boleto en la red principal](#create-ticket-on-mainnet)
    - [¿Una dapp Web3 de venta de boletos completa?](#full-featured-web3-ticketing-dapp)
    - [El límite de 40 bytes del compromiso](#the-40-byte-commitment-limit)
    - [TAREA: crea tu boleto NFT por 10.000 XRBF](#task-create-your-ticket-nft-for-10000-xrbf)
  - [2. Crear un canario de orden judicial con BCMR](#2-create-a-warrant-canary-with-bcmr)
    - [Crear el mensaje](#create-the-message)
    - [Compromiso del NFT ](#nft-commitment)
    - [Escribir el BCMR](#write-the-bcmr)
    - [Crear el NFT](#create-the-nft)
    - [Actualizaciones periódicas](#regular-updates)
    - [¿Una dapp Web3 de canario de orden judicial completa?](#full-featured-web3-warrant-canary-dapp)
    - [TAREA: envía tu canario de orden judicial por 15.000 XRBF](#task-submit-your-warrant-canary-for-15000-xrbf)
- [Conclusión](#conclusion)
  - [Próximos pasos para desarrolladores y entusiastas](#next-steps-for-builders-and-enthusiasts)
  - [Apoya la serie de tutoriales](#support-the-tutorial-series)
  - [Gracias](#thank-you)
- [Recursos adicionales para desarrolladores](#additional-builder-resources)

<!-- TOC end -->

<!-- TOC --><a name="intro"></a>

## Introducción

Hasta ahora, en la serie de tutoriales _Token Pioneers_ hemos hablado de [tokens fungibles (FTs)](/blog/token-pioneers-cashtokens-tutorial-1), [NFTs (secuenciales)](/blog/token-pioneers-cashtokens-tutorial-2) y [BCMRs](/blog/token-pioneers-cashtokens-tutorial-3). Ahora nos vamos a centrar en el elemento más interesante, versátil y, de hecho, _mágico_ de CashTokens: los **NFTs parseables**.

Al final de este tutorial entenderás cómo funcionan los NFTs parseables, tanto en la cadena como en los BCMRs, y algunos conceptos básicos de BCH Script, y crearás dos proyectos con NFTs parseables.

Este tutorial es adecuado para desarrolladores, artistas y nuevos creadores con ganas de entender los contratos inteligentes más escalables del mundo cripto.

Conviene hacer los tutoriales anteriores de la [serie Token Pioneers](/tag/token-pioneers) antes de empezar este, aunque no es estrictamente necesario.

<!-- TOC --><a name="what-are-parsable-nfts"></a>

## Qué son los NFTs parseables

Como [se mencionó en el tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#nft-metadata), en la [especificación de CashTokens](https://cashtokens.org/docs/bcmr/chip/#associating-information-with-nfts) hay 2 tipos de NFTs: **secuenciales** y **parseables**. La diferencia entre estos dos tipos de NFT gira por completo en torno a los datos que metes en el campo `commitment` del NFT en la cadena.

Los **NFTs secuenciales** solo tienen números en el campo `commitment` y son adecuados para series de NFTs convencionales y numeradas, como [BCH Guru](https://bch.guru) y [Cash Ninjas](https://ninjas.cash/). Los NFTs secuenciales son muy simples, al menos en lo que respecta a sus campos `commitment`, y puedes ver un ejemplo en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#c-check-out-your-new-nfts).

Los **NFTs parseables**, en cambio, codifican datos en campos que define quien los crea, dentro del campo `commitment`. Sí, así es: ¡un campo que tiene campos! Y tú, oh gran maestro creador, ¡eres quien define esos campos!

¡No te preocupes! Esto quedará más claro a medida que avancemos, lo prometo.

El BCMR correspondiente a los NFTs parseables sirve para dar la clave de esos campos. Los datos del BCMR de un NFT parseable son como el **encabezado** de una hoja de cálculo, y el campo `commitment` del NFT parseable contiene la **fila de datos** correspondiente.

<!-- TOC --><a name="where-the-magic-happens"></a>

### Donde ocurre la magia

Los NFTs parseables son donde ocurre la **magia profunda** de CashTokens.

Los NFTs parseables son como pequeñas filas de datos de una hoja de cálculo en la cadena, guardadas en el campo `commitment` del NFT. Pueden conservar el estado local (es decir, el valor actual de alguna variable de una dapp en la cadena, o de más de una) y permiten que los contratos inteligentes de BCH se comuniquen entre sí.

¡Esto es enorme!

<!-- TOC --><a name="rivaling-ethereum-smart-contracts"></a>

### A la altura de los contratos inteligentes de Ethereum

De hecho, así es como BCH tiene ahora una funcionalidad de contratos inteligentes que compite con la de Ethereum, sin dejar de ser escalable, a diferencia de Ethereum.

Se pueden extraer datos detallados de estos NFTs parseables para que luego los usen distintas aplicaciones. Los archivos BCMR funcionan junto con los datos en la cadena para que clientes, billeteras, plataformas, etc. puedan decodificar el significado (como el encabezado de una hoja de cálculo) de los campos de estas pequeñas filas de datos que llamamos NFTs parseables.

<!-- TOC --><a name="parsable-nfts-actually-scale"></a>

### Los NFTs parseables sí escalan

¡No son los JPEG graciosos de tu abuelo! Los NFTs parseables de BCH se pueden poner a trabajar en tus casos de uso Web3 complejos. Y, algo único, ¡escalan! ¿Ya lo había mencionado?

Los NFTs parseables solo pueden contener hasta 40 bytes de datos de `commitment`, pero aun así se puede hacer mucho con eso, y esta cantidad podría aumentar en el futuro.

Los NFTs parseables también cuestan más que los secuenciales en comisiones de transacción y en valores de salidas de polvo (dust) (porque contienen más datos y, por tanto, necesitan más espacio en el bloque). Pero las comisiones de transacción de BCH ya son tan bajas que quizá ni lo notes.

Y los NFTs parseables se pueden seguir [ampliando](/blog/token-pioneers-cashtokens-tutorial-2#bch-guru-metadata) con [metadatos de BCMR](/blog/token-pioneers-cashtokens-tutorial-3#1-bcmr-json-schema) fuera de la cadena, igual que los [NFTs secuenciales](/blog/token-pioneers-cashtokens-tutorial-2) que te he mostrado en esta serie.

<!-- TOC --><a name="parsable-nft-example"></a>

### Ejemplo de NFT parseable

Aquí tienes un [ejemplo sencillo de NFT parseable](https://github.com/bitjson/chip-bcmr/blob/master/examples/decentralized-application.json) del [BCMR CHIP](https://github.com/bitjson/chip-bcmr) de [Jason Dreyzehner](https://twitter.com/bitjson). ¡Analicémoslo!

```json
            "fields": {
              "pledgeValue": {
                "name": "Pledge Value",
                "description": "The value pledged to the campaign in Bitcoin Cash.\n\nThis example demonstrates the additional capabilities of the 'number' encoding; clients are informed that pledge value can be aggregated (by addition) in views containing multiple NFTs to provide useful information to the user. For example, if the wallet holds two NFTs with Pledge Values of 123456 and 654321, the wallet can display a total of the user's pledges to this campaign: 0.00777777 BCH.",
                "encoding": {
                  "type": "number",
                  "aggregate": "add",
                  "decimals": 8,
                  "unit": "BCH"
                }
              }
            },
            "parse": {
              "bytecode": "006b00cf6b",
              "types": {
                "": {
                  "name": "Pledge Receipt",
                  "description": "An NFT of this category with a zero-length on-chain commitment (VM number 0). Where appropriate, user interfaces may display the ticker symbol of NFTs matching this type as CFC2023XAMPL-0.\n\nPledge Receipts are the only type of NFT demonstrated in this example, and they contain only one field: pledgeValue.",
                  "fields": ["pledgeValue"],
                  "uris": {
                    "icon": "ipfs://bafybeihnmh5bkbaspp3xfdanje74pekhsklhobzzraeyywq6gcpb3iuvey/0.svg",
                    "web": "https://example.com/campaign",
                    "custom-uri-identifier": "protocol://data-for-some-protocol"
                  }
                }
              }
```

<!-- TOC --><a name="fields"></a>

#### Campos

```json
            "fields": {
              "pledgeValue": {
                "name": "Pledge Value",
                "description": "The value pledged to the campaign...",
                "encoding": {
                  "type": "number",
                  "aggregate": "add",
                  "decimals": 8,
                  "unit": "BCH"
                }
              }
            },
```

Este BCMR tiene una propiedad `fields` que es hija del objeto `nfts`. Aquí es donde se _definen_ los campos de esta serie de NFTs parseables. Igual que los `tags` se [definen](/blog/token-pioneers-cashtokens-tutorial-3#key-components-of-the-bcmr-schema) en el nivel superior del archivo pero en realidad se usan dentro de las identidades, los campos primero se _definen_ y luego se _asignan_.

Se proporciona la definición de un campo: `pledgeValue`.

La definición de `pledgeValue` tiene una subpropiedad llamada `encoding`. En este ejemplo, `pledgeValue` es un número con hasta 8 decimales y es una unidad de BCH. Además, cuando hay varios NFTs parseables de este tipo en 1 billetera, sus valores de `pledgeValue` se pueden sumar sin problema para representar el total prometido a una campaña determinada: ese es el significado de la propiedad `aggregate`.

En términos de nuestra analogía con la hoja de cálculo, esto significa que tienes una hoja de cálculo con una columna titulada “pledgeValue”. Hay tantas filas de datos en esta columna como NFTs en esta serie. Cada NFT parseable de este tipo bajo esta identidad es una fila nueva en esa hoja de cálculo metafórica.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-26%20at%202.45.52%20PM.png)

<!-- TOC --><a name="parsetypes"></a>

#### Parse.Types

```json
            "parse": {
              "types": {
                "": {
                  "name": "Pledge Receipt",
                  "description": "...",
                  "fields": ["pledgeValue"],
                }
              }
            }
```

El objeto `parse` está al mismo nivel que `fields`. En `parse.types` encontramos un tipo, llamado Pledge Receipt.

Compáralo con los metadatos de NFTs secuenciales que vimos en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#bch-guru-metadata) de la serie de NFTs BCH Gurus. Allí, en un NFT secuencial, cada NFT único (“jpeg”) es su propio tipo, numerado en serie.

Sin embargo, en este NFT parseable de ejemplo, el campo de identificador de tipo está vacío. Esto equivale en la práctica a un valor de cero. Como probablemente habrás notado, en programación mucha numeración empieza desde cero. Y en este ejemplo solo hay un NFT parseable, así que solo hay un tipo. Por eso el campo puede estar vacío. Pledge Receipt es el único tipo, o el tipo predeterminado.

Arriba se _definían_ los campos. Aquí, un campo se _asigna_ a un tipo. Pledge Receipt tiene un campo, `pledgeValue`.

`"fields": ["pledgeValue"],`

Para el tipo de NFT Pledge Receipt puede haber cualquier número de instancias, cada una con un `pledgeValue` potencialmente distinto. O incluso con valores idénticos en este campo.

Puedes pensar en cada tipo como su propia hoja de cálculo. El tipo es la hoja de cálculo, los campos BCMR asignados forman el encabezado y los NFTs individuales son las filas de datos.

<!-- TOC --><a name="parsebytecode"></a>

#### Parse.Bytecode

```json
            "parse": {
              "bytecode": "006b00cf6b",
              ...
            }
```

El `bytecode` puede parecer indescifrable al principio. ¡A mí sin duda me lo pareció! Pero no te preocupes: se decodifica fácilmente desde hexadecimal y pronto te quedará muy claro.

El propósito del `bytecode` es parsear y clasificar los NFTs de la identidad dada. En realidad es un script codificado en hexadecimal que se ejecuta en la máquina virtual (VM) de BCH. Este script descompone el `commitment` del NFT en la cadena de un UTXO dado en sus partes constituyentes:

1. Primero, el tipo de NFT.
2. Después, los campos del NFT.

<!-- TOC --><a name="bch-script"></a>

##### BCH Script

El campo `parse.bytecode` es interesante y nos lleva a [BCH Script](https://documentation.cash/protocol/blockchain/script.html), es decir, a los [opcodes (códigos de operación)](https://documentation.cash/protocol/blockchain/script.html#operation-codes-opcodes).

BCH Script es una parte fundamental de la blockchain (cadena de bloques) de BCH y se usa en todas sus operaciones. De hecho, no es del todo cierto que _tú y yo_ gastemos nuestros BCH: solo los scripts de BCH pueden gastar BCH. Nosotros solo aportamos las claves.

Toda transacción usa scripts para procesarla y validarla. Toda transacción requiere (a) un script de bloqueo que protege los fondos y (b) un script de desbloqueo que cumple las condiciones fijadas por el script de bloqueo para gastar los fondos.

BCH Script en sí es un lenguaje de scripting engañosamente simple. Está [basado en pilas](https://www.youtube.com/watch?v=1SWr7q121gc) y se parece a [Forth](<https://en.wikipedia.org/wiki/Forth_(programming_language)>), un lenguaje que apareció por primera vez hace más de 50 años.

Los scripts de BCH se construyen a partir de un conjunto de códigos de operación, u **opcodes**. Estos opcodes son funciones simples. En términos generales, también puedes verlos como verbos. Ejecutan acciones en el contexto de las transacciones de BCH.

Una pila es una estructura de datos simple que puedes imaginar como una caja alta y estrecha. Llénala de platos. El plato que entró primero en la caja sale último (FILO). El plato que entró último sale primero ([LIFO](<https://en.wikipedia.org/wiki/Stack_(abstract_data_type)>)).

Cuando metemos datos en una pila, lo llamamos **push**. Cuando sacamos datos de una pila, lo llamamos **pop**.

En BCH Script hay dos [pilas](https://www.youtube.com/watch?v=1SWr7q121gc): la **pila principal** y la pila alternativa (**altstack**).

1. La **pila principal** es la estructura principal para ejecutar scripts, donde ocurren la mayoría de las operaciones: apilar, desapilar, cálculos, evaluar condiciones de covenant (un contrato que limita cómo se pueden gastar las monedas), etc.
2. La **altstack** sirve como pila auxiliar. Permite almacenar datos temporalmente por separado de la pila principal, lo que puede ser útil en operaciones de script complejas. Poder mover datos entre estas dos pilas aumenta la flexibilidad y la funcionalidad de la ejecución de scripts.

BCH Script es un tema importante. Si quieres un tutorial completo de BCH Script, avísame con un [tuit](https://twitter.com/georgedonnelly).

Aunque al principio el bytecode puede parecer intimidante, recuerda que cualquier tema se puede descomponer en sus partes y explicarse con claridad, sobre todo en un sistema tan eficiente como Bitcoin. ¡Esto quedará claro, y rápido!

<!-- TOC --><a name="analyzing-the-example-bcmrs-bytecode"></a>

##### Análisis del bytecode del BCMR de ejemplo

En nuestro ejemplo, el `parse.bytecode` tiene el valor `006b00cf6b`. Esto es [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal). Los opcodes de BCH Script se pueden traducir a hexadecimal para facilitar su uso en la blockchain. Hay una [tabla de traducción](https://documentation.cash/protocol/blockchain/script.html#operation-codes-opcodes) para esto en el excelente [documentation.cash](https://documentation.cash/).

[![](../../../assets/images/posts/tp4/Screenshot%202023-12-27%20at%209.00.39%20AM.png)](https://documentation.cash/protocol/blockchain/script.html#operation-codes-opcodes)

Dividamos la cadena de bytecode `006b00cf6b` en segmentos de dos caracteres, empezando por la izquierda. Es decir, `00`, `6b`, `00`, `cf` y `6b`.

1. `00`: este opcode es `OP_0`. Apila un arreglo vacío (un arreglo de bytes de longitud cero). En muchos scripts de Bitcoin Cash, `OP_0` se usa para representar un valor “falso” o para poner un elemento de relleno en la pila.

2. `6b`: este opcode es `OP_TOALTSTACK`. Mueve el elemento superior de la pila (principal) a la pila alternativa (o altstack). En este caso, movería a la altstack el arreglo vacío apilado por `OP_0`.

3. `00`: otro `OP_0`, que apila un segundo arreglo vacío en la pila principal.

4. `cf`: este opcode es `OP_UTXOTOKENCOMMITMENT`. Saca el elemento superior de la pila y lo trata como un **índice de entrada**. Es decir, este opcode verá el cero del paso 3 y lo usará para seleccionar la primera entrada de la transacción (aunque el contexto en el que estamos no es una transacción real). Luego apilará el valor del campo `commitment` de ese [UTXO](/blog/token-pioneers-cashtokens-tutorial-1#a-quick-intro-to-how-bitcoin-transactions-work) (si lo tiene). Si no hay ningún NFT en el UTXO o el campo `commitment` está vacío, apilará un cero.

5. `6b`: de nuevo, `OP_TOALTSTACK`. Esto mueve los datos de compromiso del UTXO de la pila (principal) a la altstack.

Con esto en mente, ya sabemos que la cadena de bytecode `006b00cf6b` se traduce en este BCH Script (es decir, esta secuencia de opcodes):

`OP_0 OP_TOALTSTACK OP_0 OP_UTXOTOKENCOMMITMENT OP_TOALTSTACK`

<!-- TOC --><a name="see-how-the-stacks-work"></a>

##### Cómo funcionan las pilas

Para ver mejor cómo funcionan las pilas, visita [ide.bitauth.com](https://ide.bitauth.com/). El BitAuth IDE es como cualquier otro IDE, por ejemplo VSCode o Atom. ¡Solo que este te permite jugar con BCH Script!

Puede parecer difícil ahora, ¡pero te prometo que se vuelve más fácil!

En el [BitAuth IDE](https://ide.bitauth.com/), donde dice “Choose a template to begin”, selecciona **“Scratch Pad”**. Arriba a la derecha, en “Editor Mode”, selecciona **“BCH CHIPs VM”**.

Borra el código que venía precargado y reemplázalo por lo siguiente:

```
OP_0
OP_TOALTSTACK
OP_0
OP_UTXOTOKENCOMMITMENT
OP_TOALTSTACK
```

Si te fijas bien, es la misma secuencia de opcodes que decodificamos a partir del BCMR `bytecode` del NFT parseable, con valor `006b00cf6b`. Solo que ahora cada opcode está en su propia línea. Así es más fácil visualizar las operaciones de la pila.

La ventana de tu IDE debería verse así:

![](../../../assets/images/posts/tp4/Screenshot%202023-12-27%20at%2012.46.07%20PM.png)

Esto es lo que pasa, paso a paso:

1. En el paso 1, apilamos un cero en la pila (principal). En el BCMR del NFT parseado de ejemplo de arriba, esto se apila para indicar el `type` del NFT. Si vuelves a mirar el ejemplo, solo hay un tipo de NFT, numerado en la práctica como cero. Así que este cero representa eso. También se puede considerar un tipo predeterminado, que por tanto no necesita un identificador de tipo específico. Si hay más de un tipo, normalmente esperaríamos que el identificador de tipo fuera el primer valor del `commitment`, y no que se añadiera manualmente así.
2. En el paso 2, pasamos el elemento superior de la pila (principal) a la altstack. Así que desaparece de la pila (principal).
3. En el paso 3, volvemos a apilar un cero. Lo usaremos como **índice de entrada** en el siguiente paso.
4. En el paso 4, usamos (y consumimos) el 0 que quedó en la parte superior de la pila en el paso anterior para tomar la primera entrada de la transacción. Este opcode (`OP_UTXOTOKENCOMMITMENT`) tomará entonces el valor del campo `commitment` del UTXO de la primera entrada y lo apilará. En este caso no estamos trabajando con un UTXO concreto, así que este opcode devuelve un cero. Sin embargo, si aquí trabajáramos con un NFT real, apilaría el valor prometido en BCH del `commitment` del NFT en lugar del cero. Funciona así de simple porque solo hay un campo.
5. En el último paso, volvemos a pasar el valor superior de la pila a la altstack.

Al final, la pila (principal) queda vacía. Esto es importante, ya que los datos de la pila los procesan los scripts de bloqueo y desbloqueo. Si quedan datos en la altstack al final de una transacción, se ignoran.

Ahora haz clic donde dice **“Stack”**, a la derecha de **“Scratch Pad”**, y el IDE pasará de mostrarte la pila (principal) a mostrarte la **altstack**.

La ventana de tu IDE ahora debería verse así:

![](../../../assets/images/posts/tp4/Screenshot%202023-12-27%20at%2012.53.29%20PM.png)

Esto es lo que pasa con la altstack, paso a paso:

1. En el paso 1, la altstack está vacía porque el valor cero está en la pila (principal).
2. En el paso 2, vemos que el cero (que representa el tipo de NFT) se ha pasado a la altstack.
3. En los pasos 3 y 4 no hay cambios, porque la actividad ocurre en la pila.
4. En el último paso, hay un cero en la base de la altstack (que representa el tipo de NFT) y una cantidad de BCH (`pledgeValue`) encima. Como trabajamos sin un UTXO de NFT concreto, `OP_UTXOTOKENCOMMITMENT` devuelve un cero, y ese cero está en la parte superior de la pila.

El resultado de procesar el `bytecode` (script) de `006b00cf6b` es que la altstack termina con dos elementos:

1. **En la base**: un arreglo de bytes vacío (del primer `OP_0` y `OP_TOALTSTACK`), que representa el tipo de NFT predeterminado.
2. **Encima**: una cantidad de BCH que es el valor del único campo del NFT (`pledgeValue`), que procede de ejecutar `OP_UTXOTOKENCOMMITMENT`.

**Nota:** en BitAuth IDE, la base de la pila está a la izquierda y la parte superior a la derecha.

<!-- TOC --><a name="order-of-items-on-the-altstack"></a>

##### Orden de los elementos en la altstack

El estándar BCMR espera que el script `bytecode` cree una altstack donde el identificador de tipo del NFT esté en la base de la pila (a la izquierda en BitAuth IDE) y después vengan los valores de los campos del NFT.

Esta es una forma de concebir lo que un `bytecode` totalmente procesado debería producir en la altstack.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-27%20at%2011.44.24%20AM.png)

Así que el script `bytecode` tiene que devolver los datos de abajo arriba, con el identificador de tipo primero (en la base) y después la lista de valores de los campos del NFT.

El BCMR es la clave para decodificar todo esto en aplicaciones cliente, billeteras, etc., que interactúan con la blockchain y muestran a los usuarios sus activos de forma legible.

Así lo explica el [esquema raíz de BCMR](/blog/token-pioneers-cashtokens-tutorial-3#1-bcmr-json-schema):

> Cuando la evaluación del parseo tiene éxito, el elemento de la base de la altstack indica el tipo de NFT coincidente, y los demás elementos de la altstack representan el contenido de los campos del NFT en el orden indicado (donde `fields[0]` es el segundo elemento desde la base y el último elemento de `fields` es la parte superior de la altstack). (traducción nuestra)

<!-- TOC --><a name="the-bytecode-parses-the-parsable-nft-commitment-field"></a>

##### El bytecode parsea el campo de compromiso del NFT parseable

Quizá te preguntes por qué todo se pasó a la altstack. Simplemente porque el [estándar BCMR establece](https://cashtokens.org/docs/bcmr/chip/#parsable-nfts) que el script `bytecode` debe pasar estos datos a la altstack.

A partir de ahí, las billeteras y otras aplicaciones que necesitan mostrar los detalles del NFT pueden tomar los datos y darles formato o manipularlos como corresponda.

El propósito del script `bytecode` en el BCMR correspondiente es simplemente servir de clave que desbloquea el formato de los datos del `commitment` del NFT, los coloca en un orden concreto y los deja en la altstack.

Este proceso permite a un sistema blockchain tomar un NFT, procesarlo con un script predefinido y determinar tanto su tipo como los distintos atributos o metadatos que contiene, según cómo queden ordenados los datos en la altstack tras ejecutar el script. Esto hace posible crear NFTs que son más que simples tokens únicos: pueden llevar diversos datos, lo que los hace adecuados para aplicaciones más complejas.

Este tipo de parseo permite manejar los NFTs de forma flexible y potente en la blockchain de Bitcoin Cash, y que los scripts los clasifiquen y procesen según sus datos en la cadena.

<!-- TOC --><a name="more-bytecode-analysis"></a>

##### Más análisis de bytecode

El bytecode `76a914e11bc0b45edb8c7caca8b63f4d02eca619dbc23088ac` representa un script conocido comúnmente como Pay-to-Public-Key-Hash (P2PKH). Este script se usa mucho en las transacciones estándar de BCH. Este es el desglose de sus componentes:

1. **76 (OP_DUP)**: esta operación duplica el elemento superior de la pila. En los scripts de transacción, se suele usar para duplicar el hash de la clave pública.

2. **a9 (OP_HASH160)**: toma el elemento superior de la pila (que ahora es el hash de la clave pública duplicado), lo hashea con el algoritmo SHA-256 y luego vuelve a hashear el resultado con el algoritmo RIPEMD-160.

3. **14**: es una operación de push que pone los siguientes 20 bytes en la pila. Los 20 bytes que siguen a este opcode representan el hash de la clave pública (también conocido como la dirección Bitcoin en forma hasheada). (`14` en hexadecimal es `20` en decimal. [Compruébalo aquí](https://www.rapidtables.com/convert/number/hex-to-decimal.html).)

4. **e11bc0b45edb8c7caca8b63f4d02eca619dbc230**: es el hash de la clave pública. Es el hash de la clave pública de la dirección Bitcoin del destinatario. En una transacción real, este hash corresponde a la dirección a la que se envían los bitcoins.

5. **88 (OP_EQUALVERIFY)**: esta operación comprueba si los dos elementos superiores de la pila son iguales. Si no lo son, el script falla. Se usa para verificar que el hash de la clave pública proporcionado coincide con el hash del script de bloqueo.

6. **ac (OP_CHECKSIG)**: comprueba la firma de la transacción con la clave pública. Si la firma es válida, el script se ejecuta con éxito y la transacción puede incluirse en un bloque.

En pocas palabras, este script se usa en una transacción BCH para verificar que la persona que intenta gastar los bitcoins es realmente su dueña. Exige a quien gasta que proporcione una clave pública cuyo hash coincida con el hash de clave pública indicado, junto con una firma válida que demuestre que posee la clave privada correspondiente. Esta estructura de script es fundamental para garantizar la seguridad y la propiedad en las transacciones de Bitcoin.

<!-- TOC --><a name="a-random-bch-transaction"></a>

##### Una transacción BCH cualquiera

Veamos una transacción BCH cualquiera. Adelante, repite este ejercicio para aprender por tu cuenta.

1. Visita [explorer.bitcoinunlimited.info](https://explorer.bitcoinunlimited.info/).
2. Haz clic en el bloque más reciente, o en cualquiera.
3. Haz clic en la transacción 1.
4. Haz clic en la pestaña **Scripts**.
5. Copia el script de la salida 0. En mi caso, es este:

```
OP_DUP OP_HASH160 8d5e5fe6e040fc558eb21bee02f2bd1ea1b19a4e OP_EQUALVERIFY OP_CHECKSIG
```

![](../../../assets/images/posts/tp4/Screenshot%202023-12-27%20at%201.20.04%20PM.png)

El explorador de BU nos hace el favor de traducir el bytecode hexadecimal a un formato de BCH Script más legible.

Funciona igual que el ejemplo anterior, salvo que se omite el `14` porque, mientras que en formato hexadecimal cada byte se representa explícitamente, en formato de BCH Script la longitud del hash de clave pública que sigue es implícita.

En resumen, este script dice: “Para gastar este BCH, proporciona una clave pública cuyo hash sea este valor concreto (8d5e5fe6e040fc558eb21bee02f2bd1ea1b19a4e) y una firma que demuestre que posees la clave privada correspondiente a esa clave pública”.

Este tipo de script es el estándar en transacciones donde se envía BCH a la dirección de un único destinatario. Garantiza que solo la persona que tiene la clave privada correspondiente al hash de clave pública indicado pueda gastar el BCH.

<!-- TOC --><a name="sequential-nft-bytecode"></a>

##### Bytecode de NFTs secuenciales

Si `parse.bytecode` no está presente en el BCMR, por ejemplo en una serie de NFTs secuenciales, el bytecode implícito es:

`00d26b`

Que se traduce en:

`OP_0 OP_UTXOTOKENCOMMITMENT OP_TOALTSTACK`

Esto simplemente significa que todo el `commitment` de la primera entrada se envía a la altstack. Y, como aprendimos en el tutorial 2, los NFTs secuenciales solo tienen su número de secuencia (en hexadecimal) en su `commitment`.

Más abajo exploraremos un ejemplo de `parse.bytecode` más complejo cuando creemos una dapp de venta de boletos básica. ¡Debería ser divertido!

<!-- TOC --><a name="when-to-put-data-on-chain"></a>

### Cuándo poner datos en la cadena

El tema de los NFTs parseables plantea la pregunta de cuándo poner los datos en un BCMR y cuándo en el campo `commitment` del NFT en la cadena.

Por ejemplo, hemos [visto](/blog/token-pioneers-cashtokens-tutorial-2#bch-guru-metadata) que las series de NFTs ponen en la cadena solo el número hexadecimal de su NFT secuencial, en el campo `commitment`, y luego ponen un montón de atributos en el archivo BCMR.

Pero ¿qué pasa con los datos que quieres conservar para siempre y de forma inmutable en la cadena? Claro, hoy el campo `commitment` del NFT solo tiene unos 40 bytes, pero podría ampliarse en el futuro.

Aquí va una reflexión de [CashTokens.org](https://cashtokens.org/docs/bcmr/chip/#associating-information-with-nfts):

> Siempre que sea posible, los emisores de NFTs deberían preferir emitir NFTs secuenciales, a menos que el caso de uso previsto requiera NFTs parseables. Los NFTs secuenciales son más eficientes que los parseables, ya que reducen el ancho de banda y las comisiones de transacción necesarias para transferir cada NFT. Como todos los metadatos más allá del identificador del NFT se guardan fuera de la cadena y se resuelven mediante registros de metadatos, los NFTs secuenciales no tienen límites significativos en cuanto a la composición o el tamaño de sus metadatos asociados.
>
> Los NFTs parseables codifican hasta 40 bytes de metadatos en su compromiso en la cadena. Codificar estos metadatos en el compromiso en la cadena permite que cada NFT transmita información autenticada a sistemas de contratos en la cadena y a sistemas fuera de la cadena poco conectados entre sí, a costa de un ligero aumento en las comisiones de transacción necesarias y en los valores de las salidas de polvo. Los NFTs parseables pueden codificar una gran variedad de campos de NFT, datos compartidos por todos los NFTs de un tipo concreto… (traducción nuestra)

BitcoinCashAutist, desarrollador de BCH, ofrece una pauta más concisa en el grupo CashToken Devs de Telegram:

> si los datos los va a leer un contrato, entonces en el compromiso; si no, fuera de la cadena (traducción nuestra) —BitcoinCashAutist [\\#](https://t.me/cashtoken_devs/13266)

Personalmente creo que es una pauta inicial bastante buena. ¡Únete a [CashToken Devs](https://t.me/cashtoken_devs) y comparte también tu opinión!

<!-- TOC --><a name="decision-matrix"></a>

#### Matriz de decisión

Esta es una matriz de decisión para determinar si los datos deben guardarse en la cadena o en un BCMR.

| Criterio                              | En la cadena                  | BCMR |
| ------------------------------------- | ----------------------------- | ---- |
| ¿Tamaño de datos \> 40 bytes?         | No                            | Sí   |
| ¿Minimizar comisiones de transacción? | No                            | Sí   |
| ¿NFT secuencial?                      | No (solo número de secuencia) | Sí   |
| ¿Acceden otros contratos?             | **Sí**                        | No   |
| ¿Requiere inmutabilidad?              | **Sí**                        | No   |

Si el tamaño de los datos es mayor de 40 bytes, por ejemplo, no cabrán en el campo `commitment` del NFT, así que tienen que ir fuera de la cadena; o, al menos, hay que priorizar los datos, y no pueden ir más de 40 bytes en la cadena en un solo NFT.

Si quieres comisiones de transacción mínimas, pon en la cadena la menor cantidad de datos posible.

Si tus datos requieren las protecciones de inmutabilidad de la blockchain de BCH, ponlos en la cadena.

Si tus datos tienen que ser accesibles para contratos en la cadena, entonces deben ir obligatoriamente en la cadena.

Y si estás creando un NFT secuencial, la buena práctica es poner en la cadena solo el número de secuencia en hexadecimal, y todos los atributos, imágenes, etc. fuera de la cadena.

<!-- TOC --><a name="building-with-parsable-nfts"></a>

## Crear con NFTs parseables

Cuando desarrolles en BCH, conviene empezar en [chipnet](/blog/token-pioneers-cashtokens-tutorial-2#a-if-you-want-to-use-chipnet) (la red de pruebas de los CHIPs) y con la billetera [Cashonize](https://cashonize.com/). La billetera Cashonize puede [cambiar](/blog/token-pioneers-cashtokens-tutorial-2#a-if-you-want-to-use-chipnet) fácilmente entre la red principal y chipnet.

Necesitarás algo de tBCH de chipnet (que funciona como BCH real pero no tiene valor). Puedes conseguirlo en [tbch.googol.cash](https://tbch.googol.cash/). Asegúrate de seleccionar **chipnet**. También puedes pedir tBCH de chipnet en el [grupo Panmoni CashToken Builders](https://t.me/Panmoni/315).

<!-- TOC --><a name="1-build-a-basic-nft-ticket"></a>

### 1. Crear un boleto NFT básico

La venta de boletos es un caso de uso interesante para Web3. Estas son algunas cosas útiles que los boletos Web3 (como NFTs) pueden hacer y que tus viejos boletos de papel no pueden:

1. Los boletos Web3 no se pueden falsificar.
2. La creación y la reventa de boletos Web3 se pueden rastrear en la cadena.
3. La reventa especulativa de boletos Web3 puede tener un precio tope, y parte de las ganancias puede volver a los emisores de los boletos.
4. Los boletos Web3 se pueden reembolsar de forma automatizada.
5. Los boletos Web3 pueden desbloquear beneficios adicionales para sus titulares, como contenido digital exclusivo, mercancía especial, etc. Esto abre nuevas fuentes de ingresos y mejora la experiencia.
6. Los boletos Web3 se pueden tratar como coleccionables después del evento.
7. Los boletos Web3 se pueden intercambiar en un mercado en línea.
8. Los boletos Web3 pueden ser leídos por otros contratos inteligentes en la cadena.

<!-- TOC --><a name="october-21-1980"></a>

#### 21 de octubre de 1980

El 21 de octubre de 1980, yo estaba viendo frente al televisor cómo los Philadelphia Phillies le ganaban la Serie Mundial a los Kansas City Royals. Vi cómo Tug McGraw (uno de mis beisbolistas favoritos, con quien de hecho llegué a lanzarme la pelota una vez) ponchaba al último bateador de los Royals.

Fue emocionante.

¡Habría sido aún más emocionante en persona!

Así que imaginemos por un momento que yo estaba allí el 21 de octubre, en las gradas, y que tenía un boleto NFT. ¿Cómo sería?

Los Phillies jugaban en el [Veterans Stadium](https://en.wikipedia.org/wiki/Veterans_Stadium), así que tomémoslo como ejemplo. No vamos a reflejar toda la complejidad de los boletos del Veterans Stadium, pero veamos hasta dónde llegamos.

Aquí tienes un talón de boleto de aquel partido de 1980.

![](../../../assets/images/posts/tp4/DraggedImage.png)

Creo que estos son los factores que tenemos que tener en cuenta para crear el boleto NFT:

- **Nivel de asiento**, que depende de la altura del asiento. En el Veterans Stadium (lamentablemente ya demolido) había unos 7 niveles de boletos, cada uno correspondiente a un nivel del estadio. Los boletos del nivel 100 daban derecho a un asiento a nivel del campo. Los del nivel 700 estaban en lo más alto. En nuestro boleto de ejemplo, los Loge Boxes estaban en el nivel 5.
- **Ubicación del asiento**: en nuestro boleto de ejemplo, sería Sección 593, Fila 6, Asiento 11.
- **Puerta**: muchos boletos también indican por qué puerta entrar.
- **Fecha y hora**: la fecha y la hora previstas del partido de béisbol. En nuestro boleto de ejemplo, este dato es implícito.
- **Precio**: por si hay que reembolsar el boleto, probablemente deberíamos tener el precio. En nuestro ejemplo, son 20,00 US$. (Según una búsqueda rápida, hoy los boletos de la Serie Mundial son 20 veces más caros, ¡y eso en lo más alto! ¡Inflación!)

¡Con eso en mente, diseñemos nuestro boleto NFT!

<!-- TOC --><a name="designing-the-ticket"></a>

#### Diseñar el boleto

Parece que el nivel de asiento se puede deducir del valor de Sección en Ubicación del asiento. Esto me permitiría crear un solo tipo de NFT. Si tenemos un solo tipo de NFT (como en el ejemplo anterior), podemos ahorrar espacio tanto en la cadena como en nuestro BCMR.

Pero decidí hacer este boleto un poco más complejo de lo que parece necesario para mostrarte más de lo que es posible.

¡Recuerda que apenas estamos tocando los límites exteriores de lo que es posible con los contratos inteligentes de BCH!

Con eso en mente, crearé 7 tipos de boleto, uno por cada nivel de asientos del antiguo Veterans Stadium. Numeraré los tipos del 01 al 07.

Y crearé 3 campos:

1. `seatLocation`: la ubicación del asiento del boleto, que incluye sección (3), fila (2), número de asiento (2) y puerta (un solo dígito que corresponde uno a uno con el alfabeto). Longitud fija de 8 caracteres, siempre.
2. `dateTime`: la fecha y hora UTC en formato yyyyMMddHHmm, p. ej., 2032312121645, y se supone que siempre está en hora UTC, por simplicidad. Longitud fija de 12 caracteres, siempre.
3. `price`: el precio del boleto expresado en satoshis. Máximo 16 caracteres, longitud siempre variable.

Así que el campo `commitment` del boleto NFT tendrá este formato:

```
<type><ticket-fields [seatLocation, date, price]>
```

Todo serán números pegados sin separadores, que luego se convertirán a hexadecimal.

Algo importante a tener en cuenta es que los tipos 04 y 07 solo tienen 2 de los 3 campos. El resto de los tipos tiene los 3 campos. Esto se basa en [una investigación somera](https://en.wikipedia.org/wiki/Veterans_Stadium#Stadium_features).

<!-- TOC --><a name="draft-bcmr"></a>

#### Borrador de BCMR

Antes de empezar con el código, creo que conviene esbozar el BCMR para entender cómo funcionarán estos boletos. Este es mi borrador inicial. Analízalo con lo que aprendiste en el [tutorial 3](/blog/token-pioneers-cashtokens-tutorial-3).

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": { "major": 0, "minor": 1, "patch": 0 },
  "latestRevision": "2023-12-12T00:00:00.000Z",
  "registryIdentity": {
    "name": "Generic Ticketing dApp Token Registry",
    "description": "An example demonstrating how a metadata registry might publish information about a ticketing dApp.",
    "uris": {
      "icon": "https://example.com/registry-icon.svg",
      "web": "https://example.com/",
      "registry": "https://example.com/.well-known/bitcoin-cash-metadata-registry.json"
    }
  },
  "identities": {
    "0xexamplehash": {
      "2023-12-12T00:00:00.000Z": {
        "name": "Veterans Stadium Baseball Games",
        "description": "An identity for a hypothetical Veterans Stadium series of baseball game events. This decentralized application uses 7 types of parsable NFT and 3 fields.",
        "token": {
          "category": "0xexamplehash",
          "symbol": "VETERANS-BASEBALL",
          "nfts": {
            "description": "Tickets to baseball games at Veterans Stadium for any date.",
            "fields": {
              "seatLocation": {
                "name": "Seat Location",
                "description": "The seat location for the ticket, including section (3), row (2), seat number (2) and gate (single digit that maps one to one with alphabet). Fixed length of 8 characters always.",
                "encoding": {
                  "type": "number"
                }
              },
              "dateTime": {
                "name": "Date and UTC Time of Event",
                "description": "The date and time of the event in YYYYMMDDHHMM format, e.g., 2032312121645. Assumed time zone is UTC. Fixed length of 12 characters always.",
                "encoding": {
                  "type": "number"
                }
              },
              "price": {
                "name": "Price Paid",
                "description": "The price paid for the ticket. Maximum 16 characters, variable length always. Denominated in satoshis.",
                "encoding": {
                  "type": "number",
                  "unit": "satoshis"
                }
              }
            },
            "parse": {
              "bytecode": "",
              "types": {
                "01": {
                  "name": "100 Level Ticket",
                  "description": "The lowest level ticket.",
                  "fields": ["seatLocation", "dateTime", "price"],
                  "uris": {
                    "icon": "ipfs://bafxxx/1.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-100"
                  }
                },
                "02": {
                  "name": "200 Level Ticket",
                  "description": "Field-level boxes.",
                  "fields": ["seatLocation", "dateTime", "price"],
                  "uris": {
                    "icon": "ipfs://bafxxx/2.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-200"
                  }
                },
                "03": {
                  "name": "300 Level Ticket",
                  "description": "Terrace boxes.",
                  "fields": ["seatLocation", "dateTime", "price"],
                  "uris": {
                    "icon": "ipfs://bafxxx/3.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-300"
                  }
                },
                "04": {
                  "name": "400 Level Ticket",
                  "description": "Reserved for press and dignitaries.",
                  "fields": ["seatLocation", "dateTime"],
                  "uris": {
                    "icon": "ipfs://bafxxx/4.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-400"
                  }
                },
                "05": {
                  "name": "500 Level Ticket",
                  "description": "Upper level loge boxes.",
                  "fields": ["seatLocation", "dateTime", "price"],
                  "uris": {
                    "icon": "ipfs://bafxxx/5.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-500"
                  }
                },
                "06": {
                  "name": "600 Level Ticket",
                  "description": "Upper reserved and individual seats.",
                  "fields": ["seatLocation", "dateTime", "price"],
                  "uris": {
                    "icon": "ipfs://bafxxx/6.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-600"
                  }
                },
                "07": {
                  "name": "700 Level Ticket",
                  "description": "General admission seating.",
                  "fields": ["dateTime", "price"],
                  "uris": {
                    "icon": "ipfs://bafxxx/7.svg",
                    "web": "https://example.com/about-veterans-baseball-game/level-700"
                  }
                }
              }
            }
          }
        },
        "uris": {
          "icon": "https://example.com/veterans-baseball-game.svg",
          "web": "https://example.com/about-veterans-baseball-game",
          "registry": "https://example.com/.well-known/bitcoin-cash-metadata-registry.json",
          "support": "https://veterans-baseball-game-support.example.com/"
        }
      }
    }
  },
  "license": "CC0-1.0"
}
```

Por ahora, la única identidad del BCMR es para nuestros partidos de béisbol ficticios en el Veterans Stadium. El Veterans Stadium también acogía partidos de fútbol americano de los Eagles, así que, hipotéticamente, si se implementara, los boletos de esos partidos podrían ir en una segunda identidad.

Nota: puedes encontrar todo el código de este tutorial en [GitHub](https://github.com/Panmoni/ticket).

<!-- TOC --><a name="planning-the-commitment"></a>

#### Planificar el compromiso

Al BCMR anterior le falta el hash de su Identity Snapshot y de su `token.category`. Aprendimos a resolver esto en el [tutorial 3](/blog/token-pioneers-cashtokens-tutorial-3#identify-the-pre-genesis-transaction).

Pero primero necesitamos el valor de `parse.bytecode`. Para averiguarlo, imaginemos primero algunos valores de ejemplo del campo `commitment` del NFT.

<!-- TOC --><a name="type-04"></a>

##### Tipo 04

Los asientos de tipo `04` son del nivel 400, reservados para la prensa y personalidades, así que no tienen precio (supongo).

Este es un campo `commitment` de ejemplo para boletos de tipo 04:

**Cadena UTF-8**: `0440101013202312121900`

**[Hex](https://www.rapidtables.com/convert/number/ascii-to-hex.html)**: `30343430313031303133323032333132313231393030` (cuando se trata como cadena UTF-8)

**Bytes**: 22 (del hexadecimal)

- `04` es el tipo de boleto.
- `40101013` es Sección 401, Fila 01, Asiento 01 y Puerta C.
- `202312121900` es la fecha, 2023 12 12, y la hora, 19:00, y se supone hora UTC.

<!-- TOC --><a name="type-07"></a>

##### Tipo 07

Los asientos de tipo `07` son de admisión general, así que no hay asientos asignados. Por tanto, con el tipo basta para determinar la zona de asientos.

**Cadena UTF-8**: `072023121219004300000`

**[Hex](https://www.rapidtables.com/convert/number/ascii-to-hex.html)**: `303732303233313231323139303034333030303030`

**Bytes**: 21

- `07` es el tipo de boleto.
- `202312121900` es la fecha y la hora.
- `4300000` es el número de sats que costó el boleto, o 0,043 BCH.

<!-- TOC --><a name="all-other-types"></a>

##### Todos los demás tipos

Todos los demás tipos (01, 02, 03, 05, 06) tienen los 3 campos, así que siguen el mismo formato básico.

**Cadena UTF-8**: `0110101011202312121900104300000`

**[Hex](https://www.rapidtables.com/convert/number/ascii-to-hex.html)**: `30313130313031303131323032333132313231393030313034333030303030`

**Bytes**: 31

- `01` es el tipo de boleto (variará según el nivel).
- `10101011` es Sección 101, Fila 01, Asiento 01, Puerta A.
- `202312121900` es la fecha y la hora.
- `104300000` es el precio del boleto en satoshis, o 1,043 BCH.

<!-- TOC --><a name="notes"></a>

###### Notas

- Dejamos el precio para el final porque su tamaño es variable. Esto facilitará crear el bytecode.
- Al crear estos NFTs, podemos obligar a que el tipo tenga siempre dos caracteres, el `seatLocation` siempre 8 y el `dateTime` siempre 12. Esto nos permitirá establecer un bytecode fiable.
- Tratar los datos del compromiso como un número decimal puede ahorrar bytes, ya que da un hexadecimal más pequeño. Sin embargo, elimina los ceros a la izquierda y puedes encontrarte con otras limitaciones.
- Este ejemplo no pretende estar totalmente optimizado (la optimización prematura y todo eso), así que tenlo en cuenta al crear tus propios NFTs parseables.

<!-- TOC --><a name="writing-the-bytecode"></a>

#### Escribir el bytecode

Volvamos al [BitAuth IDE](https://Ide.bitauth.com/) y escribamos nuestro script de bytecode. Borra tu código actual, pero asegúrate de conservar (o replicar) la configuración de la sección del ejemplo de NFT parseable de arriba.

<!-- TOC --><a name="1-push-the-commitment"></a>

##### 1. Apilar el compromiso.

```
OP_0
OP_UTXOTOKENCOMMITMENT
```

Esto toma el UTXO de la primera entrada de la transacción y pone su `commitment` en la pila.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%203.37.46%20PM.png)

Para hacer pruebas, podemos reemplazar esto por el hexadecimal del `commitment` del NFT de tipo 04 de ejemplo que vimos arriba, con un `0x` delante para indicar que es hexadecimal.

`<0x30343430313031303133323032333132313231393030>`

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%203.36.36%20PM.png)

<!-- TOC --><a name="2-split-off-the-type"></a>

##### 2. Separar el tipo

Apilaremos un ‘2’ y luego dividiremos el valor de `commitment` después de 2 bytes. Esto separa el identificador de tipo del `commitment` y lo deja en la parte superior de la pila.

Por último, haremos una copia del segundo elemento desde arriba y la pondremos en la parte superior de la pila.

```
OP_2
OP_SPLIT
OP_OVER
```

El estado de la pila ahora es: `0x3034` (la cadena ‘04’) en la base, seguido del resto del valor de `commitment`, seguido de `0x3034` en la parte superior de la pila.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%203.39.55%20PM.png)

<!-- TOC --><a name="3-if-it-is-type-04"></a>

##### 3. Si es de tipo 04

Queremos ver si este NFT es de tipo `04`, así que apilamos ese valor en hexadecimal. Después comprobamos si los 2 valores superiores de la pila son iguales. Si lo son, apilará un ‘1’; si no, un cero.

```
<0x3034>
OP_EQUAL
OP_IF
```

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%203.48.11%20PM.png)

<!-- TOC --><a name="4-get-seatlocation"></a>

##### 4. Obtener seatLocation

Primero, pasamos el identificador de tipo a la altstack. Después, apilamos un ‘8’ y dividimos el fragmento restante del valor de `commitment` después de 8 bytes.

Esto da una pila donde el fragmento restante del `commitment` está arriba (que ahora solo contiene el campo `dateTime`), debajo está seatLocation y debajo de eso el identificador de tipo.

Así que copiamos el hexadecimal de seatLocation a la parte superior de la pila y lo pasamos a la altstack.

```
  OP_OVER
  OP_TOALTSTACK
  OP_8
  OP_SPLIT
  OP_OVER
  OP_TOALTSTACK
```

Así se ve nuestra altstack.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%203.54.53%20PM.png)

<!-- TOC --><a name="5-datetime-is-left"></a>

##### 5. Queda dateTime

El valor de `dateTime` queda en la parte superior de la pila, así que simplemente lo pasamos a la altstack.

```
  OP_TOALTSTACK
```

Este es el estado de nuestra altstack.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%203.58.45%20PM.png)

La pila se queda con dos valores que se eliminan fuera de la instrucción if-else-else, en el paso 9 más abajo.

<!-- TOC --><a name="6-if-it-is-type-07"></a>

##### 6. Si es de tipo 07

Si el NFT es de tipo `04`, el script saltará al paso 9. Si no es de tipo `04`, el script procesará esta sección. Comprueba si el NFT tiene el identificador `07` y, si es así, pasa a la altstack el identificador de tipo, dateTime y el precio.

```
OP_ELSE
  OP_OVER
  <0x3037>
  OP_EQUAL
  OP_IF
    OP_OVER
    OP_TOALTSTACK
    OP_12
    OP_SPLIT
    OP_OVER
    OP_TOALTSTACK
    OP_TOALTSTACK
```

Para probarlo, podemos reemplazar el primer valor apilado por un valor de ejemplo de tipo `07`, por ejemplo:

`<0x303732303233313231323139303034333030303030>`

Ahora el script se salta la sección del tipo `04` y la sección del tipo `07` está activa.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%204.31.38%20PM.png)

Al terminar la ejecución de la sección del tipo `07`, vemos que en la altstack están los siguientes valores.

```
0x34333030303030
0x323032333132313231393030
0x3037
```

De abajo arriba: el identificador de tipo, el `seatLocation`, el `dateTime` y el `price`.

[Traduciendo](https://www.rapidtables.com/convert/number/hex-to-ascii.html) los valores de hexadecimal a texto:

```
4300000 // price in satoshis
202312121900 // date and time
07 // type
```

Y esta es la altstack tal como se ve en BitAuth IDE.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%204.32.54%20PM.png)

<!-- TOC --><a name="7-if-it-is-any-other-type"></a>

##### 7. Si es de cualquier otro tipo

Si el boleto NFT no es de tipo `04` ni de tipo `07`, se activa esta sección (genérica). Se aplica a todos los demás tipos.

```
  OP_ELSE
    OP_OVER
    OP_TOALTSTACK
    OP_8
    OP_SPLIT
    OP_OVER
    OP_TOALTSTACK
    OP_12
    OP_SPLIT
    OP_OVER
    OP_TOALTSTACK
    OP_TOALTSTACK
	OP_DROP
  OP_ENDIF
```

Para probarlo, podemos reemplazar el primer valor apilado por un valor de ejemplo de tipo `01`, por ejemplo:

`<0x30313130313031303131323032333132313231393030313034333030303030>`

Ahora el script se salta las secciones de los tipos `04` y `07`. La sección genérica está activa.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%204.43.44%20PM.png)

Al terminar la ejecución de la sección genérica, vemos que en la altstack están los siguientes valores.

```
0x313034333030303030
0x323032333132313231393030
0x3130313031303131
0x3031
```

De abajo arriba: el identificador de tipo, el `dateTime` y el `price`.

[Traduciendo](https://www.rapidtables.com/convert/number/hex-to-ascii.html) los valores de hexadecimal a texto:

```
104300000 // price in satoshis
202312121900 // dateTime
10101011 // seatLocation
01 // type
```

Y esta es la altstack tal como se ve en BitAuth IDE. Cuando las pilas tienen más de unos pocos elementos, la aplicación abrevia la pila.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-28%20at%204.45.16%20PM.png)

<!-- TOC --><a name="8-end-the-if-else"></a>

##### 8. Cerrar el if-else

```
OP_ENDIF
```

<!-- TOC --><a name="9-clean-up-the-stack"></a>

##### 9. Limpiar la pila

```
OP_DROP
OP_DROP
```

<!-- TOC --><a name="the-complete-script"></a>

##### El script completo

Este es el script completo. También lo encuentras en el repositorio de [GitHub](https://github.com/Panmoni/ticket).

```
OP_0
OP_UTXOTOKENCOMMITMENT
OP_2
OP_SPLIT
OP_OVER // Stack: type, remainder, type
<0x3034>
OP_EQUAL // Compare with '04'
OP_IF
  // Logic for type '04'
  OP_OVER // push type
  OP_TOALTSTACK
  OP_8 // get seatLocation
  OP_SPLIT
  OP_OVER
  OP_TOALTSTACK // altstack: type, seatLocation
  OP_TOALTSTACK // altstack: type, seatLocation, dateTime
OP_ELSE
  OP_OVER
  <0x3037>
  OP_EQUAL // Compare with '07'
  OP_IF
    // Logic for type '07' dateTime, price
    OP_OVER
    OP_TOALTSTACK
    OP_12 // get dateTime
    OP_SPLIT
    OP_OVER
    OP_TOALTSTACK
    OP_TOALTSTACK // altstack: type, dateTime, price
  OP_ELSE
    // Logic for all other types
    OP_OVER
    OP_TOALTSTACK
    OP_8 // get seatLocation
    OP_SPLIT
    OP_OVER
    OP_TOALTSTACK
    OP_12 // get dateTime
    OP_SPLIT
    OP_OVER
    OP_TOALTSTACK
    OP_TOALTSTACK // altstack: type in hex, seatLocation, dateTime, price
    OP_DROP // clear an extra stack item for these types
  OP_ENDIF
OP_ENDIF
OP_DROP
OP_DROP // clear the stack.
```

En el [repositorio de GitHub](https://github.com/Panmoni/ticket) hay tanto una versión limpia/sin comentarios del script como esta de arriba.

<!-- TOC --><a name="convert-the-script-to-bytecode"></a>

##### Convertir el script a bytecode

Para convertir el script a bytecode y usarlo en tu BCMR, visita [documentation.cash](https://documentation.cash/protocol/blockchain/script.html#operation-codes-opcodes) y consulta la tabla de traducción de opcodes.

Por ejemplo, OP_0 es `00` y OP_IF es `63`.

Creé un script de Python, `convert.py`, que está en el [repositorio de GitHub](https://github.com/Panmoni/ticket). Todavía no maneja todos los opcodes, pero sí todos los que necesité para este ejemplo. Cualquiera puede ampliarlo (puede que yo lo haga), o incluso es probable que ya exista una herramienta para esto.

Esta es la salida que me dio.

`00cf527f780230348763786b587f786b6b67780230378763786b5c7f786b6b67786b587f786b5c7f786b6b7568687575`

Analicémosla.

| Código hex | Opcode/descripción                         |
| ---------- | ------------------------------------------ |
| 00         | OP_0                                |
| cf         | OP_UTXOTOKENCOMMITMENT              |
| 52         | OP_2                                |
| 7f         | OP_SPLIT                            |
| 78         | OP_OVER                             |
| 02         | (indica que a continuación apilará 2 bytes) |
| 3034       | (04)                                       |
| 87         | OP_EQUAL                            |
| 63         | OP_IF                               |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 58         | OP_8                                |
| 7f         | OP_SPLIT                            |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 6b         | OP_TOALTSTACK                       |
| 67         | OP_ELSE                             |
| 78         | OP_OVER                             |
| 02         | (indica que a continuación apilará 2 bytes) |
| 3037       | (07)                                       |
| 87         | OP_EQUAL                            |
| 63         | OP_IF                               |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 5c         | OP_12                               |
| 7f         | OP_SPLIT                            |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 6b         | OP_TOALTSTACK                       |
| 67         | OP_ELSE                             |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 58         | OP_8                                |
| 7f         | OP_SPLIT                            |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 5c         | OP_12                               |
| 7f         | OP_SPLIT                            |
| 78         | OP_OVER                             |
| 6b         | OP_TOALTSTACK                       |
| 6b         | OP_TOALTSTACK                       |
| 75         | OP_DROP                             |
| 68         | OP_ENDIF                            |
| 68         | OP_ENDIF                            |
| 75         | OP_DROP                             |
| 75         | OP_DROP                             |

En efecto, la versión en bytecode coincide con la versión en BCH Script.

<!-- TOC --><a name="create-minting-nft-on-chipnet"></a>

#### Crear el NFT de acuñación en Chipnet

Como se describe en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2) de esta serie, nuestro primer paso para crear una nueva serie de NFTs es crear un [NFT de acuñación](/blog/token-pioneers-cashtokens-tutorial-2#a-create-your-minting-nft).

Podemos simplificar las cosas usando el formulario **CreateTokens** de [Cashonize](https://cashonize.com/), igual que en el [tutorial 2](/blog/token-pioneers-cashtokens-tutorial-2#a-create-your-minting-nft).

1. Visita [Cashonize.com](https://Cashonize.com/) y decide si quieres experimentar primero en chipnet o ir directo a la red principal. Configura tu billetera en consecuencia.
2. Cuando estés listo, haz clic en la pestaña **CreateTokens**.
3. Seleccionará y te mostrará el hash de la transacción previa a la génesis. Asegúrate de actualizar tu BCMR con él.
4. Sube tu BCMR completo a IPFS. (Te [recomiendo](/blog/token-pioneers-cashtokens-tutorial-1#4-create-the-token-metadata) [nft.storage](https://nft.storage/).)

Este es mi formulario completado y mi [BCMR](ipfs://bafkreigq6t2tfuqj4slh2ppjibstcztoqe4dzcutruymkperuhsqry64mq).

![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%2011.30.58%20AM.png)

5. Cuando el formulario termine de procesarse, ¡visita la pestaña **MyTokens** para ver tu nuevo NFT de acuñación!
6. Haz clic en **mintNFTs** debajo, desmarca la casilla “make each NFT unique” y completa los campos.

Seleccioné 1 NFT, con compromiso `30313130313031303131323032333132313231393030313034333030303030`, y como dirección de destino usé la dirección compatible con tokens que aparece en la página principal de la billetera Cashonize.

![](../../../assets/images/posts/tp4/createtoken.png)

Este es el mensaje de éxito que recibí:

![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%2012.02.07%20PM.png)

Esta es mi página MyTokens después de acuñar el primer boleto:

![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%2012.02.38%20PM.png)

Puedes explorar la [transacción](https://cbch.loping.net/tx/239ef103ba54d6a3cb82f101a68e98b9ab7098f5af890d58df8ee9515c6ee258) en la que acuñé el boleto NFT.

[![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%2012.21.30%20PM.png)](https://cbch.loping.net/tx/239ef103ba54d6a3cb82f101a68e98b9ab7098f5af890d58df8ee9515c6ee258)

¡Éxito!

<!-- TOC --><a name="create-ticket-on-mainnet"></a>

#### Crear el boleto en la red principal

En Cashonize puedes cambiar a la red principal y repetir este proceso.

Actualicé mi [BCMR](https://github.com/Panmoni/ticket/blob/main/veterans-stadium-baseball-bcmr.json) y este es mi boleto final.

1. [Transacción](https://explorer.bitcoinunlimited.info/tx/72455ae5ec91200cedbbf9aeb7d57e1af75677fde8dc3d291e00264688a5b0d1) del NFT de acuñación.
2. [Transacción](https://explorer.bitcoinunlimited.info/tx/f0941e9e4d03ce4c148a74e84ed76ae6cf4c9b90d8eef5bfd163f5a3eff05683) del NFT inmutable de tipo 07.
3. [Transacción](https://explorer.bitcoinunlimited.info/tx/6f5c4f0639b0b0c1ee7a5d1f466b34ffde0929e2c86dea0cc59a0fe4b19d10df) del NFT inmutable de tipo 04.
4. [Transacción](https://explorer.bitcoinunlimited.info/tx/1698a24f2104f0b3b7647a1a507c2431cbdd91ee75b3016a2d206ca2a9e1dbe0) del NFT inmutable de tipo 01.

Como en BCH se pueden encadenar transacciones (el límite para ello [se elevó](https://reference.cash/protocol/forks/chips/2021-05-unconfirmed-transaction-chain-limit) hace 2 años), pude crear el NFT de acuñación y los 3 boletos NFT en el mismo bloque.

Sin embargo, los metadatos no se cargarán en Cashonize hasta que la(s) transacción(es) tengan al menos 1 confirmación. Puedes seguir los nuevos bloques en [cash.coin.dance](https://cash.coin.dance/blocks#blockDetails).

En el momento de escribir esto, ninguna billetera tiene todavía función de parseo, así que así se ven los NFTs en Cashonize.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%204.05.33%20PM.png)

Así se ven en [Electron Cash](https://electroncash.org/), antes y después de [importar manualmente](/blog/token-pioneers-cashtokens-tutorial-1#8-spend-some-tokens) los metadatos.

![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%203.46.22%20PM.png)

![](../../../assets/images/posts/tp4/Screenshot%202023-12-29%20at%203.54.26%20PM.png)

Esta es la salida del indexador Paytaca BCMR:

```json
{
  "name": "Veterans Stadium Baseball Games",
  "uris": {
    "web": "ipfs://bafkreie3d44v6bhfyqvup6rdeta7iztzvqrpwrbfai4wxqc6k6rtjd5ely/",
    "icon": "ipfs://bafybeicdicjjgkdk4r3kcsjaiuwwomnpf3uwvaksj73yvc3miobt7xfhv4/baseball.png",
    "support": "ipfs://bafkreie3d44v6bhfyqvup6rdeta7iztzvqrpwrbfai4wxqc6k6rtjd5ely/#support"
  },
  "token": {
    "symbol": "VETERANS-BASEBALL",
    "category": "85a37e715167bbcde6b559e1caa383e081ddb2c0b305be867e4fe4882042bb41"
  },
  "description": "An identity for a hypothetical Veterans Stadium series of baseball game events.",
  "is_nft": true
}
```

Estos son otros enlaces que puedes explorar.

- [TokenExplorer](https://tokenexplorer.cash/?tokenId=85a37e715167bbcde6b559e1caa383e081ddb2c0b305be867e4fe4882042bb41)
- [Página web](https://bafkreie3d44v6bhfyqvup6rdeta7iztzvqrpwrbfai4wxqc6k6rtjd5ely.ipfs.dweb.link/)
- [SalemKode Explorer](https://explorer.salemkode.com/token/85a37e715167bbcde6b559e1caa383e081ddb2c0b305be867e4fe4882042bb41)

<!-- TOC --><a name="full-featured-web3-ticketing-dapp"></a>

#### ¿Una dapp Web3 de venta de boletos completa?

Si te interesa aprender a convertir esto en una dapp Web3 de venta de boletos completa, ¡avísame [con un tuit](https://twitter.com/GeorgeDonnelly)! Puedo hacer un tutorial que te guíe paso a paso.

<!-- TOC --><a name="the-40-byte-commitment-limit"></a>

#### El límite de 40 bytes del compromiso

Al crear tus dapps, ten en cuenta el límite de 40 bytes de los campos `commitment` de los NFTs.

Aunque los caracteres latinos en UTF-8 o los números decimales ocupan menos bytes, los caracteres con codificación de longitud variable, como el kanji “柴犬”, pueden ocupar más.

En UTF-8, el tamaño puede ir de 1 a 4 bytes por carácter, según la complejidad del carácter. Es probable que “柴犬” en UTF-8 ocupe varios bytes por carácter.

Aquí es donde el BCMR resulta muy útil, ya que te permite sacar de la cadena los metadatos que no necesitan estar en ella.

<!-- TOC --><a name="task-create-your-ticket-nft-for-10000-xrbf"></a>

#### TAREA: crea tu boleto NFT por 10.000 XRBF

Crea tu boleto NFT y comparte lo que hiciste en el [canal Panmoni CashTokens de Telegram](https://t.me/Panmoni/315).

La recompensa por completar la tarea con éxito es de **10.000 XRBF**.

<!-- TOC --><a name="2-create-a-warrant-canary-with-bcmr"></a>

### 2. Crear un canario de orden judicial con BCMR

Un [canario de orden judicial](https://en.wikipedia.org/wiki/Warrant_canary) es un comunicado proactivo al público de que, a una fecha determinada, el gobierno no ha entregado a la organización o persona que lo emite una citación secreta para obtener datos de clientes.

Algunas citaciones vienen con órdenes de silencio y/o sanciones penales por revelar su existencia.

Así que la idea de un canario de orden judicial es que la organización o persona pueda anunciar de forma proactiva que hasta el momento no ha habido ninguna citación secreta. Puede actualizar esta declaración con regularidad. Y si recibe una citación secreta, puede retirar (o dejar de actualizar) el canario, señalando así implícitamente que ha recibido una citación para obtener datos de clientes.

Proveedores de servicios tecnológicos, periodistas, medios de comunicación, disidentes, etc., pueden usar un canario de orden judicial. Los canarios de orden judicial son un acto de disuasión contra las citaciones secretas y otras formas de opresión. Permiten que la gente actúe cuando dejan de actualizarse, por ejemplo trasladando sus cuentas o protestando.

<!-- TOC --><a name="create-the-message"></a>

#### Crear el mensaje

[![](../../../assets/images/posts/tp4/DraggedImage-1.png '“El FBI no ha estado aquí”')](https://en.m.wikipedia.org/wiki/File:The_FBI_has_not_been_here.jpg)

El mensaje del canario podría ser tan simple como “El FBI no ha estado aquí”. O podría ser bastante complejo. [Cloudflare](https://www.cloudflare.com/), por ejemplo, tiene [varios canarios de orden judicial](https://www.cloudflare.com/learning/privacy/what-is-warrant-canary/).

Un buen mensaje incluye una promesa sobre con qué frecuencia se puede esperar que se actualice.

Este es un ejemplo de mensaje de canario en JSON para una empresa de VPN ficticia.

```json
{
  "organization": {
    "name": "Red Canary VPN, incorporated",
    "uris": {
      "icon": "ipfs://bafybeicws2uqjbbcie7wvvjrer2fdgimr27xzylmebvdgmt3oeyad2o3zy/redcanarywc.png",
      "web": "https://www.example.com",
      "x": "https://x.com/example",
      "facebook": "https://www.facebook.com/example",
      "linkedin": "https://www.linkedin.com/company/example"
    }
  },
  "statement": "As of the date of this document, Red Canary VPN, incorporated has received no legal orders that we would be prohibited from disclosing, such as national security letters or gag orders.",
  "lastUpdated": "2023-12-29",
  "validUntil": "2024-01-29",
  "signature": {
    "type": "PGP",
    "value": "-----BEGIN PGP SIGNATURE-----\n...\n-----END PGP SIGNATURE-----"
  },
  "additionalInformation": {
    "noEncryptedDataRequests": true,
    "noBackdoorsInstalled": true,
    "noUserInformationDisclosed": true
  },
  "contactInformation": {
    "legalDepartmentEmail": "legal@example.com"
  },
  "disclaimer": "This warrant canary is provided for informational purposes only and should not be considered legal advice."
}
```

Una vez listo, subimos el archivo con el mensaje a IPFS.

<!-- TOC --><a name="nft-commitment"></a>

#### Compromiso del NFT

Podríamos crear el `commitment` del NFT de muchas maneras. Aquí van dos.

1. Crear un mensaje corto como “The FBI has not been here.” y codificarlo en hexadecimal: `5468652046424920686173206E6F74206265656E20686572652E`. Este es lo bastante corto para caber en el campo `commitment` del NFT.
2. Subir un archivo JSON (u otro) más detallado a IPFS, calcular su hash y poner el CID y el hash en el `commitment`. ¡Sin embargo, esto usa más bytes de los que caben actualmente en un `commitment` de NFT!

Solo el CID en hexadecimal ya ocupa 59 bytes: demasiado. Así que, por ahora, pongamos el hash SHA256 y el enlace de IPFS en el BCMR, y el hash SHA256 en el campo `commitment`.

<!-- TOC --><a name="write-the-bcmr"></a>

#### Escribir el BCMR

En realidad, este es solo otro ejemplo de NFT parseable con un tipo y un campo, igual que el ejemplo que vimos arriba. Así que el `parse.bytecode` es el mismo.

```json
{
  "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
  "version": { "major": 0, "minor": 1, "patch": 0 },
  "latestRevision": "2023-12-30T00:00:00.000Z",
  "registryIdentity": {
    "name": "Generic Warrant Canary Dapp Token Registry",
    "description": "An example demonstrating how a metadata registry might publish information about a warrant canary dapp.",
    "uris": {
      "icon": "ipfs://bafybeicws2uqjbbcie7wvvjrer2fdgimr27xzylmebvdgmt3oeyad2o3zy/warrantcanaryservice.png",
      "web": "https://example.com/",
      "registry": "https://example.com/.well-known/bitcoin-cash-metadata-registry.json"
    }
  },
  "identities": {
    "762f5b4007005579cad829954db5d6306c5b598ffc04fb9406aee3668af1a2c9": {
      "2023-12-29T00:00:00.000Z": {
        "name": "Red Canary VPN, incorporated",
        "description": "An identity for a fictitious VPN company that is issuing warrant canaries.",
        "token": {
          "category": "762f5b4007005579cad829954db5d6306c5b598ffc04fb9406aee3668af1a2c9",
          "symbol": "REDCANARY-WC",
          "nfts": {
            "description": "Warrant canaries issued by the fictitious Red Canary VPN, incorporated.",
            "fields": {
              "cid-hash": {
                "name": "CID Hash",
                "description": "The SHA256 hash of the IPFS Content Identifier of the warrant canary statement.",
                "encoding": {
                  "type": "hex"
                }
              }
            },
            "parse": {
              "bytecode": "006b00cf6b",
              "types": {
                "": {
                  "name": "Basic Warrant Canary",
                  "description": "A basic warrant canary for Red Canary VPN, first issued on Dec 30, 2023.",
                  "fields": ["cid-hash"],
                  "uris": {
                    "icon": "ipfs://bafybeicws2uqjbbcie7wvvjrer2fdgimr27xzylmebvdgmt3oeyad2o3zy/redcanarywc.png",
                    "web": "https://example.com/warrantcanary.html"
                  },
                  "extensions": {
                    "ipfs-url": "ipfs://bafkreicbw3qeh6h7zf7wo7xhtg6kuh7hahffjydvmreb6lamhidyabxc4i",
                    "cid-hash": "41B6E043F8FFC97F677EE799BCAA1FE701CA54E07564481F2C0C3A078006E2E2"
                  }
                }
              }
            }
          }
        },
        "uris": {
          "icon": "ipfs://bafybeicws2uqjbbcie7wvvjrer2fdgimr27xzylmebvdgmt3oeyad2o3zy/redcanarywc.png",
          "web": "https://example.com/warrantcanary.html",
          "support": "https://example.com/support.html"
        }
      }
    }
  },
  "license": "CC0-1.0"
}
```

<!-- TOC --><a name="create-the-nft"></a>

#### Crear el NFT

Esta es la [transacción](https://explorer.bitcoinunlimited.info/tx/7cca0abc512d405c610ffc89f58c232ace12ab6601853c3379037e5826616353) del NFT de acuñación.

Esta es la [transacción](https://explorer.bitcoinunlimited.info/tx/489266dc6b825021ebcf2361e97ff29c596efe5a9632eff4a77b13d2384506be) en la que se creó el NFT inmutable.

Así se ven los NFTs en la billetera Cashonize, poco después de la primera confirmación.

![](../../../assets/images/posts/tp4/cashonize-wc.png)

<!-- TOC --><a name="regular-updates"></a>

#### Actualizaciones periódicas

Los canarios de orden judicial solo funcionan si se actualizan con regularidad, de modo que el público pueda notar que las actualizaciones se han detenido. Al fin y al cabo, ¡si no hay más actualizaciones, el canario ya no es válido!

Una estrategia de actualización sería omitir la propiedad `validUntil` del JSON del canario y simplemente seguir actualizando el authhead (con el [script authUpdate.js](/blog/token-pioneers-cashtokens-tutorial-2#e-oops-authupdatejs-to-the-rescue)) con regularidad. Los clientes podrían ver simplemente cuándo se actualizó por última vez el authhead para saber la fecha de la última actualización del canario y así juzgar si sigue siendo válido.

Otra opción sería crear un nuevo NFT inmutable con un nuevo hash junto con el authhead, y actualizar el BCMR en consecuencia.

Para una organización como Cloudflare, que tiene varios canarios, imagino que cada uno sería un tipo nuevo dentro de su única identidad corporativa de BCMR.

Por suerte, las transacciones de BCH cuestan alrededor de una décima de centavo, así que si una entidad con un canario lo actualizara cada mes, le costaría aproximadamente 1,2 centavos de USD, o USD$0,012, al año. Es insignificante.

El diseño y la actualización de los canarios de orden judicial todavía requieren reflexión y comentarios. Aun así, espero que esto te haya ayudado a desarrollar tu modelo mental de los NFTs parseables.

<!-- TOC --><a name="full-featured-web3-warrant-canary-dapp"></a>

#### ¿Una dapp Web3 de canario de orden judicial completa?

Si te interesa aprender a convertir esto en una dapp Web3 de canario de orden judicial completa, ¡avísame [con un tuit](https://twitter.com/GeorgeDonnelly)! Puedo hacer un tutorial que te guíe paso a paso.

<!-- TOC --><a name="task-submit-your-warrant-canary-for-15000-xrbf"></a>

#### TAREA: envía tu canario de orden judicial por 15.000 XRBF

Crea cualquier canario de orden judicial con un NFT parseable y comparte tu trabajo en el [canal Panmoni CashTokens de Telegram](https://t.me/Panmoni/315).

La recompensa por completar la tarea con éxito es de **15.000 XRBF**.

<!-- TOC --><a name="conclusion"></a>

## Conclusión

Empezamos este tutorial con una idea básica de qué son los NFTs parseables y en qué se diferencian de los secuenciales, y luego desgranamos poco a poco las funcionalidades más profundas que los convierten en una herramienta tan potente en la blockchain de Bitcoin Cash.

Con proyectos prácticos, exploramos cómo diseñar y crear boletos NFT para un evento hipotético en el Veterans Stadium, teniendo en cuenta cuestiones reales como los asientos, los precios y las fechas del evento. Este ejercicio no solo ilustró la utilidad práctica de los NFTs parseables, sino que también demostró su potencial para ofrecer soluciones seguras, transparentes y eficientes para los sistemas de venta de boletos.

El proyecto del canario de orden judicial destacó además que los NFTs parseables sirven para algo más que representar activos. Al crear un sistema de comunicación proactiva, mostramos un enfoque innovador para mantener la transparencia y la confianza en los servicios digitales, una aplicación especialmente relevante en un mundo cada vez más digital.

Al cerrar este tutorial, es evidente que los NFTs parseables de CashTokens abren un abanico de posibilidades para desarrolladores, artistas e innovadores. Ya sea para crear boletos a prueba de manipulaciones, generar confianza con canarios de orden judicial o explorar nuevas aplicaciones, el poder de estos NFTs reside en su flexibilidad y escalabilidad.

Recuerda que los ejemplos presentados son solo la punta del iceberg. El verdadero potencial de los NFTs parseables en la blockchain de Bitcoin Cash solo está limitado por tu creatividad y tu comprensión de esta tecnología. Así que sigue experimentando, sigue aprendiendo y, sobre todo, sigue creando. El futuro de las aplicaciones blockchain es prometedor y, con herramientas como CashTokens, estás bien preparado para formar parte de este emocionante camino.

<!-- TOC --><a name="next-steps-for-builders-and-enthusiasts"></a>

### Próximos pasos para desarrolladores y entusiastas

Ahora que tienes estos conocimientos, los próximos pasos consisten en aplicarlos y experimentar:

1. **Haz las tareas**: completa las tareas de este tutorial para ganar hasta 25.000 XRBF. También puedes ganar más de 13.000 XRBF con los [tutoriales anteriores](/blog/token-pioneers-cashtokens-tutorial-3#earn-xrbf).

2. **Experimenta con NFTs parseables:** empieza a crear tus propios NFTs parseables. Experimenta con distintas estructuras de metadatos, bytecodes y casos de uso. ¿Qué otras aplicaciones pueden beneficiarse de las propiedades únicas de los NFTs parseables?

3. **Profundiza en BCH Script:** entender el lenguaje de scripting puede abrirte nuevas puertas para crear NFTs complejos e interactivos.

4. **Participa en la comunidad:** únete a [CashToken Devs](https://t.me/cashtoken_devs), participa en las conversaciones y colabora en proyectos. Tus aportes pueden tener un impacto importante.

5. **Mantente informado:** sigue los últimos avances del ecosistema BCH. Constantemente surgen nuevas herramientas, funciones y mejoras. Sigue a [@BitcoinCashSite](https://twitter.com/bitcoincashsite) y/o suscríbete a [r/BCHCashTokens](https://reddit.com/r/BCHCashTokens).

<!-- TOC --><a name="support-the-tutorial-series"></a>

### Apoya la serie de tutoriales

¿Quieres más tutoriales? Acepto donaciones para financiar este trabajo clave de enseñar a nuevos desarrolladores de BCH a crear dapps sin permisos e imparables con CashTokens en Bitcoin Cash. También puedes [patrocinar](/blog/token-pioneers-cashtokens-tutorial-1#sponsor-this-work) mi trabajo y obtener beneficios a cambio.

[bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8](bitcoincash:qz3pxmwda8gd42wa8k9yfxcwhcaapeuhygjc8mc4m8)

<!-- TOC --><a name="thank-you"></a>

### Gracias

Gracias a [Mathieu Geukens](https://twitter.com/GeukensMathieu) y a [BitcoinCashAutist](https://twitter.com/bchautist), que me dieron consejos útiles en el [grupo de Telegram CashToken Devs](https://t.me/cashtoken_devs).

Gracias a [toorik](https://twitter.com/toorik), anonymous, William Patrick, S0me_N0b0dy y na por su apoyo al [flipstarter](https://archive.li/UznMe) que hace posible esta serie de tutoriales “Token Pioneers”. Visita [BitcoinCashSite.com/about](/about) para ver la lista completa de más de 55 miembros de la comunidad que han financiado mi trabajo desde 2019.

<!-- TOC --><a name="additional-builder-resources"></a>

## Recursos adicionales para desarrolladores

- Una introducción decente a Bitcoin Script: [https://komodoplatform.com/en/academy/bitcoin-script/](https://komodoplatform.com/en/academy/bitcoin-script/)
- Por qué se incluye el contexto completo de la transacción en el parse.bytecode de BCMR: [https://t.me/cashtoken_devs/5864](https://t.me/cashtoken_devs/5864)
- Debate sobre la inclusión del contexto completo de la transacción. [https://github.com/bitjson/chip-bcmr/pull/7](https://github.com/bitjson/chip-bcmr/pull/7)
- [BitAuth IDE:  Write and Debug Custom Bitcoin Scripts](https://blog.bitjson.com/bitauth-ide-write-and-debug-custom-bitcoin-scripts/)
- [How to Write Custom Bitcoin Scripts in Bitauth IDE](https://blog.bitjson.com/how-to-write-custom-bitcoin-scripts-in-bitauth-ide/)
- Mentoría gratuita: [https://twitter.com/GeorgeDonnelly/status/1740093415268749563](https://twitter.com/GeorgeDonnelly/status/1740093415268749563)

Puedes encontrar una lista completa de recursos de CashTokens en [BitcoinCashSite.com/cashtokens](/cashtokens).

[![Token Pioneers](../../../assets/images/posts/tp1/token-pioneers-big.png)](https://gist.github.com/georgedonnelly/317aa1746159dc575c7f612eff475d56)
