import type Core from "sap/ui/core/Core"
import type Component from "sap/ui/core/Component"
import type HashChanger from "sap/ui/core/routing/HashChanger"
import type { ComponentTargetParameters } from "sap/ui/core/routing/Router"
import type { clientSide_ui5Response } from "../types/wdi5.types.js"

async function clientSide__navTo(
    sComponentId: string,
    sName: string,
    oParameters: ComponentTargetParameters["parameters"],
    oComponentTargetInfo: ComponentTargetParameters["componentTargetInfo"],
    bReplace: boolean,
    browserInstance: WebdriverIO.Browser
): Promise<clientSide_ui5Response> {
    return await browserInstance.execute(
        async function wdi5__navTo(sComponentId, sName, oParameters, oComponentTargetInfo, bReplace) {
            try {
                await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
            } catch (error) {
                return window.wdi5.errorHandling(error)
            }

            window.wdi5.Log.info(`[browser wdi5] navigation to ${sName} triggered`)

            const [CoreRef, ComponentRef, HashChangerRef] = await new Promise<[Core, Component, HashChanger]>(
                (resolve, reject) => {
                    sap.ui.require(
                        ["sap/ui/core/Core", "sap/ui/core/Component", "sap/ui/core/routing/HashChanger"],
                        function (...args: [Core, Component, HashChanger]) {
                            resolve(args)
                        },
                        reject
                    )
                }
            )
            const router = window.compareVersions?.compare(window.wdi5.ui5Version, "1.120.0", ">")
                ? // @ts-expect-error: Property 'getRouter' does not exist on type 'Component'
                  ComponentRef.getComponentById(sComponentId).getRouter()
                : // @ts-expect-error: Property 'getRouter' does not exist on type 'Component'
                  CoreRef.getComponent(sComponentId).getRouter()
            const hashChanger = window.compareVersions?.compare("1.75.0", window.wdi5.ui5Version, ">")
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
                result: window.compareVersions?.compare("1.75.0", window.wdi5.ui5Version, ">")
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
