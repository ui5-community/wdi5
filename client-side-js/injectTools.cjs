const { readFile } = require("node:fs/promises")

async function clientSide_injectTools(browserInstance) {
    const filename = require.resolve("../node_modules/compare-versions/lib/umd/index.js")
    const compareVersionsStringfied = await readFile(filename, "utf-8")

    return await browserInstance.execute((compareVersionsStringfied) => {
        // Injects the compare-versions library into the browser context
        if (window.compareVersions) {
            return true
        }
        // eval is bad, but it's coming from a trusted source, it's better than manually copying the code
        eval(compareVersionsStringfied)
        // eslint-disable-next-line no-undef
        window.compareVersions = compareVersions
        if (!window.compareVersions) {
            throw new Error("compare-versions library could not be injected into the browser context")
        }
        return true
    }, compareVersionsStringfied)
}

module.exports = {
    clientSide_injectTools
}
