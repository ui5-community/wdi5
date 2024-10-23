// TODO: Test is missing!
async function clientSide_getSelectorForElement(oOptions, browserInstance) {
    return await browserInstance.execute(async (oOptions) => {
        await window.wdi5.waitForUI5(window.wdi5.waitForUI5Options).catch(window.wdi5.errorHandling.bind(this))

        window.wdi5.Log.info("[browser wdi5] locating domElement")
        const controlSelector = await window.bridge
            .findControlSelectorByDOMElement(oOptions)
            .catch(window.wdi5.errorHandling.bind(this))

        window.wdi5.Log.info("[browser wdi5] controlLocator created!")
        return { status: 0, result: controlSelector }
    }, oOptions)
}

module.exports = {
    clientSide_getSelectorForElement
}
