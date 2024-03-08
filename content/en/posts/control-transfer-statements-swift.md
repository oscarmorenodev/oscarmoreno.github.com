+++
title = "Exploring Control Transfer Statements in Swift"
description = "Altering the flow of execution within the code"
date = 2023-04-17
translationKey = "traspaso-control"
+++

Control transfer statements are essential tools in programming that allow developers to alter the flow of execution within their code. 

In Swift, three commonly used control transfer statements are `continue`, `break`, and `fallthrough`. 

In this article, we will examine into each of these statements, providing examples and explaining the scenarios where they are most appropriate to use.

## Continue
The `continue` statement is primarily used within loop constructs (such as ‘for-in' or 'while') to skip the remaining code within the current iteration and proceed to the next iteration.It allows you to selectively skip over specific parts of a loop without terminating it entirely.
Here's an example to illustrate its usage:

```swift
for number in 1...10 {
    if number % 2 == 0 {
        continue
    }
    print(number)
}
```

Output
```swift
1
3
5
7
9
```

In this example, the `continue` statement is used to skip printing even numbers. When the condition `number % 2 == 0` is true, the `continue` statement is executed, bypassing the `print` statement and proceeding to the next iteration. 

## Break
The `break` statement is used to terminate the execution of a loop or switch statement prematurely. It allows you to exit out of a loop or `switch` block before reaching its natural end.

Consider the following example:

```swift
let cars = [“Red Bull", “Aston Martin", “Ferrari", "Mercedes", "McClaren"]

for name in names {
    if name == "Mercedes" {
        break
    }
    print(name)
}
```

Output
```swift
Red Bull
Aston Martin
Ferrari
```

In this case, the `break` statement is used to exit the loop once the condition `name == "Mercedes"` is true. As a result, the loop terminates prematurely, and the remaining elements in the `cars` array are not printed.

## Fallthrough
The `fallthrough` statement is exclusively used within switch statements. It allows the control flow to move to the next case without performing an implicit `break`.

This behavior differs from the default behavior of a switch statement, where control automatically exits the switch block after a case is matched.

Consider the following example:

```swift
let grade = "A"

switch grade {
    case "A":
        print("Excellent")
        fallthrough
    case "B":
        print(“You have approved")
    case "C":
        print("Average")
    default:
        print("Incomplete")
}
```

Output
```swift
Excellent
Good
```

In this example, when the grade is "A," the `fallthrough` statement is used to continue the execution to the next case without exiting the switch block. As a result, both "Excellent" and "You have approved" are printed.

## Conclusion
Understanding control transfer statements like `continue`, `break`, and `fallthrough` is crucial for effective Swift programming. 

`continue` allows you to skip specific iterations within loops, `break` enables premature termination of loops or switch statements, and `fallthrough` allows control to flow to the next case in a switch statement.
 
By leveraging these statements appropriately, you can enhance the flexibility and control of your code execution in iOS development.

Happy coding! 👨🏻‍💻
