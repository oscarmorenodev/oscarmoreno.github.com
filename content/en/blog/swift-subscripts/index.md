+++
title = "Access collections in a easy way"
description = "Subscripts allow you to access different data in a more flexible and customizable way"
summary = "Subscripts allow you to access different data in a more flexible and customizable way"
date = 2024-10-08T08:00:00+02:00
translationKey = "subscripts"
+++

A few weeks ago, while writing about [key-paths](../key-path-expressions-swift), **subscripts** attracted my attention.

So, I continued investigating it, and now that I have seen the advantages it offers, I'll explain how to take advantage of it to have more customized and readable code.

## What are subscripts in Swift

Subscripts in Swift provide you with a flexible way to access elements found in collections, sequences, or custom types.

These custom types could be classes, structures, or enumerations.

They offer a simple syntax for setting and retrieving values without the need for separate methods for *getters* and/or *setters*.

Subscripts are special methods that allow access to elements in a collection-like type.

And for this, the same notation as [arrays](../swift-collection-types.md#arrays) is used. That is, using square brackets `[]`.

## How to create subscripts

To create a subscript, you simply need to create a method with the name `subscript`.

```swift
subscript(index: Index) -> OutputType {
    get {
        // Return a value
    }
    set(newValue) {
        // Set a value
    }
}
```

It's not mandatory to use `set` if you simply want to return the value, so it wouldn't be necessary to explicitly indicate the `get` either.

```swift
subscript(index: Index) -> OutputType {
    // Return a value
}
```

## How to access elements using subscripts in Swift

Following the previous syntax, here you can see how to create a `subscript` method for a structure that returns the element you ask for from the Fibonacci sequence.

```swift
struct Fibonacci {
    subscript(position: Int) -> Int {
        guard n > 1 else { return n }
        var a = 0, b = 1
        for _ in 2...n {
            let temp = a + b
 a = b
 b = temp
 }
        return b
 }
}
```

As you can see, you can pass a `position` parameter to the `subscript` method to know the position of the element you want to obtain.

As you can also check, you don't need a *setter* to set a value.

So if you indicate the position you want, you can have the value of that position.

```swift
let fib = Fibonacci()
// Prints "13"
print(fib[7]) 
```

## Subscripts with multiple parameters

Subscripts can take multiple parameters, allowing more complex forms of access.

Here you can see an example of a structure to create a 3D cube.

```swift
struct Cube3D {
    private var cells: [[[Int]]]
    let size: Int
    
    init(size: Int, defaultValue: Int = 0) {
        self.size = size
        self.cells = Array(repeating: Array(repeating: Array(repeating: defaultValue, count: size), count: size), count: size)
 }
    
    subscript(x: Int, y: Int, z: Int) -> Int {
        get {
            guard isValidIndex(x: x, y: y, z: z) else {
                fatalError("Index out of range")
 }
            return cells[x][y][z]
 }
        set {
            guard isValidIndex(x: x, y: y, z: z) else {
                fatalError("Index out of range")
 }
 cells[x][y][z] = newValue
 }
 }
    
    subscript(xRange: Range<Int>, yRange: Range<Int>, z: Int) -> [[Int]] {
        guard isValidRange(xRange: xRange, yRange: yRange, z: z) else {
            fatalError("Range out of cube bounds")
 }
        return xRange.map { x in
 yRange.map { y in
 cells[x][y][z]
 }
 }
 }
    
    private func isValidIndex(x: Int, y: Int, z: Int) -> Bool {
        return x >= 0 && x < size && y >= 0 && y < size && z >= 0 && z < size
 }
    
    private func isValidRange(xRange: Range<Int>, yRange: Range<Int>, z: Int) -> Bool {
        return xRange.lowerBound >= 0 && xRange.upperBound <= size &&
 yRange.lowerBound >= 0 && yRange.upperBound <= size &&
 z >= 0 && z < size
 }
}
```

After the parameters and the initializer, it has two `subscript` methods.

The first takes three position parameters, to determine the place in the 3D cube, and has both a getter and a setter.

The second also takes several parameters, of type `Range`.

This second subscript would allow obtaining a 2D slice of the cube.

{{< alert >}}
As you are working with collections and sequences, it is very important to check that you never access positions outside the index to avoid crashes. That's why the `isValidIndex` and `isValidRange` methods.
{{</ alert >}}

And now, you'll be able to assign and retrieve the cube values.

```swift
var cube = Cube3D(size: 5, defaultValue: 0)

cube[0, 0, 0] = 1
cube[1, 2, 3] = 5
cube[4, 4, 4] = 9

// Prints  "1"
print(cube[0, 0, 0])
// Prints "5"
print(cube[1, 2, 3])
// Prints "9"
print(cube[4, 4, 4])

let slice = cube[0..<2, 0..<3, 0]
// Prints [[1, 0, 0], [0, 0, 0]]
print(slice)
```

## Type Subscripts

You can also define subscripts on the type itself, instead of on instances.

To do this, indicate the `static` keyword before `subscript`, just as you would create any static method.

```swift
enum DayOfWeek: Int {
    case monday = 1
    case tuesday
    case wednesday
    case thursday
    case friday
    case saturday
    case sunday
    
    static subscript(index: Int) -> DayOfWeek? {
        return DayOfWeek(rawValue: index)
 }
}
```

And now, if you want to access any day of the week from the enumeration, you just need to indicate its index.

```swift
// day is equal to .wednesday
let day = DayOfWeek[3]
```

{{< alert >}}
Note that Monday has been assigned 1 since, at least in Spain, Monday is the first day of the week.
And it feels more natural to access it that way. If it hadn't been indicated, in the previous example, `day` would be equal to `thursday` and the `monday` case would be accessed through index 0.
{{</ alert >}}

## Conclusions

Summarizing, about *subscripts*, the most important points:

- They provide shorthand access to collection elements.
- They can be used both to get and set values.
- Multiple subscripts can be defined for a single type.
- Subscripts can have multiple input parameters.
- You can create static subscripts that don't belong to the instance but to the type.

But, keep the following in mind to make the most of them:

- Use them when they provide you with a more natural syntax for accessing elements in your custom types.
- Remember to handle errors and check bounds in subscripts.
- Make sure when you should use read-only or read/write subscripts.
- Use type subscripts only when it makes sense to access values directly on the type instead of on instances.

And as usual, here is a playground for you to practice.
{{% resources pattern=".*\.(zip)" color="blue" icon="fa-solid fa-file-arrow-down" /%}}

## Sources

[Subscripts - Official Swift Documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
