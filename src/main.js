import 'express-async-errors';

import UserController from './api/UserController.js';
import UserDAO from './dao/UserDAO.js';
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
    const userController = new UserController(userDAO);

    app.use('/api/users', userController.router());

    app.use(errorHandler);

    app.listen(3000);
}
bootstrap();
