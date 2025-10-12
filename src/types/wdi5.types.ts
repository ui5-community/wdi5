import type { Capabilities } from "@wdio/types"
import type Log from "sap/base/Log"
import type RecordReplay from "sap/ui/test/RecordReplay"
import type { $I18NTextSettings } from "sap/ui/test/matchers/I18NText"
import type { $BindingPathSettings } from "sap/ui/test/matchers/BindingPath"
import type { $LabelForSettings } from "sap/ui/test/matchers/LabelFor"
import type { $PropertyStrictEqualsSettings } from "sap/ui/test/matchers/PropertyStrictEquals"
import type { $AggregationLengthEqualsSettings } from "sap/ui/test/matchers/AggregationLengthEquals"
import type { $AggregationFilledSettings } from "sap/ui/test/matchers/AggregationFilled"
import type { $AggregationEmptySettings } from "sap/ui/test/matchers/AggregationEmpty"
import type { $AggregationContainsPropertyEqualSettings } from "sap/ui/test/matchers/AggregationContainsPropertyEqual"
import type { ControlsBaseSelector } from "sap/ui/test/Opa5"
import type { ControlSelector } from "sap/ui/test/RecordReplay"
import type Control from "sap/ui/core/Control"
import type { WDI5Object } from "../lib/wdi5-object.js"

// // copypasta from
// // https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file/65561287#65561287
// type ModifyDeep<A extends AnyObject, B extends DeepPartialAny<A>> = {
//     [K in keyof A]: B[K] extends never ? A[K] : B[K] extends AnyObject ? ModifyDeep<A[K], B[K]> : B[K]
// } & (A extends AnyObject ? Omit<B, keyof A> : A)
// /** Makes each property optional and turns each leaf property into any, allowing for type overrides by narrowing any. */
// type DeepPartialAny<T> = {
//     [P in keyof T]?: T[P] extends AnyObject ? DeepPartialAny<T[P]> : any
// }
// type AnyObject = Record<string, any>
// // -

// // more copypasta
// // https://stackoverflow.com/a/55032655/15273517
// type Modify<T, R> = Omit<T, keyof R> & R
// // -

export type wdi5LogLevel = "silent" | "error" | "verbose"

export interface wdi5Config extends WebdriverIO.Config {
    wdi5?: {
        /** wdi5-specific logging of UI5-related operations */
        logLevel?: wdi5LogLevel
        /**
         * FQDN-suffix to append to `baseUrl` of wdio config,
         * typically "index.html"
         * @example http://localhost:8080/index.html -> "index.html"
         * @example https://ui5.sap.com/anotherIndex.html -> "anotherIndex.html"
         * @deprecated
         */
        url?: string
        /** path relative to the command `wdio` is run from to store screenshots */
        screenshotPath?: string
        /**
         * whether to generally disable/enable screenshots
         */
        screenshotsDisabled?: boolean
        /**
         * late-inject wdi5 <-> UI5 bridge, useful for testing in hybrid non-UI5/UI5 apps
         */
        skipInjectUI5OnStart?: boolean
        /**
         * maximum waiting time while checking for UI5 (control) availability
         */
        waitForUI5Timeout?: number
        /**
         * indicated whether wdi5 operates on an app
         * in a SAP Build Workzone Standard Edition (fka Launchpad) environment
         */
        btpWorkZoneEnablement?: boolean
        /**
         * Regex for XHR/Fetch requests to be ignored by the auto waiter
         * Ideal for long polling as this would result in the waiter waiting forever
         */
        ignoreAutoWaitUrls?: string[]
    }
    // TODO: correct types
    // capabilities: wdi5Capabilities[] | wdi5MultiRemoteCapability
}

export type wdi5Authenticator = BTPAuthenticator | BasicAuthAuthenticator | CustomAuthenticator | Office365Authenticator

/**
 * the "wdi5" prefix is to comply with W3C standards
 */
export type wdi5Capabilities = Capabilities.WithRequestedTestrunnerCapabilities & {
    /**
     * workaround for typing the max instances per capability until
     * that WebdriverIO issue is resolved allowing for extending the typed per-browser capability:
     * https://github.com/webdriverio/webdriverio/pull/11992
     */
    maxInstances?: number // TODO: still required?
    "wdi5:authentication"?: wdi5Authenticator
}
export type wdi5MultiRemoteCapability = Capabilities.WithRequestedTestrunnerCapabilities & {
    [instanceName: string]: wdi5Capabilities
}

export type BaseAuthenticator = {
    provider: string
    usernameSelector?: string
    passwordSelector?: string
    submitSelector?: string
}

export type BTPAuthenticator = BaseAuthenticator & {
    provider: "BTP"
    /**
     * set this, when IAS is in use as custom IdP
     * IAS provides this biometric login option which wdi5 as of now does not support for authentication
     */
    disableBiometricAuthentication?: boolean
    /**
     * set this when `disableBiometricAuthentication` is set to `true`
     * the domain of the custom IdP, e.g. "your-IAS-tenant.accounts.ondemand.com"
     */
    idpDomain?: string
}

export type BasicAuthAuthenticator = BaseAuthenticator & {
    provider: "BasicAuth"
    basicAuthUrls?: Array<string>
}

export type CustomAuthenticator = BaseAuthenticator & {
    provider: "custom"
}

