import Address from '../model/Address.js';
import Organization from '../model/Organization.js';

export default class {
    organizationDAO = undefined;

    constructor(organizationDAO) {
        this.organizationDAO = organizationDAO;
    }

    async create({ userID, phone, description, hasAddress, city, state, street, number, zipCode, district }) {
        const organization = new Organization(userID, phone, description);
        if (hasAddress) {
            const address = new Address(city, state, street, number, zipCode, district);
            organization.addAddress(address);
        }
        await this.organizationDAO.save(organization);
        return organization;
    }
}
