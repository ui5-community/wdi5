# Using `wdi5`

With `wdi5` being a service to WebdriverIO, it provides a superset of `wdio`'s functionality.

When a control [is located via `wdi5`](#control-selectors), its' methods in Node.js-scope are aligned with those [of the UI5 control](https://ui5.sap.com/#/api).

```js
// assuming input is of type sap.m.Input
const input = await browser.asControl(selector)
await input.getValue() // same .getValue in wdi5 and UI5!
```

Additionally, all object APIs in `wdi5` are aligned with their [UI5 Managed Object counterpart](https://ui5.sap.com/#/api/sap.ui.base.ManagedObject).

```js
// assuming title is a sap.m.Title
const title = await browser.asControl(selector)
// bindingInfo is a UI5 Managed Object, not a UI5 control!
const bindingInfo = await title.getModel()
const name = await bindingInfo.getProperty("/path/in/model") // same .getProperty in wdi5 and UI5!
```

?> there is no [fluent async api](#fluent-async-api) available for both the aligned Managed Object API and [`.asObject`](#asobject)

At the same time, the `wdi5`-api can be mixed with `wdio`'s api during tests at will - there is no restriction to use either one. Even a [fluent async transition](ttps://ui5-community.github.io/wdi5/#/recipes?id=using-wdio-functions) between the two is possible:

```js
// from wdi5 -> wdio
const htmlInput = await browser.asControl(selector).$().$("input")
await htmlInput.click("") // dummy to bring focus to the <input>
await browser.keys(["Ctrl", "v"])
```

See below for many more examples on both using `wdi5`- and `wdio`-APIs, denoting which API is used where.

## Files

### Location

The files containing tests should reside in `$ui5-app/webapp/test/` and be named `*.test.(j|t)s`.
Yet both test file directory and naming pattern can be specified [via WebdriverIO's `specs`](https://webdriver.io/docs/options#specs) in [`wdio.conf.(j|t)s`](/configuration#wdi5).

?> `wdi5` can be used both in a [CJS-](https://nodejs.org/docs/latest/api/modules.html) and an [ESM-](https://nodejs.org/docs/latest/api/esm.html)environment. The code examples sometimes use either or, but in no favor of one over the other.

### Test suites

WebdriverIO and `wdi5` can be used with [Mocha](http://mochajs.org/), [Jasmine](http://jasmine.github.io/), and [Cucumber](https://cucumber.io/), with Mocha being used in [all examples](https://github.com/ui5-community/wdi5/tree/main/examples) in `wdi5`.

Mocha tests [are structured with `describe`-blocks ("suite"), containing `it`s ("tests")](https://mochajs.org/#getting-started). They can contain [hooks](https://mochajs.org/#describing-hooks), e.g. to run code before all tests (`before`).

<!-- tabs:start -->

#### **JavaScript (CJS)**

```js
const { wdi5 } = require("wdio-ui5-service")

describe("test suite description", () => {
  before(async () => {
    await wdi5.goTo("#/Page")
  })

  it("should do this", async () => {
    const selector = {
      /* ... */
    }
    const prop = await browser.asControl(selector).getProperty("...")
    expect(prop).toEqual("...")
  })
  it("should do that", async () => {
    //...
  })
})
```

#### **JavaScript (ESM)**

```js
import { wdi5 } from "wdio-ui5-service"

describe("test suite description", () => {
  before(async () => {
    await wdi5.goTo("#/Page")
  })

  it("should do this", async () => {
    const selector = {
      /* ... */
    }
    const prop = await browser.asControl(selector).getProperty("...")
    expect(prop).toEqual("...")
  })
  it("should do that", async () => {
    //...
  })
})
```

#### **TypeScript**

```ts
import { wdi5 } from "wdio-ui5-service"
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"

describe("test suite description", () => {
  before(async () => {
    await wdi5.goTo("#/Page")
  })

  it("should do this", async () => {
    const selector: wdi5Selector = {
      /* ... */
    }
    const prop: string = await browser.asControl(selector).getProperty("...")
    expect(prop).toEqual("...")
  })
  it("should do that", async () => {
    //...
  })
})
```

<!-- tabs:end -->

Another recommendation is to only use one `describe` per test file, named similar to the file name, in order to stay organized.

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

!> the `findAllDOMElementsByControlSelector` UI5 API is only available in UI5 >= 1.87.7, so you can use `browser.allControls(...)` only with UI5 (apps) >= 1.87.7

?> the `selector` is used to establish a cache for _all_ controls. So when providing [the `forceSelect: true` selector option](#control-selectors), the cache for all controls of that type will be invalidated.

?> there is no [fluent async api](#fluent-async-api) available for `.allControls`.

Switching between `wdi5`- and WebdriverIO-API is possible on any of the controls retrieved by `allControls` just as it is for a single control located via `.asControl`

```js
const buttons = await browser.allControls(manySelector)
// $button0 and $button have the WebdriverIO api
const $button0 = await buttons[0].getWebElement()
const $button = await browser.asControl(singleSelector).getWebElement()
```

### asObject

If `wdi5` detects a [UI5 managed object](https://ui5.sap.com/#/api/sap.ui.base.ManagedObject) as a result of a method call on a retrieved UI5 control (e.g. `await control.getBindingContext()`), it will transparently deliver that object back to Node.js-scope [as a `wdi5-object`](https://github.com/ui5-community/wdi5/blob/main/src/lib/wdi5-object.ts). This allows for an API alignment between Node.js- and browser-/UI5-scope.

?> there is no [fluent async api](#fluent-async-api) available for `.asObject` and for the aligned Managed Object API

The dedicated `browser.asObject($uuid)` re-fetches a previously retrieved UI5 Object from the browser-scope. `$uuid` can be obtained by querying the UI5 Object with `.getUUID()`.

```js
// earlier...
const bindingInfo = await control.getBinding("text")
//...
// later:
const object = await browser.asObject(bindingInfo.getUUID())
const bindingInfoMetadata = await object.getMetadata()
const bindingTypeName = await bindingInfoMetadata.getName()
expect(bindingTypeName).toEqual("sap.ui.model.resource.ResourcePropertyBinding")
```

## Control selectors

The entry point to retrieve a control is always awaiting the `async` function `browser.asControl(oSelector)`.

`oSelector` re-uses the [OPA5 control selectors](https://ui5.sap.com/#/api/sap.ui.test.Opa5%23methods/waitFor), supplemented by the optional `wdio_ui5_key` and `forceSelect` properties.

`wdi5` stores control references internally in order to save browser roundtrip time on repeatedly using a control across different test cases. For that, `wdi5` computes unique identifiers for controls - but providing a `wdio_ui5_key` in the selector, you can assign such an ID manually if required.

The `forceSelect` (default: `false`) property can be set to `true` to force `wdi5` to again retrieve the control from the browser context and update the internally stored reference as well as available control methods. This might be useful if the tested application has destroyed the initial control and recreated it.

The `forceSelect` option also updates the `wdio` control reference each time a method is executed on a `wdi5` control.

The `timeout` option (default based on the global configuration `waitForUI5Timeout` [setting](wdio-ui5-service/README.md#installation)) controls the maximum waiting time while checking for UI5 availability _(meaning no pending requests / promises / timeouts)_.

The `logging` (default: `true`) property can be set to `false` to disable the log for this specific selector. This can be useful when you want to assert, that specific controls should not be visible on the UI to decrease the amount of pointless error messages.

```javascript
it("validates that $control's text is ...", async () => {
  const oSelector = {
    wdio_ui5_key: "wdio-ui5-button", // optional unique internal key to map and find a control
    forceSelect: true, // forces the test framework to again retrieve the control from the browser context
    timeout: 15000, // maximum waiting time (ms) before failing the search
    logging: false, // optional (default: `true`) disables the log for this specific selector
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

|       selector | supported in `wdi5` |
| -------------: | ------------------- |
|     `ancestor` | &check;             |
|  `bindingPath` | &check;             |
|  `controlType` | &check;             |
|   `descendant` | &check;             |
|     `I18NText` | &check;             |
|           `id` | &check;             |
| `interactable` | &check;             |
|     `labelFor` | &check;             |
|   `properties` | &check;             |
|        `RegEx` | &check;             |
|      `sibling` | &check;             |
|     `viewName` | &check;             |

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

`enterText(text)`: input `text` (`string`) into a (input-capable) control via [EnterText](https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

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

### `exec`

You can execute a given function, optionally with arguments, on any UI5 control and return an arbitrary result of a basic type, or even an object or array. This is for example helpful to boost performance when verifying many entries in a single table, since there is only one round trip to the browser to return the data.

The `this` keyword will refer to the UI5 control you execute the `exec` function on.

Regular functions are accepted as well as arrow functions.

```javascript
const button = await browser.asControl(buttonSelector)
let buttonText = await button.exec(function () {
  //regular function
  return this.getText()
})
buttonText = await button.exec(() => this.getText()) //inline arrow function
buttonText = await button.exec(() => {
  return this.getText()
}) //arrow function

//passing arguments is possible, example for using it to verify on browser side and returning only a boolean value
const textIsEqualToArguments = await button.exec(
  (textHardcodedArg, textVariableArg) => {
    return this.getText() === textHardcodedArg && this.getText() === textVariableArg
  },
  "open Dialog",
  expectedText
)

//example what could be done with a list
const listData = await browser.asControl(listSelector).exec(function () {
  return {
    listTitle: this.getHeaderText(),
    listEntries: this.getItems().map((item) => item.getTitle())
  }
})
```

### fluent async api

`wdi5` supports `async` method chaining. This means you can directly call a `UI5` control's methods after retrieveing it via `browser.asControl(selector)`:

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

Note that chaining only works if you start your call with `browser.asControl()`. The fluent async api will not work starting with an already retrieved UI5 element.

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

Recommendation is to use the [`Webdriver.IO`](https://webdriver.io)-native extension to JEST's [expect](https://jestjs.io/docs/en/expect) and [matchers](https://jestjs.io/docs/en/using-matchers) as described in <https://webdriver.io/docs/assertion.html>.

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
const { wdi5 } = require("wdio-ui5-service")
wdi5.getLogger().log("any", "number", "of", "log", "parts")
```

The log level is either set in `wdio.conf.js` via `wdi5.logLevel` or
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
  await wdi5.goTo(oRouteOptions)
  // or:
  await wdi5.goTo("#/Other")
  // or:
  await wdi5.goTo({ sHash: "#/Other" })
  ```

## Control Info

Control info is an object which can be retrieved from any wdi5 control by calling `getControlInfo()`. The control information object is loosely based on the UI5 metadata and also contains `className` and `id`.

The list of attached wdio methods can be found in `$` and the UI5 control methods in the property `methods`.

These properties can help to identify the received control or test the control correctness.

```js
  const button = browser.asControl(oButtonSelector)

  const controlInfo = button.getControlInfo() // <--
  /*
   * id?: string // full UI5 control id as it is in DOM
   * methods?: string[] // list of UI5 methods attached to wdi5 control
   * className?: string // UI5 class name
   * $?: Array<string> // list of UwdioI5 methods attached to wdi5 control
   * key?: string // wdio_ui_key
   */
})
```

## Test Performance/Responsiveness

There is no tooling included with `wdi5` for asserting runtime performance metrics. Reason for this is to keep `wdi5`'s dependencies to a minimum - plus there are easy to use tools for that job such as [marky](https://www.npmjs.com/package/marky).

Here's an example test to check the responsiveness via `marky` of an application opening a `sap.m.Dialog` after a clicking a button:

```js
const marky = require("marky")

// ...

it("test responsiveness of button action", async () => {
  marky.mark("start_action")
  const response = await browser.asControl(buttonSelector).press().getText()
  const entry = marky.stop("stop_action")

  // verify the result of the button action
  expect(response).toEqual("open Dialog")

  // check the duration of the operation
  expect(entry.duration).toBeLessThan(3000)

  // logger can be used in combination
  wdi5.getLogger().info(entry)
}
```

## Multiple browser instances ("multiremote")

`wdi5` allows for operating multiple browser instances with a single test (suite) - think of a usecase such as "instant messaging test between two people". This is built on top of [WebdriverIO's "multiremote" feature of the same name](https://webdriver.io/docs/multiremote) ("running multiple automated sessions in a single test") and provides the same configuration options.

Basic usage: change `capabilities` in your `wdio.conf.(j|t)s` to

```js
// ...
  capabilities: {
        one: {
            capabilities: {
                browserName: "chrome",
                acceptInsecureCerts: true
            }
        },
        two: {
            capabilities: {
                browserName: "chrome",
                acceptInsecureCerts: true
            }
        }
    }
// ...
```

Now you can access each browser instances by calling them by their `capabilities` name, using the regular `wdi5` APIs [`browser.asControl($selector)`](/usage#ascontrol) and [`browser.allControls($selector)`](/usage#allcontrols) (just like in "single remote" test):

```js
const button1 = await browser.one.asControl({
  selector: {
    id: "openDialogButton",
    viewName: "test.Sample.view.Main"
  }
})
const button2 = await browser.two.asControl({
  selector: {
    id: "openDialogButton",
    viewName: "test.Sample.view.Main"
  }
})
```

Or operate all browser instances at the same time:

```js
const buttonFromAllInstances = await browser.asControl({
  selector: {
    id: "openDialogButton",
    viewName: "test.Sample.view.Main"
  }
})
```

...and get an array of controls back as retrieved by all instances. Subsequently, the control retrieved by each instance is accessible at the array index corresponding to the browser defined in the `capabilities` sequence in `wdio.conf.(j|t)s`:

```js
const buttonOne = buttonFromAllInstances[0]
const buttonTwo = buttonFromAllInstances[1]
```

Some example tests are located at `/examples/ui5-js-app/webapp/test/e2e/multiremote.test.js`.

## Using BAS with wdi5

The `Headless Testing Framework` extension enables you to use the wdi5 capabilities when working in SAP Business Application Studio.
To enable the extension:

1. Add the `Headless Testing Framework` extension to your dev space. This will install a Firefox driver in the dev space.

2. Verify that the Firefox driver has been installed correctly using the following commands on the Terminal:

```shell
# terminal 1: the Firefox version
$> firefox --version
Mozilla Firefox 102.8.0esr

# terminal 2: the location of the executable
$> which firefox
/extbin/bin/firefox

```

3. Adapt your configuration file (`wdio.conf.(j|t)s`) to run your tests headless.

- Replace `capabilities` with the following code. The `firefox version` and `path/to/firefox` values appear in the results from the command you ran in the previous step.

```js
// ...
capabilities: [
  {
    acceptInsecureCerts: true,
    browserName: "firefox",
    browserVersion: "<firefox version>",
    "moz:firefoxOptions": {
      binary: "<path/to/firefox>",
      args: ["-headless"],
      log: { level: "trace" }
    }
  }
]
// ...
```

- Replace `sevices` with the following code:

```js
// ...
services: [
  [
    "geckodriver",
    // service options
    {
      // OPTIONAL: Arguments passed to geckdriver executable.
      // Check geckodriver --help for all options. Example:
      // ['--log=debug', '--binary=/var/ff50/firefox']
      // Default: empty array
      args: ["--log=trace"],

      // The path where the output of the Geckodriver server should
      // be stored (uses the config.outputDir by default when not set).
      outputDir: "./logs"
    }
  ],
  "ui5"
]
// ...
```

For example:

```js
// ...
const path = require("path")

exports.config = {
  runner: "local",
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called.
  //
  // The specs are defined as an array of spec files (optionally using wildcards
  // that will be expanded). The test for each spec file will be run in a separate
  // worker process. In order to have a group of spec files run in the same worker
  // process simply enclose them in an array within the specs array.
  //
  // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
  // then the current working directory is where your `package.json` resides, so `wdio`
  // will be called from there.
  //
  specs: ["./webapp/test/**/*.test.js"],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://saucelabs.com/platform/platform-configurator
  //
  capabilities: [
    {
      acceptInsecureCerts: true,
      browserName: "firefox",
      browserVersion: "102",
      platformName: "linux",
      "moz:firefoxOptions": {
        binary: "/extbin/bin/firefox",
        args: ["-headless"],
        log: { level: "trace" }
      }
    }
  ],

  // If outputDir is provided WebdriverIO can capture driver session logs
  // it is possible to configure which logTypes to include/exclude.
  // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
  // excludeDriverLogs: ['bugreport', 'server'],

  wdi5: {
    screenshotPath: path.join("wdio-ui5-service", "test", "report", "screenshots"),
    logLevel: "verbose",
    platform: "browser",
    url: "index.html",
    deviceType: "web"
  },

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "trace",
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevels: {
    webdriver: "trace"
  },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: "http://localhost:8080/index.html",
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  //services: ['chromedriver', 'ui5'],
  services: [
    [
      "geckodriver",
      // service options
      {
        // OPTIONAL: Arguments passed to geckdriver executable.
        // Check geckodriver --help for all options. Example:
        // ['--log=debug', '--binary=/var/ff50/firefox']
        // Default: empty array
        args: ["--log=trace"],

        // The path where the output of the Geckodriver server should
        // be stored (uses the config.outputDir by default when not set).
        outputDir: "./logs"
      }
    ],
    "ui5"
  ],
  before: function (capabilities, specs) {
    browser.setWindowSize(1600, 1200)
  },

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "mocha",
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  reporters: ["spec"],

  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: "bdd",
    timeout: 60000
  }
}
// ...
```

See the [documentation](https://webdriver.io/docs/configuration/) for more information on the webdriver configuration.

4. Make sure that UI5 app is running and Run the tests using the `wdio run wdio.conf.js` command.
