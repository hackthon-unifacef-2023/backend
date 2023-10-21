import 'express-async-errors';

import EmailService from './service/EmailService.js';
import OrganizationController from './api/OrganizationController.js';
import OrganizationDAO from './dao/OrganizationDAO.js';
import OrganizationService from './service/OrganizationService.js';
import UserController from './api/UserController.js';
import UserDAO from './dao/UserDAO.js';
import UserService from './service/UserService.js';
import cors from 'cors';
import errorHandler from './api/middleware/errorHandler.js';
import express from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function bootstrap() {
    const db = await open({ filename: 'db.sqlite3', driver: sqlite3.Database });

    const app = express();
    app.use(cors());
    app.use(express.json());

    const organizationDAO = new OrganizationDAO(db);
    const userDAO = new UserDAO(db);

    const emailService = new EmailService();
    const organizationService = new OrganizationService(organizationDAO);
    const userService = new UserService(userDAO);

    const userController = new UserController(userService, emailService);
    const organizationController = new OrganizationController(userService, organizationService);

    app.use('/api/organizations', organizationController.router());
    app.use('/api/users', userController.router());

    app.use(errorHandler);

    app.listen(6969);
}
bootstrap();
