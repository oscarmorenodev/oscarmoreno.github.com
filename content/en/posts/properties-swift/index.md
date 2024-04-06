+++
title = "Defining characteristics of types: The properties"
description = "Properties allow you to store values with information about the type that defines them"
summary = "Properties allow you to store values with information about the type that defines them"
date = 2024-04-18
translationKey = "propiedades"
+++

Properties are a fundamental feature in any object-oriented or, as in the case of Swift, protocol-oriented language.

Think of an object, for example, a smartphone. You could see that a smartphone has:

- Behaviors
- Characteristics

Among the behaviors you could identify: Call a contact, browse the internet, take a photo... That is, actions you can perform with the device, or in other words: what it can do.

And about the characteristics, you could see: the size of the screen, the weight, the color... That is, details that define what the object is like, or rather, **properties**

And the properties are those that will store the characteristics of the types (classes, structures, enumerations or protocols) that define said property.

With that, we can define the properties in 2 different ways: through **stored properties**, or through **calculated properties**.

## Stored properties

Stored properties are the simplest way to define a property. Within a type, you indicate its property; and to do this, write the type of value (constant or variable), next to the name of the property.

From there, you can indicate the type of value (and you will assign the value when you initialize it) or you can assign it a value, and Swift will infer the type of data you are storing.

```swift
struct Movie {
     let title: String
     let year: Int
     var released = false
}

var theFuture = Movie(title: "The future", year: 2026)
```

In that example, you can see 3 properties for the `Movie` structure.

The title and year, you must indicate it at initialization. While, if you do not indicate otherwise, the instance is created indicating that the movie has not been released since `released` will be initialized as `false` if you have not indicated anything.

### Properties on constant instances

It is important that you keep in mind that if you create an instance in a constant, two different situations can occur, depending on whether it is a structure or a class.

In the case of structures, since they are types by value, you will not be able to modify the properties of the instance (even if you have defined those properties with variables). And the instance will be stored in a **constant** location, and therefore, it will be *immutable*.

This does not happen with classes since, since they are reference types, what they keep constant is the reference to the location in memory. Therefore, you can modify the content and therefore its properties (as long as you have defined those properties as variables)

```swift
struct VideogameStruct {
     let title
     var played
}

class VideogameClass {
     let title
     var played
}

let videogameInStruct = VideogameStruct(title: "The last of us", played: false) // ERROR: Change 'let' to 'var' to make it mutable
let videogameInClass = VidegameClass(title: "God of war", played: false)

videogameInStruct.played = true // ERROR: Change 'let' to 'var' to make it mutable
videgameInClass.played = true // You can change the value.
```

As you see, in case of structure, this code will not compile. Both at instantiation and when trying to modify the value, it will tell you to change `let` to `var` to make it mutable.

### Lazy properties

Lazy properties are *lazy* properties because their initial value is not calculated until they need to be used.

To define them you just have to use the reserved word `lazy` at the beginning of the declaration.

```swift
class Network {
     var online: Bool = false
     // Logic to check if internet connection works.
}

struct Device {
     let owner: String
     lazy var network = Network()
}
```

The `lazy` properties are especially useful for optimizing performance, since the value will not be accessed if it is not needed.

In the previous example, you can instantiate the device and assign it an owner, but since knowing if it is online is a more complex task that involves other operations, you can continue without checking it until you need it.

{{< alert >}}
If multiple threads simultaneously access a `lazy` property that has not been initialized, Swift cannot guarantee that it will only be initialized once.
{{< /alert >}}

## Computed properties

The other property types, **computed properties**, do not store a value directly, but instead compute them and return them when its called.

They are useful when their value depends, for example, on the value of other properties within that same type.

Here you can see a example:

```swift
struct TVSeries {
     var title: String
     var startYear: Int
     var endYear: Int? // A nil value indicates the series has not concluded

     // Computed property to determine if the series is still airing
     var isAiring: Bool {
         get {
             if let endYear = endYear {
                 return false // The series has concluded
             } else {
                 return true // The series is still airing
             }
         }
        
         set {
             let result = newValue ? "is" : "is not"
             print("\(title) \(result) on air!")
         }
     }
}

let breakingBad = TVSeries(title: "Breaking Bad", startYear: 2008, endYear: 2013)
let strangerThings = TVSeries(title: "Stranger Things", startYear: 2016, endYear: nil)

print("\(breakingBad.title) is still airing?: \(breakingBad.isAiring)")
print("\(strangerThings.title) is still airing?: \(strangerThings.isAiring)")
```

