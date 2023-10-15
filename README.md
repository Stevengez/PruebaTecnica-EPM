# PruebaTecnica-EPM

Para ejecutar la solucion es necesario tener instalado NodeJS y docker(docker compose para mayor facilidad)

```bash
docker compose up
```

 Pero tambien de manera manual creando una red y conectando los contenedores de la siguiente manera
```bash
docker network create prueba_red
docker run --name pruebadb --network prueba_red -p 5432:5432 -d pruebadb
docker run --name pruebaweb --network prueba_red -p 3000:80 -p 8080:8080 -e PG_HOST=pruebadb -d 
```
