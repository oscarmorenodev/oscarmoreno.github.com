+++
title = "Guía de seguridad aplicada en dispositivos Apple"
description = "Apple combina numerosos elementos para fomentar y mantener la seguridad en sus dispositivos y apps"
summary = "Apple combina numerosos elementos para fomentar y mantener la seguridad en sus dispositivos y apps"
date = 2024-04-25T08:00:00+02:00
translationKey = "seguridadApple"
+++

Los dispositivos Apple destacan por varios motivos: un diseño que los identifica y muchos quieren copiar, durabilidad y fiabilidad, pero sobretodo, un ecosistema que funciona como un todo a la hora de proveer servicios.

Esto, aunque tiene sus desventajas, la primera ventaja que suele venir a la cabeza es la facilidad para la coordinación de todos esos componentes.

Y si hay una materia donde la coordinación entre los distintos componentes es clave, es en la **seguridad**.

En este artículo no quiero limitarme a mencionar notificias de mayor o menor actualidad donde "se dice" que es un sistema seguro. Sino que quiero enumerar, basándome en la documentación oficial de la marca, de las medidas que utilicen para que tus datos y los míos estén seguros.

Los de Cupertino dividen sus medidas de seguridad en varias áreas, tanto físicas como lógicas, que abarcan la totalidad de los actores que intervienen en este asunto.

## Hardware y biometría

La base de la seguridad de un dispositivo es su **hardware**. Poniendo un ejemplo extremo, imagina un dispositivo que no tuviera posibilidad de acceder a internet por no contar con modem o tarjeta de red, o que no permita la entrada de volúmenes de datos: tarjetas de memoria, USBs, SSDs...

En este caso, estos dispositivos limitarían la posibilidad de inyección de código malicioso, o la extracción de datos del usuario. Lo que podría suponer un menor riesgo de seguridad.

Por eso, la seguridad de los dispositivos de Apple empieza en su hardware, y más concretamente en las funciones que tienen sus procesadores.

Durante los últimos años, Apple ha invertido grandes esfuerzos en el diseño de sus propios chip, y perfeccionando los sistemas alojados en éstos, llamados *System on Chip* ó *SoC*

Un ejemplo de ello es **Secure Enclave**, un subsistema de seguridad que se encuentra en las versiones más recientes de los dispositivos de Apple.

Secure Enclave se encuentra a parte del procesador principal, para mantener los datos de seguros, en caso que la seguridad de dicho procesador fuera vulnerada.

Además, se ha diseñado de la misma forma que el SoC, contando con:

- Una ROM de arranque que establece la raiz de confianza de hardware
- Un motor AES para criptografía
- Memoria protegida

Para la identificación de usuarios, Apple hace uso de la biometría.

El método más conocido es **FaceID**, el sistema mediante el cual, a través de la mirada, se pueden realizar operaciones como: desbloqueo del dispositivo y confirmación de pagos y compras.

FaceID utiliza redes neuronales para validar la coincidencia y aprender sobre los cambios que hayan en la apariencia del individuo.

Y todo esto, lo consigue a través de la cámara *TrueDepth*, que destaca por poder hacer escaneos en 3D de nuestro rostro, lo que evita, por ejemplo, que una simple imagen nuestra, pueda servir para suplantar nuestra identidad.

Por otro lado, los dispositivos más antiguos, así como los teclados Magic Keyboard, cuentan con **TouchID**, que se utiliza para los mismos casos que los anteriormente nombrados, pero a través de nuestras digitales.

Pero no solo se limita a usar la huella grabada en su primera configuración, ya que el sensor detectará los nuevos nodos que existan con cada uso.

Además, es importante que sepas que Apple facilita APIs que permiten a las aplicaciones hacer uso de estos elementos biométricos para **desarrollar apps seguras**.

## Sistema operativo

Los sistemas operativos cuentan con diversos servicios y recursos, a los aplicaciones, usuarios y demás acceden para gestionar la información.

La seguridad del sistema, por lo tanto, es la encargada de gestionar estos accesos, únicamente a quien deba hacerlo.

Un elemento muy importante en este apartado sería un **arranque seguro**, lo suficiente como para evitar que cualquier código no deseado, se inserte en él, y por lo tanto, consiga un alto privilegio pudiendo acceder a cualquier parte del sistema.

Esto se consigue asegurando que cada paso es seguro, y no se pasa el control al siguiente hasta su completa validación.

Una vez con el sistema funcionando, otro factor que determina la seguridad son las **actualizaciones**. En este caso, la misión del sistema será asegurar que no es posible instalar versiones anteriores y en consecuencia, posiblemente vulnerables.

