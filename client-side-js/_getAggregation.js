async function _getAggregation(webElement, aggregationName) {
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
                    let result = window.wdi5.createControlIdMap(cAggregation)
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
    _getAggregation
}
