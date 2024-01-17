async function clientSide_injectUI5(config, waitForUI5Timeout, browserInstance) {
    return await browserInstance.executeAsync((waitForUI5Timeout, done) => {
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
                },
                objectMap: {
                    // GUID: {}
                },
                bWaitStarted: false,
                asyncControlRetrievalQueue: []
            }

            /**
             *
             * @param {sap.ui.base.Object} object
             * @returns uuid
             */
            window.wdi5.saveObject = (object) => {
                // This is a manual replacement for crypto.randomUUID()
                // until it is only available in secure contexts.
                // See https://github.com/WICG/uuid/issues/23
                const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
                    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
                )
                window.wdi5.objectMap[uuid] = object
                return uuid
            }

            // load UI5 logger
            sap.ui.require(["sap/base/Log"], (Log) => {
                // Logger is loaded -> can be use internally
                // attach logger to wdi5 to be able to use it globally
                window.wdi5.Log = console
                window.wdi5.Log.info("[browser wdi5] injected!")
            })

            sap.ui.require(["sap/ui/test/autowaiter/_autoWaiterAsync"], (_autoWaiterAsync) => {
                window.wdi5.waitForUI5 = function (oOptions, callback, errorCallback) {
                    oOptions = oOptions || {}
                    _autoWaiterAsync.extendConfig(oOptions)

                    const startWaiting = function () {
                        window.wdi5.bWaitStarted = true
                        _autoWaiterAsync.waitAsync(function (sError) {
                            const nextWaitAsync = window.wdi5.asyncControlRetrievalQueue.shift()
                            if (nextWaitAsync) {
                                setTimeout(nextWaitAsync) //use setTimeout to postpone execution to the next event cycle, so that bWaitStarted in the UI5 _autoWaiterAsync is also set to false first
                            } else {
                                window.wdi5.bWaitStarted = false
                            }
                            if (sError) {
                                errorCallback(new Error(sError))
                            } else {
                                if (callback.constructor.name === "AsyncFunction") {
                                    callback().catch(errorCallback)
                                } else {
                                    try {
                                        callback()
                                    } catch (e) {
                                        errorCallback(e)
                                    }
                                }
                            }
                        })
                    }
                    if (!window.wdi5.bWaitStarted) {
                        startWaiting()
                    } else {
                        window.wdi5.asyncControlRetrievalQueue.push(startWaiting)
                    }
                }
                window.wdi5.Log.info("[browser wdi5] window._autoWaiterAsync used in waitForUI5 function")
            })

            // attach new bridge
            sap.ui.require(["sap/ui/test/RecordReplay"], (RecordReplay) => {
                window.bridge = RecordReplay
                window.fe_bridge = {} // empty init for fiori elements test api
                window.wdi5.Log.info("[browser wdi5] APIs injected!")
                window.wdi5.isInitialized = true

                // here setup is successful
                // known side effect this call triggers the back to node scope, the other sap.ui.require continue to run in background in browser scope
                done(true)
            })

            // make exec function available on all ui5 controls, so more complex evaluations can be done on browser side for better performance
            sap.ui.require(["sap/ui/core/Control"], (Control) => {
                Control.prototype.exec = function (funcToEval, ...args) {
                    try {
                        return new Function("return " + funcToEval).apply(this).apply(this, args)
                    } catch (error) {
                        return { status: 1, message: error.toString() }
                    }
                }
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
                        //> REVISIT: refactor to https://ui5.sap.com/#/api/sap.ui.core.Element%23methods/sap.ui.core.Element.closestTo for UI5 >= 1.106
                        return jQuery(ui5Control).control(0)
                    }

                    window.wdi5.retrieveControlMethodsAndFlatenObject = (contol) => {
                        let protoChain = []
                        let proto = contol
                        while (proto !== null) {
                            protoChain.unshift(proto)
                            proto = Object.getPrototypeOf(proto)
                        }
                        let collapsedObj = {}
                        const functionNames = new Set()
                        const objectNames = new Set()
                        for (let i = 0; i < protoChain.length; i++) {
                            const prop = protoChain[i]
                            const propertyNames = Object.getOwnPropertyNames(prop)

                            for (let j = 0; j < propertyNames.length; j++) {
                                const propertyName = propertyNames[j]
                                const value = prop[propertyName]

                                if (propertyName.startsWith("_")) {
                                    continue
                                }
                                if (typeof value === "object") {
                                    objectNames.add(propertyName)
                                    continue
                                }

                                collapsedObj[propertyName] = value

                                // filter not working methods
                                // and those with a specific api from wdi5/wdio-ui5-service
                                // prevent overwriting wdi5-control's own init method
                                const aFilterFunctions = ["$", "getAggregation", "constructor", "fireEvent", "init"]
                                if (
                                    typeof value === "function" &&
                                    !propertyName.indexOf("Render") !== -1 &&
                                    !aFilterFunctions.includes(propertyName)
                                ) {
                                    functionNames.add(propertyName)
                                }
                            }
                        }
                        return {
                            collapsedObj,
                            functionNames: Array.from(functionNames),
                            objectNames: Array.from(objectNames)
                        }
                    }

                    window.wdi5.prepareObjectForSerialization = (object, skipSave) => {
                        let uuid
                        if (!skipSave) {
                            // save before manipulate
                            uuid = window.wdi5.saveObject(object)
                        }

                        let {
                            collapsedObj,
                            functionNames: aProtoFunctions,
                            objectNames
                        } = window.wdi5.retrieveControlMethodsAndFlatenObject(object)

                        return {
                            semanticCleanedElements: collapsedObj,
                            uuid,
                            aProtoFunctions,
                            objectNames
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
                            let item = {
                                id: aControl.getId()
                            }
                            return item
                        } else {
                            console.error("error creating new element by id of control: " + aControl)
                        }
                    }

                    window.wdi5.errorHandling = (done, error) => {
                        window.wdi5.Log.error("[browser wdi5] ERR: ", error)
                        done({ status: 1, message: error.toString() })
                    }
                }
            )
        }
    }, waitForUI5Timeout)
}

module.exports = {
    clientSide_injectUI5
}
