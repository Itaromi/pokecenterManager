---
title: Migration DB
sidebar_position: 5
---

### Base centrale (Comptes)

La base **centrale** gère les **comptes Pokecenter**.

- **Migrations stockées dans :**
  ```
  src/migration/central/
  ```
- **Commandes TypeORM :**

```bash
docker exec -it pokecentermanager-app-1 npm run typeorm -- migration:generate -n CreatePokemonAccountTable -d src/data-source.ts
docker exec -it pokecentermanager-app-1 npm run typeorm -- migration:run -d src/data-source.ts
```

> 🔐 Cela permet de maintenir le schéma des **comptes Pokecenter** à jour.

---

### Bases secondaires (Patients & Soins)

Chaque Pokecenter a sa **propre base**. Les migrations sont **indépendantes** :

- **Migrations stockées dans :**
  ```
  src/migration/account/
  ```
- **Commandes TypeORM pour les bases secondaires :**

```bash
docker exec -it pokecentermanager-app-1 npm run typeorm -- migration:generate src/migration/account/NomMigration -d ormconfig.account.ts
```

> Ces migrations concernent les **patients Pokémon** et leurs **soins**.

---

### Mise à jour automatique via scripts 🔄

Un **script Node.js** est fourni pour appliquer les **migrations à toutes les bases secondaires** :

```bash
docker exec -it pokecentermanager-app-1 node dist/scripts/UpdateAccountDBs.js
```

- Parcourt tous les **comptes Pokecenter**.
- Applique les **migrations** aux bases secondaires existantes.
- Affiche un **log** par base : succès ou échec.

> 🚀 Idéal pour **synchroniser les schémas** des bases secondaires sans tout gérer manuellement.

