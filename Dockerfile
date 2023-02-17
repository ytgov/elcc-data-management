FROM node:18-alpine3.17

RUN apk add --no-cache tzdata

RUN cp /usr/share/zoneinfo/America/Whitehorse /etc/localtime
RUN echo "America/Whitehorse" > /etc/timezone
RUN apk del tzdata

RUN mkdir /home/node/web && chown -R node:node /home/node/web
WORKDIR /home/node/web
COPY --chown=node:node src/web/package*.json ./
RUN npm install && npm cache clean --force --loglevel=error
COPY --chown=node:node src/web ./

RUN mkdir /home/node/app && chown -R node:node /home/node/app
RUN mkdir /home/node/app/db && chown -R node:node /home/node/app/db
WORKDIR /home/node/app
COPY --chown=node:node src/api/package*.json ./

ENV NODE_ENV=test
USER node
RUN npm install && npm cache clean --force --loglevel=error
COPY --chown=node:node src/api ./

RUN npm run build

WORKDIR /home/node/web
ENV NODE_ENV=production

RUN npm run build

WORKDIR /home/node/app
EXPOSE 3000
USER node

CMD ["node", "./dist/index.js"]
