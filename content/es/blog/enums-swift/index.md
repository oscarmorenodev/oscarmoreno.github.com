+++
title = "Enumeraciones"
description = "Las enumeraciones permiten defininir un tipo común para unos valores asociados"
summary = "Las enumeraciones permiten defininir un tipo común para unos valores asociados"
date = 2024-03-11T08:00:00+01:00
translationKey = "enumeraciones"
aliases = "/posts/enums-swift/"
+++

Las enumeraciones, o simplemente `enums` como las conocemos en Swift, son esa herramienta imprescindible en tu kit de desarrollo, permitiéndote definir un tipo común para un grupo de valores relacionados. Esto no solo va a mejorar la legibilidad de tu código, sino que también facilitará su mantenimiento y te ayudará a evitar esos errores comunes que a todos nos gusta evitar. Si estás empezando en Swift y aún te estás familiarizando con la creación de funciones, entender las enumeraciones puede ser realmente revelador.

## ¿Qué son las enumeraciones?

Imagina que estás trabajando en una app sobre series de televisión. Tienes diferentes géneros como drama, comedia, terror, etc. En lugar de gestionar estos géneros como cadenas de texto (lo que podría llevar a errores de escritura) puedes definir una enumeración:

```swift
enum TVShowGenre {
    case drama
    case comedy
    case horror
    case sciFi
}
```
Con esta definición, puedes usar `TVShowGenre` de manera segura y controlada, mejorando así la legibilidad y la consistencia de tu código.

## ¿Cuándo usar enums?

Las enumeraciones son increíblemente útiles cuando necesitas agrupar conjuntos de valores relacionados que ya conoces. Por ejemplo, en una app para seguir las temporadas de Fórmula 1, podrías tener una enumeración para los equipos:

```swift
enum F1Team {
    case mercedes
    case ferrari
    case redBull
    case mclaren
}
```
Este enfoque garantiza que solo puedas asignar pilotos a los equipos que existen en tu enumeración, evitando asignaciones incorrectas.

## Valores asociados
Swift lleva las enumeraciones aún más allá, permitiendo casos con valores asociados. Esto significa que puedes almacenar valores adicionales de otros tipos junto con los casos de la enumeración. Imagina que estás creando un videojuego y quieres definir diferentes tipos de enemigos, algunos con atributos especiales:

```swift
enum Enemy {
    case soldier
    case wizard(magicStrength: Int)
    case boss(isFinal: Bool, lives: Int)
}
```
Aquí, `wizard` tiene un valor asociado `magicStrength`, y `boss` tiene dos valores asociados, indicando si es el jefe final y cuántas vidas tiene. Esto te permite manejar cada tipo de enemigo de forma más específica y detallada en tu juego.

## Raw Values y la herencia del protocolo String

Las enumeraciones en Swift pueden tener *raw values*, que son valores predefinidos que puedes asociar con cada caso de la enumeración. Esto es especialmente útil cuando tu enumeración necesita representar un valor de cadena o numérico específico para cada caso.

Por ejemplo, podrías tener una enumeración que represente los pilotos de Fórmula 1, donde cada piloto se asocia con su nombre completo correspondiente:

```swift
enum Drivers: String {
    case verstappen = "Max Verstappen"
    case alonso = "Fernando Alonso"
    case leclerc = "Charles Leclerc"
}
```
Aquí, `Drivers` es una enumeración que hereda del protocolo `String`. Esto significa que cada caso tiene un raw value de tipo `String` que coincide con su nombre. Por ejemplo, puedes acceder al raw value de un piloto de la siguiente manera:

```swift
let driver = Drivers.verstappen
print(driver.rawValue)  // Print "Max Verstappen"
```
Esto es particularmente útil cuando necesitas trabajar con datos que provienen de una fuente externa que utiliza representaciones de cadena, como un servidor web o una base de datos.

Además, cuando una enumeración hereda del protocolo `String`, Swift automáticamente asigna a cada caso un raw value que coincide con el nombre del caso, lo que te ahorra la necesidad de asignar explícitamente un raw value a cada caso.

```swift
enum Track: String {
    case monaco
    case spa
}

let track = Track.monaco.rawValue // track is a String with value "monaco"
```

En resumen, el uso de raw values y la herencia del protocolo `String` en tus enumeraciones puede mejorar la legibilidad de tu código, facilitar la interacción con otras partes de tu código que utilizan cadenas y números, y ayudarte a evitar errores al manejar datos externos. ¡Espero que esto te ayude a entender aún más el poder de las enumeraciones en Swift!

## Conclusión
Las enumeraciones en Swift son una forma potente y segura de trabajar con conjuntos de valores relacionados.
- Facilitan la escritura de código más **limpio y mantenible**, al tiempo que previenen errores comunes limitando los valores a los definidos en la enumeración. 
- Los valores asociados ofrecen una flexibilidad adicional, permitiéndote **incluir información específica** directamente en tus tipos de datos. 
- Los valores raw te permiten usar **cadenas** de tus casos. 

Al dominar las enumeraciones, estarás dando un paso enorme hacia el desarrollo de software más robusto y eficiente. ¡Es tu turno de experimentar con ellas y ver todo lo que pueden hacer por tus proyectos!