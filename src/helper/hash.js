import bcryptjs from 'bcryptjs';

export function hash(str) {
    const hash = bcryptjs.hashSync(str);
    return hash;
}

export function compare(plain, hahs) {
    const matches = bcryptjs.compareSync(plain, hahs);
    return matches;
}
