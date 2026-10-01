import type Button from "sap/m/Button"
import Main from "./pageObjects/Main.js"

describe("i18NText matcher", () => {
    before(async () => {
        await Main.open()
    })

    it("w/ propertyName + key", async () => {
        const i18nSelector = {
            selector: {
                i18NText: {
                    propertyName: "text",
                    key: "startPage.navButton.text"
                },
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const button = (await browser.asControl(i18nSelector)) as unknown as Button
        const buttonText = await button.getText()
        expect(buttonText).toEqual("to Other view")
    })

    it("check i18nText matcher user button", async () => {
        const i18nSelector = {
            selector: {
                i18NText: {
                    propertyName: "text",
                    key: "startPage.userButton.text"
                },
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const button = (await browser.asControl(i18nSelector)) as unknown as Button
        const buttonText = await button.getText()
        expect(buttonText).toEqual("User Test Text")
    })

    it("use 18n with parameters other than propertyName and key")
})
