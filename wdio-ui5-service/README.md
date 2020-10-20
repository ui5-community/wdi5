# wdio-ui5-service ![npm](https://img.shields.io/npm/v/wdi5-service)

`WebdriverIO`-plugin for `wdi5`.

It provides the `ui5`-service to `WebdriverIO`, running tests in the browser.

## Installation

To keep it lightweight, `wdio-ui5-service` has zero dependencies. This means you have to setup `WebdriverIO` as a prerequisite as described in https://webdriver.io/docs/gettingstarted.html.

```bash
$> npm i --save-dev @wdio/cli
# generate config file
$> npx wdio config -y # this will also install dependencies
```

Add `wdio-ui5-service` as a (dev)dependency to your `package.json` via

`$> npm install wdio-ui5-service --save-dev`  
or  
`$> yarn add -D wdio-ui5-service`

```json
{
    "dependencies": {
        "wdio-ui5-service": "^0.0.1"
    }
}
```

Then add the `ui5`-service to the standard `wdio.conf.js`:

```javascript
...
services: [
    // other services like 'chromedriver'
    // ...
    'ui5'
]
...
```

Finally, pass in configuration options for `wdi5` in your `WebdriverIO`-conf file:

```javascript
wdi5: {
    screenshotPath: path.join('test', 'report', 'screenshots'),
    logLevel: 'verbose', // error | verbose | silent
    platform: 'browser', // browser | android | ios | electron
    url: 'index.html', // path to your bootstrap html file
    deviceType: 'web' // native | web
}
```

## Features specific to `wdio-ui5-service`

-   navigation function `goTo` [Navigation](#Navigation).

## Navigation

The UI5 webapp can navigate to a View via `goTo(options)` in one of two ways:

-   updating the browser hash
    ```javascript
    browser.goTo({sHash: '#/test'});
    ```
-   using the UI5 router [navTo](https://openui5.netweaver.ondemand.com/api/sap.ui.core.routing.Router#methods/navTo) function
    ```javascript
    browser.goTo(
        oRoute: {
            sComponentId,
            sName,
            oParameters,
            oComponentTargetInfo,
            bReplace
        }
    )
    ```

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
