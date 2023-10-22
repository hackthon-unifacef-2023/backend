import Top10User from '../dto/Top10User.js';
import User from '../model/User.js';
import { formatDate } from '../helper/date.js';

export default class {
    db = undefined;

    constructor(db) {
        this.db = db;
    }

    async listTop10() {
        const top10Users = [];

        const rows = await this.db.all(
            `
                SELECT
                    u.id,
                    u.name,
                    SUM(e.points) points
                FROM
                    user_events ue
                JOIN
                    events e ON e.id = ue.event_id
                JOIN
                    users u ON u.id = ue.user_id
                WHERE
                    u.is_admin IS FALSE
                GROUP BY
                    u.id,
                    u.name
                ORDER BY
                    SUM(e.points) DESC
                LIMIT 10;
            `,
            []
        );
        for (const row of rows) {
            const top10User = new Top10User();
            top10User.id = row.id;
            top10User.name = row.name;
            top10User.points = row.points;
            top10Users.push(top10User);
        }
        return top10Users;
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
            row.is_admin === 1,
            row.created_at,
            row.updated_at
        );
    }

    async save(user) {
        await this.db.run(
            `
            INSERT INTO users (id, type, name, email, password, is_admin, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                user.id,
                user.type,
                user.name,
                user.email,
                user.password,
                user.isAdmin,
                formatDate(user.createdAt),
                formatDate(user.updatedAt)
            ]
        );
    }
}
