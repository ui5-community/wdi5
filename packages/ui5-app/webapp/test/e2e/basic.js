const assert = require("assert")
const wdioUI5 = require("../../../../wdio-ui5/wdio-ui5")

before(() => {
    wdioUI5.setup(browser) // use wdio hooks for setting up wdio<->ui5 bridge
})

describe("ui5 app", () => {
    it("should have the right title", () => {
        browser.url("http://localhost:1081/index.html")
        wdioUI5.injectUI5(browser) // needed to let the instance know that UI5 is now available for work
        const title = browser.getTitle()
        assert.strictEqual(title, "Sample UI5 Application")
    })

    it("should navigate via button click to list page", () => {
        // const button = $("#__button0") 
        const buttonSelector = {
            selector: {
                id: "NavFwdButton", 
                viewName: "test.Sample.view.Main"
            }
        }
        // poc:
        // - retrieve control by ui5 locator
        // - interact with wdio
        const ui5Button = browser.ui5.getControl(buttonSelector)
        $(ui5Button).click()

        const listSelector = {
            wdio_ui5_key: "PeopleList", // plugin-internal
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.view.Other"
            }
        }
        // poc: get any property of a ui5 control
        const ui5ListHeader = browser.ui5.asControl(listSelector).getProperty("headerText")
        const ui5ListId = browser.ui5.asControl(listSelector).getProperty("id")

        // assert.ok(typeof ui5List === "object")
        assert.ok(ui5ListId !== "")
        assert.ok(ui5ListId.includes("PeopleList"))
        assert.equal(ui5ListHeader, "...bites the dust!") 
    })
})
