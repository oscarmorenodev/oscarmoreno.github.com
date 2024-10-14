+++
title = "Mejora tus enumeraciones con los valores asociados"
description = "Descubre cómo gestionar múltiples tipos de datos en una sola enumeración"
summary = "Descubre cómo gestionar múltiples tipos de datos en una sola enumeración"
date = 2024-10-15T08:00:00+02:00
translationKey = "enum-associated-values"
+++

Una de mis características favoritas en Swift son los **enums**.

Son fáciles de entender y de utilizar.

Pero en ocasiones, no les sacamos el provecho que podríamos.

Y eso se puede conseguir (entre otras formas) con los valores asociados.

Los valores asociados te permiten recoger valores de distintos tipos, asociados a los distintos casos de la enumeración.

Si lo necesitas, también escribí un artículo sobre las [enumeraciones](../enums-swift/)

Así que hoy, te muestro como poder sacarles partido, y en qué ocasiones es una ventaja utilizarlos.

## Cómo definir los valores asociados en tus enumeraciones

Solo debes incluir a continuación de cada caso, el tipo del valor que quieres asociar.

Puedes definir la cantidad de valores que quieras.

Aunque, como en otros casos, no es recomendable que sea un número alto de valores. 

De esta forma, mejorarás la legibilidad y reducirás la complejidad.

Además, opcionalmente, también puedes indicar el nombre del parámetro.

```swift
struct User {
    let name: String
}

enum Resolution {
    case completed
    case dropped
}

enum State {
    case toDo(estimatedDate: Date)
    case inProgress(assignee: User)
    case done(time: Int)
    case close(Resolution)
}
```

Como puedes ver, cada caso del enum `State` tiene un valor asociado.

Todos cuentan con el nombre del parámetro, excepto el caso de cierre.

## Asignar valores asociados a un caso de una enumeración

Una vez definido el `enum`, cuando escojas un caso, debes asignarle un valor del tipo especificado.

```swift
let state = State.toDo(estimatedDate: Date.now.addingTimeInterval(86400))
let state2 = State.inProgress(assignee: .init(name: "John"))
let state3 = State.done(time: 10)
let state4 = State.close(.completed)
```

Además, esto también ocurre cuando utilizar un `switch` para manejar las distintas situaciones. 

Pero, de esta forma, el parámetro que asignas en cada caso del `switch` , no tiene por qué tener el mismo nombre que en la definición.

Ni estás obligado a llamar al parámetro si no lo necesitas para la gestión.

Lo puedes ver mejor en este ejemplo.

```swift
func manageTask(_ task: State) {
    switch task {
    case .toDo:
        print("Task is not started yet.")
    case .inProgress(let assignee):
        print("\(assignee) is working on it")
    case .done(var duration):
        duration /= 60
        print("Task was completed in \(duration) hours")
    case .close(let finalState):
        print("Task is finished. It was \(finalState)")
    }
}

manageTask(.toDo(estimatedDate: Date.now.addingTimeInterval(172.800)))

let user = User(name: "Erlich Bachman")
manageTask(.inProgress(assignee: user))

manageTask(.done(minutes: 90.0))
````

Como puedes ver, en el caso del `toDo` no se utiliza la fecha estimada de inicio, así que no necesitas recuperar ese valor.

Mientras que en los casos `done` y `close`, no coincide el nombre del parámetro de la definición, con el del `switch`.

## Ventajas de usar tipos asociados para las enumeraciones

### Mejora de la legibilidad

Sé que lo digo en muchas ocasiones, pero pasamos más tiempo leyendo código que escribiéndolo.

Así que mejor que esa actividad sea lo más sencilla posible.

Gracias a los valores asociados, no hace falta que crees estructuras externas con las que asociar a los casos.

Además, también se mantendría más simple la jerarquía del código sin esas clases.

### Mayor estabilidad

El tipado fuerte una de las mayores ventajas de Swift.

Y se refuerza con esta característica.

Debes definir el tipo de cada valor asociado.

Y solo puedes asignar un valor de ese tipo, con lo que podrás evitar valores por un tipado incorrecto.

Además, si estás usando un `switch` para gestionar las acciones según el caso, estás obligado a indicar todos los casos.

Y el mismo Xcode, te ayuda a añadir los valores asociados si los necesitas necesitas.

## Ejemplos de uso de valores asociados

### Manejo de errores

Es fácil que para complementar la información de un error, necesites datos adicionales.

Esta información podría ser el mensaje que debes mostrar, o algo que necesites para solucionarlo.

```swift
enum ArcadeMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case userUnknown(user: String)
}

