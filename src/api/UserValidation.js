import joi from 'joi';
import validateInput from './middleware/validateInput.js';

export const validateAuth = validateInput({
    body: {
        email: joi.string().email().required().label('E-mail').max(128),
        password: joi.string().required().label('Senha').min(4).max(128)
    }
});

export const validateCreate = validateInput({
    body: {
        name: joi.string().required().label('Nome').max(128),
        email: joi.string().email().required().label('E-mail').max(128),
        password: joi.string().required().label('Senha').min(4).max(128)
    }
});
