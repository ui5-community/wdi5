const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    runner: "local",
    path: "/",
    specs: ["webapp/test/e2e/*.test.js"],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome",
            "goog:chromeOptions": {
                w3c: false,
                args: [
                    "--headless",
                    "--no-sandbox",
                    "--whitelisted-ips",
                    "--disable-gpu",
                    "--disable-software-rasterizer",
                    "--disable-dev-shm-usage",
                    "--disable-infobars",
                    "--ignore-ssl-errors=yes",
                    "--ignore-certificate-errors"
                ]
            }
        }
    ],
    wdi5: {
        url: "#"
    },
    baseUrl: "http://localhost:8888"
}

exports.config = merge(baseConfig, _config)
