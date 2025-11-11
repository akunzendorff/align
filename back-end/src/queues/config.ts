import { ConnectionOptions } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

// Centraliza a configuração de conexão com o Redis, utilizando a variável de ambiente REDIS_URL.
export const redisConnection: ConnectionOptions = process.env.REDIS_URL ?
  { url: process.env.REDIS_URL } as any :
  { host: process.env.REDIS_HOST || '127.0.0.1', port: Number(process.env.REDIS_PORT) || 6379 };