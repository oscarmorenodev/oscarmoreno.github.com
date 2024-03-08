+++
title = "Swift Strings"
description = "As other languages, Strings are a fundamental type that allows save text"
date = 2023-02-06
translationKey = "cadenas"
+++

When you save a text in a constant or a variable, your are saving a string in Swift. Furthermore, you can see a string as a serie of characters. For that reason, you can access to the content of a string in various ways, such as Collection (Array i.e.) of characters.

## Initialize a String
A string literal is a text writed with a double quote at beginning and at the end. So, if you need to save a text in a constant or a variable, you only must to assign a string literal to it.

```swift
let coach = "Ted Lasso"
var team = "AFC Richmond"
```

*NOTE: It is fundamental remember that strings are case sensitive. So, "a simple string" it is different of "A simple string".*

## Concatenating strings
If you need to save the value of two strings in another constant or variable, you can concatenate it.

It is as easy as use the operator `+` between the two values when you have to assign it.

```swift
let name = "Michael"
let lastName = "Scott"

let funnyBoss = name + lastName
```

Another way, it is to use the operator `+=` to add text to a previous initialized string
```swift
var spy = "Bond"
spy += ", James Bond"
```
In the above example, the final value of `spy` is `Bond, James Bond`

And, as a String is a Collection of characters, you can also use the method `.append()`
```swift
var greet = "Hello, world"
greet.append("!")
```
In the last code, greet value is `Hello, world!`

## String interpolation
But maybe the most used feature in Strings could be String interpolation. It allows use constants or variables values inside a string.

In this case, you can do it, writing the constant or variable name, inside parenthesis "()", and starting with a backlash "\". That is `\(variableName)`

```swift
let name = "Forest"
let fullName = "Forest Gump"

let introduction = "Hello, I am \(name), \(fullName)"
```
The final value of `introduction` is `"Hello, I am Forest, Forest Gump"`

## Multiline String
Finishing (althought it is not used often in real world apps) maybe sometimes you need to save larger texts in a string, and it could be difficult read the value for others programmers o for yourself. In this case, you can use a multiline string. 

To save a multiline string, you only need to write three quotation marks at the beginning, and finish with another three in a single line. For example:

```swift
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
You can see useful methods in the post [Useful String methods in Swift](../useful-strings-methods-swift)

Happy coding! 👨🏻‍💻
