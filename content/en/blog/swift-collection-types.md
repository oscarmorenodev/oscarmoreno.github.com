+++
title = "Swift Collection Types"
description = "Swift has three collection types to manage common values"
summary = "Swift has three collection types to manage common values"
date = 2023-03-06
translationKey = "colecciones"
aliases = "/blog/swift-collection-types"
+++

The collections are one of the most used data structure when you are programming so, it is extremely important know the different approach you dispose to work with them.

Collection types are complex data types, and Swift allow use three collection types: Arrays, Sets and Dictionaries for manage related values.

The reliability of these collections is based on the types of values and keys that you can store. When you create an instance of a collection, you need to confirm the type of values that it manages. This means that: you cannot store different types that you previously defined, and you can be sure the type of data you will retrieve when you manage a collection. 

Also, thanks to type inference, you can specify the type, or Swift will infere the type.

## Collection Mutability

As well as variables and constants, collections can be mutable or unmutable depending on how was created.

If you store an array, set or a dictionary in a variable, you can mutate the collection, because you can add, remove or change a single or multiple values in these collection. 

But, if you store it in a constant, you cannot add new elements or modify the ones with was instantiated.

## Diferences between arrays, sets and dictionaries

Arrays are ordered collections, where duplications are allowed and values can be accessed by a numeric index (position in the array)

Sets are unordered collections where duplications are no allowed, and values can be iterated, but cannot be accesed by an index or key.

Dictionaries are unordered collections composed by key-value associations.

## Fundamentals of different collection types

### Arrays

If you want to create an empty array, you will need specify the data type. There are different ways to create an empty array, this a example.

```swift
var numbers = [Int]()
```

But, if you want to create it with values, you don't need specify the types. Next, you can see how to create an strings array

```swift
var tutorials = ["SwiftUI", "Combine", "AsyncAwait"] 
```

And, if you need to access to a value, you must indicate the position of the value in the array. But, remember that collections index starts by 0.

```swift
let firstCourse = tutorials[0]
```
The above code will store "SwiftUI" in `firstCourse` constant.

### Sets

Again, you will need specify data type for create an empty set. 

```swift
var numbers = Set<Int>()
```

Create a set with values, is similar to create an array but, in this case, you will need to specify that is a set to don't create an array

```swift
var tutorials = ["SwiftUI", "Combine", "AsyncAwait"] 
```

But, in this case, as sets have not an index, you cannot use it to access to the data. At least, you can check if the value exists.

```swift
var swiftuiExists = tutorials.contains("SwiftUI")
```
The above code wil store true in ```swiftuiExists``` variable

### Dictionaries

And, lastly, you can create an empty dictionary specifying both the key type and the value type

```swift
var nameOfNumbers = [Int: String]()
```

To create a dictionary with values, it is also similar to an array, but you have to write the key of each value. Remember that the keys must be uniques.
```swift
var requirements = ["View":"SwiftUI", "Database":"CoreData", "AugmentedReality":"ARKit"]
```

And, if you want to access to a value, you only need know the index
```swift
let database = requirements["Database"]
```
***
<br/>
In next posts, I will write about useful methods in collection types to manage arrays, sets and dictionaries.

Happy coding! 👨🏻‍💻
