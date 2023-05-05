import Input from "sap/m/Input"
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"

const inputSelector: wdi5Selector = {
    selector: {
        id: "mainUserInput",
        viewName: "test.Sample.tsapp.view.Main"
    }
}

describe("Input", async () => {
    it("should read name from username field", async () => {
        const input = await browser.asControl<Input>(inputSelector)
        const value = await input.getValue()
        expect(value).toEqual("Helvetius Nagy")
    })

    it("should check if the field is writeable", async () => {
        const newValue = "Smith Smithersson"
        await browser.asControl<Input>(inputSelector).setValue(newValue)
        const input = await browser.asControl<Input>(inputSelector).getValue()
        expect(input).toEqual(newValue)
    })

    it("should retrieve the webcomponent's bound path via a managed object", async () => {
        const control = await browser.asControl(inputSelector)
        const bindingInfo = await control.getBindingInfo("value")
        // @ts-ignore
        const parts = await bindingInfo.parts
        expect(parts[0].path).toEqual("/Customers('TRAIH')/ContactName")
    })
})
