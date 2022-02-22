# get on up aboard ⛵️

"the more, the merrier" also holds true for contributions to `wdi5` 🤗

## prerequisites

- npm >= 7 - because we're using npm's `workspaces` feature

## set up the dev env

- npm run build
  (work)
- npm run build:watch

if you add tests in one of the sample apps, "reinstall" `wdi5` in the respective `npm` workspace
by doing `$> npm install` in the project root.

## work on a single test

recommended approach:

- run server in terminal 1
- run test in terminal 2

## work on the docs

- npm i -g docsify-cli
- docsify serve ./docs -> <http://localhost:3000>
