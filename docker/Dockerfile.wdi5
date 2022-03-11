
# base image
FROM node:14-alpine3.14

RUN apk update \
    && apk upgrade

# set working directory
WORKDIR /app

# COPY all to root
COPY examples/ui5-js-app/webapp/test test
COPY examples/ui5-js-app/package.json package.json
COPY examples/wdio-browser-docker.conf.js wdio-browser-docker.conf.js

RUN npm install

# TODO: set path and rm navigation to wait-on
# ENV PATH /app/node_modules/.bin:$PATH
# node_modules/.bin/

CMD node_modules/.bin/wait-on tcp:selenium-hub:4444 && npm run test
