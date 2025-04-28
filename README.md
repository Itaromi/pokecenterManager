# **Pokecenter Manager**

Courte description de votre projet.

Ce document explique comment installer et configurer manuellement votre environnement de développement local en utilisant Docker Compose.

## **Prérequis**

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

* **Git** : Pour cloner le dépôt.
* **Docker** : Incluant Docker Engine et Docker Compose.
* **Node.js et npm** : Pour gérer les dépendances et les scripts de build.

Vous devez également avoir cloné le dépôt du projet sur votre machine locale. Si ce n'est pas déjà fait, exécutez :

`git clone <URL_DE_VOTRE_DEPOT>`  
`cd <dossier_du_projet>`

## **Installation et Configuration Manuelle**

Suivez ces étapes dans l'ordre pour installer et configurer manuellement le projet. Ouvrez votre terminal et naviguez jusqu'à la racine du répertoire du projet pour exécuter les commandes.

1. **Installer les Dépendances Node.js**  
   Cette commande installe tous les packages Node.js nécessaires au projet, tels que définis dans le fichier package.json.  
   `npm install`

2. **Compiler le Code de l'Application**  
   Compilez le code source TypeScript en JavaScript. Les fichiers JavaScript générés seront placés dans le répertoire dist/.  
   `npm run build`

3. **Construire les Images Docker**  
   Cette étape lit les Dockerfile de chaque service défini dans votre docker-compose.yml et construit les images Docker correspondantes.  
   `docker compose build`

4. **Lancer les Conteneurs Principaux**  
   Démarrez les services principaux de l'application (app) et de la base de données centrale (db) en arrière-plan.  
   `docker compose up -d`
    * `-d` : Lance les conteneurs en mode détaché, libérant votre terminal.
5. **Attendre que la Base de Données Principale soit Prête**  
   Le conteneur de la base de données prend un certain temps pour démarrer complètement et être prêt à accepter les connexions. Vous devez attendre que la base de données soit prête avant de lancer les migrations.  
   Vous pouvez vérifier l'état de vos conteneurs avec :  
   `docker compose ps`

   Consultez les logs du conteneur de la base de données pour le message indiquant qu'il est prêt à accepter les connexions. Recherchez un message similaire à database system is ready to accept connections.  
   `docker compose logs db`

   Si un health check est configuré pour votre service db dans docker-compose.yml, vous pouvez attendre qu'il affiche (healthy) dans la sortie de docker compose ps.
6. **Lancer les Migrations de la Base de Données Centrale**  
   Appliquez le schéma nécessaire à votre base de données centrale (mabasepokemon) en exécutant les migrations TypeORM. Cette commande est exécutée à l'intérieur du conteneur de votre application (app).  
   `docker exec -it <ID_OU_NOM_CONTENEUR_APP> npm run typeorm -- migration:run -d dist/data-source.js`

    * Remplacez <ID_OU_OU_NOM_CONTENEUR_APP> par l'ID ou le nom réel de votre conteneur app. Vous pouvez le trouver en exécutant docker compose ps. Le nom est généralement au format \<nom\_du\_dossier\_projet\>-app-1.
    * **Assurez-vous que la base de données principale est prête (étape 5\) avant d'exécuter cette commande.**
7. **Démarrer le Service de Base de Données dédié à la Génération de Migrations Secondaires**  
   Ce service (db_account_migration_test) est utilisé par les outils TypeORM pour générer les fichiers de migration pour le schéma de vos bases de données secondaires. Lancez-le en arrière-plan.  
   `docker compose up -d db_account_migration_test`

8. **Exécuter le Script de Mise à Jour des Bases de Données Secondaires**  
   Ce script est conçu pour se connecter à toutes les bases de données secondaires de comptes existants et y appliquer les migrations secondaires en attente. Exécutez cette commande à l'intérieur du conteneur de votre application.  
   `docker exec -it <ID_OU_NOM_CONTENEUR_APP> node dist/scripts/UpdateAccountDBs.js`

    * Remplacez <ID_OU_NOM_CONTENEUR_APP> comme à l'étape 6\.
    * Assurez-vous que les conteneurs app et db sont en cours d'exécution. Le service db\_account\_migration\_test doit également être accessible.

Une fois ces étapes terminées, votre environnement de développement devrait être entièrement configuré. Votre application principale devrait être accessible (par exemple, via http://localhost:3000 si le port est mappé dans votre docker-compose.yml).

## **Gestion des Migrations Secondaires Futures**

Lorsque vous modifiez le schéma de vos entités secondaires (par ex., PokemonPatient, Soin, TypeSoin), suivez ces étapes pour générer une nouvelle migration et l'appliquer à toutes les bases secondaires :

1. Modifiez vos fichiers d'entité (src/entity/...ts).
---
2. Assurez-vous que le service db\_account\_migration\_test tourne  
   (`docker compose up -d db_account_migration_test`).
---
3. Générez un nouveau fichier de migration secondaire. Remplacez NomDeMaNouvelleMigration par un nom descriptif.  
   `npm run typeorm -- migration:generate src/migration/account/NomDeMaNouvelleMigration -d ormconfig.account.ts`
---
4. Compilez votre code (pour inclure la nouvelle migration .js dans dist/).  
   `npm run build`
---
5. Reconstruisez l'image Docker de l'application pour y inclure la nouvelle migration compilée.  
   `docker compose build app`
---
6. Relancez les conteneurs principaux pour utiliser la nouvelle image.  
   `docker compose up -d app db`
---
7. Exécutez le script de mise à jour pour appliquer la nouvelle migration à toutes les bases secondaires.  
 ---
8. `docker exec -it <ID_OU_NOM_CONTENEUR_APP> node dist/scripts/UpdateAccountDBs.js`
---

---
## **Nettoyage**

Pour arrêter et supprimer les conteneurs et les réseaux Docker créés par Docker Compose :

 `docker compose down`

Pour supprimer également les volumes nommés (ce qui effacera définitivement les données de vos bases de données \!) :

 `docker compose down \--volumes`  