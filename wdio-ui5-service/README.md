# wdio-ui5-service ![npm](https://img.shields.io/npm/v/wdi5-service)

WebdriverIO service that provides a better test integration into any UI5 app by using the this `ui5` service.

![npm (scoped)](https://img.shields.io/npm/v/@openui5/sap.ui.core?label=ui5) ![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/wdi5/webdriverio)

## New Features

- New navigation function `goTo` [Navigation](## Navigation).
- Screenshot `browser.screenshot('some-id')`

## Installation

The easiest way is to keep wdio-ui5-service as a devDependency in your package.json by adding it via `npm install wdio-ui5-service`

```json
{
    "dependencies": {
        "wdio-ui5-service": "^0.0.1"
    }
}
```

The WDIO configuration file `wdio.conf.js` need to use `wdio-ui5-service` module as `ui5` service.

```javascript
...
services: [
    'chromedriver',
    'ui5'
]
...
```

## Control selectors

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

### Hint

## API methods

- Use the available [TestRecorder](https://blogs.sap.com/2020/01/23/test-recording-with-ui5-test-recorder/) and copy paste the suggested control selector.

### all UI5 control's native methods

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

### getAggregation

`getAggregation(sAggregationName) => wdio-ui5Controls[]`: retrieve the elements of aggregation `sAggregationName` of a control [getAggregation](https://ui5.sap.com/#/api/sap.ui.base.ManagedObject%23methods/getAggregation)

```javascript
const ui5ListItems = browser.asControl(oListSelector).getAggregation('items');
ui5ListItems.forEach((listItem) => {
    expect(listItem.getTitle()).not.toBe('');
});
```

### enterText

`enterText(sText) => this {wdio-ui5}`: input `sText` into a (input-capable) control [EnterText](https://ui5.sap.com/#/api/sap.ui.test.actions.EnterText)

```javascript
browser.asControl(inputSelector).enterText('new Text');
```

#### Function mock for event handler

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

## Navigation

The `goto(oOptions)` function can navigating by

- updating the browser hash
- using the UI5 [navTo](https://openui5.netweaver.ondemand.com/api/sap.ui.core.routing.Router#methods/navTo) function
as alternative to hash based routing.

The parameter oOptions needs to be defined as

```javascript
oOptions {sHash: '#/test', oRoute: {sComponentId, sName, oParameters, oComponentTargetInfo, bReplace}}
```

whereas you just need to provide the either `sHash` or `oRoute`.

## Assertions

Recommendation is to use the WDIO extension of JEST [expect](https://jestjs.io/docs/en/expect) and [matchers](https://jestjs.io/docs/en/using-matchers).

## Screenshots

At any point in your test(s), you can screenshot the current state of the UI:

```javascript
it('...', () => {
    // ...
    browser.screenshot('some-id');
    // ...
});
```

This puts a `png` into the configured `wdi5.screenshotPath` (in `wdio.conf.js`).

The file name is prepended with a date indicator (M-d-hh-mm-ss), holds `screenshot` in the filename and is appended with the id you provide (here: `some-id`).
Example: `5-5-17-46-47-screenshot--some-id.png`

## UI5 Bridge

### How to use it

After initialization the functionality is attached to the Webdriver browser/ device object and can be called from there.

The main featue is devilerd with the provided `asControl` function which returns the WDIO frameworks own bridge object of a UI5 control. This return object of instance `WDI5` provides multiple functions bridged to the UI5 control under the hood.

Methods to check status of a control.

- hasStyleClass
- getProperty
- getAggregation
- isVisible

Methods to change the status of a control.

- setProperty

Methods to execute an action on a control. These functions return the the object of type WebUi5 to allow method chaning.

- enterText
- press
- fireEvent

Make sure when you call a method on a control the underlying UI5 control type supports the method. Eg. call `press()` action on a `sap.m.Button` but not on a `sap.m.Text`.

### Helper

In case you are not able to create an explicit selector to your control, but you are able to find it via any webdriver strategy, you can use the `getSelectorForElement` method of the bridge. This function gets the webdriver element as parameter and returns a selector which can then beeing used in the `asControl` function.

#### Example calls

```javascript
const selector = {...} // cerate selector for a sap.m.Input on a view
const oTinput = browser.asControl(selector) // retuns a WebUi5 object
oTinput.enterText('some Text').hasStyleClass("customStyleClass")
```

### Under the Hood

Bridge to UI5
Init the needed package parts
`wdi().getWDioUi5().init()`

Return values of the `done function of executeAsync` are 'Likewise, any WebElements in the script result will be returned to the client as WebElement JSON objects.' -> [webdirver-issue](https://github.com/webdriverio/webdriverio/issues/2728#issuecomment-388330067)

| Method                  | SAP RecordReplay Method         | Description                                                                                                                                                                                                                                           |
| ----------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| + getSelectorForElement | findControlSelectorByDOMElement | Find the best control selector for a DOM element. A selector uniquely represents a single element. The 'best' selector is the one with which it is most likely to uniquely identify a control with the least possible inspection of the control tree. |
| - getControl            | findDOMElementByControlSelector | Find DOM element representation of a control specified by a selector object.                                                                                                                                                                          |
| + interactWithControl   | interactWithControl             | Interact with specific control.                                                                                                                                                                                                                       |
| + waitForUI5            | waitForUI5                      | Wait for UI5 to complete processing, poll until all asynchronous work is finished, or timeout.                                                                                                                                                        |

### How it works

### Types of Control Selectors

sap.ui.test.RecordReplay.ControlSelector

| selector    | description |
| ----------- | ----------- |
| id          | supported   |
| viewName    | supported   |
| controlType | supported   |
| bindingPath | supported   |
| I18NText    | tbd         |
| Anchestor   | tbd         |
| labelFor    | tbd         |
| properties  | supported   |

### Create Control Selector

```javascript
// create selector
const selector = {
    // wdio-ui5 selector
    wdio_ui5_key: 'mainUserInput', // unique internal key to map and find a control
    selector: {
        // sap.ui.test.RecordReplay.ControlSelector
        id: 'mainUserInput', // ID of a control (global or within viewName, if viewName is defined)
        bindingPath: {
            // internally object of sap.ui.test.matchers.BindingPath is created
            propertyPath: "/Customers('TRAIH')/ContactName"
        },
        properties: {
            // internally object of sap.ui.test.matchers.Properites is created
            value: 'Helvetius Nagy'
        },
        viewName: 'test.Sample.view.Main',
        controlType: 'sap.m.Input'
    }
};
```

#### Flaws

[OpenUI5 Issue](https://github.com/SAP/openui5/issues/2887) sap/ui/test/matchers/BindingPath cannot locate control by named model and root property

If you use a named model and a root property there is an issue in UI5 control selector.

```javascript
        bindingPath: { // internally object of sap.ui.test.matchers.BindingPath is created
            modelName: "myModelName",
            propertyPath: "/Value" // a double slash in created internally to fix the issue
        },
```

The function `_getFormattedPath` in [`BindingPath.js`](https://github.com/SAP/openui5/blob/master/src/sap.ui.core/src/sap/ui/test/matchers/BindingPath.js) does `substring(1)` if it is a named model.

This was tmp fixed in `wdio-ui5 - createMatchers` function. In case this will be fixed by UI5 this need to be adjusted.

## License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or [@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
