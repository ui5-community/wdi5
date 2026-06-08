import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { getFilename } from "cross-dirname"
import { Logger } from "../lib/Logger.js"

const { resolve } = createRequire(getFilename())
const logger = Logger.getInstance()

async function getCompareVersionsScript() {
    const compareVersionsFilename = resolve("compare-versions/lib/umd/index.js")
    return await readFile(compareVersionsFilename, "utf-8")
}

/**
 * Injects compare-versions library into the browser context.
 * UI5 may set window.define and window.define.amd, if they're set, compare-versions UMD may fail. Injecting with "addInitScript" fix it.
 * However, we also added "tempDefineAmd" + "window.define.amd = undefined" as a fallback workaround.
 */
function wdi5_injectTools(compareVersionsStringfied) {
    if (window?.compareVersions?.compare) {
        return
    }
    // If browser context is an iframe, we get the library from the parent window. JS eval() doesn't work there.
    if (window?.frameElement?.nodeName === "IFRAME") {
        window.compareVersions = window.parent.compareVersions
    } else {
        // @ts-expect-error: Property 'define' does not exist on type 'Window & typeof globalThis'
        const tempDefineAmd = window.define?.amd
        if (tempDefineAmd) {
            // Set workaround, variable tempDefineAmd holds window.define.amd content before eval()
            // @ts-expect-error: Property 'define' does not exist on type 'Window & typeof globalThis'
            window.define.amd = undefined
        }
        // eval() is bad, but it's coming from a trusted source, it's better than manually copying the code
        eval(compareVersionsStringfied)
        // @ts-expect-error: compareVersions is not defined in the browser context (yet)
        window.compareVersions = compareVersions
        if (tempDefineAmd) {
            // Set workaround, return window.define.amd original content after eval()
            // @ts-expect-error: Property 'define' does not exist on type 'Window & typeof globalThis'
            window.define.amd = tempDefineAmd
        }
    }
    if (!window.compareVersions) {
        throw new Error("compare-versions library could not be injected into the browser context")
    }
}

/**
 * Injects compare-versions with addInitScript to ensure this is included before any other script is executed.
 * It doesn't have any dependencies on UI5, so it's safe to inject it before all.
 */
async function clientSide_injectInitScript(browserInstance: WebdriverIO.Browser) {
    if (browserInstance.isBidi) {
        const compareVersionsStringfied = await getCompareVersionsScript()
        await browserInstance.addInitScript(wdi5_injectTools, compareVersionsStringfied)
    } else {
        logger.warn("WDI5 did not inject tools before starting.")
        logger.warn("The 'browser.addInitScript' command is only supported when using WebDriver Bidi protocol.")
    }
}

/**
 * Injects compare-versions on-demand at any given time
 */
async function clientSide_injectTools(browserInstance: WebdriverIO.Browser) {
    const compareVersionsStringfied = await getCompareVersionsScript()
    return await browserInstance.execute(wdi5_injectTools, compareVersionsStringfied)
}

export { clientSide_injectTools, clientSide_injectInitScript }
