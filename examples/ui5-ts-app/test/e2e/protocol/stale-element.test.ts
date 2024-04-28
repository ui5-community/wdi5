import { wdi5Selector, ELEMENT_KEY } from "wdio-ui5-service"

// work around the REVISIT issue explained below
const _it = process.env.PROT === "devtools" ? it : it.skip

describe("Devtools: ", async () => {
    const staleElementId = {
        // devtools does not care about the format of the value but webdriver does
        [ELEMENT_KEY]: "C9B723AF0A50B0F6AE3AC61EB707675E_element_00"
    }

    beforeEach(() => {
        // clear cached wdi5Controls, so we can mock in each test seperately
        browser._controls = []
    })
    //> REVISIT: wdio v8 latest now recognizes stale elements ahead of browser.executeAsync calls
    //> but only with the webdriver protocol, not with the devtools protocol
    //> -> we skip this test for the webdriver protocol as of now
    _it("safeguard 'stale' element handling", async () => {
        const buttonWDI5 = await getButtonOnPage1()

        // mock a stale element
        buttonWDI5.getVisible = async function () {
            return await this._executeControlMethod("getVisible", staleElementId)
        }

        expect(await buttonWDI5.getVisible()).toBe(true)
    })

    it("safeguard 'stale' invisible element for a cached wdi5 control", async () => {
        const buttonWDI5 = await getButtonOnPage1()
        expect(await buttonWDI5.isInitialized()).toBe(true)

        // make the element stale by manipulation DOM
        await buttonWDI5.setVisible(false)

        expect(await buttonWDI5.getVisible()).toBe(null)

        const invisibleButton = await getButtonOnPage1()
        // we should receive nothing => null
        expect(await invisibleButton.getVisible()).toBe(null)
        // wdi5 control should be there but ui5 control is not initialized
        expect(await invisibleButton.isInitialized()).toBe(false)
    })

    it("safeguard 'stale' invisible element for a 'forceSelect' wdi5 control", async () => {
        const input = await getTitleOnPage1()
        expect(await input.isInitialized()).toBe(true)

        // make the element stale by manipulation DOM
        await input.setVisible(false)

        expect(await input.getVisible()).toBe(null)

        const invisibleInput = await getTitleOnPage1()
        // on a non-existent UI5 control, only the "do I exist" check
        // aka .isInitialized() can be called, but no API methods of the UI5 control
        expect(await invisibleInput.isInitialized()).toBe(false)
    })

    //> REVISIT: see first test in the suite for reasons - same thing here
    _it("safeguard 'stale' element handling with full selector", async () => {
        const multiInput = await getMultiInputOnPage1()

        // mock a stale element
        multiInput.getTokens = async function () {
            return await this._executeControlMethod("getTokens", staleElementId)
        }
        await multiInput.enterText("foo")
        expect((await multiInput.getTokens()).length).toBe(1)
    })

    async function getButtonOnPage1(forceSelect = false) {
        const button: wdi5Selector = {
            forceSelect,
            selector: {
                id: "__component0---Main--NavFwdButton"
            }
        }
        return await browser.asControl(button)
    }

    async function getTitleOnPage1() {
        const input: wdi5Selector = {
            forceSelect: true,
            selector: {
                controlType: "sap.m.Title",
                viewName: "test.Sample.tsapp.view.Main",
                i18NText: {
                    propertyName: "text",
                    key: "startPage.title.text"
                }
            }
        }
        return await browser.asControl(input)
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
