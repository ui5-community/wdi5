const { baseConfig } = require("./wdio.base.conf")
const { setValue, getValue } = require("@wdio/shared-store-service")
const login = require("./scripts/login")
const selectIdentityProvider = require("./scripts/selectIdentityProvider")

const _config = Object.assign(baseConfig, {
    _before: async function (config, capabilities, browser) {
        "use strict"

        const isWatch = process.argv.includes("--watch")
        const isSpecSpec = process.argv.includes("--spec")
        const loginCountStored = await getValue("login_count") // can return undefined
        const loginCount = loginCountStored ? loginCountStored : 0
        const nrOfTests = isSpecSpec ? 1 : 3

        if ((isWatch && loginCount < nrOfTests) || !isWatch) {
            await setValue("login_count", loginCount + 1)

            const username = process.env.USERNAME
            const password = process.env.PASSWORD

            console.log(`MULTI_IDENT_PROVIDER: ${process.env.MULTI_IDENT_PROVIDER}`)
            if (process.env.MULTI_IDENT_PROVIDER === "true") {
                // multiple ident provider
                await selectIdentityProvider()
            } else {
                console.log("no multi ident provider")
            }

            await login(capabilities, username, password)
        }
    }
})

exports.config = _config
