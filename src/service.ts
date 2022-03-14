import { Capabilities, Services } from "@wdio/types"

import { start, injectUI5, setup, checkForUI5Page } from "./lib/wdi5-bridge"
import { wdi5Config } from "./types/wdi5.types"

import { Logger as _Logger } from "./lib/Logger"
const Logger = _Logger.getInstance()

export default class Service implements Services.ServiceInstance {
    constructor(
        private _options: wdi5Config,
        private _capabilities: Capabilities.RemoteCapability,
        private _config: wdi5Config // an enhanced version of the regular wdio config
    ) {}

    async before(/*capabilities* , specs*/) {
        await start(this._config)
        Logger.info("started")
        await setup(this._config)
        Logger.info("setup complete")
        if (!this._config.wdi5.skipInjectUI5OnStart) {
            await injectUI5(this._config)
        } else {
            Logger.warn("skipped wdi5 injection!")
        }
    }

    /**
     * this is a helper function to late-inject ui5 at test-time
     * it relays the the wdio configuration (set in the .before() hook to the browser.config parameter by wdio)
     * to the injectUI5 function of the actual wdi5-bridge
     */
    async injectUI5() {
        if (await checkForUI5Page()) {
            await injectUI5(browser.config as wdi5Config)
        } else {
            throw new Error("wdi5: no UI5 page/app present to work on :(")
        }
    }
}
