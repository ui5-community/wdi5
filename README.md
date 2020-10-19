# wdio-cordova-ui5

**this is not an npm module anymore!**

## Demo

![demo testing iOS + browser in parallel](./docs/demo-testing.gif)

This package was updated to separate the preceding UI5 part into a new package `wdio-ui-service`.

Contains the native cordova part.
Depends on `wdio-ui5-service`.
Use this package to test a UI5 hybrid app on iOS, Android and Electron.

This packages uses [Yarn](https://yarnpkg.com/).

## wdio-ui5-service

Focus on UI5 - browser interaction.
This module enables your WDIO setup to interact with UI5 applications. It provides control selectors and the ability to wait for the UI5 ready event before interacting with the page.

## Prerequisites

* for browser-based testing: running UI5 app that is accessbile via `http(s)://host.ext:port`
  * recommended tooling for this is either the official [UI5 tooling](https://github.com/SAP/ui5-tooling) (`ui5 serve`) or some standalone http server like * [`soerver`](https://github.com/vobu/soerver) or [`http-server`](https://www.npmjs.com/package/http-server)

## Documentation

You can find the extended documentation in:

* [advanced](./docs/advanced.md)
* [wdi5](./wdi5/README.md)
* [wdi5 advanced](./wdi5/docs/advanced.md)
* [wdio-ui5-service](./wdio-ui-service/README.md)

## Test

Package to self test the wdi5 framework with its wdio-ui5-service childpackage.

## FAQ/hints

* sample configurations: `wdi5` tests itself with `wdi5` - see the `test/`- and `test/ui5-app/test/e2e/` directory for a sample `wdio.conf.js` and sample tests.
    Run `npm run test` for `wdi5` testing itself.

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
