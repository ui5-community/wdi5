import { Selector } from "./selector"
import DateTimePicker from "sap/m/DateTimePicker"

describe("Basic Test DateTimePicker", async () => {
    it.only("should using correct value", async () => {
        const dateTimePicker: Selector = {
            selector: {
                id: "idDateTime",
                viewName: "test.Sample.tsapp.view.Main"
            }
        }
        const oDateTimePicker = (await browser.asControl(dateTimePicker)) as unknown as DateTimePicker
        await oDateTimePicker.setValue("2000-01-01-12-00-01")
        expect(await oDateTimePicker.getValue()).toEqual("2000-01-01-12-00-01")
    })
})
