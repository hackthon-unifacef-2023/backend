import joi from 'joi';
import validateInput from './middleware/validateInput.js';

export const validateCreate = validateInput({
    body: {
        name: joi.string().required().label('Nome').max(128),
        email: joi.string().email().required().label('E-mail').max(128),
        password: joi.string().required().label('Senha').min(4).max(128),
        phone: joi.string().required().label('Telefone').max(36),
        description: joi.string().required().label('Descrição'),
        has_address: joi.bool().required().label('Possui endereço'),
        city: joi.string().optional().label('Cidade').max(64),
        state: joi.string().optional().label('Estado').max(64),
        street: joi.string().optional().label('Rua').max(64),
        number: joi.string().optional().label('Número').max(8),
        zip_code: joi.string().optional().label('CEP').max(9),
        district: joi.string().optional().label('Bairro').max(64)
    }
});
