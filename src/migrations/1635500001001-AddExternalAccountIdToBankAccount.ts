import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExternalAccountIdToBankAccount1635500001001 implements MigrationInterface {
    name = 'AddExternalAccountIdToBankAccount1635500001001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contas_bancarias" ADD COLUMN "externalAccountId" varchar`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_contas_externalAccountId" ON "contas_bancarias" ("externalAccountId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_contas_externalAccountId"`);
        await queryRunner.query(`ALTER TABLE "contas_bancarias" DROP COLUMN "externalAccountId"`);
    }
}
