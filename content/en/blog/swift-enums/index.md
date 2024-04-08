+++
title = "Enumerations"
description = "With enumerations you can define a common type for associated values"
summary = "With enumerations you can define a common type for associated values"
date = 2024-03-11
translationKey = "enumeraciones"
+++

Enumerations, or simply `enums` as we know them in Swift, are a indispensable tool in your development kit, allowing you to define a common type for a related values group. This not only improves the readability of your code, but also facilitates its maintenance and helps you avoid those common errors that we all like to avoid. If you're starting out in Swift and still getting familiar with function creation, understanding enumerations can be a game change.

## What are enumerations?

Imagine you're working on a TV show app. You have different genres like drama, comedy, horror, etc. Instead of managing these genres as text strings (which could lead to typing errors) you can define an enumeration:

```swift
enum TVShowGenre {
    case drama
    case comedy
    case horror
    case sciFi
}
```
With this definition, you can use `TVShowGenre` in a safe and controlled manner, thus improving the readability and consistency of your code.

## When to use enums?

Enumerations are incredibly useful when you need to group sets of related values that you already know. For example, in an app to follow Formula 1 seasons, you could have an enumeration for the teams:

```swift
enum F1Team {
    case mercedes
    case ferrari
    case redBull
    case mclaren
}
```
This approach ensures that you can only assign drivers to the teams that exist in your enumeration, avoiding incorrect assignments.

## Associated Values
Swift takes enumerations even further, allowing cases with associated values. This means you can store additional values of other types along with the enumeration cases. Imagine you're creating a video game and want to define different types of enemies, some with special attributes:

```swift
enum Enemy {
    case soldier
    case wizard(magicStrength: Int)
    case boss(isFinal: Bool, lives: Int)
}
```
Here, `wizard` has an associated value `magicStrength`, and `boss` has two associated values, indicating whether it is the final boss and how many lives it has. This allows you to handle each type of enemy more specifically and detailed in your game.

## Raw Values and Inheritance from the String Protocol

Enumerations in Swift can have *raw values*, which are predefined values that you can associate with each case of the enumeration. This is especially useful when your enumeration needs to represent a specific string or numeric value for each case.

For example, you could have an enumeration that represents Formula 1 drivers, where each driver is associated with their corresponding full name:

```swift
enum Drivers: String {
    case verstappen = "Max Verstappen"
    case alonso = "Fernando Alonso"
    case leclerc = "Charles Leclerc"
}
```
Here, `Drivers` is an enumeration that inherits from the `String` protocol. This means that each case has a raw value of type `String` that matches its name. For example, you can access the raw value of a driver in the following way:

```swift
let driver = Drivers.verstappen
print(driver.rawValue)  // Prints "Max Verstappen"
```
This is particularly useful when you need to work with data that comes from an external source that uses string representations, such as a web server or a database.

In addition, when an enumeration inherits from the `String` protocol, Swift automatically assigns to each case a raw value that matches the case name, saving you the need to explicitly assign a raw value to each case.

```swift
enum Track: String {
    case monaco
    case spa
}

let track = Track.monaco.rawValue // track is a String with value "monaco"
```

In summary, the use of raw values and inheritance from the `String` protocol in your enumerations can improve the readability of your code, facilitate interaction with other parts of your code that use strings and numbers, and help you avoid errors when handling external data. I hope this helps you understand even more the power of enumerations in Swift!

## Conclusion
Enumerations in Swift are a powerful and safe way to work with sets of related values:
- They facilitate the writing of **cleaner and more maintainable** code, while preventing common errors by limiting the values to those defined in the enumeration. 
- Associated values offer additional flexibility, allowing you to **include specific information** directly in your data types. 
- Raw values let you use **strings** of your values. 

By mastering enumerations, you are taking a huge step towards more robust and efficient software development. It's your turn to experiment with them and see all they can do for your projects!