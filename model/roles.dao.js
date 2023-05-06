import mongodb from 'mongodb';
import { conection } from './databaseConection.dao.js';
const collectionDb = "roles";

/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa el listado de roles.
 * 
 * @returns 
 */
export async function find() {
    return conection(async function (db) {
        return await db.collection(collectionDb).find().toArray();
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un role especifico por su id.
 * 
 * @param {string} id 
 * @returns 
 */
export async function findById(id) {
    return await conection(async function (db) {
        const role = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
        if (!role) {
            throw { error: 1000, msg: "[Error] El rol no existe." }
        } else {
            return role;
        }
    })
}
/*-------------------------------------------------------------------------------------------*/
export default {
    find,
    findById,
}