export async function switchToTopFrame(browserInstance: WebdriverIO.Browser): Promise<void> {
    // v10 BiDi has no frame switching; commands already target the top-level context
    try {
        await browserInstance.switchFrame(null)
    } catch (err) {
        if (err instanceof Error && err.message.includes("removed for WebDriver BiDi")) {
            return
        }
        throw err
    }
}
