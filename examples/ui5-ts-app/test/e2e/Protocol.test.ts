import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"
import Button from "sap/ui/webc/main/Button"
/* eslint @typescript-eslint/no-var-requires: "off" */
const _ui5Service = require("wdio-ui5-service").default
const ui5Service = new _ui5Service()

describe("Protocol", async () => {
    it("switch to iframe and inject wdi5", async () => {
        await browser.waitUntil(async function () {
            return (await browser.getTitle()) === "Sample App"
        })
        await browser.switchToFrame(await browser.$("#application-TestSampleTSapp-display"))
        await ui5Service.injectUI5()
    })

    it("should see the button text - wdio", async () => {
        const buttonWDI5 = await getButtonOnPage1()
        const buttonWDIO = await buttonWDI5.getWebElement()
        const buttonTextWDIO: string = await buttonWDIO.getText()
        expect(buttonTextWDIO).toEqual("to Other view")
    })

    it("should see the button text - wdi5 - native UI5 method", async () => {
        const buttonWDI5 = (await getButtonOnPage1()) as unknown as Button
        const buttonText: string = await buttonWDI5.getText()
        expect(buttonText).toEqual("to Other view")
    })

    it("should press the button - wdi5 - control method", async () => {
        const buttonWDI5 = await getButtonOnPage1()
        await buttonWDI5.press()
    })

    it("should see the next page", async () => {
        const buttonWDI5 = await getButtonOnPage2()
        await buttonWDI5.press()
    })

    async function getButtonOnPage1() {
        const wdi5Button: wdi5Selector = {
            forceSelect: true,
            selector: {
                id: "application-TestSampleTSapp-display-component---Main--NavFwdButton"
            }
        }
        return await browser.asControl(wdi5Button)
    }

    async function getButtonOnPage2() {
        const wdi5Button: wdi5Selector = {
            forceSelect: true,
            selector: {
                id: "application-TestSampleTSapp-display-component---Other--idAddLineItemButton"
            }
        }
        return await browser.asControl(wdi5Button)
    }
})
