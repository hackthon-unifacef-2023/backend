import { validateAuth, validateCreate } from './UserValidation.js';

import authenticate from './middleware/authenticate.js';
import express from 'express';

export default class {
    userService = undefined;
    emailService = undefined;

    constructor(userService, emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    router() {
        const router = express.Router();

        router.get('/id', authenticate, (req, res) => this.id(req, res));
        router.post('/auth', validateAuth, (req, res) => this.auth(req, res));
        router.post('/create', validateCreate, (req, res) => this.create(req, res));

        return router;
    }

    async id(req, res) {
        return res.status(200).json({ id: req.userID });
    }

    async auth(req, res) {
        const { email, password } = req.body;

        const token = await this.userService.auth({
            email,
            password
        });
        return res.status(200).json({ token: token });
    }

    async create(req, res) {
        const { name, email, password } = req.body;

        await this.userService.create({
            name,
            email,
            password
        });
        return res.status(201).send();
    }
}
