const { join } = require("path")
const { config } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    wdi5: {
        url: "#"
    },
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    baseUrl: "http://localhost:8888"
}

exports.config = merge(config, _config)
