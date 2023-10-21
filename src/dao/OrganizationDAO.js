import Address from '../model/Address.js';
import Event from '../model/Event.js';
import Organization from '../model/Organization.js';
import OrganizationDTO from '../dto/Organization.js';
import OrganizationEventDTO from '../dto/OrganizationEvent.js';
import { formatDate } from '../helper/date.js';

export default class {
    db = undefined;

    constructor(db) {
        this.db = db;
    }

    async approve(organizationID) {
        await this.db.run(
            `
                UPDATE
                    organizations
                SET
                    is_active = 1,
                    updated_at = ?
                WHERE
                    id = ?;
            `,
            [formatDate(new Date()), organizationID]
        );
    }

    async save(organization) {
        await this.db.run(
            `
                INSERT INTO organizations (id, user_id, phone, description, is_active, created_at, updated_at)
                VALUES(?, ?, ?, ?, ?, ?, ?);
            `,
            [
                organization.id,
                organization.userID,
                organization.phone,
                organization.description,
                organization.isActive,
                formatDate(organization.createdAt),
                formatDate(organization.updatedAt)
            ]
        );
        for (const address of organization.addresses) {
            await this.db.run(
                `
                    INSERT INTO organization_addresses (id, organization_id, city, state, street, number, zip_code, district, created_at, updated_at)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `,
                [
                    address.id,
                    organization.id,
                    address.city,
                    address.state,
                    address.street,
                    address.number,
                    address.zipCode,
                    address.district,
                    formatDate(address.createdAt),
                    formatDate(address.updatedAt)
                ]
            );
        }
    }

    async find({ id, userID }) {
        let query =
            'SELECT id, user_id, phone, description, is_active, created_at, updated_at FROM organizations WHERE @field = ?;';
        let param = undefined;

        if (id) {
            query = query.replace('@field', 'id');
            param = id;
        }
        if (userID) {
            query = query.replace('@field', 'user_id');
            param = userID;
        }

        const row = await this.db.get(query, param);
        if (!row) {
            return undefined;
        }

        const organization = Organization.enrich(
            row.id,
            row.user_id,
            row.phone,
            row.description,
            row.is_active,
            row.created_at,
            row.updated_at
        );
        const rows = await this.db.all(
            `
                SELECT id, city, state, street, number, zip_code, district, created_at, updated_at FROM organization_addresses
                WHERE organization_id = ?
                LIMIT 1;
            `,
            id
        );
        for (const row of rows) {
            const address = Address.enrich(
                row.id,
                row.city,
                row.state,
                row.street,
                row.number,
                row.zip_code,
                row.district,
                row.created_at,
                row.updated_at
            );
            organization.addAddress(address);
        }
        return organization;
    }

    async list() {
        const organizations = [];
        const types = Event.getTypes();
        const reasons = Event.getReasons();

        const rows = await this.db.all(
            `
                SELECT
                    o.id, u.name, u.email, o.is_active, o.description, o.phone, oa.city, oa.state, oa.street, oa.number, oa.zip_code, oa.district, (
                        SELECT COUNT(1) FROM events e WHERE e.organization_id = o.id
                    ) event_count, o.created_at, o.updated_at
                FROM
                    organizations o
                LEFT JOIN
                    organization_addresses oa ON oa.organization_id = o.id
                JOIN
                    users u ON u.id = o.user_id
                GROUP BY
                    o.id, u.name, u.email, o.is_active, o.description, o.phone, oa.city, oa.state, oa.street, oa.number, oa.zip_code, oa.district, o.created_at, o.updated_at
                ORDER BY
                    o.is_active ASC,
                    o.created_at DESC;
            `
        );
        for (const row of rows) {
            const organization = new OrganizationDTO();
            organization.id = row.id;
            organization.name = row.name;
            organization.email = row.email;
            organization.is_active = row.is_active;
            organization.description = row.description;
            organization.phone = row.phone;
            if (row.city && row.state) {
                organization.has_address = true;
                organization.city = row.city;
                organization.state = row.state;
                organization.street = row.street;
                organization.number = row.number;
                organization.zip_code = row.zip_code;
                organization.district = row.district;
            } else {
                organization.has_address = false;
            }
            organization.event_count = row.event_count;
            organization.created_at = row.created_at;
            organization.updated_at = row.updated_at;

            organization.events = [];

            const rows1 = await this.db.all(
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
                [row.id]
            );
            for (const row1 of rows1) {
                const event = new OrganizationEventDTO();
                event.id = row1.id;
                event.organization_id = row1.organization_id;
                event.name = row1.name;
                event.points = row1.points;
                event.description = row1.description;
                event.type = types[row1.type];
                event.reason = reasons[row1.reason];
                event.pix_code = row1.pix_code;
                event.is_active = row1.is_active;
                event.created_at = row1.created_at;
                event.updated_at = row1.updated_at;
                organization.events.push(event);
            }
            organizations.push(organization);
        }
        return organizations;
    }
}
