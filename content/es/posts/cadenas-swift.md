+++
title = "Swift Strings"
description = "As other languages, Strings are a fundamental type that allows save text"
date = 2023-02-06
translationKey = "cadenas"
+++

Cuando guardas un texto en una constante o una variable, estás guardando una cadena en Swift. Además, puedes ver una cadena como una serie de caracteres. Por esa razón, puedes acceder al contenido de una cadena de varias maneras, como una Colección (Array, por ejemplo) de caracteres.

## Inicializar una Cadena
Un literal de cadena es un texto escrito con comillas dobles al principio y al final. Entonces, si necesitas guardar un texto en una constante o una variable, solo debes asignar un literal de cadena a ella.
```
let coach = "Ted Lasso"
var team = "AFC Richmond"
```
*NOTA: Es fundamental recordar que las cadenas distinguen entre mayúsculas y minúsculas. Por lo tanto, "una cadena simple" es diferente de "Una cadena simple".*

## Concatenando cadenas
Si necesitas guardar el valor de dos cadenas en otra constante o variable, puedes concatenarlas.

Es tan fácil como usar el operador `+` entre los dos valores cuando tienes que asignarlo.

```
let name = "Michael"
let lastName = "Scott"

let funnyBoss = name + lastName
```

Otra forma es usar el operador `+=` para agregar texto a una cadena previamente inicializada.
```
var spy = "Bond"
spy += ", James Bond"
```
En el ejemplo anterior, el valor final de `spy` es `Bond, James Bond`

Y, como una String es una Colección de caracteres, también puedes usar el método `.append()`
```
var greet = "Hello, world"
greet.append("!")
```
En el último código, el valor de saludo es `Hello, world!`

## Interpolación de cadenas
Pero quizás la característica más utilizada en las cadenas podría ser la interpolación de cadenas. Permite usar valores de constantes o variables dentro de una cadena.

En este caso, puedes hacerlo escribiendo el nombre de la constante o variable, dentro de paréntesis "()", y comenzando con una barra invertida "\". Es decir, `\(nombreDeVariable)`

```
let name = "Forest"
let fullName = "Forest Gump"

let introduction = "Hello, I am \(name), \(fullName)"
```
El valor final de `introduction` es `"Hello, I am Forest, Forest Gump"`

## Cadena de varias líneas
Para terminar (aunque no se utiliza a menudo en aplicaciones del mundo real), tal vez a veces necesites guardar textos más largos en una cadena, y podría ser difícil leer el valor para otros programadores o para ti mismo. En este caso, puedes usar una cadena de varias líneas.

Para guardar una cadena de varias líneas, solo necesitas escribir tres comillas al principio, y terminar con otras tres en una sola línea. Por ejemplo:

```
let text = """
To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles,
And by opposing end them? To die, to sleep;
"""
```

First triple double quotes doesn't need to be in a single line, but it helps to focus in text value.

***
<br/>
El primer conjunto de tres comillas dobles no necesita estar en una sola línea, pero ayuda a centrarse en el valor del texto.

Puedes ver métodos útiles en la publicación. [Métodos útiles para cadenas](../metodos-utiles-cadenas-swift)
