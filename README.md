# wdi5 ![npm](https://img.shields.io/npm/v/wdi5)

`wdi5` (/vdif5/) is a wrapper around [appium](http://appium.io)-driven [`Webdriver.IO`](https://webdriver.io)-tests, utilizing [`UI5`’s test API](https://ui5.sap.com/#/api/sap.ui.test).

It is designed to run cross-platform, executing OPA5-/UIveri5-style integration tests on a UI5 application - in the browser, in a hybrid ([cordova](https://cordova.apache.org)) container or as an Electron application.

![npm (scoped)](https://img.shields.io/npm/v/@openui5/sap.ui.core?label=ui5) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/webdriverio) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/appium)

`wdi5` = UI5 Test API + Webdriver.IO + appium

![demo testing iOS + browser in parallel](./docs/demo-testing.gif)

## about

`wdi5` comes in two flavours:
- `wdio-ui5-service`: a browser-based plugin to `Webdriver.IO`
- `wdi5`: an extension to `Webdriver.IO`, using `appium` to communicate with the hybrid app on iOS, Android and Electron.  
  The `wdi5`-extension contains `wdio-ui5-service`, allowing for both browser-based and hybrid-app-testing.

`wdio-ui5-service` allows for a lightweight setup if test scope is on the browser. As to where the `wdi5`-extension gives you the full "app-package".

## Installation, Setup + Usage

* brower-based "Webdriver.IO"-plugin: [wdio-ui5-service](./wdio-ui-service/README.md)
* hybrid app extension: [wdi5](./wdi5/README.md)


## FAQ/hints

`wdi5` tests itself with `wdi5` - see the `test/`- and `test/ui5-app/test/e2e/` directory for a sample `wdio.conf.js`-files and sample tests.  

Run `yarn test` for `wdi5` testing itself 😊

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
