import Input from "sap/m/Input"
import { Selector } from "./selector"

describe("UserInput", async () => {
    it("should read name from username field", async () => {
        const inputText: Selector = {
            selector: {
                id: "mainUserInput",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const inputString: string = await (globalThis.Browser.asControl(inputText) as unknown as Input).getValue()
        expect(inputString).toEqual("Helvetius Nagy")
    })

    it("should check if the field is writeable", async () => {
        const inputText: Selector = {
            selector: {
                id: "mainUserInput",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        await (globalThis.Browser.asControl(inputText) as unknown as Input).setValue("Smith Smithersson")
        const input = await (globalThis.Browser.asControl(inputText) as unknown as Input).getValue()
        expect(input).toEqual("Smith Smithersson")
    })
})
