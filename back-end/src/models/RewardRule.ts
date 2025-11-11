import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Couple } from "./Couple";

@Entity("regras_recompensa")
export class RewardRule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Couple)
    couple: Couple;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    conditionType: 'savings' | 'goal' | 'custom';

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    threshold: number;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
