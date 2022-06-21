import { Selector } from "./selector"

describe("Test for MessageToast & Button", async () => {
    it("should click Binding Button", async () => {
        const bindingButton: Selector = {
            selector: {
                id: "bindingButton",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }

        const button = await (await browser.asControl(bindingButton)).getWebElement()
        await button.click()
    })
    it("should open MessageToast", async () => {
        const popup = await browser.$(".sapMMessageToast") // wdio-native api
        await popup.waitForExist()
        expect(await popup.isExisting()).toBe(true)
    })
})
