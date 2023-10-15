
# Base de Datos
Se creo una base de datos usando PostgreSQL, los datos de la misma ya se incluyen en el repositorio (DBdata) para poder crear una imagen de docker.
Las credenciales por defecto se encuentran implementadas en todos los componentes que las usan pero se pueden modificar usando variables de entorno (ver archivo .env.tmp)

Para crear la imagen basta utilizar el siguiente comando desde la raiz de la carpeta **LlenadoDatos**
```bash
docker build -t pruebadb .
```

# Extraccion de Datos
Para extraer los datos y llenar la informacion en la base de datos se utilizo de igual manera un script con NodeJS.
Para ejecutarlo primero se deben instalar los paquetes necesarios usando ```npm install``` en la raiz de la carpeta **LlenadoDatos**
Una vez instalados todos los paquetes, se debe ejecutar el comando node index.js "RUTA_A_CARPETA_DE_REPORTES_EN_EXCEL"

La imagen de la base de datos de docker ya incluye todos los datos de los archivos requeridos por la prueba, pero si se quisiera probar este script, es necesario primer tener un contenedor de docker ejecutando la base de datos.

Ejemplo:
```bash
node index.js "/home/usuario/Documentos/Reportes 2023-01-01 al 2023-01-10"
```

# Calculo de datos
El calculo de datos en realidad se hace en el lado de la base de datos ya que es mucho mas eficiente. Sin embargo ya que se solicitaba que se creara codigo para esta tarea, cree un script en nodejs que consiste en una llamada a la base de datos para ejecutar dicha consulta que inserta los datos.

Para ejecutar este script la base de datos debe tener ya los datos ingresados desde la extraccion de datos, los archivos poe.csv y generacion.csv, y con estos datos ya cargados en la DB, se puede ejecutar el script desde la raiz de la carpeta **LlenadoDatos** ejecutando el siguiente comando:

```bash
node calculo.js
```