Por otro lado, los volúmenes (dispositivos de almacenamiento de datos), como medios de entrada y salida, también pueden ser vulnerados y utilizados para comprometer la seguridad.

Para evitarlo, Apple en este caso, desde macOS 11, usa añade medidas de encriptación para proteger el código del sistema, de forma que éste no pueda ser modificado.

## Encriptación y protección de datos

Los iPhone y iPad usan un tipo de encriptación llamada
*Protección de datos*, mientras que los datos de los equipos Mac basados en Intel
se estaban asegurados con un método de encriptación del volumen que llamaron *FileVault*.

Así, en los dispositivos móviles (iPhone y iPad), de un uso por espacios de tiempo más breve, se hace uso de **códigos**, que son más ágiles de introducir. Se pueden usar de cuatro dígitos, de seis, o de longitud indeterminada.

Sin embargo, para el acceso en ordenadores, en los que solemos pasar varias horas frente a ellos, se utilizan **contraseñas**

Obviamente, a mayor longitud del código o de la contraseña, más difícil será que puedan averiguarlos. Esto es debido a que, además de necesitar más intentos de fuerza bruta, cuanto más complejo sea, más segura será la clave de encriptación.

Como te contaba antes, esto combinado con el uso de FaceID y TouchID, mejora la experiencia de usuario, sin reducir la seguridad de tus datos.

Como capa adicional, Apple aplica un tiempo de demora en el caso de fallar.

Por ejemplo, en dispositivos iOS y iPadOS son los siguientes:

| Intentos | Demora     |
|----------|------------|
| 1-4      | Ninguna    |
| 5        | 1 minuto   |
| 6        | 5 minutos  |
| 7-8      | 15 minutos |
| 9        | 1 hora     |

Además, si después de 10 intentos, la opción de "Borrar datos" está activada, el contenido y los ajustes se eliminan del almacenamiento

Y en el caso de macOS, los tiempos de demora coinciden, pero en el caso de superar los 10 intentos, éste se desactivará.

Por último, Apple también protege los datos, haciendo uso de una técnica que llama **almacén seguro de datos**, que evita que las distintas aplicaciones puedan acceder a nuestros datos de usuario como Calendario, Cámara, Contactos, Recordatorios, Notas...

## Seguridad de las apps

Las apps suponen un grave riesgo para la seguridad de tus datos, en cuanto a que es la principal via de entrada de código a los mismos.

Sin embargo, resulta posible prescindir de ellas, ya que también son la primera fuente de funcionalidad para el hardware.

Una primera capa ya te he mencionado anteriormente, con el almacén seguro de datos.

En este caso, se puede diferenciar entre apps del App Store y descargadas de otras fuentes, algo que, hasta hace bien poco, era exclusivo de macOS.

En el caso de macOS, a partir de la versión 10.15, todas las descargas fuera del App Store, deben estar certificadas por Apple, para evitar el mensaje de seguridad y el bloqueo.

Por otro lado, el mismo sistema de macOS, cuenta con un sistema propio de protección antivirus para evitar la ejecución de código malicioso.

