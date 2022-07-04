import Input from "sap/m/Input"
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"

describe("Input", async () => {
    it("should read name from username field", async () => {
        const inputText: wdi5Selector = {
            selector: {
                id: "mainUserInput",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const inputString: string = await (browser.asControl(inputText) as unknown as Input).getValue()
        expect(inputString).toEqual("Helvetius Nagy")
    })

    it("should check if the field is writeable", async () => {
        const inputText: wdi5Selector = {
            selector: {
                id: "mainUserInput",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        await (browser.asControl(inputText) as unknown as Input).setValue("Smith Smithersson")
        const input = await (browser.asControl(inputText) as unknown as Input).getValue()
        expect(input).toEqual("Smith Smithersson")
    })
})
