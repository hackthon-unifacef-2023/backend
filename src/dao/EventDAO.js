import Event from '../model/Event.js';
import OrganizationEvent from '../dto/OrganizationEvent.js';

export default class {
    db = undefined;

    constructor(db) {
        this.db = db;
    }

    async save(event) {
        await this.db.run(
            `
                INSERT INTO events (id, organization_id, name, points, description, "type", reason, pix_code, is_active, created_at, updated_at)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                event.id,
                event.organizationID,
                event.name,
                event.points,
                event.description,
                event.type,
                event.reason,
                event.pixCode,
                event.isActive,
                event.createdAt,
                event.updatedAt
            ]
        );
    }

    async listPublicEvents() {
        const events = [];

        const rows = await this.db.all(
            `
                SELECT
                    e.id,
                    e.organization_id,
                    e.name,
                    e.points,
                    e.description,
                    e.type,
                    e.reason,
                    e.pix_code,
                    e.is_active,
                    u.name,
                    oa.city,
                    oa.state,
                    e.created_at,
                    e.updated_at
                FROM
                    events e
                JOIN
                    organizations o ON o.id = e.organization_id AND o.is_active IS TRUE
                JOIN
                    organization_addresses oa ON oa.organization_id = o.id
                JOIN
                    users u ON u.id = o.user_id 
                WHERE
                    e.is_active IS TRUE
                    AND e.organization_id = ?
                ORDER BY
                    e.created_at DESC;
            `,
            [userID]
        );
        for (const row of rows) {
            const event = Event.enrich(
                row.id,
                row.organization_id,
                row.name,
                row.points,
                row.description,
                row.type,
                row.reason,
                row.pix_code,
                row.is_active,
                row.created_at,
                row.updated_at
            );
            events.push(event);
        }
        return events;
    }

    async listOrganizationEvents(userID) {
        const events = [];
        const types = Event.getTypes();
        const reasons = Event.getReasons();

        const rows = await this.db.all(
            `
                SELECT
                    id, organization_id, name, points, description, type, reason, pix_code, is_active, created_at, updated_at
                FROM
                    events
                WHERE
                    organization_id = ?
                ORDER BY
                    created_at DESC;
            `,
            [userID]
        );
        for (const row of rows) {
            const event = new OrganizationEvent();
            event.id = row.id;
            event.organization_id = row.organization_id;
            event.name = row.name;
            event.points = row.points;
            event.description = row.description;
            event.type = types[row.type];
            event.reason = reasons[row.reason];
            event.pix_code = row.pix_code;
            event.is_active = row.is_active;
            event.created_at = row.created_at;
            event.updated_at = row.updated_at;
            events.push(event);
        }
        return events;
    }
}
