import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import financeRoutes from './routes/finance.routes';
import collabRoutes from './routes/collab.routes';
import consentRoutes from './routes/consent.routes';
import { addRepeatableJobs } from './queues';
import './workers/sync.worker';
import './workers/reminder.worker';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api', consentRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log('Conexão com o banco de dados estabelecida');
            if (process.env.REDIS_URL) {
                addRepeatableJobs().catch(err => console.error('Failed to add repeatable jobs', err));
            }
            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Erro ao conectar com o banco de dados:', error);
        });
}