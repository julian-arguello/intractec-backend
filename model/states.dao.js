import mongodb from 'mongodb';
import { conection } from './databaseConection.dao.js';
const collectionDb = "states";

/*-------------------------------------------------------------------------------------------*/
export async function find() {
    return conection(async function (db) {
        return await db.collection(collectionDb).find().toArray();
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un state especifico por su id.
 * 
 * @param {string} id 
 * @returns 
 */
export async function findById(id) {
    return await conection(async function (db) {
        return await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
    })
}
/*-------------------------------------------------------------------------------------------*/
export default {
    find,
    findById,
}