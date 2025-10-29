import { Response } from 'express';
import { getRepository } from 'typeorm';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/auth.middleware';

export class CategoryController {
    async list(req: AuthRequest, res: Response) {
        const repo = getRepository(Category);
        const coupleId = (req.query.coupleId as string) || (req.body.coupleId as string) || undefined;
        const categories = await repo.find({ where: coupleId ? { couple: { id: coupleId } } : {}, relations: ['couple'] } as any);
        return res.json(categories);
    }

    async create(req: AuthRequest, res: Response) {
        try {
            const { name, description, color, icon } = req.body;
            const coupleId = req.body.coupleId;
            const repo = getRepository(Category);
            const category = repo.create({ name, description, color, icon, couple: { id: coupleId } as any });
            await repo.save(category);
            return res.status(201).json(category);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    async update(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const repo = getRepository(Category);
        const cat = await repo.findOneBy({ id } as any);
        if (!cat) return res.status(404).json({ message: 'Não encontrado' });
        repo.merge(cat, req.body as any);
        await repo.save(cat);
        return res.json(cat);
    }

    async remove(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const repo = getRepository(Category);
        await repo.delete(id);
        return res.status(204).send();
    }
}
