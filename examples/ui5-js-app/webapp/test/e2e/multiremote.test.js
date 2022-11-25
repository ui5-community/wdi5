const Main = require("./pageObjects/Main")
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
        expect(await browser.one.asControl(dialogSelector).getInitStatus()).toBeFalsy()
    })
    it("should return an array of results of both browsers if called directly by browser", async () => {
        const button = await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: "test.Sample.view.Main"
            }
        })
        const buttonOne = button[0]
        const buttonTwo = button[1]
        expect(buttonOne._browserInstance.sessionId).not.toEqual(buttonTwo._browserInstance.sessionId)

        expect(await buttonOne.getText()).toEqual("open Dialog")
        expect(await buttonTwo.getText()).toEqual("open Dialog")
    })
})
