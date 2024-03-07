+++
title = "Function Argument Labels and Parameter Names"
description = "Discover the basics about input parameters in functions"
date = 2023-06-26
translationKey = "parametros"
+++

Understanding the intricacies of function argument labels and parameter names is essential to harness the full power of the Swift programming language. In this article, we will explore these concepts with a focus on simplicity, catering to developers with limited experience in function creation. So, let's dive in!

## Function Argument Labels
Argument labels provide a descriptive context when calling a function, making the code more expressive and readable. In Swift, argument labels are specified before the parameter names and are separated by a space. Let's consider an example where we calculate the score of a video game level:
```
func calculateScore(forLevel level: Int) -> Int {
    // Function body goes here
}
```
Here, `forLevel` is the argument label, and `level` is the parameter name. When calling this function, we use the argument label to provide clarity:
```
let finalScore = calculateScore(forLevel: 5)
```
By using argument labels, we can convey the purpose of each parameter, enhancing the understanding of our code.

Also, you can omit an argument label. You simply must write an underscore instead an argument label: 
```
func addStamina(_ stamina: Int) -> Int {
	// Function body goes here
}
```
And you will only need to pass the value when you call the function.
```
let totalStamina = addStamina(100)
```

## Default Parameter Values
In Swift, we have the flexibility to assign default values to function parameters. This means that when calling a function, we can choose to omit specific arguments, and the default values will be used instead. Continuing with our video game theme, let's modify our previous function to include a default value for the `bonusPoints` parameter:
```
func calculateScore(level: Int, bonusPoints: Int = 500) -> Int {
    return level * bonusPoints
}
```
Now, we can call the function and use the two parameters but, if we call the function without providing a value for `bonusPoints`, it will automatically default to 500:

```
let totalScore = calculateScore(level: 2, bonusPoints: 100) // totalScore is equal to 200
let finalScore = calculateScore(level: 5) // finalScore is equal to 2500
```

## Variadic Parameters
Sometimes, we may encounter situations where the number of function arguments is not fixed. To handle such scenarios, Swift allows us to use variadic parameters. These parameters can accept zero or more values of a specified type. To demonstrate, imagine a function that calculates the total score of multiple video games:
```
func calculateTotalScore(scores: Int...) -> Int {
    // Function body goes here
}
```
Here, `scores` is a variadic parameter. We can pass any number of arguments separated by commas when calling the function:
```
let totalScore = calculateTotalScore(scores: 100, 250, 500, 750)
```
## In-Out Parameters
Lastly, Swift provides the `in-out` parameter modifier, which allows a function to modify the value of a variable from outside its own scope. In-out parameters are prefixed with the "inout" keyword. Consider a scenario where we need to update the health points of a game character:
```
func updateHealthPoints(_ hp: inout Int) {
    // Function body goes here
}
```
To pass a variable as an `in-out` parameter, we prepend an ampersand before the variable name:
```
var characterHP = 100
updateHealthPoints(&characterHP)
```
## Conclusion
In this article, we've covered the fundamentals of function argument labels and parameter names in Swift. We explored the usage of argument labels, default parameter values, variadic parameters, and in-out parameters. By mastering these concepts, you'll be equipped to write clean, expressive, and flexible code in your iOS projects. Keep practicing and incorporating these techniques into your development journey, and soon could be creating remarkable retro video games that leave players nostalgic for the golden age of gaming. 

Happy coding! 👨🏻‍💻
