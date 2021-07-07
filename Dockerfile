FROM node:lts-alpine

WORKDIR /app

COPY ./src src
COPY ./api.yaml api.yaml
COPY ./error_log.txt error_log.txt
COPY ./package.json package.json
COPY ./yarn.lock yarn.lock

RUN yarn install

RUN pwd

CMD ["yarn", "start"]