En el caso de apps para iOS y iPadOS, todas deben estar firmadas mediante el mecanismo implementado por Apple para subir dichas apps al App Store. Esto se realiza a través de la [validación de un certificado](https://developer.apple.com/support/certificates/) que facilita el *Apple Developer Program*

Estas validaciones, no solo se realizan por desarrolladores o empresas que distribuyen apps a usuarios finales. Sino que es un proceso por el que también se debe pasar por las organizaciones que desarrollen apps internas para sus empleados.

Pero, todo esto se refiere únicamente a la instalación.

Apple mejora aún más la seguridad, añadiendo una capa adicional al entorno de ejecución de las apps, mediante tres elementos.

El primero es el *aislamiento*, y es que, todas las apps de terceros, se ejecutan en un entorno aislado, para evitar que puedan acceder a archivos almacenados por otras apps, o que modifiquen el contenido del sistema.

Por lo que para acceder a información ajena, debe pasar sí o sí por los métodos que establece Apple en el sistema.

El segundo son las **autorizaciones** que, mediante pares de clave-valor, permiten la autenticación fuera del entorno de ejecución, como por ejemplo, un ID de usuario en UNIX. Dichas autorizaciones se aseguran mediante firma digital, por lo que no es posible modificarlas.

Y el tercer y último elemento, es la **aleatorización del espacio de direcciones**, lo que ayuda a proteger el sistema frente a ataques que hacen uso de fallos por memoria corrupta.

## Servicios

El primer componente que nos da acceso a los servicios que facilita Apple en sus dispositivos es el Apple ID. Éste, cuenta con una serie de requisitos habituales para evitar que un tercero consiga acceso a éste. Dichos requisitos, a la hora de crear su contraseña son:

- Al menos ocho caracteres
- Combinación de números y letras
- No deben tener más de tres caracteres idénticos o consecutivos
- No debe ser de uso común.

Además, por defecto, Apple cuenta con la **autenticación de doble factor**, lo que evita accesos no deseados en caso que alguien consiga tu contraseña.

Por otro lado, en caso de querer restablecer la contraseña, debe hacerse desde otro dispositivo de confianza.

iCloud es probablemente el servicio más usado de la compañía, que permite el almacenamiento de datos de las categorías fotos, contactos, email, salud... por lo que todo esfuerzo es poco para mantener a Apple como un actor comprometido con la seguridad.

En este caso, Apple ofrece dos opciones para encriptar su contenido:

- **Protección estándar:** Los datos del usuario se encriptan y sus claves se almacenan en los centros de datos de Apple, quien solo puede ayudar a recuperar datos, pero no dispone de ellos. 14 categorías de datos usarán la encriptación de punto a punto.
- **Protección avanzada:** Solo se puede acceder a las claves de encriptación desde un dispositivo de confianza, que es donde se protegen por encriptación punto a punto. Siendo en este caso, 23 las categorías que harán uso de ella.

Otro elemento, cada vez más usado, y sin duda al que hay que prestar especial atención es a *Apple Pay*, el cual permite realizar pagos.

Y aquí Apple protege los pagos mediante: *Secure Element* y el *Controlador NFC*.

El primero incluye applets (componentes que se ejecutan en el contexto de otro programa) certificados por entidades emisoras de tarjetas o redes de pagos. De esta forma, son éstas las únicas que conocen las claves de encriptación para acceder a los datos de los applets.

En el segundo caso, el controlador actua como puerta de enlace, permitiendo al primero poder realizar el pago en un terminal de punto de venta sin contacto. Éste, permite la conexión, una vez el usuario ha autorizado el pago mediante biometría o código.

## Seguridad en la red

En cuanto a la parte red, y aún siendo el elemento principal de la comunicación entre dispositivos, me limitaré a dar los datos técnicos sin entrar en detalle.

Así, iOS, iPadOS y macOS con compatibles con las versiones de TLS:

- TLS 1.0
- TLS 1.1
- TLS 1.2
- TLS 1.3
- Datagram Transport Layer Security (DTLS)

Siendo TLS compatible con AES128 y AES256.

En cuanto a las redes privadas virtuales (VPNs), los protocolos compatibles son:

- IKEv2/IPsec con autenticación por secreto compartido, certificados RSA certificados de algoritmo de firma digital de curva elíptica (ECDSA), EAP‑MSCHAPv2 o EAP-TLS.
- VPN SSL con la app cliente adecuada de App Store.
- L2TP/IPsec con autenticación de usuario mediante contraseña de MS-CHAPV2 y
autenticación de máquina mediante secreto compartido (iOS, iPadOS y macOS), y RSA
SecurID o CRYPTOCard (solo macOS).
- Cisco IPsec con autenticación de usuario mediante contraseña, RSA SecurID o
CRYPTOCard, y autenticación de máquina mediante secreto compartido y certificados
(solo macOS).

## Kit de desarrollo

Por último, Apple te facilita una serie de kits para desarrollas apps que amplíen los servicios de éstos.

Estos kits son: HomeKit, CloudKit, SiriKit, DriverKit, ReplayKit y ARKit.

En este caso, quizá el servicio donde más en juego entra la privacidad, es el caso de HomeKit, encargado de gestionar dispositivos del hogar, tan sensibles como cámaras de videovigilancia, o de grabación de audio como HomePods.

Para asegurar estos dispositivos, HomeKit se basa en pares de claves *Ed25519* constituidos por una clave pública y una privada.

Dichas claves, se almacenarán en el *Llavero de iCloud*, para poder actualizarse entre dispositivos.

## Conclusión

Los elementos que influyen en la seguridad de los dispositivos Apple, son muchos y de distinta índole. Pero, tanto como si eres programador, manager o usuario, conocerlos es de gran importancia, principalmente para ser conscientes de los riesgos a los que estamos expuestos.

Y si además, tu trabajo está influido por dicha seguridad, puedes aportar un gran valor a los usuarios de tus apps.
