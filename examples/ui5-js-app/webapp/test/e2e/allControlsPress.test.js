const Other = require("./pageObjects/Other")
const { wdi5 } = require("wdio-ui5-service")

describe("ui5 basic, press all buttons", () => {
    before(async () => {
        await Other.open()
    })

    it("test with pressing multiple checkboxes", async () => {
        const logger = wdi5.getLogger()
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
            logger.log(`Checkbox ${checkbox.getControlInfo().id}`)
            logger.log(`isSelected: ${selectedBeforePress} `)
            await checkbox.press()
            logger.log(`press() executed`)
            const selectedAfterPress = await checkbox.getSelected()
            logger.log(`isSelected: : ${selectedAfterPress} `)
            expect(selectedAfterPress).toEqual(!selectedBeforePress)
        }
    })
})
