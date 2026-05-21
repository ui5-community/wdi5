const Other = require("./pageObjects/Other")

describe("ui5 basic, press all buttons", () => {
    before(async () => {
        await Other.open()
    })

    it("test with pressing multiple checkboxes", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.CheckBox",
                viewName: "test.Sample.view.Other",
                interaction: "press"
            }
        }
        const checkboxList = await browser.allControls(selector)

        expect(checkboxList.length).toEqual(9)

        for await (let checkbox of checkboxList) {
            const selectedBeforePress = await checkbox.getSelected()
            await checkbox.press()
            const selectedAfterPress = await checkbox.getSelected()
            expect(selectedAfterPress).toEqual(!selectedBeforePress)
        }
    })
})
