FROM node:19
WORKDIR /app

# Copier le package.json de la racine (pas de backend/)
COPY ../package*.json ./

RUN npm install

# Copier tout le code backend
COPY . .

EXPOSE 3000
CMD ["node", "appi.js"]