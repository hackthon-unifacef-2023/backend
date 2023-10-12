import { compare, hash } from '../helper/hash.js';

import { v4 as uuid } from 'uuid';

export default class {
    id = undefined;
    name = undefined;
    email = undefined;
    password = undefined;
    createdAt = undefined;
    updatedAt = undefined;

    constructor(name, email, password) {
        const now = new Date();

        this.id = uuid();
        this.name = name;
        this.email = email;
        this.password = hash(password);
        this.createdAt = now;
        this.updatedAt = now;
    }

    static enrich(id, name, email, password, createdAt, updatedAt) {
        const user = Object.create(this.prototype);
        user.id = id;
        user.name = name;
        user.email = email;
        user.password = password;
        user.createdAt = createdAt;
        user.updatedAt = updatedAt;
        return user;
    }

    passwordMatches(password) {
        return compare(password, this.password);
    }
}
