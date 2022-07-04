import Button from "sap/m/Button"
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"

describe("Basic", async () => {
    it("browser.allControls: check number of buttons", async () => {
        const allButtonsSelector: wdi5Selector = {
            selector: {
                controlType: "sap.ui.webc.main.Button",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }

        const allButtons = (await browser.allControls(allButtonsSelector)) as unknown as Array<Button>
        expect(allButtons.length).toEqual(1)
    })
})
