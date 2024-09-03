+++
title = "What the different access levels mean in Swift"
description = "Access levels define where your code can be accessed"
summary = "Access levels define where your code can be accessed"
date = 2024-09-03T08:00:00+02:00
translationKey = "nivelesAcceso"
+++

In (many) cases, you will spend more time reading code than writing it, which is why it's crucial to understand what you're reading.

Moreover, it’s a great way to learn more about programming concepts.

Do you know the difference between `open` and `public`? Why is `fileprivate` not the same as `private`?

Knowing this will prevent you from wasting time on errors that might otherwise be difficult to explain, and it will help you structure your application better.

**Access control** allows you to manage access to certain parts of your code from other parts of the same code. This lets you hide the implementation details of types, properties, functions, and more (which we’ll refer to as entities).

It’s not always necessary to use them since Swift provides a default access level for basic scenarios.

## Source files, modules, and packages

Before continuing, it’s important to understand the following elements to know where access is allowed.

### Source file

A **source file** is a file with a .swift extension that resides within a module.

Keep in mind that normally, each type (class, structure, or enumeration) is defined in a source file, but sometimes several related ones can be in the same file.

### Module

A **module** is a unit of code distribution.

It can be a framework or an application, which will form a unit.

Modules can be imported from other modules using the keyword `import`.

### Package

A **package** is a group of modules that form a unit.

When creating a package, you must specify the modules it will contain.

![Source module package relationship](sourcemodulepackage.png)

## Access levels in Swift

Now you can see the different levels ordered from least to most restrictive.

### open

When an entity is defined with `open`, you can access it from any source file within the same module.

Additionally, it can also be accessed from source files in other modules that import the module containing that entity.

On the other hand, it allows access from subclasses or overriding from outside the module.

You should use it when creating a public interface for a framework.

### public

Using `public` is almost the same as `open`.

The difference is that in the case of `public`, you cannot access it from subclasses or override methods.

### package

This access level is available from Swift 5.9.

As you might have guessed, it allows access from any source file within the same [package](#package).

### internal

Using `internal` allows access from any source file in the same module, but not from different modules.

It’s commonly used when defining the structure of a simple app or framework.

You’ll rarely see it explicitly, as it’s the default access level. That is, if you don’t see any access control before the entity's keyword (`struct`, `class`, `let`, `var`, etc.), it’s because it’s using `internal`.

### fileprivate

In this case, with `fileprivate`, entities can only be accessed from the same source file that contains them.

This means, for example, if you have different classes and structures in a .swift file, the one marked with `fileprivate` can be accessed by the other classes and structures within that same file.

### private

Finally, `private` only allows access to its content from its declaration.

That is, if a class is marked with this access control, its entities can only be accessed from within that class.

## How to use access levels in Swift

To use the different levels, you simply need to indicate it before the entity’s keyword.

See the following examples:

```swift
open class MyClass {}

public struct MyStruct {}

internal let myConstant = "Hello World!"

fileprivate var myVar = "Hello again!"

private func myMethod() {}
```

## Principle of access levels

The different access levels follow a general principle:

> You cannot define any entity inside another entity that has a lower (more restrictive) access level.

That is, you cannot define a public variable inside a private class; nor can you define an open variable in an internal method.

## Default access level

The default access level is `internal`, so if you don’t specify anything before the entity, this is the level that will be applied.

## Conclusion

You’ve seen the different access levels: `open`, `public`, `internal`, `fileprivate`, and `private`, and the restrictions each one entails.

It’s important to use the appropriate level to maintain *clean, organized, and efficient code*, allowing access only to those who need it.

Remember that if you don’t specify anything, Swift will consider the entity as `internal`.

## Sources

[Access Control - Swift Documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)