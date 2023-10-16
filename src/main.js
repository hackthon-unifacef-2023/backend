import 'express-async-errors';

import EmailService from './service/EmailService.js';
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

    const userDAO = new UserDAO(db);

    const emailService = new EmailService();
    const userService = new UserService(userDAO);

    const userController = new UserController(userService, emailService);

    app.use('/api/users', userController.router());

    app.use(errorHandler);

    app.listen(3000);
}
bootstrap();
