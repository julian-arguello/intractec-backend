import mongodb from 'mongodb';
import { conection } from './databaseConection.dao.js';
const collectionDb = "users";
import rolesDao from './roles.dao.js';

/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un array de usarios.
 * 
 * @returns 
 */
export async function find() {
    return await conection(async function (db) {
        return await db.collection(collectionDb).find().toArray();
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un usario especifico por su id.
 * 
 * @param {string} id 
 * @returns 
 */
export async function findById(id) {
    return await conection(async function (db) {

        try {
            const entity = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (entity == null) {
                throw "[Error] El usario que desea modificar no existe";
            } else {
                entity.role = await rolesDao.findById(entity.role_id)
                entity.password = null
                return entity;
            }
        } catch (err) {
            throw { error: 1000, msg: "[Error] El usuario no existe." }
        }
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un usario segun su email.
 * 
 * @param {string} email 
 * @returns 
 */
export async function findByEmail(email) {
    return await conection(async function (db) {
        return await db.collection(collectionDb).findOne({ email: email });
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Registra un nuevo usario "sin permisos de admin".
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
 * Modifica un ususario según su id.
 * 
 * @param {*} id 
 * @param {*} entity 
 * @returns 
 */
export async function update(id, entity) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El usario que desea modificar no existe";
        } catch (err) {
            throw { error: 1000, msg: "[Error] El usuario no existe." }
        }
        return await db.collection(collectionDb).updateOne({ _id: mongodb.ObjectId(id) }, { $set: entity })
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Elimina un usuario según su id.
 * 
 * @param {*} id 
 * @returns 
 */
export async function deleteEntity(id) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El usario que desea eliminar no existe";
        } catch (err) {
            throw { error: 1000, msg: "[Error] El usuario no existe." }
        }
        return await db.collection(collectionDb).deleteOne({ _id: mongodb.ObjectId(id) })
    })
}
/*-------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------*/

export default {
    find,
    findById,
    findByEmail,
    insert,
    update,
    deleteEntity,
}