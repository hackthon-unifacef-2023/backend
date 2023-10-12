import BadRequest from '../../error/BadRequest.js';
import Unauthorized from '../../error/Unauthorized.js';

export default function (err, _req, res, _next) {
    if (err instanceof BadRequest || err instanceof Unauthorized) {
        return res.status(err.status).json({ status: 'error', messages: [err.message] });
    }
    console.log(err);
    return res.status(500).json({ status: 'error', messages: ['Erro interno no servidor'] });
}
