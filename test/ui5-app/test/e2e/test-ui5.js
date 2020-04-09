const assert = require("assert");
const wdi5 = require('../../../../index')

describe("ui5 showcase app", () => {

    beforeEach(() => {
        // todo: take screenshot always and compare
        wdi5().getUtils().takeScreenshot("test-ui5");
    });

    it('should have the button to navigate with text', () => {

        // see sap documetation
        const buttonSelector = {
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        }
        const ui5Button = browser.asControl(buttonSelector)

        assert.strictEqual(ui5Button.getProperty("text"), "to Other view");
    });

    it("should navigate via button click to list page", () => {

        const buttonSelector = {
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        }
        // poc:
        // - retrieve control by ui5 locator
        // - interact with wdio
        const ui5Button = browser.getControl(buttonSelector)
        // wdio
        $(ui5Button).click()

        const listSelector = {
            wdio_ui5_key: "PeopleList", // plugin-internal, not part of RecordReplay.ControlSelector
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.view.Other"
            }
        }
        // poc: get any property of a ui5 control
        const ui5ListHeader = browser.asControl(listSelector).getProperty("headerText")
        const ui5ListId = browser.asControl(listSelector).getProperty("id")

        // assert.ok(typeof ui5List === "object")
        assert.ok(ui5ListId !== "")
        assert.ok(ui5ListId.includes("PeopleList"))
        assert.equal(ui5ListHeader, "...bites the dust!");
    })
})
