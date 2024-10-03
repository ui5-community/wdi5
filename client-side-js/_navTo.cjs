async function clientSide__navTo(sComponentId, sName, oParameters, oComponentTargetInfo, bReplace, browserInstance) {
    return await browserInstance.execute(
        async (sComponentId, sName, oParameters, oComponentTargetInfo, bReplace) => {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options).catch((e) => {
                return { status: 1, message: e.toString() }
            })

            window.wdi5.Log.info(`[browser wdi5] navigation to ${sName} triggered`)

            // TODO: get rid of deprectaed function
            const router = sap.ui.getCore().getComponent(sComponentId).getRouter()
            const hashChanger = window.compareVersions.compare("1.75.0", sap.ui.version, ">")
                ? sap.ui.core.routing.HashChanger.getInstance()
                : router.getHashChanger()

            // create hashChanged promise
            const hashChangedPromise = new Promise((resolve) => {
                hashChanger.attachEventOnce("hashChanged", () => {
                    resolve()
                })
            })

            // get component and trigger router
            // sName, oParameters?, oComponentTargetInfo?, bReplace?
            router.navTo(sName, oParameters, oComponentTargetInfo, bReplace)
            // wait for hashChanged event
            await hashChangedPromise
            return {
                status: 0,
                result: window.compareVersions.compare("1.75.0", sap.ui.version, ">")
                    ? hashChanger.getHash()
                    : hashChanger.hash
            }
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
