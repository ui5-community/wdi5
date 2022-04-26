# Docker

## Variants

1. Run a single container containing application under test, test resources (the tests themselves + the `wdi5` config) and chrome.

2. Run a composed setup of four container (application under test, test resources, chrome, selenium) in parallel to be more flexible and able to switch between e.g. browsers.

## Prerequisite

Prerequisite is a working/ running docker environment.

## Setup

In folder `/docker`.

`package.json` contains dependencies and `npm` tasks needed to run the tests in docker.

Note: there are two `package.json` files in the `/docker/` folder with the only difference of the source of `wdio-ui5-service` source in `devDependencies` This is required to make sure the `wdio-ui5-service` sources are loaded from your local file system and contain the most recent development.

## Available Container

| Container               | Content                                        | Path/Dockerfile                  |
| ----------------------- | ---------------------------------------------- | -------------------------------- |
| UI5 App                 | The application under test                     | `examples/ui5-js-app/Dockerfile` |
| `wdi5` Test Environment | Test resources and environment                 | `docker/Dockerfile.wdi5`         |
| Standalone              | Test resources, app under test, Chrome Browser | `docker/Dockerfile.standalone`   |

## Standalone

Use `Dockerfile.standalone`.

### Execute Standalone

`docker build -f ./docker/Dockerfile.standalone -t test-standalone .`

`docker run -t test-standalone`

## Grid

`docker-compose.yaml` to build and start up all container.

`Dockerfile.wdi5` is the containerized testenvironment.

### Required Container

Four container needed

- Chrome (Image)
- Selenium (Image) [Console](http://localhost:4444/ui/index.html#/)
- Testenvironment (wdi5)
- Application under test [ui5 app](http://localhost:8888)

### Execute Grid

`docker-compose -f ./docker/docker-compose.yaml up`

`docker-compose -f ./docker/docker-compose.yaml down`

#### Single Browser

This setup allows to run tests in multiple browsers. Firefox and Chrome are setup in this test-case and started by default.

By setting environment varaibels `export BROWSERS=<firefox | chrome>` the executed brwoser can be selected.

### Build

`docker-compose -f ./docker/docker-compose.yaml build` (optional, will be excecuted first time by `up`)
OR
`docker-compose -f ./docker/docker-compose.yaml build <wdi5 | test-pp>` to just build a single container
