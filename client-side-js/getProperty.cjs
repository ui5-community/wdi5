async function clientSide_getProperty(uuid, propertyName) {
    return await browser.executeAsync(
        (uuid, propertyName, done) => {
            const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)

            window.wdi5.waitForUI5(
                waitForUI5Options,
                () => {
                    window.wdi5.Log.info(`[browser wdi5] locating property ${propertyName} from object ${uuid}`)

                    let object = window.wdi5.objectMap[uuid]
                    if (!object) {
                        const errorMessage = `[browser wdi5] ERR: no object with uuid: ${uuid} found`
                        window.wdi5.Log.error(errorMessage)
                        done({ status: 1, message: errorMessage })
                    }
                    object = object[propertyName]

                    if (!object) {
                        const errorMessage = `[browser wdi5] ERR: property: ${propertyName} not found on object ${uuid}`
                        window.wdi5.Log.error(errorMessage)
                        done({ status: 1, message: errorMessage })
                    }

                    let className = ""
                    if (object && object.getMetadata) {
                        className = object.getMetadata()._sClassName
                    }
                    window.wdi5.Log.info(
                        `[browser wdi5] property: ${propertyName} in object with uuid: ${uuid} located!`
                    )
                    if (typeof object !== "object") {
                        done({ status: 0, result: object })
                        return
                    }
                    const {
                        semanticCleanedElements,
                        aProtoFunctions,
                        objectNames,
                        uuid: newUUID
                    } = window.wdi5.prepareObjectForSerialization(object)

                    done({
                        status: 0,
                        uuid: newUUID,
                        aProtoFunctions: aProtoFunctions,
                        className: className,
                        object: semanticCleanedElements,
                        objectNames,
                        returnType: "object"
                    })
                },
                window.wdi5.errorHandling.bind(this, done)
            )
        },
        uuid,
        propertyName
    )
}

module.exports = {
    clientSide_getProperty
}
