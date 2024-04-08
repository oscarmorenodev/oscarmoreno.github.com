+++
title = "Definiendo las características de los tipos: Las propiedades"
description = "Las propiedades permiten almacenar valores con información sobre el tipo que las define"
summary = "Las propiedades permiten almacenar valores con información sobre el tipo que las define"
date = 2024-04-18T08:00:00+01:00
translationKey = "propiedades"
+++

Las propiedades son una característica fundamental en cualquier lenguaje orientado a objetos o, como en el caso de Swift, orientado a protocolos.

Piensa en un objeto, por ejemplo, un smartphone. Podrías ver que un smarphone tiene:

- Comportamientos
- Características

Entre los comportamientos podrías identificar: Llamar a un contacto, navegar por internet, hacer una foto... Es decir, acciones que puedes realizar con el dispositivo, o dicho de otra forma: qué puede hacer.

Y sobre las características, podrías ver: el tamaño de la pantalla, el peso, el color... Es decir, detalles que definen cómo es el objeto, o mejor dicho, **propiedades**

Y es que, las propiedades, son las que van a almacenar las características de los tipos (clases, estructuras, enumeraciones o protocolos) que definan dicha propiedad.

Con eso, podemos definir las propiedades de 2 formas distintas: mediante **propiedades almacenadas**, o a través de **propiedades calculadas**.

## Propiedades almacenadas

Las propiedades almacenadas son la forma más simple de definir una propiedad. Dentro de un tipo, indicas su propiedad; y para ello, escribe el tipo de valor (constante o variable), junto al nombre de la propiedad.

A partir, de ahí, puedes indicar el tipo de valor (y le asignarás el valor cuando lo inicialices) o puedes asignarle un valor, y Swift inferirá el tipo de dato que estás almacenando.

```swift
struct Movie {
    let title: String
    let year: Int
    var released = false
}

var theFuture = Movie(title: "The future", year: 2026)
```

En ese ejemplo, puedes ver 3 propiedades para la estructura `Movie`.

El título y el año, deberás indicarlo en la inicialización. Mientras que, si no indicas lo contrario, la instancia se crea indicando que la película no ha sido lanzada ya que `released` se inicializará commo `false` si no has indicado nada.

### Propiedades en instancias constantes

Es importante que tengas en cuenta que si creas un instancia en una constante, pueden ocurrir dos situaciones distintas, dependiendo de si es una estructura o una clase.

En el caso de las estructuras, al ser tipos por valor, no podrás modificar las propiedades de la instancia (aunque esas propiedades las hayas definido con variables). Y es que, la instancia, se almacenará en una ubicación **constante**, y por lo tanto, será *inmutable*.

Esto no ocurre con las clases ya que, al ser tipos por referencia, lo que mantienen constante es la referencia a la ubicación en memoria. Por lo tanto, sí puedes modificar el contenido y por ello, sus propiedes (siempre y cuando hayas definido esas propiedades como variables)

```swift
struct VideogameStruct {
    let title
    var played
}

class VideogameClass {
    let title
    var played
}

let videogameInStruct = VideogameStruct(title: "The last of us", played: false) // ERROR: Change 'let' to 'var' to make it mutable
let videogameInClass = VidegameClass(title: "God of war", played: false)

videogameInStruct.played = true // ERROR: Change 'let' to 'var' to make it mutable
videgameInClass.played = true // You can change de value.
```

Como ves, en caso de la estructura, este código no compilará. Tanto en la instanciación como al intentar modificar el valor, te dirá que cambies `let` por `var` para hacerla mutable.

### Propiedades lazy

Las propiedades lazy, son propiedades *perezosas* porque su valor inicial no se calcula hasta que no necesitan ser usadas.

Para definirlas solo hay que utilizar la palabra reservada `lazy` al inicio de la declaración.

```swift
class Network {
    var online: Bool = false
    // Logic to check if internet connection works.
}

struct Device {
    let owner: String
    lazy var network = Network()
}
```

Las propiedades `lazy` son especialmente útiles para optimizar el rendimiento, ya que no se accederá al valor si no es necesario.

En el ejemplo anterior, puedes instanciar el dispositivo, y asignarle un propietario pero, como saber si dispone de conexión, es una tarea más compleja que implica otras operaciones, puedes seguir sin comprobarlo hasta que lo necesites.

{{< alert >}}
Si mútiples hilos acceden simultáneamente a una propiedad `lazy` que no ha sido inicializada, Swift no puede garantizar que solo se inicialice una vez.
{{< /alert >}}

## Propiedades calculadas

Los otros tipos de propiedades, las **propiedades calculadas**, no almacenan un valor directamente, sino que lo calculan y lo devuelven cuando se les llama.

Son útiles cuando su valor depende por ejemplo, del valor de otras propiedades dentro de ese mismo tipo.

Aquí puedes ver un ejemplo sencillo:

```swift
struct TVSeries {
    var title: String
    var startYear: Int
    var endYear: Int? // A nil value indicates the series has not concluded

    // Computed property to determine if the series is still airing
    var isAiring: Bool {
        get {
            if let endYear = endYear {
                return false // The series has concluded
            } else {
                return true // The series is still airing
            }
        }
        
        set {
            let result = newValue ? "is" : "is not"
            print("\(title) \(result) on air!")
        }
    }
}

let breakingBad = TVSeries(title: "Breaking Bad", startYear: 2008, endYear: 2013)
let strangerThings = TVSeries(title: "Stranger Things", startYear: 2016, endYear: nil)

print("\(breakingBad.title) is still airing?: \(breakingBad.isAiring)")
print("\(strangerThings.title) is still airing?: \(strangerThings.isAiring)")
```

