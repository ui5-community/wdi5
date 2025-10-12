import { baseConfig } from "./wdio.base.conf.js"
import { join } from "node:path"

// avoid multiple chrome sessions
baseConfig.capabilities = null

const _config = {
    wdi5: {
        screenshotPath: join("report", "screenshots")
    },
    maxInstances: 1,
    capabilities: {
        one: {
            capabilities: {
                browserName: "chrome",
                browserVersion: "stable",
                acceptInsecureCerts: true,
                "goog:chromeOptions": {
                    args: process.argv.includes("--headless")
                        ? ["window-size=1440,800", "headless", "disable-gpu"]
                        : process.argv.includes("--debug")
                          ? ["window-size=1920,1280", "auto-open-devtools-for-tabs"]
                          : ["window-size=1440,800"]
                }
            }
        },
        two: {
            capabilities: {
                browserName: "chrome",
                browserVersion: "stable",
                acceptInsecureCerts: true,
                "goog:chromeOptions": {
                    args: process.argv.includes("--headless")
                        ? ["window-size=1440,800", "headless", "disable-gpu"]
                        : process.argv.includes("--debug")
                          ? ["window-size=1920,1280", "auto-open-devtools-for-tabs"]
                          : ["window-size=1440,800"]
                }
            }
        }
    },
    specs: ["e2e/multiremote.test.js"]
}

export const config = { ...baseConfig, ..._config }
