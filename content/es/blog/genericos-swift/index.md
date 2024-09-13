+++
title = "Optimizar código en Swift gracias a los genéricos"
description = "Los genéricos en Swift permiten utilizar código muy similar para operaciones con distintos tipos"
summary = "Los genéricos en Swift permiten utilizar código muy similar para operaciones con distintos tipos"
date = 2024-10-01T08:00:00+02:00
translationKey = "generics"
+++

A medida que la complejidad de los proyectos crecen, es habitual crear código muy similar.

Ya sabes que la mejor forma de optimizarlo es no repetirlo.

O al menos, aprovechar los puntos comunes.

Pues para ese caso te puede ser de gran ayuda utilizar *genéricos*.

Pueden parecer complejos al principio.

Pero si te acostumbras a usarlos, tendrás un código más limpio y reutilizable.

## ¿Por qué usar los genéricos en Swift?

Imagina que tienes un método tan sencillo como el siguiente que muestra un mensaje con un valor que pasas como parámetro.

```swift
func logString(value: String) {
    print("INFO - Value recorded: \(value)")
}

// Prints "INFO - Value recorded: RandomResult"
logString(value: "RandomResult") 
```

Pero ¿y su necesitas pasar también un valor de tipo entero?

Ese método también sería sencillo.

```swift
func logInt(value: Int) {
    print("INFO - Value recorded: \(value)")
}

// Prints "INFO - Value recorded: 10"
logInt(value: 10)
```

Pero, cómo seguramente te has dado cuenta, es prácticamente igual que el primero.

Además ¿y si quisieras capturar valores del resto de tipos de datos? `Double`, `Bool`, `Float`...

Posiblemente, ya has adivinado el problema que esto te puede traer.

Habría una cantidad importante de código duplicado, y por lo tanto, ineficiente.

Este es el problema que resuelven los genéricos.

Permiten crear funciones y tipos, que trabajen con distintos tipos sin tener que repetir código tan similar.

## ¿Cómo se crean los genéricos en Swift?

Swift te permite crear tanto funciones genéricas, como tus propios tipos genéricos.

### Nombres de parámetros de tipos

Antes de crear genéricos, es importante entender como nombrarlos.

Aunque no te hayas dado cuenta, ya has utilizado los genéricos previamente.

