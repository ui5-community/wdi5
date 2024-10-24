// TODO: Test is missing!
async function clientSide_getSelectorForElement(oOptions, browserInstance) {
    return await browserInstance.execute(async (oOptions) => {
        try {
            await window.wdi5.waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating domElement")
        let controlSelector
        try {
            controlSelector = await window.bridge
            .findControlSelectorByDOMElement(oOptions)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] controlLocator created!")
        return { status: 0, result: controlSelector }
    }, oOptions)
}

module.exports = {
    clientSide_getSelectorForElement
}
