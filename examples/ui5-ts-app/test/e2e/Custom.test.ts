describe("Basic", async () => {
    it("browser.allControls: check number of buttons", async () => {
        expect(await $("#flash").isDisplayed()).toBeTruthy()
    })
})
