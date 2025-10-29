import { Connection, createConnection } from 'typeorm';
import supertest from 'supertest';
import { app } from '../src/server';
import jwt from 'jsonwebtoken';

export const testApp = supertest(app);
let connection: Connection;

beforeAll(async () => {
    // Criar conexão com banco de testes
    connection = await createConnection({
        type: 'postgres',
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT || '5432'),
        username: process.env.TEST_DB_USER || 'test',
        password: process.env.TEST_DB_PASS || 'test',
        database: process.env.TEST_DB_NAME || 'align_test',
        entities: ['src/models/**/*.ts'],
        synchronize: true,
        dropSchema: true
    });

    // Executar seeds
    await connection.runMigrations();
});

afterAll(async () => {
    if (connection) {
        await connection.close();
    }
});

export const generateTestToken = (userId: string) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
    );
};