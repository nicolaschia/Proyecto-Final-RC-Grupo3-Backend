import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    const { token } = req.cookies

    if (!token)
        return res.status(401).json({ message: "No token, authorization denied" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: "invalid token" });

        req.user = user;
        next();
    })

}



export const isAdmin = (req, res, next) => {
    const userHeader = req.headers.user;

    if (userHeader) {
        try {
            const user = JSON.parse(userHeader);
            if (user.role === 'admin') {
                next(); // Usuario es administrador, permite el acceso.
            } else {
                res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
            }
        } catch (error) {
            res.status(400).json({ message: 'Error al analizar el encabezado de usuario' });
        }
    } else {
        res.status(400).json({ message: 'El encabezado de usuario no está presente en la solicitud' });
    }
};
