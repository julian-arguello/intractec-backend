import mongodb from 'mongodb';
import { conection } from './databaseConection.dao.js';
const collectionDb = "services";

/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un array de servicios.
 * 
 * @returns 
 */
export async function find() {
    return await conection(async function (db) {
        return await db.collection(collectionDb).find().sort({ create_at: -1 }).toArray();
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un servicio especifico por su id.
 * 
 * @param {string} id 
 * @returns 
 */
export async function findById(id) {
    return await conection(async function (db) {

        try {
            const entity = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (entity == null) {
                throw "[Error] El servicio que desea modificar no existe";
            } else {
                return entity;
            }
        } catch (err) {
            throw { error: 1000, msg: "[Error] El servicio no existe." }
        }
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regrsa los ultimos servicios segun la cantidad indicada.
 * 
 * @param {int} cant 
 * @returns 
 */
export async function findRecent(cant = 3) {
    console.log('findRecent.');
    return await conection(async function (db) {

        return await db.collection(collectionDb).find().sort({ create_at: -1 }).limit(cant).toArray();

    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Registra un nuevo servicio.
 * 
 * @param {*} entity 
 * @returns 
 */
export async function insert(entity) {
    return await conection(async function (db) {
        return await db.collection(collectionDb).insertOne(entity)
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Modifica un servicio según su id.
 * 
 * @param {*} id 
 * @param {*} entity 
 * @returns 
 */
export async function update(id, entity) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El servicio que desea modificar no existe";
        } catch (err) {
            throw { error: 1000, msg: "[Error] El servicio no existe." }
        }
        return await db.collection(collectionDb).updateOne({ _id: mongodb.ObjectId(id) }, { $set: entity })
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Elimina un servicio según su id.
 * 
 * @param {*} id 
 * @returns 
 */
export async function deleteEntity(id) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El servicio que desea eliminar no existe";
        } catch (err) {
            throw { error: 1000, msg: "[Error] El servicio no existe." }
        }
        return await db.collection(collectionDb).deleteOne({ _id: mongodb.ObjectId(id) })
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Elimina un servicio según el id del cliente.
 * 
 * @param {*} id 
 * @returns 
 */
export async function deleteEntityclient(id) {
    return await conection(async function (db) {
        console.log('[cliente id]', id)
        return await db.collection(collectionDb).deleteMany({ client_id: id })
    })
}
/*-------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------*/

export default {
    find,
    findById,
    findRecent,
    insert,
    update,
    deleteEntity,
    deleteEntityclient
}