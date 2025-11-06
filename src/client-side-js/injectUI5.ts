import type Log from "sap/base/Log"
import type RecordReplay from "sap/ui/test/RecordReplay"
import type Control from "sap/ui/core/Control"
import type BindingPath from "sap/ui/test/matchers/BindingPath"
import type I18NText from "sap/ui/test/matchers/I18NText"
import type Properties from "sap/ui/test/matchers/Properties"
import type Ancestor from "sap/ui/test/matchers/Ancestor"
import type LabelFor from "sap/ui/test/matchers/LabelFor"
import type UI5Element from "sap/ui/core/Element"
import type { LibraryInfo } from "sap/ui/core/Core"
import type VersionInfo from "sap/ui/VersionInfo"

async function clientSide_injectUI5(waitForUI5Timeout: number, browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async function wdi5_injectUI5(waitForUI5Timeout) {
        if (window.bridge) {
            // setup sap testing already done
            return true
        }

        if (!window?.sap?.ui) {
            // setup sap testing already cant be done due to sap namespace not present on the page
            // eslint-disable-next-line no-console
            console.error("[browser wdi5] ERR: no ui5 present on page")

            // only condition where to cancel the setup process
            return false
        }

        // attach the function to be able to use the extracted method later
        if (!window.bridge) {
            // @ts-expect-error: Starting wdi5 object in browser scope
            // create empty
            window.wdi5 = {
                isInitialized: false,
                waitForUI5Options: {
                    timeout: waitForUI5Timeout,
                    interval: 400
                },
                objectMap: {
                    // GUID: {}
                },
                bWaitStarted: false,
                asyncControlRetrievalQueue: [],
                ui5Version: ""
            }

            /**
             *
             * @param {sap.ui.base.Object} object
             * @returns uuid
             */
            window.wdi5.saveObject = (object) => {
                const uuid = crypto.randomUUID()
                window.wdi5.objectMap[uuid] = object
                return uuid
            }

            const [
                LogUi5LocalRef,
                RecordReplayUi5LocalRef,
                ControlUi5LocalRef,
                BindingPathUi5LocalRef,
                I18NTextUi5LocalRef,
                PropertiesUi5LocalRef,
                AncestorUi5LocalRef,
                LabelForUi5LocalRef,
                UI5ElementRef,
                VersionInfo
            ] = await new Promise<
                [
                    Log,
                    RecordReplay,
                    Control,
                    BindingPath,
                    I18NText,
                    Properties,
                    Ancestor,
                    LabelFor,
                    UI5Element,
                    VersionInfo
                ]
            >((resolve, reject) => {
                sap.ui.require(
                    [
                        "sap/base/Log",
                        "sap/ui/test/RecordReplay",
                        "sap/ui/core/Control",
                        "sap/ui/test/matchers/BindingPath",
                        "sap/ui/test/matchers/I18NText",
                        "sap/ui/test/matchers/Properties",
                        "sap/ui/test/matchers/Ancestor",
                        "sap/ui/test/matchers/LabelFor",
                        "sap/ui/core/Element",
                        "sap/ui/VersionInfo"
                    ],
                    function (...args) {
                        // @ts-expect-error: Argument of type 'any[]' is not assignable to parameter of type...
                        resolve(args)
                    },
                    reject
                )
            })
            const versionInfo = (await VersionInfo.load()) as LibraryInfo
            window.wdi5.ui5Version = versionInfo.version

            // Logger is loaded -> can be use internally attach logger to wdi5 to be able to use it globally
            window.wdi5.Log = LogUi5LocalRef
            window.wdi5.Log.info("[browser wdi5] injected!")

            // attach new bridge
            window.bridge = RecordReplayUi5LocalRef
            window.fe_bridge = {} // empty init for fiori elements test api
            window.wdi5.Log.info("[browser wdi5] APIs injected!")
            window.wdi5.isInitialized = true

            // make exec function available on all ui5 controls, so more complex evaluations can be done on browser side for better performance
            // @ts-expect-error: Property 'prototype' does not exist on type 'Control'
            ControlUi5LocalRef.prototype.exec = function (funcToEval, ...args) {
                try {
                    return new Function("return " + funcToEval).apply(this).apply(this, args)
                } catch (error) {
                    return { status: 1, message: error?.toString() }
                }
            }

            /**
             * used to dynamically create new control matchers when searching for elements
             */
            window.wdi5.createMatcher = (oSelector) => {
                // since 1.72.0 the declarative matchers are available. Before that
                // you had to instantiate the matchers manually
                const oldAPIVersion = "1.72.0"
                // check whether we're looking for a control via regex
                // hint: no IE support here :)
                if (oSelector.id && typeof oSelector.id === "string" && oSelector.id.startsWith("/", 0)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [sTarget, sRegEx, sFlags] = oSelector.id.match(/\/(.*)\/(.*)/)
                    oSelector.id = new RegExp(sRegEx, sFlags)
                }

                // match a regular regex as (partial) matcher
                // properties: {
                //     text: /.*ersi.*/gm
                // }
                // but not a declarative style regex matcher
                // properties: {
                //     text: {
                //         regex: {
                //             source: '.*ersi.*',
                //             flags: 'gm'
                //         }
                //     }
                // }
                if (typeof oSelector.properties?.text === "string" && oSelector.properties?.text.startsWith("/", 0)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_, sRegEx, sFlags] = oSelector.properties.text.match(/\/(.*)\/(.*)/)
                    oSelector.properties.text = new RegExp(sRegEx, sFlags)
                }

                if (oSelector.bindingPath) {
                    // TODO: for the binding Path there is no object creation
                    // fix (?) for 'leading slash issue' in propertyPath w/ a named model
                    // openui5 issue in github is open
                    const hasNamedModel =
                        typeof oSelector?.bindingPath?.modelName === "string" &&
                        oSelector.bindingPath.modelName.length > 0
                    const isRootProperty =
                        typeof oSelector?.bindingPath?.propertyPath === "string" &&
                        oSelector.bindingPath.propertyPath.charAt(0) === "/"
                    if (
                        hasNamedModel &&
                        isRootProperty &&
                        window.compareVersions.compare("1.81.0", window.wdi5.ui5Version, ">")
                    ) {
                        // attach the double leading /
                        // for UI5 < 1.81
                        oSelector.bindingPath.propertyPath = `/${oSelector.bindingPath.propertyPath}`
                    }
                }
                if (window.compareVersions.compare(oldAPIVersion, window.wdi5.ui5Version, ">")) {
                    oSelector.matchers = []
                    // for version < 1.72 declarative matchers are not available
                    if (oSelector.bindingPath) {
                        // @ts-expect-error: This expression is not constructable. Type has no construct signatures
                        oSelector.matchers.push(new BindingPathUi5LocalRef(oSelector.bindingPath))
                        delete oSelector.bindingPath
                    }
                    if (oSelector.properties) {
                        // @ts-expect-error: This expression is not constructable. Type has no construct signatures
                        oSelector.matchers.push(new PropertiesUi5LocalRef(oSelector.properties))
                        delete oSelector.properties
                    }
                    if (oSelector.i18NText) {
                        // @ts-expect-error: This expression is not constructable. Type has no construct signatures
                        oSelector.matchers.push(new I18NTextUi5LocalRef(oSelector.i18NText))
                        delete oSelector.i18NText
                    }
                    if (oSelector.labelFor) {
                        // @ts-expect-error: This expression is not constructable. Type has no construct signatures
                        oSelector.matchers.push(new LabelForUi5LocalRef(oSelector.labelFor))
                        delete oSelector.labelFor
                    }
                    if (oSelector.ancestor) {
                        // @ts-expect-error: This expression is not constructable. Type has no construct signatures
                        oSelector.matchers.push(new AncestorUi5LocalRef(oSelector.ancestor))
                        delete oSelector.ancestor
                    }
                }

                /*
                        oSelector.matchers = []
                        // since for these matcher a constructor call is neccessary
                        if (oSelector.sibling && oSelector.sibling.options) {
                            // don't construct matcher if not needed
                            const options = oSelector.sibling.options
                            delete oSelector.sibling.options
                            oSelector.matchers.push(new Sibling(oSelector.sibling, options))
                            delete oSelector.sibling
                        }
                        if (oSelector.descendant && (typeof oSelector.descendant.bDirect !== 'undefined')) {
                            // don't construct matcher if not needed
                            const bDirect = oSelector.descendant.bDirect
                            delete oSelector.descendant.bDirect
                            oSelector.matchers.push(new Descendant(oSelector.descendant, !!bDirect))
                            delete oSelector.descendant
                        }
                        if (oSelector.ancestor && (typeof oSelector.ancestor.bDirect !== 'undefined')) {
                            // don't construct matcher if not needed
                            const bDirect = oSelector.ancestor.bDirect
                            delete oSelector.ancestor.bDirect
                            oSelector.matchers.push(new Ancestor(oSelector.ancestor, !!bDirect))
                            delete oSelector.ancestor
                        }

                        */
                return oSelector
            }

            /**
             * extract the multi use function to get a UI5 Control from a JSON Webobejct
             */
            window.wdi5.getUI5CtlForWebObj = (ui5Control) => {
                if (window.compareVersions.compare(window.wdi5.ui5Version, "1.108.0", ">")) {
                    // @ts-expect-error: Property 'closestTo' does not exist on type 'UI5Element'. Did you mean to access the static member 'UI5Element.closestTo' instead?
                    return UI5ElementRef.closestTo(ui5Control)
                } else {
                    return jQuery(ui5Control).control(0)
                }
            }

            /**
             * gets a UI5 controls' methods to proxy from browser- to Node.js-runtime
             *
             * @param {sap.<lib>.<Control>} control UI5 control
             * @returns {String[]} UI5 control's method names
             */
            window.wdi5.retrieveControlMethods = (control) => {
                // create keys of all parent prototypes
                const properties = new Set()
                let currentObj = control
                do {
                    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item))
                } while ((currentObj = Object.getPrototypeOf(currentObj)))

                // filter for:
                const controlMethodsToProxy = [...properties.keys()].filter((item: string) => {
                    if (typeof control[item] === "function") {
                        // function

                        // filter private methods
                        if (item.startsWith("_")) {
                            return false
                        }

                        if (item.indexOf("Render") !== -1) {
                            return false
                        }

                        // filter not working methods
                        // and those with a specific api from wdi5/wdio-ui5-service
                        // prevent overwriting wdi5-control's own init method
                        const aFilterFunctions = ["$", "getAggregation", "constructor", "fireEvent", "init"]

                        if (aFilterFunctions.includes(item)) {
                            return false
                        }

                        // if not already discarded -> should be in the result
                        return true
                    }
                    return false
                })

                return controlMethodsToProxy
            }

            /**
             * flatten all functions and properties on the Prototype directly into the returned object
             * @param {object} obj
             * @returns {object} all functions and properties of the inheritance chain in a flat structure
             */
            window.wdi5.collapseObject = (obj) => {
                const protoChain = []
                let proto = obj
                while (proto !== null) {
                    protoChain.unshift(proto)
                    proto = Object.getPrototypeOf(proto)
                }
                const collapsedObj = {}
                protoChain.forEach((prop) => Object.assign(collapsedObj, prop))
                return collapsedObj
            }

            /**
             * used as a replacer function in JSON.stringify
             * removes circular references in an object
             * all credit to https://bobbyhadz.com/blog/javascript-typeerror-converting-circular-structure-to-json
             */
            window.wdi5.getCircularReplacer = () => {
                const seen = new WeakSet()
                return (key, value) => {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) {
                            return
                        }
                        seen.add(value)
                    }
                    return value
                }
            }

            /**
             * removes all empty collection members from an object,
             * e.g. empty, null, or undefined array elements
             *
             * @param {object} obj
             * @returns {object} obj without empty collection members
             */
            window.wdi5.removeEmptyElements = (obj, i = 0) => {
                for (const key in obj) {
                    if (obj[key] === null || key.startsWith("_")) {
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete obj[key]
                    } else if (Array.isArray(obj[key])) {
                        obj[key] = obj[key].filter(
                            (element) =>
                                element !== null &&
                                element !== undefined &&
                                element !== "" &&
                                Object.keys(element).length > 0
                        )
                        if (obj[key].length > 0) {
                            i++
                            window.wdi5.removeEmptyElements(obj[key], i)
                        }
                    } else if (typeof obj[key] === "object") {
                        i++
                        window.wdi5.removeEmptyElements(obj[key], i)
                    }
                }
                return obj
            }
            /**
             * if parameter is JS primitive type
             * returns {boolean}
             * @param {*} test
             */
            window.wdi5.isPrimitive = (test) => {
                return test !== Object(test)
            }

            /**
             * creates a array of objects containing their id as a property
             * @param {[sap.ui.core.Control]} aControls
             * @throws {Error} error if the aggregation was not found that has to be catched
             * @return {Array} Object
             */
            window.wdi5.createControlIdMap = (aControls, controlType = "") => {
                // the array of UI5 controls need to be mapped (remove circular reference)
                if (!aControls) {
                    throw new Error("Aggregation was not found!")
                }
                return aControls.map((element) => {
                    // just use the absolute ID of the control
                    if (
                        (controlType === "sap.m.ComboBox" || controlType === "sap.m.MultiComboBox") &&
                        element.data("InputWithSuggestionsListItem")
                    ) {
                        return {
                            id: element.data("InputWithSuggestionsListItem").getId()
                        }
                    } else if (controlType === "sap.m.PlanningCalendar") {
                        return {
                            id: `${element.getId()}-CLI`
                        }
                    } else {
                        return {
                            id: element.getId()
                        }
                    }
                })
            }

            /**
             * creates an object containing their id as a property
             * @param {sap.ui.core.Control} aControl
             * @return {Object} Object
             */
            window.wdi5.createControlId = (aControl) => {
                // the array of UI5 controls need to be mapped (remove circular reference)
                if (!Array.isArray(aControl)) {
                    // if in aControls is a single control -> create an array first

                    // this is causes by sap.ui.base.ManagedObject -> get Aggregation defines its return value as:
                    // sap.ui.base.ManagedObject or sap.ui.base.ManagedObject[] or null

                    // aControls = [aControls]
                    return {
                        id: aControl.getId()
                    }
                } else {
                    // eslint-disable-next-line no-console
                    console.error("error creating new element by id of control: " + aControl)
                }
            }

            window.wdi5.errorHandling = (error, reject) => {
                window.wdi5.Log.error("[browser wdi5] ERR: ", error)
                // obsolete when fully migrated to the v9 support
                if (reject) {
                    reject({ status: 1, message: error.toString() })
                } else {
                    return { status: 1, message: error.toString() }
                }
            }

            return true
        }
    }, waitForUI5Timeout)
}

export { clientSide_injectUI5 }
