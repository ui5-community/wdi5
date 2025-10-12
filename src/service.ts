import type { Capabilities, Services } from "@wdio/types"
import type { wdi5Capabilities, wdi5Config, wdi5MultiRemoteCapability } from "./types/wdi5.types.js"

import { start, injectUI5, setup, checkForUI5Page, authenticate, initMultiRemoteBrowser } from "./lib/wdi5-bridge.js"
import { Logger as _Logger } from "./lib/Logger.js"
const Logger = _Logger.getInstance()

export default class Service implements Services.ServiceInstance {
    private _options?: wdi5Config // TODO: this is the successor to _config in wdio^8
    private _capabilities?: wdi5Capabilities[] | wdi5MultiRemoteCapability
    private _config?: wdi5Config // an enhanced version of the regular wdio config

    constructor(
        _options?: wdi5Config, // TODO: this is the successor to _config in wdio^8
        _capabilities?: wdi5Capabilities[] | wdi5MultiRemoteCapability,
        _config?: wdi5Config // an enhanced version of the regular wdio config
    ) {
        this._options = _options
        this._capabilities = _capabilities
        this._config = _config
    } // the Service is instantiated by wdio with the capabilities and config passed on to

    async before(
        capabilities: Capabilities.RequestedMultiremoteCapabilities,
        specs: string[],
        browserInstance: WebdriverIO.Browser
    ) {
        // cache config to global for later use
        global.__wdi5Config = this._config
        // if no wdi5 config is available we add it manually
        if (!this._config?.wdi5) {
            this._config.wdi5 = {}
        }

        await start(this._config, browserInstance)
        Logger.info("started")
        await setup(this._config, browserInstance)
        Logger.info("setup complete")

        if (browserInstance.isMultiremote) {
            for (const name of (browserInstance as unknown as WebdriverIO.MultiRemoteBrowser).instances) {
                if (this?._capabilities[name].capabilities["wdi5:authentication"]) {
                    await authenticate(this._capabilities[name].capabilities["wdi5:authentication"], name)
                }

                if (this._config?.wdi5?.skipInjectUI5OnStart) {
                    Logger.warn("skipped wdi5 injection!")
                } else if (this._config?.wdi5?.btpWorkZoneEnablement) {
                    Logger.info("delegating wdi5 injection to WorkZone enablement...")
                    await this.enableBTPWorkZoneStdEdition(browserInstance[name as keyof typeof browserInstance])
                } else {
                    await this.injectUI5(browserInstance[name as keyof typeof browserInstance])
                }
            }
            initMultiRemoteBrowser()
        } else {
            if (this?._capabilities["wdi5:authentication"]) {
                await authenticate(this._capabilities["wdi5:authentication"], "")
            }

            if (this._config?.wdi5?.skipInjectUI5OnStart) {
                Logger.warn("skipped wdi5 injection!")
            } else if (this._config?.wdi5?.btpWorkZoneEnablement) {
                Logger.info("delegating wdi5 injection to WorkZone enablement...")
                await this.enableBTPWorkZoneStdEdition(browserInstance)
            } else {
                await this.injectUI5(browserInstance)
            }
        }
    }

    /**
     * waits until btp's wz std ed iframe containing the target app is available,
     * switches the browser context into the iframe
     * and eventually injects the wdi5 into the target app
     */
    async enableBTPWorkZoneStdEdition(browserInstance: WebdriverIO.Browser) {
        await $("iframe").waitForExist() //> wz only has a single iframe (who's id is also not updated upon subsequent app navigation)

        await browserInstance.switchFrame(null)
        if (this?._config?.wdi5?.skipInjectUI5OnStart) {
            Logger.warn("also skipped wdi5 injection in WorkZone std ed's shell!")
        } else {
            await this.injectUI5(browserInstance)
            Logger.debug("injected wdi5 into the WorkZone std ed's shell!")
        }

        await browserInstance.switchFrame(null)
        if (this?._config?.wdi5?.skipInjectUI5OnStart) {
            Logger.warn("also skipped wdi5 injection in application iframe!")
        } else {
            await this.injectUI5(browserInstance)
            Logger.debug("injected wdi5 into the WorkZone std ed's iframe containing the target app!")
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
            const config = this._config ? this._config : (browserInstance.options as wdi5Config)
            if (!config?.wdi5) {
                //Fetching config from global variable
                config.wdi5 = global.__wdi5Config.wdi5
            }
            await injectUI5(config, browserInstance)
        } else {
            throw new Error("wdi5: no UI5 page/app present to work on :(")
        }
    }
}
