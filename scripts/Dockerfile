FROM node:20

WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY ./package.json ./package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code du dossier scripts dans le conteneur
COPY ./ ./

CMD ["node", "log_scraper.js"]

