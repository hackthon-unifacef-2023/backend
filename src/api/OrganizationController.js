import User from '../model/User.js';
import authenticate from './middleware/authenticate.js';
import express from 'express';
import { validateCreate } from './OrganizationValidation.js';

export default class {
    userService = undefined;
    organizationService = undefined;

    constructor(userService, organizationService) {
        this.userService = userService;
        this.organizationService = organizationService;
    }

    router() {
        const router = express.Router();

        router.post('/approve/:id', authenticate, (req, res) => this.approve(req, res));
        router.get('/list', authenticate, (req, res) => this.list(req, res));
        router.post('/create', validateCreate, (req, res) => this.create(req, res));

        return router;
    }

    async approve(req, res) {
        this.organizationService.approve({ userID: req.userID, organizationID: req.params.id });
        return res.status(200).send();
    }

    async list(req, res) {
        const organizations = await this.organizationService.list({ userID: req.userID });
        return res.json({ organizations: organizations });
    }

    async create(req, res) {
        const {
            name,
            email,
            password,
            phone,
            description,
            has_address,
            city,
            state,
            street,
            number,
            zip_code,
            district
        } = req.body;

        const { id: userID } = await this.userService.create({
            type: User.ORGANIZATION_TYPE(),
            name,
            email,
            password
        });
        await this.organizationService.create({
            userID: userID,
            phone: phone,
            description: description,
            hasAddress: has_address,
            city: city,
            state: state,
            street: street,
            number: number,
            zipCode: zip_code,
            district: district
        });
        return res.status(201).send();
    }
}
