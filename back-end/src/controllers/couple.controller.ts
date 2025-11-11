import { Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { Couple } from '../models/Couple';
import { AuthRequest } from '../middleware/auth.middleware';

export class CoupleController {
    async sendInvite(req: AuthRequest, res: Response) {
        try {
            const { partnerEmail } = req.body;
            const userRepository = getRepository(User);
            const coupleRepository = getRepository(Couple);

            if (!req.user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            // Verificar se o parceiro existe
            const partner = await userRepository.findOne({ where: { email: partnerEmail } });
            if (!partner) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Verificar se já existe um convite pendente
            const existingCouple = await coupleRepository.findOne({
                where: [
                    { user1: req.user, user2: partner, status: 'pending' },
                    { user1: partner, user2: req.user, status: 'pending' }
                ]
            });

            if (existingCouple) {
                return res.status(400).json({ message: 'Convite já enviado' });
            }

            // Criar novo convite
            const couple = coupleRepository.create({
                user1: req.user,
                user2: partner,
                status: 'pending'
            });

            await coupleRepository.save(couple);

            return res.status(201).json({ message: 'Convite enviado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async acceptInvite(req: AuthRequest, res: Response) {
        try {
            const { inviteId } = req.body;
            const coupleRepository = getRepository(Couple);

            if (!req.user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            const invite = await coupleRepository.findOne({
                where: { id: inviteId },
                relations: ['user1', 'user2']
            });

            if (!invite) {
                return res.status(404).json({ message: 'Convite não encontrado' });
            }

            if (invite.user2.id !== req.user.id) {
                return res.status(403).json({ message: 'Não autorizado' });
            }

            if (invite.status !== 'pending') {
                return res.status(400).json({ message: 'Convite já processado' });
            }

            invite.status = 'active';
            await coupleRepository.save(invite);

            return res.json({ message: 'Convite aceito com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}