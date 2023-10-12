import BadRequest from '../error/BadRequest.js';
import User from '../model/User.js';
import { sign } from '../helper/jwt.js';

export default class {
    userDAO = undefined;

    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async auth({ email, password }) {
        const user = await this.userDAO.find({ email: email });
        if (!user) {
            throw new BadRequest('Credênciais inválidas');
        }
        if (!user.passwordMatches(password)) {
            throw new BadRequest('Credênciais inválidas');
        }
        const token = sign({ id: user.id });
        return token;
    }

    async create({ name, email, password }) {
        const emailInUse = await this.userDAO.find({ email: email });
        if (emailInUse) {
            throw new BadRequest('O e-mail já está em uso');
        }
        const user = new User(name, email, password);

        await this.userDAO.save(user);
    }
}
