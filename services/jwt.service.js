import jwt from 'jsonwebtoken';
import config from '../config.js';

/*-------------------------------------------------------------------------------------------*/
/**
 * Genera un token.
 * 
 * @param {*} entity 
 * @returns 
 */
export function generate(entity) {
    return jwt.sign(entity, config.jwt_key.key)
}
/*-------------------------------------------------------------------------------------------*/
export function generateRecovery(entity) {
    return jwt.sign(entity, config.jwt_key.key_recovery)
}
/*-------------------------------------------------------------------------------------------*/
export async function validate(token) {
    try {
        return jwt.verify(token, config.jwt_key.key);
    }
    catch (err) {
        throw { error: 1000, msg: "[Error] El token no es valido." }
    }
}
/*-------------------------------------------------------------------------------------------*/
export async function validateRecovery(token) {
    try {
        return jwt.verify(token, config.jwt_key.key_recovery);
    }
    catch (err) {
        throw { error: 1000, msg: "[Error] El token no es valido." }
    }
}
/*-------------------------------------------------------------------------------------------*/


export default {
    generate,
    validate,
    generateRecovery,
    validateRecovery
}