import 'reflect-metadata'; // Important: doit etre importe une seule fois, au tout debut de votre application
import { DataSource } from 'typeorm';
import { PokemonSpecies } from './entity/PokemonSpecies';
import path from 'path';

export const AppDataSource = new DataSource({
    type: 'postgres', // Ou 'mysql', 'mssql', etc.
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false, // JAMAIS TRUE EN PRODUCTION ! Utilisez les migrations
    logging: false,
    entities: [
        PokemonSpecies,

    ],
    migrations: [
        path.join(__dirname, 'migration/*.ts')
    ],
    subscribers: [],
});