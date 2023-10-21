import Event from '../model/Event.js';

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

    async list(userID) {
        const events = [];

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
}
