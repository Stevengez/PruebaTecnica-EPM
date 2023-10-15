const pdb = require('pg-promise')();
require('dotenv').config();

// Constants
const pg_host = process.env.PG_HOST || 'localhost';
const pg_db = process.env.PG_DB || 'PruebaDB';
const pg_user = process.env.PG_USER || 'Prueba';
const pg_password = process.env.PG_PASSWORD || 'Prueba123';
const pg_port = process.env.PG_PORT || 5432;

const pg_ldm_table = process.env.PG_LDM_TABLE_NAME || 'LDM';
const pg_poe_table = process.env.PG_POE_TABLE_NAME || 'poe';
const pg_generacion_table = process.env.PG_GENERACION_TABLE_NAME || 'generacion';

const calculateAndInsertQuery = async (db) => {
    const query = `
    INSERT INTO informacion (fecha_hora, indicador, liquidacion_poe, liquidacion_cvg, agente_a, agente_b)
    SELECT
        l.fecha_hora, 
        (case when p.poe < l.costo then 1 else 0 end) indicador,
        (g.generacion*p.poe) liquidacion_poe,
        (g.generacion*l.costo) liquidacion_cvg,
        ((g.generacion*p.poe)-(g.generacion*l.costo)) agente_a,
        (((g.generacion*p.poe)-(g.generacion*l.costo))*((case when p.poe < l.costo then 1 else 0 end) - 1)) agente_b
    FROM ${pg_ldm_table} l
    JOIN ${pg_poe_table} p on l.fecha_hora = p.fecha_hora 
    JOIN ${pg_generacion_table} g on l.fecha_hora = g.fecha_hora 
    ORDER BY l.fecha_hora asc;`;

    try {
        await db.none(query);
    }catch(e){
        if(e.code === '23505'){
            console.log("Ya existen los datos");
        }else{
            console.log("Error:", e);
        }
        
    }
}

const executeInsert = async () => {
    try {
        const db = pdb({
            user: pg_user,
            password: pg_password,
            host: pg_host,
            port: pg_port,
            database: pg_db
        });
        
        await calculateAndInsertQuery(db);
    }catch(e){
        console.log("Error:", e);
    }finally{
        pdb.end();
    }
}

executeInsert().then(() => {
    console.log("Ejecucion completa");
});