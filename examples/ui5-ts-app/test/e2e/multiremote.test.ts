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
        // @ts-ignore
        const allButtonsTwo = await browser.two.allControls<Button>(allButtonsSelector)
        // @ts-ignore
        const allButtonsOne = await browser.one.allControls<Button>(allButtonsSelector)
        expect(allButtonsTwo.length).toEqual(1)
        expect(allButtonsOne.length).toEqual(1)
    })
})
