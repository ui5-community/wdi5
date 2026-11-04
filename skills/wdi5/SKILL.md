---
name: wdi5
description: Write, extend or debug wdi5 (wdio-ui5-service) end-to-end tests for UI5 and SAP Fiori elements apps. Use when creating a *.test.js / *.test.ts spec that drives a UI5 app in the browser, choosing a control selector, using the Fiori elements test library through wdi5, or finding out why a wdi5 test fails or is flaky.
---

# Writing wdi5 tests

`wdi5` is a WebdriverIO service (`wdio-ui5-service`) that locates UI5 _controls_ instead of DOM
elements and gives the test the control's own UI5 API. Full documentation:
<https://ui5-community.github.io/wdi5/>.

## Workflow

1. **Read the app before writing a selector.** Never guess IDs. Collect them from the source:
   - `manifest.json`: `sap.app.id`, routing targets and their view names, the i18n bundle.
     A selector's `viewName` is the full name: routing `config.viewPath` plus the target's
     `viewName` (`viewPath: "my.app.view"` + `"Detail"` = `"my.app.view.Detail"`).
   - the XML views: control `id`s, control types, bindings
   - `i18n.properties`: keys of visible texts
   - for Fiori elements apps: routing targets (`componentId`) and their `entitySet`
2. **Pick the API** (see [Which API](#which-api)).
3. **Look at the project's existing specs and page objects** and follow their structure. Without
   any: one `describe` per file, a `before` hook that navigates to the start route, one user step
   per `it`.
4. **Write the spec**, one `describe` per file, named like the file.
5. **Run it** against the running app and fix what fails. A spec that has never run is not done.

## Which API

| Situation                                                  | Use                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Fiori elements OData V4 app (List Report, Object Page)     | the [test library](#fiori-elements-test-library) via `browser.fe` |
| Freestyle UI5 app, or custom parts of a Fiori elements app | `browser.asControl(selector)` / `browser.allControls(selector)`   |
| Plain DOM work (file input, keyboard, `isDisplayed`)       | switch to WebdriverIO with `.$()` / `.getWebElement()`            |

The three can be mixed in one test.

## Selectors

A selector wraps an OPA5/RecordReplay control selector:

```js
const saveButton = {
  selector: {
    controlType: "sap.m.Button",
    viewName: "my.app.view.Detail",
    i18NText: { propertyName: "text", key: "detail.save" }
  }
}
await browser.asControl(saveButton).press()
```

Prefer, in this order:

1. `id` **plus** `viewName` (the view-local id from the XML view, not the generated DOM id)
2. `controlType` plus `properties`, `i18NText`, `bindingPath` or `labelFor`
3. `ancestor` / `descendant` / `sibling` to narrow down a control without its own stable key
4. `id` as a `RegExp` (e.g. `/.*saveButton$/`) only when the view is not known

Never use generated ids such as `__xmlview0--button1` or `__button3`: they change with every
render order. `i18NText` survives text changes and other languages, but the key must resolve in the
bundle of the app's current locale. `properties: { text }` is fine for texts that are not
translated anyway.

Selector options next to `selector`:

- `forceSelect: true`: fetch the control again instead of using wdi5's cache. Needed when the app
  destroyed and recreated the control (navigation, re-rendering, a reopened dialog).
- `interaction`: which DOM part to address: `"root"`, `"focus"` (e.g. the input of a
  `sap.m.SearchField`), `"press"`, `"auto"` (default) or `{ idSuffix: "..." }`. The default
  `"auto"` picks the element that receives events, which can belong to an **inner control**: a
  `sap.m.List` resolves to its first item, a `sap.m.Page` with `showNavButton` to its nav button.
  Use `"root"` to get the container itself.
- `timeout`: per-selector override of `waitForUI5Timeout`.
- `logging: false`: silence the error log when the test expects the control to be absent.

Check what a selector really resolves to before asserting on it:

```js
const control = await browser.asControl(selector)
console.log(control.getControlInfo()) // { className, id, methods, key }
```

If `className` is not the type you meant, add `interaction: "root"` or narrow the selector.
`browser.allControls(selector)` shows how many controls match.

wdi5 caches a control under a key built from `id` and `viewName` (or `wdio_ui5_key`). Two selectors
that differ only in `interaction` get the same cached control: give them different `wdio_ui5_key`s
or set `forceSelect: true`.

## Working with controls

```js
const input = await browser.asControl(inputSelector)
await input.enterText("Jane") // type into an input-capable control
expect(await input.getValue()).toEqual("Jane") // any public UI5 method works

await browser.asControl(buttonSelector).press() // click
const title = await browser.asControl(listSelector).getItems(1).getTitle() // fluent chain
```

- **Await every call.** Every control method returns a promise.
- A failing call inside a fluent chain does not throw right away: the chain resolves to `undefined`
  and wdi5 logs `One of the calls in the queue "getTitle()" previously failed!`. Usually the
  selector matched a different control type. Split the chain, await the control and check
  `getControlInfo()`.
- The **fluent chain** only works when it starts at `browser.asControl(...)`, and it ends at the
  first call that returns a plain value (a string has no `getMaxLines()`). `allControls`,
  `asObject` and managed objects such as a binding context have no fluent chain.
- Aggregations: `getAggregation("items")` or the shorthand `getItems()`. `getItems(2)` returns only
  that one control, `getItems(true)` returns WebdriverIO elements only. Both are much faster than
  fetching every item as a control.
- Many values at once: `control.exec(function () { return this.getItems().map((i) => i.getTitle()) })`
  runs in the browser and makes one round trip. `this` is the UI5 control.
- `sap.m.ComboBox` / `MultiComboBox` render their items only once opened: call `.open()` first.
- Private methods (`_...`), `getMetadata` and native `getAggregation` are not proxied.
- `getControlInfo()` returns `className`, `id` and the available `methods`; useful when a selector
  matches a different control than intended.

Navigation: `await wdi5.goTo("#/Detail/1")` or `await wdi5.goTo({ sHash: "#/Detail/1" })`, or a
router target `{ sComponentId, sName, oParameters }`. Import `wdi5` with
`import { wdi5 } from "wdio-ui5-service"` (ESM/TypeScript) or
`const { wdi5 } = require("wdio-ui5-service")` (CommonJS).

Assertions use WebdriverIO's `expect` (global, Jest-style matchers such as `toEqual`,
`toBeGreaterThan`).

## Waiting

wdi5 waits on its own until UI5 is idle (no pending requests, promises or timeouts) before it
locates a control. So:

- no `browser.pause()` and no fixed sleeps
- increase `waitForUI5Timeout` (config) or the selector `timeout` for genuinely slow backends
- long-polling or streaming requests block that waiting: exclude them with `ignoreAutoWaitUrls`

## Fiori elements test library

For Fiori elements OData V4 apps, drive standard floorplans through `sap.fe.test` instead of
locating its controls one by one:

```js
let FioriElementsFacade
before(async () => {
  FioriElementsFacade = await browser.fe.initialize({
    onTheMainPage: {
      ListReport: { appId: "my.app", componentId: "TravelList", entitySet: "Travel" }
    },
    onTheDetailPage: {
      ObjectPage: { appId: "my.app", componentId: "TravelObjectPage", entitySet: "Travel" }
    },
    onTheShell: { Shell: {} }
  })
})

it("creates a travel", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheMainPage.onTable().iExecuteAction("Create")
    Then.onTheDetailPage.iSeeThisPage()
    When.onTheDetailPage.onForm("General Information").iChangeField("Description", "Trip")
    When.onTheDetailPage.onFooter().iExecuteSave()
    Then.onTheDetailPage.onHeader().iCheckEdit({ visible: true })
  })
})
```

- `appId` = `sap.app.id`, `componentId` = the routing target id, `entitySet` = that target's
  `options.settings.entitySet` (all in `manifest.json`).
- Actions are named `i<DoSomething>`, assertions `i<Check|See>...`, chained with `.and`.
- Elements are addressed by their visible label (`iExecuteAction("Create")`).
- API reference: <https://ui5.sap.com/#/api/sap.fe.test>.
- Test your own logic (custom actions, annotations you wrote), not what the framework already tests.
- Custom controls in a Fiori elements app: use `asControl` outside the `execute` callback.

## Scope

End-to-end tests are slow: cover the happy path and the important error cases with the shortest
UI path. Variations belong in unit or component tests (QUnit, OPA5 with a mock server).

## Running and debugging

- The app must be served (e.g. `ui5 serve`) at the `baseUrl` of `wdio.conf.(j|t)s`; `baseUrl`
  points directly at the page that bootstraps UI5, not at an approuter redirect.
- One spec: `npx wdio run wdio.conf.js --spec ./webapp/test/e2e/my.test.js`. Headless mode is set in
  the config's browser capabilities; check how the project's config does it.
- More output: `wdi5: { logLevel: "verbose" }`. The test library then also prints the OPA log,
  which says how many controls matched.
- `await browser.screenshot("before-save")` writes to `wdi5.screenshotPath`.
- Breakpoints: run wdio from a VS Code "JavaScript Debug Terminal".

## TypeScript

```ts
import { wdi5Selector } from "wdio-ui5-service"
import Button from "sap/m/Button"

const selector: wdi5Selector = { selector: { id: "save", viewName: "my.app.view.Detail" } }
const button = await browser.asControl<Button>(selector)
```

## Authentication

Configured per capability as `"wdi5:authentication"` (SAP Cloud IdP, SAP Cloud Identity
Services, Office 365, custom IdP, basic auth). For a local CAP backend with mocked users, use
`provider: "BasicAuth"` with `basicAuthUrls` pointing at each service's `$metadata`. wdi5 reads
credentials only from environment variables (`wdi5_username`, `wdi5_password`, e.g. via a
git-ignored `.env`), never from the config file. Details:
<https://ui5-community.github.io/wdi5/#/authentication>.
