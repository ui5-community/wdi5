# wdi5 ![npm](https://img.shields.io/npm/v/wdi5)

Extension to [`Webdriver.IO`](https://webdriver.io) for testing a hybrid, cordova-wrapped UI5 app on iOS, Android and Electron.
Includes all capabilites of its’ lightweight sibling [`wdio-ui5-service`](https://github.com/js-soft/wdi5/blob/main/wdio-ui5-service/README.md) for browser-scoped tests.

## Table of Contents

<!--ts-->

-   [wdi5](#wdi5-)
    -   [Table of Contents](#table-of-contents)
    -   [Prerequisites](#prerequisites)
    -   [Getting started](#getting-started)
        -   [Installation](#installation)
        -   [browser-scope](#browser-scope)
        -   [General (non-browser) setup](#general-non-browser-setup)
        -   [shared config file](#shared-config-file)
        -   [iOS](#ios)
        -   [Android](#android)
        -   [Electron](#electron)
    -   [Usage](#usage)
    -   [Features specific to wdi5 (vs. wdio-ui5-service)](#features-specific-to-wdi5-vs-wdio-ui5-service)
        -   [Cordova plugins](#cordova-plugins)
    -   [FAQ/hints](#faqhints)
    -   [License](#license)

<!-- Added by: vbuzek, at: Do 12 Nov 2020 14:40:18 CET -->

<!--te-->

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

### browser-scope

Note that even though `wdi5` includes the functionality of its’ lightweight sibling `wdio-ui5-service` (the Webdriver.IO-plugin) for browser-based testing, you _don’t_ need to add `ui5` to the `services`-section of `wdio.conf.js` - the browser-functionality is included when injecting `wdi5` . For this, require 'wdi5/lib/service/wdi5.service' as shown below.

Enhance the `wdio.conf.js`-file with the recommended `wdi5` settings:

```javascript
const WDI5Service = require('wdi5/lib/service/wdi5.service'); // bridge to browser-scope

exports.config = {
    // ...
    baseUrl: "http://localhost:8080", // standard webdriver.io
    // wdi5-specific
    services: [
        'chromedriver',
        [WDI5Service]
    ]
    wdi5: {
        screenshotPath: "./test/report/screenshots",
        logLevel: "verbose", // error | silent | verbose
        platform: "browser", // android | browser | electron | ios
        deviceType: "web" // native (ios, android) | web (browser, electron)
        url: "index.html"
    }
    // ...
    services: [
		'chromedriver',
        [WDI5Service]
    ]
}
```

Then, start your local webserver (e.g. via `$> soerver` in the app directory),

and kick off your tests via `$> npx wdio`.

### General (non-browser) setup

We like to always have all parts of the test-environment running in parallel:

-   manually started simulator/emulator
-   `appium` e.g. via `yarn _startApp:ios` (or `chromedriver` for electron)
-   test execution, e.g. `yarn _test:ios`

You can combine all of the above by running `yarn test:<platform>` (e.g. `yarn test:ios`), catering towards a ci environment, at the cost of losing the flexibility of each tooling.

Also, it is recommended to split up the overall configuration in a shared- and a platform-specific part - this helps with overview and maintenance. See `wdio-shared.conf.js` and `wdio-${platform}.conf.js` in the top-level `/test`-folder as an example.

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

Create an iOS-specific config file (e.g. `wdi5-ios.conf.js`).
In there, `require` the shared config file and set platform-specific options:

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
        permissions: '{"jss.wdi5.sample": {"camera": "yes","notifications": "yes"}}'
    }
];

config.outputDir = path.join('test', 'report', 'logs');

// tell wdi5 we're running on iOS
config.wdi5.platform = 'ios';

exports.config = config;
```

Refer to the [xcuitest-driver capabilities documentation](https://github.com/appium/appium-xcuitest-driver#desired-capabilities) for a complete list of possible settings for the `capabilities`-section!

Start `appium` with your desired switches/flags (we usually just start it "plain", aka `$> appium`).

Then run the tests with iOS-scope à la `$> npx wdio wdio-ios.conf.js`

### Android

First, make sure all prerequisites mentioned in http://appium.io/docs/en/drivers/android-uiautomator2/ for `UiAutomator2`-based testing are installed and fullfilled.

Create an Android-specific config file (e.g. `wdi5-android.conf.js`).
In there, `require` the shared config file and set platform-specific options:

```javascript
const path = require('path');
let config = require('./wdio-shared.conf').config;
require('dotenv').config();

// This defines which kind of device we want to test on, as well as how it should be
// configured.
config.capabilities = [
    {
        automationName: 'UiAutomator2',

        platformName: 'Android',

        // The version of the Android system
        platformVersion: '11',

        // For Android, Appium uses the first device it finds using "adb devices". So, this string simply needs to be non-empty.
        deviceName: 'any',

        chromeOptions: {w3c: false},

        // Where to find the .apk or .ipa file to install on the device. The exact location
        // of the file may change depending on your Cordova version.
        app: path.join(
            'test',
            'ui5-app',
            'app',
            'platforms',
            'android',
            'app',
            'build',
            'outputs',
            'apk',
            'debug',
            'app-debug.apk'
        ),

        // By default, Appium runs tests in the native context. By setting autoWebview to
        // true, it runs our tests in the Cordova context.
        autoWebview: true,

        // When set to true, it will not show permission dialogs, but instead grant all
        // permissions automatically.
        autoGrantPermissions: true,

        isHeadless: false,

        // name this to the AVD emulator of your liking
        avd: 'Pixel_XL_API_30'
    }
];

config.wdi5.platform = 'android';

exports.config = config;
```

Start `appium` with your desired switches/flags (peak at our `/test/wdio-android.conf.js`).

Then run the tests with Android-scope à la `$> npx wdio wdio-android.conf.js`

### Electron

First and foremost: **make sure you’re using the version of `chromedriver` matching the one your electron app is built with.**

As with iOS and Android with electron-specific settings, e.g. in `wdio-electron.conf.js` - note that for the electron-scope, we’re not reusing the shared config file:

```javascript
const path = require('path');
const WDI5Service = require('wdi5/lib/service/wdi5.service'); // bridge to browser-scope

// https://github.com/electron-userland/spectron/issues/74
exports.config = {
    path: '/', // Path to chromedriver endpoint.
    host: 'localhost', // localhost == chromedriver
    port: 9515, // default chromedriver port
    services: [[WDI5Service]],
    chromeDriverLogs: path.join('test', 'report', 'logs'),
    maxInstances: 1, // multi-instance doesn't work (yet :) )
    reporters: ['spec'],
    outputDir: path.join('test', 'report', 'logs'),
    coloredLogs: true,
    framework: 'mocha',
    mochaOpts: {
        timeout: 60000
    },
    capabilities: [
        {
            isHeadless: false,
            browserName: 'chrome',
            'goog:chromeOptions': {
                w3c: false,
                binary: path.join(
                    process.cwd(), // this is important
                    'test',
                    'ui5-app',
                    'app',
                    'platforms',
                    'electron',
                    'build',
                    'mac',
                    'UI5.app',
                    'Contents',
                    'MacOS',
                    'UI5'
                ),
                args: ['remote-debugging-port=9222', 'window-size=1440,800']
            }
        }
    ],
    wdi5: {
        deviceType: 'web', // yep, not "native"
        screenshotPath: path.join('test', 'report', 'screenshots'),
        logLevel: 'verbose',
        platform: 'electron',
        plugins: {
            'phonegap-plugin-barcodescanner': {
                respObjElectron: {
                    text: '123-123-asd',
                    format: 'EAN',
                    cancelled: ''
                },
                scanCode: '123-123-asd',
                format: 'EAN'
            }
        }
    }
};
```

To run the tests,

1. start your electron’s matching `chromedriver` (e.g. via `$> npx chromedriver@85`)
2. use the Webdriver.IO-CLI for test execution: `$> npx wdio wdio-electron.conf.js`

## Usage

Run-(Test-)Time usage of `wdi5` is agnostic to its' test-scope (browser or native) and centers around the global `browser`-object, be it in the browser or on a real mobile device.

Test runs are always started via the regular `webdriver.io`-cli:

```javascript
$> npx wdio
```

Please see the top-level [README](../README.md#Usage) for API-methods and usage instructions.

## Features specific to `wdi5` (vs. `wdio-ui5-service`)

### Cordova plugins

This framework comes with a set of plugin mocks.

List of provided plugin mocks:

-   phonegap-plugin-barcodescanner

To add a new cordova plugin mock, specify a `plugins` object in the `wdi5` object of the config file. Name it _exactly_ as the cordova plugin is named (e.g. "phonegap-plugin-barcodescanner") and use the `path` property to point to your mock implementation file.

Additionally, you can define custom properties for programmatic "responses" during test execution (here: `mockedPluginResponse`).

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

## FAQ/hints

-   performance: integration/e2e-tests are rarely fast. `wdi5` tags along that line, remote-controlling a browser with code and all
    -> watch your timeouts and refer to the [`wdio`-documentation](https://webdriver.io/docs/timeouts.html#webdriverio-related-timeouts) on how to tweak them
-   Android: make sure you have the environment variable `JAVA_HOME` set in _both_ the shell you’re running Appium and in the shell you’re running the test(s) in.
-   Electron: a known pitfall is the chromedriver version. Make sure you run the matching `electron-chromedriver` version to the electron version used to build the binary.
-   `Webdriver.IO`'s watch mode is running, but subsequent `context.executeAsync()`-calls fail - exact cause unknown, likely candidate is `fibers` from `@wdio/sync`
-   In case `... bind() returned an error, errno=0: Address already in use (48)` error shows up during test execution any `chromedriver` service is already running. You need to quit this process eg. by force quiting it in the activity monitor.

## License

see [top-level LICENSE file](../LICENSE)
