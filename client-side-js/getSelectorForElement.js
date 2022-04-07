async function clientSide_getSelectorForElement(oOptions) {
    return await browser.executeAsync((oOptions, done) => {
        const errorHandling = (error) => {
            window.wdi5.Log.error("[browser wdi5] ERR: ", error)
            done(["error", error.toString()])
            return error
        }

        window.wdi5.waitForUI5(
            window.wdi5.waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating domElement")
                window.bridge
                    .findControlSelectorByDOMElement(oOptions)
                    .then((controlSelector) => {
                        window.wdi5.Log.info("[browser wdi5] controlLocator created!")
                        done(["success", controlSelector])
                        return controlSelector
                    })
                    .catch(errorHandling)
            },
            errorHandling
        )
    }, oOptions)
}

module.exports = {
    clientSide_getSelectorForElement
}
