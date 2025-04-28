---
title: Introduction 
sidebar_position: 1
---

# PokecenterManager Documentation 🌟

Bienvenue sur la documentation de **PokecenterManager**, une API Node.js/Express multi-tenant pour gérer des centres Pokémon avec PostgreSQL et TypeORM. Les données sensibles sont sécurisées via AES.

---

## Fonctionnalités principales

- 🏥 **Architecture Multi-tenant** : Chaque centre Pokémon possède sa propre base de données isolée.
- 🔐 **Chiffrement AES** : Protection avancée des données sensibles (emails, villes, etc.).
- 📈 **Extensible avec Docker** : Déployez facilement avec Docker Compose.
- 🌐 **Compatible Cloud** : Fonctionne avec Cloud Run, Docker Swarm, etc.

---

## Prérequis 🔧

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docusaurus (optionnel pour la doc)](https://docusaurus.io/)

---

## Installation rapide ⚡

### 1. Clonez le projet

```bash
git clone https://github.com/Itaromi/pokecenterManager.git
cd pokecenterManager
```

### 2. Configurez les variables d'environnement

Créez un fichier `.env` :

```env
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=monutilisateur
DATABASE_PASSWORD=motdepasse
DATABASE_NAME=mabasepokemon
ENCRYPTION_SECRET=MonSuperSecretPoké123
```

> 📅 En production, utilisez **Docker secrets** ou un **secret manager** pour la gestion sécurisée.

### 3. Lancez avec Docker Compose

```bash
docker-compose up --build
```

Accédez à l'API : `http://localhost:3000/pokecenter`

---

## Exemple d'API (POST /account)

Crée un nouveau centre Pokémon (multi-tenant) :

```json
POST /pokecenter/account
{
  "nom": "Pokecenter Test",
  "email": "test@pokecenter.com",
  "motDePasse": "test1234",
  "region": "Kanto",
  "ville": "Carmin"
}
```

Réponse :

```json
{
  "message": "Compte Pokecenter créé avec succès !",
  "account": {
    "id": 1,
    "nom": "Pokecenter Test",
    "email": "test@pokecenter.com",
    "region": "Kanto",
    "ville": "Carmin",
    "dbName": "PC_Carmin_Kanto_1"
  }
}
```

---

## Structure du projet

```
pokecenterManager/
├── src/
│   ├── dto/
│   ├── entity/
│   ├── migration/
│   ├── routes/
│   ├── scripts/
│   ├── service/
│   └── utils/
├── Dockerfile
├── docker-compose.yml
├── ormconfig.account.ts
└── README.md
```