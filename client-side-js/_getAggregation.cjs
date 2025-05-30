async function clientSide_getAggregation(webElement, aggregationName, browserInstance) {
    webElement = await Promise.resolve(webElement) // to plug into fluent async api
    browserInstance = await Promise.resolve(browserInstance)
    return await browserInstance.execute(
        async (webElement, aggregationName) => {
            try {
                await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
                let oControl = window.wdi5.getUI5CtlForWebObj(webElement)
                let cAggregation = oControl.getAggregation(aggregationName)
                // if getAggregation retrieves an element only it has to be transformed to an array
                if (cAggregation && !Array.isArray(cAggregation)) {
                    cAggregation = [cAggregation]
                }
                // read classname eg. sap.m.ComboBox
                let controlType = oControl.getMetadata()._sClassName
                let result = window.wdi5.createControlIdMap(cAggregation, controlType)
                return { status: 0, result: result }
            } catch (error) {
                // also returns an object with a "status": 1 property
                return window.wdi5.errorHandling(error)
            }
        },
        webElement,
        aggregationName
    )
}

module.exports = {
    clientSide_getAggregation
}
