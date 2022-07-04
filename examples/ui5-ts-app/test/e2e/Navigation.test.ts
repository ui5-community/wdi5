import Button from "sap/ui/webc/main/Button"
import List from "sap/ui/webc/main/List"
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"

describe("Navigation", async () => {
    it("nav to other view and check if successful", async () => {
        // click webcomponent button to trigger navigation
        await (
            browser.asControl({
                selector: {
                    id: "NavFwdButton",
                    viewName: "test.Sample.tsapp.view.Main"
                }
            }) as unknown as Button
        ).fireClick()

        const listSelector: wdi5Selector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.tsapp.view.Other"
            }
        }
        const list = await (browser.asControl(listSelector) as unknown as List).getId()
        expect(list).toContain("PeopleList")
    })
})
