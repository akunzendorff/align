// back-end/src/config/database.ts
import dotenv from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';

// Ensure environment variables are loaded
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// --- DEBUG ---
// Vamos imprimir o valor para ver o que o Node.js está lendo.
console.log(`[DEBUG] Tentando ler DATABASE_URL: ${process.env.DATABASE_URL}`);
// --- FIM DO DEBUG ---

if (!process.env.DATABASE_URL) {
  throw new Error(`A variável de ambiente DATABASE_URL não foi definida. Verifique o arquivo .env no caminho: ${envPath}`);
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false, // Migrations são a abordagem mais segura.
    logging: process.env.NODE_ENV === 'development',
    entities: [__dirname + '/../models/**/*.ts'],
    migrations: [__dirname + '/../database/migrations/**/*.ts'],
});
