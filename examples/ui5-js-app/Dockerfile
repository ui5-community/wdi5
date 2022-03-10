# base image
FROM node:14-alpine3.14

RUN apk update \
    && apk upgrade

# set working directory
WORKDIR /app

# COPY . .
COPY webapp webapp
COPY package.json package.json

RUN npm install

EXPOSE 80

CMD npm start
