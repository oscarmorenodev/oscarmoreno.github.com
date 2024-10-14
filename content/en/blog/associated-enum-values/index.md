+++
title = "Enhance Your Enums with Associated Values"
description = "Learn how to manage multiple data types within a single enumeration"
summary = "Learn how to manage multiple data types within a single enumeration"
date = 2024-10-15T08:00:00+02:00
translationKey = "enum-associated-values"
+++

One of my favorite features in Swift is **enums**.

They are easy to understand and use.

But sometimes, we don't make the most of them.

And that can be achieved (among other ways) through associated values.

Associated values allow you to attach values of different types to the different cases of an enumeration.

If you need it, I also wrote an article on [enumerations](../swift-enums/).

So today, I will show you how to make the most of them and in what situations they are advantageous.

## How to Define Associated Values in Your Enumerations

You just need to include, after each case, the type of value you want to associate.

You can define as many values as you want.

Although, as in other cases, it's not recommended to have too many values.

In this way, you will improve readability and reduce complexity.

Moreover, optionally, you can also specify the parameter name.

```swift
struct User {
    let name: String
}

enum Resolution {
    case completed
    case dropped
}

enum State {
    case toDo(estimatedDate: Date)
    case inProgress(assignee: User)
    case done(time: Int)
    case close(Resolution)
}
```

As you can see, each case of the `State` enum has an associated value.

All of them have a parameter name except for the closing case.

## Assigning Associated Values to an Enumeration Case

Once the `enum` is defined, when you choose a case, you must assign a value of the specified type.

```swift
let state = State.toDo(estimatedDate: Date.now.addingTimeInterval(86400))
let state2 = State.inProgress(assignee: .init(name: "John"))
let state3 = State.done(time: 10)
let state4 = State.close(.completed)
```

Additionally, this also occurs when using a `switch` to handle different situations.

But, in this way, the parameter assigned in each case of the `switch` doesn't need to have the same name as in the definition.

Nor are you required to reference the parameter if you don't need it for handling.

You can see this better in the following example.

```swift
func manageTask(_ task: State) {
    switch task {
    case .toDo:
        print("Task is not started yet.")
    case .inProgress(let assignee):
        print("\(assignee) is working on it")
    case .done(var duration):
        duration /= 60
        print("Task was completed in \(duration) hours")
    case .close(let finalState):
        print("Task is finished. It was \(finalState)")
    }
}

manageTask(.toDo(estimatedDate: Date.now.addingTimeInterval(172_800)))

let user = User(name: "Erlich Bachman")
manageTask(.inProgress(assignee: user))

manageTask(.done(minutes: 90.0))
```

As you can see, in the `toDo` case, the estimated start date is not used, so you don't need to retrieve that value.

While in the `done` and `close` cases, the parameter name in the definition does not match the name in the `switch`.

## Advantages of Using Associated Types for Enums

### Improved Readability

I know I say this often, but we spend more time reading code than writing it.

So it's better for that activity to be as simple as possible.

Thanks to associated values, you don't need to create external structures to associate with the cases.

Moreover, the code hierarchy remains simpler without those classes.

### Greater Stability

Strong typing is one of the greatest advantages of Swift.

And it is reinforced by this feature.

You must define the type of each associated value.

You can only assign a value of that type, allowing you to avoid errors due to incorrect typing.

Additionally, if you're using a `switch` to handle actions based on the case, you're required to address all cases.

And Xcode itself helps you add the associated values if needed.

## Examples of Using Associated Values

### Error Handling

It is common that, to complement the information of an error, you need additional data.

This information could be the message to display or something you need to solve the error.

```swift
enum ArcadeMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case userUnknown(user: String)
}

func displayError(_ error: ArcadeMachineError) {
    switch error {
    case .invalidSelection:
        print("Invalid selection")
    case .insufficientFunds(let coinsNeeded):
        print("Insufficient funds. You need \(coinsNeeded) coins")
    case .userUnknown(let user):
        print("User \(user) is unknown")
    }
}

displayError(.userUnknown(user: "pacman"))
```

### Defining View Actions

Actions executed as a result of user interaction often require related values:

```swift
enum UserAction {
    case login(username: String, password: String)
    case logout
    case updateProfile(name: String, age: Int)
}

func performAction(_ action: UserAction) {
    switch action {
    case .login(let username, let password):
        print("Logging in with \(username) and \(password)")
    case .logout:
        print("Logging out")
    case .updateProfile(let name, let age):
        print("Updating profile with name: \(name), age: \(age)")
    }
}

performAction(.updateProfile(name: "grogu", age: 50))
```

### Modeling Complex Data

For example, when dealing with multimedia elements.

These often come with different types of associated data.

With an enumeration and associated values, it's as easy to define as it is to handle.

```swift
enum MediaType {
    case image(url: String, resolution: (width: Int, height: Int))
    case video(url: String, duration: TimeInterval)
    case audio(url: String, bitrate: Int)
}

func handleMedia(_ media: MediaType) {
    switch media {
    case .image(let url, let resolution):
        print("Image URL: \(url), Resolution: \(resolution.width)x\(resolution.height)")
    case .video(let url, let duration):
        print("Video URL: \(url), Duration: \(duration) seconds")
    case .audio(let url, let bitrate):
        print("Audio URL: \(url), Bitrate: \(bitrate) kbps")
    }
}

handleMedia(.video(url: "R.Astley-never_gonna_give_you_up.mp4",
                   duration: 213))
```

### Managing States

This is possibly the most widespread use of associated values in enums.

And it's because the states of an app often involve related data such as the user, the view being displayed, etc.

```swift
enum AppState {
    case onboarding(step: Int)
    case loggedIn(userID: String)
    case loggedOut
}

func handleAppState(_ state: AppState) {
    switch state {
    case .onboarding(let step):
        print("Onboarding step \(step)")
    case .loggedIn(let userID):
        print("User logged in with ID \(userID)")
    case .loggedOut:
        print("User logged out")
    }
}

handleAppState(.onboarding(step: 1))
```

### Advanced Filters

Associated values can also be very useful for filters.

When you use them, you need to define the value of those filters.

Thus, you can easily set them.

```swift
enum Filter {
    case priceRange(min: Double, max: Double)
    case category(name: String)
    case availability(isInStock: Bool)
}

func applyFilter(_ filter: Filter) {
    switch filter {
    case .priceRange(let min, let max):
        print("Filter by price range: \(min) - \(max)")
    case .category(let name):
        print("Filter by category: \(name)")
    case .availability(let isInStock):
        print("Filter by availability: \(isInStock ? "In stock" : "Out of stock")")
    }
}

applyFilter(.priceRange(min: 10.0, max: 20.0))
```

## Conclusions

You've seen how easy it is to associate values with different cases of an `enum`:

- You just need to define them after each case.
- Take advantage of Xcode autocomplete to add the values you need.
- They help you have more stable, readable, and safe code.

Examples where you can use them include:

- Error handling
- Defining view actions
- Modeling complex data
- State management
- Advanced filters

And if you want to practice, here is a playground with the examples:
{{% resources pattern=".*\.(zip)" color="blue" icon="fa-solid fa-file-arrow-down" /%}}

## Source

[Associated Enumeration Values - Official Swift Documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Associated-Values)
