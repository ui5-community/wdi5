import MultiInput from "sap/m/MultiInput"
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"

describe("MultiInput", async () => {
    it("should put text into the multi input control", async () => {
        const multiInputSelector: wdi5Selector = {
            forceSelect: true, // we need this as the control receives an input that changes the dom structure
            selector: {
                id: "MultiInput",
                viewName: "test.Sample.tsapp.view.Main",
                interaction: "root"
            }
        }
        // @ts-ignore
        await (browser.asControl(multiInputSelector) as unknown as MultiInput).enterText("123")

        const multiInput = (await browser.asControl(multiInputSelector)) as unknown as MultiInput
        const text = await multiInput.getValue()
        expect(text).toEqual("123")
    })
})
