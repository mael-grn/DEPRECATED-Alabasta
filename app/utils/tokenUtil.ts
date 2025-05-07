import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export function createJwt(payload: object): string {
    return jwt.sign(payload, SECRET, { expiresIn: '1y' });
}

export function verifyJwt<T>(token: string): T | null {
    try {
        return jwt.verify(token, SECRET) as T;
    } catch (e) {
        console.error(e);
        return null; // Token expiré ou invalide
    }
}