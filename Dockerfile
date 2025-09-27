FROM node:20 AS express-app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["npm", "start"]