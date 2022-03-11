# base image
FROM node:14.15-buster

RUN  apt-get update \
     # See https://crbug.com/795759
     && apt-get install -yq libgconf-2-4 \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# COPY all to root
COPY ./ui5-js-app/webapp/test/e2e/ e2e
COPY ./ui5-js-app/package.json package.json
COPY ./ui5-js-app/wdio-docker-standalone.conf.js wdio-docker-standalone.conf.js

RUN npm install

CMD npm run test:docker
