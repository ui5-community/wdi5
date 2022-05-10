import Button from "sap/m/Button"
import { Selector } from "./selector"

describe("basics", async () => {
    it("should have the correct url", async () => {
        browser.url(await browser.getUrl())
        await expect(browser).toHaveUrl("http://localhost:8080/index.html")
    })

    it('should open testsite with title "UI5 Application tsapp"', async () => {
        const title: string = await browser.getTitle()
        expect(title).toEqual("UI5 Application tsapp")
    })

    it.only("check number of buttons", async () => {
        const allButtons: Selector = {
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }

        const ArraysOfButtons = (await globalThis.Browser.allControls(allButtons)) as unknown as Array<Button>
        expect(ArraysOfButtons.length).toEqual(6)
    })
})
