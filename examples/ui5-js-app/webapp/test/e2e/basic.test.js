const Main = require("./pageObjects/Main")
const { wdi5 } = require("wdio-ui5-service")

const titleSelector = { selector: { id: "container-Sample---Main--Title::NoAction.h1" } }

const buttonSelector = {
    wdio_ui5_key: "allButtons",
    selector: {
        controlType: "sap.m.Button",
        viewName: "test.Sample.view.Main",
        properties: {
            text: new RegExp(/.*ialog.*/gm)
        }
    }
}

describe("ui5 basic", () => {
    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    // #118
    it("should use a control selector with dots and colons (wdi5)", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        const titleWUi5 = await /** @type {import("wdio-ui5-service/cjs/lib/wdi5-control.js").WDI5Control} */ (
            await browser.asControl(selector)
        ).getText()
        expect(titleWUi5).toEqual("UI5 demo")
    })

    // #118
    /* it("should use a control selector with dots and colons (wdio)", async () => {
        // working webdriver example with xpath id selector
        const titleElement = await $('//*[@id="container-Sample---Main--Title::NoAction.h1"]')
        const titleWwdio = await titleElement.getText()
        expect(titleWwdio).toEqual("UI5 demo")
    }) */

    it("check for invalid control selector", async () => {
        const selector1 = {
            selector_: {
                test: "some.test.string"
            }
        }

        const selector2 = {
            id: "some.test.string"
        }
        const invalidControl1 = await browser.asControl(selector1)
        const invalidControl2 = await browser.asControl(selector2)

        // check if result contains the expected validation error
        expect(invalidControl1).toContain("ERROR")
        expect(invalidControl2).toContain("ERROR")
    })

    it("check getControl error message", async () => {
        const selector = {
            selector: {
                id: "some.test.string"
            }
        }

        const invalidControl = await browser.asControl(selector)

        // check if result contains the expected validation error
        expect(invalidControl.isInitialized()).toBeFalsy()
    })

    /* it("check for Searchfield Properties", async () => {
        const searchFieldSelector = {
            selector: {
                id: "idSearchfield",
                viewName: "test.Sample.view.Main"
            }
        }

        expect(await browser.asControl(searchFieldSelector).getValue()).toEqual("search Value")
    }) */

    it("check the metadata", async () => {
        const button = await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })
        const metadata = button.getControlInfo()

        expect(metadata.id).toEqual("container-Sample---Main--openDialogButton")
        expect(metadata.className).toEqual("sap.m.Button")
        expect(metadata.key).toEqual("openDialogButtontestSample.view.Main")
    })

    it("check getBinding returns a proper object", async () => {
        const title = await browser.asControl(titleSelector)
        const bindingInfo = await title.getBinding("text")
        // bindingInfo is an object and it's oValue property can be accessed
        const response = bindingInfo.oValue
        expect(response).toEqual("UI5 demo")
    })

    it("check method chaining with fluent api", async () => {
        const response = await browser.asControl(buttonSelector).press().getText()
        expect(response).toEqual("open Dialog")

        // close popup
        await browser.asControl({ selector: { id: "__button1" } }).press()
    })

    it("check button text", async () => {
        const response = await browser.asControl(buttonSelector).getText()

        // expect(timelog).
        expect(response).toEqual("open Dialog")
    })

    it("test performance 1", async () => {
        performance.mark("1_fluentAPI_start")

        const response = await browser.asControl(buttonSelector).press().getText()

        performance.mark("1_fluentAPI_end")
        const entry = performance.measure("1_fluentAPI", "1_fluentAPI_start", "1_fluentAPI_end")

        expect(response).toEqual("open Dialog")
        expect(entry.duration).toBeLessThan(3000)

        wdi5.getLogger().info(entry)

        // close popup
        await browser.asControl({ selector: { id: "__button1" } }).press()
    })

    it("test performance 2", async () => {
        buttonSelector.forceSelect = true

        performance.mark("2_fluentAPI_start")

        const button = await browser.asControl(buttonSelector)
        await button.press()
        const text = await button.getText()

        performance.mark("2_fluentAPI_end")
        const entry = performance.measure("2_fluentAPI", "2_fluentAPI_start", "2_fluentAPI_end")

        expect(text).toEqual("open Dialog")
        wdi5.getLogger().info(entry)
    })

    it("method chaining without fluent api", async () => {
        const newTitle = "new Title"

        titleSelector.forceSelect = true
        // setTitle still returns the wdi5 element, equivalent as in UI5
        const title = await browser.asControl(titleSelector).setTitle(newTitle).getTitle()
        expect(title).toEqual(newTitle)

        const titleFirstTime = await browser.asControl(titleSelector).setTitle(newTitle)
        const titleAgain = await titleFirstTime.setTitle(newTitle)
        const response = await titleAgain.getTitle()
        expect(response).toEqual(newTitle)
    })
})
