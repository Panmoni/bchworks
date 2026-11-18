---
title: Firmas poscuánticas e híbridas
code: CHIP-2026-06
owners:
  - mainnet_pat
  - bitcoincashautist
status: draft
summary: Propone que los opcodes de firma existentes verifiquen más de un esquema de firma, empezando por SPHINCS+ poscuántico y claves híbridas secp256k1 más PQ, que se pueden gastar desde salidas P2PKH comunes.
spec: https://gitlab.com/mainnet-pat/chip-2026-06-generic-sigs
discussion: https://bitcoincashresearch.org/t/chip-2026-06-post-quantum-and-hybrid-signatures/1864
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: 'CHIP-2026-06: Firmas poscuánticas e híbridas (Bitcoin Cash Research)'
    url: https://bitcoincashresearch.org/t/chip-2026-06-post-quantum-and-hybrid-signatures/1864
  - title: Repositorio de firmas genéricas de CHIP-2026-06
    url: https://gitlab.com/mainnet-pat/chip-2026-06-generic-sigs
translation:
  sourceHash: 6192ed54290b2e91
  status: machine
  translator: Claude
---

## Resumen

La propuesta añade **despacho genérico de firmas** a los opcodes (códigos de operación) de verificación de firmas de Bitcoin Cash. El primer byte de una clave pública
selecciona su esquema de firma en un registro: hoy secp256k1, con esquemas poscuánticos (PQ) como Falcon-512 y
SPHINCS+ que se irán añadiendo con el tiempo.

Una **clave compuesta** une dos esquemas bajo un mismo firmante con lógica AND. Un gasto híbrido, como secp256k1 más un esquema
PQ, solo es válido si todas sus partes se verifican. La idea de las firmas híbridas vino de bitcoincashautist; mainnet_pat
escribió el diseño del despacho.

## Motivación

Algún día, computadoras cuánticas grandes podrían romper las firmas de curva elíptica que hoy protegen BCH. Este CHIP prepara un
camino hacia el gasto resistente a la computación cuántica sin un nuevo tipo de dirección. Las claves híbridas cubren ambos lados: si cualquiera de los dos esquemas resiste,
las monedas siguen seguras.

## Qué especifica

- Ningún opcode nuevo y ningún tipo de salida nuevo.
- Las claves PQ e híbridas gastan desde salidas P2PKH comunes que se comprometen con `HASH160(public key)`, así que las herramientas de direcciones
  existentes siguen funcionando.
- Estos gastos conservan la cobertura de [prueba de doble gasto](/glossary#dsproof), que una bóveda PQ basada en script tendría que
  volver a ganarse con trabajo adicional en el protocolo.
- Qué esquemas habilitar es una pregunta para más adelante. Los autores proponen empezar con SPHINCS+ (basado en hash) y la
  variante híbrida mientras los esquemas basados en retículos maduran.

## Estado actual

Borrador, publicado el 10 de junio de 2026. La discusión continuó hasta julio de 2026, con un debate sobre esquemas basados en retículos frente a
esquemas basados en hash. No está asegurado para ninguna actualización y no se encontraron declaraciones formales de las partes interesadas.
