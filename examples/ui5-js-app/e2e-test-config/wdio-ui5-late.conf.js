const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    wdi5: {
        skipInjectUI5OnStart: true,
        url: "/js-soft/wdi5/"
    },
    specs: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    baseUrl: "https://github.com"
}

exports.config = merge(baseConfig, _config)
