import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1635500000000 implements MigrationInterface {
    name = 'CreateInitialTables1635500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Usuarios
        await queryRunner.query(`
            CREATE TABLE "usuarios" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL,
                "name" varchar,
                "emailVerified" boolean DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Casais
        await queryRunner.query(`
            CREATE TABLE "casais" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "user1Id" uuid REFERENCES "usuarios"(id),
                "user2Id" uuid REFERENCES "usuarios"(id),
                "status" varchar NOT NULL DEFAULT 'pending',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Consentimentos
        await queryRunner.query(`
            CREATE TABLE "consentimentos" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "userId" uuid REFERENCES "usuarios"(id),
                "type" varchar NOT NULL,
                "status" boolean NOT NULL,
                "details" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Conexoes Bancarias
        await queryRunner.query(`
            CREATE TABLE "conexoes_bancarias" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "userId" uuid REFERENCES "usuarios"(id),
                "bankName" varchar NOT NULL,
                "accessToken" text,
                "refreshToken" text,
                "tokenExpiresAt" TIMESTAMP,
                "active" boolean DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Contas Bancarias
        await queryRunner.query(`
            CREATE TABLE "contas_bancarias" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "bankConnectionId" uuid REFERENCES "conexoes_bancarias"(id),
                "accountNumber" varchar NOT NULL,
                "accountType" varchar NOT NULL,
                "balance" decimal(10,2) DEFAULT 0,
                "currency" varchar,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Categorias
        await queryRunner.query(`
            CREATE TABLE "categorias" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "description" varchar,
                "isDefault" boolean DEFAULT false,
                "coupleId" uuid REFERENCES "casais"(id),
                "color" varchar,
                "icon" varchar,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Transacoes
        await queryRunner.query(`
            CREATE TABLE "transacoes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "bankAccountId" uuid REFERENCES "contas_bancarias"(id),
                "categoryId" uuid REFERENCES "categorias"(id),
                "amount" decimal(10,2) NOT NULL,
                "description" varchar NOT NULL,
                "type" varchar NOT NULL,
                "transactionDate" TIMESTAMP NOT NULL,
                "merchantName" varchar,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Metas
        await queryRunner.query(`
            CREATE TABLE "metas" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "coupleId" uuid REFERENCES "casais"(id),
                "title" varchar NOT NULL,
                "description" varchar,
                "targetAmount" decimal(10,2) NOT NULL,
                "currentAmount" decimal(10,2) DEFAULT 0,
                "deadline" TIMESTAMP NOT NULL,
                "status" varchar DEFAULT 'in_progress',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Tarefas
        await queryRunner.query(`
            CREATE TABLE "tarefas" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "coupleId" uuid REFERENCES "casais"(id),
                "title" varchar NOT NULL,
                "description" varchar,
                "completed" boolean DEFAULT false,
                "assignedToId" uuid REFERENCES "usuarios"(id),
                "dueDate" TIMESTAMP,
                "priority" varchar DEFAULT 'normal',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tarefas"`);
        await queryRunner.query(`DROP TABLE "metas"`);
        await queryRunner.query(`DROP TABLE "transacoes"`);
        await queryRunner.query(`DROP TABLE "categorias"`);
        await queryRunner.query(`DROP TABLE "contas_bancarias"`);
        await queryRunner.query(`DROP TABLE "conexoes_bancarias"`);
        await queryRunner.query(`DROP TABLE "consentimentos"`);
        await queryRunner.query(`DROP TABLE "casais"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }
}