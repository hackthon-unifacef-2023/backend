import User from '../model/User.js';

export default class {
    db = undefined;

    constructor(db) {
        this.db = db;
    }

    async find({ id, email }) {
        let query =
            'SELECT id, type, name, email, password, is_admin, created_at, updated_at FROM users WHERE @field = ?;';
        let param = undefined;

        if (id) {
            query = query.replace('@field', 'id');
            param = id;
        }
        if (email) {
            query = query.replace('@field', 'email');
            param = email;
        }

        const row = await this.db.get(query, param);
        if (!row) {
            return undefined;
        }
        return User.enrich(
            row.id,
            row.type,
            row.name,
            row.email,
            row.password,
            row.is_admin,
            row.created_at,
            row.updated_at
        );
    }

    async save(user) {
        await this.db.run(
            'INSERT INTO users (id, type, name, email, password, is_admin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [user.id, user.type, user.name, user.email, user.password, user.isAdmin, user.createdAt, user.updatedAt]
        );
    }
}
