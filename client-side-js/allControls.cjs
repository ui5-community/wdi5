async function clientSide_allControls(controlSelector, browserInstance) {
    controlSelector = await Promise.resolve(controlSelector) // to plug into fluent async api
    return await browserInstance.execute(async (controlSelector) => {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)
        if (controlSelector.timeout) {
            waitForUI5Options.timeout = controlSelector.timeout
        }
        return await new Promise((resolve, reject) => {
            window.wdi5.waitForUI5(
                waitForUI5Options,
                () => {
                    window.wdi5.Log.info("[browser wdi5] locating " + JSON.stringify(controlSelector))
                    controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector)
                    window.bridge
                        .findAllDOMElementsByControlSelector(controlSelector)
                        .then((domElements) => {
                            // ui5 control
                            let returnElements = []
                            domElements.forEach((domElement) => {
                                const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement)
                                const id = ui5Control.getId()
                                window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
                                const aProtoFunctions = window.wdi5.retrieveControlMethods(ui5Control)
                                // @type [String, String?, String, "Array of Strings"]
                                returnElements.push({
                                    domElement: domElement,
                                    id: id,
                                    aProtoFunctions: aProtoFunctions
                                })
                            })

                            resolve({ status: 0, result: returnElements })
                        })
                        .catch(window.wdi5.errorHandling.bind(this, reject))
                },
                window.wdi5.errorHandling.bind(this, reject)
            )
        })
    }, controlSelector)
}

module.exports = {
    clientSide_allControls
}
