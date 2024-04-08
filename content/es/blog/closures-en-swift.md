+++
title = "Entendiendo los closures en Swift"
description = "Un closure es un bloque que puede ser usado en tu código"
summary = "Un closure es un bloque que puede ser usado en tu código"
date = 2023-09-05
translationKey = 'closures'
+++

Los closures son un concepto fundamental en Swift. Son herramientas poderosas que te permiten definir y manipular bloques de código, por eso se les considera ciudadanos de primera clase. En este artículo, exploraremos los closures, los closures finales, la captura de valores y el hecho de que los closures son tipos por referencia

## Closures
Un closure es un bloque de código autónomo que se puede pasar y utilizar en el código, como cualquier otra constante o variable. En Swift, puedes definir closures usando las llaves {}. Este sería un ejemplo sencillo:
```swift
let greet = {
    print("Hello, world!")
}
```

## Closures finales
Los closures finales son una forma conveniente de incluir un closure como último argumento de una función. Esto hace que tu código sea más legible. Supongamos que tienes una función que toma un closure como argumento:

```swift
func performAction(action: () -> Void) {
    // Perform some setup
    action()
}

// Using a trailing closure
performAction {
    print("Action performed!")
}
```

## Capturando valores
Los closures pueden capturar y almacenar referencias a variables y constantes del contexto en el que se definen. Esto significa que pueden "recordar" y manipular esos valores incluso si ya no están dentro de su ámbito. Mira este ejemplo:

```swift
func makeIncrementer(incrementAmount: Int) -> () -> Int {
    var total = 0
    let incrementer: () -> Int = {
        total += incrementAmount
        return total
    }
    return incrementer
}

// Usage example:
let incrementByTwo = makeIncrementer(incrementAmount: 2)
let incrementByFive = makeIncrementer(incrementAmount: 5)

print(incrementByTwo())  // Output: 2
print(incrementByTwo())  // Output: 4
print(incrementByTwo())  // Output: 6

print(incrementByFive())  // Output: 5
print(incrementByFive())  // Output: 10
print(incrementByFive())  // Output: 15
```

En este ejemplo, definimos la función `makeIncrementer`, que toma un `incrementAmount` como argumento y devuelve un closure de tipo `() -> Int`. Cada vez que llama al closure devuelto, incrementa la variable total en el valor de `incrementAmount` especificado y devuelve el total actualizado. Creamos dos closures separados, `incrementByTwo` e `incrementByFive`, cada uno con su propio total capturado y su `incrementAmount`. Cuando llamamos a estos closures varias veces, puedes ver cómo mantienen su estado individual y aumentan en sus respectivos cantidades.

## Los closures son tipos por referencia
Los closures son más que simples bloques de código, son tipos por referencia. Puedes declarar un closure y las variables de ese tipo pueden contener closures con las mismas firmas. Esto te permite definir funciones que toman closures como parámetros, o que los devuelven como resultados, proporcionando flexibilidad y reutilización en tu código.

## Conclusión
En resumen, los closures son un concepto clave en Swift y comprenderlos es esencial para cualquier desarrollador de iOS. Proporcionan una forma flexible de trabajar con código y datos, ya sea que estés creando funciones simples u operaciones asíncronas avanzadas. Al dominar los closures, rastrearlos, capturar valores y reconocer que los closures son tipos por referencia, estarás mejor capacitado para escribir código Swift eficiente y legible.