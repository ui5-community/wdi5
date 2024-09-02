async function clientSide_getObject(uuid) {
    return await browser.executeAsync((uuid, done) => {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)

        window.wdi5.waitForUI5(
            waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating object " + uuid)

                let object = window.wdi5.objectMap[uuid]
                if (!object) {
                    const errorMessage = `[browser wdi5] ERR: no object with uuid: ${uuid} found`
                    window.wdi5.Log.error(errorMessage)
                    done({ status: 1, message: errorMessage })
                }

                let className = ""
                if (object && object.getMetadata) {
                    className = object.getMetadata()._sClassName
                }
                window.wdi5.Log.info(`[browser wdi5] object with uuid: ${uuid} located!`)
                const { semanticCleanedElements, aProtoFunctions, objectNames } =
                    window.wdi5.prepareObjectForSerialization(object, true)

                done({
                    status: 0,
                    uuid: uuid,
                    aProtoFunctions: aProtoFunctions,
                    className: className,
                    object: semanticCleanedElements,
                    objectNames
                })
            },
            window.wdi5.errorHandling.bind(this, done)
        )
    }, uuid)
}

module.exports = {
    clientSide_getObject
}
