import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { AllocationRule } from '../models/AllocationRule';

export class AllocationController {
    async list(req: Request, res: Response) {
        const repo = getRepository(AllocationRule);
        const coupleId = (req.query.coupleId as string) || (req.body.coupleId as string) || undefined;
        const items = await repo.find({ where: coupleId ? { couple: { id: coupleId } } : {}, relations: ['couple'] } as any);
        return res.json(items);
    }

    async create(req: Request, res: Response) {
        const repo = getRepository(AllocationRule);
        const rule = repo.create(req.body);
        await repo.save(rule);
        return res.status(201).json(rule);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
    const repo = getRepository(AllocationRule);
    const item = await repo.findOneBy({ id } as any);
        if (!item) return res.status(404).json({ message: 'Not found' });
        repo.merge(item, req.body);
        await repo.save(item);
        return res.json(item);
    }

    async remove(req: Request, res: Response) {
        const { id } = req.params;
        const repo = getRepository(AllocationRule);
        await repo.delete(id);
        return res.status(204).send();
    }
}
