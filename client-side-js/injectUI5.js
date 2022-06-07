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
            }
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

        /**
         * gets a UI5 controls' methods to proxy from browser- to Node.js-runtime
         *
         * @param {sap.<lib>.<Control>} control UI5 control
         * @returns {String[]} UI5 control's method names
         */
        window.wdi5.retrieveControlMethods = (control, toDelete) => {
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
                    /* if (toDelete) {
                        delete control[item]
                    } */
                    return true
                }
                return false
            })

            return controlMethodsToProxy
        }

        window.wdi5.createSerializeableCopy = (object) => {
            let newObject = null

            try {
                newObject = window.wdi5._deepClone(object)
            } catch (e) {
                console.warn("deep clone failed: " + e)
                newObject = object
            }

            // object, replacer function
            // create usefull content from object
            while (window.wdi5._isCyclic(newObject)) {
                newObject = JSON.parse(
                    JSON.stringify(window.wdi5._removeCyclic(newObject), window.wdi5._getCircularReplacer())
                )
            }
            return newObject
        }

        window.wdi5._deepCloneObject = (object) => {
            let properties = new Set()
            let currentObj = object
            do {
                Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item))
            } while ((currentObj = Object.getPrototypeOf(currentObj)))

            let objectProperties = [...properties.keys()].filter((item) => {
                if (typeof control[item] === "object") {
                    return true
                }
                return false
            })
            return objectProperties
        }

        window.wdi5._deepClone = (obj) => {
            let newObject = {}

            const _deepClone = (obj) => {
                const newPropertyList = Object.keys(obj).map((key) => {
                    if (typeof obj[key] === "function") {
                        // do nothing
                        console.log(`doing nothing due to function ${key}`)
                    } else if (typeof obj[key] === "object") {
                        if (obj[key].hasOwnProperty(key)) {
                            // cyclic do nothing
                            console.log(`doing nothing due to circular reference ${key}`)
                        } else {
                            if (Array.isArray(obj[key])) {
                                newObject[key] = []
                                obj[key].forEach((e) => {
                                    if (window.wdi5.isPrimitive(e)) newObject[key] = e
                                })
                            } else {
                                console.log(`going level deeper on ${key}`)
                                _deepClone(obj[key])
                            }
                        }
                    } else {
                        // add copy to new object
                        console.log(`adding ${key} to new object`)
                        newObject[key] = JSON.parse(JSON.stringify(obj[key]))
                        return key
                    }
                })
                return newObject
            }

            return _deepClone(obj)
        }

        window.wdi5._removeFuncFromObj = (obj) => {
            Object.keys(obj).map((key) => {
                if (typeof obj[key] === "function") {
                    delete obj[key]
                }
                if (typeof obj[key] === typeof {}) {
                    window.wdi5._removeFuncFromObj(obj[key])
                }
            })
            return obj
        }

        window.wdi5._isCyclic = (obj) => {
            var seenObjects = []

            function detect(obj) {
                if (obj && typeof obj === "object") {
                    if (seenObjects.indexOf(obj) !== -1) {
                        return true
                    }
                    seenObjects.push(obj)
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key) && detect(obj[key])) {
                            console.log(obj, "cycle at " + key)
                            return true
                        }
                    }
                }
                return false
            }

            return detect(obj)
        }

        window.wdi5._removeCyclic = (obj) => {
            var seenObjects = []

            function detect(obj) {
                if (obj && typeof obj === "object") {
                    if (seenObjects.indexOf(obj) !== -1) {
                        return obj
                    }
                    seenObjects.push(obj)
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key) && detect(obj[key])) {
                            // console.log(obj, "cycle at " + key)
                            console.warn(`deleted key: ${key} `)
                            delete obj[key]
                            return obj
                        }
                    }
                } else if (typeof obj === "function") {
                    delete obj
                }
                return obj
            }

            return detect(obj)
        }

        /**
         * used as a replacer function in JSON.stringify
         * removes circular references in an object
         * @returns
         */
        window.wdi5._getCircularReplacer = () => {
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

        window.wdi5.errorHandling = (done, error) => {
            window.wdi5.Log.error("[browser wdi5] ERR: ", error)
            done({ status: 1, messsage: error.toString() })
        }

        // attach the function to be able to use the extracted method later
        if (!window.bridge) {
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
                window.fe_bridge = {} // empty init for fiori elements test api
                window.wdi5.Log.info("[browser wdi5] APIs injected!")
                window.wdi5.isInitialized = true

                // here setup is successful
                // known side effect this call triggers the back to node scope, the other sap.ui.require continue to run in background in browser scope
                done(true)
            })
            // see also /client-side-js/testLibrary.js
            sap.ui.require(
                ["sap/fe/test/ListReport", "sap/fe/test/ObjectPage", "sap/fe/test/Shell"],
                (ListReport, ObjectPage, Shell) => {
                    window.fe_bridge.ListReport = ListReport
                    window.fe_bridge.ObjectPage = ObjectPage
                    window.fe_bridge.Shell = Shell
                    // logs for the FE Testlib responses
                    window.fe_bridge.Log = []
                }
            )
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
                                oSelector.bindingPath.propertyPath = `/ ${oSelector.bindingPath.propertyPath} `
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
                }
            )
        }
    }, waitForUI5Timeout)
}

module.exports = {
    clientSide_injectUI5
}
