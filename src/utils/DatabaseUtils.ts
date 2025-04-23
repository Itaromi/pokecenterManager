import { accountTemplateConfig } from "../data-source";

import {PokemonPatient} from "../entity/PokemonPatient";
import {Soin} from "../entity/Soin";
import {TypeSoin} from "../entity/TypeSoin";
import {DataSource, DataSourceOptions} from "typeorm";

const accountEntities = [
    PokemonPatient,
    Soin,
    TypeSoin,
    ];

/**
 * Crée une nouvelle base de données avec le nom spécifié et y applique le schéma des entités secondaires.
 * @param databaseName Le nom de la nouvelle base de données à créer.
 */
export async function createAccountDatabaseAndSchema(databaseName: string): Promise<void> {

    if(!("username" in accountTemplateConfig) && !("password" in accountTemplateConfig)) {
        console.error("Les identifiants de connexion pour les DBs secondaires ne sont pas configurés (username/password manquants dans accountTemplateDataSourceOptions).");
        throw new Error("Configuration DB incomplète.");
    }

    const serverConnectionOptions: DataSourceOptions = {
        type: accountTemplateConfig.type,
        host: accountTemplateConfig.host,
        port: accountTemplateConfig.port,
        username: accountTemplateConfig.username,
        password: accountTemplateConfig.password,
        database: "postgres",
        logging: false,
    }

    let serverDataSource: DataSource | undefined;

    try {
        console.log(`[DB Utils] Tentative de connexion au serveur DB (${serverConnectionOptions.host}:${serverConnectionOptions.port}, DB: ${serverConnectionOptions.database})...`);
        serverDataSource = new DataSource(serverConnectionOptions);
        await serverDataSource.initialize();
        console.log("[DB Utils] Connexion au serveur DB établie. Tentative de création de la DB...");

        // Exécuter la commande SQL pour créer la base de données.
        // Utilise query() pour exécuter une commande SQL brute via le QueryRunner.
        const queryRunner = serverDataSource.createQueryRunner();
        // Assurez-vous que le nom de la DB est échappé correctement pour éviter les problèmes SQL
        await queryRunner.query(`CREATE DATABASE "${databaseName}"`);

        console.log(`[DB Utils] Base de données "${databaseName}" créée avec succès.`);
        await queryRunner.release(); // Relâcher le queryRunner

    } catch (error: any) {
        // Gérer le cas où la base de données existe déjà (par ex., lors d'une ré-exécution)
        // Les codes d'erreur SQL (error.code ou error.sqlState) sont spécifiques au SGBD.
        // 42P04 pour PostgreSQL "duplicate_database", 1007 pour MySQL "Can't create database ... Database exists"
        if (error.code === '42P04' || error.code === 1007 || (error.sqlState && (error.sqlState === '42P04' || error.sqlState === '42000'))) {
            console.warn(`[DB Utils] La base de données "${databaseName}" existe déjà. Skipping creation.`);
        } else {
            console.error(`[DB Utils] Erreur fatale lors de la création de la base de données "${databaseName}":`, error);
            // S'assurer que la connexion au serveur est fermée en cas d'erreur inattendue
            if (serverDataSource && serverDataSource.isInitialized) {
                await serverDataSource.destroy();
            }
            throw error; // Relancer l'erreur pour gestion en amont
        }
    } finally {
        // Assurez-vous de toujours fermer la connexion temporaire au serveur
        if (serverDataSource && serverDataSource.isInitialized) {
            await serverDataSource.destroy();
            console.log("[DB Utils] Connexion au serveur DB fermée.");
        }
    }

    const accountConnectionOptions: DataSourceOptions = {
        ...serverConnectionOptions, // Hérite des options comme type, host, port, user, password
        name: databaseName, // Optionnel : nommer la connexion si nécessaire pour un pool futur
        database: databaseName, // <<< *** Spécifie la base de données cible nouvellement créée ***
        synchronize: true, // <<< IMPORTANT: Utiliser synchronize UNIQUEMENT ICI POUR LA CRÉATION INITIALE
                           // N'utilisez PAS synchronize=true dans les configurations pour le démarrage de l'app en production !
        logging: false, // Moins de logs pour cette étape
        entities: accountEntities, // <<< Liste des entités à créer dans cette DB
        // Si vous utilisez des migrations pour les DB secondaires, configurez-les ici aussi
        // migrations: [__dirname + "/migration/account/*.js"], // Notez le .js pour les fichiers compilés
    };

    let accountDataSource: DataSource | undefined;

    try {
        console.log(`[DB Utils] Tentative de connexion à la nouvelle DB "${databaseName}" pour synchronisation...`);
        accountDataSource = new DataSource(accountConnectionOptions);
        await accountDataSource.initialize();
        console.log(`[DB Utils] Connexion à "${databaseName}" établie. Application du schéma (synchronize)...`);

        // Appliquer le schéma (créer les tables des entités listées dans accountEntities)
        await accountDataSource.synchronize();

        console.log(`[DB Utils] Schéma des entités secondaires appliqué dans "${databaseName}".`);

        // Si vous utilisez des migrations pour les DB secondaires, exécutez-les ici à la place de synchronize
        // console.log(`[DB Utils] Exécution des migrations secondaires dans "${databaseName}"...`);
        // await accountDataSource.runMigrations();
        // console.log(`[DB Utils] Migrations secondaires exécutées dans "${databaseName}".`);


    } catch (error) {
        console.error(`[DB Utils] Échec lors de la connexion ou de l'application du schéma dans la base de données "${databaseName}":`, error);
        // !!! GESTION DE L'ÉCHEC DE L'APPLICATION DU SCHÉMA !!!
        // Si le schéma ne peut pas être appliqué, la DB existe mais est vide ou incomplète.
        // Voulez-vous la supprimer ? Cela peut être fait en se reconnectant au serveur DB comme dans l'étape 1.
        // await serverDataSource.query(`DROP DATABASE "${databaseName}"`); // Exemple DANGEREUX si mal géré
        throw error; // Relancer l'erreur
    } finally {
        // Assurez-vous de toujours fermer cette connexion spécifique à l'account
        if (accountDataSource && accountDataSource.isInitialized) {
            await accountDataSource.destroy();
            console.log(`[DB Utils] Connexion à "${databaseName}" fermée.`);
        }
    }
}