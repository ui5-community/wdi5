async function clientSide_getControl(controlSelector, byId) {
    controlSelector = await Promise.resolve(controlSelector) // to plug into fluent async api
    return await browser.executeAsync(
        (controlSelector, byId, done) => {
            const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)
            if (controlSelector.timeout) {
                waitForUI5Options.timeout = controlSelector.timeout
            }
            window.wdi5.waitForUI5(
                waitForUI5Options,
                () => {
                    window.wdi5.Log.info("[browser wdi5] locating " + JSON.stringify(controlSelector))
                    switch (byId) {
                        case true:
                            const ui5Control = sap.ui.getCore().byId(controlSelector.selector.id)
                            const id = ui5Control.getId()
                            const className = ui5Control.getMetadata()._sClassName
                            window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
                            const aProtoFunctions = window.wdi5.retrieveControlMethods(ui5Control)

                            done({
                                status: 0,
                                domElement: ui5Control.getDomRef(),
                                id: id,
                                aProtoFunctions: aProtoFunctions,
                                className: className
                            })

                            break
                        case false:
                            controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector)
                            window.bridge
                                .findDOMElementByControlSelector(controlSelector)
                                .then((domElement) => {
                                    const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement)
                                    const id = ui5Control.getId()
                                    const className = ui5Control.getMetadata()._sClassName
                                    window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
                                    const aProtoFunctions = window.wdi5.retrieveControlMethods(ui5Control)
                                    done({
                                        status: 0,
                                        domElement: domElement,
                                        id: id,
                                        aProtoFunctions: aProtoFunctions,
                                        className: className
                                    })
                                })
                                .catch(window.wdi5.errorHandling.bind(this, done))
                            break
                    }
                },
                window.wdi5.errorHandling.bind(this, done)
            )
        },
        controlSelector,
        byId
    )
}

module.exports = {
    clientSide_getControl
}
