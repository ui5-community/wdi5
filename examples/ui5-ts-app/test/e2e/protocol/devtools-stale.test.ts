import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"
import Button from "sap/ui/webc/main/Button"

describe("Devtools: ", async () => {
    it.only("safeguard 'stale' element handling", async () => {
        const buttonWDI5 = await getButtonOnPage1()

        // mock a stale element
        // @ts-expect-error stub getVisible
        buttonWDI5.getVisible = async function () {
            return await this._executeControlMethod("getVisible", {
                "element-6066-11e4-a52e-4f735466cecf": "stale"
            })
        }

        expect(await buttonWDI5.getVisible()).toBe(true)

        await buttonWDI5.setVisible(false)

        const invisibleButton = await getButtonOnPage1()
        expect(await invisibleButton.getVisible()).toBe(false)
    })

    it("safeguard 'stale' element handling with full selector", async () => {
        const multiInput = await getMultiInputOnPage1()

        // mock a stale element
        multiInput.getTokens = async function () {
            return await this._executeControlMethod("getTokens", {
                "element-6066-11e4-a52e-4f735466cecf": "stale"
            })
        }
        await multiInput.enterText("foo")
        expect((await multiInput.getTokens()).length).toBe(1)
    })

    async function getButtonOnPage1() {
        const wdi5Button: wdi5Selector = {
            // forceSelect: true,
            selector: {
                id: "__component0---Main--NavFwdButton"
            }
        }
        return await browser.asControl(wdi5Button)
    }

    async function getMultiInputOnPage1() {
        const multiInputSelector: wdi5Selector = {
            selector: {
                id: "MultiInput",
                viewName: "test.Sample.tsapp.view.Main",
                interaction: "root"
            }
        }
        return await browser.asControl(multiInputSelector)
    }
})
