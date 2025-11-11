import { Response } from 'express';
import { getRepository } from 'typeorm';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth.middleware';

export class TaskController {
    async list(req: AuthRequest, res: Response) {
        const repo = getRepository(Task);
        const coupleId = (req.query.coupleId as string) || (req.body.coupleId as string) || undefined;
        const items = await repo.find({ where: coupleId ? { couple: { id: coupleId } } : {}, relations: ['assignedTo', 'couple'] } as any);
        return res.json(items);
    }

    async create(req: AuthRequest, res: Response) {
        const repo = getRepository(Task);
        const task = repo.create(req.body);
        await repo.save(task);
        return res.status(201).json(task);
    }

    async update(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const repo = getRepository(Task);
        const item = await repo.findOneBy({ id } as any);
        if (!item) return res.status(404).json({ message: 'Not found' });
        repo.merge(item, req.body);
        await repo.save(item);
        return res.json(item);
    }

    async remove(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const repo = getRepository(Task);
        await repo.delete(id);
        return res.status(204).send();
    }

    async assign(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const { assignedToId } = req.body;
        const repo = getRepository(Task);
        const task = await repo.findOneBy({ id } as any);
        if (!task) return res.status(404).json({ message: 'Not found' });
        task.assignedTo = { id: assignedToId } as any;
        await repo.save(task);
        return res.json(task);
    }
}
