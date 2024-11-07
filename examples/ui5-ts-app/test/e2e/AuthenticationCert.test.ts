import { wdi5 } from "wdio-ui5-service"

describe("wdi5 authentication", async () => {
    it("wdi5.isLoggedIn", async () => {
        expect(await wdi5.isLoggedIn()).toBeTruthy()
    })

    it("should contain 'Zeis' in header title", async () => {
        await browser.waitUntil(
            async () => {
                const state = await browser.execute(() => {
                    return (
                        window.document.readyState === "complete" &&
                        (!(window as any)._pendingFetchRequests || (window as any)._pendingFetchRequests === 0)
                    )
                })
                return state
            },
            {
                timeout: 10000,
                timeoutMsg: "Network did not reach idle state after 10s"
            }
        )

        const logger = wdi5.getLogger()
        logger.log("Starting test to check header title")

        const headerTitle = await $("span[id='cockpitObjectPageHeader-innerTitle']")
        logger.log("Found header title element")

        const titleText = await headerTitle.getText()
        logger.log(`Retrieved title text: "${titleText}"`)

        expect(titleText).toContain("Zeis")
        logger.log("Successfully verified title contains 'Zeis'")
    })
})
