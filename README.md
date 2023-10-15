# PruebaTecnica-EPM
Este repositorio contiene la solucion de la prueba tecnica para la plaza de programador de transformacion digital

# Como probar la solucion
Para probar la solucion, de manera facil he incluido un archivo docker-compose.yml que permite crear y levantar las imanges en docker asi como crear la conexion entre el contenedor de la base de datos y la pagina web y su API:
```bash
# Ejecutar desde la raiz de la carpeta del repositorio
docker-compose up
```

Tambien puede ejecutarse sin usar docker-compose creando la red manualmente y luego creando y ejecutando las imagenes de docker correspondientes:

Crear la imagen de la base de datos:
```bash
#Ejecutar desde la raiz de la carpeta LlenadoDatos
docker build -t pruebadb .
```

Crear la imagen de la pagina web/api:
```bash
#Ejecutar desde la raiz de la carpeta PaginaWeb
docker build -t prueba_web .
```

Una vez creadas las imagenes, crear la red y los contenedores de la siguiente manera:
```bash
docker network create prueba_red
docker run --name pruebadb --network prueba_red -p 5432:5432 -d pruebadb
docker run --name pruebaweb --network prueba_red -p 3000:80 -p 8080:8080 -e PG_HOST=pruebadb -d prueba_web
```
Acceder a la pagina web usando [http://localhost:3000](http://loclahost:3000)
