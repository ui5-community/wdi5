const Other = require("./pageObjects/Other")
const { wdi5 } = require("wdio-ui5-service")

const oCheckboxSelector = {
    forceSelect: true,
    selector: {
        controlType: "sap.m.CheckBox",
        viewName: "test.Sample.view.Other"
    }
}

describe("ui5 basic, get all buttons", () => {
    before(async () => {
        await Other.open()
    })

    it("test with multiple checkboxes", async () => {
        const aCheckbox = await browser.allControls(oCheckboxSelector)

        expect(aCheckbox.length).toEqual(9)

        for await (let oCheckbox of aCheckbox) {
            const selected = await oCheckbox.getSelected()
            wdi5.getLogger().log(`oCheckbox: ${oCheckbox.getControlInfo().id} isSelected: ${selected} `)
            if (!selected) {
                await oCheckbox.press()
            }
        }

        for await (let oCheckbox of aCheckbox) {
            expect(await oCheckbox.getSelected()).toBeTruthy()
        }
    })
})
