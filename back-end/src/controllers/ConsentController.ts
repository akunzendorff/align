import { Response } from 'express';
import { getRepository } from 'typeorm';
import { UserConsent, ConsentType } from '../models/UserConsent';
import { AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';

export class ConsentController {
    private userRepository = getRepository(User);
    private consentRepository = getRepository(UserConsent);

    public recordConsent = async (req: AuthRequest, res: Response) => {
        try {
            const { type, granted, details } = req.body;
            const user = req.user;

            if (!user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            if (!Object.values(ConsentType).includes(type)) {
                return res.status(400).json({ message: 'Tipo de consentimento inválido' });
            }

            const consent = new UserConsent();
            consent.user = user;
            consent.type = type;
            consent.granted = granted;
            consent.version = process.env.CONSENT_VERSION || '1.0';
            consent.details = details;

            await this.consentRepository.save(consent);

            return res.status(200).json({ message: 'Consentimento registrado com sucesso' });
        } catch (error) {
            console.error('Erro ao registrar consentimento:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };

    public revokeConsent = async (req: AuthRequest, res: Response) => {
        try {
            const { type } = req.params;
            const user = req.user;

            if (!user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            if (!Object.values(ConsentType).includes(type as ConsentType)) {
                return res.status(400).json({ message: 'Tipo de consentimento inválido' });
            }

            const consent = new UserConsent();
            consent.user = user;
            consent.type = type as ConsentType;
            consent.granted = false;
            consent.version = process.env.CONSENT_VERSION || '1.0';
            
            await this.consentRepository.save(consent);

            if (type === ConsentType.OPEN_FINANCE) {
            }

            return res.status(200).json({ message: 'Consentimento revogado com sucesso' });
        } catch (error) {
            console.error('Erro ao revogar consentimento:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };

    public deleteUserData = async (req: AuthRequest, res: Response) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            const consent = new UserConsent();
            consent.user = user;
            consent.type = ConsentType.DATA_PROCESSING;
            consent.granted = false;
            consent.version = process.env.CONSENT_VERSION || '1.0';
            consent.details = { reason: 'USER_REQUESTED_DELETION' };
            
            await this.consentRepository.save(consent);

            await this.userRepository.remove(user);

            return res.status(200).json({ message: 'Dados do usuário excluídos com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir dados do usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };
}