import usersDao from '../model/users.dao.js';
import rolesDao from '../model/roles.dao.js';
import { schemaUserRegister, schemaUserProfileUpdate, schemaUserUpdate } from '../services/validate.js';
import bcrypt from 'bcrypt';
import jwtService from './../services/jwt.service.js';


/*-------------------------------------------------------------------------------------------*/
/**
 * Retorna el listado de usarios.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function viewAlls(req, res) {
    console.log('[Users] Todos los usarios.');
    usersDao.find()
        .then(async (users) => {
            const roles = await rolesDao.find();
            let userRes = []
            for (const user of users) {
                delete user.password
                roles.forEach(function (role) {
                    if (role._id.toString() === user.role_id) {
                        user.role = role;
                    }
                });
                if (user.role.role_name != 'super_admin') {
                    userRes.push(user)
                }
            }
            res.status(200).json(userRes);
        })
        .catch((err) => {
            console.log('[Error] ', err);
            res.status(500).json({ err: 500, 'status': 'error', msg: err.msg })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un usario especifico según su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function viewId(req, res) {
    usersDao.findById(req.params.id)
        .then(async (user) => {
            user.role = await rolesDao.findById(user.role_id)
            console.log(user.role)
            res.status(200).json(user);
        })
        .catch((err) => {
            console.log('[Error] ', err);
            res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Retorna el listado de usarios.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function viewRoles(req, res) {
    console.log('[roles] Todos los roles.');
    rolesDao.find()
        .then(async (roles) => {
            roles.splice(2, 1);
            res.status(200).json(roles);
        })
        .catch((err) => {
            console.log('[Error] ', err);
            res.status(500).json({ err: 500, 'status': 'error', msg: err.msg })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Registra un nuevo usario.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function register(req, res) {
    schemaUserRegister.validate(req.body)
        .then(async (entity) => {
            //Consultamos si ya existe.
            const existUser = await usersDao.findByEmail(entity.email)
            if (!(existUser)) {
                const salt = await bcrypt.genSalt(10);
                entity.password = await bcrypt.hash(entity.password, salt);
                entity.softDelete = "false";
                entity.avatar = "casco-gris";
                usersDao.insert(entity)
                    .then((user) => {
                        res.status(200).json({ 'status': 'success', msg: 'El usuario fue registrado correctamente.' });
                    })
                    .catch((err) => {
                        console.log('[Error] ', err);
                        res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
                    })
            } else {
                res.status(400).json({ error: 400, 'status': 'error', msg: "El usuario ya existe." })
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: 500, msg: "Error al validar.", 'status': 'error', validateError: err.errors
            })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Modifica los datos del usario.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function update(req, res) {
    schemaUserUpdate.validate(req.body)
        .then(async (entity) => {
            usersDao.update(req.params.id, entity)
                .then((user) => {
                    res.status(200).json({ 'status': 'success', msg: 'El usuario fue modificado correctamente.' });
                })
                .catch((err) => {
                    console.log('[Error] ', err);
                    res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
                })
        })
        .catch((err) => {
            res.status(500).json({
                error: 500, msg: "[Error] ", 'status': 'error', validateError: err.errors
            })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Modifica los datos del pefilr.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function updateProfile(req, res) {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ error: 401, msg: 'Token de autenticación requerido.' });
    }

    schemaUserProfileUpdate.validate(req.body)
        .then(async (entity) => {

            const data = await jwtService.validate(token);
            const user = await usersDao.findByEmail(data.email);

            usersDao.update(user._id, entity)
                .then((user) => {
                    res.status(200).json({ 'status': 'success', msg: 'El usuario fue modificado correctamente.' });
                })
                .catch((err) => {
                    console.log('[Error] ', err);
                    res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
                })
        })
        .catch((err) => {
            res.status(500).json({
                error: 500, msg: "[Error] ", 'status': 'error', validateError: err.errors
            })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Elimina un usario según su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
export function deleteEntity(req, res) {
    usersDao.deleteEntity(req.params.id)
        .then((user) => {
            console.log('[entity]', user)
            res.status(200).json({ 'status': 'success', msg: 'El usuario fue eliminado correctamente.' });
        })
        .catch((err) => {
            console.log('[Error] ', err);
            res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
        })
}
/*-------------------------------------------------------------------------------------------*/

export default {
    viewAlls,
    viewId,
    viewRoles,
    register,
    update,
    deleteEntity,
    updateProfile
}