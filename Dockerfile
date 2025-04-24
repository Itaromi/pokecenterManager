# Étape 1 : Builder l'app
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et lockfile pour installer les deps
COPY package*.json ./

RUN npm ci

# Copier le reste du code
COPY . .

# Étape 2 : Image finale
FROM node:20-alpine

WORKDIR /app

# Copier seulement les deps et le code buildé depuis builder
COPY --from=builder /app ./

# Expose le port (ajuste si besoin)
EXPOSE 3000

CMD ["npm", "run", "dev"]