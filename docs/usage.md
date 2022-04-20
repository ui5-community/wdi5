# Using `wdi5`

With `wdi5` being a service to WebdriverIO, it provides a superset of `wdio`'s functionality.

At the same time, the `wdi5`-api can be mixed with `wdio`'s api during tests at will - there is no restriction to use either or. See below for many examples, denoting which api is used were.

## Control retrieval

### asControl

The entry point to retrieve a control is always `await browser.asControl(selector)` (for [`selector` as locator, see 👇](#control-selectors)). It transfers the UI control from the browser into the Node.js-scope and make the UI5 control's API available to the test.

Internally, `wdi5` uses [`sap.ui.test.RecordReplay.findDOMElementByControlSelector`](https://ui5.sap.com/#/api/sap.ui.test.RecordReplay%23methods/sap.ui.test.RecordReplay.findDOMElementByControlSelector) to locate the control via a selector.

You can either retrieve the control specifically and subsequently operate on its' UI5 API methods or use the fluent async api to query a specific method:

```js
// retrieve specfically
const control = await browser.asControl(selector)
const text = await control.getText()
const property = await control.getProperty("...")

// use fluent async api
const text = await browser.asControl(selector).getText()
```

### allControls

The alternative [to `browser.asControl`](#asControl) is `await browser.allControls(selector)` to retrieve all controls of a certain type.

```js
// get all sap.m.Buttons on that view
const selector = {
  selector: {
    controlType: "sap.m.Button",
    viewName: "test.Sample.view.Main"
  }
}
const buttons = await browser.allControls(selector)

// query one of the buttons
const textOfButton1 = await buttons[0].getText()
```

Internally, `wdi5` uses [`sap.ui.test.RecordReplay.findAllDOMElementsByControlSelector`](https://ui5.sap.com/#/api/sap.ui.test.RecordReplay%23methods/sap.ui.test.RecordReplay.findAllDOMElementsByControlSelector) to locate the UI5 controls.

?> the `selector` is used to establish a cache for _all_ controls. So providing [the `forceSelect: true` selector option](#control-selectors), the cache for all controls of that type will be invalidated.

?> there is no [fluent async api](#fluent-async-api) available for `.allControls`.

Switching between `wdi5`- and WebdriverIO-API is possible on any of the controls retrieved by `allControls` just as it is for a single control located via `.asControl`

```js
const buttons = await browser.allControls(manySelector)
// $button0 and $button have the WebdriverIO api
const $button0 = await buttons[0].getWebElement()
const $button = await browser.asControl(singleSelector).getWebElement()
```

## Control selectors

The entry point to retrieve a control is always awaiting the `async` function `browser.asControl(oSelector)`.

`oSelector` re-uses the [OPA5 control selectors](https://ui5.sap.com/#/api/sap.ui.test.Opa5%23methods/waitFor), supplemented by the optional `wdio_ui5_key` and `forceSelect` properties.

`wdi5` stores control references internally in order to save browser roundtrip time on repeatedly using a control across different test cases. For that, `wdi5` computes unique identifiers for controls - but providing a `wdio_ui5_key` in the selector, you can assign such an ID manually if required.

The `forceSelect` (default: `false`) property can be set to `true` to force `wdi5` to again retrieve the control from the browser context and update the internally stored reference as well as available control methods. This might be useful if the tested application has destroyed the initial control and recreated it.

The `forceSelect` option also updates the `wdio` control reference each time a method is executed on a `wdi5` control.

The `timeout` option (default based on the global configuration `waitForUI5Timeout` [setting](wdio-ui5-service/README.md#installation)) controls the maximum waiting time while checking for UI5 availability _(meaning no pending requests / promises / timeouts)_.

```javascript
it("validates that $control's text is ...", async () => {
  const oSelector = {
    wdio_ui5_key: "wdio-ui5-button", // optional unique internal key to map and find a control
    forceSelect: true, // forces the test framework to again retrieve the control from the browser context
    timeout: 15000, // maximum waiting time (ms) before failing the search
    selector: {
      // sap.ui.test.RecordReplay.ControlSelector
      id: "UI5control_ID",
      viewName: "your.namespace.App"
    }
  }
  const control = await browser.asControl(oSelector)
  // now use one of the UI5 API methods of `control`
  // e.g. assuming UI5 `control` has a `getText()` method:
  expect(await control.getText()).toEqual("...")
})
```

## supported locators for selectors

These are the supported selectors from [sap.ui.test.RecordReplay.ControlSelector](https://ui5.sap.com/#/api/sap.ui.test.RecordReplay.ControlSelector):

<!-- prettier-ignore-start -->

|      selector | supported in `wdi5` |
| ------------: | ------------------- |
|   `ancestor` | &check;             |
| `bindingPath` | &check;             |
| `controlType` | &check;             |
|  `descendant` | &check;             |
|    `I18NText` | &check;             |
|          `id` | &check;             |
|`interactable` | &check;             |
|    `labelFor` | &check;             |
|  `properties` | &check;             |
|     `RegEx`   | &check;             |
|     `sibling` | &check;             |
|    `viewName` | &check;             |

<!-- prettier-ignore-end -->

?> Please see the [dedicated section on "locators"](locators) for more usage examples for each `locator`/`matcher`!

```javascript
const bindingPathSelector = {
  selector: {
    // sap.ui.test.RecordReplay.ControlSelector
    bindingPath: {
      propertyPath: "/Customers('TRAIH')/ContactName"
    },
    properties: {
      value: "Helvetius Nagy"
    },
    viewName: "test.Sample.view.Main",
    controlType: "sap.m.Input"
  }
}
const control = await browser.asControl(bindingPathSelector)
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
}
const control = await browser.asControl(crossViewById)
expect(await control.getVisible()).toBeTruthy()
```

In case you are not able to create an explicit selector for a control, but you are able to find it via any [webdriver strategy](https://www.w3.org/TR/webdriver/#locator-strategies), you can use the `getSelectorForElement` method. It returns a selector which can subsequently be used in `asControl`:

```javascript
const webdriverLocatorSelector = {
  selector: await browser.getSelectorForElement({
    domElement: $("/xpath/to/button"),
    settings: { preferViewId: true }
  })
}
const control = await browser.asControl(webdriverLocatorSelector)
// now use any of the UI5 native controls' API methods on `control`
```

## API methods

### all UI5 control's native methods

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

!> This method bridge **does not** proxy private control methods (starting with `_`), `getAggregation` (and `getMetadata`) though.
[`getAggregation` (see below)](#getaggregation) is provided by `wdi5` separately with a UI5-compatible API signature.

### `getAggregation`

`getAggregation(sAggregationName) => wdi5Controls[]`: retrieve the elements of aggregation `sAggregationName` of a control [getAggregation](https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getAggregation)

```javascript
const control = await browser.asControl(oListSelector)
const ui5ListItems = await control.getAggregation("items")
for (const listItem of ui5ListItems) {
  expect(await listItem.getTitle()).not.toBe("")
}
```

### `get`$Shorthand conveniences

If `getAggregation` is called via a shorthand such as `sap.m.ListBase.getItems()`, additional convenience functions are available:

- `get$Shorthand(true)` (e.g. `getItems(true)`): if `true` retrieves the aggregation as `webdriver` elements only (not as UI5 controls!). This is a huge performance improvement in case you don't need all elements of the aggregation as fully qualified UI5 controls.

- `get$Shorthand(2)` (e.g. `getItems(2)`): if set as `Number`, the result array contains a single UI5 control from the aggregation at index `Number` (here: 2). This is a huge performance improvement in case you dont need all controls of the aggegation as fully qualified UI5 controls, but rather one specific single control.

### `enterText`

`enterText(sText)`: input `sText` into a (input-capable) control via [EnterText](https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

```javascript
const control = await browser.asControl(inputSelector)
await control.enterText("new Text")
```

### `press`

For (well) pressing a UI5 control (e.g. `sap.m.Button`), `wdi5` provides the explicit $control.`press()` api.

```javascript
const button = await browser.asControl(buttonSelector)
await button.press()
```

Under the hoode, this first retrieves the UI5 control, then feeds it to [WebdriverIO's `click()` method](https://webdriver.io/docs/api/element/click).

### fluent async api

`wdi5` supports `async `method chaining. This means you can directly call a `UI5` control's methods after retrieveing it via `browser.asControl(selector)`:

```javascript
// sap.m.List has .getItems()
// sap.m.StandardListItem has .getTitle()
const title = await browser.asControl(listSelector).getItems(1).getTitle()
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
const text = await browser.asControl(button).press().getText()
```

While this leads to more concise code, bear in mind that (as mentioned above) the `this` context changes with every call in the chain. So after arriving at a function returning an atomic value (such as a `string`), the reference any `UI5` control is lost and the chain can only work on the atomic value:

```js
// on a sap.m.Text
await browser.asControl(text).getText().getMaxLines() // will throw!
//                                   ^
//                                   |
// -----------------------------------
// returns a `string`,
// thus `this` context is the `string` (that doesn't have a getMaxLines method)
// and not `sap.m.Text` anymore
```

## Function mock for event handler

If an item has a custom attribute defined (eg. `data:key="exampleKey"`) which is needed in the event handler function, the access of the `data()` function to retrieve the key can be done by specifying an `eval` property as (object) argument to the event handler.

Can be accessed in standard UI5 manner `(await oEvent.getParameter("listItem")).data("key")`.

```javascript
// example for the [sap.m.List](https://sapui5.hana.ondemand.com/#/api/sap.m.ListBase%23events/itemPress) event `itemPress`
const control = await browser.asControl(listSelector)
await control.fireEvent("itemPress", {
  eval: () => {
    return {
      listItem: {
        data: () => {
          return "account.relationships"
        }
      }
    }
  }
})
```

## Assertions

Recommendation is to use the [`Webdriver.IO`](https://webdriver.io)-native extension to JEST's [expect](https://jestjs.io/docs/en/expect) and [matchers](https://jestjs.io/docs/en/using-matchers) as described in https://webdriver.io/docs/assertion.html.

## Screenshots

At any point in your test(s), you can screenshot the current state of the UI via `browser.screenshot()`:

```javascript
it("...", async () => {
  // ...
  await browser.screenshot("some-id")
  // ...
})
```

This puts a `png` into the configured `wdi5.screenshotPath` (from `wdio.conf.js`).

The file name is prepended with a date indicator (`M-d-hh-mm-ss`), holds `screenshot` in the filename and is appended with the `id` you provide (here: `some-id`).
Example: `5-5-17-46-47-screenshot--some-id.png`

## Logger

For convenient console output, use `wdi5.getLogger('tag')`. It supports the `syslog`-like levels `log`, `info`, `warn` and `error`:

```javascript
const wdi5 = require("wdi5")
wdi5.getLogger().log("any", "number", "of", "log", "parts")
```

The log level is set by the either in `wdio.conf.js` via `wdi5.logLevel` or
by `wdi5.getLogger().setLoglevel(level = {string} "error"| "verbose" | "silent")`

The 'tag' is an optional parameter and when passed will display logs on the console log with a prefix as follows:

```cmd
[TAG] any number of log parts
```

## Navigation

In the test, you can navigate the UI5 webapp via `goTo(options)` in one of two ways:

- updating the browser hash

  ```javascript
  await browser.goTo({ sHash: "#/test" })
  ```

- using the UI5 router [navTo](https://openui5.netweaver.ondemand.com/api/sap.ui.core.routing.Router#methods/navTo) function

  ```javascript
  await browser.goTo(
      oRoute: {
          sComponentId,
          sName,
          oParameters,
          oComponentTargetInfo,
          bReplace
      }
  )
  ```

- also, the `wdi5` helper class exposes the same API, and additionally a "plain" string option for navigating:

  ```javascript
  const { wdi5 } = require("wdio-ui5-service")
  //...
  const oRouteOptions = {
    sComponentId: "container-Sample",
    sName: "RouteOther"
  }
  await wdi5.goTo("", oRouteOptions)
  // or:
  await wdi5.goTo("#/Other")
  // or:
  await wdi5.goTo({ sHash: "#/Other" })
  ```
