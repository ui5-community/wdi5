const Main = require("./pageObjects/Main")
const { wdi5 } = require("wdio-ui5-service")
const Other = require("./pageObjects/Other")

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
    })

    it("check getBinding returns a wdi5 object with functions", async () => {
        const title = await browser.asControl(titleSelector)
        const bindingInfo = await title.getBinding("text")
        // bindingInfo is an object and it's oValue property can be accessed
        const response = await bindingInfo.getValue()
        expect(response).toEqual("UI5 demo")

        const bindingInfoMetadata = await bindingInfo.getMetadata()
        const bindingTypeName = await bindingInfoMetadata.getName()
        expect(bindingTypeName).toEqual("sap.ui.model.resource.ResourcePropertyBinding")

        // new uuid interface
        const fullBindingInfo = await browser.asObject(bindingInfo.getUUID())
        const bindingInfoMetadata_new = await fullBindingInfo.getMetadata()
        const bindingTypeName_new = await bindingInfoMetadata_new.getName()
        expect(bindingTypeName_new).toEqual("sap.ui.model.resource.ResourcePropertyBinding")
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
        const path = await binding.getPath()
        expect(path).toEqual("/Customers('TRAIH')/ContactName")
    })

    it("getModel and Property", async () => {
        const mainView = await browser.asControl({
            selector: {
                id: "container-Sample---Main"
            }
        })
        // new object interface
        const northwaveModel = await mainView.getModel()
        const customerName = await northwaveModel.getProperty("/Customers('TRAIH')/ContactName")
        expect(customerName).toEqual("Helvetius Nagy")
    })

    it("getModel via BindingContext and Object", async () => {
        // test equivalent of
        // sap.ui.getCore().byId("container-Sample---Other--PeopleList").getItems()[0].getBindingContext().getObject().FirstName

        await wdi5.goTo({ sHash: "#/Other" })

        const table = await Other.getList(true)
        const firstItem = await table.getItems(0)
        const itemContext = await firstItem.getBindingContext()
        const myObject = await itemContext.getObject()

        expect(myObject.FirstName).toEqual("Nancy")
    })
})
