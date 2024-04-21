+++
title = "Ensure compatibility of apps for the Apple ecosystem"
description = "Swift makes it easy to create apps for multiple devices, but we must ensure compatibility"
summary = "Swift makes it easy to create apps for multiple devices, but we must ensure compatibility"
date = 2024-04-25
translationKey = "compatibilidad-ecosistema-apple"
+++

One of the main advantages of developing apps natively for Apple is that with the same language (Swift) and the same UI framework (SwiftUI) you can create apps for all its devices.

However, there are subtle differences between these devices. And in turn, between different versions of these.

Therefore, you can take a step further in the development of your products if you take into account some factors, achieving a better experience for your users.

Therefore, today I want to present these details to you.

## Responsive design

Thanks to SwiftUI, it is not necessary to make adjustments to the constraints as was the case with UIKit, which allowed defining the distances between elements and with respect to the edge of the screen. So in that sense, you should not worry.

But, what you should keep in mind is that using the dynamic sizes and the fonts provided by Apple allow you to ensure compatibility with regards to the interface. In addition, the development part is simplified and streamlined.

You can find more info in the official SwiftUI documentation: [Applying to strong dynamic sizing support](https://developer.apple.com/documentation/swiftui/applying-custom-fonts-to-text#Apply-a -font-supporting-dynamic-sizing)

In addition, thanks to the SwiftUI preview, you can check how the views will look on multiple devices simultaneously.

## Create a cross-platform app

Xcode allows the creation of cross-platform apps, in this way, there will be no different targets for iOS and macOS.

![Screenshot of multiplatform project](multiplatform-app.png)

## Create a dynamic layout

There are [layout modifiers](https://developer.apple.com/documentation/swiftui/view-layout) in SwiftUI that allow you to adjust how the view will be displayed, based for example on the value of a variable (bound by example to the subviews that exist)

## Use a minimum recent system version

Apple cares about this compatibility, since it is a huge benefit for its users to have an advantage in having their devices. It is very convenient to take a photo with the iPhone, view it on the iPad, and then edit it with the Macbook Pro.

And this is something that is increasingly taken into account, which is why the most recent versions will facilitate integration and compatibility so that an app can be used on all these devices.

## Don't forget about dark mode

Another important detail that you can see in the SwiftUI preview is that with a simple click you can check how your app looks in light or dark mode.

This is a feature that is increasingly used by users, not only by choosing the mode that visually most attracts them. Many times it is configured automatically. In this way, during the day we will see the light mode, and at night the dark mode.

For this reason, it is also very important to use the colors and modifiers provided by SwiftUI as much as possible, so that they have their different color versions.

## Try different screen layouts

Sometimes, users prefer to use the device in portrait mode, or in landscape mode.

Yes, again, thanks to SwiftUI and not having to depend on constraints, it has made developments easier for us. But it is important to check (also in the preview) how the views will be displayed in the different screen orientations.

![Screenshot SwiftUI preview](swiftui-preview.png)

## Consider iPad views

SwiftUI has the [NavigationSplitViewStyle](https://developer.apple.com/documentation/SwiftUI/NavigationSplitViewStyle) protocol to be able to display views divided into panels.

The clearest example is in the Mail app, where they are shown, from left to right:

- The different mailboxes
- The content of the mailbox
- The selected message from that mailbox.

This is useful for collections, which in turn have nested information
![Screenshot NavigationSplitView](navigation-split-view.png)

But remember to check the result in the preview of each device.

## Take advantage of the unique capabilities of each device

While developing an app that works across multiple devices is crucial, it's also essential to take advantage of each device's unique capabilities.

For example, the Apple Watch offers unique health functionalities, while the Apple TV can focus on multimedia capabilities.

Make sure you design your app not only to be compatible, but also to take full advantage of the specific features of each device.

## Device status management

Managing device state is critical when designing for multiple platforms.

This includes handling changes such as screen rotation, interruptions such as incoming calls or alerts, and system settings such as changes to accessibility settings.

Listens to system events and responds appropriately to ensure create a seamless and consistent experience across all devices.

## Conclusion

As you have been able to check all the aspects to take into account, they can be summarized in two:

- Use the elements provided by Apple natively
- Preview results on different target devices.

This will allow you to take advantage of one of the Cupertino company's strengths: the user experience of its ecosystem.
