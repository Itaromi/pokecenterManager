# Pokecenter Manager

Courte description de votre projet.

Ce document explique comment installer et configurer manuellement votre environnement de développement local en utilisant Docker Compose.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

* **Git** : Pour cloner le dépôt.
* **Docker** : Incluant Docker Engine et Docker Compose.
* **Node.js et npm** : Pour gérer les dépendances et les scripts de build.

Vous devez également avoir cloné le dépôt du projet sur votre machine locale. Si ce n'est pas déjà fait, exécutez :

```bash
git clone <URL_DE_VOTRE_DEPOT>
cd <dossier_du_projet>
```

## Installation et Configuration Manuelle

Suivez ces étapes dans l'ordre pour installer et configurer manuellement le projet. Ouvrez votre terminal et naviguez jusqu'à la racine du répertoire du projet pour exécuter les commandes.

1. **Installer les Dépendances Node.js**
   ```bash
   npm install
   ```

2. **Compiler le Code de l'Application**
   ```bash
   npm run build
   ```

3. **Construire les Images Docker**
   ```bash
   docker compose build
   ```

4. **Lancer les Conteneurs Principaux**
   ```bash
   docker compose up -d
   ```

5. **Attendre que la Base de Données Principale soit Prête**
   ```bash
   docker compose ps
   docker compose logs db
   ```

6. **Lancer les Migrations de la Base de Données Centrale**
   ```bash
   docker exec -it <ID_OU_NOM_CONTENEUR_APP> npm run typeorm -- migration:run -d dist/data-source.js
   ```

7. **Démarrer le Service de Base de Données dédié à la Génération de Migrations Secondaires**
   ```bash
   docker compose up -d db_account_migration_test
   ```

8. **Exécuter le Script de Mise à Jour des Bases de Données Secondaires**
   ```bash
   docker exec -it <ID_OU_NOM_CONTENEUR_APP> node dist/scripts/UpdateAccountDBs.js
   ```

Une fois ces étapes terminées, votre environnement de développement devrait être entièrement configuré.

## Gestion des Migrations Secondaires Futures

1. Modifiez vos fichiers d'entité (`src/entity/...ts`).
2. Assurez-vous que le service db_account_migration_test tourne :
   ```bash
   docker compose up -d db_account_migration_test
   ```
3. Générez un nouveau fichier de migration secondaire :
   ```bash
   npm run typeorm -- migration:generate src/migration/account/NomDeMaNouvelleMigration -d ormconfig.account.ts
   ```
4. Compilez votre code :
   ```bash
   npm run build
   ```
5. Reconstruisez l'image Docker de l'application :
   ```bash
   docker compose build app
   ```
6. Relancez les conteneurs principaux :
   ```bash
   docker compose up -d app db
   ```
7. Exécutez le script de mise à jour :
   ```bash
   docker exec -it <ID_OU_NOM_CONTENEUR_APP> node dist/scripts/UpdateAccountDBs.js
   ```

## Lancer la documentation manuellement 📚

Si tu souhaites lancer la documentation **Docusaurus** en local pour la modifier ou l'améliorer :

```bash
cd documentation
npm install
npx docusaurus start
```

Accède ensuite à :
```
http://localhost:3000/
```

## Nettoyage

Pour arrêter et supprimer les conteneurs et les réseaux Docker créés par Docker Compose :

```bash
docker compose down
```

Pour supprimer également les volumes nommés (ce qui effacera définitivement les données de vos bases de données !) :

```bash
docker compose down --volumes
```

