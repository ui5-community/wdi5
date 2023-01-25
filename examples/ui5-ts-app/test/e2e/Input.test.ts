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
        const input: unknown = await browser.asControl(inputSelector)
        const value: string = await (input as Input).getValue()
        expect(value).toEqual("Helvetius Nagy")
    })

    it("should check if the field is writeable", async () => {
        const newValue = "DSAG UI expert round"
        await (browser.asControl(inputSelector) as unknown as Input).setValue(newValue)
        const input = await (browser.asControl(inputSelector) as unknown as Input).getValue()
        expect(input).toEqual(newValue)
    })

    it.only("should retrieve the webcomponent's bound path via a managed object", async () => {
        const control = await browser.asControl(inputSelector)
        const bindingInfo = await control.getBindingInfo("value")
        const parts = await bindingInfo.parts
        expect(parts[0].path).toEqual("/Customers('TRAIH')/ContactName")
    })
})
