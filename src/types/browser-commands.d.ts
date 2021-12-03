import Control from "sap/ui/core/Control"
import { wdi5Selector } from "./wdi5.types"

/**
 * wdi5 control cache aka
 * wdi5 keeping score of already retrieved UI5 controls
 */
type cachedControl = {
    [key: string]: Control
}
declare global {
    namespace WebdriverIO {
        interface Browser {
            asControl: (arg: wdi5Selector) => Promise<any>
            /**
             * adding the wdi5 control cache to the global browser object
             */
            _controls: cachedControl[]
        }

        // interface MultiRemoteBrowser {
        //     browserCustomCommand: (arg: any) => Promise<void>
        // }

        // interface Element {
        //     elementCustomCommand: (arg: any) => Promise<number>
        // }
    }
}
