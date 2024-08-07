# Proyecto Final de Programación Backend comision 53105.

Mi nombre es Lucas Aspee , este es mi proyecto final .

El proyecto es una api de un ecommerce, desarrollada utilizando express y mongodb para el back y handlebars para las vistas del front, a continuacion se explica mas en detalle todas las funcionalidades.


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



## Creado con :

* [] 
* [] 
* [] 
* [] 
* [] 
* [] 


## Autor

- [LucasAspee]
