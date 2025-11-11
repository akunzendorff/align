import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("conexoes_bancarias")
export class BankConnection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    user: User;

    @Column()
    bankName: string;

    @Column({ type: 'text', nullable: true })
    accessToken: string;

    @Column({ type: 'text', nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    tokenExpiresAt: Date;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}