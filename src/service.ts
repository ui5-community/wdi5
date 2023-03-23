import { Capabilities, Services } from "@wdio/types"
import { MultiRemoteDriver } from "webdriverio/build/multiremote"

import { start, injectUI5, setup, checkForUI5Page, authenticate } from "./lib/wdi5-bridge"
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
        // if no wdi5 config is available we add it manually
        if (!this._config.wdi5) {
            this._config["wdi5"] = {}
        }

        await start(this._config)
        Logger.info("started")
        await setup(this._config)
        Logger.info("setup complete")
        if (browser instanceof MultiRemoteDriver) {
            for (const name of (browser as MultiRemoteDriver).instances) {
                if (this._capabilities[name].capabilities["wdi5:authentication"]) {
                    await authenticate(this._capabilities[name].capabilities["wdi5:authentication"], name)
                }
                if (!this._config.wdi5.skipInjectUI5OnStart) {
                    await this.injectUI5(browser[name])
                } else {
                    Logger.warn("skipped wdi5 injection!")
                }
                if (this._config.wdi5.btpWorkZoneEnablement) {
                    await this.enableBTPWorkZoneStdEdition(browser[name])
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
            if (this._config.wdi5.btpWorkZoneEnablement) {
                await this.enableBTPWorkZoneStdEdition(browser)
            }
        }
    }

    /**
     * waits until btp's wz std ed iframe containing the target app is available,
     * switches the browser context into the iframe
     * and eventually injects the wdi5 into the target app
     */
    async enableBTPWorkZoneStdEdition(browser) {
        await $("iframe").waitForExist() //> wz only has a single iframe (who's id is also not updated upon subsequent app navigation)
        await browser.switchToFrame(0)
        if (this._config.wdi5.skipInjectUI5OnStart) {
            Logger.warn("also skipped wdi5 injection in iframe!")
        } else {
            await this.injectUI5()
        }
        Logger.debug("switched to the WorkZone std ed's iframe containing the target app!")
    }

    /**
     * this is a helper function to late-inject ui5 at test-time
     * it relays the the wdio configuration (set in the .before() hook to the browser.config parameter by wdio)
     * to the injectUI5 function of the actual wdi5-bridge
     */
    async injectUI5(browserInstance = browser) {
        if (await checkForUI5Page(browserInstance)) {
            // depending on the scenario (lateInject, multiRemote) we have to access the config differently
            const config = this._config ? this._config : browserInstance.config
            await injectUI5(config as wdi5Config, browserInstance)
        } else {
            throw new Error("wdi5: no UI5 page/app present to work on :(")
        }
    }
}
