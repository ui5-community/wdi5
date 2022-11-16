import { wdi5 } from "../../../../dist"

describe("MultiRemote Authentication", async () => {
    it("isLoggedIn status", async () => {
        expect(await wdi5.isLoggedIn("one")).toBeTruthy()
        expect(await wdi5.isLoggedIn("two")).toBeTruthy()
    })
})
