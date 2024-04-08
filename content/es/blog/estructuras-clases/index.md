+++
title = "Dominando las bases: Estructuras vs. clases"
description = "Ambas opciones permiten encapsular y reutilizar valores y comportamientos, pero conocer sus diferencias ayuda a optimizar tu código"
summary = "Ambas opciones permiten encapsular y reutilizar valores y comportamientos, pero conocer sus diferencias ayuda a optimizar tu código"
date = 2024-03-28T08:00:00+01:00
translationKey = "estructurasYClases"
aliases = "/posts/estructuras-clases/"
+++
En el mundo del desarrollo de software con Swift, una de las decisiones fundamentales que enfrentamos es la elección entre estructuras y clases. Ambas son constructos esenciales que nos permiten modelar nuestros datos de manera eficiente, pero sus diferencias son cruciales para escribir código eficiente y fácil de entender.

Las **estructuras** y **clases** en Swift comparten varias similitudes. Ambas pueden definir propiedades para almacenar valores, métodos para añadir funcionalidad, subíndices para acceder a valores con una sintaxis específica, y se pueden extender para aumentar su funcionalidad. Sin embargo, es en sus diferencias donde encontramos las claves para decidir cuándo usar cada una.

### ¿Cuándo usar estructuras?

Las estructuras son tipos de valor. Esto significa que se copian cuando se asignan a una nueva variable o se pasan a una función. Son la elección predilecta para representar datos simples y autónomos que no necesitan heredar propiedades de otro lugar. Por ejemplo, para modelar las especificaciones de un videojuego, podrías usar una estructura:

```swift
struct VideoGame {
    var name: String
    var genre: String
    var platform: String
}

let halo = VideoGame(name: "Halo Infinite", genre: "FPS", platform: "Xbox")
```

Este modelo es útil cuando los valores copiados son lo que necesitas, como pasar los datos de un videojuego de un lado a otro en tu app sin preocuparte por efectos secundarios no deseados.

### ¿Cuándo usar clases?

Las clases son tipos de referencia. A diferencia de las estructuras, si asignas una instancia de una clase a una nueva variable o la pasas a una función, lo que se pasa es una referencia a la misma instancia. Esto es útil cuando necesitas tener un único objeto que se actualice y se acceda desde múltiples lugares. Por ejemplo, podrías querer tener un objeto que represente una sesión de usuario:

```swift
class UserSession {
    var user: String
    var status: String

    init(user: String, status: String) {
        self.user = user
        self.status = status
    }
}

let session = UserSession(user: "Oski82", status: "Active")
```

Utilizar una clase aquí permite que cualquier cambio en la `session` se refleje a través de toda la app, lo cual sería crucial para el manejo de estados como el inicio o cierre de sesión.

### Diferencias clave

- **Herencia**: Solo las clases pueden heredar de otra clase. Esto las hace poderosas para casos de uso polimórficos.
- **Tipo de referencia vs. tipo de valor**: Este es probablemente el mayor factor diferenciador. Afecta cómo se transmite la información en tu app y puede tener implicaciones significativas en el rendimiento y el uso de la memoria.
- **Conteo de referencias**: Solo las clases soportan el conteo de referencias, permitiendo que más de una referencia apunte a la misma instancia de una clase. Esto es útil para manejar la vida útil de los objetos, especialmente en entornos con múltiples hilos.

### Recomendaciones

- **Prioriza estructuras sobre clases**: Son más rápidas y seguras en un contexto de concurrencia debido a que trabajan con copias de los datos que contienen.
- **Usa clases cuando necesites herencia o manejo de identidad único**: Por ejemplo, para controlar una única instancia de un servicio de red o una sesión de usuario compartida a través de tu app.

### Conclusión

La elección entre estructuras y clases depende de la naturaleza de tus datos y de cómo planeas usarlos en tu aplicación. Si bien las estructuras ofrecen una manera segura y eficiente de trabajar con datos copiados, las clases proporcionan poderosas herramientas para el manejo de estados compartidos y la herencia. Al elegir conscientemente entre estos dos constructos, puedes escribir código más claro, eficiente y adecuado a tus necesidades.