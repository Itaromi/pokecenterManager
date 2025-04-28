---
sidebar_position: 1
---

1. **Cloner le projet :**

```bash
git clone https://github.com/ton-compte/pokecenterManager.git
cd pokecenterManager
```

2. **Configurer les variables d'environnement :**

Crée un fichier `.env` à la racine du projet (si besoin en local) :

```dotenv
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=monutilisateur
DATABASE_PASSWORD=motdepassedelabase
DATABASE_NAME=mabasepokemon
ENCRYPTION_SECRET=monSuperSecretPoké123
```

> 🔒 **Production :** utilise **Docker Secrets** pour les mots de passe et clés sensibles (cf section Sécurité).

3. **Lancer les conteneurs Docker :**

```bash
docker-compose up --build
```

Cela démarre :
- L'API Express (port 3000)
- PostgreSQL (port 5432)

4. **Vérifier l'API :**

Accède à :

```
http://localhost:3000/pokecenter
```

Tu peux tester l'API avec **Insomnia** ou **Postman**.

