import mongodb from 'mongodb';
import config from '../config.js';
const client = new mongodb.MongoClient(`mongodb+srv://${config.db.host}:${config.db.port}`);
const db = client.db(config.db.dbName);
/*-------------------------------------------------------------------------------------------*/
/**
 * Esta función se encarga de abrir y cerrar la coneccion
 * recibiendo las funciones a ejecutar por medio de callback
 * 
 * @param {function} callback 
 * @returns 
 */
export async function conection(callback) {
    await client.connect() //Esperamos la conexion.
    const result = await callback(db);

    return result;
}
/*-------------------------------------------------------------------------------------------*/