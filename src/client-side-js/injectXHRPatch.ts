import type { wdi5Config } from "../types/wdi5.types.js"

async function clientSide_injectXHRPatch(wdi5Config: wdi5Config["wdi5"], browserInstance: WebdriverIO.Browser) {
    const version = await browserInstance.getUI5Version()
    return await browserInstance.execute(
        async function wdi5_injectXHRPatch(wdi5Config, ui5Version) {
            const originalFetch = window.fetch

            const ignoreAutoWaitUrls = wdi5Config.ignoreAutoWaitUrls
            function checkURL(url) {
                return ignoreAutoWaitUrls?.map((regex) => new RegExp(regex))?.some((regex) => url.match(regex)) || false
            }
            const imports = ["sap/ui/thirdparty/sinon", "sap/ui/test/autowaiter/_XHRWaiter"]
            if (window.compareVersions.compare(ui5Version, "1.114.0", ">")) {
                imports.push("sap/ui/test/autowaiter/_fetchWaiter")
            }

            //Load the XHRWaiter before our overwrite so we are called first
            return await new Promise((resolve, reject) => {
                sap.ui.require(
                    imports,
                    function (sinon, _XHRWaiter, _fetchWaiter) {
                        // Hook into XHR open for sinon XHRs
                        const fnOriginalFakeOpen = sinon.FakeXMLHttpRequest.prototype.open
                        sinon.FakeXMLHttpRequest.prototype.open = function () {
                            // eslint-disable-next-line prefer-rest-params
                            return fnOriginalFakeOpen.apply(this, hooktoXHROpen.apply(this, arguments))
                        }

                        // Hook into XHR open for regular XHRs
                        const fnOriginalOpen = XMLHttpRequest.prototype.open
                        XMLHttpRequest.prototype.open = function () {
                            // eslint-disable-next-line prefer-rest-params
                            return fnOriginalOpen.apply(this, hooktoXHROpen.apply(this, arguments))
                        }

                        function hooktoXHROpen(method, url) {
                            //The ignore property will force the OPA5 _XHRWaiter to ignore certain calls for auto waiting
                            //https://github.com/SAP/openui5/blob/45e49887f632d0a8a8ef195bd3edf10eb0be9015/src/sap.ui.core/src/sap/ui/test/autowaiter/_XHRWaiter.js
                            //This ist the XHR request instance so setting it here will only affect the specific request
                            this.ignored = checkURL(url)
                            // eslint-disable-next-line prefer-rest-params
                            return arguments
                        }
                        if (_fetchWaiter !== undefined) {
                            const sapFetch = window.fetch

                            window.fetch = function (resource) {
                                // @ts-expect-error: Property 'url' does not exist on type 'Request | URL'. Property 'url' does not exist on type 'URL'
                                const url = typeof resource === "object" ? resource.url : resource
                                if (checkURL(url)) {
                                    // eslint-disable-next-line prefer-rest-params
                                    return originalFetch.apply(this, arguments)
                                } else {
                                    // eslint-disable-next-line prefer-rest-params
                                    return sapFetch.apply(this, arguments)
                                }
                            }
                        }
                        resolve(true)
                    },
                    reject
                )
            })
        },
        wdi5Config,
        version
    )
}

export { clientSide_injectXHRPatch }
