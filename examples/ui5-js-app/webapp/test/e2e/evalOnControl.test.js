const Main = require("./pageObjects/Main")
const Other = require("./pageObjects/Other")

describe("ui5 eval on control", () => {
    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    it("execute function browserside on button to get its text, basic return type", async () => {
        const button = await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })
        const buttonText = await button.evalOnControl(function () {
            return this.getText()
        })
        expect(buttonText).toEqual("open Dialog")
    })

    it("nav to other view and get people list names, array return type", async () => {
        // click webcomponent button to trigger navigation
        const navButton = await browser.asControl({
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        })
        await navButton.press()

        const listSelector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.view.Other",
                interaction: "root"
            }
        }
        const peopleListNames = await browser.asControl(listSelector).evalOnControl(function () {
            return this.getItems().map(item => item.getTitle());
        })
        Other.allNames.forEach(name => {
            expect(peopleListNames).toContain(name)
        })
    })

    it("nav to other view and get people list names, object return type", async () => {
        const listSelector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.view.Other",
                interaction: "root"
            }
        }
        const peopleListData = await browser.asControl(listSelector).evalOnControl(function () {
            return {
                tableTitle: this.getHeaderText(),
                peopleListNames: this.getItems().map(item => item.getTitle())
            }
        })

        expect(peopleListData.tableTitle).toEqual("...bites the dust!")
        Other.allNames.forEach(name => {
            expect(peopleListData.peopleListNames).toContain(name)
        })
    })
})
