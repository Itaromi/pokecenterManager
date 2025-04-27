// ormconfig.account.ts

import { DataSource } from 'typeorm';
import path from 'path';
import { accountTemplateConfig } from './src/data-source'; // !! Ajustez ce chemin si data-source.ts est ailleurs !!

const SecondaryMigrationDataSource = new DataSource({
    // Utilise la configuration template pour la plupart des options
    ...accountTemplateConfig,
    name: "secondary_migration_cli",

    // *** NOUVEAUX DÉTAILS DE CONNEXION pour la DB DÉDIÉE à la génération ***
    // Hôte : Le nom du service Docker (tel que défini dans docker-compose.yml)
    host: 'db_account_migration_test',
    // Port : Le port INTERNE du conteneur DB (toujours 5432 pour PostgreSQL)
    port: 5432,
    // Utilisateur, Mot de passe, Nom de la base : Ceux définis pour le service db_account_migration_test
    username: 'monutilisateur_test',
    password: 'monmotdepassetest',
    database: 'secondary_migration_db',

    // Le chemin où la CLI DOIT trouver les fichiers de migration pour les lire/générer
    // Ce chemin est relatif à l'emplacement de CE fichier de configuration (ormconfig.account.ts)
    migrations: [
        'src/migration/account/*.ts' // Doit pointer vers le répertoire où vous stockez les migrations secondaires .ts
    ],

    // S'assurer que les entités secondaires sont listées dans accountTemplateConfig
    // entities: accountTemplateConfig.entities, // Déjà inclus via ...accountTemplateConfig

    logging: true, // Gardez les logs pour la génération

});

export default SecondaryMigrationDataSource;