async function clientSide_getObject(uuid) {
    return await browser.executeAsync((uuid, done) => {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)

        window.wdi5.waitForUI5(
            waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating object " + uuid)

                const object = window.wdi5.objectMap[uuid]
                let className = ""

                if (object.getMetadata) {
                    className = object.getMetadata()._sClassName
                }
                window.wdi5.Log.info(`[browser wdi5] object with uuid: ${uuid} located!`)

                const aProtoFunctions = window.wdi5.retrieveControlMethods(object)

                done({
                    status: 0,
                    uuid: uuid,
                    aProtoFunctions: aProtoFunctions,
                    className: className
                })
            },
            window.wdi5.errorHandling.bind(this, done)
        )
    }, uuid)
}

module.exports = {
    clientSide_getObject
}
