import 'reflect-metadata'; // Important: doit etre importe une seule fois, au tout debut de votre application
import { DataSource } from 'typeorm';
import { PokemonSpecies } from './entity/PokemonSpecies';
//import { IndividualPokemon } from './entity/IndividualPokemon'; // Importez vos entites
//import { TreatmentLog } from './entity/TreatmentLog'; // Importez vos entites
import path from 'path'; // Necessaire pour gerer les chemins des migrations

// Fonction pour creer un DataSource en utilisant les variables d'environnement
export const AppDataSource = new DataSource({
    type: 'postgres', // Ou 'mysql', 'mssql', etc.
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10), // Assure que le port est un nombre
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false, // JAMAIS TRUE EN PRODUCTION ! Utilisez les migrations
    logging: false, // Activez sur 'true' pour voir les logs SQL en dev
    entities: [
        PokemonSpecies,
        //IndividualPokemon, // Lister toutes vos entites ici
        //TreatmentLog
    ],
    migrations: [
        path.join(__dirname, 'migration/*.ts') // Chemin vers vos fichiers de migration
    ],
    subscribers: [],
});