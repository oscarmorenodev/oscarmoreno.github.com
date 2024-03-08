+++
title = "Constantes y variables para guardar datos"
description = "Como guardar y gestionar valores de datos en Swift"
date = 2023-01-16
translationKey = "constantes-variables"
+++

La programación es una forma de gestionar datos y, normalmente, es necesario guardar varios valores temporalmente: para hacer uso de ellos después de otras operaciones, para mostrarlos, transformarlos...

Por este motivo, igual que otros lenguajes de programación, Swift es capaz de almacenar valores en constantes y variables.

Gracias a ellas, puedes asociar un nombre que elijas a un valor.

## Constantes
Un valor constante se guarda en un espacio de memoria y no se puede modificar. Una vez que un valor se establece en una constante, permanece **inmutable**.

### Cómo declarar una constante
Para declarar una constante debes comenzar con la palabra reservada `let`, seguida del nombre que elijas. Luego, debes usar el operador `=` y asignar un valor.

En el siguiente ejemplo, `let` es la palabra reservada para constantes, `survivor` el nombre de la constante y el valor asignado a `survivor` es `Jack Shepard`.

```swift
let survivor = “Jack Shepard”
```

El valor está entre comillas dobles porque es un tipo de valor cadena o `String`. Puedes leer sobre Strings en la documentación oficial: [Cadenas y caracteres](https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html)

{{< alert "lightbulb">}}
¿Sabes por qué Swift usa `let` en lugar de `const` o similar a otros idiomas?
Viene del mundo de las matemáticas en inglés, donde dicen cosas como:
> let x be equal to 5.
{{< /alert >}}

## Variables
Una variable es un valor que puedes modificar una vez declarado. Por lo que es un valor **mutable**.

### Cómo declarar una variable
Para declarar una variable, la estructura es la misma que una constante, pero debes usar la palabra reservada `var`

Por lo que, para declarar una variable debes escribir

```swift
var videogame = “Metal Gear Solid”
```

Ok, pero si queremos cambiar el valor de var, ¿cómo deberíamos hacerlo? Fácil, sólo necesitas asignar un nuevo valor y no escribir la palabra reservada var.

```swift
videogame = “Uncharted”
```

## Nombrar una constante, varialbe o valor
Puedes utilizar casi cualquier carácter para el nombre de una constante o variable, incluidos los caracteres Unicode. Lo que significa que puedes usar, por ejemplo, emojis.

Pero es algo que no recomiendo. ¿Por qué? Porque el nombre de una constante o de una variable, debe explicar sin dejar lugar a dudas lo que se guarda en su interior.

Por ejemplo, ¿que significa el valor 10?

```swift
let times = 10

let numberOfTimesIHaveSeenBackToTheFutureTrilogy = 10
```
En el segundo caso caso es más fácil saberlo.

## Conclusión

Por lo tanto, no te preocupes por la cantidad de caracteres del nombre. Es más recomendable utilizar un nombre grande (pero descriptivo) que utilizar otro más corto que no especifique qué almacena. Y, hoy en día, los IDEs se encargan de autocompletar los nombres, así que no será tan difícil escribirlos 😉
