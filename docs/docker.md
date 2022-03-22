# Docker

## Prerequisite

Prerequisite is a working/ running docker environment.

## Available Container

| Container             | Content                                        |
| --------------------- | ---------------------------------------------- |
| UI5 App               | The application under test                     |
| WDI5 Test Environment | Test resources and environment                 |
| Standalone            | Test resources, app under test, Chrome Browser |

## Standalone

Use `Dockerfile.standalone`.

### Execute

`docker build -f ./docker/Dockerfile.standalone -t test-standalone .`
`docker run -t test-standalone`

## Grid

### Required Container

Four container needed

- Chrome (Image)
- Selenium (Image)
- Testenvironment (wdi5)
- Application under test (ui5 app)

### Execute

`docker-compose -f ./docker/docker-compose.yaml build` (optional, will be excecuted first time by `up`)
`docker-compose -f ./docker/docker-compose.yaml up`
`docker-compose -f ./docker/docker-compose.yaml down`
