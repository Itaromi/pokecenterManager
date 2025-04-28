---
sidebar_position: 2
---

### Environnement de développement (local)

Utilise un fichier `.env` :

```dotenv
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=monutilisateur
DATABASE_PASSWORD=motdepassedelabase
DATABASE_NAME=mabasepokemon
ENCRYPTION_SECRET=monSuperSecretPoké123
```

Ce fichier est **non versionné** (protégé par `.gitignore`).

### Environnement de production (Docker Secrets)

Pour la production, remplace les variables sensibles par des **secrets Docker**.

1. **Créer les secrets :**

```bash
echo "motdepassedelabase" | docker secret create db_password -
echo "monSuperSecretPoké123" | docker secret create encryption_secret -
```

2. **Modifier le `docker-compose.yml` :**

```yaml
services:
  app:
    secrets:
      - db_password
      - encryption_secret

secrets:
  db_password:
    external: true
  encryption_secret:
    external: true
```

3. **Lire les secrets dans le code :**

Dans `data-source.ts` (via Node.js `fs`) :

```ts
import fs from 'fs';

const getSecretOrEnv = (filePath: string, envVar: string): string => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8').trim();
  }
  return process.env[envVar] || '';
};

const dbPassword = getSecretOrEnv('/run/secrets/db_password', 'DATABASE_PASSWORD');
```

---

Cette méthode permet de garder les **clés sensibles hors du code et des fichiers versionnés** 🔐.

