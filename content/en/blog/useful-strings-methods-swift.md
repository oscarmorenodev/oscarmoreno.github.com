+++
title = "Useful String Methods in Swift"
description = "Learn useful String methods in Swift to display data as you need"
summary = "Learn useful String methods in Swift to display data as you need"
date = 2023-02-20
translationKey = "metodos-cadenas"
aliases = "/blog/useful-strings-methods-swift"
+++

This post is a complement for the previous one about [Swift Strings](../swift-strings).

I real-world projects, you can store a lot of strings but, it is important that you know how to transform those strings, to display them according to your view.

For this reason, let's see usual methods that you can use for it.

## Count characters
Because a String is a Collection of Characters, you can use a very common method in Arrays: `count()`

Either you can use it in a constant/variable or in a String

```swift
let starWarsIntro = "A long time ago..."
let numberOfCharacters = starWarsIntro.count()  // numberOfCharacters value 18

let numberOfCharactersOfGreet = "Hello World!".count() // numberOfCharactersOfGreet value is 12
```

Even you can combine values in the same String through String interpolation:

```swift
let plotTwist = "I am your father"
print("The number of character in \(plotTwist) is \(plotTwist).count()")

// It will print "The number of character in I am your father is 16"
```

## Insert or remove
Also it is important add or remove characters or substrings

### Insert
For insert, you can:
- Insert a character with the method `.insert(_ newElement:at:)`
- Insert a substring with the method `.insert(contentsOf:at:)`

In `at` you will need to write a index. You can know more about indexes in [Swift official Documentation - String Indices](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/#String-Indices)

```swift
var warning = "we have a problem"
warning.insert(contentsOf: "Houston, ", at: warning.startIndex)

print(warning) // It will print "Houston, we have a problem"
```

### Remove
Similar to insert, for remove Swift allow remove characters of substrings:
- Remove a character with the method `.remove(:at:)`
- Remove a substring with the method `removeSubrange(_ bounds:)`

Be careful with don't exit out of bounds

```swift
var greeting = "Hello World!"
greeting.remove(at: greeting.index(before: greeting.endIndex))
print(greeting)  // It will print "Hello World"
```

## Modify strings
### Uppercase and lowercase
The methods that you can use for it are `.uppercased()`, `.lowercased()` or `.capitalized()`

Examples:
```swift
let lordOfTheRings = "A ring to rule them all"
print(lordOfTheRings.uppercased()) // It will print "A RING TO RULE THEM ALL"
print(lordOfTheRings.lowercased()) // It will print "a ring to rule them all"
print(lordOfTheRings.capitalized) // It will print "A Ring To Rule Them All"
```
### Extract a string to an array
For this goal you can use `.components(separatedBy: " ")`

```swift
let et = “E.T. phone home.”
let etWords = et.components(separatedBy: " ")

// etWords value is equal to ["E.T.", "phone", "home."]
```

### Replacing occurrences
In this case, a useful method is `.replacingOccurrences(of:, with:)`, you can replace a character or a string with another character or string

```swift
let darkKnight = "I am Batman"
let coded = darkKnight.replacingOccurrences(of: "a", with: "4")

// coded value is equal to "I 4m B4tm4n"
```

Happy coding! 👨🏻‍💻
