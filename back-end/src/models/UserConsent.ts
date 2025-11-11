import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

export enum ConsentType {
    DATA_PROCESSING = "DATA_PROCESSING",
    OPEN_FINANCE = "OPEN_FINANCE",
    MARKETING = "MARKETING"
}

@Entity("user_consents")
export class UserConsent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user: User;

    @Column({
        type: "enum",
        enum: ConsentType
    })
    type: ConsentType;

    @Column()
    version: string;

    @Column()
    granted: boolean;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: "jsonb", nullable: true })
    details: Record<string, any>;
}