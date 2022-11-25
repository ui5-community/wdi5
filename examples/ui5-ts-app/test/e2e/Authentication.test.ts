import { wdi5 } from "wdio-ui5-service"

describe("wdi5 authentication", async () => {
    it("wdi5.isLoggedIn", async () => {
        expect(await wdi5.isLoggedIn()).toBeTruthy()
    })
})
