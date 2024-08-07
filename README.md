# Proyecto Final de Programación Backend comision 53105.

Mi nombre es Lucas Aspee , este es mi proyecto final .

El proyecto es una api de un ecommerce con el objetivo de simular el proceso completo de compra de un ecommerce real. Fue desarrollada utilizando express y mongodb para el back y handlebars para las vistas del front , a continuacion se explica mas en detalle todas las funcionalidades.


## Requerimientos


1- Para el correcto funcionamiento es necesario instalar las dependencias figuradas en el package.json
```
- npm i
```


## Modo de ejecucion local
En la consola escribir el siguiente comando :
```
- npm run dev
```

NOTA: La api se ejectura de manera de local en el puerto 8080 , la ruta base es http://localhost:8080/.


## Demo de la api junto al front en funcionamiento

```
https://top-ecommerce.up.railway.app/

```
## Detalle de vistas y funciones

## Login .
Para acceder al sitio deberemos ingresar un usuario y contraseña valida , estos datos se encuentran almacenados en la base de datos y son consultados atraves del servidor.Tambien existe la posibilidad e logearse mediante una cuenta de github.
En caso de se ingrese datos incorrectos se mostraran los mensajes correspondientes a cada error en patalla, como "contraseña invalida" o "usuario no existente".
[![Captura-de-pantalla-2024-08-07-100618.png](https://i.postimg.cc/k4NRY9sM/Captura-de-pantalla-2024-08-07-100618.png)](https://postimg.cc/623QTkFF)

## Register.
Sistema de registro , para nuevos usuarios
[![registro.png](https://i.postimg.cc/v8kw291B/registro.png)](https://postimg.cc/z3CQVyFZ)

## Recuperacion de contraseña
Para recuperar contraseña se debera ingresar un email, si es valido se enviara a su casilla de email un correo con informacion como un token y un enlace para recuperar la contraseña. La nueva contraseña debera ser distinta a la anterior. 

## Perfil
Al realizar el login exitoso se redirecionará al perfil del usuario, en donde contaremos con diferentes opciones como, tienda,chat,carrito,documentacion. 
Por defecto el rol del usuario al ingresar  es "user" el cual se podra actualizar para obtener mas beneficios dentro del sitio utilizando el boton premium.
[![current.png](https://i.postimg.cc/SRs8n3Ly/current.png)](https://postimg.cc/XGRXh2Dh)

## Tienda
En esta seccion podremos encontrar una lista de productos, filtrarlos por determinados parametros y agregar los que deseemos a nuestro carrito , para luego continuar con el proceso de compra.
[![tienda.png](https://i.postimg.cc/GmQyjbMc/tienda.png)](https://postimg.cc/211ykNRJ)

## Carrito
Aqui se visualizan en detalle los productos seleccionados en la vista anterior. Se puede eliminar un producto , vaciar el carrito entero o bien finalizar la compra. Al elegir la opcion finalizar la compra , se validara el stock de los productos agregados
,en caso  de no haber stock de algun producto que se desea comprar este quedara en el carrito y no se sumara al total de la compra final.
[![cart.png](https://i.postimg.cc/QMCHk19b/cart.png)](https://postimg.cc/xkrf9kPJ)

## Checkout
Si la compra se realizo de forma exitosa podremos ver algunos detalles en el checkout. Se enviara un email al correo del usuario con todos los datos en forma detallada de su compra.
[![checkout.png](https://i.postimg.cc/7ZWx4ch3/checkout.png)](https://postimg.cc/Xr9Mcswq)

## Rol premium
Existe la posibilidad de mejorar el rol de user base a premium y obtener los beneficios de crear productos y venderlos en la pagina, con algunas salvedades. El usuario premium solo podra crear, editar y borrar los productos que el creo. No podra autocomprarse los productos que el mismo creo.
Para poder acceder a este rol es necesario que como paso previo suba documentacion a manera de validacion(para fines practictos solo se pide archivos ,txt).
[![documentacion.png](https://i.postimg.cc/wx0ZnN7J/documentacion.png)](https://postimg.cc/Th5tDpjY)

## Panel premium
Aqui se podra crear, editar y eliminar los productos que el usuario desee vender.
[![premium1.png](https://i.postimg.cc/cLYD1t4F/premium1.png)](https://postimg.cc/dhsR41CC)
[![premium2.png](https://i.postimg.cc/j2LXpLFQ/premium2.png)](https://postimg.cc/H81X5sHV)





## Creado con :

* [] 
* [] 
* [] 
* [] 
* [] 
* [] 


## Autor

- [LucasAspee]
