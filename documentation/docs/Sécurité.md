---
title: Sécurité
sidebar_position: 6
---

### Gestion du chiffrement AES

- **Algorithme :** AES-256-CBC (Advanced Encryption Standard)
- **Clé :** Définie via la variable d'environnement `ENCRYPTION_SECRET`
- **Données chiffrées :**
    - Emails
    - Noms
    - Ville, Région
    - Patients : Nom, Sexe, etc.

Chaque valeur est chiffrée avec un **IV (initialization vector)** unique stocké avec le champ.

> 🛡️ Permet de garantir la **confidentialité** même en cas de fuite de la base.

**Extrait de code :**

```ts
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET!, 'salt', 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
```

---

### Hashage des mots de passe (bcrypt)

- **Algorithme :** bcrypt (fonction de hachage lente pour protéger les mots de passe)
- **Bibliothèque :** `bcrypt`
- **Salt rounds :** 10 (nombre d'itérations pour ralentir les attaques bruteforce)

> 🌟 Contrairement au chiffrement, le hashage est **non réversible**.

**Extrait de code :**

```ts
import bcrypt from 'bcrypt';

const hash = await bcrypt.hash(plainPassword, 10);
const isMatch = await bcrypt.compare(inputPassword, hash);
```

---

### Secrets Docker

En production, les mots de passe et clés sensibles sont gérés via **Docker Secrets** et non dans `.env`.

- **Création de secrets :**

```bash
echo "monSuperSecretPoké123" | docker secret create encryption_secret -
echo "motdepasseDB" | docker secret create db_password -
```

- **Intégration dans `docker-compose.yml` :**

```yaml
services:
  app:
    secrets:
      - encryption_secret
      - db_password

secrets:
  encryption_secret:
    external: true
  db_password:
    external: true
```

> 🔒 Les secrets sont montés dans `/run/secrets/` et lus via `fs.readFileSync` dans le code.

---

Cette approche garantit que **les données sensibles restent protégées** en toutes circonstances.

