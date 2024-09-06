+++
title = "Understanding how key-paths work"
description = "Key-path expressions offer an alternative for data access in types"
summary = "Key-path expressions offer an alternative for data access in types"
date = 2024-09-17T08:00:00+02:00
translationKey = "keypaths"
+++

Key-paths are a feature of Swift that can be confusing at first.

However, with the arrival of SwiftUI, their usage has expanded.

And their use is not limited to the new interface framework.

Understanding them can provide you with alternatives for accessing data in types.

## Writing a Key-Path Expression

Key-path expressions have the following structure

`\<#type name#>.<#path#>`

The *type name* is the concrete name of a type (structure, class, enumeration...) including basic types like `Int`, `[String]`, or `Set<Double>`.

The *path* can contain a property, a subscript, or optionals.

{{< alert "circle-info" >}}
When compiled, the key-path expression is replaced by an instance of the [KeyPath class](https://developer.apple.com/documentation/swift/keypath)
{{</ alert >}}

## Accessing a Value Using a Key-Path

So, if you want to access a key-path value, you can do so through the subscript that requires a ket-path, which is available for all types.

```swift
struct Driver {
    var name: String
}

let driver = Driver(name: "Fernando Alonso")
let pathToNameProperty = \Driver.name


let driverName = driver[keyPath: pathToNameProperty]
print(driverName) // Prints "Fernando Alonso"
```

Keep in mind that the *type name* can be omitted when type inference can determine the expected type.

```swift
struct Race {
    var winner: Driver
    
    func displayWinnerProperty(keypath: KeyPath<Driver, String>) {
        print("The winner is \(winner[keyPath: keypath])")
    }
}

let sai = Driver(name: "Carlos Sainz")
let race = Race(winner: sai)
race.displayWinnerProperty(keypath: \.name) // Prints "The winner is Carlos Sainz"
```

### Identity Key-Path

Additionally, the *path* can refer to `self`, known as an *identity key-path* (`\.self`).

The identity key-path refers to the instance itself.

Due to this, it can be useful to replace an entire instance with a single line.

```swift
var verstappenPoints = (a: 25, b: 18, c:25)
// Equivalent to verstappenPoints = (a: 18, b: 25, c: 25)
verstappenPoints[keyPath: \.self] = (a: 18, b: 25, c: 25)
print(verstappenPoints) // Prints "(a: 18, b: 25, c: 25)"
```

But this feature is often leveraged in SwiftUI, for example, in a ForEach.

```swift
List {
    ForEach([2, 4, 6, 8, 10], id: \.self) {
        Text("\($0) is even")
    }
}
```

### Accessing Multiple Values from a Type

Another feature is that you can access nested properties.

So, you can refer to the property of a property value.

Here's an example:

```swift
struct Championsip {
    var winner: Driver
    
    init(winnerName: String) {
        self.winner = Driver(name: winnerName)
    }
}

let champion = Championsip(winnerName: "Max Verstappen")
let nestedKeyPath = \Championsip.winner.name

let championName = champion[keyPath: nestedKeyPath]
print(championName)  // Prints "Max Verstappen"
```

### Accessing Subscripts

Also, there are another possibility. The *path* can include [subscripts](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/) using square brackets.

```swift
let tracks = ["Spa", "Monza", "Montmelo", "Suzuka"]
let fasterTrack = tracks[keyPath: \[String].[1]]
print(fasterTrack) // Prints "Monza"
```

{{< alert >}}
In this case, it's essential that the subscript parameter type conforms to the `Hashable` protocol.
{{</ alert >}}

Also, you should note that in this case, the captured values use value semantics, not reference semantics.

So, a copy will not update its value even you modify the original.

Here's an example:

```swift
var index = 1
let pathToTrack = \[String].[index]
let closure: ([String]) -> String = { strings in strings[index] }

print(tracks[keyPath: pathToTrack]) // Prints "Monza"
print(closure(tracks)) // Prints "bonjour"

index += 1
print(tracks[keyPath: pathToTrack])
// Prints "Monza"

// Because 'fn' closes over 'index', it uses the new value
print(closure(greetings))
// Prints "Spa"
```

### Accessing Optional Values

To access optional values, you simply need to use optional chaining or force unwrapping.

Again, an example.

```swift
let firstTrack: String? = tracks.first
let count = tracks[keyPath: \[String].first?.count]
print(count as Any)
// Prints Montmelo characters number "Optional(8)"
```

## Key-Path as an Alternative to Closures and Functions

You can also use key-paths in other contexts.

For example, in situations where you need to pass a function or closure.

```swift
struct Lap {
    var time: Double
    var valid: Bool
}
var timelaps = [
    Lap(time: 106.0, valid: true),
    Lap(time: 99.5, valid: true),
    Lap(time: 102.0, valid: false)
]

// Usual
let validLaps1 = timelaps.filter{ $0.valid }
print(validLaps1.count) // Prints "2"

// Equivalent with key-paths
let validLaps2 = timelaps.filter(\.valid)
print(validLaps2.count) // Prints "2"
```

Note at the end of the example, where you can filter the valid laps with `.filter(\.valid)` instead of most common `.filter{ $0.valid }`

## Scope of Key-Paths

Lastly, regarding key-paths, there's something important you should keep in mind.

{{< alert "circle-info" >}}
The results of a key-path expression are only evaluated at the point where that expression is evaluated.
{{< /alert >}}

If you call a function within a subscript in a key-path expression, the function will only be called once, as part of the expression's evaluation, but not every time the key-path is used.

You can see this new example:

```swift
func displayValidLap() -> Int {
    print("Valid lap!")
    return 0
}

let greetingKeyPath = \[Lap][displayValidLap()]
// Prints "Valid lap!"

// Using greetingKeyPath doesn't call displayValidLap again.
let someLap = timelaps[keyPath: greetingKeyPath]
```

## Conclusion

Key-paths are complex and can be difficult to see their utility.

However, they are used in SwiftUI, so it's important to know and understand them.

Most importantly, remember that:

- Their structure is `\<#type name#>.<#path#>`.
- The *type name* is the name of the type and the *path* is the name of the property's type.
- When compiled, they are replaced by an instance of the `KeyPath` class.
- You can access:
  - A parameter
  - An entire instance (`\.self`)
  - A subscript
  - An optional value

And since practice makes perfect, here's a playground for you to play with 😉

{{% resources pattern="key-paths-swift.playground.zip"/%}}

## Source

[Key-path Expressions - Swift Documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/expressions/#Key-Path-Expression)