Como por ejemplo, cuando has utilizado un [array](../colecciones-swift#arrays), que se define como `Array<Element>`.

Siendo `Element` cualquier tipo que componga el array: `String`, `Int`, `Double`...

Lo mismo ocurre con los [diccionarios](../colecciones-swift#diccionarios), ya que en este caso se definen como `Dictionary<Key, Value>`.

Por eso los diccionarios trabajan con dos elementos: una clave y un valor.

En algunos casos, se usan este tipo de nombres descriptivos en los genéricos: `Element`, `Key`, `Value`...

Pero en otros, cuando no hay una relación que tenga sentido, se suele usar simplemente una letra mayúscula.

La convención, en este último caso, es usar `T`, `U` o `V`.

¿Y si necesitas más? Bueno, en ese caso... igual deberías revisar ese código para evitar tantos parámetros 😉

### Funciones genéricas

Tomando el ejemplo anterior sobre mensajes de log, podrías crear una función genérica de la siguiente forma:

```swift
func log<T>(value: T) {
    print("INFO - Value recorded: \(value)")
}
```

La primera diferencia, es sustituir el tipo de los parámetros de entrada de la función.

Es decir, el tipo del parámetro `value` es `T`, en lugar de `String` o `Int`.

`T` se refiere a cualquier tipo de Swift.

Y la segunda diferencia, es incluir a continuación del nombre de la función, el tipo genérico que se va a utilizar, entre los signos `<` y `>`.

### Tipos genéricos

Los genéricos no se limitan solo a las funciones.

Imagina que quieres crear un almacen para guardar valores de tipo `String`.

Podría ser una estructura como la siguiente:

```swift
struct StringsStore {
    var content: [String]
    
    mutating func add(string: String) {
        content.append(string)
    }
    
    mutating func clear() {
        content.removeAll()
    }
}
```

Pero de nuevo, tendrías la limitación anterior si quisieras aceptar también enteros.

Así que, como en el caso de las funciones, habría que sustituir el tipo de los parámetros, usando por ejemplo `Element`.

Y a continuación del nombre del tipo, es donde incluirías el tipo con los signos`<Element>`.

```swift
struct ValuesStore<Element> {
    var content: [Element]
    
    mutating func add(value: Element) {
        content.append(value)
    }
    
    mutating func clear() {
        content.removeAll()
    }
}
```

Y ahora sí, puedes usarlo con distintos tipos:

```swift
var intsStore = ValuesStore(content: [2,4,5])
intsStore.add(value: 10)

// Prints "[2, 4, 5, 10]"
print(intsStore.content)

var doublesStore = ValuesStore(content: [2.5, 4.7, 5.8])
doublesStore.add(value: 4.7)

// Prints "[2.5, 4.7, 5.8, 4.7]"
print(doublesStore.content)
```

## Extensiones de genéricos

Puedes crear también extensiones de tipos genéricos.

Y no necesitas indicar de nuevo el tipo de parámetro.

Es decir, puedes usar el mismo de su definición.

En el caso de `ValuesStore`, sería de la siguiente forma:

```swift
extension ValuesStore {
    var lastElement: Element? {
        content.last
    }
}

// Prints "10"
print(intsStore.lastElement ?? "Empty store")
```

## Limitar los genéricos con Where

Pueden haber situaciones donde necesites hacer un genérico para varios tipos... pero no para *todos* los tipos.

Imagina el siguiente caso:

```swift
func sumTwoValues<T>(valueA: T, valueB: T) -> T {
    // ERROR: Binary operator '+' cannot be applied to two 'T' operands
    valueA + valueB 
}
```

En el ejemplo anterior, podrías usar enteros, dobles, o cualquier tipo de número, ya que se va a realizar una suma.

Pero no podrías pasar dos valores `Bool` porque no pueden sumarse.

¿Solución? Restringir `T` para que solo puedan ser tipos que conformen el protocolo `Numeric`.

Para ello, simplemente usa la claúsula `where`, para indicar los tipos de `T`.

```swift
func sumTwoValues<T>(valueA: T, valueB: T) -> T where T: Numeric {
    valueA + valueB
}
```

Y ahora sí, podrías ejecutar las operaciones que desearas.

```swift
// Returns 7
sumTwoValues(valueA: 2, valueB: 5)

// Returns 31.1
sumTwoValues(valueA: 10.5, valueB: 20.6)
```

## Usar múltiples genéricos

En los ejemplos anteriores, has visto como usar un tipo genérico: `T`, o `Element`.

Lo que significa que podía admitir cualquier tipo, pero con la limitación que, dicho tipo siempre fuera el mismo.

En el ejemplo anterior, en que se sumaban dos valores, podrías sumar dos enteros, o dos dobles, etc... Pero siempre, el mismo valor

Usar varios tipos, es muy sencillo, simplemente debes declarar otros tipos genéricos, separándolos por comas. Y teniendo en cuenta el estándar de nombres mencionado antes.

Aquí tienes otro ejemplo:

```swift
func displayTemp<City,Temp>(city: City, temp: Temp) where City: StringProtocol, Temp: Numeric {
    print("\(city):\(temp)")
}
```

{{< alert >}}
El código anterior no es óptimo, ya que se podría simplificar si los parámetros conformaran los protocolos `StringProtocol` y `Numeric` (`displayTemp(city: String, temp: any Numeric)`) pero se ha usado para mostrar un ejemplo sencillo.
{{</ alert >}}

Y ya podrías usar distintos tipos de genéricos

```swift
// Prints "Valencia:20"
displayTemp(city: "Valencia", temp: 20)

// Prints "Munich:5.5"
displayTemp(city: "Munich", temp: 5.5)
```

## Conclusiones

Así que resumiendo lo más importante:

- Debes utilizar genéricos para unificar código muy similar que realice operaciones con distintos tipos
- Puedes usarlos en funciones o en tipos
- Puedes utilizar:
  - Palabras como `Element`, `Key` o `Value` si tienen relación que tenga sentido.
  - Letras como `T`, `U` o `V` para casos más abrastactos.
- Si quieres acotar los tipos de un genérico, usa la cláusula `where` para especificar un protocolo.
- Si solo indicas un tipo genérico, siempre deberás usar siempre el mismo tipo en la función o tipo.

Y si quieres practicar, te dejo aquí el playground con ejemplos 🙂

{{% resources pattern="generics-swift.playground.zip"/%}}

## Fuente

[Genéricos - Documentación de Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/)
