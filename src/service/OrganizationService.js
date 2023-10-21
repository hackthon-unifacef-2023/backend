import Address from '../model/Address.js';
import Organization from '../model/Organization.js';
import Unauthorized from '../error/Unauthorized.js';

export default class {
    userDAO = undefined;
    organizationDAO = undefined;

    constructor(userDAO, organizationDAO) {
        this.userDAO = userDAO;
        this.organizationDAO = organizationDAO;
    }

    async approve({ userID, organizationID }) {
        const user = await this.userDAO.find({ id: userID });
        if (!user || !user.isAdmin) {
            throw new Unauthorized('Credênciais inválidas');
        }
        await this.organizationDAO.approve(organizationID);
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

    async list({ userID }) {
        const user = await this.userDAO.find({ id: userID });
        if (!user || !user.isAdmin) {
            throw new Unauthorized('Credênciais inválidas');
        }
        const organizations = await this.organizationDAO.list();
        return organizations;
    }
}
