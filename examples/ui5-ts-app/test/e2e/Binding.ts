//TODO check messageToast

import MessageToast from "sap/m/MessageToast"
import { Selector } from "./selector"

describe("Binding", async () => {
    it.only("should klick Binding Button", async () => {
        const bindingButton: Selector = {
            selector: {
                id: "bindingButton",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }

        const bindingButtonControl = await browser.asControl(bindingButton)
        await bindingButtonControl.press()
        const messageToast = (await browser.asControl(bindingButton)) as unknown as MessageToast
        await expect(messageToast.show(`👻`))
    })
})
