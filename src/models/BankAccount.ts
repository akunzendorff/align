import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BankConnection } from "./BankConnection";

@Entity("contas_bancarias")
export class BankAccount {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => BankConnection)
    bankConnection: BankConnection;

    @Column()
    accountNumber: string;

    @Column()
    accountType: string;

    @Column({ nullable: true, unique: true })
    externalAccountId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @Column({ nullable: true })
    currency: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}