## recommended: install via `wdio` cli config walkthrough

- cd into folder with UI5 app
- npx wdio
  w/ these bare bones settings: - local - chromedriver - ui5 - mocha
- add wdi5 config object
  - make sure screenshot dir exists
- edit UI5.app's package.json to read "test": "wdio run wdio.conf.js"

## manual installation

...
