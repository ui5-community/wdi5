import Control from "sap/ui/core/Control"
import { wdi5Selector } from "./wdi5.types"

import WebdriverIO from "webdriverio"

/**
 * wdi5 control cache aka
 * wdi5 keeping score of already retrieved UI5 controls
 */
type cachedControl = {
    [key: string]: Control
}

interface Wdi5Browser extends WebdriverIO.Browser<"async"> {
    asControl: (arg: wdi5Selector) => Promise<any>
    screenshot: (arg: string) => Promise<any>
    goTo: (arg: string | object) => Promise<any>
    /**
     * adding the wdi5 control cache to the global browser object
     */
    _controls: cachedControl[]

    getUI5Version: () => Promise<string>
    getUI5VersionAsFloat: () => Promise<number>
}

export declare const browser: Wdi5Browser
