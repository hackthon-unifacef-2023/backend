export default class {
    db = undefined;

    constructor(db) {
        this.db = db;
    }

    async save(organization) {
        await this.db.run(
            'INSERT INTO organizations (id, user_id, phone, description, is_active, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?);',
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
                'INSERT INTO organization_addresses (id, organization_id, city, state, street, number, zip_code, district, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
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
}
