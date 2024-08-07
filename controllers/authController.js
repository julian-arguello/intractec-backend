import usersDao from '../model/users.dao.js';
import rolesDao from '../model/roles.dao.js';
import jwtService from '../services/jwt.service.js';
import { schemaLogin, schemaRecovery, schemaNewPassword, schemaUserUpdatePassword, schemaUpdatePassword } from '../services/validate.js';
import bcrypt from 'bcrypt';
import sendgrid from '../services/mail/sendgrid.js';
import configMail from '../services/mail/template/configMail.js';
import template from '../services/mail/template/recovery.js';

/*-------------------------------------------------------------------------------------------*/
/**
 * Autentica un usario.
 * 
 * @param {*} req 
 * @param {*} res 
 */
export function login(req, res) {
    console.log('login controller', req.body);
    schemaLogin.validate(req.body)
        .then(async (entity) => {
            console.log('login controller validate', entity);
            const user = await usersDao.findByEmail(entity.email)
            console.log('login controller user', user);
            if (user) {
                if (user.softDelete !== 'true') {
                    user.role = await rolesDao.findById(user.role_id)
                    const validate = await bcrypt.compare(entity.password, user.password)
                    if (validate) {
                        delete user.password;
                        const token = jwtService.generate(user)
                        console.log('login controller token', token);
                        res.header('auth-token', token).json({ user: user, token: token })
                    } else {
                        return res.status(401).json({ err: 401, status: 'error', msg: "Los datos proporcionados no son válidos." })
                    }
                } else {
                    return res.status(400).json({ error: 400, status: 'error', msg: "El usuario está desactivado." })
                }
            } else {
                return res.status(400).json({ err: 400, status: 'error', msg: "Los datos proporcionados no son válidos." })
            }
        })
        .catch((err) => {
            res.status(500).json({ err: 500, msg: "Los datos proporcionados no son válidos.", status: 'error', validateError: err.errors })
        })
}

/*-------------------------------------------------------------------------------------------*/
export function recovery(req, res) {
    //console.log("recovery:", req.body)
    let key = process.env.SENDGRID_API_KEY
    console.log('SENDGRID_API_KEY', key)
    schemaRecovery.validate(req.body)
        .then(async (entity) => {
            const existUser = await usersDao.findByEmail(entity.email)
            const d = Date.now()
            const token = jwtService.generateRecovery({ email: existUser.email, date: d }, true)
            if (existUser) {
                try {
                    sendgrid.send(configMail(existUser.email, template(existUser.name, token)))
                    .then(() => {
                        res.status(200).json({ 'status': 'success', msg: 'Email enviado.' });
                    })
                    .catch((err) => {
                        console.log('[Error] ', err);
                        res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
                    })
                    
                } catch (error) {
                    res.status(400).json({ err: 401, 'status': 'error', msg: error })
                }
            } else {
                res.status(400).json({ error: 400, 'status': 'error', msg: "El usario no existe" })
            }
        })
        .catch((err) => {
            res.status(500).json({
                err: 500, msg: "Error al validar.", 'status': 'error', validateError: err.errors
            })
        })
}
/*-------------------------------------------------------------------------------------------*/
export function newPass(req, res) {
    schemaNewPassword.validate(req.body)
        .then(async (entity) => {
            jwtService.validateRecovery(entity.token)
                .then(async (data) => {
                    const user = await usersDao.findByEmail(data.email)
                    const Dnow = Date.now()
                    let dateToken = Dnow - data.date
                    let isExpired = (dateToken > 300000) ? true : false
                    if (isExpired) {
                        res.status(500).json({ error: 500, 'status': 'error', msg: "EL token expiró." })
                        return
                    }
                    schemaUserUpdatePassword.validate({ password: entity.password })
                        .then(async (entity) => {
                            const salt = await bcrypt.genSalt(10);
                            entity.password = await bcrypt.hash(entity.password, salt);
                            usersDao.update(user._id.toString(), entity)
                                .then(() => {
                                    res.status(200).json({ 'status': 'success', msg: 'La contraseña se restableció exitosamente.' });
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
                })
                .catch((err) => {
                    console.log('[Error] ', err);
                    res.status(500).json({ err: 500, msg: err.msg })
                })
        })
        .catch((err) => {
            res.status(500).json({
                err: 500, msg: "Error al validar.", 'status': 'error', validateError: err.errors
            })
    })
}
/*-------------------------------------------------------------------------------------------*/
export async function updatePass(req, res) {
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).json({ error: 401, msg: 'Token de autenticación requerido.' });
    }
    
    try {
        await schemaUpdatePassword.validate(req.body);
        
        // Valida el token JWT
        const data = await jwtService.validate(token);
        const user = await usersDao.findByEmail(data.email);

        // Verifica que el usuario exista
        if (!user) {
            return res.status(404).json({ error: 404, msg: 'Usuario no encontrado.' });
        }
        
        // Compara la contraseña antigua
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 400, msg: 'La contraseña actual es incorrecta.' });
        }
        
        // Genera el hash para la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        
        // Actualiza la contraseña del usuario en la base de datos
        await usersDao.update(user._id.toString(), { password: hashedPassword });
        
        res.status(200).json({ status: 'success', msg: 'La contraseña se actualizó exitosamente.' });
    } catch (err) {
        console.log('[Error] ', err);
        res.status(500).json({
            error: 500, msg: err.message || 'Error al procesar la solicitud.', 'status': 'error',
            validateError: err.errors || null
        });
    }
}
/*-------------------------------------------------------------------------------------------*/
export default {
    login,
    recovery,
    newPass,
    updatePass
}