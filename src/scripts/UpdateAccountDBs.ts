/**
 * src/scripts/updateAccountDbs.ts
 * Script pour appliquer les migrations secondaires à toutes les bases de données d'account.
  */

import 'reflect-metadata'; // Nécessaire pour TypeORM
import { DataSource } from 'typeorm';
// Importez la configuration template de votre source de données secondaire
import { accountTemplateConfig } from '../data-source';
// Importez la source de données centrale pour pouvoir lister les bases secondaires
import { AppDataSource as CentralDataSource } from '../data-source';
import path from 'path';
// Importez dotenv si vous utilisez des variables d'env direct dans ce script (pas recommandé dans Docker)
// import * as dotenv from 'dotenv';
// dotenv.config(); // Charge les variables depuis .env si le script est exécuté sur l'hôte

// --- Configuration ---
// Chemin vers le répertoire où TypeORM trouvera les migrations secondaires *compilées*
// Ce chemin doit être correct *à l'intérieur du conteneur de l'application*.
// Si votre WORKDIR est /app, vous compilez src/ en dist/, et les migrations sont dans src/migration/account,
// alors le chemin compilé sera dist/migration/account
const COMPILED_ACCOUNT_MIGRATIONS_DIR = path.join(__dirname, '../migration/account'); // Chemin relatif à l'emplacement du script compilé


// --- Fonction pour exécuter les migrations sur une seule base de données secondaire ---
// Prend le nom de la base de données secondaire en argument
async function runMigrationsForSingleAccountDb(dbName: string): Promise<void> {
    console.log(`[Migration] Attempting to connect to database: ${dbName}`);

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
        // entities: accountTemplateConfig.entities,

        // Vous pouvez surcharger le logging pour ce script si vous voulez des logs différents de l'application principale
        // logging: true,
    });

    try {
        // Initialise la connexion à cette base secondaire
        await accountDataSource.initialize();
        console.log(`[Migration] DataSource "${accountDataSource.options.name}" initialized for database "${dbName}".`);

        // Exécute les migrations en attente pour cette base
        console.log(`[Migration] Running pending migrations for database "${dbName}"...`);
        const executedMigrations = await accountDataSource.runMigrations();

        if (executedMigrations.length > 0) {
            console.log(`[Migration] Successfully executed ${executedMigrations.length} migrations for database "${dbName}".`);
            executedMigrations.forEach(migration => console.log(`  - ${migration.name}`));
        } else {
            console.log(`[Migration] No pending migrations found for database "${dbName}".`);
        }

    } catch (error) {
        console.error(`[Migration] Error running migrations for database "${dbName}":`, error);
        // *** Gérer l'erreur de manière robuste ici ***
        // En production, vous devriez :
        // 1. Loguer l'erreur en détail (inclure le nom de la base).
        // 2. NE PAS ARRÊTER le processus global (pour les mises à jour de masse).
        // 3. Ajouter le nom de la base à une liste d'échecs.
        // 4. Vous pourriez ajouter une logique de retry simple pour certains types d'erreurs (ex: connexion perdue).
        throw error; // On relance l'erreur pour que la fonction principale puisse la capturer et la gérer (ex: l'ajouter à la liste d'échecs)
    } finally {
        // S'assurer que la connexion est fermée après l'exécution
        if (accountDataSource && accountDataSource.isInitialized) {
            console.log(`[Migration] Closing DataSource "${accountDataSource.options.name}" connection for database "${dbName}".`);
            await accountDataSource.destroy();
        }
    }
}

