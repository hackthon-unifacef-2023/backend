import { compare, hash } from '../helper/hash.js';

import { v4 as uuid } from 'uuid';

export default class {
    id = undefined;
    type = undefined;
    name = undefined;
    email = undefined;
    password = undefined;
    isAdmin = undefined;
    createdAt = undefined;
    updatedAt = undefined;

    constructor(type, name, email, password) {
        const now = new Date();

        this.id = uuid();
        this.type = type;
        this.name = name;
        this.email = email;
        this.password = hash(password);
        this.isAdmin = false;
        this.createdAt = now;
        this.updatedAt = now;
    }

    static enrich(id, type, name, email, password, isAdmin, createdAt, updatedAt) {
        const user = Object.create(this.prototype);
        user.id = id;
        user.type = type;
        user.name = name;
        user.email = email;
        user.password = password;
        user.isAdmin = isAdmin;
        user.createdAt = createdAt;
        user.updatedAt = updatedAt;
        return user;
    }

    static ORGANIZATION_TYPE() {
        return 'ORGANIZACAO';
    }

    passwordMatches(password) {
        return compare(password, this.password);
    }
}
