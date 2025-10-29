import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Goal } from '../models/Goal';

export class GoalController {
    async create(req: Request, res: Response) {
        const repo = getRepository(Goal);
        const goal = repo.create(req.body);
        await repo.save(goal);
        return res.status(201).json(goal);
    }

    async list(req: Request, res: Response) {
        const repo = getRepository(Goal);
        const coupleId = (req.query.coupleId as string) || (req.body.coupleId as string) || undefined;
        const items = await repo.find({ where: coupleId ? { couple: { id: coupleId } } : {}, relations: ['couple'] } as any);
        return res.json(items);
    }

    async progress(req: Request, res: Response) {
        const { id } = req.params;
        const goalRepo = getRepository(Goal);
    const goal = await goalRepo.findOneBy({ id } as any);
        if (!goal) return res.status(404).json({ message: 'Meta não encontrada' });

        // Exemplo simples: soma transações com categoria vinculada às metas (requer integração com categoria/meta mapping)
        const total = Number(goal.currentAmount || 0);

        const progress = Math.min(100, (total / Number(goal.targetAmount)) * 100);
        return res.json({ target: goal.targetAmount, current: total, progress });
    }
}
