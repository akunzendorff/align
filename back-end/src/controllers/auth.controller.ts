import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            const userRepository = getRepository(User);
            
            // Verificar se usuário já existe
            const userExists = await userRepository.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Criar novo usuário
            const user = userRepository.create({
                email,
                password: hashedPassword,
                name
            });

            await userRepository.save(user);

            return res.status(201).json({ message: 'Usuário criado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET não está configurado');
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}