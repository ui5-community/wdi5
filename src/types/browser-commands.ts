import Control from "sap/ui/core/Control"
import { wdi5Selector } from "./wdi5.types"
import { WDI5Control } from "../lib/wdi5-control"

/**
 * wdi5 control cache aka
 * wdi5 keeping score of already retrieved UI5 controls
 */
type cachedControl = {
    [key: string]: Control
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace WebdriverIO {
        export interface Browser {
            asControl: <T extends Control = Control>(arg: wdi5Selector) => Promise<WDI5Control & T>
            allControls: <T extends Control = Control>(arg: wdi5Selector) => Promise<(WDI5Control & T)[]>
            screenshot: (arg: string) => Promise<void>
            goTo: (arg: string | object) => Promise<void>
            /**
             * adding the wdi5 control cache to the global browser object
             */
            _controls: cachedControl[]

            getUI5Version: () => Promise<string>
        }

        // interface MultiRemoteBrowser {
        //     browserCustomCommand: (arg: any) => Promise<void>
        // }

        // interface Element {
        //     elementCustomCommand: (arg: any) => Promise<number>
        // }
    }
}
