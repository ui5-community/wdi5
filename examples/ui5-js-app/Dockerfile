# base image
FROM node:14-alpine3.14

RUN apk update \
    && apk upgrade

# set working directory
WORKDIR /app

# COPY . .
COPY ./examples/ui5-js-app/webapp webapp
COPY ./docker/package.json package.json

RUN npm install

EXPOSE 8888

CMD npm start
