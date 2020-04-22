const assert = require("assert");
const wdi5 = require('../../../../index')

describe("ui5 showcase app - ui5 standard", () => {

    beforeEach(() => {
        // TODO: take screenshot always and compare
        wdi5().getUtils().takeScreenshot("test-ui5");
    });

    it('should have the button to navigate with text', () => {

        // see sap documetation
        const bs1 = {
            wdio_ui5_key: "NavFwdButton",
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        }
        // #1 wdio-ui5 way
        const wdioui5Button = browser.asControl(bs1)
        assert.strictEqual(wdioui5Button.getProperty("text"), "to Other view");

        // #2 webdriver way
        const ui5Button = browser.getControl(bs1)
        assert.strictEqual($(ui5Button).$('<bdi />').getText(), "to Other view");
    });

    it("should navigate via button click to list page", () => {

        const bs2 = {
            wdio_ui5_key: "NavFwdButton",
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        }

        // poc:
        // - retrieve control by ui5 locator
        // - interact with wdio
        const ui5Button = browser.getControl(bs2)
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
