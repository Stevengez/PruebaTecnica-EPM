const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { type } = require('os');
const pdb = require('pg-promise')();
require('dotenv').config();

// Constants
const pg_host = process.env.PG_HOST || 'localhost';
const pg_db = process.env.PG_DB || 'PruebaDB';
const pg_user = process.env.PG_USER || 'Prueba';
const pg_password = process.env.PG_PASSWORD || 'Prueba123';
const pg_port = process.env.PG_PORT || 5432;
const pg_ldm_table = process.env.PG_LDM_TABLE_NAME || 'LDM';

const horasDemandaMinima = [{start: 0, end: 5},{start: 22, end: 23}];
const horasDemandaMedia = [{start: 6, end: 17}];
const horasDemandaMaxima = [{start: 18, end: 21}];

const ExcelPageName = 'LDM';
const TargetNemo = 'JEN-C';
const TargetRowLength = 5;
const ReportsDirectoryPath = process.argv[2];

const getXlsFileDemand = (filePath, targetRowLength, targetNemo) => {
    const file1 = xlsx.readFile(filePath, { raw: true });
    const ldmData = xlsx.utils.sheet_to_json(file1.Sheets[ExcelPageName], { header: 1 });
    const rawRows = ldmData.filter((row) => row.length === targetRowLength && row[0] === targetNemo);
    const mappedDemand = rawRows.map((row) => ({ nemo: row[0], plant: row[1], power: row[2], cost: row[3], fpne: row[4]}));

    return {
        minima : mappedDemand[0],
        media : mappedDemand[1],
        maxima : mappedDemand[2]
    }
}

const insertIntoDB = async (db, demandData) => {
    const query =
        `INSERT INTO ${pg_ldm_table} `+
            '(fecha_hora, nemo, planta_generadora, potencia_disponible, costo, fpne, banda) '+
        'VALUES '+
            '(to_timestamp(${datetime}, \'DD/MM/YYYY HH24:MI\'),${nemo},${plant},${power},${cost},${fpne},${band})';

    try {
        await db.none(query, demandData);
    }catch(e){
        if(e.code === '23505'){
            console.log("   Ya existe el registro para la fecha/hora:", demandData.datetime);
        }else{
            console.log("   Error:", e);
        }
    }
}

const loopPathFiles = async () => {
    try {
        const db = pdb({
            user: pg_user,
            password: pg_password,
            host: pg_host,
            port: pg_port,
            database: pg_db
        });

        const reportFiles = fs.readdirSync(ReportsDirectoryPath)

        for(let file of reportFiles){
            const extension = path.extname(file);
            if(extension === '.xlsx'){
                const currentDate = file.replace('.xlsx','').replaceAll('-','/');
                const demandRows = getXlsFileDemand(`${ReportsDirectoryPath}/${file}`, TargetRowLength, TargetNemo);
                console.log("Extrayendo datos:", file);

                for(let h of horasDemandaMinima){
                    //console.log("From: ", h.start, "To: ", h.end);
                    for(let i=h.start;i<=h.end;i++){
                        //console.log("Insert: ", `${i.toString().padStart(2, '0')}:00`);
                        await insertIntoDB(db, {
                            datetime: `${currentDate} ${i.toString().padStart(2, '0')}:00`,
                            ...demandRows.minima,
                            band: 'DEMANDA MINIMA'
                        });
                    }
                }
                
                for(let h of horasDemandaMedia){
                    for(let i=h.start;i<=h.end;i++){
                        await insertIntoDB(db, {
                            datetime: `${currentDate} ${i.toString().padStart(2, '0')}:00`,
                            ...demandRows.media,
                            band: 'DEMANDA MEDIA'
                        });
                    }
                }

                for(let h of horasDemandaMaxima){
                    for(let i=h.start;i<=h.end;i++){
                        await insertIntoDB(db, {
                            datetime: `${currentDate} ${i.toString().padStart(2, '0')}:00`,
                            ...demandRows.maxima,
                            band: 'DEMANDA MAXIMA'
                        });
                    }
                }
            }
        }
    }catch(e){
        if(e.syscall === 'scandir'){
            console.log("No se encontro el directorio: ", ReportsDirectoryPath);
        }else if(!process.argv[2]){
            console.log("No se proporciono un directorio");
        }else{
            console.log("Error: ", e);
        }
    }finally{
        pdb.end();
    }
}

loopPathFiles().then(() => {
    console.log("Se completo la ejecucion");
});