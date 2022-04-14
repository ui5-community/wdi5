const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")
const login = require("./scripts/login")

const _config = {
    wdi5: {
        url: "#",
        skipInjectUI5OnStart: true
    },
    services: ["chromedriver", "ui5", "shared-store"],
    baseUrl: "https://cockpit.hanatrial.ondemand.com/",
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    bail: 0,
    before: async function (config, capabilities, browser) {
        "use strict"

        const isWatch = process.argv.includes("--watch")
        const isSpecSpec = process.argv.includes("--spec")
        const loginCountStored = await getValue("login_count") // can return undefined
        const loginCount = loginCountStored ? loginCountStored : 0
        const nrOfTests = isSpecSpec ? 1 : 3

        if ((isWatch && loginCount < nrOfTests) || !isWatch) {
            await setValue("login_count", loginCount + 1)

            const username = process.env.username
            const password = process.env.password

            await login(capabilities, username, password)
        }
    }
}

exports.config = merge(baseConfig, _config)
