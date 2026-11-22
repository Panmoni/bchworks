---
title: 'Mayo de 2019: firmas Schnorr y recuperación de SegWit'
date: 2019-05-15T12:00:00.000Z
status: activated
height: 582680
summary: OP_CHECKSIG y OP_CHECKDATASIG empezaron a aceptar firmas Schnorr y las monedas enviadas por error a direcciones SegWit P2SH pasaron a ser recuperables.
keywords:
  - may 2019 upgrade
  - bitcoin cash schnorr
  - schnorr signatures bch
  - segwit recovery
  - bch segwit coins
chips: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 2019-MAY-15 Network Upgrade Specification (especificaciones de las actualizaciones de BCHN)
    url: https://upgradespecs.bitcoincashnode.org/2019-05-15-upgrade/
  - title: 2019-MAY-15 Schnorr Signature specification
    url: https://upgradespecs.bitcoincashnode.org/2019-05-15-schnorr/
  - title: 2019-MAY-15 Segwit Recovery specification
    url: https://upgradespecs.bitcoincashnode.org/2019-05-15-segwit-recovery/
  - title: Datos de bloques de Blockchair (verificación de la mediana del tiempo pasado)
    url: https://api.blockchair.com/bitcoin-cash/raw/block/582679
translation:
  sourceHash: 89611129b17d1e6f
  status: reviewed
  translator: Claude
  reviewer: George Donnelly
---

## Qué cambió

La activación llegó cuando la [mediana del tiempo pasado](/glossary#median-time-past) alcanzó el tiempo Unix `1557921600`
(15 de mayo de 2019, 12:00 UTC). El primer bloque con las nuevas reglas es el de altura 582680. A partir de esta actualización, las actualizaciones de BCH
se activan a las 12:00 UTC del día 15.

Cambios de consenso:

- **[Firmas Schnorr](/glossary#schnorr-signatures).** [`OP_CHECKSIG`](/opcodes/op_checksig),
  [`OP_CHECKSIGVERIFY`](/opcodes/op_checksigverify), [`OP_CHECKDATASIG`](/opcodes/op_checkdatasig) y
  [`OP_CHECKDATASIGVERIFY`](/opcodes/op_checkdatasigverify) ahora aceptan firmas Schnorr además de ECDSA. Una
  firma de 65 bytes (64 bytes más un byte de hashtype) se interpreta como Schnorr para `OP_CHECKSIG`; una firma de 64 bytes se interpreta como
  Schnorr para `OP_CHECKDATASIG`. Las claves públicas existentes sirven para ambos esquemas.
- **Recuperación de SegWit.** BCH nunca adoptó SegWit. Algunos usuarios enviaron BCH por error a direcciones P2SH de estilo SegWit, y la
  regla clean-stack de 2018 había hecho que esas monedas no se pudieran gastar. Esta actualización las exime, así que se pueden volver a gastar.

La multifirma ([`OP_CHECKMULTISIG`](/opcodes/op_checkmultisig)) todavía no recibió Schnorr. Llegó
[seis meses después](/upgrades/2019-11-upgrade).

## Por qué

La especificación de Schnorr enumera cuatro ventajas frente a ECDSA:

- Una prueba de seguridad conocida.
- Ninguna maleabilidad desconocida por parte de terceros.
- Linealidad, que permite una agregación sencilla de firmas entre varias partes.
- Validación por lotes, que puede acelerar la verificación de transacciones grandes y la sincronización inicial.

Las firmas Schnorr también tienen una longitud fija. Las firmas ECDSA varían de tamaño (normalmente 71–72 bytes), lo que complica
la estimación de comisiones y el diseño de contratos.

La recuperación de SegWit buscaba corregir errores de los usuarios. Ojo con la trampa que señala la especificación: una vez que se revela el redeem script (por
ejemplo, al gastar desde la dirección BTC correspondiente), cualquier minero puede quedarse con esas monedas. La recuperación ayudó, pero no
garantizaba que el dueño original las recuperara.

## Qué permite

- **Firmas más pequeñas y de tamaño fijo** para las billeteras que elijan Schnorr, sin necesidad de un nuevo tipo de dirección.
- **Firma entre varias partes.** La linealidad abre la puerta a las firmas agregadas, en las que varias personas producen una sola
  firma.
- **Tamaños de contrato predecibles.** Los covenants (contratos que limitan cómo se pueden gastar las monedas) que verifican firmas conocen de antemano la longitud exacta en bytes.
