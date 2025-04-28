// src/scripts/updateAccountDbs.ts
// Script pour appliquer les migrations secondaires à toutes les bases de données d'account.

import 'reflect-metadata'; // Nécessaire pour TypeORM
import { DataSource, Table } from 'typeorm'; // Importez Table pour la création dynamique si nécessaire
// Importez la configuration template de votre source de données secondaire
import { accountTemplateConfig } from '../data-source';
// Importez la source de données centrale pour pouvoir lister les bases secondaires
import { AppDataSource as CentralDataSource } from '../data-source';
import path from 'path';
// Importez dotenv si vous utilisez des variables d'env direct dans ce script (pas recommandé dans Docker)
// import * as dotenv from 'dotenv';
// dotenv.config(); // Charge les variables depuis .env si le script est exécuté sur l'hôte

// --- Importez votre service dédié ---
import { DbListService } from '../service/DbListService'; // !! Ajustez le chemin d'importation !!
// -------------------------------------


// --- Configuration ---
// Chemin vers le répertoire où TypeORM trouvera les migrations secondaires *compilées*
// Ce chemin doit être correct *à l'intérieur du conteneur de l'application*.
// Si votre WORKDIR est /app, vous compilez src/ en dist/, et les migrations sont dans src/migration/account,
// alors le chemin compilé sera dist/migration/account
const COMPILED_ACCOUNT_MIGRATIONS_DIR = path.join(__dirname, '../migration/account'); // Chemin relatif à l'emplacement du script compilé


// --- Fonction pour exécuter les migrations sur une seule base de données secondaire ---
// Prend le nom de la base de données secondaire en argument
async function runMigrationsForSingleAccountDb(dbName: string | undefined): Promise<void> {
    console.log(`[Migration] Attempting to update database: ${dbName}`);

    // Crée une instance de DataSource dynamique pour cette base spécifique
    const accountDataSource = new DataSource({
        // Copie la configuration template (type, host, port, user, pass, entities, logging etc.)
        ...accountTemplateConfig,
        // Nom unique pour l'instance (utile si vous gérez plusieurs connexions simultanément, sinon facultatif)
        name: `account_${dbName}_${Date.now()}`, // Ajout d'un timestamp pour garantir l'unicité si appelé rapidement
        // Écrase le nom de la base de données pour se connecter à la bonne DB secondaire
        database: dbName,
        // Indique où trouver les migrations *compilées* secondaires pour cette DataSource
        migrations: [path.join(COMPILED_ACCOUNT_MIGRATIONS_DIR, '*.js')],
        // Assurez-vous que les entités secondaires sont incluses via accountTemplateConfig
        // entities: accountTemplateConfig.entities, // Déjà inclus via ...accountTemplateConfig

        // Vous pouvez surcharger le logging pour ce script si vous voulez des logs différents de l'application principale
        logging: process.env.NODE_ENV === 'development' ? ['query', 'error', 'schema'] : ['error'],
    });

    try {
        // Initialise la connexion à cette base secondaire
        await accountDataSource.initialize();
        console.log(`[Migration] DataSource "${accountDataSource.options.name}" initialized for database "${dbName}".`);

        const queryRunner = accountDataSource.createQueryRunner();

        try {
            // --- Logique pour gérer l'erreur "relation already exists" ---
            // Cette logique est destinée à marquer la première migration (InitialSecondarySchema)
            // comme exécutée si le schéma semble déjà présent (synchronize a tourné).
            // IMPORTANT : Remplacez 'InitialSecondarySchema...' par le NOM EXACT de votre première migration secondaire.
            const initialMigrationName = 'InitialSecondarySchema1745581829021'; // !! AJUSTEZ CE NOM !!

            // Vérifier si la table 'migrations' existe
            const migrationsTableExists = await queryRunner.hasTable('migrations');

            let isInitialMigrationRecorded = false;
            if (migrationsTableExists) {
                try {
                    // Utilisez le QueryRunner pour interroger la table migrations
                    const recordedMigration = await queryRunner.query(`SELECT * FROM "migrations" WHERE "name" = $1`, [initialMigrationName]);
                    isInitialMigrationRecorded = recordedMigration.length > 0;
                } catch (innerError) {
                    console.warn(`[Migration] Could not check for initial migration record in DB "${dbName}":`, innerError);
                    // Si on ne peut même pas interroger la table migrations, il y a un problème plus profond.
                    // On laisse l'erreur remonter ou on la gère comme un échec de mise à jour.
                }
            }

            // Vérifier si des tables *autres que* 'migrations' existent
            const allTables = await queryRunner.getTables();
            const hasNonMigrationTables = allTables.some(table => table.name !== 'migrations');


            // Si des tables (autres que migrations) existent ET que la migration initiale n'est PAS enregistrée :
            // On insère l'enregistrement de la migration initiale pour dire à TypeORM qu'elle est déjà "appliquée".
            if (hasNonMigrationTables && !isInitialMigrationRecorded) {
                if (!migrationsTableExists) {
                    // Créer la table migrations si elle n'existe pas mais que d'autres tables existent
                    console.log(`[Migration] Creating migrations table in "${dbName}"...`);
                    await queryRunner.createTable(new Table({
                        name: "migrations",
                        columns: [
                            { name: "id", type: "serial", isPrimary: true },
                            { name: "timestamp", type: "bigint", isNullable: false },
                            { name: "name", type: "varchar", isNullable: false }
                        ]
                    }), true); // 'true' pour ignorer si la table existe déjà (pour plus de robustesse)
                    console.log(`[Migration] Migrations table created in "${dbName}".`);
                }

                console.log(`[Migration] Initial schema seems present in "${dbName}". Marking "${initialMigrationName}" as executed.`);
                // Insérer manuellement l'enregistrement de la migration initiale
                await queryRunner.query(`INSERT INTO "migrations" ("timestamp", "name") VALUES ($1, $2)`, [Date.now(), initialMigrationName]);
            }
            // --- Fin de la logique de gestion synchronize ---


            console.log(`[Migration] Running pending migrations for database "${dbName}"...`);
            // Exécute les migrations restantes (exclura la migration initiale si elle a été marquée)
            const executedMigrations = await accountDataSource.runMigrations();

            if (executedMigrations.length > 0) {
                console.log(`[Migration] Successfully executed ${executedMigrations.length} migrations for database "${dbName}".`);
                executedMigrations.forEach(migration => console.log(`  - ${migration.name}`));
            } else {
                console.log(`[Migration] No pending migrations found for database "${dbName}".`);
            }

        } catch (error) {
            console.error(`[Migration] Error running migrations for database "${dbName}":`, error);
            throw error; // Relance l'erreur
        } finally {
            // S'assurer que le queryRunner est libéré
            await queryRunner.release();
        }


    } catch (error) {
        console.error(`[Migration] Error running migrations for database "${dbName}":`, error);
        throw error; // Relance l'erreur
    } finally {
        if (accountDataSource && accountDataSource.isInitialized) {
            console.log(`[Migration] Closing DataSource "${accountDataSource.options.name}" connection for database "${dbName}".`);
            await accountDataSource.destroy();
        }
    }
}

