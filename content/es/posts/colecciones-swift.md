+++
title = "Colecciones en Swift"
description = "Swift tiene tres tipos de colecciones y su uso depende de cómo quieres gestionar sus valores"
date = 2023-03-06
translationKey = "colecciones"
+++

Las colecciones son una de las estructuras de datos más utilizadas cuando programas, por lo tanto, es extremadamente importante conocer los diferentes enfoques que dispones para trabajar con ellas.

Los tipos de colección son tipos de datos complejos, y Swift permite usar tres tipos de colección: Arrays, Sets y Diccionarios para gestionar valores relacionados.

La fiabilidad de estas colecciones se basa en los tipos de valores y claves que puedes almacenar. Cuando creas una instancia de una colección, necesitas confirmar el tipo de valores que gestiona. Esto significa que: no puedes almacenar diferentes tipos a los que definiste previamente, y puedes estar seguro del tipo de datos que recuperarás cuando manejas una colección.

Además, gracias a la inferencia de tipo, puedes especificar el tipo, o Swift inferirá el tipo.

## Mutabilidad de las colecciones

Así como las variables y constantes, las colecciones pueden ser mutables o inmutables dependiendo de cómo fueron creadas.

Si almacenas un array, set o un diccionario en una variable, puedes mutar la colección, porque puedes agregar, remover o cambiar un único o múltiples valores en estas colecciones.

Pero, si lo almacenas en una constante, no puedes añadir nuevos elementos o modificar los que fueron instanciados.

## Diferencias entre arrays, sets y diccionarios

Los arrays son colecciones ordenadas, donde las duplicaciones están permitidas y los valores pueden ser accedidos por un índice numérico (posición en el array)

Los sets son colecciones desordenadas donde las duplicaciones no están permitidas, y los valores pueden ser iterados, pero no se pueden acceder por un índice o clave.

Los diccionarios son colecciones desordenadas compuestas por asociaciones de clave-valor.

## Fundamentos de los diferentes tipos de colección

### Arrays

Si quieres crear un array vacío, necesitarás especificar el tipo de dato. Hay diferentes maneras de crear un array vacío, este es un ejemplo.

```
var numbers = [Int]()
```

Pero, si quieres crearlo con valores, no necesitas especificar los tipos. A continuación, puedes ver cómo crear un array de strings

```
var tutorials = ["SwiftUI", "Combine", "AsyncAwait"] 
```

Y, si necesitas acceder a un valor, debes indicar la posición del valor en el array. Pero, recuerda que el índice de las colecciones comienza por 0.

```
let firstCourse = tutorials[0]
```
El código anterior almacenará `SwiftUI` en la constante `firstCourse`.

### Sets

Nuevamente, necesitarás especificar el tipo de dato para crear un set vacío.

```
var numbers = Set<Int>()
```

Crear un set con valores es similar a crear un array pero, en este caso, necesitarás especificar que es un set para no crear un array

```
var tutorials = ["SwiftUI", "Combine", "AsyncAwait"] 
```

Pero, en este caso, como los sets no tienen índice, no puedes usarlo para acceder a los datos. Al menos, puedes comprobar si el valor existe.

```
var swiftuiExists = tutorials.contains("SwiftUI")
```
El código anterior almacenará true en la variable `swiftuiExists`

### Diccionarios

Y, por último, puedes crear un diccionario vacío especificando tanto el tipo de clave como el tipo de valor

```
var nameOfNumbers = [Int: String]()
```

Para crear un diccionario con valores, también es similar a un array, pero tienes que escribir la clave de cada valor. Recuerda que las claves deben ser únicas.
```
var requirements = ["View":"SwiftUI", "Database":"CoreData", "AugmentedReality":"ARKit"]
```

Y, si quieres acceder a un valor, solo necesitas conocer el índice
```
let database = requirements["Database"]
```
***
En las próximas publicaciones, escribiré sobre métodos útiles en tipos de colección para gestionar arrays, sets y diccionarios.
