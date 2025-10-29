import { testApp } from './setup';
import { getRepository } from 'typeorm';
import { User } from '../src/models/User';
import bcrypt from 'bcrypt';

describe('Auth Routes', () => {
    beforeEach(async () => {
        const userRepo = getRepository(User);
        await userRepo.clear();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await testApp
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe('test@example.com');
        });

        it('should not register user with existing email', async () => {
            const userRepo = getRepository(User);
            const hashedPassword = await bcrypt.hash('existing123', 10);
            
            await userRepo.save({
                email: 'existing@example.com',
                password: hashedPassword,
                name: 'Existing User'
            });

            const response = await testApp
                .post('/api/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password123',
                    name: 'Test User'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('já existe');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const userRepo = getRepository(User);
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            await userRepo.save({
                email: 'login@example.com',
                password: hashedPassword,
                name: 'Login User'
            });

            const response = await testApp
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
        });

        it('should not login with incorrect password', async () => {
            const userRepo = getRepository(User);
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            await userRepo.save({
                email: 'login@example.com',
                password: hashedPassword,
                name: 'Login User'
            });

            const response = await testApp
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('inválidos');
        });
    });
});