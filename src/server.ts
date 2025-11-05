import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database'; // Mantém a importação do AppDataSource no topo
import { addRepeatableJobs } from './queues';
import './workers/sync.worker';
import './workers/reminder.worker';

dotenv.config();

export const app = express();

const main = async () => {
    // 1. Configura os middlewares do Express (independentes do DB)
    app.use(cors());
    app.use(express.json());

    // 2. Inicializa a conexão com o banco de dados (exceto em ambiente de teste)
    if (process.env.NODE_ENV !== 'test') {
        try {
            await AppDataSource.initialize();
            console.log('Conexão com o banco de dados estabelecida');

            // 3. Configura as rotas da aplicação APÓS a conexão com o DB
            // Importar as rotas aqui para garantir que os controladores sejam instanciados após o DB estar pronto
            // Usamos 'require' para carregamento síncrono e acesso ao default export
            const authRoutes = require('./routes/auth.routes').default;
            const financeRoutes = require('./routes/finance.routes').default;
            const collabRoutes = require('./routes/collab.routes').default;
            const consentRoutes = require('./routes/consent.routes').default;

            app.use('/api/auth', authRoutes);
            app.use('/api/finance', financeRoutes);
            app.use('/api/collab', collabRoutes);
            app.use('/api', consentRoutes);

            // 4. Adiciona jobs repetitivos (se REDIS_URL estiver configurado)
            if (process.env.REDIS_URL) {
                addRepeatableJobs().catch(err => console.error('Failed to add repeatable jobs', err));
            }

            // 5. Inicia o servidor
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
            });

        } catch (error) {
            console.error('Erro ao conectar com o banco de dados:', error);
            process.exit(1); // Encerra a aplicação se a conexão falhar
        }
    } else {
        console.log('Ambiente de teste detectado. Servidor não iniciado automaticamente.');
    }
};

main();