# Installation

...can be either done by using the [Webdriver.IO `cli`](https://webdriver.io/docs/gettingstarted.html) or manually.

## guided install via `wdio` cli

- cd into folder with UI5 app
- npx wdio
  w/ these bare bones settings: - local - chromedriver - ui5 - mocha
- add wdi5 config object
  - make sure screenshot dir exists
- edit UI5.app's package.json to read "test": "wdio run wdio.conf.js"

## manual installation

...