export type Office365Authenticator = BaseAuthenticator & {
    provider: "Office365"
    staySignedIn?: boolean
}

export interface wdi5ControlSelector extends ControlsBaseSelector {
    /**
     * Descendant matcher, {@link sap.ui.test.matchers.Descendant}
     */
    descendant?: any
    /**
     * ID of a control (global or within viewName, if viewName is defined)
     */
    id?: string | RegExp
    bindingPath?: $BindingPathSettings
    i18NText?: $I18NTextSettings
    labelFor?: $LabelForSettings
    /**
     * Properties matcher, {@link sap.ui.test.matchers.Properties}
     */
    properties?: Record<string, unknown>
    propertyStrictEquals?: $PropertyStrictEqualsSettings
    /**
     * Ancestor matcher, {@link sap.ui.test.matchers.Ancestor}
     */
    ancestor?: Record<string, unknown>
    /**
     * Sibling matcher, {@link sap.ui.test.matchers.Sibling}
     */
    sibling?: Record<string, unknown>
    aggregationLengthEquals?: $AggregationLengthEqualsSettings
    aggregationFilled?: $AggregationFilledSettings
    aggregationEmpty?: $AggregationEmptySettings
    aggregationContainsPropertyEqual?: $AggregationContainsPropertyEqualSettings
    /**
     * interaction adapter
     */
    interaction?: "root" | "focus" | "press" | "auto" | { idSuffix: string }
}

export interface wdi5Selector {
    /**
     * optional unique internal key to map and find a control
     * if not provided, wdi5 will calculate a unique key
     */
    wdio_ui5_key?: string
    /**
     * forces the to re-retrieve the control from the browser context,
     * even if it was retrieved previously
     */
    forceSelect?: boolean
    /**
     * OPA5-style selectors from RecordReplay
     */
    selector: wdi5ControlSelector
    /**
     * disables the logging for the selector
     */
    logging?: boolean
    /**
     * skip the waitForUI5 check, only used internally
     */
    _skipWaitForUI5?: boolean
    timeout?: number
}

/**
 * 0 = success
 * 1 = error
 */
export type wdi5StatusCode = 0 | 1

export interface clientSide_ui5Response {
    status: wdi5StatusCode
    result?: any // any method
    message?: string // case of error (status: 1)
    domElement?: WebdriverIO.Element // getControl
    id?: string // getControl
    aProtoFunctions?: Array<string> // getControl
    className?: string // getControl
    returnType?: string // executeControlMethod
    nonCircularResultObject?: any
    uuid?: string // unique sap.ui.base.Object id
    object: WDI5Object
}

export interface clientSide_ui5Object {
    uuid: string
    status: wdi5StatusCode
    aProtoFunctions?: []
    className?: string
    object: WDI5Object
}

/**
 *
 */
export interface wdi5ControlMetadata {
    id?: string // full UI5 control id as it is in DOM
    methods?: string[] // list of UI5 methods attached to wdi5 control
    className?: string // UI5 class name
    $?: Array<string> // list of UwdioI5 methods attached to wdi5 control
    key?: string // wdio_ui_key
}

// yet unused
export interface wdi5Bridge {
    bridge: RecordReplay
    // bridge: RecordReplay & { waitForUI5: () => Promise<undefined | Error> }
    // (this.constructor as typeof Foo)
    fe_bridge: {
        ListReport?: object
        ObjectPage?: object
        Shell?: object
        Log?: string[]
    }
    wdi5: {
        createMatcher: (selector: wdi5ControlSelector) => wdi5ControlSelector
        getUI5CtlForWebObj: (ui5Control: HTMLElement) => Control
        retrieveControlMethods: (ui5Control: Control) => unknown[]
        isPrimitive: (test: any) => boolean
        createControlIdMap: (aControls: Control[], controlType: string) => Record<string, any>
        createControlId: (aControl: Control | Control[]) => { id: string }
        isInitialized: boolean
        ui5Version: string
        Log: Log
        waitForUI5Options: {
            timeout: number
            interval: number
        }
        objectMap: Record<string, Control>
        bWaitStarted: false
        asyncControlRetrievalQueue: []
        saveObject: (object: any) => string
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        exec: (fn: Function, ...args: any[]) => Promise<any>
        collapseObject: (object: any) => any
        getCircularReplacer: () => (key: string, value: any) => any
        removeEmptyElements: (object: any, i?: number) => any
        errorHandling: (error: any, reject?: any) => { status: wdi5StatusCode; message: string }
    }
}

export type ControlSelectorByDOMElementOptions = Parameters<typeof RecordReplay.findControlSelectorByDOMElement>["0"]
export type InteractWithControlOptions = Parameters<typeof RecordReplay.interactWithControl>["0"] & {
    selector: ControlSelector
}

declare global {
    // Patch Window interface to include wdi5Bridge and wdi5
    interface Window {
        bridge: wdi5Bridge["bridge"]
        wdi5: wdi5Bridge["wdi5"]
        fe_bridge: wdi5Bridge["fe_bridge"]
        compareVersions: { compare: (version1: string, version2: string, operator: string) => boolean }
    }

    // Patch SAP namespace to include sap.ui.version
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace sap {
        // eslint-disable-next-line @typescript-eslint/no-namespace
        namespace ui {
            let version: string
        }
    }
}

export type { WDI5Control as wdi5Control } from "../lib/wdi5-control.js"
