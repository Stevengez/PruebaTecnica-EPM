# Herramienta para descargar reportes
Se implemento una herramienta para descargar los reportes diarios de la pagina del [Administrador de Mercado Mayorista](https://www.amm.org.gt/portal/?page_id=1995)
El codigo esta escrito en javascript y se ejecuta con NodeJS

Para ejecutarla primero se deben instalar los paquetes los paquetes necesarios usando ```npm install``` en la raiz de la carpeta **Descarga_Reportes**
Una vez instalados todos los paquetes, se puede ejecutar desde la terminal ejecutando ```npm run start``` o ```node index.js``` en la raiz de la carpeta **Descarga_Reportes**

Si se quiere modificar el rango de fechas basta con cambiralas en el archivo ```index.js```
```javascript
// Rango de Fechas en formato: mes/dia/año
const fromDate = new Date("01/01/2023");
const toDate = new Date("06/30/2023");
```

La descarga se realizara a la carpeta donde se ejecuta el comando con el formato de nombre ```Reportes <<Fecha_inicial>> al <<Fecha_final>>```
