import { testApp, generateTestToken } from './setup';
import { getRepository } from 'typeorm';
import { User } from '../src/models/User';
import { Task } from '../src/models/Task';
import { Couple } from '../src/models/Couple';
import { RewardRule } from '../src/models/RewardRule';

describe('Collaboration Routes', () => {
    let user1: User;
    let user2: User;
    let couple: Couple;
    let token: string;

    beforeEach(async () => {
    // Limpar dados
    await getRepository(Task).clear();
    await getRepository(RewardRule).clear();
    await getRepository(Couple).clear();
    await getRepository(User).clear();

        // Criar usuários e casal para testes
        user1 = await getRepository(User).save({
            email: 'user1@example.com',
            password: 'hashed_password',
            name: 'User 1'
        });

        user2 = await getRepository(User).save({
            email: 'user2@example.com',
            password: 'hashed_password',
            name: 'User 2'
        });

        couple = await getRepository(Couple).save({
            user1,
            user2,
            status: 'active'
        });

        token = generateTestToken(user1.id);
    });

    describe('Tasks', () => {
        it('should create a new task', async () => {
            const response = await testApp
                .post('/api/collab/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Task',
                    description: 'Test Description',
                    dueDate: '2025-12-31',
                    assignedToId: user2.id,
                    coupleId: couple.id
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Task');
            expect(response.body.assignedTo.id).toBe(user2.id);
        });

        it('should list tasks', async () => {
            await getRepository(Task).save([
                {
                    title: 'Task 1',
                    description: 'Description 1',
                    dueDate: new Date('2025-12-31'),
                    couple,
                    assignedTo: user1
                },
                {
                    title: 'Task 2',
                    description: 'Description 2',
                    dueDate: new Date('2025-12-31'),
                    couple,
                    assignedTo: user2
                }
            ]);

            const response = await testApp
                .get('/api/collab/tasks')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should update task status', async () => {
            const task = await getRepository(Task).save({
                title: 'Update Task',
                description: 'Test Description',
                dueDate: new Date('2025-12-31'),
                couple,
                assignedTo: user1
            });

            const response = await testApp
                .patch(`/api/collab/tasks/${task.id}/complete`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.completed).toBe(true);
        });
    });

    describe('Rewards', () => {
        it('should create a new reward', async () => {
            const response = await testApp
                .post('/api/collab/rewards')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Reward',
                    description: 'Test Description',
                    points: 100,
                    type: 'savings',
                    criteria: {
                        targetAmount: 1000,
                        timeframe: 30
                    },
                    coupleId: couple.id
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Reward');
        });

        it('should list rewards', async () => {
            await getRepository(RewardRule).save([
                    {
                        title: 'Reward 1',
                        description: 'Description 1',
                        conditionType: 'savings',
                        threshold: 1000,
                        couple
                    },
                    {
                        title: 'Reward 2',
                        description: 'Description 2',
                        conditionType: 'goal',
                        threshold: 50,
                        couple
                    }
                ] as any);

            const response = await testApp
                .get('/api/collab/rewards')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should evaluate reward progress', async () => {
            const reward = await getRepository(RewardRule).save({
                title: 'Savings Reward',
                description: 'Save money reward',
                conditionType: 'savings',
                threshold: 1000,
                couple
            } as any);

            const response = await testApp
                .get(`/api/collab/rewards/${reward.id}/progress`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('progress');
            expect(response.body).toHaveProperty('completed');
        });
    });
});