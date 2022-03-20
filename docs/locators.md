# Locators

"Locators" in `wdi5` are referred to [as "Matchers" in OPA5](https://ui5.sap.com/#/api/sap.ui.test.matchers): they identify a UI5 control to retrieve and use for further (test-)work.  
At the same time, locators are a subset [of a "Selector" in `wdi5`](usage#control-selectors).

```javascript
// this is the overall selector
const identifier = {
  wdio_ui5_key: "someCustomIdInWdi5Test",
  forceSelect: true,
  // this is the locator/matcher (sorry for not naming it as such 😬)
  selector: {
    i18NText: {
      propertyName: "text",
      key: "startPage.navButton.text"
    },
    controlType: "sap.m.Button",
    viewName: "test.Sample.view.Main"
  }
}

// get it
const control = await browser.asControl(identifier)
// use it
await control.press()
```

Here are couple of samples to get you comfortable with `wdi5`'s/OPA5's locators/matchers.

?> Note: all of them are essentially taken from the `/examples/ui5-js-app/webapp/test/e2e/**/*.test.js` files.

## ancestor

Get a "child" control from a "parent" (ancestor).

?> the optional parameter `direct` as described [in the API](https://sapui5.hana.ondemand.com/#/api/sap.ui.test.matchers.Ancestor) is currently not possible. So the locator searches all parents/descendents in the hierarchy and not only the next one in the DOM Tree

```javascript
it("get the child", async () => {
  const ancestorSelector = {
    selector: {
      controlType: "sap.m.Title",
      ancestor: {
        controlType: "sap.m.Panel"
      }
    }
  }

  const text = await browser.asControl(ancestorSelector).getText()

  expect(text).toEqual("Custom Toolbar with a header text")
})
```

## bindingPath

Retrieve a UI5 control that has a binding context with this exact binding path.  
Typically not used standalone, but in combination with [the `controlType` locator](#controlType).

```javascript
it("select ui5 input control by binding and set new value (w/ custom wdio_ui5_key)", async () => {
  const inputSelector = {
    selector: {
      interaction: "focus",
      bindingPath: {
        propertyPath: "/Customers('TRAIH')/ContactName"
      },
      viewName: "test.Sample.view.Main",
      controlType: "sap.m.Input"
    }
  }

  const value = "new value"
  const input = await browser.asControl(inputSelector)
  await input.enterText(value)

  expect(await input.getValue()).toEqual(value)
})
```

## controlType

Specify a UI5 control by its' API reference for retrieval.  
Typically not used standalone, but in combination with any other locator.

```javascript
it("get a specific list item", async () => {
  const selectorWithTitleProperty = {
    selector: {
      controlType: "sap.m.StandardListItem",
      viewName: "test.Sample.view.Other",
      properties: {
        title: "Margaret Peacock"
      }
    }
  }
  const titleFromListItem = await browser.asControl(selectorWithTitleProperty).getTitle()
  expect(titleFromListItem).toEqual("Margaret Peacock")
})
```

## descendant

Get a "parent" with the help of a "child" (aka the descendant) control.

?> the optional parameter `direct` as described [in the API](https://sapui5.hana.ondemand.com/#/api/sap.ui.test.matchers.Ancestor) is currently not possible. So the locator searches all parents/descendents in the hierarchy and not only the next one in the DOM Tree

```javascript
it("get the parent", async () => {
  const descendantSelector = {
    selector: {
      controlType: "sap.m.Panel",
      descendant: {
        controlType: "sap.m.Title",
        properties: {
          text: "Custom Toolbar with a header text"
        }
      }
    }
  }
  const sPanelText = await browser.asControl(descendantSelector).getHeaderText()
  expect(sPanelText).toEqual("Header Text")
})
```

## i18n

Retrieve a control by it's internationalization key rather than by its' visible text.

```javascript
it("check i18nText matcher user button", async () => {
  const i18nSelector = {
    selector: {
      i18NText: {
        propertyName: "text",
        // this is the key in the i18n.properties file(s)
        key: "startPage.navButton.text"
      },
      viewName: "test.Sample.view.Main"
    }
  }
  const buttonText = await browser.asControl(i18nSelector).getText()
  expect(buttonText).toEqual("to Other view")
})
```

## id (+ view)

Get a UI5 control by specifying a view-dependent `id`.

```javascript
it("control by id", async () => {
  const selector = {
    selector: {
      id: "Title::NoAction.h1", // fiori elements-like
      viewName: "test.Sample.view.Main"
    }
  }

  const titleText = await browser.asControl(selector).getText()
  expect(titleText).toEqual("UI5 demo")
})
```

## interactable

Get the designated UI5 control that is `enabled`.

!> this is a work in progress and not stable yet

```javascript
const { wdi5 } = require("wdio-ui5-service")
it("get first interactable button", async () => {
  const interactableSelector = {
    selector: {
      controlType: "sap.m.Button",
      interactable: true
    }
  }

  const button = await browser.asControl(interactableSelector)
  const status = await button.getEnabled()
  const text = wdi5.getLogger("interactable").log(`//> button text is ${await button.getText()}`)
  expect(status).toBeTruthy()
})
```

## labelFor

Retrieve the control who's `sap.m.Label` has a property `labelFor` with a specific text.

```javascript
it("get datepicker via its' label", async () => {
  const labelForSelector = {
    selector: {
      controlType: "sap.m.DateTimePicker",
      labelFor: {
        text: "labelFor DateTimePicker"
      }
    }
  }

  const placeholder = await browser.asControl(labelForSelector).getPlaceholder()

  expect(placeholder).toEqual("Enter Date ...")
})
```

## properties

Fine-tune locating a control by specifying its' properties.

```javascript
it("should find a button by the icon property", async () => {
  const selectorWithIconProperty = {
    selector: {
      controlType: "sap.m.Button",
      viewName: "test.Sample.view.Main",
      properties: {
        icon: "sap-icon://forward"
      }
    }
  }
  const buttonText = await browser.asControl(selectorWithIconProperty).getText()
  expect(buttonText).toEqual("to Other view")
})
```

## RegEx

Locate a control by using a Regular Expression as control `id` value. The RegEx syntax can be either

- a JavaScript RegEx object
- a JavaScript RegEx notation or
- a descriptive declaraion

```javascript
it("should find the 'open dialog' button", async () => {
  const selectorByTextRegex = {
    selector: {
      controlType: "sap.m.Button",
      properties: {
        // regex obj
        text: new RegExp(/.*ialog.*/gm)
        // // regex notation
        // text: /.*openDialogButton$/gim
      }
    }
  }

  const textViaPropertyRegEx = await browser.asControl(selectorByTextRegex).getText()
  expect(textViaPropertyRegEx).toEqual("open Dialog")

  const selectorByDeclarativeRegex = {
    selector: {
      controlType: "sap.m.Button",
      properties: {
        text: {
          regex: {
            source: ".*ialog.*", // descriptive declaration
            flags: "gm"
          }
        }
      }
    }
  }
  const textViaDeclarative = await browser.asControl(selectorByDeclarativeRegex).getText()
  expect(textViaDeclarative).toEqual("open Dialog")
})
```

## sibling

Get a UI5 control from the same hierarchial level in the DOM where a specified UI5 control is located.  
As of now, this retrieves the first matched `sibling` only - which is the first UI5 control on the same hierarchical level in the view.

```javascript
it("get first button on the same level as an input", async () => {
  const siblingsSelector = {
    selector: {
      controlType: "sap.m.Button",
      sibling: {
        controlType: "sap.m.Input"
      }
    }
  }

  const button = await browser.asControl(siblingsSelector)

  const sButtonText = await button.getText()
  expect(sButtonText).toEqual("to Other view")
})
```
