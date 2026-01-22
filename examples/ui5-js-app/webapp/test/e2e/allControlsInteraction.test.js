const Other = require("./pageObjects/Other")
const { wdi5 } = require("wdio-ui5-service")

const oCheckboxSelector = {
    selector: {
        controlType: "sap.m.CheckBox",
        viewName: "test.Sample.view.Other",
        interaction: "press"
    }
}

describe("ui5 basic, press all buttons", () => {
    before(async () => {
        await Other.open()
    })

    it("test with pressing multiple checkboxes", async () => {
        const aCheckbox = await browser.allControls(oCheckboxSelector)

        expect(aCheckbox.length).toEqual(9)

        for await (let oCheckbox of aCheckbox) {
            const selected = await oCheckbox.getSelected()
            wdi5.getLogger().log(`oCheckbox: ${oCheckbox.getControlInfo().id} isSelected: ${selected} `)
            await oCheckbox.press()
            expect(await oCheckbox.getSelected()).toEqual(!selected)
        }
    })
})
