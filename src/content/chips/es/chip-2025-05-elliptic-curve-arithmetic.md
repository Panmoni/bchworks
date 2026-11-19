---
title: Operaciones nativas de aritmética de curva elíptica
code: CHIP-2025-05
owners:
  - lightswarm
status: draft
summary: Propone OP_ECADD y OP_ECMUL para la suma de puntos de curva elíptica y la multiplicación escalar en Script, con el objetivo de habilitar pruebas de conocimiento cero y la agregación de firmas.
spec: https://github.com/lightswarm124/bch-ec-arithmetic
discussion: https://bitcoincashresearch.org/t/chip-2025-05-native-elliptic-curve-arithmetic-operations/1570
stakeholders: []
verified: 2026-09-26T00:00:00.000Z
sources:
  - title: CHIP 2025-05 Native Elliptic Curve Arithmetic Operations (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/chip-2025-05-native-elliptic-curve-arithmetic-operations/1570
  - title: Repositorio bch-ec-arithmetic
    url: https://github.com/lightswarm124/bch-ec-arithmetic
  - title: 2027 protocol upgrade ideas (Bitcoin Cash Research)
    url: https://bitcoincashresearch.org/t/2027-protocol-upgrade-ideas/1719
translation:
  sourceHash: e17604af4c037497
  status: machine
  translator: Claude
  qaHash: 3bcae3d4f9b370e2
---

## Resumen

La propuesta agrega dos opcodes (códigos de operación), `OP_ECADD` (suma de puntos de curva elíptica) y `OP_ECMUL` (multiplicación escalar), para que
los contratos puedan hacer cálculos de curva elíptica directamente.

Nota: este CHIP comparte el prefijo de fecha “CHIP-2025-05” con los CHIPs no relacionados [Funciones](/chips/chip-2025-05-functions)
y [Operaciones a nivel de bits](/chips/chip-2025-05-bitwise).

## Motivación

Según el autor, las operaciones nativas de curva elíptica permitirían que los contratos BCH “validen de forma nativa pruebas de conocimiento cero, habiliten
la agregación de firmas y sienten las bases para protocolos escalables de privacidad y fuera de la cadena como Bulletproofs, todo
sin recurrir a configuraciones de confianza ni a sistemas de prueba externos” (traducción nuestra).

Estas operaciones ya pueden aproximarse con covenants (contratos que limitan cómo se pueden gastar las monedas) y [bucles](/chips/chip-2021-05-loops), pero “con un costo
enorme en complejidad, tamaño y costo de ejecución” (traducción nuestra).

## Qué especifica

El borrador inicial especifica la suma de puntos y la multiplicación escalar. En discusiones posteriores se señaló que una activación en 2027
requeriría publicar pronto una versión completamente especificada, posiblemente con más opcodes además de estos dos.

## Estado actual

Borrador, publicado por primera vez el 23 de mayo de 2025. En el hilo “2027 protocol upgrade ideas” (diciembre de 2025), kzKallisti lo incluyó entre
los CHIPs destacados que estaban “incompletos y sin consenso” (traducción nuestra). En agosto de 2026 dijo que “consideraría respaldar un
CHIP bien especificado, medido con benchmarks y probado para fijarlo en 2027” (traducción nuestra). No está fijado y no se encontraron declaraciones formales
de las partes interesadas. The BCH Podcast mencionó una página de sondeo de opinión sobre la propuesta en consensus.cash.
