+++
title = "Números en Swift"
description = "Programar ha sido a menudo para procesar números y obtener resultados demasiado difíciles de calcular por humanos"
summary = "Programar ha sido a menudo para procesar números y obtener resultados demasiado difíciles de calcular por humanos"
date = 2023-01-30
translationKey = "numeros"
+++

La programación ha sido utilizada a menudo para procesar números y obtener resultados difíciles de calcular para los humanos: distancias del universo, radios de planetas, pi...

Así, es parte del aprendizaje fundamental, en Swift en particular y en programación en general.

Básicamente hay 2 tipos de números en Swift: Enteros y números de coma flotante. Cada uno representa un rango diferente y se utiliza para diferentes objetivos.

## Enteros

Un número entero (también llamado int, abreviado) es posiblemente el número más utilizado. Podríamos decir que es el más simple, porque no tiene componente fraccional.

Puede ser positivo, cero o negativo. Por ejemplo, números enteros son: 5, -3, 99, -256...

Además, Swift proporciona enteros con signo y sin signo para 8,16, 32 y 64 bits. Siguiendo la convención de nombres de C, el tipo de número sin signo de 8 bits es UInt8, mientras que el de 16 bits con signo es Int16. Pero, no se utiliza frecuentemente en la mayoría de las aplicaciones desarrolladas.

### Rango de enteros
Depende del número de bits, pero cada uno tiene un número máximo y mínimo para almacenar. Puedes comprobarlo en la siguiente lista.

- **UInt8**: de 0 a 255
- **UInt16**: de 0 a 65535
- **UInt32**: de 0 a 4294967295
- **UInt64**: de 0 a 18446744073709551615
- **Int8**: de -128 a 127
- **Int16**: de -32768 a 32767
- **Int32**: de -2147483648 a 2147483647
- **Int64**: de -9223372036854775808 a 9223372036854775807

Pero, si no recuerdas los valores, puedes usar los métodos .max o .min

```swift
let minValue = Int.min //minValue is equal to
let maxValue = Int.max //maxValue is equal to
```

## Números de coma flotante
A diferencia de los enteros, los números de coma flotante tienen un componente fraccional. Pero, al igual que los enteros, pueden ser positivos o negativos.
Existen dos tipos de números de punto flotante con signo
### Doble
Los números Double representan un número de punto flotante de 64 bits y tienen una precisión de al menos 15 dígitos decimales.
### Flotante
Los números Float representan un número de punto flotante de 32 bits y tienen una precisión de al menos 6 dígitos decimales.

***
*NOTA: Necesitarás Double o Float dependiendo de múltiples factores, pero si cualquiera de los dos fuera apropiado, la documentación de Swift recomienda usar Double.*

