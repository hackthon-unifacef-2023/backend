import { validateAuth, validateCreate } from './UserValidation.js';

import Unauthorized from '../error/Unauthorized.js';
import User from '../model/User.js';
import authenticate from './middleware/authenticate.js';
import express from 'express';

export default class {
    userDAO = undefined;
    userService = undefined;
    emailService = undefined;

    constructor(userDAO, userService, emailService) {
        this.userDAO = userDAO;
        this.userService = userService;
        this.emailService = emailService;
    }

    router() {
        const router = express.Router();

        router.get('/top10', authenticate, (req, res) => this.listTop10(req, res));
        router.get('/info', authenticate, (req, res) => this.info(req, res));
        router.post('/auth', validateAuth, (req, res) => this.auth(req, res));
        router.post('/create', validateCreate, (req, res) => this.create(req, res));

        return router;
    }

    async listTop10(req, res) {
        const top10Users = await this.userService.listTop10({ userID: req.userID });
        return res.json({ users: top10Users });
    }

    async info(req, res) {
        const user = await this.userDAO.find({ id: req.userID });
        if (!user) {
            throw new Unauthorized('Credênciais inválidas');
        }
        return res.json({ user: user });
    }

    async auth(req, res) {
        const { email, password } = req.body;

        const { token, isAdmin } = await this.userService.auth({
            email,
            password
        });
        return res.status(200).json({ token: token, is_admin: isAdmin });
    }

    async create(req, res) {
        const { name, email, password } = req.body;

        await this.userService.create({
            type: User.DONATOR_TYPE(),
            name,
            email,
            password
        });
        return res.status(201).send();
    }
}
