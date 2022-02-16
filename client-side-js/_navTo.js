async function clientSide__navTo(sComponentId, sName, oParameters, oComponentTargetInfo, bReplace) {
    return await browser.executeAsync(
        (sComponentId, sName, oParameters, oComponentTargetInfo, bReplace, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                window.wdi5.Log.info(`[browser wdi5] navigation to ${sName} triggered`)

                const router = sap.ui.getCore().getComponent(sComponentId).getRouter()
                const hashChanger =
                    parseFloat(sap.ui.version) < 1.75
                        ? sap.ui.core.routing.HashChanger.getInstance()
                        : router.getHashChanger()

                // on success result is the router
                hashChanger.attachEvent("hashChanged", (oEvent) => {
                    done(["success", parseFloat(sap.ui.version) < 1.75 ? hashChanger.getHash() : hashChanger.hash])
                })

                // get component and trigger router
                // sName, oParameters?, oComponentTargetInfo?, bReplace?
                router.navTo(sName, oParameters, oComponentTargetInfo, bReplace)
                return parseFloat(sap.ui.version) < 1.75 ? hashChanger.getHash() : hashChanger.hash
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
