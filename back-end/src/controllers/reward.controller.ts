import { Request, Response } from 'express';
import { getRepository, In } from 'typeorm';
import { RewardRule } from '../models/RewardRule';
import { Goal } from '../models/Goal';
import { Transaction } from '../models/Transaction';
import { BankAccount } from '../models/BankAccount';
import { BankConnection } from '../models/BankConnection';
import { Couple } from '../models/Couple';

export class RewardController {
    async list(req: Request, res: Response) {
        const repo = getRepository(RewardRule);
        const coupleId = (req.query.coupleId as string) || (req.body.coupleId as string) || undefined;
        const items = await repo.find({ where: coupleId ? { couple: { id: coupleId } } : {}, relations: ['couple'] } as any);
        return res.json(items);
    }

    async create(req: Request, res: Response) {
        const repo = getRepository(RewardRule);
        const r = repo.create(req.body as any);
        await repo.save(r);
        return res.status(201).json(r);
    }

    /**
     * Evaluate a reward rule.
     * Supported conditionType:
     * - 'savings': compares net savings over the last 30 days (credits - debits) against rule.threshold
     * - 'goal': compares sum of currentAmount of couple's goals against rule.threshold
     */
    async evaluate(req: Request, res: Response) {
        const { id } = req.params;
        const repo = getRepository(RewardRule);
        const rule = await repo.findOneBy({ id } as any);
        if (!rule) return res.status(404).json({ message: 'Regra não encontrada' });

        // load couple users
        const coupleRepo = getRepository(Couple);
        const couple = await coupleRepo.findOne({ where: { id: (rule as any).couple?.id } as any, relations: ['user1', 'user2'] } as any);
        if (!couple) return res.status(404).json({ message: 'Casal não encontrado' });

        if (rule.conditionType === 'savings') {
            const txRepo = getRepository(Transaction);
            const accountRepo = getRepository(BankAccount);

            // find bank accounts for either user in the couple
            const users = [couple.user1?.id, couple.user2?.id].filter(Boolean) as string[];
            // find bank connections for these users
            const connRepo = getRepository(BankConnection);
            const conns = await connRepo.find({ where: { user: In(users as any) } as any });
            const connIds = conns.map(c => (c as any).id).filter(Boolean);

            const accounts = await accountRepo.find({ where: connIds.length ? { bankConnection: In(connIds as any) } : {} as any });
            const accountIds = accounts.map(a => (a as any).id).filter(Boolean);

            const start = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // last 30 days
            const txs = await txRepo.find({ where: accountIds.length ? { bankAccount: In(accountIds as any), transactionDate: (start as any) } as any : {} as any } as any);

            // compute net: credit add, debit subtract
            let net = 0;
            for (const t of txs) {
                if ((t as any).type === 'credit') net += Number((t as any).amount) || 0;
                else net -= Number((t as any).amount) || 0;
            }

            const unlocked = net >= Number(rule.threshold);
            const progress = Math.min(100, (net / Number(rule.threshold)) * 100 || 0);
            return res.json({ id: rule.id, unlocked, progress: Math.max(0, Number(progress)) });
        }

        if (rule.conditionType === 'goal') {
            const goalRepo = getRepository(Goal);
            const goals = await goalRepo.find({ where: { couple: { id: (rule as any).couple?.id } } as any });
            const totalCurrent = goals.reduce((s, g) => s + Number((g as any).currentAmount || 0), 0);
            const unlocked = totalCurrent >= Number(rule.threshold);
            const progress = Math.min(100, (totalCurrent / Number(rule.threshold)) * 100 || 0);
            return res.json({ id: rule.id, unlocked, progress: Math.max(0, Number(progress)) });
        }

        return res.json({ id: rule.id, unlocked: false, progress: 0, note: 'Condition type not supported' });
    }
}
