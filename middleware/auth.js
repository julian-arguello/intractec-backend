import jwtService from "../services/jwt.service.js";

export function isAuth(req, res, next) {
    const token = req.header('auth-token')
    if (token) {
        jwtService.validate(token)
            .then((userToken) => {
                req.user = userToken;
                if (userToken.softDelete == 'true') {
                    return res.status(400).json({ error: 400, 'status': 'error', msg: "EL usario esta desactivado" })
                } else {
                    next()
                }
            })
            .catch((err) => {
                console.log('[Error] ', err);
                res.status(500).json({ err: 500, msg: err.msg })
            })
    } else {
        return res.status(400).json({ error: 400, 'status': 'error', msg: "Token no encontrado." })
    }
}