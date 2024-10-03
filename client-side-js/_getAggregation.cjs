async function clientSide_getAggregation(webElement, aggregationName, browserInstance) {
    webElement = await Promise.resolve(webElement) // to plug into fluent async api
    browserInstance = await Promise.resolve(browserInstance)
    return await browserInstance.execute(
        async (webElement, aggregationName) => {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options).catch((e) => {
                return { status: 1, message: e.toString() }
            })

            try {
                let oControl = window.wdi5.getUI5CtlForWebObj(webElement)
                let cAggregation = oControl.getAggregation(aggregationName)
                // if getAggregation retrieves an element only it has to be transformed to an array
                if (cAggregation && !Array.isArray(cAggregation)) {
                    cAggregation = [cAggregation]
                }
                // read classname eg. sap.m.ComboBox
                controlType = oControl.getMetadata()._sClassName
                let result = window.wdi5.createControlIdMap(cAggregation, controlType)
                return { status: 0, result: result }
            } catch (e) {
                return { status: 1, message: e.toString() }
            }
        },
        webElement,
        aggregationName
    )
}

module.exports = {
    clientSide_getAggregation
}
