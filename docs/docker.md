# docker

Prerequisite for all this is a working/running docker environment.

## variants

1. Run a single container that holds:

   - sample UI5 JS app incl tests from `wdi5` repo as application under test
   - sample WebdriverIO setup and `wdi5` config
   - `Google Chrome` in included as web browser for running the UI5 app (can only run in `headless` mode from the image, due to missing X-environment)
   - local webserver + proxy config serving the UI5 JS app at `<docker-container>:8888`
   - local `ui5-tooling` setup including `ui5-middleware-simpleproxy` serving the UI5 JS app at `<docker-container>:8080`

2. (soon) Run a composed setup of four container (sample UI5 JS app as application under test, test resources, chrome, selenium) in parallel to be more flexible and able to switch between browsers.

## running

### standalone

The `wdi5` version is published as a docker image for all major `Node.js`-versions at <https://github.com/js-soft/wdi5/pkgs/container/wdi5>

Pick the desired `wdi5`-version and the Node.js-version, e.g. for `wdi5` Release Candidate 4.3 and `node 17`:  
`$> docker pull ghcr.io/js-soft/wdi5:0.9.0-rc4.3-node17` retrieves the image.

A sample execution is provided via a default "entry point":  
`$> docker run --rm -ti ghcr.io/js-soft/wdi5:0.9.0-rc4.3-node17`  
will run the "basic" `wdi5` tests with Chrome headless against a local webserver on `localhost:8888`

The image serves `/app/webapp` both via the `ui5-server` at `http://<docker-container>:8080` and via a regular webserver ([`soerver`](https://www.npmjs.com/package/soerver)) at `http://<docker-container>:8888`. Both proxy request to a OData v2 sample service - [see the proxy config file](https://github.com/js-soft/wdi5/blob/main/examples/ui5-js-app/webapp/proxyrc.json) and the [ui5.yaml](https://github.com/js-soft/wdi5/blob/main/examples/ui5-js-app/ui5.yaml) for details on target host and "mountpoint".

In order to expose your own UI5 app + `wdi5` config to the docker container and/or run your custom test command, mount the respective files and folders into the container and supply bespoken command:

```bash
# --rm auto-removes the container at stop
# -ti makes the container interactive
$> docker run --rm -ti \
# this mounts the UI5 app at ~/_tmp/ui5-js-app/webapp into the container
> -v ~/_tmp/ui5-js-app/webapp:/app/webapp \
# this provides a different wdio/wdi5-config
> -v ~/_tmp/ui5-js-app/wdio.conf.js:/app/wdio.conf.js \
# regular image name
> ghcr.io/js-soft/wdi5:0.9.0-rc4.3-node17 \
# custom command to execute in the container (against Chrome only)
> node_modules/.bin/wdio
```

Note that as of now, only `Google Chrome` is inlcuded as a web browser for running the tests, which can only run in headless mode in the container.

### composed scenario

(soon)

## docker image(s) setup

### standalone docker image

`/app` is the working directory:

- `/app/webapp` holds the UI5 app from the repo's `/examples/ui5-js-app/webapp`
- `/app/ui5.yaml` the relevant `ui5-tooling` config
- `/app/package.json` is a standalone `package.json` from the repo's `/docker/package-standalone.json`
- WebdriverIO- + `wdi5`-config is composed of
  - `wdio`: `/app/wdio.base.conf.js` from repo's `/examples/ui5-js-app/wdio.base.conf.js`
  - `wdi5`: `/app/wdio.conf.js` as repo's `/examples/ui5-js-app/wdio-docker-standalone.conf.js`

### swarm

(soon)
