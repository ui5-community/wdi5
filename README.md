[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

`wdi5` (/vdif5/)is a wrapper around [`Webdriver.IO`](https://webdriver.io) utilizing [`UI5`’s test API](https://ui5.sap.com/#/api/sap.ui.test).

It is designed to run OPA5-/UIveri5-style integration tests for a UI5 application cross-platform - in the browser, in a hybrid (iOS + Android) container and as an Electron application.

# Prerequisites

- for browser-based testing: running UI5 app running that is accessbile via `http(s)://host.ext:port`
  recommended tooling for this is either the official [UI5 tooling](https://github.com/SAP/ui5-tooling) (`ui5 serve`) or some standalone http server like [`soerver`](https://github.com/vobu/soerver)
- for hybrid app testing:
  -  iOS: `.ipa` + emulator
  - Android: `.apk` + emulator
  - Electron: binary

# Getting Started

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
const wdi5 = require("wdi5")()

it("should find a button's texts and click it", () => {
    // UI5 bridge setup
    wdi5().getWDioUi5().setup(browser) // wire up wdio<->ui5 
    wdi5().getWDioUi5().injectUI5(browser) // let webdriver.io know UI5 is available

    browser.url("index.html") // navigate to UI5 bootstrap page relative to "baseUrl"
    
    const selector = {
        wdio_ui5_key: "NavFwdButton", // wdi5 specific - you need a unique key for any UI5 control you want to retrieve
        // standard OPA5/UIveri5-selectors!
        selector: {
            id: "NavFwdButton",
            viewName: "test.Sample.view.Main"
        }
    }
    
    const oButton = browser.asControl(selector) // browser is a global object
	const sText = oButton.getProperty("text") // UI5 API syntax!
    
    assert.strictEqual(sText, "to Other view")
    
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
[chrome  mac os x #0-0] ui5 showcase app - basic
[chrome  mac os x #0-0]    ✓ should have the right title
[chrome  mac os x #0-0]    ✓ should have the right version
[chrome  mac os x #0-0]    ✓ should have the class
[chrome  mac os x #0-0]
[chrome  mac os x #0-0] 3 passing (2.5s)


Spec Files:      1 passed, 1 total (100% completed) in 00:00:06 
```

# API methods

The entry point to retrieve a control is always `browser.asControl(oSelector)`.

`oSelector` re-uses the [OPA5 control selectors](https://ui5.sap.com/#/api/sap.ui.test.Opa5%23methods/waitFor), supplemented by a unique `wdio_ui5_key` property:

```javascript
const oSelector = {
    wdio_ui5_key: "wdi5_button",
    selector: {
        id: "UI5control_ID",
        viewName: "your.namespace.App"
    }
}
const control = browser.asControl(oSelector)
// now use one of the below API methods on `control`
```

In case you are not able to create an explicit selector for a control, but you are able to find it via any [webdriver strategy](https://www.w3.org/TR/webdriver/#locator-strategies), you can use the `getSelectorForElement` method of the UI5-wdio-bridge. 
This function gets the webdriver element as parameter and returns a selector which can then used in the `asControl` function.

```javascript
const webdriverLocatorSelector = {
    wdio_ui5_key: "webdriverButton",
    selector: browser.getSelectorForElement({ 
        domElement: $('/xpath/to/button'), 
        settings: { preferViewId: true } 
    })
}
const control = browser.asControl(webdriverLocatorSelector)
// now use one of the below API methods on `control`
```

Once the control is retrieved in a test, use these API methods on it:

## hasStyleClass

`hasStyleClass(sClassName) => Boolean(true|false)`: check whether the UI5 control has a certain class attached (https://ui5.sap.com/#/api/sap.ui.core.Control%23methods/hasStyleClass)

```javascript
assert.ok(browser.asControl(oSelector).hasStyleClass("active"))
```

## getProperty

`getProperty(sName) => String`: retrieve the value of a control’s property (https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getProperty)

```javascript
assert.strictEqual(
    browser.asControl(oButtonSelector).getProperty("text"), 
    "Click me now!"
)
```
- `getId() => String`: get the Id of the control as issued by the UI5 framework; convenience wrapper for `getProperty("id")` (see above)

  ```javascript
  assert.ok(
  	browser.asControl(oButtonSelector).getId().includes("NavButton")
  )
  ```

- `getText() => String`: get the text label of a control; convenience wrapper for `getProperty("text")` (see above)

  ```javascript
  assert.strictEqual(
  	browser.asControl(oButtonSelector).getText(), 
      "Click me now!"
  )
  ```

- `getTitle() => String`: get the title text of a control; convenience wrapper for `getProperty("title")` (see above)

  ```javascript
  assert.strictEqual(
  	browser.asControl(oListItemSelector).getTitle(), 
      "some list item title"
  )
  ```

- `isVisible() => Boolean(true|false)`: validate visibilty status of a control; convenience wrapper for `getProperty("visible")` (see above)

  ```javascript
  assert.ok(browser.asControl(oSelector).isVisible()) 
  ```


## getAggregation

`getAggregation(sAggregationName) => wdi5Controls[]`: retrieve the elements of aggregation `sAggregationName` of a control (https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getAggregation)

```javascript
const ui5ListItems = browser.asControl(oListSelector).getAggregation("items")
ui5ListItems.forEach(listItem => {
    assert.ok(listItem.getTitle() !== "")
})
```

## setProperty

`setProperty(sName, vValue) => void`: sets the property `sName` of a control to `vValue` (https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/setProperty)

```javascript
const oButton = browser.asControl(buttonSelector)
oButton.setProperty('text', 'new button text')
        
assert.strictEqual(oButton.getText(), 'new button text')
```



## enterText

`enterText(sText) => void`: input `sText` into a (input-capable) control (https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

```javascript
browser.asControl(inputSelector).enterText("new Text")
```

## press

`press() => void`: click/press on a (capable) control (https://ui5.sap.com/#/api/sap.ui.test.actions.Press)

```javascript
browser.asControl(buttonSelector).press()
```

## fireEvent

`fireEvent(sName) => void`: trigger the event `sName` on a (capable) control (https://ui5.sap.com/#/api/sap.ui.base.EventProvider%23methods/fireEvent)

```javascript
browser.asControl(listElement).fireEvent("swipe")
```

# Screenshots

At any point in your test(s), you can screenshot the current state of the UI:

```javascript
const wdi5 = require("wdi5")
it("...", () => {
    // ...
    wdi5().getUtils().takeScreenshot("some-id")
    // ...
})
```

This works _cross-device_ and puts a `png` into the configured `wdi5.screenshotPath` (in `wdio.conf.js`).

The file name is prepended with a date indicator (M-d-hh-mm-ss), holds `screenshot` in the filname and is appended with the id you provice (here: `some-id`). 
Example: `5-5-17-46-47-screenshot--some-id.png`

# FAQ/hints

- performance: integration/e2e-tests are rarely fast. `wdi5` tags along that line, remote-controlling a browser with code and all
  -> watch your timeouts and refer to the [`wdio`-documentation](https://webdriver.io/docs/timeouts.html#webdriverio-related-timeouts) on how to tweak them

# License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.

