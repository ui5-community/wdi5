# wdi5 ![npm](https://img.shields.io/npm/v/wdi5)

`wdi5` (/vdif5/) is a wrapper around [appium](http://appium.io)-driven [`Webdriver.IO`](https://webdriver.io)-tests, utilizing [`UI5`’s test API](https://ui5.sap.com/#/api/sap.ui.test) by using the [wdio-ui5-service](../wdio-ui5-service) which is a direct dependecy.

It is designed to run cross-platform, executing OPA5-/UIveri5-style integration tests on a UI5 application - in the browser, in a hybrid ([cordova](https://cordova.apache.org)) container or as an Electron application.

![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/webdriverio) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/appium)

`wdi5` = UI5 Test API (wdio-ui5-service) + Webdriver.IO + appium

## Table of Contents

<!--ts-->
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Advanced configuration](#advanced-configuration)
* [Control selectors](#control-selectors)
  * [Hint](#hint)
* [API methods](#api-methods)
  * [all UI5 control's native methods](#all-ui5-controls-native-methods)
  * [getAggregation](#getaggregation)
  * [enterText](#entertext)
  * [Function mock for event handler](#function-mock-for-event-handler)
* [Assertions](#assertions)
* [Screenshots](#screenshots)
* [Logger](#logger)
* [FAQ/hints](#faqhints)
* [License](#license)

<!-- Added by: vbuzek, at: Mo 24 Aug 2020 18:14:23 CEST -->

<!--te-->
## Dependencies

wdi5 is directly dependent on wdio-ui5-service

## Prerequisites

* for hybrid app testing:
  * iOS: `.ipa` (device-type build) or `.app` (emulator-type build) + iOS simulator
  * Android: `.apk` + emulator
  * Electron: binary
* node version >= `12.x` (`lts/erbium`)

## Getting Started

Using `wdi5` is essentially configuring `wdio` with `wdi5`-specific options on top.
The recommended development approach is to first write and execute the tests in the browser-context, then run the tests on native devices/emulators or against the `electron`-app.

### Installation

```zsh
# install the node module
$> npm install wdi5

# Generate a standard `wdio.conf.js` via the
# standard webdriver.io-tools:
$> npx wdio config
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

In your actual test(s), kick-off `wdi5`:

```javascript
const wdi5 = require('wdi5')();

it("should find a button's texts and click it", () => {
    // "browser" is a wdio-native global variable
    // and applies both in the web- and native-context
    // as a pointer to the client
    browser.url('index.html'); // navigate to UI5 bootstrap page relative to "baseUrl"

    const selector = {
        // standard OPA5/UIveri5-selectors!
        selector: {
            id: 'NavFwdButton',
            viewName: 'test.Sample.view.Main'
        }
    };

    const oButton = browser.asControl(selector);
    const sText = oButton.getText(); // UI5 API syntax!

    expect(sText).toStrictEqual('to Other view');

    oButton.press(); // UI5 API syntax!

    // do sth after navigation has taken place
    // ...
});
```

Given there's setup work for `wdi5`, it is recommended to externalize this into the outermost `before()`-hook, which is ommitted for brevity here. Please see the `tests` folder for advanced examples of using `wdi5`.

Run the test via `wdio`:

```shell
$> npx wdio run test/wdio.conf.js --spec test/ui5-app/test/e2e/test-basic.js

Execution of 1 spec files started at ...
# ...
"spec" Reporter:
------------------------------------------------------------------
[chrome  mac os x #0-0] Spec: /Users/your/app/test/ui5-app/test/e2e/test-basic.js
[chrome  mac os x #0-0] Running: chrome on mac os x
[chrome  mac os x #0-0] Session ID: ab244b205b737ceee9c95499b1cc0236
[chrome  mac os x #0-0]
[chrome  mac os x #0-0] ui5 basics: properties and navigation
[chrome  mac os x #0-0]    ✓ navigation button w/ text exists
[chrome  mac os x #0-0]    ✓ getProperty("text") and getText() are equivalent
[chrome  mac os x #0-0]    ✓ sets the property of a control successfully
[chrome  mac os x #0-0]    ✓ should navigate via button click to list page
[chrome  mac os x #0-0]    ✓ control id retrieval methods are equivalent
[chrome  mac os x #0-0]
[chrome  mac os x #0-0] 5 passing (9.4s)

Spec Files:      1 passed, 1 total (100% completed) in 00:00:15
```

## Advanced configuration

please see the `advanced`-doc for setting up native + electron platforms.

## Assertions

Recommendation is to use the WDIO extension of JEST [expect](https://jestjs.io/docs/en/expect) and [matchers](https://jestjs.io/docs/en/using-matchers).

## Screenshots

At any point in your test(s), you can screenshot the current state of the UI:

```javascript
const wdi5 = require('wdi5');
it('...', () => {
    // ...
    wdi5().getUtils().takeScreenshot('some-id');
    // ...
});
```

This works _cross-device_ and puts a `png` into the configured `wdi5.screenshotPath` (in `wdio.conf.js`).

The file name is prepended with a date indicator (M-d-hh-mm-ss), holds `screenshot` in the filename and is appended with the id you provide (here: `some-id`).
Example: `5-5-17-46-47-screenshot--some-id.png`

## Logger

For convenient console output, use `wdi5().getLogger()`. It supports the `syslog`-like levels `log`,`info`, `warn` and `error`:

```javascript
const wdi5 = require('wdi5');
wdi5().getLogger().log('any', 'number', 'of', 'log', 'parts');
```

The log level is set by the either in `wdio.conf.js` via `wdi5.logLevel` or by `wdi5().getLogger().setLoglevel(level = {String} error | verbose | silent)`

## FAQ/hints

* performance: integration/e2e-tests are rarely fast. `wdi5` tags along that line, remote-controlling a browser with code and all
    -> watch your timeouts and refer to the [`wdio`-documentation](https://webdriver.io/docs/timeouts.html#webdriverio-related-timeouts) on how to tweak them

* Electron: a known pitfall is the chromedriver version. Make sure you run the fitting `electron-chromedriver` version to your electron version used for the binary.

* `Webdriver.IO`'s watch mode is running, but subsequent `context.executeAsync()`-calls fail - exact cause unknown, likely candidate is `fibers` from `@wdio/sync`

* In case `... bind() returned an error, errno=0: Address already in use (48)` error shows up during test execution any `chromedriver` service is already running. You need to quit this process eg. by force quiting it in the activity monitor.

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
