# wdi5

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

`wdi5` (/vdif5/) is a wrapper around [appium](http://appium.io)-driven [`Webdriver.IO`](https://webdriver.io)-tests, utilizing [`UI5`’s test API](https://ui5.sap.com/#/api/sap.ui.test).

It is designed to run cross-platform, executing OPA5-/UIveri5-style integration tests on a UI5 application - in the browser, in a hybrid ([cordova](https://cordova.apache.org)) container or as an Electron application.

`wdi5` = UI5 Test API + Webdriver.IO + appium

![demo testing iOS + browser in parallel](./docs/demo-testing.gif)

## Table of Contents

<!--ts-->
   * [wdi5](#wdi5)
      * [Table of Contents](#table-of-contents)
      * [Prerequisites](#prerequisites)
      * [Getting Started](#getting-started)
         * [Installation](#installation)
      * [Advanced configuration](#advanced-configuration)
      * [Control selectors](#control-selectors)
      * [API methods](#api-methods)
         * [hasStyleClass](#hasstyleclass)
         * [getProperty](#getproperty)
         * [getAggregation](#getaggregation)
         * [setProperty](#setproperty)
         * [enterText](#entertext)
         * [press](#press)
         * [fireEvent](#fireevent)
         * [check](#check)
         * [uncheck](#uncheck)
         * [toogle](#toogle)
      * [Screenshots](#screenshots)
      * [Logger](#logger)
      * [FAQ/hints](#faqhints)
      * [License](#license)

<!-- Added by: vbuzek, at: Mo  8 Jun 2020 09:37:58 CEST -->

<!--te-->

## Prerequisites

-   for browser-based testing: running UI5 app that is accessbile via `http(s)://host.ext:port`
    recommended tooling for this is either the official [UI5 tooling](https://github.com/SAP/ui5-tooling) (`ui5 serve`) or some standalone http server like [`soerver`](https://github.com/vobu/soerver) or [`http-server`](https://www.npmjs.com/package/http-server)
-   for hybrid app testing:
    -   iOS: `.ipa` (device-type build) or `.app` (emulator-type build) + iOS simulator
    -   Android: `.apk` + emulator
    -   Electron: binary

## Getting Started

To support these four different platforms of android, ios, electron and browser we wanted to find the congruences. Android and ios tests are driven by appium, electron and brwoser by chromedriver directly, therefore we separate them with the two device types of `native` for appium driven and `web` for driven by chromedriver.
```javascript
    platform: "", // android | ios | electron | browser
    deviceType: "" // native | web
```

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
    platform: "browser" // android | browser | electron | ios
}
```

In your actual test(s), kick-off `wdi5`:

```javascript
const wdi5 = require('wdi5')()

it("should find a button's texts and click it", () => {
    browser.url('index.html') // navigate to UI5 bootstrap page relative to "baseUrl"

    const selector = {
        wdio_ui5_key: 'NavFwdButton', // wdi5 specific - optional unique key for any UI5 control you want to retrieve
        // standard OPA5/UIveri5-selectors!
        selector: {
            id: 'NavFwdButton',
            viewName: 'test.Sample.view.Main'
        }
    }

    const oButton = browser.asControl(selector)
    const sText = oButton.getProperty('text') // UI5 API syntax!

    assert.strictEqual(sText, 'to Other view')

    oButton.press() // UI5 API syntax!

    // do sth after navigation has taken place
    // ...
})
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

please see the `advanced`-doc for setting up native + eletron platforms.

## Control selectors

The entry point to retrieve a control is always `browser.asControl(oSelector)`.

`oSelector` re-uses the [OPA5 control selectors](https://ui5.sap.com/#/api/sap.ui.test.Opa5%23methods/waitFor), supplemented by a unique `wdio_ui5_key` and `forceSelect` properties. These two properties enable wdi5 to interally store control references for alreay retrieved controls. This can save a browser roundtrip when the same control is used across different testcases. The `forceSelcet` (default: false) property can be set to true to newly retrieve the control from the browser context and update the internally stored reference.

```javascript
const oSelector = {
    wdio_ui5_key: 'wdi5_button', // optional unique internal key to map and find a control
    forceSelect: true, // forces the test framework to retrieve the control freshly from the browser context
    selector: {
        // sap.ui.test.RecordReplay.ControlSelector
        id: 'UI5control_ID',
        viewName: 'your.namespace.App'
    }
}
const control = browser.asControl(oSelector)
// now use one of the below API methods on `control`
```

These are the supported selectors from [sap.ui.test.RecordReplay.ControlSelector](https://ui5.sap.com/#/api/sap.ui.test.RecordReplay.ControlSelector):
| selector | description |
| ----------- | ----------- |
| id | supported |
| viewName | supported |
| controlType | supported |
| bindingPath | supported |
| I18NText | tbd |
| Anchestor | tbd |
| labelFor | tbd |
| properties | supported |

```javascript
const bindingPathSelector = {
    wdio_ui5_key: 'byBindingPath', // optional unique internal key to map and find a control
    forceSelect: true, // forces the test framework to retrieve the control freshly from the browser context
    selector: {
        // sap.ui.test.RecordReplay.ControlSelector
        bindingPath: {
            propertyPath: "/Customers('TRAIH')/ContactName"
        },
        properties: {
            value: 'Helvetius Nagy'
        },
        viewName: 'test.Sample.view.Main',
        controlType: 'sap.m.Input'
    }
}
const control = browser.asControl(bindingPathSelector)
// now use one of the below API methods on `control`
```

**`wdi5` supports method chaining**, so you can do:
```javascript
browser.asControl(selector)
    .getText()
    .getId()
    .setProperty("title", "new title")
```

In case you are not able to create an explicit selector for a control, but you are able to find it via any [webdriver strategy](https://www.w3.org/TR/webdriver/#locator-strategies), you can use the `getSelectorForElement` method of the UI5-wdio-bridge.
This function gets the webdriver element as parameter and returns a selector which can then used in the `asControl` function.

```javascript
const webdriverLocatorSelector = {
    wdio_ui5_key: 'webdriverButton', // optional
    selector: browser.getSelectorForElement({
        domElement: $('/xpath/to/button'),
        settings: {preferViewId: true}
    })
}
const control = browser.asControl(webdriverLocatorSelector)
// now use one of the below API methods on `control`
```

## API methods

Once the control is retrieved in a test, use these API methods on it:

### hasStyleClass

`hasStyleClass(sClassName) => Boolean(true|false)`: check whether the UI5 control has a certain class attached (https://ui5.sap.com/#/api/sap.ui.core.Control%23methods/hasStyleClass)

```javascript
assert.ok(browser.asControl(oSelector).hasStyleClass('active'))
```

### getProperty

`getProperty(sName) => String`: retrieve the value of a control’s property (https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getProperty)

```javascript
assert.strictEqual(browser.asControl(oButtonSelector).getProperty('text'), 'Click me now!')
```

-   **`getId() => String`**: get the Id of the control as issued by the UI5 framework; convenience wrapper for `getProperty("id")` (see above)

    ```javascript
    assert.ok(browser.asControl(oButtonSelector).getId().includes('NavButton'))
    ```

-   **`getText() => String`**: get the text label of a control; convenience wrapper for `getProperty("text")` (see above)

    ```javascript
    assert.strictEqual(browser.asControl(oButtonSelector).getText(), 'Click me now!')
    ```

-   **`getTitle() => String`**: get the title text of a control; convenience wrapper for `getProperty("title")` (see above)

    ```javascript
    assert.strictEqual(browser.asControl(oListItemSelector).getTitle(), 'some list item title')
    ```

-   **`isVisible() => Boolean(true|false)`**: validate visibilty status of a control; convenience wrapper for `getProperty("visible")` (see above)

    ```javascript
    assert.ok(browser.asControl(oSelector).isVisible())
    ```

### getAggregation

`getAggregation(sAggregationName) => wdi5Controls[]`: retrieve the elements of aggregation `sAggregationName` of a control (https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getAggregation)

```javascript
const ui5ListItems = browser.asControl(oListSelector).getAggregation('items')
ui5ListItems.forEach((listItem) => {
    assert.ok(listItem.getTitle() !== '')
})
```

### setProperty

`setProperty(sName, vValue) => this {WDI5}`: sets the property `sName` of a control to `vValue` (https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/setProperty)

```javascript
const oButton = browser.asControl(buttonSelector)
oButton.setProperty('text', 'new button text')

assert.strictEqual(oButton.getText(), 'new button text')
```

### enterText

`enterText(sText) => this {WDI5}`: input `sText` into a (input-capable) control (https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

```javascript
browser.asControl(inputSelector).enterText('new Text')
```

### press

`press() => this {WDI5}`: click/press on a (capable) control (https://ui5.sap.com/#/api/sap.ui.test.actions.Press)

```javascript
browser.asControl(buttonSelector).press()
```

### fireEvent

`fireEvent(sName) => this {WDI5}`: trigger the event `sName` on a (capable) control (https://ui5.sap.com/#/api/sap.ui.base.EventProvider%23methods/fireEvent)

```javascript
browser.asControl(listElement).fireEvent('swipe')
```

### check

`check() => this {WDI5}`: click/press on a checkbox to select (https://ui5.sap.com/#/api/sap.m.CheckBox). Internally calls the `setProperty` method of the WDI5 object with `selected: true` and fires the `select` event with `selected: true`.

```javascript
browser.asControl(checkboxSelector).check()
```

### uncheck

`uncheck() => this {WDI5}`: click/press on a checkbox to unselect (https://ui5.sap.com/#/api/sap.m.CheckBox). Internally calls the `setProperty` method of the WDI5 object with `selected: false` and fires the `select` event with `selected: false`.

```javascript
browser.asControl(checkboxSelector).uncheck()
```

### toogle
`toogle() => this {WDI5}`: click/press on a checkbox to toggle its current status (https://ui5.sap.com/#/api/sap.m.CheckBox). Internally calls the `setProperty` method of the WDI5 object with `selected: !oldState` and fires the `select` event with `selected: !oldState`.

```javascript
browser.asControl(checkboxSelector).toggle()
```

## Screenshots

At any point in your test(s), you can screenshot the current state of the UI:

```javascript
const wdi5 = require('wdi5')
it('...', () => {
    // ...
    wdi5().getUtils().takeScreenshot('some-id')
    // ...
})
```

This works _cross-device_ and puts a `png` into the configured `wdi5.screenshotPath` (in `wdio.conf.js`).

The file name is prepended with a date indicator (M-d-hh-mm-ss), holds `screenshot` in the filname and is appended with the id you provice (here: `some-id`).
Example: `5-5-17-46-47-screenshot--some-id.png`

## Logger

For convenient console output, use `wdi5().getLogger()`. It supports the `syslog`-like levels `log`,`info`, `warn` and `error`:

```javascript
const wdi5 = require('wdi5')
wdi5().getLogger().log('any', 'number', 'of', 'log', 'parts')
```

The log level is set by the either in `wdio.conf.js` via `wdi5.logLevel` or by `wdi5().getLogger().setLoglevel(level = {String} error | verbose | silent)`

## FAQ/hints

-   sample configurations: `wdi5` tests itself with `wdi5` - see the `test/`- and `test/ui5-app/test/e2e/` directory for a sample `wdio.conf.js` and sample tests.
    Run `npm run test` for `wdi5` testing itself.

-   performance: integration/e2e-tests are rarely fast. `wdi5` tags along that line, remote-controlling a browser with code and all
    -> watch your timeouts and refer to the [`wdio`-documentation](https://webdriver.io/docs/timeouts.html#webdriverio-related-timeouts) on how to tweak them

-   UI5 bug: [OpenUI5 Issue](https://github.com/SAP/openui5/issues/2887) `sap/ui/test/matchers/BindingPath cannot locate control by named model and root property`

    If you use a named model and a root property there is an issue in UI5 control selector.

    ```javascript
    bindingPath: { // internally object of sap.ui.test.matchers.BindingPath is created
        modelName: "myModelName",
        propertyPath: "/Value" // a double slash is created internally to fix the issue
    },
    ```

    The function `_getFormattedPath` in [`BindingPath.js`](https://github.com/SAP/openui5/blob/master/src/sap.ui.core/src/sap/ui/test/matchers/BindingPath.js) does `substring(1)` if it is a named model.

    There’s a tmp fixed in `wdio-ui5 - createMatchers` function. In case the OpenUI5 issue will be fixed this need to be adjusted.

-   Electron: a known pitfall is the chromedriver version. Make sure you run the fitting `electron-chromedriver` version to your electron version used for the binary.

-   `Webdriver.IO`'s watch mode is running, but subsequent `context.executeAsync()`-calls fail - exact cause unknown, likely candidate is `fibers` from `@wdio/sync`

-    In case `... bind() returned an error, errno=0: Address already in use (48)` error shows up during test execution any `chromedriver` service is already running. You need to quit this process eg. by force quiting it in the activity monitor.

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
