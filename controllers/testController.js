import testDao from '../model/lastServiceRegister.dao.js';

/*-------------------------------------------------------------------------------------------*/
/**
 * Regresa un usario especifico según su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
function info(req, res) {
    testDao.find()
        .then(async (data) => {
            console.log(data)
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log('[Error] ', err);
            res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
        })
}
/*-------------------------------------------------------------------------------------------*/
/**
 * Modifica los datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
 function update(req, res) {
 
    testDao.update()
            .then((data) => {
                res.status(200).json({ 'status': 'success', msg: 'todo ok' });
            })
            .catch((err) => {
                console.log('[Error] ', err);
                res.status(500).json({ error: 500, 'status': 'error', msg: err.msg })
            })

}
/*-------------------------------------------------------------------------------------------*/

export default {
    info,
    update
}