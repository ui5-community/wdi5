async function clientSide_getObject(uuid) {
    return await browser.execute(async (uuid) => {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)

        try {
            await window.bridge.waitForUI5(waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating object " + uuid)

        let object = window.wdi5.objectMap[uuid]
        if (!object) {
            const errorMessage = `[browser wdi5] ERR: no object with uuid: ${uuid} found`
            window.wdi5.Log.error(errorMessage)
            return { status: 1, message: errorMessage }
        }

        let className = ""
        if (object && object.getMetadata) {
            className = object.getMetadata()._sClassName
        }
        window.wdi5.Log.info(`[browser wdi5] object with uuid: ${uuid} located!`)

        // FIXME: extract, collapse and remove cylic in 1 step

        const aProtoFunctions = window.wdi5.retrieveControlMethods(object, true)

        object = window.wdi5.collapseObject(object)

        const collapsedAndNonCyclic = JSON.parse(JSON.stringify(object, window.wdi5.getCircularReplacer()))

        // remove all empty Array elements, inlcuding private keys (starting with "_")
        const semanticCleanedElements = window.wdi5.removeEmptyElements(collapsedAndNonCyclic)

        return {
            status: 0,
            uuid,
            aProtoFunctions,
            className,
            object: semanticCleanedElements
        }
    }, uuid)
}

module.exports = {
    clientSide_getObject
}
