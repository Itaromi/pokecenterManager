# Utilise une image Node.js LTS basee sur Alpine (petite taille)
FROM node:20-alpine

# Cree et definit le repertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (ou yarn.lock)
# AVANT le reste pour optimiser le cache de build Docker
COPY package*.json ./

# Installe TOUTES les dependances (y compris devDependencies pour nodemon/ts-node en dev)
RUN npm install

# Copie tout le reste du code source
# Ce code sera remplace par le volume de montage en mode dev, mais necessaire pour un build 'proche production'
COPY . .

# Expose le port sur lequel votre application Express va ecouter
EXPOSE 3000

# Commande par defaut pour lancer l'application (sera surchargee par docker-compose en dev)
# Assurez-vous que cela correspond a la sortie de compilation si vous lancez en prod
CMD ["node", "dist/index.js"]
# Adapter 'dist/index.js' si votre point d'entree compile est different