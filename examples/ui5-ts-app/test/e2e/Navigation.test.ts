//TODO

import { Selector } from "./selector"
import { Other } from "./pageObjects/Other"
import List from "sap/m/List"

const pageItem = new Other()

describe("test list, items and view", async () => {
    before(async () => {
        await pageItem.open()
    })

    it("Open the correct Url", async () => {
        await expect(browser).toHaveUrl("http://localhost:8080/index.html#/Other")
    })

    it("check if the list ID is correct", async () => {
        const list: Selector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.tsapp.view.Other"
            }
        }
        const olist = await (browser.asControl(list) as unknown as List).getId()
        expect(olist).toContain("PeopleList")
    })
})
