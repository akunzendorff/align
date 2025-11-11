import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("consentimentos")
export class Consent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    user: User;

    @Column()
    type: 'open_finance' | 'lgpd';

    @Column()
    status: boolean;

    @Column({ type: 'json', nullable: true })
    details: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}