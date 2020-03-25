// @ts-check

/**
 * make sap/ui/test/RecordReplay accessible via wdio
 * @param {WebdriverIO.BrowserObject} context 
 */
function injectUI5(context) {
    return context.executeAsync(done => {
        if (window.bridge) {
            done()
            return
        }
        if (!window.sap || !window.sap.ui) {
            console.error("[browser wdio-ui5] ERR: no ui5 present on page")
            done()
        }
        sap.ui.require(["sap/ui/test/RecordReplay"], RecordReplay => {
            window.bridge = RecordReplay
            console.log("[browser wdio-ui5] injected!")
            done()
        })
    })
}

/**
 * retrieve a DOM element via UI5 locator
 * @param {sap.ui.test.RecordReplay.ControlSelector} control 
 * @param {WebdriverIO.BrowserObject} context 
 */
function getControl(control, context) {
    const result = context.executeAsync((control, done) => {
        return window.bridge
            .waitForUI5()
            .then(() => {
                console.log("[browser wdio-ui5] locating " + JSON.stringify(control))
                return window.bridge.findDOMElementByControlSelector(control)
            })
            .then(domElement => {
                console.log("[browser wdio-ui5] control located!")
                console.log("[browser wdio-ui5] " + JSON.stringify(domElement))
                done(domElement)
                return domElement
            })
            .catch(error => {
                console.error("[browser wdio-ui5] ERR: ", error)
                done(error)
            })
    }, control)
    console.log(`[node wdio-ui5] ${JSON.stringify(result)}`)
    return result
}

/**
 * get the property value of a UI5 control 
 * @param {WebdriverIO.Element} selector 
 * @param {String} propertyName 
 * @param {WebdriverIO.BrowserObject} context 
 */
function getProperty(selector, propertyName, context) {
    const result = context.executeAsync(
        (selector, propertyName, done) => {
            return window.bridge.waitForUI5().then(() => {
                let oControl = jQuery(selector).control(0)
                let sProperty = ""
                switch (propertyName) {
                    case "id":
                        sProperty = oControl.getId()
                        break

                    default:
                        sProperty = oControl.getProperty(propertyName)
                        break
                }
                done(sProperty)
            })
        },
        selector,
        propertyName
    )
    return result
}

/**
 * use wdio's hooks for setting up custom commands in the `$context.ui5` namespace
 * @param {WebdriverIO.BrowserObject} context 
 */
function setup(context) {
    context.ui5 = context // copy wdio's capabilites on $context object
    // regular wdio hook
    // -> locate a ui5 control
    context.ui5.addCommand("getControl", selector => {
        return getControl(selector, context)
    })
    // regular wdio hook
    // -> get the property of a ui5 control
    // only used internally via .asControl() facade
    context.ui5.addCommand("_getProperty", async (ui5control, property) => {
        const ui5controlProperty = await getProperty(ui5control, property, context)
        console.info(`[node wdio-ui5] retrieved property ${property} of wdio-internal element ${ui5control}`)
        return ui5controlProperty
    })

    // facade on a UI5 control
    // to expose certain methods of the UI5 control via wdio
    context.ui5.asControl = control => {
        if(!control.wdio_ui5_key) {
            throw new Error("[node wdio-ui5] ERR: please provide the internal key 'wdio_ui5_key' for the selector")
        }

        // create an internal store of already retrieved UI5 elements
        // in the form of their wdio counterparts
        // for faster subsequent access
        if (!context.ui5._controls) {
            console.info("[node wdio-ui5] creating internal control map")
            context.ui5._controls = {} 
        }
        const internalKey = control.wdio_ui5_key
        if (!context.ui5._controls[internalKey]) {
            const ui5control = context.ui5.getControl(control)
            context.ui5._controls[internalKey] = ui5control
            console.info(`[node wdio-ui5] creating internal control with id ${internalKey}`)
        } else {
            console.info(`[node wdio-ui5] reusing internal control with id ${internalKey}`)
        }

        // expose $context.ui5.asControl($ui5-selector)
        //  .getProperty
        // (._getControl is intended for internal use only)
        return {
            _getControl(control) {
                return context.ui5._controls[control.wdio_ui5_key]
            },
            getProperty(name) {
                const ui5control = this._getControl(control)
                const property = context.ui5._getProperty(ui5control, name)
                return property
            }
        }
    }
}

module.exports = {
    injectUI5,
    getControl,
    getProperty,
    setup
}
