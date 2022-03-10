# Docker

Prerequisite is a working/ running docker environment.

`docker-compose -f ./test/docker-compose.yaml build` (optional, will be excecuted first time by `up`)
`docker-compose -f ./test/docker-compose.yaml up`
`docker-compose -f ./test/docker-compose.yaml down`

Four container needed

- Chrome (Image)
- Selenium (Image)
- Testenvironment ()
- Application under test ()