// --- Fonction principale pour orchestrer la mise à jour de toutes les bases secondaires ---
async function updateAllAccountDatabases() {
    console.log("--- Starting update process for all account databases ---");

    // Étape 1: Initialiser la connexion à la base centrale
    let centralDataSourceInstance: DataSource | undefined;
    try {
        if (!CentralDataSource.isInitialized) {
            console.log("[Main] Initializing Central DataSource...");
            centralDataSourceInstance = await CentralDataSource.initialize();
            console.log("[Main] Central DataSource initialized.");
        } else {
            centralDataSourceInstance = CentralDataSource;
            console.log("[Main] Central DataSource already initialized.");
        }

        // --- Utiliser le service dédié pour obtenir les noms de bases (Déchiffrés) ---
        console.log("[Main] Using DbListService to fetch list of secondary database names...");
        // Instanciez le service en lui passant la DataSource centrale
        const dbListService = new DbListService(centralDataSourceInstance); // !! Ajustez si le constructeur est différent !!
        const rawAccountDbNames = await dbListService.getAllDbNames(); // <-- Appelle le service pour obtenir les noms déchiffrés (potentiellement invalides)
        // ----------------------------------------------------------------------------

        // --- Filtrer les noms de bases de données invalides ---
        // Les logs précédents montraient des '' et des noms avec 'undefined'/'null'.
        // Cette étape filtre pour ne garder que les noms qui ressemblent à des noms de base valides.
        const accountDbNames = rawAccountDbNames.filter(dbName =>
                typeof dbName === 'string' && // Doit être une chaîne
                dbName.length > 0 &&          // Ne doit pas être vide
                !dbName.includes('undefined') && // Ne doit pas contenir 'undefined' (suite à des erreurs de génération initiales)
                !dbName.includes('null') &&      // Ne doit pas contenir 'null'
                dbName.length < 64 // Les noms de DB PostgreSQL ont une longueur max (par défaut 63)
            // Ajoutez d'autres critères de validation si votre format de nom est plus strict (ex: commence par PC_, pas de caractères spéciaux non autorisés...)
        );
        console.log("[Main] Valid database names after filtering:", accountDbNames);
        console.log(`[Main] Found ${accountDbNames.length} valid secondary databases to potentially update after filtering.`);


        // Étape 3: Parcourir et mettre à jour chaque base secondaire (uniquement les noms valides)
        const failedUpdates: { dbName: string | undefined, error: any }[] = [];
        for (const dbName of accountDbNames) { // Boucle sur la liste filtrée des noms valides
            try {
                await runMigrationsForSingleAccountDb(dbName);
            } catch (error) {
                console.error(`[Main] Update process failed for database: ${dbName}. Recording failure.`);
                failedUpdates.push({ dbName, error });
            }
        }

        console.log("--- Update process for all account databases finished ---");
        if (failedUpdates.length > 0) {
            console.error(`[Main] Updates failed for ${failedUpdates.length} databases.`);
            failedUpdates.forEach(failure => {
                console.error(`- DB: ${failure.dbName}, Error: ${failure.error}`);
            });
            process.exit(1);
        } else {
            console.log("[Main] All secondary databases updated successfully.");
            process.exit(0);
        }

    } catch (error) {
        console.error("[Main] Fatal error during the overall update process:", error);
        process.exit(1);
    } finally {
        if (centralDataSourceInstance && centralDataSourceInstance.isInitialized && centralDataSourceInstance !== CentralDataSource) {
            console.log("[Main] Closing Central DataSource connection used by update script...");
            await centralDataSourceInstance.destroy();
        }
    }
}

// --- Point d'entrée du script ---
(async () => {
    try {
        await updateAllAccountDatabases();
    } catch (error) {
        console.error("Script execution failed:", error);
        process.exit(1);
    }
})();