import type Button from "sap/m/Button"
import type Input from "sap/m/Input"
import type CheckBox from "sap/m/CheckBox"
import type DateTimePicker from "sap/m/DateTimePicker"
import type List from "sap/m/List"
import Main from "./pageObjects/Main.js"

describe("check the generated methods on the control -> ", () => {
    const buttonSelector = {
        selector: {
            id: "NavFwdButton",
            viewName: "test.Sample.view.Main"
        }
    }

    const inputSelector = {
        selector: {
            id: "mainUserInput",
            viewName: "test.Sample.view.Main"
        }
    }

    const dateTimeSelector = {
        selector: {
            id: "idDateTime",
            viewName: "test.Sample.view.Main"
        }
    }

    const listSelector = {
        selector: {
            id: "PeopleList",
            viewName: "test.Sample.view.Other",
            interaction: "root" as const
        }
    }

    const checkboxSelector = {
        selector: {
            id: "idCheckbox",
            viewName: "test.Sample.view.Main"
        }
    }

    before(async () => {
        await Main.open()
    })

    it("navigation button w/ text exists", async () => {
        const button = await browser.asControl(buttonSelector)
        expect(await button.getProperty("text")).toEqual("to Other view")
    })

    it('getProperty("text") and getText() are equivalent', async () => {
        const button = (await browser.asControl(buttonSelector)) as unknown as Button
        expect(await button.getProperty("text")).toEqual(await button.getText())
    })

    it("sets the property of a control successfully", async () => {
        const button = (await browser.asControl(buttonSelector)) as unknown as Button
        await button.setProperty("text", "new button text")
        expect(await button.getText()).toEqual("new button text")
    })

    it("sap.m.Input APIs", async () => {
        const input = (await browser.asControl(inputSelector)) as unknown as Input

        // text
        const inputText = "the mighty text"
        await input.setValue(inputText)
        const sTextProperty = await input.getProperty("value")
        expect(await input.getValue()).toEqual(sTextProperty)
        expect(await input.getValue()).toEqual(inputText)

        // status enabled
        expect(await input.getEnabled()).toBeTruthy()
        await input.setEnabled(false)
        expect(await input.getEnabled()).toBeFalsy()
        await input.setEnabled(true)

        // status editable
        expect(await input.getEditable()).toBeTruthy()
        await input.setEditable(false)
        expect(await input.getEditable()).toBeFalsy()
    })

    it("sap.m.Button APIs", async () => {
        const button = (await browser.asControl(buttonSelector)) as unknown as Button

        // text
        const buttonText = "the mighty text"
        await button.setText(buttonText)
        const retrievedButtonText = await button.getText()
        expect(retrievedButtonText).toEqual(await button.getProperty("text"))
        expect(retrievedButtonText).toEqual(buttonText)

        // status
        expect(await button.getEnabled()).toBeTruthy()
        await button.setEnabled(false)
        expect(await button.getEnabled()).toBeFalsy()
        // re-enable for later usage
        await button.setEnabled(true)
    })

    it("sap.m.CheckBox APIs", async () => {
        const checkbox = (await browser.asControl(checkboxSelector)) as unknown as CheckBox

        // select
        await checkbox.setSelected(true)
        expect(await checkbox.getPartiallySelected()).toBeFalsy()
        expect(await checkbox.getSelected()).toBeTruthy()
        await checkbox.setPartiallySelected(true)
        expect(await checkbox.getPartiallySelected()).toBeTruthy()

        // status
        expect(await checkbox.getEnabled()).toBeTruthy()
        await checkbox.setEnabled(false)
        expect(await checkbox.getEnabled()).toBeFalsy()
    })

    it("sap.m.DateTimePicker APIs", async () => {
        const dateTimeField = (await browser.asControl(dateTimeSelector)) as unknown as DateTimePicker

        // datetime input
        const date = new Date()
        await dateTimeField.setValue(date.toString())
        const value = await dateTimeField.getValue()

        // depending of the protocol the date is returned in different formats...
        if (browser.isBidi) {
            expect(value).toEqual(date.toString())
        } else {
            expect(value).toEqual(date.toISOString())
        }

        // status
        expect(await dateTimeField.getEnabled()).toBeTruthy()
        await dateTimeField.setEnabled(false)
        expect(await dateTimeField.getEnabled()).toBeFalsy()
    })

    it("control event (ui5 button's firePress() under the hood)", async () => {
        const button = await browser.asControl(buttonSelector)
        await button.press()
    })

    it("ui5 getProperty and get$shortHand both work (example: list control)", async () => {
        const list = (await browser.asControl(listSelector)) as unknown as List
        const headerTextByShorthand = await list.getHeaderText()
        const headerTextByProperty = await list.getProperty("headerText")
        expect(headerTextByShorthand).toEqual("...bites the dust!")
        expect(headerTextByProperty).toEqual("...bites the dust!")
        expect(headerTextByShorthand).toBe(headerTextByProperty)
    })

    it("control id retrieval ", async () => {
        const list = (await browser.asControl(listSelector)) as unknown as List
        const listId = await list.getId()
        expect(listId).toContain("PeopleList")
    })

    it("sap.m.List APIs", async () => {
        const list = (await browser.asControl(listSelector)) as unknown as List
        const listMode = await list.getMode()
        const activeItem = await (list as any).getActiveItem()
        const isBusy = await list.getBusy()
        // TODO: implement getModel properly? or not at all?
        // const model = await list.getModel();
        // TODO: make getBinding return some proper value? or don't proxy at all?
        const binding = await list.getBinding("items")

        expect(listMode).toEqual("None")
        expect(activeItem).toBeFalsy()
        expect(isBusy).toBeFalsy()
        // expect(model).toBeDefined(); // see above
        expect(binding).toBeDefined()
    })
})
