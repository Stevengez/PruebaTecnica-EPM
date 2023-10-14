const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Constantes
const MonthLiterals = [
"ENERO", "FEBRERO", "MARZO", 
"ABRIL", "MAYO", "JUNIO",
"JULIO", "AGOSTO", "SEPTIEMBRE", 
"OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

const ShortMonthLiterals = [
"ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
"JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
];

// Rango de Fechas en formato: mes/dia/año
const fromDate = new Date("01/01/2023");
const toDate = new Date("06/30/2023");

// Crear Directorio de Descargas
const createDaylyReportsDirectory = (start, end) => {
    const fullPath = path.join(__dirname, `Reportes ${start} al ${end}`);
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath);
    }
    return fullPath;
}

// Funcion para obtener los dias de un mes dependiendo el año
const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}

const getFileFromURL = async (url, targetDir, fileName) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        response.data.pipe(fs.createWriteStream(path.resolve(targetDir, fileName)));
    }catch(err){
        console.log("Error al descargar el archivo: ", err);
    }
}

const downloadDailyReport = async (targetYearNumeric, targetMonthNumeric, targetDayNumeric, targetDir) => {
    // URL Estatica, no cambia entre meses o años
    const baseURL = "https://www.amm.org.gt//pdfs2/programas_despacho/01_PROGRAMAS_DE_DESPACHO_DIARIO/";
    // URL Dinamica, cambia dependiendo el mes dia o año
    const dynamicURL = `${targetYearNumeric}/01_PROGRAMAS_DE_DESPACHO_DIARIO/${targetMonthNumeric}_${MonthLiterals[parseInt(targetMonthNumeric)-1]}/WEB${targetDayNumeric}${targetMonthNumeric}${targetYearNumeric}.xlsx`;
    // URL Completa en base a la fecha elegida
    const targetURL = `${baseURL}${dynamicURL}`;
    const fileName = `WEB${targetDayNumeric}${targetMonthNumeric}${targetYearNumeric}.xlsx`;
    await getFileFromURL(targetURL,targetDir, fileName);
}

const getReports = async () => {
    // De-estructuración de fechas
    const startDay = fromDate.getDate();
    const endDay = toDate.getDate();

    const startMonth = fromDate.getMonth()+1;
    const endMonth = toDate.getMonth()+1;

    const startYear = fromDate.getFullYear();
    const endYear = toDate.getFullYear();

    // Preparar directorio
    const fullPathDir = createDaylyReportsDirectory(`${startDay}-${ShortMonthLiterals[startMonth-1]}-${startYear}`,`${endDay}-${ShortMonthLiterals[endMonth-1]}-${endYear}`);

    
    // Ciclo para recorrer los meses y años
    for(let y = startYear; y <= endYear; y++){
        const targetYearNumeric = y;
        for(let m = startMonth; m <= endMonth; m++){
            // Meses de 1 a 12, se les agrega un cero al inicio para que sean 2 digitos
            const targetMonthNumeric = m.toString().padStart(2, "0");
            for(
                let d = (m === startMonth && y === startYear ? startDay: 1); 
                d <= (m === endMonth && y === endYear ? endDay : getDaysInMonth(m, y)); 
                d++
            ){
                // Dias de 1 a 31, se les agrega un cero al inicio para que sean 2 digitos si hace falta
                const targetDayNumeric = d.toString().padStart(2, "0");
                await downloadDailyReport(targetYearNumeric, targetMonthNumeric, targetDayNumeric, fullPathDir);
            }
        }
    }
}

getReports();






