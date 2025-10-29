import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

export interface AuthRequest extends Request {
    user?: User;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const [, token] = authHeader.split(' ');

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET não está configurado');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

        const userRepository = getRepository(User);
        const user = await userRepository.findOneBy({ id: decoded.id });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};