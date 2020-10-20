# wdi5 ![npm](https://img.shields.io/npm/v/wdi5)

`wdi5` (/vdif5/) is a wrapper around [appium](http://appium.io)-driven [`Webdriver.IO`](https://webdriver.io)-tests, utilizing [`UI5`’s test API](https://ui5.sap.com/#/api/sap.ui.test).

It is designed to run cross-platform, executing OPA5-/UIveri5-style integration tests on a UI5 application - in the browser, in a hybrid ([cordova](https://cordova.apache.org)) container or as an Electron application.

![npm (scoped)](https://img.shields.io/npm/v/@openui5/sap.ui.core?label=ui5) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/webdriverio) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/appium)

`wdi5` = UI5 Test API + Webdriver.IO + appium

![demo testing iOS + browser in parallel](./docs/demo-testing.gif)

## about

`wdi5` comes in two flavours:

-   `wdio-ui5-service`: a browser-based plugin to `WebdriverIO`
-   `wdi5`: an extension to `WebdriverIO`, using `appium` to communicate with the hybrid app on iOS, Android and Electron.  
    The `wdi5`-extension contains `wdio-ui5-service`, allowing for both browser-based and hybrid-app-testing.

`wdio-ui5-service` allows for a lightweight setup if test scope is on the browser. As to where the `wdi5`-extension gives you the full "app-package".

## Installation + Setup

Specific to the desired test-scope, please see:

-   brower-based "Webdriver.IO"-plugin: [wdio-ui5-service](./wdio-ui-service/README.md)
-   hybrid app extension: [wdi5](./wdi5/README.md) (includes all browser-based capabilities)

## Usage

Run-(Test-)Time usage of `wdi5` is agnostic to its' test-scope (browser or native) and centers around the global `browser`-object, be it in the browser or on a real mobile device.

### Control selectors

The entry point to retrieve a control is always `browser.asControl(oSelector)`.

`oSelector` re-uses the [OPA5 control selectors](https://ui5.sap.com/#/api/sap.ui.test.Opa5%23methods/waitFor), supplemented by the optional `wdio_ui5_key` and `forceSelect` properties.

`wdio-ui5` stores control references internally in order to save browser roundtrip time on repeatedly using a control across different test cases. For that, `wdio-ui5` computes unique identifiers for controls - with `wdio_ui5_key`, you can assign such an ID manually if required.

The `forceSelcet` (default: `false`) property can be set to true to force `wdio-ui5` to again retrieve the control from the browser context and update the internally stored reference.

```javascript
const oSelector = {
    wdio_ui5_key: 'wdio-ui5-button', // optional unique internal key to map and find a control
    forceSelect: true, // forces the test framework to retrieve the control freshly from the browser context
    selector: {
        // sap.ui.test.RecordReplay.ControlSelector
        id: 'UI5control_ID',
        viewName: 'your.namespace.App'
    }
};
const control = browser.asControl(oSelector);
// now use one of the below API methods on <control>
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
const control = browser.asControl(bindingPathSelector);
// now use one of the below API methods on `control`
```

**`wdio-ui5` supports method chaining**, so you can do:

```javascript
browser.asControl(selector).getText().getId().setProperty('title', 'new title');
```

In case you are not able to create an explicit selector for a control, but you are able to find it via any [webdriver strategy](https://www.w3.org/TR/webdriver/#locator-strategies), you can use the `getSelectorForElement` method of the UI5-wdio-bridge.

This function gets the webdriver element as parameter and returns a selector which can then be used in the `asControl` function.

```javascript
const webdriverLocatorSelector = {
    selector: browser.getSelectorForElement({
        domElement: $('/xpath/to/button'),
        settings: {preferViewId: true}
    })
};
const control = browser.asControl(webdriverLocatorSelector);
// now use any of the UI5 native controls' API methods on `control`
```




### API methods

-   Use the available [TestRecorder](https://blogs.sap.com/2020/01/23/test-recording-with-ui5-test-recorder/) and copy paste the suggested control selector.

#### all UI5 control's native methods

Once the control is retrieved in a test, use any of the native UI5 control's methods on it.
This is possible because of a runtime proxy `wdio-ui5` provides that transistions the UI5 control's method from browser- to Node.js-runtime.

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
`getAggregation` is provided by `wdio-ui5` separately with a UI5-compatible API signature:

#### getAggregation

`getAggregation(sAggregationName) => wdio-ui5Controls[]`: retrieve the elements of aggregation `sAggregationName` of a control [getAggregation](https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getAggregation)

```javascript
const ui5ListItems = browser.asControl(oListSelector).getAggregation('items');
ui5ListItems.forEach((listItem) => {
    expect(listItem.getTitle()).not.toBe('');
});
```

#### enterText

`enterText(sText) => this {wdio-ui5}`: input `sText` into a (input-capable) control [EnterText](https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

```javascript
browser.asControl(inputSelector).enterText('new Text');
```

### Function mock for event handler

If an item has a custom attribute defined eg. `data:key="exampleKey"` which is needed in the event handler function, the access of the `data()` function to retrieve the key can be done by specifying an `eval` property as (object) argument to the event handler.

Can be accessed in standard UI5 manner `oEvent.getParameter("listItem").data("key")`.

```javascript
// use in wdio-ui5 test
// example for the [sap.m.List](https://sapui5.hana.ondemand.com/#/api/sap.m.ListBase%23events/itemPress) event `itemPress`
browser.asControl(listSelector).fireEvent('itemPress', {
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

Recommendation is to use the WDIO extension of JEST [expect](https://jestjs.io/docs/en/expect) and [matchers](https://jestjs.io/docs/en/using-matchers).

### Screenshots

At any point in your test(s), you can screenshot the current state of the UI:

```javascript
it('...', () => {
    // ...
    browser.screenshot('some-id');
    // ...
});
```

This puts a `png` into the configured `wdi5.screenshotPath` (from `wdio.conf.js`).

The file name is prepended with a date indicator (M-d-hh-mm-ss), holds `screenshot` in the filename and is appended with the id you provide (here: `some-id`).
Example: `5-5-17-46-47-screenshot--some-id.png`

## FAQ/hints

`wdi5` tests itself with `wdi5` - see the `test/`- and `test/ui5-app/test/e2e/` directory for a sample `wdio.conf.js`-files and sample tests.

Run `yarn test` for `wdi5` testing itself 😊

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
