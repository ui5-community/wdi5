# wdi5 ![npm](https://img.shields.io/npm/v/wdi5)

Extension to  [`Webdriver.IO`](https://webdriver.io) for testing a hybrid, corodva-wrappe UI5 app on iOS, Android and Electron.
Includes all capabilites of its’ lightweight sibling [`wdio-ui5-service`](../wdio-ui5-service/README.md) for browser-scoped tests.

## Prerequisites

-   UI5 app (built with `cordova`)
    -   iOS: `.ipa` (device-type build) or `.app` (emulator-type build) + iOS simulator
    -   Android: `.apk` + emulator
    -   Electron: binary
-   node version >= `12.x` (`lts/erbium`)
-   (optional) `yarn` 
    during development, we rely on `yarn`’s workspace-features - that’s why we refer to `yarn` instead of `npm` in the docs, even though using `npm` as an equivalent shold be fine too

## Getting started

### Installation

Using `wdi5` is essentially configuring `wdio` with `wdi5`-specific options on top.
The recommended development approach is to first write and execute the tests in the browser-context, then run the tests on native devices/emulators or against the `electron`-app.

```zsh
# install the node module
$> yarn add -D wdi5

# Generate a standard `wdio.conf.js` via the
# standard webdriver.io-tools:
$> npx wdio config # this will also install standard wdio-dependencies
```

Enhance the `wdio.conf.js`-file with the recommended `wdi5` settings:

```javascript
baseUrl: "http://localhost:8080", // standard webdriver.io
// wdi5-specific
wdi5: {
    screenshotPath: "./test/report/screenshots",
    logLevel: "verbose", // error | silent | verbose
    platform: "browser", // android | browser | electron | ios
    deviceType: "web" // native (ios, android) | web (browser, electron)
}
```

### General setup

We like to always have all parts of the test-environment running in parallel:

- manually started simulator/emulator
- `appium` e.g. via `yarn _startApp:ios`
- test execution, e.g. `yarn _test:ios`

You can combine all of the above by running `yarn test:ios`, e.g. in a ci environment, at the cost of losing the flexibility of each tooling.

Also, it is recommended to split up the overall configuration in a shared- and a platform-specific part - this helps with overview and maintenance. See `wdio-shared.conf.js` and `wdio-${platform}.conf.js` in the  top-level `/test`-folder as an example.

### shared config file

Setup appium-specific and platform-independent configuration settings in a `wdio-shared.conf.js` :

```javascript
const WDI5Service = require('wdi5')
exports.config = { // we export it as a module since this file is required in wdio-${platform}.conf.js
    // 4723 is the default port for Appium
    port: 4723,
	maxInstances: 1,
	// path to tests 
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],
    // tell wdio to use the wdi5 extenstion
    services: [
        [WDI5Service]
    ],
    waitforTimeout: 60000, // well...
    // syntax style for the test files
	framework: 'mocha',
    mochaOpts: {
        timeout: 90000 // well...
    },
    
    wdi5: {
        deviceType: 'native' // native | web
        screenshotPath: require('path').join('test', 'report', 'screenshots'),
        logLevel: 'verbose', // error | verbose | silent
        // platform: '...', // browser | android | ios | electron -> set in wdio-${platform}.conf.js
    }
}
```

### iOS

First, make sure all prerequisites mentioned in <http://appium.io/docs/en/drivers/ios-xcuitest/index.html> for `XCUITest`-based testing are fullfilled.

Require shared config file and set platform-specific options:

```javascript
const path = require('path');
let config = require('./wdio-shared.conf').config;
config.capabilities = [ 
    {
        automationName: 'XCUITest',
        platformName: 'iOS',

        // iOS version
        platformVersion: '14.0',

        // For iOS, this must exactly match the (simulator) device name as seen in Xcode.
        deviceName: 'iPhone 11',

        // Where to find the .apk or .ipa file to install on the device. 
        // The exact location of the file may change depending on your cordova build!
        app: path.join('test', 'ui5-app', 'app', 'platforms', 'ios', 'build', 'emulator', 'UI5.app'),
        
        // by default, appium runs tests in the native context. By setting autoWebview to
        // true, it runs our tests in the Cordova context.
        autoWebview: true,

        // display simulator window
        isHeadless: false,

        // http://appium.io/docs/en/drivers/ios-xcuitest/#capabilities
        // https://appiumpro.com/editions/43-setting-ios-app-permissions-automatically
        // https://github.com/wix/AppleSimulatorUtils
        permissions: "{\"jss.wdi5.sample\": {\"camera\": \"yes\",\"notifications\": \"yes\"}}"
    }
];

config.outputDir = path.join('test', 'report', 'logs');

// tell wdi5 we're running on iOS
config.wdi5.platform = 'ios';

exports.config = config;
```

Refer to the [xcuitest-driver capabilities documentation](https://github.com/appium/appium-xcuitest-driver#desired-capabilities) for a complete list of possible settings for the `capabilities`-section!

## Usage

Run-(Test-)Time usage of `wdi5` is agnostic to its' test-scope (browser or native) and centers around the global `browser`-object, be it in the browser or on a real mobile device.

Please see the top-level [README](../README.md#Usage) for API-methods and usage instructions.

## Features specific to `wdi5` (vs. `wdio-ui5-service`)

### Cordova plugins

This framework comes with a set of plugin mocks.

List of provided plugin mocks:

- phonegap-plugin-barcodescanner

To add a new cordova plugin mock, specify a `plugins` object in the `wdi5` object of the config file. Name it _exactly_ as the cordova plugin is named (e.g. "phonegap-plugin-barcodescanner") and use the `path` property to point to your mock implementation file. Additionally, you can define custom properties for programmatic "responses" during test execution (here: `mockedPluginResponse`).

```javascript
plugins: {
        'phonegap-plugin-barcodescanner': {
            path: "./to/mock/implementation.js",
            mockedPluginResponse: {
                text: '123123',
                format: 'EAN',
                cancelled: ''
            }
        },
        'other-cordova-plugin': {
            path: "./other/mock/implementation/path.js"
        }
    }
```

Check the `Cordova Plugin Mock Development` section under `How it works` in this documentation for further information.

## FAQ/hints

* performance: integration/e2e-tests are rarely fast. `wdi5` tags along that line, remote-controlling a browser with code and all
    -> watch your timeouts and refer to the [`wdio`-documentation](https://webdriver.io/docs/timeouts.html#webdriverio-related-timeouts) on how to tweak them

* Electron: a known pitfall is the chromedriver version. Make sure you run the matching `electron-chromedriver` version to the  electron version used to build the binary.

* `Webdriver.IO`'s watch mode is running, but subsequent `context.executeAsync()`-calls fail - exact cause unknown, likely candidate is `fibers` from `@wdio/sync`

* In case `... bind() returned an error, errno=0: Address already in use (48)` error shows up during test execution any `chromedriver` service is already running. You need to quit this process eg. by force quiting it in the activity monitor.

## License

see [top-level LICENSE file](../LICENSE)
