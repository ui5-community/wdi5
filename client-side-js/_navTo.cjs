async function clientSide__navTo(sComponentId, sName, oParameters, oComponentTargetInfo, bReplace, browserInstance) {
    return await browserInstance.executeAsync(
        (sComponentId, sName, oParameters, oComponentTargetInfo, bReplace, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                window.wdi5.Log.info(`[browser wdi5] navigation to ${sName} triggered`)

                const router = sap.ui.getCore().getComponent(sComponentId).getRouter()
                const hashChanger = window.compareVersions.compare("1.75.0", sap.ui.version, ">")
                    ? sap.ui.core.routing.HashChanger.getInstance()
                    : router.getHashChanger()

                // on success result is the router
                // FIXME: should this be changed to attach once?
                hashChanger.attachEvent("hashChanged", (oEvent) => {
                    done({
                        status: 0,
                        result: window.compareVersions.compare("1.75.0", sap.ui.version, ">")
                            ? hashChanger.getHash()
                            : hashChanger.hash
                    })
                })

                // get component and trigger router
                // sName, oParameters?, oComponentTargetInfo?, bReplace?
                router.navTo(sName, oParameters, oComponentTargetInfo, bReplace)
            })
        },
        sComponentId,
        sName,
        oParameters,
        oComponentTargetInfo,
        bReplace
    )
}
module.exports = {
    clientSide__navTo
}
