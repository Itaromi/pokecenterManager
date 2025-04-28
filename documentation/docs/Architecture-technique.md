---
title: Architecture technique
sidebar_position: 4
---

### Schéma du projet (TypeORM, PostgreSQL, multi-tenant)

L'architecture est basée sur un modèle **multi-tenant avec bases de données séparées** :
Ò
- Une **base centrale** :
    - Stocke les **comptes Pokecenter**.
    - Gère la création de bases secondaires.

- Des **bases secondaires** (une par Pokecenter) :
    - Stockent les **patients Pokémon** et leurs **soins**.
    - Schéma appliqué à la création via TypeORM + synchronize ou migrations.


```
+-----------------------+
| Base Centrale         |
|-----------------------|
| comptes Pokecenter    |
+-----------------------+
         |
         | Crée
         v
+-----------------------+
| Base Secondaire (ex)  |
|-----------------------|
| patients Pokémon     |
| soins Pokémon        |
+-----------------------+
```

Le backend utilise **TypeORM** pour la gestion des entités et des migrations.

---

### Chiffrement AES (explication rapide)

- **Algorithme :** AES-256-CBC
- **Bibliothèque :** `crypto` natif Node.js
- **Clé :** Fournie via la variable d'environnement `ENCRYPTION_SECRET`
- **IV :** Généré aléatoirement pour chaque champ (stocké avec les données)

**Données chiffrées :**
- Email
- Nom du Pokecenter
- Ville, Région
- Patients : Nom, Sexe, etc.

Cela permet de **protéger les données sensibles** tout en les stockant en base PostgreSQL.

---

### Docker Compose & Secrets

- **Docker Compose** orchestre les services (API + PostgreSQL).
- **Secrets Docker** permettent de stocker les mots de passe et clés sensibles de manière sécurisée (hors .env).

**Exemple :**

```yaml
secrets:
  db_password:
    external: true
  encryption_secret:
    external: true
```

Les secrets sont ensuite montés dans `/run/secrets/` et lus dans le code via `fs.readFileSync`.

> 🛡️ Cette approche permet de **renforcer la sécurité** en environnement de production.

