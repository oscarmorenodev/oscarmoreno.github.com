+++
title = "Cómo crear property wrappers para reutilizar código"
description = "Los property wrappers te permiten encapsular código repetitivo para las propiedades"
summary = "Los property wrappers te permiten encapsular código repetitivo para las propiedades"
date = 2024-09-10T08:00:00+02:00
translationKey = "propertyWrappers"
+++

La primera vez que vi un property wrapper fue en SwiftUI, pero es una característica de Swift que puedes usar desde la versión 5.1

Las propiedades definen características de los tipos, pero a menudo tienes que realizar (las mismas) operaciones sobre ellas.

La forma más sencilla de realizar estas operaciones es utilizando los [observadores de propiedad](../propiedades-swift#observadores-de-propiedad) de los que te hablé anteriormente.

Pero, ¿y si debes realizar esas operaciones demasiadas veces? Si solo usas los observadores, enseguida tendrás código duplicado.

La solución pasa por utilizar envoltorios de propiedad, o **property wrappers**.

## Property Wrappers en Swift

Los property wrappers, añaden una capa de separación entre el código que define una propiedad y el que gestiona como se almacena.

Su principal ventaja es que escribes el código que opera sobre esa propiedad una vez, y lo reutilizas en las propiedades que necesitas.

### Cómo crear un property wrapper en Swift

En el siguiente código puedes ver cómo se crea

```swift
@propertyWrapper
struct DashCase {
    private var text = ""
    var wrappedValue: String {
        get {
            text
        }
        set {
            text = newValue.lowercased().replacingOccurrences(of: " ", with: "-")
        }
    }
}
```

Puedes crear una clase, una estructura o una enumeración, y es necesario que vaya precedido por la *directiva de atributo* `@propertyWrapper`

El tipo, debe tener una propiedad llamada `wrappedValue`, que devolverá el valor que definas cuando se acceda a una propiedad con el propertyValue creado.

Así, podríamos usar el anterior property wrapper de la siguiente manera

```swift
struct Branch {
    @DashCase var name: String
}

var branch = Branch()
branch.name = "Random Branch Name"

print(branch.name) // Muestra "random-branch-name"
```

De esta forma, no es necesario que `Branch` tenga que formatear cada vez el nombre. Y por otro lado, podrás usar `DashCase`cada vez que necesites formatear un texto a minúsculas y guiones.

```swift
struct File {
    @DashCase var name: String
}

var file = File()
file.name = "Random File Name"

print(file.name) // Muestra "random-file-name"
```

> Fíjate que si declaras una propiedad adicional en el tipo, es conveniente declararla privada. Así te aseguras que en la implementación solo se puede acceder al valor a través de la `wrappedValue`

### Establecer los valores iniciales de un property wrapper

Además, si lo necesitas, puedes utilizar un inicializador.

Esto te permitiría crear el property wrapper de la siguiente forma:

```swift
@propertyWrapper
struct SnakeCase {
    var wrappedValue: String
    
    init(wrappedValue: String) {
        self.wrappedValue = wrappedValue.replacingOccurrences(of: " ", with: "_").lowercased()
    }
}
```

Esto puede suponer una ventaja, cuando necesites por ejemplo que sea obligatorio crear el objeto, con un valor inicial, porque tendrás que introducirlo

```swift
struct Table {
    @SnakeCase var name: String
}

var table = Table(name: "hello World")
print(table.name) // Muestra "hello_world"
```

### Valor proyectad de un property wrapper

Además del valor envuelto, que devuelve un property wrapper, como has podido ver en los ejemplos anteriores, también permite disponer de un *valor proyectado*

Este valor proyectado podría servir, siguiendo los ejemplos anteriores, para saber si se ha formateado el valor.

```swift
@propertyWrapper
struct Capitalized {
    private var text: String
    private(set) var projectedValue = false
    var wrappedValue: String {
        get {
            text
        }
        set {
            text = newValue.capitalized
        }
    }
    
    init(wrappedValue: String) {
        self.text = wrappedValue.capitalized
        projectedValue = true
    }
}
```

Con ello, podrías hacer lo siguiente

```swift
struct CustomText {
    @Capitalized var title: String
}

let text = CustomText(title: "One more thing...")
print(text.title) // Muestra "One More Thing..."
print(text.$title) // Muestra "true"
```

## Conclusión

Como has visto, utilizar property wrappers trae la principal ventaja de reutilizar código entre parámetros de distintos tipos que sobre los que necesitan realizar las mismas operaciones.

Lo más importante:

- Necesitas usar la directiva @propertyWrapper y que tenga al menos una propiedad llamada `wrappedValue`
- Puedes usar si quieres una propiedad `projectedValue` si quieres exponer alguna funcionalidad adicional
- Si necesitas un propiedad adicional para realizar las operaciones, declarala como privada para que solo se pueda modificar desde el property wrapper.

Si quieres practicar, aquí tienes un playground con los ejemplos 😉

{{% resources pattern="property-wrappers-in-swift.playground.zip"/%}}

## Fuentes

[Property Wrappers - Documentación de Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/#Property-Wrappers)

[Property Wrappers en Swift - Swift by Sundell](https://www.swiftbysundell.com/articles/property-wrappers-in-swift/)
