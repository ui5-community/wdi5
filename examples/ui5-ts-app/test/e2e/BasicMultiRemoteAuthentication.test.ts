import { wdi5 } from "wdio-ui5-service"

describe("MultiRemote Authentication", async () => {
    it("isLoggedIn status", async () => {
        expect(await wdi5.isLoggedIn("one")).toBeTruthy()
        expect(await wdi5.isLoggedIn("two")).toBeTruthy()
    })
})
