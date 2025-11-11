import { Connection } from 'typeorm';
import { User } from '../../models/User';
import { Category } from '../../models/Category';
import { Goal } from '../../models/Goal';
import { Task } from '../../models/Task';
import { Couple } from '../../models/Couple';
import { BankAccount } from '../../models/BankAccount';
import { Transaction } from '../../models/Transaction';
import bcrypt from 'bcrypt';

export async function runInitialSeed(connection: Connection) {
    const userRepo = connection.getRepository(User);
    const coupleRepo = connection.getRepository(Couple);
    const categoryRepo = connection.getRepository(Category);
    const goalRepo = connection.getRepository(Goal);
    const taskRepo = connection.getRepository(Task);
    const accountRepo = connection.getRepository(BankAccount);
    const txRepo = connection.getRepository(Transaction);

    const hashPassword = await bcrypt.hash('123456', 10);

    const user1 = await userRepo.save(userRepo.create({
        email: 'user1@example.com',
        password: hashPassword,
        name: 'Usuário 1',
        emailVerified: true
    }));

    const user2 = await userRepo.save(userRepo.create({
        email: 'user2@example.com',
        password: hashPassword,
        name: 'Usuário 2',
        emailVerified: true
    }));

    const couple = await coupleRepo.save(coupleRepo.create({
        user1,
        user2,
        status: 'active'
    }));

    const categories = await categoryRepo.save([
        categoryRepo.create({ name: 'Moradia', couple }),
        categoryRepo.create({ name: 'Alimentação', couple }),
        categoryRepo.create({ name: 'Transporte', couple }),
        categoryRepo.create({ name: 'Salário', couple })
    ]);

    await goalRepo.save(goalRepo.create({
        title: 'Comprar Casa',
        description: 'Meta para compra da casa própria',
        targetAmount: 300000,
        currentAmount: 50000,
        deadline: new Date('2026-12-31'),
        couple
    }));

    await taskRepo.save([
        taskRepo.create({
            title: 'Pesquisar investimentos',
            description: 'Pesquisar melhores opções de investimento para a meta da casa',
            dueDate: new Date('2025-12-31'),
            completed: false,
            couple,
            assignedTo: user1
        }),
        taskRepo.create({
            title: 'Organizar orçamento mensal',
            description: 'Definir limites de gastos por categoria',
            dueDate: new Date('2025-11-30'),
            completed: false,
            couple,
            assignedTo: user2
        })
    ]);

    const account = await accountRepo.save(accountRepo.create({
        bankConnection: null as any,
        accountNumber: '00012345',
        accountType: 'checking',
        externalAccountId: null,
        balance: 10000,
        currency: 'BRL'
    }));

    await txRepo.save([
        txRepo.create({
            description: 'Aluguel',
            amount: -2000,
            transactionDate: new Date('2025-10-01'),
            type: 'debit',
            category: categories[0],
            bankAccount: account
        }),
        txRepo.create({
            description: 'Salário',
            amount: 5000,
            transactionDate: new Date('2025-10-05'),
            type: 'credit',
            category: categories[3],
            bankAccount: account
        })
    ]);
}

export default runInitialSeed;
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../models/User';
import { Category } from '../../models/Category';
import { Goal } from '../../models/Goal';
import { Task } from '../../models/Task';
import { Couple } from '../../models/Couple';
import { BankAccount } from '../../models/BankAccount';
import { Transaction } from '../../models/Transaction';
import bcrypt from 'bcrypt';

export default class CreateInitialData implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        // Criar usuários
        const hashPassword = await bcrypt.hash('123456', 10);
        
        const user1 = await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                email: 'user1@example.com',
                password: hashPassword,
                name: 'Usuário 1',
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .execute();

        const user2 = await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                email: 'user2@example.com',
                password: hashPassword,
                name: 'Usuário 2',
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .execute();

        // Criar casal
        const couple = await connection
            .createQueryBuilder()
            .insert()
            .into(Couple)
            .values({
                user1: { id: user1.identifiers[0].id },
                user2: { id: user2.identifiers[0].id },
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .execute();

        // Criar categorias padrão
        const categories = await connection
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values([
                {
                    name: 'Moradia',
                    type: 'EXPENSE',
                    couple: { id: couple.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'Alimentação',
                    type: 'EXPENSE',
                    couple: { id: couple.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'Transporte',
                    type: 'EXPENSE',
                    couple: { id: couple.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'Salário',
                    type: 'INCOME',
                    couple: { id: couple.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
            .execute();

        // Criar meta financeira
        await connection
            .createQueryBuilder()
            .insert()
            .into(Goal)
            .values({
                title: 'Comprar Casa',
                description: 'Meta para compra da casa própria',
                targetAmount: 300000,
                currentAmount: 50000,
                deadline: new Date('2026-12-31'),
                couple: { id: couple.identifiers[0].id },
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .execute();

        // Criar tarefas
        await connection
            .createQueryBuilder()
            .insert()
            .into(Task)
            .values([
                {
                    title: 'Pesquisar investimentos',
                    description: 'Pesquisar melhores opções de investimento para a meta da casa',
                    dueDate: new Date('2025-12-31'),
                    completed: false,
                    couple: { id: couple.identifiers[0].id },
                    assignedTo: { id: user1.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: 'Organizar orçamento mensal',
                    description: 'Definir limites de gastos por categoria',
                    dueDate: new Date('2025-11-30'),
                    completed: false,
                    couple: { id: couple.identifiers[0].id },
                    assignedTo: { id: user2.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
            .execute();

        // Criar conta bancária
        const account = await connection
            .createQueryBuilder()
            .insert()
            .into(BankAccount)
            .values({
                name: 'Conta Conjunta',
                balance: 10000,
                type: 'CHECKING',
                couple: { id: couple.identifiers[0].id },
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .execute();

        // Criar transações
        await connection
            .createQueryBuilder()
            .insert()
            .into(Transaction)
            .values([
                {
                    description: 'Aluguel',
                    amount: -2000,
                    date: new Date('2025-10-01'),
                    type: 'EXPENSE',
                    category: { id: categories.identifiers[0].id },
                    account: { id: account.identifiers[0].id },
                    couple: { id: couple.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    description: 'Salário',
                    amount: 5000,
                    date: new Date('2025-10-05'),
                    type: 'INCOME',
                    category: { id: categories.identifiers[3].id },
                    account: { id: account.identifiers[0].id },
                    couple: { id: couple.identifiers[0].id },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
            .execute();
    }
}