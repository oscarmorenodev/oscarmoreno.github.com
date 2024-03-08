+++
title = "Etiquetas de argumentos de función y nombres de parámetros"
description = "Descubriendo las bases sobre parámetros de entrada en las funciones" 
date = 2023-06-26
translationKey = "parametros"

+++

Comprender las complejidades de las etiquetas de argumentos de funciones y los nombres de parámetros es esencial para aprovechar al máximo el lenguaje de programación Swift. En este artículo, exploraremos estos conceptos con un enfoque en la simplicidad, atendiendo a desarrolladores con experiencia limitada en la creación de funciones. ¡Así que, comencemos!

## Etiquetas de argumentos de función
Las etiquetas de argumentos proporcionan un contexto descriptivo al llamar a una función, haciendo que el código sea más expresivo y legible. En Swift, las etiquetas de argumentos se especifican antes de los nombres de parámetros y están separadas por un espacio. Consideremos un ejemplo donde calculamos la puntuación de un nivel de videojuego:

```swift
func calculateScore(forLevel level: Int) -> Int {
    // Function body goes here
}
```
Aquí, `forLevel` es la etiqueta del argumento, y `level` es el nombre del parámetro. Al llamar a esta función, usamos la etiqueta del argumento para proporcionar claridad:
```swift
let finalScore = calculateScore(forLevel: 5)
```
Al usar etiquetas de argumentos, podemos transmitir el propósito de cada parámetro, mejorando la comprensión de nuestro código.

Además, puedes omitir una etiqueta de argumento. Simplemente debes escribir un guion bajo en lugar de una etiqueta de argumento:
```swift
func addStamina(_ stamina: Int) -> Int {
	// Function body goes here
}
```
Y solo necesitarás pasar el valor cuando llames a la función.
```swift
let totalStamina = addStamina(100)
```

## Valores de parámetros predeterminados
En Swift, tenemos la flexibilidad de asignar valores predeterminados a los parámetros de funciones. Esto significa que al llamar a una función, podemos optar por omitir argumentos específicos, y en su lugar se utilizarán los valores predeterminados. Continuando con nuestro tema de videojuegos, modifiquemos nuestra función anterior para incluir un valor predeterminado para el parámetro `bonusPoints`:
```swift
func calculateScore(level: Int, bonusPoints: Int = 500) -> Int {
    return level * bonusPoints
}
```
Ahora, podemos llamar a la función y usar los dos parámetros pero, si llamamos a la función sin proporcionar un valor para `bonusPoints`, automáticamente se utilizará el valor predeterminado de 500:
```swift
let totalScore = calculateScore(level: 2, bonusPoints: 100) // totalScore is equal to 200
let finalScore = calculateScore(level: 5) // finalScore is equal to 2500
```

## Parámetros variádicos
A veces, podemos encontrarnos con situaciones donde el número de argumentos de la función no es fijo. Para manejar tales escenarios, Swift nos permite usar parámetros variádicos. Estos parámetros pueden aceptar cero o más valores de un tipo especificado. Para demostrarlo, imagina una función que calcula la puntuación total de varios videojuegos:
```swift
func calculateTotalScore(scores: Int...) -> Int {
    // Function body goes here
}
```
Aquí, `scores` es un parámetro variádico. Podemos pasar cualquier número de argumentos separados por comas al llamar a la función:
```swift
let totalScore = calculateTotalScore(scores: 100, 250, 500, 750)
```
## Parámetros de entrada-salida
Por último, Swift proporciona el modificador de parámetro `in-out`, que permite a una función modificar el valor de una variable desde fuera de su propio ámbito. Los parámetros de entrada-salida se prefijan con la palabra clave "inout". Considera un escenario donde necesitamos actualizar los puntos de salud de un personaje de juego:

```swift
func updateHealthPoints(_ hp: inout Int) {
    // Function body goes here
}
```
Para pasar una variable como un parámetro `in-out`, antecedemos un ampersand antes del nombre de la variable:
```swift
var characterHP = 100
updateHealthPoints(&characterHP)
```
## Conclusión
En este artículo, hemos cubierto los fundamentos de las etiquetas de argumentos de funciones y los nombres de parámetros en Swift. Exploramos el uso de etiquetas de argumentos, valores de parámetros predeterminados, parámetros variadicos y parámetros de `in-out`. Al dominar estos conceptos, podrás escribir código limpio, expresivo y flexible en tus proyectos de iOS. Sigue practicando e incorporando estas técnicas en tu viaje de desarrollo, y pronto podrías estar creando videojuegos retro notables que dejen a los jugadores nostálgicos por la edad de oro de los videojuegos.

