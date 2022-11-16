import { wdi5 } from "../../../../dist"

describe("MultiRemote Authentication", async () => {
    it("isLoggedIn status", async () => {
        expect(wdi5.isLoggedIn("one")).toBeTruthy()
        expect(wdi5.isLoggedIn("two")).toBeTruthy()
    })
})
