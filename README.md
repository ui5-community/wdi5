# wdi5 ![wdi5 Logo](./docs/wdi5-logo-small.png)

`wdi5` (/vdif5/) is a wrapper around [appium](http://appium.io)-driven [`Webdriver.IO`](https://webdriver.io)-tests, utilizing [`UI5`’s test API](https://ui5.sap.com/#/api/sap.ui.test).

It is designed to run cross-platform, executing OPA5-/UIveri5-style integration tests on a UI5 application - in the browser, in a hybrid ([cordova](https://cordova.apache.org)) container or as an Electron application.

![npm (scoped)](https://img.shields.io/npm/v/@openui5/sap.ui.core?label=ui5) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/webdriverio) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/appium)

`wdi5` = UI5 Test API + Webdriver.IO + appium

![demo testing iOS + browser in parallel](./docs/demo-testing.gif)

## Table of contents

<!--ts-->

- [about](#about)
- [Installation Setup](#installation--setup)
- [Usage](#usage)
  - [Control selectors](#control-selectors)
  - [API methods](#api-methods)
    - [all UI5 control's native methods](#all-ui5-controls-native-methods)
    - [goTo](#goto)
    - [getAggregation](#getaggregation)
    - [get$Shorthand conveniences](#getshorthand-conveniences)
    - [enterText](#entertext)
    - [fluent async api](#fluent-async-api)
  - [Function mock for event handler](#function-mock-for-event-handler)
  - [Assertions](#assertions)
  - [Screenshots](#screenshots)
- [Logger](#logger)
- [FAQ/hints](#faqhints)
- [Collaboration](#collaboration)
- [License](#license)
<!-- Added by: vbuzek, at: Mo 17 Jan 2022 12:06:07 CET -->

<!--te-->

## about

`wdi5` comes in two flavours:

- ![npm](https://img.shields.io/npm/v/wdio-ui5-service) [`wdio-ui5-service`:](https://www.npmjs.com/package/wdio-ui5-service) a browser-based plugin to [`Webdriver.IO`](https://webdriver.io)
- ![npm](https://img.shields.io/npm/v/wdi5) `wdi5`: an extension to [`Webdriver.IO`](https://webdriver.io), using [`appium`](http://appium.io) to communicate with the hybrid app on iOS, Android and Electron.
  The `wdi5`-extension contains `wdio-ui5-service`, allowing for both browser-based and hybrid-app-testing.

`wdio-ui5-service` allows for a lightweight setup if test scope is on the browser.
As to where the `wdi5`-extension gives you the full "app-testing-package".

## Installation + Setup

Specific to the desired test-scope, please see:

- brower-based "Webdriver.IO"-plugin: [wdio-ui5-service](./wdio-ui5-service/README.md)
- hybrid app extension: [wdi5](./wdi5/README.md) (includes all browser-based capabilities)

## Usage

Run-(Test-)Time usage of `wdi5` is agnostic to its' test-scope (browser or native) and centers around the global `browser`-object, be it in the browser or on a real mobile device.

Test runs are always started via the regular `webdriver.io`-cli:

```javascript
$> npx wdio
```

### Control selectors

The entry point to retrieve a control is always awaiting the `async` function `browser.asControl(oSelector)`.

`oSelector` re-uses the [OPA5 control selectors](https://ui5.sap.com/#/api/sap.ui.test.Opa5%23methods/waitFor), supplemented by the optional `wdio_ui5_key` and `forceSelect` properties.

`wdi5` stores control references internally in order to save browser roundtrip time on repeatedly using a control across different test cases. For that, `wdi5` computes unique identifiers for controls - but providing a `wdio_ui5_key` in the selector, you can assign such an ID manually if required.

The `forceSelect` (default: `false`) property can be set to `true` to force `wdi5` to again retrieve the control from the browser context and update the internally stored reference as well as available control methods. This might be useful if the tested application has destroyed the initial control and recreated it.

The `forceSelect` option also updates the `wdio` control reference each time a method is executed on a `wdi5` control.

The `timeout` option (default based on the global configuration `waitForUI5Timeout` [setting](wdio-ui5-service/README.md#installation)) controls the maximum waiting time while checking for UI5 availability _(meaning no pending requests / promises / timeouts)_.

```javascript
it("validates that $control's text is ...", async () => {
  const oSelector = {
    wdio_ui5_key: 'wdio-ui5-button', // optional unique internal key to map and find a control
    forceSelect: true, // forces the test framework to again retrieve the control from the browser context
    timeout: 15000, // maximum waiting time (ms) before failing the search
    selector: {
      // sap.ui.test.RecordReplay.ControlSelector
      id: 'UI5control_ID',
      viewName: 'your.namespace.App'
    }
  };
  const control = await browser.asControl(oSelector);
  // now use one of the UI5 API methods of `control`
  // e.g. assuming UI5 `control` has a `getText()` method:
  expect(await control.getText()).toEqual('...');
});
```

These are the supported selectors from [sap.ui.test.RecordReplay.ControlSelector](https://ui5.sap.com/#/api/sap.ui.test.RecordReplay.ControlSelector):
| selector | supported in `wdi5` |
| ----------: | ----------- |
| `id` | &check; |
| `viewName` | &check; |
| `controlType` | &check; |
| `bindingPath` | &check; |
| `I18NText` | - |
| `Anchestor` | - |
| `labelFor` | - |
| `properties` | &check; |

```javascript
const bindingPathSelector = {
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
};
const control = await browser.asControl(bindingPathSelector);
// now use one of the below API methods on `control`
```

Locating a UI5 control via a regular expression works as well:

```javascript
// select a Button with Id ending in "MyButton"
// across all views in the UI5 app
const crossViewById = {
  selector: {
    id: /.*MyButton$/
  }
};
const control = await browser.asControl(crossViewById);
expect(await control.getVisible()).toBeTruthy();
```

In case you are not able to create an explicit selector for a control, but you are able to find it via any [webdriver strategy](https://www.w3.org/TR/webdriver/#locator-strategies), you can use the `getSelectorForElement` method. It returns a selector which can subsequently be used in `asControl`:

```javascript
const webdriverLocatorSelector = {
  selector: await browser.getSelectorForElement({
    domElement: $('/xpath/to/button'),
    settings: {preferViewId: true}
  })
};
const control = await browser.asControl(webdriverLocatorSelector);
// now use any of the UI5 native controls' API methods on `control`
```

### API methods

#### all UI5 control's native methods

Once the control is retrieved in a test, use any of the native UI5 control's methods on it.

This is possible because of a runtime proxy `wdi5` provides that transistions the UI5 control's methods from browser- to Node.js-runtime.

```zsh
# terminal 1: run webapp on port 8888
$> npx soerver -d <path/to/webapp> -p 8888

# terminal 2: run test
$> npx wdio run <path/to/conf> --spec <path/to/test>

Execution of 1 spec files started at 2020-08-24T15:49:54.625Z
# ...

# breakpoint is hit after retrieving a control
# in the test via "browser.asControl(buttonSelector)"

# snippet of output of "Object.getOwnPropertyNames(ui5Button)"
length: 220
[
  // ...
  "extractBindingInfo",
  "findAggregatedObjects",
  "findElements",
  "fireEvent",
  "fireFormatError",
  "fireModelContextChange",
  "fireParseError",
  "firePress",
  "fireTap",
  "fireValidateFieldGroup",
  "fireValidationError",
  "fireValidationSuccess",
  "focus",
  // ...
  "getBinding",
  "getBindingContext",
  "getBindingInfo",
  "getBindingPath",
  "getBlocked",
  "getBusy",
  "getBusyIndicatorDelay",
  "getBusyIndicatorSize",
  "getContextMenu",
  "getControlsByFieldGroupId",
  "getCustomData",
  "getDependents",
  "getDomRef",
  "getDomRefForSetting",
  "getDragDropConfig",
  // ...
  "getLayoutData",
  "getModel",
  "getObjectBinding",
  "getOriginInfo",
  "getParent",
  "getPopupAnchorDomRef",
  "getPropagationListeners",
  "getProperty",
  "getText",
  "getTextDirection",
  "getTooltip",
  "getTooltip_AsString",
  "getTooltip_Text",
  "getType",
  "getUIArea",
  "getVisible",
  "getWidth",
  "hasListeners",
  // ...
]
```

This method bridge **does not** proxy private control methods (starting with `_`), `getAggregation` (and `getMetadata`) though.
[`getAggregation` (see below)](#getaggregation) is provided by `wdi5` separately with a UI5-compatible API signature.

#### goTo

When navigating the User-Agent manually, please use `wdi5`'s own `browser.goTo('#/path/to/route')` implementation rather than Webdriver.IO's `browser.url()`.
This makes sure that the UI5 test API is loaded and runtime.

#### getAggregation

`getAggregation(sAggregationName) => wdi5Controls[]`: retrieve the elements of aggregation `sAggregationName` of a control [getAggregation](https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getAggregation)

```javascript
const control = await browser.asControl(oListSelector);
const ui5ListItems = await control.getAggregation('items');
for (const listItem of ui5ListItems) {
  expect(await listItem.getTitle()).not.toBe('');
}
```

#### get$Shorthand conveniences

If `getAggregation` is called via a shorthand such as `sap.m.ListBase.getItems()`, additional convenience functions are available:

- `get$Shorthand(true)` (e.g. `getItems(true)`): if `true` retrieves the aggregation as `webdriver` elements only (not as UI5 controls!). This is a huge performance improvement in case you don't need all elements of the aggregation as fully qualified UI5 controls.

- `get$Shorthand(2)` (e.g. `getItems(2)`): if set as `Number`, the result array contains a single UI5 control from the aggregation at index `Number` (here: 2). This is a huge performance improvement in case you dont need all controls of the aggegation as fully qualified UI5 controls, but rather one specific single control.

#### enterText

`enterText(sText)`: input `sText` into a (input-capable) control via [EnterText](https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

```javascript
const control = await browser.asControl(inputSelector);
await control.enterText('new Text');
```

#### fluent async api

`wdi5` supports `async `method chaining. This means you can directly call a `UI5` control's methods after retrieveing it via `browser.asControl(selector)`:

```javascript
// sap.m.List has .getItems()
// sap.m.StandardListItem has .getTitle()
const title = await browser.asControl(listSelector).getItems(1).getTitle();
// `title` is "Andrew Fuller"
// the long version of the above command would be:
// list = await browser.asControl(listSelector)
// const item = await list.getItems(1)
// const title = await item.getTitle()
```

The `this` context of each step in the `async` chain changes to the retrieved/referenced `UI5` element.

In the above example:

- `browser.asControl(listSelector)` exposes the `sap.m.List`
- `getItems(1)` exposes a `sap.m.StandardListItem`
- `getTitle()` delivers a `string`

The fluent `async` api also works with event triggers, such as pressing a `sap.m.Button`:

```js
const text = await browser.asControl(button).firePress().getText();
```

While this leads to more concise code, bear in mind that (as mentioned above) the `this` context changes with every call in the chain. So after arriving at a function returning an atomic value (such as a `string`), the reference any `UI5` control is lost and the chain can only work on the atomic value:

```js
// on a sap.m.Text
await browser.asControl(text).getText().getMaxLines(); // will throw!
//                                   ^
//                                   |
// -----------------------------------
// returns a `string`,
// thus `this` context is the `string` (that doesn't have a getMaxLines method)
// and not `sap.m.Text` anymore
```

### Function mock for event handler

If an item has a custom attribute defined (eg. `data:key="exampleKey"`) which is needed in the event handler function, the access of the `data()` function to retrieve the key can be done by specifying an `eval` property as (object) argument to the event handler.

Can be accessed in standard UI5 manner `(await oEvent.getParameter("listItem")).data("key")`.

```javascript
// example for the [sap.m.List](https://sapui5.hana.ondemand.com/#/api/sap.m.ListBase%23events/itemPress) event `itemPress`
const control = await browser.asControl(listSelector);
await control.fireEvent('itemPress', {
  eval: () => {
    return {
      listItem: {
        data: () => {
          return 'account.relationships';
        }
      }
    };
  }
});
```

### Assertions

Recommendation is to use the [`Webdriver.IO`](https://webdriver.io)-native extension to JEST's [expect](https://jestjs.io/docs/en/expect) and [matchers](https://jestjs.io/docs/en/using-matchers) as described in https://webdriver.io/docs/assertion.html.

### Screenshots

At any point in your test(s), you can screenshot the current state of the UI via `browser.screenshot()`:

```javascript
it('...', async () => {
  // ...
  await browser.screenshot('some-id');
  // ...
});
```

This puts a `png` into the configured `wdi5.screenshotPath` (from `wdio.conf.js`).

The file name is prepended with a date indicator (`M-d-hh-mm-ss`), holds `screenshot` in the filename and is appended with the `id` you provide (here: `some-id`).
Example: `5-5-17-46-47-screenshot--some-id.png`

## Logger

For convenient console output, use `wdi5().getLogger()`. It supports the `syslog`-like levels `log`,`info`, `warn` and `error`:

```javascript
const wdi5 = require('wdi5')(await wdi5())
  .getLogger()
  .log('any', 'number', 'of', 'log', 'parts');
```

The log level is set by the either in `wdio.conf.js` via `wdi5.logLevel` or
by `(await wdi5()).getLogger().setLoglevel(level = {String} "error"| "verbose" | "silent")`

## FAQ/hints

`wdi5` tests itself with `wdi5` - see the `test/`- and `test/ui5-app/test/e2e/` directory for sample `wdio.conf.js`-files and sample tests.

Run `yarn test` for `wdi5` testing itself 😊

## Collaboration

- yarn
- prettier
- commitlint

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware 🍺 License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

Thus, when you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
