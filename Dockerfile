FROM node:10.15.3-alpine
WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .
COPY src ./src

RUN mkdir -p requests

RUN npm ci
RUN npm run lint

ENTRYPOINT [ "node", "./src/index.js" ]
