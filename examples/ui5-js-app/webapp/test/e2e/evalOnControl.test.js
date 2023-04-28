const Main = require("./pageObjects/Main")
const Other = require("./pageObjects/Other")
const marky = require("marky")
const { wdi5 } = require("wdio-ui5-service")

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

        const regularBtnText = await button.getText()
        expect(buttonText).toEqual(regularBtnText)
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
        const list = await browser.asControl(listSelector)

        /**
         * need to set
         * wdi5: {logLevel: "verbose"}
         * in config.js
         */

        // *********
        // new approach -> takes ~4.3sec
        marky.mark("evalOnControlForListItemTitles")
        const peopleListNames = await list.evalOnControl(function () {
            return this.getItems().map((item) => item.getTitle())
        })
        wdi5.getLogger().info(marky.stop("evalOnControlForListItemTitles"))
        // *********

        Other.allNames.forEach((name) => {
            expect(peopleListNames).toContain(name)
        })

        // *********
        // UI5 API straight forward approach -> takes ~8.1sec
        marky.mark("regularGetAllItemTitles")
        const regularPeopleListNames = await Promise.all(
            // prettier-ignore
            (await list.getItems()).map(async (e) => {
                return await e.getTitle()
            })
        )
        wdi5.getLogger().info(marky.stop("regularGetAllItemTitles"))
        // *********

        Other.allNames.forEach((name) => {
            expect(regularPeopleListNames).toContain(name)
        })

        // compare results
        regularPeopleListNames.forEach((name) => {
            expect(peopleListNames).toContain(name)
        })
    })

    it("get people list title and people names, object return type", async () => {
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
                peopleListNames: this.getItems().map((item) => item.getTitle())
            }
        })

        expect(peopleListData.tableTitle).toEqual("...bites the dust!")
        Other.allNames.forEach((name) => {
            expect(peopleListData.peopleListNames).toContain(name)
        })
    })
})
