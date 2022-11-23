# 🧑‍🍳 Recipes

Here's a collection of "How-To"s for typical use cases in tests and how to do that with `wdi5`.

## asserting a file download

This example uses the Chrome to run the test and `chromedriver` offers some custom settings that help preparing things.

The config is set so that

- no download dialog appears
- a static download dir exists

```javascript
// in wdio.conf.cjs
"goog:chromeOptions": {
    prefs: {
        directory_upgrade: true,
            prompt_for_download: false,
                "download.default_directory": join(__dirname, "test", "__assets__")
    }
}
```

Then the download is triggered via pressing the respective UI5 button.

```javascript
// wdi5
await browser
  .asControl({
    selector: {
      id: "downloadButton",
      viewName: "profilePic.view.App"
    }
  })
  .press()
```

After the download completes, standard Node.js mechanisms are used to validate the downloaded file in the static download directory specified.

```javascript
const downloadedFile = join(__dirname, "__assets__", "image.png") // by the books, getting the image name dynamically would be a thing
// stat is from
// const { stat } = require("node:fs/promises")
expect(await (await stat(downloadedFile)).size).toBeGreaterThan(1)
```

## Chrome: auto-open debug tools

For debugging purposes, having the Developer Tools pane open automatically in the remote-controlled Chrome is essential.
For achieving this, add "auto-open-devtools-for-tabs" as `args` to the `chrome` capability:

```js
exports.config = {
  wdi5: {
    // ...
  },
  // ...
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: ["--window-size=1440,800", "--auto-open-devtools-for-tabs"] // <--
      }
    }
  ]
}
```

The browser will be started by `wdi5` with the DevTools immediately available.![remote controlled Google Chrome with Developer Tools pane open](img/auto-open-dev-tools.png)

## Chrome: run headless

"headless" means running the browser without a GUI. Running browsers in "headless" mode is a great way for running automated tests, especially in an continous integration pipeline.
In `wdio.conf.(j|t)s`, provide "headless" as `args` to the `chrome` capability:

```js
exports.config = {
  wdi5: {
    // ...
  },
  // ...
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: ["--window-size=1440,800", "--headless"] // <--
      }
    }
  ]
}
```

However, there can be one problem: The "invisible" browser window starts a viewport only the size of 800x600, which is often too small for modern responsive applications. You can combine running headless with a dedicated viewport, `1440,800` like in the example above.

## conducting a file upload

First, we utilize `wdi5` to retrieve the file uploader control.

```javascript
const uploader = await browser.asControl({
  forceSelect: true,
  selector: {
    id: "fileToUpload",
    viewName: "profilePic.view.App"
  }
})
```

Then we use `wdio` to get the file `input` element. As per the WebDriver spec, this is the one DOM element capable of receiving a programmatic file upload.

```javascript
// prep the file to upload
const fileName = "wdi5-logo.png" // relative to wdio.conf.(j|t)s
const remoteFilePath = await browser.uploadFile(filePath) // this also works in CI senarios!
// transition from wdi5 api -> wdio api
const $uploader = await uploader.getWebElement() // wdi5
const $fileInput = await $uploader.$("input[type=file]") // wdio
await $fileInput.setValue(remoteFilePath) // wdio
```

Then, typically an "upload"-like button needs to be pressed to trigger file upload.

```javascript
await browser
  .asControl({
    selector: {
      id: "upload",
      viewName: "profilePic.view.App"
    }
  })
  .press()
```

## DevX: code completion for `wdi5`- and `wdio`-API

In VS Code, use a `jsconfig.json` at the root of your JavaScript-project, at the very least containing

```json
{
  "compilerOptions": {
    "types": ["node", "webdriverio/async", "wdio-ui5-service/dist"]
  }
}
```

See an example at `/examples/ui5-js-app/jsconfig.json` in the wdi5 repository.

## DevX: (JS) cast to proper type for code completion

