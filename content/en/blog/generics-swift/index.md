+++
title = "Optimize code in Swift with generics"
description = "Generics in Swift allow you to use very similar code for operations with different types"
summary = "Generics in Swift allow you to use very similar code for operations with different types"
date = 2024-10-01T08:00:00+02:00
translationKey = "generics"
+++

As project complexity grows, it's common to create very similar code.

You already know the best way to optimize it is not to repeat it.

Or at least, take advantage of common points.

In this case, using *generics* can be very helpful.

They may seem complex at first.

But if you get used to using them, you'll have cleaner and more reusable code.

## Why use generics in Swift?

Imagine you have a method as simple as the following, which shows a message with a value you pass as a parameter.

```swift
func logString(value: String) {
    print("INFO - Value recorded: \(value)")
}

// Prints "INFO - Value recorded: RandomResult"
logString(value: "RandomResult")
```

But what if you also need to pass an integer value?

That method would also be simple.

```swift
func logInt(value: Int) {
    print("INFO - Value recorded: \(value)")
}

// Prints "INFO - Value recorded: 10"
logInt(value: 10)
```

But, as you've probably noticed, it's practically the same as the first one.

And what if you wanted to capture values of other data types? `Double`, `Bool`, `Float`...

You've likely already guessed the problem this can cause.

There would be a significant amount of duplicated code, and therefore, inefficiency.

This is the problem that generics solve.

They allow you to create functions and types that work with different types without repeating code.

## How do you create generics in Swift?

Swift allows you to create both generic functions and your custom generic types.

### Type parameter names

Before creating generics, it's important to understand how to name them.

Although you may not have noticed, you've already used generics before.

For example, when you've used an [array](../colecciones-swift#arrays), which is defined as `Array<Element>`.

`Element` is any type that makes up the array: `String`, `Int`, `Double`...

The same goes for [dictionaries](../colecciones-swift#diccionarios), which in this case are defined as `Dictionary<Key, Value>`.

That's why dictionaries work with two elements: a key and a value.

In some cases, descriptive names like `Element`, `Key`, and `Value` are used in generics...

But in others, when there's no meaningful relationship, a single uppercase letter is typically used.

The convention, in this latter case, is to use `T`, `U`, or `V`.

And if you need more? Well, in that case... you might want to review that code to avoid so many parameters 😉

### Generic functions

Taking the earlier example about log messages, you could create a generic function as follows:

```swift
func log<T>(value: T) {
    print("INFO - Value recorded: \(value)")
}
```

The first difference is replacing the parameter types of the function.

That is, the type of the `value` parameter is `T`, instead of `String` or `Int`.

`T` refers to any Swift type.

The second difference is including the generic type to be used, following the function name, between `<` and `>`.

### Generic types

Generics aren't limited to functions.

Imagine you want to create a store to store `String` values.

It could be a structure like the following:

```swift
struct StringsStore {
    var content: [String]
    
    mutating func add(string: String) {
        content.append(string)
    }
    
    mutating func clear() {
        content.removeAll()
    }
}
```

But again, you'd have the same limitation if you wanted to accept integers as well.

So, like in the case of functions, you'd need to replace the parameter type, using, for example, `Element`.

And following the type name, you'd include the type with `<Element>`.

```swift
struct ValuesStore<Element> {
    var content: [Element]
    
    mutating func add(value: Element) {
        content.append(value)
    }
    
    mutating func clear() {
        content.removeAll()
    }
}
```

And now, you can use it with different types:

```swift
var intsStore = ValuesStore(content: [2,4,5])
intsStore.add(value: 10)

// Prints "[2, 4, 5, 10]"
print(intsStore.content)

var doublesStore = ValuesStore(content: [2.5, 4.7, 5.8])
doublesStore.add(value: 4.7)

// Prints "[2.5, 4.7, 5.8, 4.7]"
print(doublesStore.content)
```

## Generic extensions

You can also create extensions of generic types.

And you don't need to specify the parameter type again.

That is, you can use the same one from its definition.

In the case of `ValuesStore`, it would be as follows:

```swift
extension ValuesStore {
    var lastElement: Element? {
        content.last
    }
}

// Prints "10"
print(intsStore.lastElement ?? "Empty store")
```

## Restricting generics with Where

There may be situations where you need a generic for several types... but not for *all* types.

Imagine the following case:

```swift
func sumTwoValues<T>(valueA: T, valueB: T) -> T {
    // ERROR: Binary operator '+' cannot be applied to two 'T' operands
    valueA + valueB
}
```

In the example above, you could use integers, doubles, or any type of number, since a sum will be performed.

But you couldn't pass two `Bool` values because they can't be summed.

Solution? Restrict `T` to only allow types that conform to the `Numeric` protocol.

To do this, simply use the `where` clause to indicate the types for `T`.

```swift
func sumTwoValues<T>(valueA: T, valueB: T) -> T where T: Numeric {
    valueA + valueB
}
```

And now, you can perform the desired operations.

```swift
// Returns 7
sumTwoValues(valueA: 2, valueB: 5)

// Returns 31.1
sumTwoValues(valueA: 10.5, valueB: 20.6)
```

## Using multiple generics

In the previous examples, you've seen how to use a single generic type: `T`, or `Element`.

This means it could accept any type, but with the limitation that said type was always the same.

In the previous example, where two values were summed, you could sum two integers or two doubles, etc... But always the same value.

Using multiple types is very simple; you just need to declare other generic types, separated by commas. And keeping in mind the standard naming convention mentioned earlier.

Here's another example:

```swift
func displayTemp<City,Temp>(city: City, temp: Temp) where City: StringProtocol, Temp: Numeric {
    print("\(city):\(temp)")
}
```

{{< alert >}}
The code above is not optimal, as it could be simplified if the parameters conformed to the `StringProtocol` and `Numeric` protocols (`displayT(city: String, temp: any Numeric)`), has been used to show a simple example.
{{</ alert >}}

And now you can use different generic types.

```swift
// Prints "Valencia:20"
displayTemp(city: "Valencia", temp: 20)

// Prints "Munich:5.5"
displayTemp(city: "Munich", temp: 5.5)
```

## Conclusion

So, to summarize the most important points:

- You should use generics to unify similar code that performs operations with different types.
- You can use them in functions or types.
- You can use:
  - Words like `Element`, `Key`, or `Value` if they have a meaningful relationship.
  - Letters like `T`, `U`, or `V` for more abstract cases.
- If you want to constrain the types of a generic, use the `where` clause to specify a protocol.
- If you only specify one generic type, you must always use the same type in the function or type.

And if you want to practice, here's the playground with examples 🙂

{{% resources pattern="generics-swift.playground.zip"/%}}

## Source

[Generics - Swift Documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/)
