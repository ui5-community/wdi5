const Main = require("./pageObjects/Main")

const titleSelector = {
    selector: {
        id: "container-Sample---Main--Title::NoAction.h1"
    }
}

describe("Multi Remote", () => {
    before(async () => {
        await Main.open()
    })

    it("allows handling ui5 controls in different browsers", async () => {
        const button = await browser.two.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })
        const metadata = button.getControlInfo()

        expect(metadata.id).toEqual("container-Sample---Main--openDialogButton")
        expect(metadata.className).toEqual("sap.m.Button")
        expect(metadata.key).toEqual("openDialogButtontestSample.view.Main")

        await button.press()

        const dialogSelector = {
            selector: {
                id: "Dialog-title",
                searchOpenDialogs: true
            }
        }

        const text = await browser.two.asControl(dialogSelector).getText()
        expect(text).toEqual("Here we are!")
        expect((await browser.one.asControl(dialogSelector)).domId).not.toExist()
    })
})
