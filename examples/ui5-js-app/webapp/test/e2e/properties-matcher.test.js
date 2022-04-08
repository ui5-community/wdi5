describe("Property locators", () => {
    const mainViewName = "test.Sample.view.Main"
    const otherViewName = "test.Sample.view.Other"

    it("should find the 'open dialog' button by the text property", async () => {
        const selectorByPropertyText = {
            selector: {
                controlType: "sap.m.Button",
                viewName: mainViewName,
                properties: {
                    text: "open Dialog"
                }
            }
        }
        const textFromButton = await browser.asControl(selectorByPropertyText).getText()
        expect(textFromButton).toEqual("open Dialog")
    })

    it("should find the 'to Other view' button by the icon property and click on it", async () => {
        const selectorWithIconProperty = {
            selector: {
                controlType: "sap.m.Button",
                viewName: mainViewName,
                properties: {
                    icon: "sap-icon://forward"
                }
            }
        }
        const toOtherViewButton = await browser.asControl(selectorWithIconProperty)
        const textFromButton = await toOtherViewButton.getText()
        expect(textFromButton).toEqual("to Other view")
        await toOtherViewButton.press()
    })

    it("should find the List by the header Text", async () => {
        const selectorWithHeaderTextProperty = {
            selector: {
                controlType: "sap.m.List",
                viewName: otherViewName,
                properties: {
                    headerText: "...bites the dust!"
                }
            }
        }
        const headerTextFromList = await browser.asControl(selectorWithHeaderTextProperty).getHeaderText()
        expect(headerTextFromList).toEqual("...bites the dust!")
    })
    it("should find the third entry in the List", async () => {
        const selectorWithTitleProperty = {
            selector: {
                controlType: "sap.m.StandardListItem",
                viewName: otherViewName,
                properties: {
                    title: "Margaret Peacock"
                }
            }
        }
        const titleFromListItem = await browser.asControl(selectorWithTitleProperty).getTitle()
        expect(titleFromListItem).toEqual("Margaret Peacock")
        await browser.asControl(selectorWithTitleProperty).press()

        const selector = {
            selector: {
                controlType: "sap.m.Text",
                viewName: otherViewName,
                properties: {
                    text: "Margaret Peacock",
                    visible: true
                }
            }
        }
        const selectorText = await browser.asControl(selector).getText()
        expect(selectorText).toEqual("Margaret Peacock")
    })
})
