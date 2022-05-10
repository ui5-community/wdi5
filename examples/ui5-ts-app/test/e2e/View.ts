import { Selector } from "./selector"

describe("View", async () => {
    it("should open Other view", async () => {
        const viewButton: Selector = {
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const viewButtonControl = await globalThis.Browser.asControl(viewButton)
        await viewButtonControl.press()
    })

    it("should read all names on the list", async () => {
        const viewButton: Selector = {
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const viewButtonControl = await globalThis.Browser.asControl(viewButton)
        viewButtonControl.press()
    })
})