func displayError(_ error: ArcadeMachineError) {
    switch error {
    case .invalidSelection:
        print("Invalid selection")
    case .insufficientFunds(let coinsNeeded):
        print("Insufficient funds. You need \(coinsNeeded) coins")
    case .userUnknown(let user):
        print("User \(user) is unknown")
    }
}

displayError(.userUnknown(user: "pacman"))
```

### Definir acciones de la vista

Las acciones que se ejecutan a raiz de la interacción del usuario, suelen requerir valores relacionados:

```swift
enum UserAction {
    case login(username: String, password: String)
    case logout
    case updateProfile(name: String, age: Int)
}

func performAction(_ action: UserAction) {
    switch action {
    case .login(let username, let password):
        print("Logging in with \(username) and \(password)")
    case .logout:
        print("Logging out")
    case .updateProfile(let name, let age):
        print("Updating profile with name: \(name), age: \(age)")
    }
}

performAction(.updateProfile(name: "grogu", age: 50)
```

### Modelar datos complejos

Por ejemplo, cuando tratas con elementos multimedia.

Éstos, suelen llevar asociados distintos tipos de datos.

Con una enumeración y valores asociados, es tan sencillo definirlo como gestionarlo.

```swift
enum MediaType {
    case image(url: String, resolution: (width: Int, height: Int))
    case video(url: String, duration: TimeInterval)
    case audio(url: String, bitrate: Int)
}

func handleMedia(_ media: MediaType) {
    switch media {
    case .image(let url, let resolution):
        print("Image URL: \(url), Resolution: \(resolution.width)x\(resolution.height)")
    case .video(let url, let duration):
        print("Video URL: \(url), Duration: \(duration) seconds")
    case .audio(let url, let bitrate):
        print("Audio URL: \(url), Bitrate: \(bitrate) kbps")
    }
}

handleMedia(.video(url: "R.Astley-never_gonna_give_you_up.mp4",
                   duration: 213))
```

### Gestionar estados

Éste es, posiblemente, el uso más extendido de los valores asociados en las enumeraciones.

Y es que, los estados de una app, suelen conllevar otro dato relacionado con el usuario, la vista que se muestra, etc...

```swift
enum AppState {
    case onboarding(step: Int)
    case loggedIn(userID: String)
    case loggedOut
}

func handleAppState(_ state: AppState) {
    switch state {
    case .onboarding(let step):
        print("Onboarding step \(step)")
    case .loggedIn(let userID):
        print("User logged in with ID \(userID)")
    case .loggedOut:
        print("User logged out")
    }
}

handleAppState(.onboarding(step: 1))
```

### Filtros avanzados

Los valores asociados también pueden ser muy útiles con los filtros.

Ya que, cuando los utilizas, necesitas definir el valor de dichos filtros.

Así, podrás establecerlos fácilmente.

```swift
enum Filter {
    case priceRange(min: Double, max: Double)
    case category(name: String)
    case availability(isInStock: Bool)
}

func applyFilter(_ filter: Filter) {
    switch filter {
    case .priceRange(let min, let max):
        print("Filter by price range: \(min) - \(max)")
    case .category(let name):
        print("Filter by category: \(name)")
    case .availability(let isInStock):
        print("Filter by availability: \(isInStock ? "In stock" : "Out of stock")")
    }
}

applyFilter(.priceRange(min: 10.0, max: 20.0))
```

## Conclusiones

Has podido ver lo sencillo que es asociar valores a los distintos casos de un `enum`:

- Únicamente debes definirlos a continuación de cada caso
- Aprovecha el autocompletado de XCode para añadir los valores que necesites
- Te ayudan a tener un código más estable, legible y seguro.

Como ejemplos donde los puedes utilizar tienes:

- Manejo de errores
- Definición de acciones de la vista
- Modelado de datos complejos
- Gestión de estados
- Filtros avanzados

Y si quieres practicar, aquí te dejo un playground con los ejemplos:
{{% resources pattern=".*\.(zip)" color="blue" icon="fa-solid fa-file-arrow-down" /%}}

## Fuente

[Valores asociados de Enumeraciones - Documentación oficial de Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Associated-Values)
