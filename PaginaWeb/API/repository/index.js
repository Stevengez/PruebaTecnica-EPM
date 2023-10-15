const pdb = require('pg-promise')();
const pg_host = process.env.PG_HOST || 'localhost';
const pg_db = process.env.PG_DB || 'PruebaDB';
const pg_user = process.env.PG_USER || 'Prueba';
const pg_password = process.env.PG_PASSWORD || 'Prueba123';
const pg_port = process.env.PG_PORT || 5432;
const pg_ldm_table = process.env.PG_LDM_TABLE_NAME || 'LDM';
const pg_poe_table = process.env.PG_POE_TABLE_NAME || 'POE';
const pg_generacion_table = process.env.PG_GENERACION_TABLE_NAME || 'GENERACION';
const pg_info_table = process.env.PG_INFORMACION_TABLE_NAME || 'INFORMACION';

const db = pdb({
    user: pg_user,
    password: pg_password,
    host: pg_host,
    port: pg_port,
    database: pg_db
});

const queryInfoByDateRange = async (startDate, endDate) => {
    const query = `
        SELECT 
            i.fecha_hora AT TIME ZONE 'Etc/UTC' fecha_hora,
            l.banda,
            l.costo,
            p.poe,
            g.generacion,
            i.indicador,
            i.liquidacion_poe,
            i.liquidacion_cvg,
            i.agente_a,
            i.agente_b
        FROM ${pg_info_table} i
        JOIN ${pg_ldm_table} l ON i.fecha_hora = l.fecha_hora
        JOIN ${pg_poe_table} p ON i.fecha_hora = p.fecha_hora
        JOIN ${pg_generacion_table} g ON i.fecha_hora = g.fecha_hora
        WHERE 
            i.fecha_hora >= to_timestamp('${startDate} 00:00','YYYY-MM-DD HH24:MI') at TIME ZONE 'Etc/UTC' AND 
            i.fecha_hora <= to_timestamp('${endDate} 23:00','YYYY-MM-DD HH24:MI') at TIME ZONE 'Etc/UTC'
        ORDER BY i.fecha_hora ASC
    `;
    return await db.any(query);
}

module.exports = {
    queryInfoByDateRange
};