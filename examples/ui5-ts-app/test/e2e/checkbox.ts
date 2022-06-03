//TODO checkbox isnt a function?
import CheckBox from "sap/m/CheckBox"
import { Selector } from "./selector"

describe("Checkbox", async () => {
    it("check!", async () => {
        const Checkbox: Selector = {
            selector: {
                id: "Checkbox",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }

        const oCheckbox = (await browser.asControl(Checkbox)) as unknown as CheckBox
        await oCheckbox.setSelected(true)
        expect(await oCheckbox.getProperty("selected")).toBeTruthy()
    })
})
