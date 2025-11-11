import { testApp, generateTestToken } from './setup';
import { getRepository } from 'typeorm';
import { User } from '../src/models/User';
import { Goal } from '../src/models/Goal';
import { Category } from '../src/models/Category';
import { Transaction } from '../src/models/Transaction';
import { Couple } from '../src/models/Couple';

describe('Finance Routes', () => {
    let user: User;
    let couple: Couple;
    let token: string;

    beforeEach(async () => {
        // Limpar dados
        await getRepository(Transaction).clear();
        await getRepository(Category).clear();
        await getRepository(Goal).clear();
        await getRepository(Couple).clear();
        await getRepository(User).clear();

        // Criar usuário e casal para testes
        user = await getRepository(User).save({
            email: 'finance@example.com',
            password: 'hashed_password',
            name: 'Finance User'
        });

        couple = await getRepository(Couple).save({
            user1: user,
            status: 'active'
        });

        token = generateTestToken(user.id);
    });

    describe('Categories', () => {
        it('should create a new category', async () => {
            const response = await testApp
                .post('/api/finance/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                        name: 'Test Category',
                        coupleId: couple.id
                    });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Test Category');
        });

        it('should list categories', async () => {
            // Criar algumas categorias primeiro
            await getRepository(Category).save([
                {
                    name: 'Category 1',
                    couple
                },
                {
                    name: 'Category 2',
                    couple
                }
            ]);

            const response = await testApp
                .get('/api/finance/categories')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });
    });

    describe('Goals', () => {
        it('should create a new goal', async () => {
            const response = await testApp
                .post('/api/finance/goals')
                .set('Authorization', `Bearer ${token}`)
                .send({
                        title: 'Test Goal',
                        description: 'Test Description',
                        targetAmount: 10000,
                        currentAmount: 0,
                        deadline: '2026-12-31',
                        coupleId: couple.id
                    });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Goal');
        });

        it('should add progress to a goal', async () => {
            const goal = await getRepository(Goal).save({
                title: 'Update Goal',
                targetAmount: 10000,
                currentAmount: 100, // Começa com um valor inicial
                couple
            });

            const response = await testApp
                .patch(`/api/finance/goals/${goal.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    amount: 500 // Adiciona 500 ao progresso
                });

            expect(response.status).toBe(200);
            // O valor final deve ser o inicial (100) + o adicionado (500)
            expect(response.body.currentAmount).toBe(600);
        });

        it('should return 403 when trying to update a goal from another couple', async () => {
            // Cria um segundo casal e uma meta para ele
            const otherUser = await getRepository(User).save({ email: 'other@test.com', password: '123' });
            const otherCouple = await getRepository(Couple).save({ user1: otherUser });
            const otherGoal = await getRepository(Goal).save({
                title: 'Other Couple Goal',
                targetAmount: 5000,
                currentAmount: 0,
                couple: otherCouple,
            });

            // Tenta atualizar a meta do outro casal com o token do primeiro usuário
            const response = await testApp
                .patch(`/api/finance/goals/${otherGoal.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ amount: 100 });

            // Espera um erro de "Forbidden"
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Você não tem permissão para atualizar esta meta.');
        });
    });

    describe('Transactions', () => {
        let category: Category;

        beforeEach(async () => {
            category = await getRepository(Category).save({
                name: 'Test Category',
                couple
            });
        });

        it('should create a new transaction', async () => {
            const response = await testApp
                .post('/api/finance/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    description: 'Test Transaction',
                    amount: -100,
                    transactionDate: '2025-10-29',
                    type: 'debit',
                    categoryId: category.id,
                    coupleId: couple.id
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.description).toBe('Test Transaction');
        });

        it('should list transactions with filters', async () => {
            await getRepository(Transaction).save([
                {
                    description: 'Transaction 1',
                    amount: -100,
                    transactionDate: new Date('2025-10-29'),
                    type: 'debit',
                    category,
                    bankAccount: null as any
                },
                {
                    description: 'Transaction 2',
                    amount: 500,
                    transactionDate: new Date('2025-10-29'),
                    type: 'credit',
                    category,
                    bankAccount: null as any
                }
            ] as any);

            const response = await testApp
                .get('/api/finance/transactions')
                .set('Authorization', `Bearer ${token}`)
                .query({
                    type: 'EXPENSE'
                });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0].type).toBe('EXPENSE');
        });
    });
});