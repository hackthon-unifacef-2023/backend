import { v4 as uuid } from 'uuid';

export default class {
    id = undefined;
    city = undefined;
    state = undefined;
    street = undefined;
    number = undefined;
    zipCode = undefined;
    district = undefined;
    createdAt = undefined;
    updatedAt = undefined;

    constructor(city, state, street, number, zipCode, district) {
        const now = new Date();

        this.id = uuid();
        this.city = city;
        this.state = state;
        this.street = street;
        this.number = number;
        this.zipCode = zipCode;
        this.district = district;
        this.createdAt = now;
        this.updatedAt = now;
    }

    static enrich(id, city, state, street, number, zipCode, district, createdAt, updatedAt) {
        const address = Object.create(this.prototype);
        this.id = id;
        this.city = city;
        this.state = state;
        this.street = street;
        this.number = number;
        this.zipCode = zipCode;
        this.district = district;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        return address;
    }
}
