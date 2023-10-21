import authenticate from './middleware/authenticate.js';
import express from 'express';
import { validateCreate } from './EventValidation.js';

export default class {
    eventService = undefined;

    constructor(eventService) {
        this.eventService = eventService;
    }

    router() {
        const router = express.Router();

        router.post('/create', authenticate, validateCreate, (req, res) => this.create(req, res));
        router.get('/list', authenticate, (req, res) => this.list(req, res));

        return router;
    }

    async create(req, res) {
        const { name, points, description, type, reason, pix_code } = req.body;

        await this.eventService.create({
            userID: req.userID,
            name: name,
            points: points,
            description: description,
            type: type,
            reason: reason,
            pixCode: pix_code
        });
        return res.status(201).send();
    }

    async list(req, res) {
        const events = await this.eventService.list({ userID: req.userID });
        return res.json({ events: events });
    }
}
