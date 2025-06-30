import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { getFilename } from "cross-dirname"
const { resolve } = createRequire(getFilename())

async function clientSide_injectTools(browserInstance: WebdriverIO.Browser) {
    const compareVersionsFilename = resolve("compare-versions/lib/umd/index.js")
    const compareVersionsStringfied = await readFile(compareVersionsFilename, "utf-8")
    return await browserInstance.execute((compareVersionsStringfied) => {
        // Injects the compare-versions library into the browser context
        if (window?.compareVersions?.compare) {
            return true
        }
        // eval is bad, but it's coming from a trusted source, it's better than manually copying the code
        eval(compareVersionsStringfied)
        // @ts-expect-error: compareVersions is not defined in the browser context (yet)
        window.compareVersions = compareVersions
        if (!window.compareVersions) {
            throw new Error("compare-versions library could not be injected into the browser context")
        }
        return true
    }, compareVersionsStringfied)
}

export { clientSide_injectTools }
