+++
title = "Numbers in Swift"
description = "Programming has been often for process numbers and obtain results so difficult to calculate for humans"
summary = "Programming has been often for process numbers and obtain results so difficult to calculate for humans"
date = 2023-01-30
translationKey = "numeros"
aliases = "/blog/numbers-in-swift/"
+++

Programming has been often for process numbers and obtain results so difficult to calculate for humans: universe distances, planet radius, pi…

So, is part of fundamental learning, in Swift in particular and in programming globally.

There are basically 2 types of numbers in Swift: Integers and Floating-Point numbers. Each one represents a different range and is used for different targets.

## Integers

A integer number (also called int, for short) is possibly the most used number. We could say that it is the most simple, because has no fractional component. 

It can be positive, zero, or negative. For example, integer numbers are: 5, -3, 99, -256…

Also, Swift provides signed and unsigned integers for 8,16, 32 and 64 bit. Following naming convention of C, the type of 8 bit unsigned number is UInt8, whereas 16 bit signed is Int16. But, is not frequently used in most of developed apps.

### Integers range 
It depends of bits number, but each one has a max and min number to store. You can check it in next list.

- **UInt8**: from 0 to 255
- **UInt16**: from 0 to 65535
- **UInt32**: from 0 to 4294967295
- **UInt64**: from 0 to 18446744073709551615
- **Int8**: from -128 to 127
- **Int16**: from -32768 to 32767
- **Int32**: from -2147483648 to 2147483647
- **Int64**: from -9223372036854775808 to 9223372036854775807

<br/>
But, if you don’t remember the values, you can use the methods .max or .min

```swift
let minValue = Int.min //minValue is equal to
let maxValue = Int.max //maxValue is equal to
```swift

## Floating-Point numbers
Unlike integers, floating-point numbers has a fractional component. But, like integers, can be positive or negative.  
It exists two signed floating-point number types
### Double
Double numbers represent a 64-bit floating-point number, and has a precision of at least 15 decimal digits.
### Float
Float numbers represent a 32-bit floating-point number, and has a precision of at least 6 decimal digits.

***
<br/>
*NOTE: You will need Double or Float depending of multiple factors, but if either would be appropriated, Swift documentation recommends use Double.*

Happy coding! 👨🏻‍💻
