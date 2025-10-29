import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Couple } from "./Couple";

@Entity("regras_alocacao")
export class AllocationRule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Couple)
    couple: Couple;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    percentage: number; // percentagem (ex: 5.00 == 5%)

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
