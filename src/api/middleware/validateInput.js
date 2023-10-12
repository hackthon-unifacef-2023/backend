import joi from 'joi';
import joiPT from 'joi-translation-pt-br';

export default function (input) {
    return (req, res, next) => {
        const messages = [];

        for (const segment in input) {
            const validator = joi.object().keys(input[segment]);

            const { error } = validator.validate(req[segment], { messages: joiPT.messages, abortEarly: false });
            if (error) {
                for (const detail of error.details) {
                    messages.push(detail.message);
                }
            }
        }

        if (messages.length !== 0) {
            return res.status(403).json({ status: 'error', messages: messages });
        }
        next();
    };
}
