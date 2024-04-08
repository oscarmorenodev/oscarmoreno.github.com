+++
title = "Mastering basics: Structures vs. Clases"
description = "Both options allow you to encapsulate and reuse values and behaviors, but knowing their differences helps optimize your code"
summary = "Both options allow you to encapsulate and reuse values and behaviors, but knowing their differences helps optimize your code"
date = 2024-03-28T08:00:00+01:00
translationKey = "estructurasYClases"
+++
In the world of software development with Swift, one of the fundamental choices we face is the decision between structures and classes. Both are essential constructs that allow us to model our data efficiently, but their differences are crucial for writing efficient and understandable code.

**Structures** and **classes** in Swift share several similarities. Both can define properties to store values, methods to add functionality, subscripts to access values with specific syntax, and can be extended to increase their functionality. However, it's in their differences where we find the keys to deciding when to use each.

### When to Use Structures?

Structures are value types. This means they are copied when assigned to a new variable or passed to a function. They are the preferred choice for representing simple and autonomous data that doesn't need to inherit properties from elsewhere. For example, to model the specifications of a video game, you might use a structure:

```swift
struct VideoGame {
    var name: String
    var genre: String
    var platform: String
}

let halo = VideoGame(name: "Halo Infinite", genre: "FPS", platform: "Xbox")
```

This model is useful when copied values are what you need, such as passing video game data from one part of your app to another without worrying about unwanted side effects.

### When to Use Classes?

Classes are reference types. Unlike structures, if you assign an instance of a class to a new variable or pass it to a function, what is passed is a reference to the same instance. This is useful when you need to have a single object that is updated and accessed from multiple places. For example, you might want to have an object that represents a user session:

```swift
class UserSession {
    var user: String
    var status: String

    init(user: String, status: String) {
        self.user = user
        self.status = status
    }
}

let session = UserSession(user: "JuanGamer42", status: "Active")
```

Using a class here allows any changes to the `session` to be reflected throughout the entire app, which would be crucial for managing states such as logging in or out.

### Key Differences

- **Inheritance**: Only classes can inherit from another class. This makes them powerful for polymorphic use cases.
- **Reference type vs. Value type**: This is probably the biggest differentiator. It affects how information is passed in your app and can have significant implications for performance and memory use.
- **Reference counting**: Only classes support reference counting, allowing more than one reference to point to the same class instance. This is useful for managing the lifecycle of objects, especially in multi-threaded environments.

### Recommendations

- **Prefer structures by default**: They are faster and safer in a concurrency context because they work with copies of the data they contain.
- **Use classes when you need inheritance or unique identity management**: For example, to control a single instance of a network service or a user session shared across your app.

### Conclusion

The choice between structures and classes depends on the nature of your data and how you plan to use it in your application. While structures offer a safe and efficient way to work with copied data, classes provide powerful tools for managing shared states and inheritance. By consciously choosing between these two constructs, you can write clearer, more efficient, and more appropriate code to your needs.