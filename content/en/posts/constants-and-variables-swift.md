+++
title = "Constants and Variables to Save Values in Swift"
description = "How to save and manage data values in Swift"
date = 2023-01-16
translationKey = "constantes-variables"
+++

Programming is a way to manage data, and usually, you need save multiple values temporally: to manage it after other operations, to display it…

For this matter, as another programming languages, Swift is able to store values in constants and variables.

Thanks to constant and variables you are able to associate a name that you choose to a value.

## Constants
A constant value is saved in a memory space, and it can’t be modified. After a value is established in a constant, it remains immutable.

### How to declare a constant
To declare a constant you must start with reserved word let, followed by a name you choose. Then, you must can use the operator ‘=‘ and assign a value.

In the next example, ‘let’ is the reserved word for constants, survivor the name of the constant, and the value that is assigned to the constant ‘survivor’ is “Jack Shepard”. 

```
let survivor = “Jack Shepard”
```

The value is between double quotes because is a String value type. You can read about Strings in official documentation: [Strings and Characters](https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html) 

{{< alert "lightbulb" >}}
Do you know why Swift use `let` instead `const` or similar as another languages?
It comes from the mathematics world, where they say things like:
> let x be equal to 5
{{< /alert >}}

## Variables
A variable is a value that you can modify after have been declared. So, is a mutable value.

### How to declare a variable
To declare a variable, the structure is the same as a constant, but you must use the reserved word `var`

Then, for declare a variable you must write

```
var videogame = “Metal Gear Solid”
```

Ok but, if we want to change a var value, how should we do it? Easy, you only need assign a new value, and don’t write the reserved word var

```
videogame = “Uncharted”
```

## Naming a constant, variable or value
You can use almost any character for a name of constant or variable, including Unicode characters. It means that you can use for example emojis

But it is something that a I wouldn’t recommend. Why? Because the name of a constant or a variable, should explain without any doubt what is stored within.

For example, which one explain what means the value 10?

```
let times = 10

let numberOfTimesIHaveSeenBackToTheFutureTrilogy = 10
```
In second case is easier to know

## Conclusion

So, don’t worry about numbers of characters for the name. It is more recommended use a large (but descriptive ) name than use another shorter that doesn’t specify what stores. And, nowadays, IDE’s are in charge to autocomplete names, it won’t be difficult write them 😉

Happy coding! 👨🏻‍💻
