import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Couple } from "../models/Couple";
import { Consent } from "../models/Consent";
import { BankConnection } from "../models/BankConnection";
import { BankAccount } from "../models/BankAccount";
import { Transaction } from "../models/Transaction";
import { Category } from "../models/Category";
import { Goal } from "../models/Goal";
import { Task } from "../models/Task";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.SUPABASE_DB_HOST,
    port: Number(process.env.SUPABASE_DB_PORT) || 5432,
    username: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_DATABASE,
    ssl: true, // Necessário para conexão com Supabase
    extra: {
        ssl: {
            rejectUnauthorized: false // Necessário para conexão SSL com Supabase
        }
    },
    synchronize: false, // Desativado em produção
    logging: process.env.NODE_ENV === "development",
    entities: [
        User,
        Couple,
        Consent,
        BankConnection,
        BankAccount,
        Transaction,
        Category,
        Goal,
        Task
    ],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});