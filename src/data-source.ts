// src/data-source.ts (ou l'emplacement de votre fichier DataSource)

import 'reflect-metadata'; // Important : doit être importé une seule fois, au tout debut de votre application
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';

// --- Importez vos entités pour toutes les bases de données ici ---
// Assurez-vous que les chemins d'importation sont corrects
import { PokemonAccount } from "./entity/PokemonAccount";
import { PokemonPatient } from "./entity/PokemonPatient";
import { PokemonSpecies } from "./entity/PokemonSpecies";
import { Soin } from "./entity/Soin";
import { TypeSoin } from "./entity/TypeSoin";


// --- Fonction utilitaire pour lire une variable d'environnement ---
// Cette fonction est robuste pour s'assurer que les variables nécessaires existent.
const getRequiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        // Loggez une erreur claire si la variable est manquante
        console.error(`FATAL ERROR: Required environment variable "${key}" is not defined.`);
        // En environnement non critique (comme le développement), vous pourriez vouloir juste logger et retourner undefined.
        // En production, il est crucial de quitter le processus car la DB ne pourra pas se connecter.
        process.exit(1); // Quitte le processus avec un code d'erreur
    }
    return value;
};

// Fonction utilitaire pour lire un port comme nombre
const getPortEnv = (key: string): number => {
    const value = getRequiredEnv(key);
    const port = parseInt(value, 10);
    if (isNaN(port)) {
        console.error(`FATAL ERROR: Environment variable "${key}" is not a valid number.`);
        process.exit(1);
    }
    return port;
};


// --- Définition des options pour la base de données 'central' ---
const centralConfig: DataSourceOptions = {
    name: "central", // Nom optionnel si vous avez besoin de référer à cette source de données par son nom dans votre code
    type: 'postgres', // <-- Assurez-vous que cela correspond à votre SGBD (postgres, mysql, etc.)
    host: getRequiredEnv("DATABASE_HOST"), // Utilise le host défini (ex: 'db' dans docker-compose)
    port: getPortEnv("DATABASE_PORT"), // Utilise le port (ex: 5432)
    username: getRequiredEnv("DATABASE_USER"), // Utilise l'utilisateur
    password: getRequiredEnv("DATABASE_PASSWORD"), // Utilise le mot de passe
    database: getRequiredEnv("DATABASE_NAME"), // Utilise le nom de la base de données principale

    synchronize: false, // *** TRÈS IMPORTANT : Toujours false en production. Utilisez les migrations ! ***
    migrationsRun: false, // N'exécute pas les migrations automatiquement au démarrage de l'application

    logging: process.env.NODE_ENV === 'development', // Optionnel : activer les logs SQL en dev
    // logger: "file", // Optionnel : si vous voulez logguer dans un fichier spécifique

    entities: [
        PokemonAccount, // <-- SEULEMENT l'entité(s) pour la base centrale
        // IMPORTANT: Si vous compilez du TypeScript en JavaScript, les chemins dans 'entities'
        // doivent pointer vers les fichiers .js compilés !
        // Exemple : path.join(__dirname, 'entity', '*.js') ou 'dist/entity/PokemonAccount.js'
    ],

    migrations: [
        // Chemin vers vos fichiers de migration pour la base centrale.
        // IMPORTANT: Le chemin doit pointer vers les fichiers .js compilés si vous utilisez TypeScript !
        path.join(__dirname, 'migration', 'central', '*.js')
        // Exemple : 'dist/migration/central/*.js' si votre répertoire de build est 'dist'
    ],

    subscribers: [
        // Ajoutez vos subscribers ici si vous en utilisez
        // IMPORTANT: Comme pour entities/migrations, pointez vers les fichiers .js compilés.
    ],

    // Note sur la section CLI de ormconfig.js :
    // Avec l'approche DataSource, la plupart des configurations CLI (comme migrationsDir)
    // sont soit déduites du chemin fourni à --dataSource, soit spécifiées directement dans la commande CLI.
    // La section 'cli' de l'ancien ormconfig.js n'a plus lieu d'être ici.
};

// --- Définition des options pour le template des bases par account ---
// Cette configuration sert de modèle pour créer et se connecter aux bases de données spécifiques à chaque compte.
// Elle n'est généralement PAS utilisée directement par les outils CLI de migration pour la base 'central'.
const accountTemplateConfig: DataSourceOptions = {
    name: "account_template", // Nom pour référer à ce modèle en code
    type: 'postgres', // Doit être le même SGBD que la base principale
    host: getRequiredEnv("DATABASE_HOST"), // Se connecte au même serveur de base de données
    port: getPortEnv("DATABASE_PORT"),
    username: getRequiredEnv("DATABASE_USER"),
    password: getRequiredEnv("DATABASE_PASSWORD"),
    // !!! IMPORTANT : PAS DE CHAMP 'database' ICI !!!
    // Le nom de la base de données spécifique à l'account sera fourni dynamiquement lors de la création
    // de l'instance de DataSource en code (par exemple, dans votre logique d'authentification ou de service).

    synchronize: false, // Toujours false pour la sécurité.
    // Note : Vous pourriez utiliser synchronize ou runMigrations PROGRAMMATIQUEMENT
    // lors de la création initiale de chaque nouvelle base de données d'account, mais attention.

    logging: false, // Optionnel : moins de logs pour ces connexions dynamiques

    entities: [
        // <-- Liste de TOUTES les entités qui iront dans les bases de données par account
        PokemonPatient,
        PokemonSpecies,
        Soin,
        TypeSoin,
        // IMPORTANT: Pointez vers les fichiers .js compilés si vous utilisez TypeScript !
        // Exemple : path.join(__dirname, 'entity', '*.js') ou 'dist/entity/PokemonPatient.js', ...
    ],

    migrations: [], // Les migrations pour les bases d'account sont souvent gérées différemment ou pas du tout via la CLI principale
    subscribers: [] // Subscribers pour les bases d'account
};


// --- Exportation(s) des instances de DataSource ---

// C'est l'instance qui sera utilisée par défaut par l'outil CLI TypeORM (migration:generate, migration:run, etc.)
// lorsque vous utilisez l'option --dataSource pointant vers ce fichier.
// Exportez l'instance de la configuration 'central' car c'est celle que vous utilisez pour les migrations principales.
export const AppDataSource = new DataSource(centralConfig);

// Si vous avez besoin d'accéder à l'instance pour le template d'account dans votre code, vous pouvez aussi l'exporter,
// mais la CLI ne l'utilisera pas automatiquement pour les commandes de migration standard.
// export const AccountTemplateDataSource = new DataSource(accountTemplateConfig);


// Note sur __dirname:
// __dirname est une variable globale Node.js qui donne le chemin absolu du répertoire contenant le fichier en cours d'exécution.
// Lorsque vous compilez du TypeScript en JavaScript, __dirname dans le fichier .js généré
// pointera vers le répertoire où se trouve le fichier .js. Assurez-vous que vos chemins vers les entities,
// migrations et subscribers sont corrects *par rapport à l'emplacement des fichiers .js compilés*.
// Souvent, si vous compilez src/ en dist/, les chemins devront être ajustés pour pointer vers 'dist/...'