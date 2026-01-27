# 📚 Test Library Integration

A test library provides test functions that can be used to safeguard your Fiori / UI5 app in combination with your own test functions.

## Why should you use the SAP Fiori elements for OData V4 test library?

The [SAP Fiori elements for OData V4 test library](https://ui5.sap.com/#/api/sap.fe.test) (hereinafter referred to as **test library**) provides a set of test functions that can be reused within [OPA5](https://sapui5.hana.ondemand.com/#/topic/2696ab50faad458f9b4027ec2f9b884d) or [wdi5](https://github.com/ui5-community/wdi5) tests of [SAP Fiori elements](https://experience.sap.com/fiori-design-web/smart-templates/) OData V4 applications. When you write such tests, you only need to test the application-specific functionalities, e.g. a custom action. The core functionalities provided by SAP Fiori elements are already tested by the framework itself.

Nevertheless, you need to implement certain steps to test the specific functionalities of the app, e.g. loading data into the list-report, navigating between a list-report and an object-page, saving business objects, etc. To implement these steps within a wdi5 test, you can reuse the test functions of the test library and you don´t need to re-implement these functions. This saves time and avoids redundancy.

Another advantage of using the test library is that updates for the test functions due to framework changes are automatically provided by the framework. This ensures that your tests will not break.

### Main benefits of using the test library

- Reduce test maintenance efforts and avoid code repetition.
- Isolate generic actions and assertions in the test library and reuse them across apps.
- Tests are readable and simplified.
- Test library is kept up to date with component changes in the framework.

### What to test / not to test in a Fiori Elements app?

- [Custom Actions](https://sapui5.hana.ondemand.com/sdk/#/topic/7619517a92414e27b71f02094bd08d06), Complex UI annotations
- Code under your responsibility
- Do NOT test framework functionality

## Content of the test library

- **Base arrangements:** Control the lifecycle of the app.
- **ListReport, Object Page, Shell:** Provides a test page definition with corresponding parameters and test functions.
- Can be chained with **onHeader**, **onFilterBar**, **onTable**, **onDialog**, etc. which provide further test functions.
- Further common test functions.
- (JourneyRunner: Execute integration tests with given settings. - not used in wdi5)

## Consistent naming of test functions

Unified expressions improve the readability.

- Actions: `i<DoSth><WithSth>`
- Assertions: `i<ExpectSth>`
- Consistent parameter signature
  - String for identifying UI elements via label on UI element, e.g. `iExecuteAction("Create")`
  - Current state of UI elements, e.g. `iCheckEdit({visible: true})`
- Supports chaining of functions on the same hierarchy, e.g. `onFilterBar()`
  - `i<DoSth><WithSth>.and.i<DoSth><WithSth>`
  - `i<ExpectSth>.and.i<ExpectSth>`

### API documentation

🔗 [https://sapui5.hana.ondemand.com/#/api/sap.fe.test](https://sapui5.hana.ondemand.com/#/api/sap.fe.test)

## How to integrate the test library?

**Prerequisites**

- `wdi5`: > 0.9.1
- `SAPUI5`: > 1.88.0
- `Fiori Elements OData v4 only`

First you need to initialize the `FioriElementsFacade` in the test-suite setup and pass the settings to refer to a Fiori elements app and the component and entityset of the used Fiori elements templates, like the ListReport or the ObjectPage.

```javascript
before(async () => {
    FioriElementsFacade = await browser.fe.initialize({
        onTheMainPage: {
            ListReport: {
                appId: 'sap.fe.demo.travellist', // MANDATORY: Compare sap.app.id in manifest.json
                componentId: 'TravelList', // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
                entitySet: 'Travel' // MANDATORY: Compare entityset in manifest.json
            }
        },
        onTheDetailPage: {
            ObjectPage: {
                ...
            }
        },
        onTheShell: {
            Shell: {}
        }
    })
})
```

**Configuration settings of a FioriElementsFacade**

- **appId**: In the `manifest.json` - `"sap.app" → "id"`
- **componentId**: In the target section for the list report/object page within the manifest.
  e.g. `"sap.ui" → "routing" → "targets" → "TravelList"`
- **entitySet**: In the settings of the corresponding target component within the manifest.
  e.g. `"sap.ui" → "routing" → "targets" → "TravelList" → "options" → "settings"`

> If you use jasmine instead of mocha syntax you need to initialize the facade in `beforeAll`.

## How to call test functions of the test library

After initializing the `FioriElementsFacade` you can use all the provided test functions in your tests.

```javascript
it("I search product 'Office Plant'", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheMainPage.onFilterBar().iChangeSearchField("Office Plant").and.iExecuteSearch()
    Then.onTheMainPage.onTable().iCheckRows(3)
  })
})

it("I trigger create product", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheMainPage.onTable().iExecuteAction("Create")
    Then.onTheDetailPage.iSeeThisPage()
  })
})

it("I enter product details", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheDetailPage
      .onForm("General Information")
      .iChangeField("Product", productId)
      .and.iChangeField("Category", "Office Plants")
    Then.onTheDetailPage.iSeeThisPage()
  })
})

it("I create and save the product", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheDetailPage.onFooter().iExecuteSave()
    Then.onTheDetailPage.onHeader().iCheckEdit({ visible: true })
  })
})

it("I navigate back to list report", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheShell.iNavigateBack()
    Then.onTheMainPage.iSeeThisPage()
  })
})
```

## Combination of the test functions of the library with own test functions

In case you need additional test functions to cover your custom coding you can easily combine the test library with your own test functions. You just need to write the test library functions within the `FioriElementsFacade` and your test functions outside.

```javascript
it("I open custom dialog by clicking on a custom action", async () => {
  await FioriElementsFacade.execute((Given, When, Then) => {
    When.onTheMainPage.onTable().iExecuteAction("Custom Action")
  })
  // custom action in own page object
  await ListReportPage.iShouldSeeCustomFieldsInDialog()
})

it("I enter custom data", async () => {
  // custom assertion in own page object
  await ListReportPage.iEnterDataInCustomField("My custom data")
  await FioriElementsFacade.execute((Given, When, Then) => {
    Then.onTheMainPage.onDialog().iClose()
    Then.onTheMainPage.onTable().iCheckCells({ "Custom Data": "My custom data" })
  })
})
```

## Using the test library with SAP Build Workzone, standard edition

?> only available in `wdi5` >= 2

The SAP Build Workzone, standard edition, runs the Fiori shell and the Fiori Elements app in separate `iframe`s. For operating on both shell and app, `wdi5` injects itself in both as well. This can be triggered by configuring `wdi5` with `btpWorkZoneEnablement` set to `true`:

```js
// typescript syntax sample
export const config: wdi5Config = {
  wdi5: {
    btpWorkZoneEnablement: true,
    logLevel: "verbose"
  }
  // ... additional config
}
```

Most likely, a [`wdi5` authentication configuration for IAS](authentication?id=sap-cloud-identity-services-identity-authentication) is also needed to authenticate against the IAS tenant the SAP Build Workzone, standard edition, is running with.

Then, point the `baseUrl` in your `wdio.conf.(j|t)s` against _the app URL_ in Workzone, e.g. `https://your.launchpad.cfapps.eu10.hana.ondemand.com/site/ymmv#travel-process`:

```js
export const config: wdi5Config = {
  wdi5: {
    btpWorkZoneEnablement: true,
    logLevel: "verbose"
  },
  baseUrl: "https://your.launchpad.cfapps.eu10.hana.ondemand.com/site/ymmv#travel-process"
  // ... additional config
}
```

?> It is important to use the URL pointing to the app under test, as this is assumed by `wdi5` to be the start of its injection process

After making `wdi5` aware of the Workzone setting, now inject the testlibrary as usual in the `before` hook of the test suite:

```js
// sample page obects from the CAP SFLIGHT app
describe("drive in Work Zone with testlib support", () => {
    let FioriElementsFacade
    before(async () => {
        FioriElementsFacade = await browser.fe.initialize({
            onTheMainPage: {
                ListReport: {
                    appId: "sap.fe.cap.travel",
                    componentId: "TravelList",
                    entitySet: "Travel"
                }
            },
            onTheDetailPage: {
                ObjectPage: {
                    appId: "sap.fe.cap.travel",
                    componentId: "TravelObjectPage",
                    entitySet: "Travel"
                }
            },
            onTheItemPage: {
                ObjectPage: {
                    appId: "sap.fe.cap.travel",
                    componentId: "BookingObjectPage",
                    entitySet: "Booking"
                }
            },
            onTheShell: {
                Shell: {}
            }
        })
    })

    it("...", async () => {
      await FioriElementsFacade.execute((Given, When, Then) => {
            Then.onTheMainPage.iSeeThisPage()
        })
    })
    // further its
```

See the files in [`wdi5`'s git repo at `/examples/ui5-ts-app/test/e2e/workzone/**/*`](https://github.com/ui5-community/wdi5/tree/main/examples/ui5-ts-app/test/e2e/workzone) for a sample config and test!

## Troubleshooting

### Enable verbose mode for test library output

If your tests fail you can enable the [verbose mode](configuration#loglevel) in the wdio configuration to get more output of the test library.

Sample output in verbose mode:

```bash
Error: the string "Checking table '{id: fe::table::Products::LineItem}' having 2 rows with values='', state='' and empty columns='' - FAILURE
Opa timeout after 15 secosds
This is what Opa logged:
Found 0 blocking out of 613 tracked timeouts -  sap.ui.test.autowaiter._timeoutWaiter#hasPending
AutoWaiter syncpoint -  sap.ui.test.autowaiter._autoWaiter
Found view with ID 'product.manage::ProductsList' and viewName 'undefined' -  sap.ui.test.Opa5
Found control with ID 'fe::table::Products::LineItem' and controlType 'sap.ui.mdc.Table' in view 'sap.fe.templates.ListReport.ListReport' -  sap.ui.test.Opa5
1 out of 1 controls met the matchers pipeline requirements -  sap.ui.test.pipelines.MatcherPipeline 0 out of 1 controls met the matchers pipeline requirements -  sap.ui.test.pipelines.MatcherPipeline
Matchers found no controls so check function will be skipped -  sap.ui.test.Opa5
...
```
