# Stage 1 - api build - requires development environment because typescript
FROM node:18-alpine3.17 as api-build-stage

ENV NODE_ENV=development

WORKDIR /usr/src/api

COPY api/package*.json ./
COPY api/tsconfig*.json ./
RUN npm install

COPY api ./

RUN npm run build

# State 2 - web build - requires development environment because typescript
FROM node:18-alpine3.17 as web-build-stage

ENV NODE_ENV=development

WORKDIR /usr/src/web

COPY web/package*.json ./
COPY web/tsconfig*.json ./
COPY web/vite.config.js ./
RUN npm install

COPY web ./

RUN npm run build

# Stage 3 - production setup
FROM node:18-alpine3.17

RUN apk add --no-cache tzdata

RUN cp /usr/share/zoneinfo/America/Whitehorse /etc/localtime
RUN echo "America/Whitehorse" > /etc/timezone
RUN apk del tzdata

ENV NODE_ENV=production
USER node

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

# TODO: find out why the db folder is necessary
RUN mkdir /home/node/app/db && chown -R node:node /home/node/app/db

COPY --from=api-build-stage --chown=node:node /usr/src/api/package*.json ./
RUN npm install && npm cache clean --force --loglevel=error

COPY --from=api-build-stage --chown=node:node /usr/src/api/dist/src ./dist
COPY --from=web-build-stage --chown=node:node /usr/src/web/dist ./dist/web

EXPOSE 8080

COPY --from=api-build-stage --chown=node:node /usr/src/api/bin/boot-app.sh ./bin/
RUN chmod +x ./bin/boot-app.sh

ENTRYPOINT ["./bin/boot-app.sh"]
