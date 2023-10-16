import { dirname, join } from 'path';

import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class {
    smtpHost = 'sandbox.smtp.mailtrap.io';
    smtpFrom = 'noreply@hackathon.com';
    smtpUser = '11db3cf89b7ba9';
    smtpPass = 'ab22b18f813090';
    smtpPort = 2525;

    constructor() {
        this.mailer = nodemailer.createTransport({
            host: this.smtpHost,
            port: this.smtpPort,
            auth: { user: this.smtpUser, pass: this.smtpPass }
        });
    }

    getEmailHTML(template, params) {
        const dir = join(__dirname, '..', 'email', `${template}.handlebars`);
        const file = readFileSync(dir);
        return handlebars.compile(file.toString(), 'utf8')(params);
    }

    async sendWelcomeEmail(params, to) {
        const html = this.getEmailHTML('welcome', params);

        await this.mailer.sendMail({
            to: to,
            html: html,
            from: this.smtpFrom,
            subject: 'Seja bem vindo!'
        });
    }
}
