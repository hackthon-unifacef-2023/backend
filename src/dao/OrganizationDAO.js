import Address from '../model/Address.js';
import Organization from '../model/Organization.js';

export default class {
    db = undefined;

    constructor(db) {
        this.db = db;
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
                organization.createdAt,
                organization.updatedAt
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
                    address.createdAt,
                    address.updatedAt
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
}