// --- Fonction principale pour orchestrer la mise à jour de toutes les bases secondaires ---
async function updateAllAccountDatabases() {
    console.log("--- Starting update process for all account databases ---");

    // Étape 1: Initialiser la connexion à la base centrale pour obtenir la liste des comptes
    let centralDataSourceInstance: DataSource | undefined;
    try {
        // Utilise l'instance centrale si elle est déjà initialisée (si ce script est lancé dans l'app principale)
        // Sinon, l'initialise spécifiquement pour ce script.
        // Cela évite de ré-initialiser si le script est exécuté dans le contexte de l'application principale.
        if (!CentralDataSource.isInitialized) {
            console.log("[Main] Initializing Central DataSource...");
            centralDataSourceInstance = await CentralDataSource.initialize();
            console.log("[Main] Central DataSource initialized.");
        } else {
            centralDataSourceInstance = CentralDataSource;
            console.log("[Main] Central DataSource already initialized.");
        }

        // Étape 2: Récupérer la liste des noms de bases secondaires depuis la base centrale
        console.log("[Main] Fetching list of secondary database names from central DB...");
        // REMPLACEZ 'PokemonAccount' par le nom de votre entité de compte central
        // REMPLACEZ 'secondaryDbNameColumn' par le nom CORRECT de la PROPRIÉTÉ dans votre entité PokemonAccount
        // qui stocke le nom de la base de données secondaire (par ex. 'dbName', 'accountDatabase').
        const accountRepository = centralDataSourceInstance.getRepository("PokemonAccount");
        const accounts = await accountRepository
            .createQueryBuilder("account")
            .select("account.secondaryDbNameColumn", "dbName") // Sélectionnez UNIQUEMENT la colonne du nom de la DB
            .where("account.secondaryDbNameColumn IS NOT NULL AND account.secondaryDbNameColumn != ''") // Exclure les comptes sans DB secondaire
            .getRawMany(); // Utilisez getRawMany car on sélectionne une seule colonne brute

        const accountDbNames: string[] = accounts
            .map(account => account.dbName as string); // Mappez pour extraire les noms et assurez le type

        console.log(`[Main] Found ${accountDbNames.length} secondary databases to potentially update.`);
        console.log("[Main] Database names:", accountDbNames);


        // Étape 3: Parcourir et mettre à jour chaque base secondaire
        const failedUpdates: { dbName: string, error: any }[] = [];
        for (const dbName of accountDbNames) {
            try {
                await runMigrationsForSingleAccountDb(dbName);
            } catch (error) {
                console.error(`[Main] Update process failed for database: ${dbName}. Recording failure.`);
                failedUpdates.push({ dbName, error });
                // Ici, vous pourriez aussi logger l'erreur complète, envoyer une alerte, etc.
            }
        }

        console.log("--- Update process for all account databases finished ---");
        if (failedUpdates.length > 0) {
            console.error(`[Main] Updates failed for ${failedUpdates.length} databases.`);
            failedUpdates.forEach(failure => {
                console.error(`- DB: ${failure.dbName}, Error: ${failure.error}`);
            });
            // En production, vous pourriez vouloir qu'un processus échoue globalement si des mises à jour ne passent pas.
            process.exit(1); // Quitte avec code d'erreur pour signaler des échecs
        } else {
            console.log("[Main] All secondary databases updated successfully.");
            process.exit(0); // Quitte avec code de succès
        }

    } catch (error) {
        console.error("[Main] Fatal error during the overall update process:", error);
        process.exit(1); // Quitte en cas d'erreur fatale (ex: connexion centrale échouée)
    } finally {
        // Ferme la connexion centrale UNIQUEMENT si ce script l'a initialisée spécifiquement.
        // Si ce script tourne DANS votre application principale, la connexion est gérée ailleurs.
        if (centralDataSourceInstance && centralDataSourceInstance.isInitialized && centralDataSourceInstance !== CentralDataSource) {
            console.log("[Main] Closing Central DataSource connection used by update script...");
            await centralDataSourceInstance.destroy();
        }
    }
}

// --- Point d'entrée du script ---
// Exécute la fonction principale et gère les erreurs globales
// Utilise un IIFE (Immediately Invoked Function Expression) asynchrone
(async () => {
    try {
        await updateAllAccountDatabases();
    } catch (error) {
        // Cet attrape peut capturer des erreurs qui surviennent avant ou après
        // l'appel de updateAllAccountDatabases si elles ne sont pas promises.
        // L'important est que updateAllAccountDatabases gère ses propres erreurs internes et quitte avec process.exit
        console.error("Script execution failed:", error);
        process.exit(1); // Assure la sortie avec erreur si le script lui-même n'a pas appelé process.exit
    }
})();