import bcryptjs from 'bcryptjs';

export function hash(str) {
    const hash = bcryptjs.hashSync(str);
    return hash;
}

export function compare(plain, hash) {
    const matches = bcryptjs.compareSync(plain, hash);
    return matches;
}
