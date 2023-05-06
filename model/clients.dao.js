import mongodb from 'mongodb';
import { conection } from './databaseConection.dao.js';

const collectionDb = "clients";

/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un array de clientes.
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
 * Regresa un cliente especifico por su id.
 * 
 * @param {string} id 
 * @returns 
 */
export async function findById(id) {
    return await conection(async function (db) {

        try {
            const entity = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (entity == null) {
                throw "[Error] El cliente que desea modificar no existe";
            } else {
                return entity;
            }
        } catch (err) {
            throw { error: 1000, msg: "[Error] El cliente no existe." }
        }
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un cliente segun su cuit/cuil.
 * 
 * @param {string} email 
 * @returns 
 */
export async function findByEmail(cuit_cuil) {
    return await conection(async function (db) {
        return await db.collection(collectionDb).findOne({ cuit_cuil: cuit_cuil });
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Registra un nuevo cliente.
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
 * Modifica un según su id.
 * 
 * @param {*} id 
 * @param {*} entity 
 * @returns 
 */
export async function update(id, entity) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El cliente que desea modificar no existe";
        } catch (err) {
            throw { error: 1000, msg: "[Error] El cliente no existe." }
        }
        return await db.collection(collectionDb).updateOne({ _id: mongodb.ObjectId(id) }, { $set: entity })
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Agrega un servicio a un cliente.
 * 
 * @param {id del cliente} id 
 * @param {id del servicio} serviceId 
 * @returns 
 */
export async function addService(id, serviceId) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El cliente que desea modificar no existe";
            const entity = {
                services: {
                    ...data.services,
                    [serviceId]: true
                }
            }
            return await db.collection(collectionDb).updateOne({ _id: mongodb.ObjectId(id) }, { $set: entity })
        } catch (err) {
            throw { error: 1000, msg: "[Error] El cliente no existe." }
        }
    })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * elimina un servicio a un cliente.
 * 
 * @param {id del cliente} id 
 * @param {id del servicio} serviceId 
 * @returns 
 */
export async function deleteService(id, serviceId) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El cliente que desea modificar no existe";
            delete data.services[`${serviceId}`]
            const entity = {
                services: {
                    ...data.services
                }
            }
            return await db.collection(collectionDb).updateOne({ _id: mongodb.ObjectId(id) }, { $set: entity })
        } catch (err) {
            throw { error: 1000, msg: "[Error] El cliente no existe." }
        }
    })
}

/*-------------------------------------------------------------------------------------------*/
/**
 * Elimina un cliente según su id.
 * 
 * @param {*} id 
 * @returns 
 */
export async function deleteEntity(id) {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).findOne({ _id: mongodb.ObjectId(id) });
            if (data == null) throw "[Error] El cliente que desea eliminar no existe";
        } catch (err) {
            throw { error: 1000, msg: "[Error] El cliente no existe." }
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
    addService,
    deleteEntity,
    deleteService,
}