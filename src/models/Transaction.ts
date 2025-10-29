import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { BankAccount } from "./BankAccount";
import { Category } from "./Category";

@Entity("transacoes")
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => BankAccount)
    bankAccount: BankAccount;

    @ManyToOne(() => Category, { nullable: true })
    category: Category;

    @Column({ nullable: true, unique: true })
    externalId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string;

    @Column()
    type: 'credit' | 'debit';

    @CreateDateColumn()
    transactionDate: Date;

    @Column({ nullable: true })
    merchantName: string;

    @CreateDateColumn()
    createdAt: Date;
}