import { Capabilities, Services } from "@wdio/types"
import { MultiRemoteBrowser } from "webdriverio"

import { start, injectUI5, setup, checkForUI5Page, authenticate } from "./lib/wdi5-bridge.js"
import { wdi5Config } from "./types/wdi5.types"

import { Logger as _Logger } from "./lib/Logger.js"
const Logger = _Logger.getInstance()

export default class Service implements Services.ServiceInstance {
    constructor(
        private _options?: wdi5Config, // TODO: this is the successor to _config in wdio^8
        private _capabilities?: Capabilities.RemoteCapability,
        private _config?: wdi5Config // an enhanced version of the regular wdio config
    ) {} // the Service is instantiated by wdio with the capabilites and config passed on to

    async before(/*capabilities* , specs*/) {
        Logger.error("just a test from a fork again and again and again and again")

        // if no wdi5 config is available we add it manually
        if (!this._config.wdi5) {
            this._config["wdi5"] = {}
        }

        await start(this._config)
        Logger.info("started")
        await setup(this._config)
        Logger.info("setup complete")

        // align browser script timeout with wdi5 setting (+ leverage)
        // this mostly affects browser.executeAsync()
        const timeout = (this._config["wdi5"]["waitForUI5Timeout"] || 15000) + 5000
        await browser.setTimeout({ script: timeout })

        Logger.debug(`browser script timeout set to ${timeout}`)
        if (typeof browser.getTimeouts === "function") {
            Logger.debug(`browser timeouts are ${JSON.stringify(await browser.getTimeouts(), null, 2)}`)
        }

        if (browser.isMultiremote) {
            for (const name of (browser as unknown as MultiRemoteBrowser).instances) {
                if (this._capabilities[name].capabilities["wdi5:authentication"]) {
                    await authenticate(this._capabilities[name].capabilities["wdi5:authentication"], name)
                }
                if (!this._config.wdi5.skipInjectUI5OnStart) {
                    await this.injectUI5(browser[name])
                } else {
                    Logger.warn("skipped wdi5 injection!")
                }
            }
        } else {
            if (this._capabilities["wdi5:authentication"]) {
                await authenticate(this._capabilities["wdi5:authentication"])
            }
            if (!this._config.wdi5.skipInjectUI5OnStart) {
                await this.injectUI5(browser)
            } else {
                Logger.warn("skipped wdi5 injection!")
            }
        }
    }

    /**
     * this is a helper function to late-inject ui5 at test-time
     * it relays the the wdio configuration (set in the .before() hook to the browser.options parameter by wdio)
     * to the injectUI5 function of the actual wdi5-bridge
     */
    async injectUI5(browserInstance = browser) {
        if (await checkForUI5Page(browserInstance)) {
            // depending on the scenario (lateInject, multiRemote) we have to access the config differently
            const config = this._config ? this._config : browserInstance.options
            await injectUI5(config as wdi5Config, browserInstance)
        } else {
            throw new Error("wdi5: no UI5 page/app present to work on :(")
        }
    }
}
