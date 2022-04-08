async function clientSide_getAggregation(webElement, aggregationName) {
    webElement = await Promise.resolve(webElement) // to plug into fluent async api
    return await browser.executeAsync(
        (webElement, aggregationName, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                // DOM to UI5
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
                    done(["success", result])
                } catch (e) {
                    done(["error", e.toString()])
                }
            })
        },
        webElement,
        aggregationName
    )
}

module.exports = {
    clientSide_getAggregation
}
