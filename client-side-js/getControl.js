async function clientSide_getControl(controlSelector) {
    controlSelector = await Promise.resolve(controlSelector) // to plug into fluent async api
    return await browser.executeAsync((controlSelector, done) => {
        const errorHandling = (error) => {
            window.wdi5.Log.error("[browser wdi5] ERR: ", error)
            done(["error", error.toString()])
        }

        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)
        if (controlSelector.timeout) {
            waitForUI5Options.timeout = controlSelector.timeout
        }
        window.wdi5.waitForUI5(
            waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating " + JSON.stringify(controlSelector))
                controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector)
                window.bridge
                    .findDOMElementByControlSelector(controlSelector)
                    .then((domElement) => {
                        // window.wdi5.Log.info('[browser wdi5] control located! - Message: ' + JSON.stringify(domElement));
                        // ui5 control
                        const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement)
                        const id = ui5Control.getId()
                        const className = ui5Control.getMetadata()._sClassName
                        window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
                        const aProtoFunctions = window.wdi5.retrieveControlMethods(ui5Control)
                        // @type [String, String?, String, "Array of Strings"]
                        done([
                            "success",
                            { domElement: domElement, id: id, aProtoFunctions: aProtoFunctions, className: className }
                        ])
                    })
                    .catch(errorHandling)
            },
            errorHandling
        )
    }, controlSelector)
}

module.exports = {
    clientSide_getControl
}
