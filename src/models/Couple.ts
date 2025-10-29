import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("casais")
export class Couple {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.couples)
    user1: User;

    @ManyToOne(() => User, user => user.couples)
    user2: User;

    @Column({ default: 'pending' })
    status: 'pending' | 'active' | 'inactive';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}