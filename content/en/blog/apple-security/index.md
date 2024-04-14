+++
title = "Apple devices Security Guide"
description = "Apple combines numerous elements to promote and maintain security on its devices and applications"
summary = "Apple combines numerous elements to promote and maintain security on its devices and applications"
date = 2024-04-25T08:00:00+02:00
translationKey = "seguridadApple"
+++

Apple devices stand out for several reasons: a design that identifies them and many want to copy, durability and reliability, but above all, an ecosystem that works as a whole when providing services.

Although this has its disadvantages, the first advantage that usually comes to mind is the ease of coordinating all these components.

And if there is one area where coordination between the different components is key, it is in **security**.

In this article I do not want to limit myself to mentioning more or less current news where it is "said" that it is a secure system. Instead, I want to list, based on the brand's official documentation, the measures they use to ensure that your data and mine are safe.

Those from Cupertino divide their security measures into several areas, both physical and logical, that cover all the actors involved in this matter.

## Hardware and biometrics

The basis of a device's security is its **hardware**. Taking an extreme example, imagine a device that had no possibility of accessing the Internet because it did not have a modem or network card, or that did not allow the entry of volumes of data: memory cards, USBs, SSDs...

In this case, these devices would limit the possibility of malicious code injection, or the extraction of user data. Which could pose a lower security risk.

Therefore, the security of Apple devices begins with their hardware, and more specifically in the functions of their processors.

During recent years, Apple has invested great efforts in designing its own chips, and perfecting the systems housed in them, called *System on Chip* or *SoC*

An example of this is **Secure Enclave**, a security subsystem found in the most recent versions of Apple devices.

Secure Enclave is separate from the main processor to maintain secure data in case the security of said processor is breached.

In addition, it has been designed in the same way as the SoC, with:

- A boot ROM that establishes the hardware root of trust
- An AES engine for cryptography
- Protected memory

To identify users, Apple uses biometrics.

The best known method is **FaceID**, the system through which, through your eyes, you can perform operations such as: unlocking the device and confirming payments and purchases.

FaceID uses neural networks to validate the match and learn about changes in the individual's appearance.

And all this is achieved through the *TrueDepth* camera, which stands out for being able to make 3D scans of our face, which prevents, for example, a simple image of us from being used to impersonate our identity.

On the other hand, older devices, as well as Magic Keyboard keyboards, have **TouchID**, which is used for the same cases as those mentioned above, but through our digital ones.

But it is not only limited to using the fingerprint recorded in its first configuration, since the sensor will detect the new nodes that exist with each use.

Additionally, it is important that you know that Apple provides APIs that allow applications to use these biometric elements to **develop secure apps**.

## OS

Operating systems have various services and resources that applications, users and others access to manage information.

The security of the system, therefore, is responsible for managing these accesses, only to those who must do so.

A very important element in this section would be a **secure boot**, enough to prevent any unwanted code from being inserted into it, and therefore, achieve a high privilege being able to access any part of the system.

This is achieved by ensuring that each step is safe, and control is not passed to the next until it is completely validated.

Once the system is running, another factor that determines security is **updates**. In this case, the system's mission will be to ensure that it is not possible to install older and consequently possibly vulnerable versions.

On the other hand, volumes (data storage devices), as input and output media, can also be violated and used to compromise security.

To avoid this, Apple in this case, since macOS 11, uses added encryption measures to protect the system code, so that it cannot be modified.

## Data encryption and protection

iPhones and iPads use a type of encryption called
*Data Protection*, while data on Intel-based Macs
They were secured with a volume encryption method they called *FileVault*.

Thus, on mobile devices (iPhone and iPad), use for shorter periods of time. In short, **codes** are used, which are easier to enter. They can be used with four digits, six, or of indeterminate length.

However, for access on computers, where we usually spend several hours in front of them, **passwords** are used.

Obviously, the longer the code or password, the more difficult it will be for them to find out. This is because, in addition to requiring more brute force attempts, the more complex it is, the more secure the encryption key will be.

As I told you before, this combined with the use of FaceID and TouchID, improves the user experience, without reducing the security of your data.

As an additional layer, Apple applies a delay time in the event of failure.

For example, on iOS and iPadOS devices they are as follows:

| Attempts | Delay      |
|----------|------------|
| 1-4      | None       |
| 5        | 1 minute   |
| 6        | 5 minutes  |
| 7-8      | 15 minutes |
| 9        | 1 hour     |

Additionally, if after 10 attempts, "Wipe data" is enabled, the content and settings are deleted from storage

And in the case of macOS, the delay times coincide, but if there are more than 10 attempts, it will be deactivated.

Finally, Apple also protects data, using a technique called **secure data storage**, which prevents different applications from accessing our user data such as Calendar, Camera, Contacts, Reminders, Notes... .

## App security