If your editor supports TypeScript, enjoy proper code completion in JavaScript test files by using JSDoc to inline-cast the result of `browser.asControl()` to the proper type.  
This is possible by [TypeScript's support of prefixing expressions in parenthesis with a type annotation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#casts).  
So by wrapping `browser.asControl()` in additional paranthesis and prefixing it by the JSDoc `type` annotation, the editor gets triggered to provide API completions.

The below allows for suggesting `press()` on the retrieved control, as it is cast to a [`WDI5Control`](https://github.com/ui5-community/wdi5/blob/d92eac292e4018ebefeffe268a04bb3912076e02/src/lib/wdi5-control.ts#L18):

<!-- prettier-ignore-start -->
```js
const { WDI5Control } = require("wdio-ui5-service/dist/lib/wdi5-control")
//...
/** @type {WDI5Control} */ (await browser
.asControl({
    selector: { /** ... */ }
}))
.press() // <-- code completion
```
<!-- prettier-ignore-end -->

Another example: trigger a `sap.m.List`'s aggregation function...

<!-- prettier-ignore-start -->
```js
/** @type {sap.m.List} */ (await browser.asControl({ selector: { id: "myList" } })).getItems()
```
<!-- prettier-ignore-end -->

... and how this looks in an editor supporting JSDoc annotations:

![screenshot of code completion at coding-time by using the proper JSDoc type cast](./img/jsdoc-type-cast-codecompletion.png)

## navigate an FLP tile

Feasible if your project launches as a mocked Fiori Launchpad (FLP).

Given the FLP is also a UI5 app, `wdi5`‘s standard mechanism of retrieving controls could be used in the tests.

Via the text property matcher, the tile‘s label is located (a `sap.m.Text`).

```javascript
const tile = await browser.asControl({
  selector: {
    properties: {
      text: "SAP Community Profile Picture Editor"
    },
    controlType: "sap.m.Text"
  }
})
```

Then we navigate up the control tree with the help of [`wdi5`'s fluent async api](usage#fluent-async-api) until we reach the tile itself via `.getParent().getParent()`.
A click on it brings us to the linked app itself.

```javascript
// get wdio element reference
const $tile = await tile.getWebElement()
// use wdio api
await $tile.click()
```

Why not locating that tile itself directly?
Because in most cases it doesn't have a stable ID, and thus its‘ ID might change in the next UI5 rendering cycle - using a locator id such as `__tile0` might break the test eventually then.

## send keyboard events to a Control/element

Here's an example how to paste from the clipboard into a HTML `<input>` field.
Both `wdi5`- and `wdio`-APIs are used, with a seamless transition between the two.

```js
// get the UI5 control via wdi5, then "subselect" the native HTML input field
const htmlInput = await browser.asControl(selector).$().$("input")
await htmlInput.click("") // dummy to bring focus to the <input>
await browser.keys(["Ctrl", "v"]) // paste!
```

## test a `sap.m.ComboBox` or `sap.m.MultiComboBox`

A `sap.m.ComboBox`'s or `sap.m.MultiComboBox`'s items will only be rendered when it's opened (once).
So for programmatically working and testing the control, its' `.open()`-method needs to be used:

```js
it("get combobox single item aggregation as ui5 control", async () => {
  const combobox = await browser.asControl(oComboboxSelector)
  await combobox.open() // <--

  const items = await combobox.getItems(4)
  expect(await items.getTitle()).toEqual("Bahrain")
})
```

## use control info for analysis

The control info object contains the following information:

- **`id`**: `string` // full UI5 control id as it is in DOM
- **`methods`**: `string[]` // list of available UI5 methods
- **`className`**: `string` // UI5 class name (e.g. `sap.m.Button`)
- **`$`**: `string[]` // list of WebdriverIO methods attached to `wdi5` control
- **`key`**: `string` // entry in `wdi5` cache

```js
it("check the controlInfo for className", async () => {
  const button = await browser.asControl(oButtonSelector)
  const controlInfo = button.getControlInfo() // <--
  expect(controlInfo.className).toEqual("sap.m.Button")
})
```

## using `interaction` on a selector

If you need to interact with a specific DOM element on [any of the supported controls](https://openui5.hana.ondemand.com/api/sap.ui.test.actions.Press#properties), use an `interaction` adapter.

The `interaction` can be any one of: `root`, `focus`, `press`, `auto` (default), and `{idSuffix: "myIDsuffix"}`.

Located element for each case:

- **`root`**: the root DOM element of the control
  Use this with many controls having an `items` aggregation (such as `sap.m.List`) in order to select the List itself, not the first element of the control.
  See the `listSelector` in `examples/ui5-js-app/webapp/test/e2e/generated-methods.test.js` for an example:

  ```js
  const listSelector = {
    selector: {
      id: "PeopleList",
      viewName: "test.Sample.view.Other",
      interaction: "root" // <-- hooray!
    }
  }
  ```

- **`focus`**: the DOM element that typically gets the focus
- **`press`**: the DOM element that gets the press events
- **`auto`**: the DOM element that receives events. It searches for special elements with the following priority: press, focus, root.
- **`{idSuffix: "myIDsuffix"}`**: child of the control DOM reference with ID ending in "myIDsuffix"

One common use case for changing the adapter is locating search fields:

```js
it("should find the input field on a SearchField", async () => {
  // will locate the input field
  const searchFieldSelectorInput = {
      selector: {
        controlType: "sap.m.SearchField",
        interaction: "focus"
      }
    }
  const placeholderText = await browser.asControl(searchFieldSelectorInput).getPlaceholder()
  expect(placeholderText).toEqual("Search...")
}

it("should find the search button on a SearchField", async () => {
  // will locate the search button (magnifier)
  const searchFieldSelectorSearchButton = {
      selector: {
        controlType: "sap.m.SearchField",
        interaction: "press"
      }
    }
  const searchButtonText = await browser.asControl(searchFieldSelectorSearchButton).getTitle()
  expect(SearchButtonText).toEqual("Search")
}
```

?> Note: More info on this see: https://github.com/SAP/ui5-uiveri5/blob/master/docs/usage/locators.md#interaction-adapters

## using wdio functions

WebdriverIO has a extensive element [API](https://webdriver.io/docs/api/). The [Element API] specifically can be quite useful to check if the page elements are in a certain state e.g. [isDisplayed](https://webdriver.io/docs/api/element/isDisplayed) or [isClickable](https://webdriver.io/docs/api/element/isClickable).

To make use of these element functions, `wdi5` allows to switch APIs from UI5 to wdio by calling `$()`.

```javascript
const tile = await browser.asControl({
  selector: {
    id: "idIaSync", // sap.m.Button
    viewName: "test.Sample.view.Main"
  }
})

// using fluent API
expect(await browser.asControl(iaSyncSelector).$().isDisplayed()).toBeTruthy()
expect(await browser.asControl(iaSyncSelector).$().isClickable()).toBeTruthy()
```

The `$()` method integrates nicely in `wdi5`'s fluent API or can be called separately as `getWebElement()`.

```javascript
const tile = await browser.asControl({
  selector: {
    id: "idIaSync", // sap.m.Button
    viewName: "test.Sample.view.Main"
  }
})

// standard API
const ui5Button = await browser.asControl(iaSyncSelector)
expect(await ui5Button.getWebElement().isDisplayed()).toBeTruthy()

const wdioButton = await ui5Button.getWebElement()
expect(await wdioButton.isDisplayed()).toBeTruthy()
```
