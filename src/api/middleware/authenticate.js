import UnauthorizedError from '../../error/Unauthorized.js';
import { read } from '../../helper/jwt.js';

export default async (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        throw new UnauthorizedError('Credenciais inválidas, corrija os valores e tente novamente');
    }
    const [_, token] = header.split(' ');

    const payload = read(token);
    if (!payload) {
        throw new UnauthorizedError('Credenciais inválidas, corrija os valores e tente novamente');
    }
    req.userID = payload.id;
    next();
};
