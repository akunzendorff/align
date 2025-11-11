import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Couple } from '../models/Couple';
import { AuthRequest } from './auth.middleware';

export const tenantAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const resourceId = req.params.id;
        if (!resourceId) {
            return next();
        }

        const resourceType = req.baseUrl.split('/')[1];

        const hasAccess = await checkResourceAccess(user.id, resourceId, resourceType);
        
        if (!hasAccess) {
            return res.status(403).json({ message: 'Acesso não autorizado a este recurso' });
        }

        next();
    } catch (error) {
        console.error('Erro na verificação de tenant:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

async function checkResourceAccess(userId: string, resourceId: string, resourceType: string): Promise<boolean> {
    try {
        const repository = getRepository(resourceType);
        const resource = await repository.findOne({
            where: { id: resourceId },
            relations: ['user', 'couple']
        });

        if (!resource) {
            return false;
        }

        if (resource.user?.id === userId) {
            return true;
        }

        if (resource.couple) {
            const coupleRepository = getRepository(Couple);
            const couple = await coupleRepository.findOne({
                where: [
                    { id: resource.couple.id, user1: { id: userId } },
                    { id: resource.couple.id, user2: { id: userId } }
                ]
            });

            return !!couple;
        }

        return false;
    } catch (error) {
        console.error('Erro ao verificar acesso ao recurso:', error);
        return false;
    }
}

