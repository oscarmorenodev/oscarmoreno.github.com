+++
title = "How to create Property Wrappers for reuse code"
description = "Property wrappers allow you to encapsulate repetitive code for properties"
summary = "Property wrappers allow you to encapsulate repetitive code for properties"
date = 2024-09-10T08:00:00+02:00
translationKey = "propertyWrappers"
+++

The first time I encountered a property wrapper was in SwiftUI, but it's a feature of Swift that you can use since version 5.1.

Properties define characteristics of types, but often you have to perform (the same) operations on them.

The simplest way to perform these operations is by using [property observers](../properties-swift#property-observers), which I mentioned earlier.

But what if you need to perform those operations too many times? If you only use observers, you'll soon have duplicated code.

The solution is to use property wrappers.

## Property Wrappers in Swift

Property wrappers add a layer of separation between the code that defines a property and the code that manages how it is stored.

Their main advantage is that you write the code that operates on that property once, and then reuse it in the properties you need.

### How to Create a Property Wrapper in Swift

In the following code, you can see how a property wrapper is created:

```swift
@propertyWrapper
struct DashCase {
    private var text = ""
    var wrappedValue: String {
        get {
            text
        }
        set {
            text = newValue.lowercased().replacingOccurrences(of: " ", with: "-")
        }
    }
}
```

You can create a class, a structure, or an enumeration, and it must be preceded by the `@propertyWrapper` attribute directive.

The type must have a property called `wrappedValue`, which will return the value you define when a property with the created property wrapper is accessed.

Thus, we could use the previous property wrapper as follows:

```swift
struct Branch {
    @DashCase var name: String
}

var branch = Branch()
branch.name = "Random Branch Name"

print(branch.name) // Prints "random-branch-name"
```

This way, `Branch` does not need to format the name each time. Additionally, you can use `DashCase` whenever you need to format text to lowercase and hyphens.

```swift
struct File {
    @DashCase var name: String
}

var file = File()
file.name = "Random File Name"

print(file.name) // Prints "random-file-name"
```

> Note that if you declare an additional property in the type, it is advisable to declare it as private. This ensures that in the implementation, the value can only be accessed through the `wrappedValue`.

### Setting Initial Values for a Property Wrapper

Additionally, if needed, you can use an initializer.

This allows you to create the property wrapper in the following way:

```swift
@propertyWrapper
struct SnakeCase {
    var wrappedValue: String
    
    init(wrappedValue: String) {
        self.wrappedValue = wrappedValue.replacingOccurrences(of: " ", with: "_").lowercased()
    }
}
```

This can be an advantage, for example, when you need to make it mandatory to create the object with an initial value, as you will have to provide one.

```swift
struct Table {
    @SnakeCase var name: String
}

var table = Table(name: "hello World")
print(table.name) // Prints "hello_world"
```

### Projected Value of a Property Wrapper

In addition to the wrapped value that a property wrapper returns, as seen in the previous examples, it also allows for a *projected value*.

This projected value could be used, following the previous examples, to determine if the value has been formatted.

```swift
@propertyWrapper
struct Capitalized {
    private var text: String
    private(set) var projectedValue = false
    var wrappedValue: String {
        get {
            text
        }
        set {
            text = newValue.capitalized
        }
    }
    
    init(wrappedValue: String) {
        self.text = wrappedValue.capitalized
        projectedValue = true
    }
}
```

With this, you could do the following:

```swift
struct CustomText {
    @Capitalized var title: String
}

let text = CustomText(title: "One more thing...")
print(text.title) // Prints "One More Thing..."
print(text.$title) // Prints "true"
```

## Conclusion

As you can see, using property wrappers brings the main advantage of reusing code across parameters of different types that need to perform the same operations.

The most important points:

- You need to use the `@propertyWrapper` directive, and it must have at least one property called `wrappedValue`.
- You can use a `projectedValue` property if you want to expose additional functionality.
- If you need an additional property to perform operations, declare it as private so that it can only be modified from within the property wrapper.

## Sources

[Property Wrappers - Swift Documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/#Property-Wrappers)

[Property Wrappers in Swift - Swift by Sundell](https://www.swiftbysundell.com/articles/property-wrappers-in-swift/)