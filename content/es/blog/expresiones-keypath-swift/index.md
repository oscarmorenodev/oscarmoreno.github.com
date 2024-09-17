+++
title = "Cómo funcionan los key-path"
description = "Las expresiones key-path ofrecen una alternativa para el acceso a datos de los tipos"
summary = "Las expresiones key-path ofrecen una alternativa para el acceso a datos de los tipos"
date = 2024-09-17T08:00:00+02:00
translationKey = "keypaths"
+++

Los key-path son una característica de Swift que resultan confusas al principio.

Pero, con la llegada de SwiftUI, se ha extendido su uso.

Y su uso, no solo se limita al nuevo framework para las interfaces.

Conocerlo, te puede ayudar con alternativas para acceder a datos de los tipos.

## Escribir una expresión Key-Path

Las expresiones de ruta clave o key-path tienen esta estructura

`\<#type name#>.<#path#>`

El *type name*, es el nombre concreto de un tipo (estructura, clase, enumeración...) incluyendo tipos básicos como `Int`, `[String]` o `Set<Double>`.

El *path*, puede contener una propiedad, un subcript, u opcionales.

{{< alert "circle-info" >}}
Cuando se compila, la expresión key-path se reemplaza por una instancia de la [clase KeyPath](https://developer.apple.com/documentation/swift/keypath)
{{</ alert >}}

## Acceder a un valor usando un Key-Path

Así que, si quieres acceder a un valor de ruta clave, puedes hacerlo a través del subscript que pide un key-path, y que está disponible para todos los tipos

```swift
struct Driver {
    var name: String
}

let driver = Driver(name: "Fernando Alonso")
let pathToNameProperty = \Driver.name


let driverName = driver[keyPath: pathToNameProperty]
print(driverName) // Prints "Fernando Alonso"
```

Ten en cuenta, que el *type name* se puede omitir cuando la inferencia de tipos pueda saber el tipo que espera.

```swift
struct Race {
    var winner: Driver
    
    func displayWinnerProperty(keypath: KeyPath<Driver, String>) {
        print("The winner is \(winner[keyPath: keypath])")
    }
}

let sai = Driver(name: "Carlos Sainz")
let race = Race(winner: sai)
race.displayWinnerProperty(keypath: \.name) // Prints "The winner is Carlos Sainz"
```

### Key-Path de identidad

Además, el *path* puede hacer referencia a `self`, en lo que se conoce como *key-path de identidad* (`\.self`)

El key-path de identidad se refiere a la instancia en sí.

Gracias a eso, puede ser util para cambiar por ejemplo una instancia entera con una línea.

```swift
var verstappenPoints = (a: 25, b: 18, c:25)
// Equivalent to verstappenPoints = (a: 18, b: 25, c: 25)
verstappenPoints[keyPath: \.self] = (a: 18, b: 25, c: 25)
print(verstappenPoints) // Prints "(a: 18, b: 25, c: 25)"
````

Pero donde se suele aprovechar esta característica es en SwitUI, por ejemplo, en un ForEach

```swift
List {
    ForEach([2, 4, 6, 8, 10], id: \.self) {
        Text("\($0) is even")
    }
}
```

### Acceder a múltiples valores de un tipo

Otra de sus características es que es posible acceder a propiedades anidadas.

Es decir, hacer referencia a la propiedad del valor de una propiedad.

Puedes ver un ejemplo a continuación

```swift
struct Championsip {
    var winner: Driver
    
    init(winnerName: String) {
        self.winner = Driver(name: winnerName)
    }
}

let champion = Championsip(winnerName: "Max Verstappen")
let nestedKeyPath = \Championsip.winner.name

let championName = champion[keyPath: nestedKeyPath]
print(championName)  // Prints "Max Verstappen"
```

### Acceder a subscripts

Otra posibilidad que existe es que el *path* incluya [subscripts](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/) usando corchetes.

```swift
let tracks = ["Spa", "Monza", "Montmelo", "Suzuka"]
let fasterTrack = tracks[keyPath: \[String].[1]]
print(fasterTrack) // Prints "Monza"
```

{{< alert >}}
En este caso es imprescindible que el tipo del parámetro del subscript cumpla con el protocolo `Hashable`
{{</ alert >}}

Además, debes tener en cuenta que en este caso, los valores capturados usan la semántica por valor, en lugar de por referencia.

Por lo que una copia, no actualizará su propio valor, aunque modifiques el original.

Puedes verlo más claro en el siguiente ejemplo

```swift
var index = 1
let pathToTrack = \[String].[index]
let closure: ([String]) -> String = { strings in strings[index] }

print(tracks[keyPath: pathToTrack]) // Prints "Monza"
print(closure(tracks)) // Prints "bonjour"

index += 1
print(tracks[keyPath: pathToTrack])
// Prints "Monza"

// Because 'fn' closes over 'index', it uses the new value
print(closure(greetings))
// Prints "Spa"
```

### Acceder a valores opcionales

Para acceder a valores opcionales, simplemente tienes que hacer uso del encadenamiento de opcionales, o forzar el desempaquetado.

```swift
let firstTrack: String? = tracks.first
let count = tracks[keyPath: \[String].first?.count]
print(count as Any)
// Prints Montmelo characters number "Optional(8)"
```

## Key-Path como alternativa a closures y funciones

También puedes usar los key-path en otros contextos.

Por ejemplo, en los que tienes que pasar una función o un closure.

```swift
struct Lap {
    var time: Double
    var valid: Bool
}
var timelaps = [
    Lap(time: 106.0, valid: true),
    Lap(time: 99.5, valid: true),
    Lap(time: 102.0, valid: false)
]

// Usual
let validLaps1 = timelaps.filter{ $0.valid }
print(validLaps1.count) // Prints "2"

// Equivalent with key-paths
let validLaps2 = timelaps.filter(\.valid)
print(validLaps2.count) // Prints "2"
```

Fijate como al final del ejemplo, puedes filtrar las vueltas válidas con `.filter(\.valid)` en lugar de con el habitual `.filter{ $0.valid }`.

## Ámbito de los Key-Path

Por último, en relación a los key-path, hay algo importante que debes tener en cuenta.

{{< alert "circle-info" >}}
Los resultados de una expresión key-path solo se evaluan en el punto en el que dicha expresión se evalua.
{{< /alert>}}

Si llamas a una función dentro de un subscript en una expresión key-path, la función se llamará solo una vez, como parte de la evaluación de la expresión, pero no siempre que se use el key-path.

Puedes verlo en este ejemplo:

```swift
func displayValidLap() -> Int {
    print("Valid lap!")
    return 0
}

let greetingKeyPath = \[Lap][displayValidLap()]
// Prints "Valid lap!"

// Using greetingKeyPath doesn't call displayValidLap again.
let someLap = timelaps[keyPath: greetingKeyPath]
```

## Conclusión

Los key-path son complejos, y es una característica que cuesta ver su utilidad.

No obstante, son utilizados en SwiftUI, por lo que es importante conocerlos y entenderlos.

Lo más importante, recuerda que:

- Su estructura es `\<#type name#>.<#path#>`.
- El *type name* es el nombre del tipo y el *path* es el nombre de la propiedad de dicho tipo.
- Cuando se compila, se reemplaza por una instancia de la clase `KeyPath`
- Puedes acceder a
  - Un parámetro
  - Una instancia completa (`\.self`)
  - Un subscript
  - Un valor opcional

Y como la práctica hace el maestro, te dejo un playground para que puedas jugar 😉

{{% resources pattern="key-paths-swift.playground.zip"/%}}

## Fuente

[Expresiones Key-path - Documentación de Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/expressions/#Key-Path-Expression)
