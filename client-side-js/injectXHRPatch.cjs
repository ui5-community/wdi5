async function clientSide_injectXHRPatch(config, browserInstance) {
    return await browserInstance.executeAsync((config, done) => {
        const originalFetch = window.fetch

        const ignoreAutoWaitUrls = config.wdi5.ignoreAutoWaitUrls
        function checkURL(url) {
            return ignoreAutoWaitUrls?.map((regex) => new RegExp(regex))?.some((regex) => url.match(regex)) || false
        }
        const imports = ["sap/ui/thirdparty/sinon", "sap/ui/test/autowaiter/_XHRWaiter"]
        if (window.compareVersions.compare(sap.ui.version, "1.114.0", ">")) {
            imports.push("sap/ui/test/autowaiter/_fetchWaiter")
        }

        //Load the XHRWaiter before our overwrite so we are called first
        sap.ui.require(imports, function (sinon, _XHRWaiter, _fetchWaiter) {
            // Hook into XHR open for sinon XHRs
            const fnOriginalFakeOpen = sinon.FakeXMLHttpRequest.prototype.open
            sinon.FakeXMLHttpRequest.prototype.open = function () {
                return fnOriginalFakeOpen.apply(this, hooktoXHROpen.apply(this, arguments))
            }

            // Hook into XHR open for regular XHRs
            const fnOriginalOpen = XMLHttpRequest.prototype.open
            XMLHttpRequest.prototype.open = function () {
                return fnOriginalOpen.apply(this, hooktoXHROpen.apply(this, arguments))
            }

            function hooktoXHROpen(method, url, async) {
                //The ignore property will force the OPA5 _XHRWaiter to ignore certain calls for auto waiting
                //https://github.com/SAP/openui5/blob/45e49887f632d0a8a8ef195bd3edf10eb0be9015/src/sap.ui.core/src/sap/ui/test/autowaiter/_XHRWaiter.js
                //This ist the XHR request instance so setting it here will only affect the specific request
                this.ignored = checkURL(url)

                return arguments
            }
            if (_fetchWaiter !== undefined) {
                const sapFetch = window.fetch

                window.fetch = function (resource) {
                    const url = typeof resource === "object" ? resource.url : resource
                    if (checkURL(url)) {
                        return originalFetch.apply(this, arguments)
                    } else {
                        return sapFetch.apply(this, arguments)
                    }
                }
            }
            done(true)
        })
    }, config)
}

module.exports = {
    clientSide_injectXHRPatch
}
