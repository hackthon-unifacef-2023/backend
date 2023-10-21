import joi from 'joi';
import validateInput from './middleware/validateInput.js';

export const validateCreate = validateInput({
    body: {
        name: joi.string().required().label('Nome').max(128),
        description: joi.string().required().label('Descrição'),
        type: joi.string().label('Tipo').max(36),
        reason: joi.string().label('Causa').max(36),
        pix_code: joi.string().optional().label('Código PIX').max(256)
    }
});
