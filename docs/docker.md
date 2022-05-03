# Docker

Prerequisite for all this is a working/running docker environment.

## Variants

1. Run a single container that holds

   - sample UI5 JS app incl tests from `wdi5` repo as application under test
   - sample WebdriverIO setup and `wdi5` config
   - local webserver + proxy config serving the UI5 JS app at `localhost:8888`
   - local `ui5-tooling` setup including `ui5-middleware-simpleproxy` serving the UI5 JS app at `localhost:8080`

2. Run a composed setup of four container (sample UI5 JS app as application under test, test resources, chrome, selenium) in parallel to be more flexible and able to switch between browsers.

## Running

### Standalone

a sample execution is provided via a default "entry point":  
`$> docker run --rm -ti wdi5`  
will run the "basic" `wdi5` tests with Chrome headless against a local webserver on `localhost:8888`

In order to provide your own UI5 app, `wdi5` config and/or run your custom test command, mount the respective files and folders into the container and supply bespoken command:

```bash
# --rm auto-removes the container at stop
# -ti makes the container interactive
$> docker run --rm -ti \
# this mounts the UI5 app at ~/_tmp/ui5-js-app/webapp into the container
> -v ~/_tmp/ui5-js-app/webapp:/app/webapp \
# this provides a different wdio/wdi5-config
> -v ~/_tmp/ui5-js-app/wdio.conf.js:/app/wdio.conf.js \
# regular image name
> wdi5 \
# custom command to execute in the container
> node_modules/.bin/wdio
```

## docker image(s) setup

### standalone docker image

`/app` is the working directory:

- `/app/webapp` holds the UI5 app from the repo's `/examples/ui5-js-app/webapp`
- `/app/ui5.yaml` the relevant `ui5-tooling` config
- `/app/package.json` is a standalone `package.json` from the repo's `/docker/package-standalone.json`
- WebdriverIO- + `wdi5`-config is composed of
  - `wdio`: `/app/wdio.base.conf.js` from repo's `/examples/ui5-js-app/wdio.base.conf.js`
  - `wdi5`: `/app/wdio.conf.js` as repo's `/examples/ui5-js-app/wdio-docker-standalone.conf.js`
