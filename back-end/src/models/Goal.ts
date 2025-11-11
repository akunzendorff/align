import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Couple } from "./Couple";

@Entity("metas")
export class Goal {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Couple)
    couple: Couple;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    targetAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    currentAmount: number;

    @Column()
    deadline: Date;

    @Column({ default: 'in_progress' })
    status: 'in_progress' | 'completed' | 'cancelled';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}