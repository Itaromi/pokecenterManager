import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized' });
        return; // <-- TRÈS IMPORTANT : return ici sans rien renvoyer
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded; // cast rapide ou tu peux créer un type plus propre
        next(); // on continue vers la route suivante
    } catch (error) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};
