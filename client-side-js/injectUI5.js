async function clientSide_injectUI5(config, waitForUI5Timeout) {
    return await browser.executeAsync((waitForUI5Timeout, done) => {
        if (window.bridge) {
            // setup sap testing already done
            done(true)
        }

        if (!window.sap || !window.sap.ui) {
            // setup sap testing already cant be done due to sap namespace not present on the page
            console.error("[browser wdi5] ERR: no ui5 present on page")

            // only condition where to cancel the setup process
            done(false)
        }

        // attach the function to be able to use the extracted method later
        if (!window.bridge) {
            // create empty
            window.wdi5 = {
                createMatcher: null,
                isInitialized: false,
                Log: null,
                waitForUI5Options: {
                    timeout: waitForUI5Timeout,
                    interval: 400
                }
            }

            // load UI5 logger
            sap.ui.require(["sap/base/Log"], (Log) => {
                // Logger is loaded -> can be use internally
                // attach logger to wdi5 to be able to use it globally
                window.wdi5.Log = Log
                window.wdi5.Log.info("[browser wdi5] injected!")
            })

            sap.ui.require(["sap/ui/test/autowaiter/_autoWaiterAsync"], (_autoWaiterAsync) => {
                window.wdi5.waitForUI5 = function (oOptions, callback, errorCallback) {
                    oOptions = oOptions || {}
                    _autoWaiterAsync.extendConfig(oOptions)

                    _autoWaiterAsync.waitAsync(function (sError) {
                        if (sError) {
                            errorCallback(new Error(sError))
                        } else {
                            callback()
                        }
                    })
                }
                window.wdi5.Log.info("[browser wdi5] window._autoWaiterAsync used in waitForUI5 function")
            })

            // attach new bridge
            sap.ui.require(["sap/ui/test/RecordReplay"], (RecordReplay) => {
                window.bridge = RecordReplay
                window.wdi5.Log.info("[browser wdi5] injected!")
                window.wdi5.isInitialized = true

                // here setup is successfull
                // known side effect this call triggers the back to node scope, the other sap.ui.require continue to run in background in browser scope
                done(true)
            })

            // make sure the resources are required
            // TODO: "sap/ui/test/matchers/Sibling",
            sap.ui.require(
                [
                    "sap/ui/test/matchers/BindingPath",
                    "sap/ui/test/matchers/I18NText",
                    "sap/ui/test/matchers/Properties",
                    "sap/ui/test/matchers/Ancestor",
                    "sap/ui/test/matchers/LabelFor",
                    "sap/ui/test/matchers/Descendant",
                    "sap/ui/test/matchers/Interactable"
                ],
                (BindingPath, I18NText, Properties, Ancestor, LabelFor, Descendant, Interactable) => {
                    /**
                     * used to dynamically create new control matchers when searching for elements
                     */
                    window.wdi5.createMatcher = (oSelector) => {
                        // since 1.72.0 the declarative matchers are available. Before that
                        // you had to instantiate the matchers manually
                        const oldAPIVersion = "1.72.0"
                        // check whether we're looking for a control via regex
                        // hint: no IE support here :)
                        if (oSelector.id && oSelector.id.startsWith("/", 0)) {
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
                        if (
                            typeof oSelector.properties?.text === "string" &&
                            oSelector.properties?.text.startsWith("/", 0)
                        ) {
                            const [_, sRegEx, sFlags] = oSelector.properties.text.match(/\/(.*)\/(.*)/)
                            oSelector.properties.text = new RegExp(sRegEx, sFlags)
                        }

                        if (oSelector.bindingPath) {
                            // TODO: for the binding Path there is no object creation
                            // fix (?) for 'leading slash issue' in propertyPath w/ a named model
                            // openui5 issue in github is open
                            const hasNamedModel =
                                oSelector.bindingPath.modelName && oSelector.bindingPath.modelName.length > 0
                            const isRootProperty =
                                oSelector.bindingPath.propertyPath &&
                                oSelector.bindingPath.propertyPath.charAt(0) === "/"
                            if (
                                hasNamedModel &&
                                isRootProperty &&
                                window.compareVersions.compare("1.81.0", sap.ui.version, ">")
                            ) {
                                // attach the double leading /
                                // for UI5 < 1.81
                                oSelector.bindingPath.propertyPath = `/${oSelector.bindingPath.propertyPath}`
                            }
                        }
                        if (window.compareVersions.compare(oldAPIVersion, sap.ui.version, ">")) {
                            oSelector.matchers = []
                            // for version < 1.72 declarative matchers are not available
                            if (oSelector.bindingPath) {
                                oSelector.matchers.push(new BindingPath(oSelector.bindingPath))
                                delete oSelector.bindingPath
                            }
                            if (oSelector.properties) {
                                oSelector.matchers.push(new Properties(oSelector.properties))
                                delete oSelector.properties
                            }
                            if (oSelector.i18NText) {
                                oSelector.matchers.push(new I18NText(oSelector.i18NText))
                                delete oSelector.i18NText
                            }
                            if (oSelector.labelFor) {
                                oSelector.matchers.push(new LabelFor(oSelector.labelFor))
                                delete oSelector.labelFor
                            }
                            if (oSelector.ancestor) {
                                oSelector.matchers.push(new Ancestor(oSelector.ancestor))
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
                        return jQuery(ui5Control).control(0)
                    }

                    /**
                     * gets a UI5 controls' methods to proxy from browser- to Node.js-runtime
                     *
                     * @param {sap.<lib>.<Control>} control UI5 control
                     * @returns {String[]} UI5 control's method names
                     */
                    window.wdi5.retrieveControlMethods = (control) => {
                        // create keys of all parent prototypes
                        let properties = new Set()
                        let currentObj = control
                        do {
                            Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item))
                        } while ((currentObj = Object.getPrototypeOf(currentObj)))

                        // filter for:
                        // @ts-ignore
                        let controlMethodsToProxy = [...properties.keys()].filter((item) => {
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
                     * replaces circular references in objects
                     * @returns function (key, value)
                     */
                    window.wdi5.circularReplacer = () => {
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
                     * @return {Array} Object
                     */
                    window.wdi5.createControlIdMap = (aControls, controlType = "") => {
                        // the array of UI5 controls need to be mapped (remove circular reference)
                        return aControls.map((element) => {
                            // just use the absolute ID of the control
                            if (controlType === "sap.m.ComboBox" && element.data("InputWithSuggestionsListItem")) {
                                return {
                                    id: element.data("InputWithSuggestionsListItem").getId()
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
                            let item = {
                                id: aControl.getId()
                            }
                            return item
                        } else {
                            console.error("error creating new element by id of control: " + aControl)
                        }
                    }
                }
            )
        }
    }, waitForUI5Timeout)
}

module.exports = {
    clientSide_injectUI5
}
