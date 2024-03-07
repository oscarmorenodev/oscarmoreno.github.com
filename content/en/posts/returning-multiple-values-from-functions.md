+++
title = "Returning Multiple Values from a Function: Tuples vs. Collections"
description = "Learn how you can return multiple values from a single function"
date = 2023-06-12
translationKey = "salida-funciones"
+++

Working as iOS developers, we often come across scenarios where we need to return multiple values from a function. Swift provides us with two useful approaches to achieve this: using tuples and collections. In this article, we will explore both methods and understand when to use each one.

## Using Tuples
Tuples are lightweight data structures that allow us to group multiple values together. They provide a simple way to return multiple values from a function. Consider the following example:

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

In this example, the getMovieDetails function returns a tuple containing the movie title and director. We can access individual values using dot syntax and the corresponding index. Tuples are handy when we have a fixed number of values to return.

## Using Collections
Collections, such as arrays or dictionaries, offer a more flexible approach for returning multiple values. Let's see how we can modify our previous example to utilize an array:

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

Here, the getMovieDetails function returns an array of strings, containing the movie title, release year (converted to a string), and director. We access the values by their respective indices. Collections are advantageous when we have a varying number of values to return or if the number of values may change in the future.

## Choosing Between Tuples and Collections
When deciding between tuples and collections, consider the following guidelines:

- Use tuples when you have a fixed number of values that won't change.
- Use collections when the number of values may vary or when you need to easily add or remove values.

## Conclusion
Returning multiple values from a function in Swift is essential in many programming scenarios. By utilizing tuples or collections, we can efficiently handle these situations. Tuples are suitable for returning a fixed number of values, while collections offer flexibility when the number of values may vary. Understanding these techniques empowers us to write cleaner, more expressive code.

Remember to experiment with these concepts using real-world examples and explore how they can be applied to your own projects.

Happy coding! 👨🏻‍💻
