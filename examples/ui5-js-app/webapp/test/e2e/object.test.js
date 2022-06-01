const Main = require("./pageObjects/Main")
const marky = require("marky")
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

describe("ui5 object tests", () => {
    before(async () => {
        await Main.open()
    })

    it("check getBinding returns a proper object", async () => {
        const title = await browser.asControl(titleSelector)
        const bindingInfo = await title.getBinding("text")
        // bindingInfo is an object and it's oValue property can be accessed
        const response = bindingInfo.oValue
        expect(response).toEqual("UI5 demo")

        // new uuid interface
        const fullBindingInfo = await browser.asObject(bindingInfo.uuid)
        expect(fullBindingInfo.className).toEqual("sap.ui.model.resource.ResourcePropertyBinding")
    })

    it("check new object implementation", async () => {
        const input = await browser.asControl({
            selector: {
                id: "mainUserInput",
                viewName: "test.Sample.view.Main"
            }
        })
        // new object interface
        const binding = await input.getBinding("value")
        const path = await binding.object.getPath()
        expect(path).toEqual("/Customers('TRAIH')/ContactName")
    })
})
