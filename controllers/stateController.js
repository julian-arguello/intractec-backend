import stateDao from '../model/states.dao.js';

/*-------------------------------------------------------------------------------------------*/
/**
 * Retorna el listado de usarios.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function viewAlls(req, res) {
    console.log('[state] Todos los esatdos.');
    stateDao.find()
        .then(async (users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log('[Error] ', err);
            res.status(500).json({ err: 500, 'status': 'error', msg: err.msg })
        })
}
/*-------------------------------------------------------------------------------------------*/

export default {
    viewAlls,
}