import Event from '../model/Event.js';
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
        router.post('/enroll/:id', authenticate, (req, res) => this.enroll(req, res));
        router.post('/approve/:id', authenticate, (req, res) => this.approve(req, res));
        router.get('/param/types', (req, res) => this.getTypes(req, res));
        router.get('/param/reasons', (req, res) => this.getReasons(req, res));
        router.get('/public/list', authenticate, (req, res) => this.listPublicEvents(req, res));
        router.get('/organization/list', authenticate, (req, res) => this.listOrganizationEvents(req, res));

        return router;
    }

    async create(req, res) {
        const { name, description, type, reason, pix_code } = req.body;
        await this.eventService.create({
            userID: req.userID,
            name: name,
            description: description,
            type: type,
            reason: reason,
            pixCode: pix_code
        });
        return res.status(201).send();
    }

    async enroll(req, res) {
        this.eventService.enroll({ userID: req.userID, eventID: req.params.id });
        return res.status(200).send();
    }

    async approve(req, res) {
        this.eventService.approve({ userID: req.userID, eventID: req.params.id });
        return res.status(200).send();
    }

    async getTypes(_, res) {
        const types = Event.getTypes();
        return res.json({ types: types });
    }

    async getReasons(_, res) {
        const reasons = Event.getReasons();
        return res.json({ reasons: reasons });
    }

    async listPublicEvents(_, res) {
        const events = await this.eventService.listPublicEvents();
        return res.json({ events: events });
    }

    async listOrganizationEvents(req, res) {
        const events = await this.eventService.listOrganizationEvents({ userID: req.userID });
        return res.json({ events: events });
    }
}
