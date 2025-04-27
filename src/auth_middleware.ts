import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './utils/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        (req as any).user = payload;
        next();
    } catch {
        res.status(403).json({ error: 'Invalid token' });
    }
}
