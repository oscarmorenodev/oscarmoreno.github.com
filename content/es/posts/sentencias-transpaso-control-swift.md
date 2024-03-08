+++
title = "Explorando las sentencias de traspaso de control en Swift"
description = "Alterar el flujo de control dentro del código"
date = 2023-04-17
translationKey = "traspaso-control"
+++

Las sentencias de traspaso de control son herramientas esenciales en programación que te permiten alterar el flujo de ejecución dentro de tu código.

En Swift, tres sentencias de traspaso de control de uso común son `continue`, `break`, y `fallthrough`. 

En este artículo, examinaremos cada una de estas sentencias, dando ejemplos y explicando los escenarios en los que es más apropiado utilizarlas.

## Continue
`continue` se usa principalmente dentro de bucles (como `for-in` o `while`) para omitir el código restante dentro de la iteración actual y pasar a la siguiente. Te permite omitir selectivamente partes específicas de un bucle sin terminarlo por completo.
Aquí un ejemplo para ilustrar su uso:

```swift
for number in 1...10 {
    if number % 2 == 0 {
        continue
    }
    print(number)
}
```

Resultado
```swift
1
3
5
7
9
```

En este ejemplo, la instrucción `continue` se utiliza para omitir la impresión de números pares. Cuando la condición `number % 2 == 0` es verdadera, se ejecuta la instrucción `continue`, omitiendo la instrucción `print` y pasando a la siguiente iteración.

## Break
`break` se utiliza para finalizar prematuramente la ejecución de un bucle o una sentencia de cambio. Te permite salir de un bucle o bloque `switch` antes de llegar a su final natural.

Fñijate el siguiente ejemplo:

```swift
let cars = [“Red Bull", “Aston Martin", “Ferrari", "Mercedes", "McClaren"]

for name in names {
    if name == "Mercedes" {
        break
    }
    print(name)
}
```

Resultado
```swift
Red Bull
Aston Martin
Ferrari
```

En este caso, la sentencia `break` se utiliza para salir del bucle una vez que la condición `name == "Mercedes"` es verdadera. Como resultado, el bucle termina antes de tiempo y los elementos restantes del array `cars` no se imprimen.

## Fallthrough
`fallthrough` se usa exclusivamente dentro de las sentencias de cambio. Permite que el flujo de control pase al siguiente caso sin realizar una "interrupción" implícita.

Este comportamiento es distinto del comportamiento predeterminado de un `switch`, donde el control de la ejecución sale automáticamente del bloque después de que coincida un caso.

Veamos el siguiente ejemplo:

```swift
let grade = "A"

switch grade {
    case "A":
        print("Excellent")
        fallthrough
    case "B":
        print(“You have approved")
    case "C":
        print("Average")
    default:
        print("Incomplete")
}
```

Resultado
```swift
Excellent
Good
```

En este ejemplo, cuando la calificación es `A`, la instrucción `fallthrough` se utiliza para continuar la ejecución al siguiente caso sin salir del bloque de cambio. Como resultado, se imprimirán `Excellent` y `You have approved`.

## Conclusión
Entender las sentencias de traspaso de control como `continue`, `break`, and `fallthrough` es crucial para una programación en Swift eficaz.

`continue` te permite omitir iteraciones específicas dentro de los bucles, `break` resultará en la terminación prematura de bucles o switches, y `fallthrough` hará que el control fluya al siguiente caso en un `switch`.
 
Al aprovechar estas sentencias de manera adecuada, puedes mejorar la flexibilidad y el control de la ejecución de tu código desarrollando iOS.