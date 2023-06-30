const fsExtra = require("fs-extra")
const path = require("path")
const replace = require("replace-in-file")
const { Launcher, run } = require("@wdio/cli")

// lts versions (> 1.60)
// empty string will get the newest Version which can be a "SNAPSHOT" version
const versions = ["", "1.71", "1.84", "1.96"]

;(async () => {
    for (const version of versions) {
        // create an index.html for bootstrapping per version
        const targetIndex = path.resolve(__dirname, `../webapp/index-${version}.html`)
        const bootstrapSrc = `https://ui5.sap.com/${version}/resources/sap-ui-core.js`
        fsExtra.copySync(path.resolve(__dirname, `../webapp/index.html`), targetIndex)
        const optionsIndex = {
            files: targetIndex,
            from: [/src=\".*\"/, /"sap_horizon"/],
            to: [`src="${bootstrapSrc}"`, "sap_belize"]
        }
        await replace(optionsIndex)
        console.log(`created index-${version}!`)

        // create a wdio/wdi5 config per version
        const targetWdioConf = path.resolve(__dirname, `wdio-wdi5-ui5-${version}.conf.js`)
        fsExtra.copySync(path.resolve(__dirname, "wdio-webserver.conf.js"), targetWdioConf)
        const optionsWdioConf = {
            files: targetWdioConf,
            from: [/8888"/, /specs: \[.*\]/],
            to: [
                `8888/index-${version}"`, // this is only b/c of the "soerver" webserver in use...
                `specs: ["${path.resolve(__dirname, "../webapp/test/e2e/properties-matcher.test.js")}"]`
            ]
        }
        await replace(optionsWdioConf)
        console.log(`created wdio-wdi5-ui5-${version}.conf.js`)

        // run it
        const wdio = new Launcher(targetWdioConf)
        await wdio.run().then((code) => {
            if (code === 1) {
                process.exit(1)
            }
        })
    }
})()
