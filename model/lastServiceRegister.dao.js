import mongodb from 'mongodb';
import { conection } from './databaseConection.dao.js';
const collectionDb = "last_service_record";

/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa el ultimo numero de consulta de los servicios.
 * 
 * @returns 
 */
export async function find() {
    return conection(async function (db) {
        const data = await db.collection(collectionDb).find().toArray();
        return data[0].last_register_value;
    })
}
/*-------------------------------------------------------------------------------------------*/

 export async function update() {
    return await conection(async function (db) {
        try {
            const data = await db.collection(collectionDb).find().toArray();
            
            let last_register_value = data[0].last_register_value;
            console.log("last_register", last_register_value);
            console.log("new_last_register", last_register_value + 1);

            let id = data[0]._id.toString();
            console.log("id", id);
            console.log("id", { _id: mongodb.ObjectId(id) });
        
            
            return await db.collection(collectionDb).updateOne({ _id: mongodb.ObjectId(id) },{
                $set: {
                    last_register_value: last_register_value + 1
                }
            })
              

        } catch (err) {
            throw { error: 1000, msg: "[Error] El Registro no existe." }
        }



    })
}
/*-------------------------------------------------------------------------------------------*/
export default {
    find,
    update
}