Apps pose a serious risk to the security of your data, in that it is the main means of code entry into your data.

However, it is possible to do without them, since they are also the first source of functionality for the hardware.

I have already mentioned a first layer before, with the secure data store.

In this case, you can differentiate between apps from the App Store and those downloaded from other sources, something that, until recently, was exclusive to macOS.

In the case of macOS, starting with version 10.15, all downloads outside the App Store must be certified by Apple to avoid the security message and blocking.

On the other hand, the same macOS system has its own antivirus protection system to prevent the execution of malicious code.

In the case of apps for iOS and iPadOS, all must be signed using the mechanism implemented by Apple to upload said apps to the App Store. This is done through [certificate validation](https://developer.apple.com/support/certificates/) provided by the *Apple Developer Program*

These validations are not only carried out by developers or companies that distribute apps to end users. But it is a process that must also be gone through by organizations that develop internal apps for their employees.

But, all this refers only to the installation.

Apple further improves security by adding an additional layer to the app execution environment through three elements.

The first is *isolation*, and that is that all third-party apps run in an isolated environment, to prevent them from accessing files stored by other apps, or modifying the content of the system.

So to access other people's information, you must go through the methods that Apple establishes in the system.

The second are **authorizations** that, through key-value pairs, allow authentication outside the execution environment, such as a user ID in UNIX. These authorizations are secured by digital signature, so it is not possible to modify them.

And the third and last element is the **randomization of the address space**, which helps protect the system against attacks that make use of corrupted memory faults.

## Services

The first component that gives us access to the services that Apple provides on its devices is the Apple ID. This has a series of usual requirements to prevent a third party from gaining access to it. These requirements, when creating your password are:

- At least eight characters
- Combination of numbers and letters
- They must not have more than three identical or consecutive characters
- It should not be in common use.

Additionally, by default, Apple has **two-factor authentication**, which prevents unwanted access in case someone gets your password.

On the other hand, if you want to reset the password, it must be done from another trusted device.

iCloud is probably the company's most used service, which allows the storage of data in the categories photos, contacts, email, health... so every effort is little to keep Apple as an actor committed to security.

In this case, Apple offers two options to encrypt your content:

- **Standard Protection:** User data is encrypted and its keys are stored in the data centers of Apple, who can only help recover data, but does not have it. 14 categories of data will use end-to-end encryption.
- **Advanced Protection:** Encryption keys can only be accessed from a trusted device, which is where they are protected by end-to-end encryption. In this case, there are 23 categories that will make use of it.

Another element, increasingly used, and without a doubt to which we must pay special attention is *Apple Pay*, which allows payments to be made.

And here Apple protects payments through: *Secure Element* and the *NFC Controller*.

The first includes applets (components that run in the context of another program) certified by card issuers or payment networks. In this way, they are the only ones who know the encryption keys to access the data in the applets.

In the second case, the controller acts as a gateway, allowing the first to make the payment at a contactless point-of-sale terminal. This allows the connection, once the user has authorized the payment through biometrics or code.

## Network security

As for the network part, and even though it is the main element of communication between devices, I will limit myself to giving the technical data without going into detail.

Thus, iOS, iPadOS and macOS are compatible with TLS versions:

- TLS 1.0
- TLS 1.1
- TLS 1.2
- TLS 1.3
- Datagram Transport Layer Security (DTLS)

TLS being compatible with AES128 and AES256.

Regarding virtual private networks (VPNs), the compatible protocols are:

- IKEv2/IPsec with shared secret authentication, Elliptic Curve Digital Signature Algorithm (ECDSA) certified RSA certificates, EAP-MSCHAPv2, or EAP-TLS.
- SSL VPN with the appropriate client app from the App Store.
- L2TP/IPsec with MS-CHAPV2 password user authentication and
machine authentication using shared secret (iOS, iPadOS, and macOS), and RSA
SecurID or CRYPTOCard (macOS only).
- Cisco IPsec with user authentication via password, RSA SecurID or
CRYPTOCard, and machine authentication using shared secret and certificates
(macOS only).

## Development Kit

Finally, Apple provides you with a series of kits to develop apps that expand their services.

These kits are: HomeKit, CloudKit, SiriKit, DriverKit, ReplayKit and ARKit.

In this case, perhaps the service where privacy comes most into play is the case of HomeKit, in charge of managing home devices, as sensitive as video surveillance cameras, or audio recording devices like HomePods.

To secure these devices, HomeKit relies on *Ed25519* key pairs made up of a public key and a private key.

These keys will be stored in the *iCloud Keychain*, so they can be updated between devices.

## Conclusion

The elements that influence the security of Apple devices are many and of different kinds. But, whether you are a programmer, manager or user, knowing them is of great importance, mainly to be aware of the risks to which we are exposed.

And if your work is also influenced by this security, you can provide great value to the users of your apps.
