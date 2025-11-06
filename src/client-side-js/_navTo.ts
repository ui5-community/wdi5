import type Core from "sap/ui/core/Core"
import type Component from "sap/ui/core/Component"
import type HashChanger from "sap/ui/core/routing/HashChanger"
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
        async function wdi5__navTo(sComponentId, sName, oParameters, oComponentTargetInfo, bReplace) {
            try {
                await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
            } catch (error) {
                return window.wdi5.errorHandling(error)
            }

            window.wdi5.Log.info(`[browser wdi5] navigation to ${sName} triggered`)

            const [CoreRef, ComponentRef, HashChangerRef] = await new Promise<[Core, Component, HashChanger]>(
                (resolve, reject) => {
                    sap.ui.require(
                        ["sap/ui/core/Core", "sap/ui/core/Component", "sap/ui/core/routing/HashChanger"],
                        function (...args) {
                            // @ts-expect-error: Argument of type 'any[]' is not assignable to parameter of type...
                            resolve(args)
                        },
                        reject
                    )
                }
            )
            const router = window.compareVersions.compare(window.wdi5.ui5Version, "1.120.0", ">")
                ? // @ts-expect-error: Property 'getRouter' does not exist on type 'Component'
                  ComponentRef.getComponentById(sComponentId).getRouter()
                : // @ts-expect-error: Property 'getRouter' does not exist on type 'Component'
                  CoreRef.getComponent(sComponentId).getRouter()
            const hashChanger = window.compareVersions.compare("1.75.0", window.wdi5.ui5Version, ">")
                ? // @ts-expect-error: Property 'core' does not exist on type 'typeof ui'
                  HashChangerRef.getInstance()
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
                result: window.compareVersions.compare("1.75.0", window.wdi5.ui5Version, ">")
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
