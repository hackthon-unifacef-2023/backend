import BadRequest from '../error/BadRequest.js';
import Unauthorized from '../error/Unauthorized.js';
import User from '../model/User.js';
import { sign } from '../helper/jwt.js';

export default class {
    userDAO = undefined;

    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async listTop10({ userID }) {
        const user = await this.userDAO.find({ id: userID });
        if (!user || user.isAdmin) {
            throw new Unauthorized('Credênciais inválidas');
        }
        const top10 = await this.userDAO.listTop10();
        return top10;
    }

    async auth({ email, password }) {
        const user = await this.userDAO.find({ email: email });
        if (!user) {
            throw new Unauthorized('Credênciais inválidas');
        }
        if (!user.passwordMatches(password)) {
            throw new Unauthorized('Credênciais inválidas');
        }
        const token = sign({ id: user.id });
        return { token: token, isAdmin: user.isAdmin };
    }

    async create({ type, name, email, password }) {
        const emailInUse = await this.userDAO.find({ email: email });
        if (emailInUse) {
            throw new BadRequest('O e-mail já está em uso');
        }
        const user = new User(type, name, email, password);

        await this.userDAO.save(user);
        return user;
    }
}
