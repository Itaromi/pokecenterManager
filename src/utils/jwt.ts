import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'super_secret';

export function generateToken(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET);
}
