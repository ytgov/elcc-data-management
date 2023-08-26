FROM node:18.17.0-alpine3.17

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