En este fragmento de estructura de una serie de televisión, puedes ver que la propiedad calculada se divide en dos componentes: el get (que se ejecutará cuando quieras acceder al valor, es decir, en la línea del `print`) y el set (que se ejecuta cuando se ha establecido el valor de la variable calculada, después de haberse ejecutado el `print`)

Así, en el get, puedes ver que cuando necesites el valor la propiedad `isAiring` (que indica si está en emisión) comprobará si tiene fecha de fin (en cuyo caso, ya no estará en emisión).

Sin embargo, el set, imprimirá un mensaje dependiendo si el valor ha sido establecido a true o false. Como puedes ver también, se puede acceder al nuevo valor mediante la variable `newValue` que Swift creará automáticamente.

### Propiedades de solo lectura

Las propiedades calculadas, que solo tienen `get` pero no tienen `set` se considerán propiedades de solo lectura, ya que no se ejecutará nada, cuando se establezca el valor, y por lo tanto, solo se podrá leer.

Puedes ver este ejemplo:

```swift
struct Rectangle {
    var width: Double
    var height: Double

    var area: Double {
        get {
            return width * height
        }
    }
}
```

El área de un rectángulo, solo puede leerse, ya que si la modificas, obligatoriamente modificarías el ancho y/o el alto, por eso en este ejemplo, solo existe el get.

El ejemplo anterior, se puede simplicar de dos formas:

- Como solo tiene el get, se puede omitir.
- Como solo existe una sentencia, se puede omitir el `return`.

```swift
struct Rectangle {
    var width: Double
    var height: Double

    var area: Double {
        width * height
    }
}
```

De esta forma, puedes mejorar la legibilidad de tu código... y quién tenga que mantenerlo te lo agradecerá 😉.

## Observadores de propiedad

Los observadores de propiedad, hacen que se puedan realizar acciones, cuando el valor de una propiedad cambia. Es decir, sería similar al `set` de una propiedad calculada, pero los observadores te permiten ejecutar acciones:

- Antes de que se cambie el valor (willSet)
- Cuando se ha cambiado el valor (didSet)

{{< alert >}}
Los observadores de propiedad, se ejecutarán SIEMPRE que se establezca un valor en una propiedad. Aunque el valor establecido sea el mismo que ya tenía previamente.
{{< / alert >}}

Los observadores de propiedad se pueden utilizar en:

- Propiedades almacenadas que tú definas
- Propiedades almacenadas que heredes
- Propiedades calculadas que heredes

Mira este otro ejemplo:

```swift
struct ProgressTracker {
    var task: String
    var percentageComplete: Double {
        willSet(newPercentage) {
            print("Will set percentageComplete for \(task) to \(newPercentage)%")
        }
        didSet {
            print("Did set percentageComplete for \(task) from \(oldValue)% to \(percentageComplete)%")
            if percentageComplete == 100.0 {
                print("\(task) is now complete.")
            }
        }
    }
}

var reportProgress = ProgressTracker(task: "Download", percentageComplete: 0)
reportProgress.percentageComplete = 30
reportProgress.percentageComplete = 80
reportProgress.percentageComplete = 100
```

Como puedes ver, puedes pasar el nombre del valor que podrás utilizar en su bloque (como por ejeplo con la constante `newPercentaje`).

También puedes usar `oldValue`, que es la constante que crea automáticamente Swift, y que almacena el valor anterior.

## Property wrappers (envoltorios de propiedad)

Por último, es importante saber que también existen property wrappers, permiten separar el código que gestiona como una propiedad es almacenada y el código que define dicha propiedad, y esto lo consigue, envolviendo el cálculo.

Lo podrías hacer de la siguiente forma:

```swift
@propertyWrapper
struct NonNegative {
    private var value: Int

    var wrappedValue: Int {
        get { value }
        set { value = max(0, newValue) } // Ensure the value is never negative
    }

    // Initialize with a value that is guaranteed to be non-negative
    init(wrappedValue: Int) {
        self.value = max(0, wrappedValue)
    }
}

struct InventoryItem {
    @NonNegative var stock: Int
}

var item = InventoryItem(stock: 5)
print(item.stock) // Prints: 5

item.stock = -3
print(item.stock) // Prints: 2
```

Con este ejemplo, puedes tratar por una parte como se gestionan las propiedades para comprobar que una propiedad no tenga un valor entero negativo. Y así, reutilizarlo en otras partes del código, sin tener que copiar y pegar el contenido de los getters y los setters.

El uso de property wrappers, requiere y permite muchos más detalles, así que si quieres saber más puedes verlo en la [documentación oficial](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/#Property-Wrappers).

## Conclusión

Has podido ver como las propiedades, básicamente definen las características del tipo al que pertenecen.

Pero, para poder aprovecharlas al máximo, y optimizar tu código, es clave conocer todas las operaciones que puedes hacer con ellas.

Swift, como en muchas otras carácterísticas, ofrece diferentes métodos para acceder, calcular y devolver valores de propiedades, lo que hace que escribir código eficiente sea más sencillo.
