import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Couple } from "./Couple";
import { User } from "./User";

@Entity("tarefas")
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Couple)
    couple: Couple;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(() => User, { nullable: true })
    assignedTo: User;

    @Column({ nullable: true })
    dueDate: Date;

    @Column({ default: 'normal' })
    priority: 'low' | 'normal' | 'high';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}