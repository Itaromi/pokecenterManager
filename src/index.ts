// src/index.ts

import 'reflect-metadata'; // !!! Doit rester la TOUTE PREMIÈRE ligne
import express from 'express';
import { DataSource } from 'typeorm'; // Importez DataSource ici
// Importe l'export par défaut de data-source.ts, qui est un tableau de DataSources
import { AppDataSource } from './data-source';
// Importe dotenv config si vous utilisez .env en dehors de Docker (sinon, Docker s'en charge)
import 'dotenv/config';

import { PokeCenterAccountRouter } from './routes/PokeCenterAccountRoutes';

// Importe le service que nous avons créé
import { PokeCenterAccountService } from './service/PokeCenterAccountService';

// Configure Express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware pour parser le corps des requetes en JSON

// --- Initialisation des DataSources et démarrage de l'application ---

// Trouvez l'instance spécifique de la DataSource 'central' par son nom
// Assurez-vous que 'central' est bien le nom défini dans data-source.ts
const centralDataSource: DataSource = AppDataSource;
if (!centralDataSource) {
    console.error("Configuration Error: The 'central' DataSource was not found in data-source.ts");
    process.exit(1); // Arrête l'application si la DataSource centrale est manquante
}

// Déclarez une variable pour stocker l'instance initialisée du service
let accountService: PokeCenterAccountService;

// Fonction asynchrone pour gérer l'initialisation et le démarrage
async function bootstrap() {
    try {
        // *** Initialiser la DataSource 'central' ***
        console.log("Attempting to initialize TypeORM DataSource 'central'...");
        await centralDataSource.initialize();
        console.log("TypeORM DataSource 'central' initialized successfully!");

        // *** Instancier les services en leur passant les DataSources nécessaires ***
        accountService = new PokeCenterAccountService(centralDataSource);
        console.log("PokemonAccountService instantiated.");

        //****************************************************************
        // *** Monter les routeurs après l'initialisation des services ***

        const pokemonAccountRouter = PokeCenterAccountRouter(accountService);
        app.use('/pokecenter', pokemonAccountRouter); // Toutes les routes définies dans pokemonAccountRouter seront préfixées par /pokecenter
        console.log("Pokemon Account router mounted at /pokecenter");

        // Route de test simple (peut rester ici ou être déplacée ailleurs)
        app.get('/', (req, res) => {
            res.send('Hello from the Pokemon App API!');
        });
        console.log("General test route mounted at /");

        // *** Autres routeurs peuvent être montés ici de la même manière ***
        // ******************************************************************

        // *** Démarrer le serveur Express ***
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`App listening on port ${port} inside container`); // Message pour le conteneur
        });

        // *** Gestion de l'arrêt propre de l'application ***
        // Fermer la connexion DB lorsque l'application reçoit un signal d'arrêt
        process.on('SIGINT', async () => {
            console.log("SIGINT signal received. Shutting down gracefully...");
            if (centralDataSource.isInitialized) {
                console.log("Closing 'central' DataSource connection...");
                await centralDataSource.destroy();
                console.log("'central' DataSource connection closed.");
            }
            // Si vous avez un gestionnaire de pool pour les DBs secondaires, fermez-les ici aussi
            // Exemple : await closeAccountDataSources();
            process.exit(0); // Sortie propre
        });

        // Gérer d'autres signaux d'arrêt si nécessaire (par ex. SIGTERM pour Docker)
        process.on('SIGTERM', async () => {
            console.log("SIGTERM signal received. Shutting down gracefully...");
            if (centralDataSource.isInitialized) {
                console.log("Closing 'central' DataSource connection...");
                await centralDataSource.destroy();
                console.log("'central' DataSource connection closed.");
            }
            // Exemple : await closeAccountDataSources();
            process.exit(0); // Sortie propre
        });


    } catch (error) {
        console.error("Error during TypeORM DataSource initialization or application startup:", error);
        // En cas d'erreur, assurez-vous que la connexion est fermée si elle a été initialisée, puis arrêtez l'application.
        if (centralDataSource && centralDataSource.isInitialized) {
            centralDataSource.destroy().then(() => process.exit(1)).catch(() => process.exit(1));
        } else {
            process.exit(1); // Sortie avec code d'erreur si l'initialisation a échoué avant de pouvoir fermer
        }
    }
}

// Démarre le processus d'initialisation et le serveur
bootstrap().catch(error => {
    // Ce bloc .catch attrape spécifiquement les erreurs qui pourraient
    // survenir PENDANT l'appel de bootstrap() et qui n'auraient pas été
    // gérées par le try...catch interne (bien que dans votre cas,
    // le try...catch interne est déjà assez robuste).
    // C'est surtout pour satisfaire le linter/TypeScript et s'assurer
    // qu'aucune Promesse rejetée n'est laissée sans gestion au niveau supérieur.
    console.error("Fatal error during bootstrap execution:", error);
    process.exit(1); // S'assure que le processus se termine avec un code d'erreur
});