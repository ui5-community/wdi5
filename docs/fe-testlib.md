# 📚 Test Library Integration

Using a test library provides you the following benefits

- Reduces test maintenance efforts and avoid code repetition.
- Isolate generic actions and validations in the test library and reuse them across apps.
- Tests are simplified and have compact page objects and short journeys.

## What is the Fiori Elements Test Library?

Fiori Elements developed a test library that provides quite a varity of test functions.

🔗 https://sapui5.hana.ondemand.com/#/api/sap.fe.test

Further benefits

- Test library is kept up to date with component changes in the framework.

### Content

- **Base arrangements:** Control the lifecycle of the app.
- **ListReport, Object Page, Shell:** Provides a test page definition with corresponding parameters and test functions.
- Can be chained with **onHeader**, **onFilterBar**, **onTable**, **onDialog**, etc. which provide further test functions.
- Further common test functions.
- (JourneyRunner: Execute integration tests with given settings. - not used in wdi5)

### Consistent naming of test functions

Unified expressions improve the readability.

- Actions: `i<DoSth><WithSth>`
- Assertions: `i<ExpectSth>`
- Consistent parameter signature, e.g. TODO
- Supports chaining of functions on the same hierarchy, e.g. `onFilterBar()`
  - `i<DoSth><WithSth>.and.i<DoSth><WithSth>`
  - `i<ExpectSth>.and.i<ExpectSth>`

### What to test / not to test in a Fiori Elements app?

- [Custom Actions](https://sapui5.hana.ondemand.com/sdk/#/topic/7619517a92414e27b71f02094bd08d06), Complex UI annotations
- Code under your responsibility
- Do NOT test framework functionality

## How to use the Fiori Element Test Library?

### Prerequisites

- `wdi5`: > 0.9.1
- `SAPUI5`: > 1.88.0
- `Fiori Elements OData v4 only`

### Execute test functions of the library

#### Initialize the Facade

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

**Configuration settings of the facade**

- **appId**: In the `manifest.json` - `"sap.app" → "id"`
- **componentId**: In the target section for the list report/object page within the manifest.
  e.g. `"sap.ui" → "routing" → "targets" → "TravelList"`
- **entitySet**: In the settings of the corresponding target component within the manifest.
  e.g. `"sap.ui" → "routing" → "targets" → "TravelList" → "options" → "settings"`

> If you use jasmine instead of mocha syntax you need to initialize the facade in `beforeAll`.

#### Calling test functions of the library

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

### Combination of the test functions of the library with own test functions

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


### Enable verbose mode for test library output

Enable [verbose mode](configuration#loglevel) to get more output of the test library in your wdio configuration.

``
TODO: Sample output
``

### Troubleshooting

t.b.d.
```
