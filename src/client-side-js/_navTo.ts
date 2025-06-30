import type RecordReplay from "sap/ui/test/RecordReplay"

async function clientSide__navTo(
    sComponentId: string,
    sName: string,
    oParameters: any,
    oComponentTargetInfo: any,
    bReplace: boolean,
    browserInstance: WebdriverIO.Browser
) {
    return await browserInstance.execute(
        async (sComponentId, sName, oParameters, oComponentTargetInfo, bReplace) => {
            try {
                await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
            } catch (error) {
                return window.wdi5.errorHandling(error)
            }

            window.wdi5.Log.info(`[browser wdi5] navigation to ${sName} triggered`)

            // TODO: get rid of deprectaed function
            // @ts-expect-error: Property 'getRouter' does not exist on type 'Component'
            const router = sap.ui.getCore().getComponent(sComponentId).getRouter()
            const hashChanger = window.compareVersions.compare("1.75.0", sap.ui.version, ">")
                ? // @ts-expect-error: Property 'core' does not exist on type 'typeof ui'
                  sap.ui.core.routing.HashChanger.getInstance()
                : router.getHashChanger()

            // create hashChanged promise
            const hashChangedPromise = new Promise<void>((resolve) => {
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
export { clientSide__navTo }
