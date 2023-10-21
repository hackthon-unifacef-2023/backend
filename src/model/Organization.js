import { v4 as uuid } from 'uuid';

export default class {
    id = undefined;
    userID = undefined;
    phone = undefined;
    description = undefined;
    isActive = undefined;
    addresses = undefined;
    createdAt = undefined;
    updatedAt = undefined;

    constructor(userID, phone, description) {
        const now = new Date();

        this.id = uuid();
        this.userID = userID;
        this.phone = phone;
        this.description = description;
        this.isActive = false;
        this.addresses = [];
        this.createdAt = now;
        this.updatedAt = now;
    }

    addAddress(address) {
        this.addresses.push(address);
    }
}
