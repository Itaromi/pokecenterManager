---
title: Déploiement
sidebar_position: 7
---

### Docker Compose (production)

1. **Configurer les secrets Docker :**

```bash
echo "monSuperSecretPoké123" | docker secret create encryption_secret -
echo "motdepasseDB" | docker secret create db_password -
```

2. **Lancer en mode détacher (background) :**

```bash
docker-compose -f docker-compose.yml up -d
```

3. **Vérifier les conteneurs :**

```bash
docker ps
```

4. **Surveiller les logs :**

```bash
docker-compose logs -f
```

> 🔐 Le **.env** ne contient que les variables non sensibles (comme `DATABASE_HOST`), les mots de passe/clés sont stockés en secrets.

---

### Déploiement Cloud Run GCP (optionnel)

1. **Build l'image Docker :**

```bash
docker build -t gcr.io/[PROJECT_ID]/pokecenter-api .
```

2. **Push l'image vers Google Container Registry :**

```bash
gcloud auth configure-docker
docker push gcr.io/[PROJECT_ID]/pokecenter-api
```

3. **Déployer sur Cloud Run :**

```bash
gcloud run deploy pokecenter-api \
  --image gcr.io/[PROJECT_ID]/pokecenter-api \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

4. **Configurer les variables d'environnement sur Cloud Run :**

Utiliser l'interface GCP pour ajouter :
- `DATABASE_HOST`, `DATABASE_PORT`, etc.
- `ENCRYPTION_SECRET`

> 🌐 Cloud Run est **serverless**, il adapte automatiquement le nombre de conteneurs.

---

Cette approche permet de déployer facilement **en local ou dans le cloud**.

