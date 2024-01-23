async function clientSide_getControl2(controlSelector, callChainString, browserInstance) {
    return await browserInstance.executeAsync(
        (controlSelector, callChainString, done) => {
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
                            const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement)
                            const id = ui5Control.getId()
                            const className = ui5Control.getMetadata()._sClassName
                            window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
                            return ui5Control
                        })
                        .then((ui5Control) => {
                            // unpack the chain array
                            debugger
                            const result = eval("ui5Control" + callChainString)

                            done({
                                status: 0,
                                result
                            })
                        })
                        .catch((error) => {
                            debugger
                            window.wdi5.errorHandling.bind(error, done)
                        })
                },
                window.wdi5.errorHandling.bind(this, done)
            )
        },
        controlSelector,
        callChainString
    )
}

module.exports = {
    clientSide_getControl2
}
