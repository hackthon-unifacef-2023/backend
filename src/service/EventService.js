import BadRequest from '../error/BadRequest.js';
import Event from '../model/Event.js';

export default class {
    eventDAO = undefined;
    organizationDAO = undefined;
    userDAO = undefined;

    constructor(eventDAO, organizationDAO, userDAO) {
        this.eventDAO = eventDAO;
        this.organizationDAO = organizationDAO;
        this.userDAO = userDAO;
    }

    async approve({ userID, eventID }) {
        const user = await this.userDAO.find({ id: userID });
        if (!user || !user.isAdmin) {
            throw new Unauthorized('Credênciais inválidas');
        }
        await this.eventDAO.approve(eventID);
    }

    async create({ userID, name, description, type, reason, pixCode }) {
        const organization = await this.organizationDAO.find({ userID: userID });
        if (!organization) {
            throw new BadRequest('A organização não existe');
        }
        const event = new Event(organization.id, name, description, type, reason, pixCode);

        await this.eventDAO.save(event);
        return event;
    }

    async listPublicEvents() {
        const events = await this.eventDAO.listPublicEvents();
        return events;
    }

    async listOrganizationEvents({ userID }) {
        const organization = await this.organizationDAO.find({ userID: userID });
        if (!organization) {
            throw new BadRequest('A organização não existe');
        }

        const events = await this.eventDAO.listOrganizationEvents(organization.id);
        return events;
    }
}
