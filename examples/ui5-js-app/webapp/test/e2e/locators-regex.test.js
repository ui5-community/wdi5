// helper class "wdi5" contained in wdio service "ui5"
const { wdi5 } = require("wdio-ui5-service")
const Main = require("./pageObjects/Main")

describe("RegEx locators", () => {
    const viewName = "test.Sample.view.Main"

    before(async () => {
        await Main.open()
    })

    it("should find the 'open dialog' button by both property text regex options", async () => {
        const selectorByTextRegex = {
            selector: {
                controlType: "sap.m.Button",
                properties: {
                    text: new RegExp(/.*ialog.*/gm)
                }
            }
        }

        const textViaPropertyRegEx = await browser.asControl(selectorByTextRegex).getText()
        expect(textViaPropertyRegEx).toEqual("open Dialog")

        const selectorByDeclarativeRegex = {
            selector: {
                controlType: "sap.m.Button",
                properties: {
                    text: {
                        regex: {
                            source: ".*ialog.*",
                            flags: "gm"
                        }
                    }
                }
            }
        }
        const textViaDeclarative = await browser.asControl(selectorByDeclarativeRegex).getText()
        expect(textViaDeclarative).toEqual("open Dialog")
    })

    describe("RegEx notations", () => {
        /**
         * click the open dialog button to (well) open a dialog
         * @param {String|RegExp} idRegex
         */
        async function _assert(idRegex) {
            const openButtonSelector = {
                forceSelect: true, // make sure we're retrieving from scratch
                selector: {
                    id: idRegex
                }
            }

            const dialogSelector = {
                forceSelect: true,
                selector: {
                    id: "Dialog",
                    controlType: "sap.m.Dialog",
                    interaction: "root"
                }
            }

            await browser.asControl(openButtonSelector).press()

            const popup = await browser.asControl(dialogSelector)
            await expect(await popup.getVisible()).toBeTruthy()
        }

        afterEach(() => {
            browser.keys("Escape") // close popup
        })

        it("plain regex /.../", async () => {
            return await _assert(/.*openDialogButton$/)
        })
        it("plain regex + flags /.../gmi", async () => {
            return await _assert(/.*openDialogButton$/gim)
        })
        it("new RegEx(/.../flags)", async () => {
            return await _assert(new RegExp(/.*openDialogButton$/))
        })

        it("new RegEx(/.../flags)", async () => {
            return await _assert(new RegExp(/.*openDialogButton$/gi))
        })

        it('new RegEx("string")', async () => {
            return await _assert(new RegExp(".*openDialogButton$"))
        })

        it('new RegEx("string", "flags")', async () => {
            return await _assert(new RegExp(".*openDialogButton$", "gmi"))
        })

        it("regex shorthand matchers are handled properly", async () => {
            return await _assert(/.*open\w.*Button$/)
        })
    })
})
