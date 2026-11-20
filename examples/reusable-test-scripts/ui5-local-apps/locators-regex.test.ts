import { wdi5 } from "wdio-ui5-service"
import Main from "./pageObjects/Main.js"

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

        // @ts-expect-error
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
        // @ts-expect-error
        const textViaDeclarative = await browser.asControl(selectorByDeclarativeRegex).getText()
        expect(textViaDeclarative).toEqual("open Dialog")
    })

    describe("RegEx notations", () => {
        /**
         * click the open dialog button to (well) open a dialog
         */
        async function _assert(idRegex: string | RegExp) {
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
                    interaction: "root" as const
                }
            }

            // @ts-expect-error
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
