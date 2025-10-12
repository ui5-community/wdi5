import Button from "sap/m/Button"
import Page from "sap/m/Page"
import Controller from "sap/ui/core/mvc/Controller"
import View from "sap/ui/core/mvc/View"
import { wdi5Selector } from "wdio-ui5-service"
import { wdi5 } from "wdio-ui5-service"
import { mock } from "node:test"

const Logger = wdi5.getLogger()

describe("Basic", async () => {
    it("browser.allControls: check number of buttons", async () => {
        const allButtonsSelector: wdi5Selector = {
            selector: {
                controlType: "sap.ui.webc.main.Button",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }

        const allButtons = await browser.allControls<Button>(allButtonsSelector)
        expect(allButtons.length).toEqual(1)
    })

    it("should resolve an async Controller function", async () => {
        const selector: wdi5Selector = {
            selector: {
                id: "page",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const view = await (browser.asControl(selector) as unknown as Page).getParent()
        const controller: Controller = await (view as View).getController()

        // @ts-expect-error this async fn lives in an not properly typed controller
        const number = await controller.asyncFn()
        expect(number).toEqual(10)
    })

    it("should catch an erroneous async Controller function properly", async () => {
        const logSpy = mock.method(Logger, "error", () => {})

        const selector: wdi5Selector = {
            selector: {
                id: "page",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const view: unknown = await (browser.asControl(selector) as unknown as Page).getParent()
        const controller: Controller = await (view as View).getController()

        // @ts-expect-error this async fn lives in an not properly typed controller
        await controller.asyncRejectFn()
        expect(logSpy.mock.calls[0].arguments[0]).toEqual('call of asyncRejectFn failed because of: "meh"')

        logSpy.mock.restore()
    })
})
