+++
title = "Accede a elementos de colecciones de forma sencilla"
description = "Los subscripts te permiten acceder de forma más flexible y personalizada a distintos datos"
summary = "Los subscripts te permiten acceder de forma más flexible y personalizada a distintos datos"
date = 2024-10-08T08:00:00+02:00
translationKey = "subscripts"
+++

Hace unas semanas escribiendo sobre los [key-path](../expresiones-key-path-swift) me llamó la atención el uso de los **subscripts**.

En español lo podríamos traducir como *subíndices*.

Así, que seguí investigando sobre ello, y como he visto las ventajas que ofrecen, te explico como aprovecharlos para tener un código más personalizado y legible.

## Qué son los subscripts en Swift

Los subscripts en Swift te facilitan una forma flexible de acceder a elementos que se encuentran en colecciones, secuencias o tipos personalizados.

Esos tipos personalizados podrían ser clases, estructuras o enumeraciones.

Ofrecen una sintaxis sencilla para establecer y recuperar valores sin necesidad de métodos separados para *getters* y/o *setters*.

Los subscripts son métodos especiales que permiten acceder a elementos en un tipo similar a una colección.

Y para ello, se hace uso de la misma notación que los [arrays](../colecciones-swift.md#arrays). Es decir, mediante corchetes `[ ]`.

## Cómo se crean subscripts

Para crear un subscript, simplemente debes crear un método con el nombre `subscript`.

```swift
subscript(index: Index) -> OutputType {
    get {
        // Return a value
    }
    set(newValue) {
        // Set a value
    }
}
```

No es obligadorio usar el `set`, podrías simplemente devolver el valor, por lo que tampoco sería necesario indicar explícitamente el `get`.

```swift
subscript(index: Index) -> OutputType {
    // Return a value
}
```

## Cómo acceder a elementos mediante subscripts en Swift

Siguiendo la sintaxis explicada, aquí puedes ver como crear un método `subscript` para una estructura que te devuelva el elemento que le pidas de la secuencia Fibonacci.

```swift
struct Fibonacci {
    subscript(position: Int) -> Int {
        guard n > 1 else { return n }
        var a = 0, b = 1
        for _ in 2...n {
            let temp = a + b
            a = b
            b = temp
        }
        return b
    }
}
```

Como ves, al método `subscript`, se le puedes pasar un parámetro `position` para saber la posición del elemento que quieres obtener.

Como también puedes comprobar, no necesitas un *setter* para establecer un valor.

Así que si le indicas la posición que quieres, podrás tener el valor de esa posición.

```swift
let fib = Fibonacci()
// Prints "13"
print(fib[7]) 
```

## Subscripts con múltiples parámetros

Los subscripts pueden tomar múltiples parámetros, permitiendo formas de acceso más complejas.

Aquí puedes ver un ejemplo de una estructura para formar un cubo en 3D.

```swift
struct Cube3D {
    private var cells: [[[Int]]]
    let size: Int
    
    init(size: Int, defaultValue: Int = 0) {
        self.size = size
        self.cells = Array(repeating: Array(repeating: Array(repeating: defaultValue, count: size), count: size), count: size)
    }
    
    subscript(x: Int, y: Int, z: Int) -> Int {
        get {
            guard isValidIndex(x: x, y: y, z: z) else {
                fatalError("Index out of range")
            }
            return cells[x][y][z]
        }
        set {
            guard isValidIndex(x: x, y: y, z: z) else {
                fatalError("Index out of range")
            }
            cells[x][y][z] = newValue
        }
    }
    
    subscript(xRange: Range<Int>, yRange: Range<Int>, z: Int) -> [[Int]] {
        guard isValidRange(xRange: xRange, yRange: yRange, z: z) else {
            fatalError("Range out of cube bounds")
        }
        return xRange.map { x in
            yRange.map { y in
                cells[x][y][z]
            }
        }
    }
    
    private func isValidIndex(x: Int, y: Int, z: Int) -> Bool {
        return x >= 0 && x < size && y >= 0 && y < size && z >= 0 && z < size
    }
    
    private func isValidRange(xRange: Range<Int>, yRange: Range<Int>, z: Int) -> Bool {
        return xRange.lowerBound >= 0 && xRange.upperBound <= size &&
               yRange.lowerBound >= 0 && yRange.upperBound <= size &&
               z >= 0 && z < size
    }
}
```

Tras los parámetros y el inicializador, cuenta con dos métodos `subscript`.

El primero toma tres parámetros de posición, para determinar el lugar en el cubo 3D, y tiene tanto un getter como un setter.

El segundo también toma varios parámetros, de tipo `Range`.

Este segundo subscript, permitiría obtener una porción en 2D, del cubo.

{{< alert >}}
Como estás tratando con colecciones y secuencias, es muy importante comprobar que nunca se accede a posiciones fuera del índice para evitar crashes. Por eso los métodos `isValidIndex` e `isValidRange`.
{{</ alert >}}

Y ahora, podrás asignar y recuperar los valores del cubo.

```swift
var cube = Cube3D(size: 5, defaultValue: 0)

cube[0, 0, 0] = 1
cube[1, 2, 3] = 5
cube[4, 4, 4] = 9

// Prints  "1"
print(cube[0, 0, 0])
// Prints "5"
print(cube[1, 2, 3])
// Prints "9"
print(cube[4, 4, 4])

let slice = cube[0..<2, 0..<3, 0]
// Prints [[1, 0, 0], [0, 0, 0]]
print(slice)
```

## Subscripts de Tipo

También puedes definir subscripts en el tipo mismo, en lugar de en las instancias.

Para ello, simplemente indica la palabra clave `static` antes de `subscript`, de igual forma que harías cualquier método estático.

```swift
enum DayOfWeek: Int {
    case monday = 1
    case tuesday
    case wednesday
    case thursday
    case friday
    case saturday
    case sunday
    
    static subscript(index: Int) -> DayOfWeek? {
        return DayOfWeek(rawValue: index)
    }
}
```

Y ahora, si quieres acceder a cualquier día de la semana de la enumeración, solo debes indicar su índice.

```swift
// day is equal to .wednesday
let day = DayOfWeek[3]
```

{{< alert >}}
Fíjate que al lunes se le ha asignado 1 ya que, al menos en España, el lunes es el primer día de la semana.
Y queda más natural acceder a él de esa forma. Si no se hubiera indicado, en el ejemplo anterior, `day` sería igual a `thursday` y al caso `monday` se accedería a través del índice 0.
{{</ alert >}}

## Conclusiones

Resumiendo, sobre los *subscripts*, los puntos más importantes:

- Proporcionan acceso abreviado a elementos de colecciones.
- Se pueden usar tanto para obtener, como para establecer valores.
- Se pueden definir múltiples subscripts para un solo tipo.
- Los subscripts pueden tener múltiples parámetros de entrada.
- Puedes crear subscripts estáticos que no pertenecen a la instancia sino al tipo.

Pero, ten en cuenta lo siguiente para aprovecharlos al máximo:

- Úsalos cuando te faciliten una sintaxis más natural para acceder a elementos en tus tipos personalizados.
- Recuerda manejar los errores y verificar los límites en los subscripts.
- Asegúrate cuando debes utilizar subscripts de solo lectura o de lectura/escritura.
- Usa subscripts de tipo únicamente cuando tenga sentido acceder a valores directamente en el tipo en lugar de en las instancias.

Y como es habitual, te dejo el playground para que practiques.
{{% resources pattern=".*\.(zip)" color="blue" icon="fa-solid fa-file-arrow-down" /%}}

## Sources

[Subscripts - Documentación oficial de Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
