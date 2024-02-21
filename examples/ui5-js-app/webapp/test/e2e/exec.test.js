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

    it("should be able to propagate a browserside error", async () => {
        //Log Output during this test should be 3 times: [wdi5] call of exec failed because of: TypeError: this.getTex is not a function
        //Can't be reasonably verified programatically, only that returned result should be null
        const button = await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })

        //regular function
        const resultRegularFunction = await button.exec(function () {
            return this.getTex()
        })
        expect(resultRegularFunction).toBeNull()

        //arrow functions
        const resultArrowFunction1 = await button.exec(() => this.getTex())
        expect(resultArrowFunction1).toBeNull()
        const resultArrowFunction2 = await button.exec(() => {
            return this.getTex()
        })
        expect(resultArrowFunction2).toBeNull()
    })

    it("execute function browserside on button to get its text, basic return type", async () => {
        const button = await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })

        const regularBtnText = await button.getText()
        //regular function
        const buttonText = await button.exec(function () {
            return this.getText()
        })
        expect(buttonText).toEqual("open Dialog")
        expect(buttonText).toEqual(regularBtnText)

        //arrow functions
        const buttonTextArrow1 = await button.exec(() => this.getText())
        expect(buttonTextArrow1).toEqual("open Dialog")
        expect(buttonTextArrow1).toEqual(regularBtnText)
        const buttonTextArrow2 = await button.exec(() => {
            return this.getText()
        })
        expect(buttonTextArrow2).toEqual("open Dialog")
        expect(buttonTextArrow2).toEqual(regularBtnText)
    })

    it("execute function browserside on button to get its text with fluent sync api, basic return type", async () => {
        const buttonText = await browser
            .asControl({
                selector: {
                    id: "openDialogButton",
                    viewName: "test.Sample.view.Main"
                }
            })
            .exec(function () {
                return this.getText()
            })
        expect(buttonText).toEqual("open Dialog")
    })

    it("execute function browserside on button and compare text there, boolean return type", async () => {
        const button = await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })

        const regularBtnText = await button.getText()
        //regular function
        const textIsEqual = await button.exec(
            function (dialogTextHardcoded, dialogTextFromUI) {
                return this.getText() === dialogTextHardcoded && this.getText() === dialogTextFromUI
            },
            "open Dialog",
            regularBtnText
        )
        expect(textIsEqual).toEqual(true)

        //arrow functions
        const textIsEqualArrow1 = await button.exec(
            (dialogTextHardcoded, dialogTextFromUI) =>
                this.getText() === dialogTextHardcoded && this.getText() === dialogTextFromUI,
            "open Dialog",
            regularBtnText
        )
        expect(textIsEqualArrow1).toEqual(true)
        const textIsEqualArrow2 = await button.exec(
            (dialogTextHardcoded, dialogTextFromUI) => {
                return this.getText() === dialogTextHardcoded && this.getText() === dialogTextFromUI
            },
            "open Dialog",
            regularBtnText
        )
        expect(textIsEqualArrow2).toEqual(true)
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
        marky.mark("execForListItemTitles")
        const peopleListNames = await list.exec(function () {
            return this.getItems().map((item) => item.getTitle())
        })
        wdi5.getLogger().info(marky.stop("execForListItemTitles"))
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
        const peopleListData = await browser.asControl(listSelector).exec(function () {
            return {
                tableTitle: this.getHeaderText(),
                peopleListNames: this.getItems().map((item) => item.getTitle())
            }
        })
        expect(peopleListData.tableTitle).toEqual("...bites the dust!")
        peopleListNames = await peopleListData.peopleListNames
        Other.allNames.forEach((name) => {
            expect(peopleListNames).toContain(name)
        })
    })
})
