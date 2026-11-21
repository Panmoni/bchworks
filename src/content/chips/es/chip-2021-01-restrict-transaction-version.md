---
title: Restringir la versión de transacción
code: CHIP-2021-01
owners:
  - Tom Zander
  - Jonathan Silverblood
  - bitcoincashautist
status: activated
upgrade: 2023-05-cashtokens
summary: Hizo inválidas por consenso las versiones de transacción distintas de 1 y 2, para que un futuro formato de transacción pueda usar un número de versión nunca antes visto.
spec: https://gitlab.com/bitcoin.cash/chips/-/blob/3b0e5d55e1e139046794e850287b7acb795f4e66/CHIP-2021-01-Restrict%20Transaction%20Versions.md
discussion: https://bitcoincashresearch.org/t/restrict-transaction-version-numbers/173
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2023-05-15 Network Upgrade Specification
    url: https://upgradespecs.bitcoincashnode.org/2023-05-15-upgrade/
  - title: Restrict transaction version numbers (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/restrict-transaction-version-numbers/173
  - title: Bitcoin Cash Upgrade 2023 (blog de bitjson)
    url: https://blog.bitjson.com/bitcoin-cash-upgrade-2023/
translation:
  sourceHash: 5fc04aa7999368e6
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Resumen

Antes de 2023, solo la política de retransmisión limitaba las transacciones a la versión 1 o 2. Cualquier número de versión era válido por consenso. Este
CHIP hace que las versiones 1 y 2 sean las únicas válidas, a nivel de consenso.

La especificación de la actualización de BCHN lo incluye como “CHIP-2021-01 Restrict Transaction Version”. Comparte el número 2021-01 con el
CHIP [Minimum Transaction Size](/chips/chip-2021-01-minimum-transaction-size), que es independiente.

## Motivación

Mark Lundeberg planteó el problema en el hilo de discusión de 2020. Cualquier formato de transacción nuevo debería usar un
número de versión nunca antes visto. Así, el software puede distinguir los formatos antiguos de los nuevos a partir de los primeros cuatro bytes, sin
ningún otro contexto.

Pero mientras cualquier versión fuera válida por consenso, un minero disruptivo podría minar transacciones con el formato antiguo usando el número
reservado para un formato nuevo, antes de que este se activara. Los analizadores tendrían entonces que saber de qué bloque proviene una transacción para
leerla. “El análisis sin contexto es muy valioso y vale la pena conservarlo” (traducción nuestra).

El hilo también estimó que el costo era casi nulo: los mineros usan la versión 1 para las transacciones coinbase, y las billeteras ya
estaban sujetas a la regla de política.

## Qué especifica

A partir de la actualización de mayo de 2023 (mediana del tiempo pasado `1684152000`), una transacción con una versión distinta de 1 o 2 es inválida.

## Estado actual

Se activó el 15 de mayo de 2023 con [CashTokens](/upgrades/2023-05-cashtokens). El resumen de la actualización de bitjson atribuye la propuesta a Tom
Zander, Jonathan Silverblood y bitcoincashautist. Abre el camino a un futuro formato como
[TXv5](/chips/chip-2025-01-txv5).

No se encontró ninguna tabla formal de partes interesadas para este CHIP.
