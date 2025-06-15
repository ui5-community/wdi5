const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")

const _config = {
    specs: [join("..", "webapp", "test", "e2e", "**/*.test.js")],
    exclude: [
        join("..", "webapp", "test", "e2e", "ui5-late.test.js"),
        join("..", "webapp", "test", "e2e", "multiremote.test.js")
    ],
    baseUrl: "http://localhost:8888"
}

exports.config = { ...baseConfig, ..._config }
