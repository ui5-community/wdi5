const Main = require("./pageObjects/Main")

describe("ui5 basic", () => {
    before(async () => {
        await Main.open()
    })

    it("Get All Buttons", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const buttons = await browser.asControls(selector)
        expect(buttons.length).toEqual(8)
    })

    it("Get Text of first Button via getAll, init later", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const buttons = await browser.asControls(selector)
        const otherButton = buttons[0]
        const sapMButton = await otherButton.init()
        expect(await sapMButton.getText()).toEqual("to Other view")
    })

    it("Get Text of first Button via getAll with direct init", async () => {
        const selector = {
            init: true,
            forceSelect: true,
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const buttons = await browser.asControls(selector)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("Get Text of first Button via getAll reuse the cached wdi5 controls", async () => {
        const selector = {
            init: true,
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const buttons = await browser.asControls(selector)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })
})
