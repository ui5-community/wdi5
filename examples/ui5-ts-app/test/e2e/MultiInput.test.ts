import MultiInput from "sap/m/MultiInput"
import { wdi5Selector } from "wdio-ui5-service"

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
        // @ts-expect-error fluent async api is not recognized in TS
        await browser.asControl<MultiInput>(multiInputSelector).enterText("123")

        const multiInput = await browser.asControl<MultiInput>(multiInputSelector)
        const text = await multiInput.getValue()
        expect(text).toEqual("123")
    })
})
