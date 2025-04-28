---
sidebar_position: 3
---

### 1. Vérifie l'installation de Docker 🛠️

Assure-toi que Docker est installé et fonctionne correctement :

```bash
docker --version
docker-compose --version
```

### 2. Commande principale 🚀

Pour démarrer l'API et la base de données :

```bash
docker-compose up --build
```

- **--build** : Reconstruit les images Docker si nécessaire.
- Les conteneurs démarrent :
    - **API Express** : http://localhost:3000/pokecenter
    - **PostgreSQL** : localhost:5432

### 3. Arrêter les conteneurs 🛑

Pour arrêter les services sans les supprimer :

```bash
docker-compose stop
```

Pour tout arrêter et supprimer les conteneurs, réseaux, volumes anonymes :

```bash
docker-compose down
```

### 4. Logs en temps réel 📋

Pour suivre les logs de l'application :

```bash
docker-compose logs -f
```

### 5. Accéder au conteneur 🐚

Pour ouvrir un terminal dans le conteneur de l'application :

```bash
docker exec -it pokecentermanager-app-1 sh
```

Ou pour PostgreSQL :

```bash
docker exec -it pokecentermanager-db-1 psql -U monutilisateur -d mabasepokemon
```

> 📝 Adapte le nom des conteneurs si besoin avec `docker ps`.

