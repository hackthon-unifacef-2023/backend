import jsonwebtoken from 'jsonwebtoken';

const SECRET = '🔓';
const EXPIRES_IN = '1h';

export function sign(data) {
    const token = jsonwebtoken.sign(data, SECRET, { expiresIn: EXPIRES_IN });
    return token;
}

export function read(token) {
    try {
        const data = jsonwebtoken.verify(token, SECRET);
        return data;
    } catch {
        return;
    }
}
