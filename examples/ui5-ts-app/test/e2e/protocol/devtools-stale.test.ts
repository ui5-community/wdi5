import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"
import Button from "sap/ui/webc/main/Button"

describe("Devtools: ", async () => {
    it("safeguard 'stale' element handling", async () => {
        const buttonWDI5 = await getButtonOnPage1()

        // mock a stale element
        // @ts-expect-error stub getVisible
        buttonWDI5.getVisible = async function () {
            return await this._executeControlMethod("getVisible", {
                "element-6066-11e4-a52e-4f735466cecf": "stale"
            })
        }

        expect(await buttonWDI5.getVisible()).toBe(true)
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
})
