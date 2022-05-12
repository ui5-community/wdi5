import { Selector } from "./selector"
import Page from "./pageObjects/Page"

const pageItem = new Page()

describe("View", async () => {
    before(async () => {
        await pageItem.open()
    })
    // it("should open Other view", async () => {
    //     const viewButton: Selector = {
    //         selector: {
    //             id: "NavFwdButton",
    //             viewName: "test.Sample.tsapp.view.Main"
    //         }
    //     }
    //     //const viewButtonControl = await browser.asControl(viewButton)
    // })

    it("should read all names on the list", async () => {
        const pageItemID = await pageItem.getList()
        expect(pageItemID.getId()).toContain("PeopleList")
    })
})
