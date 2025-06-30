import type RecordReplay from "sap/ui/test/RecordReplay"
import type Control from "sap/ui/core/Control"

async function clientSide_getAggregation(
    webElement: WebdriverIO.Element,
    aggregationName: string,
    browserInstance: WebdriverIO.Browser
) {
    webElement = await Promise.resolve(webElement) // to plug into fluent async api
    browserInstance = await Promise.resolve(browserInstance)
    return await browserInstance.execute(
        async (webElement, aggregationName) => {
            try {
                await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
                const oControl = window.wdi5.getUI5CtlForWebObj(webElement)
                let cAggregation = oControl.getAggregation(aggregationName) as Control[]
                // if getAggregation retrieves an element only it has to be transformed to an array
                if (cAggregation && !Array.isArray(cAggregation)) {
                    cAggregation = [cAggregation]
                }
                // read classname eg. sap.m.ComboBox
                const controlType = oControl.getMetadata().getName()
                const result = window.wdi5.createControlIdMap(cAggregation, controlType)
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

export { clientSide_getAggregation }
