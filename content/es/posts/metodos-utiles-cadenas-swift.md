+++
title = "Useful String Methods in Swift"
description = "Learn useful String methods in Swift to display data as you need"
date = 2023-02-20
translationKey = "metodos-cadenas"
+++

Esta publicación es un complemento para la anterior sobre [Cadenas en Swift](../cadenas-swift).

En proyectos del mundo real, puedes almacenar muchas cadenas, pero es importante que sepas cómo transformar esas cadenas para mostrarlas según tu vista.

Por esta razón, veamos los métodos habituales que puedes usar para esto.

## Contar caracteres
Dado que una cadena es una colección de caracteres, puedes usar un método muy común en Arrays: `count()`

Puedes usarlo en una constante/variable o en una cadena.

```
let starWarsIntro = "A long time ago..."
let numberOfCharacters = starWarsIntro.count()  // numberOfCharacters value 18

let numberOfCharactersOfGreet = "Hello World!".count() // numberOfCharactersOfGreet value is 12
```

Incluso puedes combinar valores en la misma cadena a través de la interpolación de cadenas:

```
let plotTwist = "I am your father"
print("The number of character in \(plotTwist) is \(plotTwist).count()")

// It will print "The number of character in I am your father is 16"
```

## Insertar o eliminar
También es importante agregar o eliminar caracteres o subcadenas.

### Insertar
Para insertar, puedes:
- Insertar un carácter con el método `.insert(_ newElement:at:)`
- Insertar una subcadena con el método `.insert(contentsOf:at:)`

En `at`, deberás escribir un índice. Puedes obtener más información sobre los índices en [Documentación oficial de Swift - Índices de cadenas](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#String-Indices)

```
var warning = "we have a problem"
warning.insert(contentsOf: "Houston, ", at: warning.startIndex)

print(warning) // It will print "Houston, we have a problem"
```

### Eliminar
Similar a insertar, para eliminar Swift permite eliminar caracteres o subcadenas:
- Eliminar un carácter con el método `.remove(at:)`
- Eliminar una subcadena con el método `removeSubrange(_ bounds:)`

Ten cuidado de no salirte de los límites.

```
var greeting = "Hello World!"
greeting.remove(at: greeting.index(before: greeting.endIndex))
print(greeting)  // It will print "Hello World"
```

## Modificar cadenas
### Mayúsculas y minúsculas
Los métodos que puedes usar para esto son `.uppercased()`, `.lowercased()` o `.capitalized()`

Ejemplos:

```
let lordOfTheRings = "A ring to rule them all"
print(lordOfTheRings.uppercased()) // It will print "A RING TO RULE THEM ALL"
print(lordOfTheRings.lowercased()) // It will print "a ring to rule them all"
print(lordOfTheRings.capitalized) // It will print "A Ring To Rule Them All"
```
### Extraer una cadena a un array
Para este objetivo, puedes usar `.components(separatedBy: " ")`

```
let et = “E.T. phone home.”
let etWords = et.components(separatedBy: " ")

// etWords value is equal to ["E.T.", "phone", "home."]
```

### Reemplazar ocurrencias
En este caso, un método útil es `.replacingOccurrences(of:, with:)`, puedes reemplazar un carácter o una cadena con otro carácter o cadena

```
let darkKnight = "I am Batman"
let coded = darkKnight.replacingOccurrences(of: "a", with: "4")

// coded value is equal to "I 4m B4tm4n"
```
