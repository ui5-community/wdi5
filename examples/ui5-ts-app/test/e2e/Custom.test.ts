describe("custom login", async () => {
    // we silently acknowledge that this is not a UI5 app
    // being tested, so browser-scoped errors are ok
    it("w/ a username + password form", async () => {
        const expectedSuccessMessage = "You logged into a secure area!"
        const actualSuccessMessage = await $("#flash").getText()
        expect(actualSuccessMessage).toContain(expectedSuccessMessage)
    })
})
