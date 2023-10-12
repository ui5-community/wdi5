async function clientSide_getSelectorForElement(oOptions, browserInstance) {
    return await browserInstance.executeAsync((oOptions, done) => {
        window.wdi5.waitForUI5(
            window.wdi5.waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating domElement")
                window.bridge
                    .findControlSelectorByDOMElement(oOptions)
                    .then((controlSelector) => {
                        window.wdi5.Log.info("[browser wdi5] controlLocator created!")
                        done({ status: 0, result: controlSelector })
                        return controlSelector
                    })
                    .catch(window.wdi5.errorHandling.bind(this, done))
            },
            window.wdi5.errorHandling.bind(this, done)
        )
    }, oOptions)
}

module.exports = {
    clientSide_getSelectorForElement
}
