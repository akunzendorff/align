import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Couple } from "./Couple";

@Entity("categorias")
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isDefault: boolean;

    @ManyToOne(() => Couple, { nullable: true })
    couple: Couple;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    icon: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}