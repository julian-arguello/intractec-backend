export function authEdit(req, res, next) {
    const user = req.user;
    if ((req.body._id != user._id) && (user.role.role_name != 'super_admin')) {
        return res.status(400).json({ error: 400, 'status': 'error', msg: "No tiene acceso de super administrador." })
    }
    next()
}