+++
title = "Devolviendo múltiples valores desde una función: Tuplas vs. Colecciones"
description = "Aprende como puedes devolver multiples valores desde una función"
date = 2023-06-12
translationKey = "salida-funciones"
+++

Como desarrolladores de iOS, a menudo nos encontramos con escenarios donde necesitamos devolver múltiples valores de una función. Swift nos ofrece dos enfoques útiles para lograr esto: utilizando tuplas y colecciones. En este artículo, exploraremos ambos métodos y entenderemos cuándo usar cada uno.

## Usando Tuplas
Las tuplas son estructuras de datos ligeras que nos permiten agrupar múltiples valores juntos. Proporcionan una forma sencilla de devolver múltiples valores de una función. Considera el siguiente ejemplo:

```
func getMovieDetails(movieId: Int) -> (String, String) {
    // Retrieve movie details from the database
    let movieTitle = "Back to the Future"
    let director = "Robert Zemeckis"

    return (movieTitle, director)
}

let movieDetails = getMovieDetails(movieId: 1)
print("Title: \(movieDetails.0)")
print("Director: \(movieDetails.2)")
```

En este ejemplo, la función `getMovieDetails` devuelve una tupla que contiene el título de la película y el director. Podemos acceder a valores individuales usando la sintaxis de punto y el índice correspondiente. Las tuplas son útiles cuando tenemos un número fijo de valores para devolver.

## Usando colecciones
Las colecciones, como arrays o diccionarios, ofrecen un enfoque más flexible para devolver múltiples valores. Veamos cómo podemos modificar nuestro ejemplo anterior para utilizar un array:

```
func getMovieDetails(movieId: Int) -> [String] {
    // Retrieve movie details from the database
    let movieTitle = "Back to the Future"
    let releaseYear = 1985
    let director = "Robert Zemeckis"

    return [movieTitle, String(releaseYear), director]
}

let movieDetails = getMovieDetails(movieId: 1)
print("Title: \(movieDetails[0])")
print("Release Year: \(movieDetails[1])")
print("Director: \(movieDetails[2])")
```

Aquí, la función getMovieDetails devuelve un array de strings, conteniendo el título de la película, el año de lanzamiento (convertido a string) y el director. Accedemos a los valores por sus respectivos índices. Las colecciones son ventajosas cuando tenemos un número variable de valores para devolver o si el número de valores puede cambiar en el futuro.

## Elegir entre Tuplas y Colecciones
Al decidir entre tuplas y colecciones, considera las siguientes pautas:

- Usa tuplas cuando tengas un número fijo de valores que no cambiará.
- Usa colecciones cuando el número de valores pueda variar o cuando necesites agregar o eliminar valores fácilmente.

## Conclusión
Devolver múltiples valores de una función en Swift es esencial en muchos escenarios de programación. Al utilizar tuplas o colecciones, podemos manejar eficientemente estas situaciones. Las tuplas son adecuadas para devolver un número fijo de valores, mientras que las colecciones ofrecen flexibilidad cuando el número de valores puede variar. Entender estas técnicas nos empodera para escribir un código más limpio y expresivo.

Recuerda experimentar con estos conceptos usando ejemplos del mundo real y explorar cómo pueden ser aplicados a tus propios proyectos.