In this structure fragment from a TV series, you can see that the calculated property is divided into two components: the get (which will be executed when you want to access the value, that is, on the `print` line) and the set (which is executed when the value of the calculated variable has been set, after the `print` has been executed)

So, in the get, you can see that when you need the value the `isAiring` property (which indicates whether it is airing) will check to see if it has an end date (in which case, it will no longer be airing).

The set, however, will print a message depending on whether the value has been set to true or false. As you can also see, the new value can be accessed using the `newValue` variable that Swift will create automatically.

### Read-only properties

Calculated properties, which only have `get` but do not have `set` will be considered read-only properties, since nothing will be executed, when the value is set, and therefore will only be readable.

You can see this example:

```swift
struct Rectangle {
     var width: Double
     var height: Double

     var area: Double {
         get {
             return width * height
         }
     }
}
```

The area of a rectangle can only be read, since if you modify it, you would necessarily modify the width and/or height, which is why in this example, there is only the get.

The previous example can be simplified in two ways:

- It only has the get so, it can be omitted.
- There is only a single statement, the `return` can be omitted.

```swift
struct Rectangle {
     var width: Double
     var height: Double

     var area: Double {
         width * height
     }
}
```

This way, you can improve the readability of your code... and whoever has to maintain it will thank you 😉.

## Property Observers

Property observers make it possible to take actions when the value of a property changes. That is, it would be similar to `set` of a calculated property, but observers allow you to execute actions:

- Before the value is changed (willSet)
- When the value has been changed (didSet)

{{< alert >}}
Property observers will run WHENEVER a value is set to a property. Although the established value is the same as it was previously.
{{< / alert >}}

Property observers can be used in:

- Stored properties that you define
- Stored properties that you inherit
- Calculated properties that you inherit

Look at this other example:

```swift
struct ProgressTracker {
     var task: String
     var percentageComplete: Double {
         willSet(newPercentage) {
             print("Will set percentageComplete for \(task) to \(newPercentage)%")
         }
         didSet {
             print("Did set percentageComplete for \(task) from \(oldValue)% to \(percentageComplete)%")
             if percentageComplete == 100.0 {
                 print("\(task) is now complete.")
             }
         }
     }
}

var reportProgress = ProgressTracker(task: "Download", percentageComplete: 0)
reportProgress.percentageComplete = 30
reportProgress.percentageComplete = 80
reportProgress.percentageComplete = 100
```

As you can see, you can pass the name of the value that you can use in its block (such as with the constant `newPercentaje`).

You can also use `oldValue`, which is the constant that Swift automatically creates, and which stores the old value.

## Property wrappers

Finally, it is important to know that there are also property wrappers, they allow you to separate the code that manages how a property is stored and the code that defines said property, and this is achieved by wrapping the calculation.

You could do it in the following way:

```swift
@propertyWrapper
struct NonNegative {
     private var value: Int

     var wrappedValue: Int {
         get { value }
         set { value = max(0, newValue) } // Ensure the value is never negative
     }

     // Initialize with a value that is guaranteed to be non-negative
     init(wrappedValue: Int) {
         self.value = max(0, wrappedValue)
     }
}

struct InventoryItem {
     @NonNegative var stock: Int
}

var item = InventoryItem(stock: 5)
print(item.stock) // Prints: 5

item.stock = -3
print(item.stock) // Prints: 2
```

With this example, you can try on the one hand how properties are managed to check that a property does not have a negative integer value. And thus, reuse it in other parts of the code, without having to copy and paste the content of the getters and setters.

The use of property wrappers requires and allows many more details, so if you want to know more you can see it in the [official documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming- language/properties/#Property-Wrappers).

## Conclusion

You have seen how properties basically define the characteristics of the type to which they belong.

But, in order to make the most of them, and optimize your code, it is key to know all the operations you can do with them.

Swift, like many other features, offers different methods for accessing, calculating, and returning property values, which makes writing efficient code easier.
