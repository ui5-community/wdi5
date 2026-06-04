const { default: _ui5Service } = require("wdio-ui5-service")
const ui5Service = new _ui5Service()

describe("compareVersions injection", () => {
    beforeEach(async () => {
        // Start fresh every test
        await browser.url("http://localhost:8081/index.html")
    })

    it.skip("should throw error because window.compareVersions doesn't exist", async () => {
        // Test only required if the fallback workaround in "wdi5_injectTools" isn't implemented.
        // If "tempDefineAmd" + "window.define.amd = undefined" is in place, ui5Service.injectUI5() won't throw.
        await browser.execute(function () {
            "use strict"
            window.define = window.sap.ui.define
            window.define.amd = true
            window.compareVersions = undefined
        })
        await expect(ui5Service.injectUI5()).rejects.toThrow()
        const result = browser.execute(function () {
            "use strict"
            return window.compareVersions.compare("1.148.0", "1.96.0", ">")
        })
        await expect(result).rejects.toThrow("TypeError: Cannot read properties of undefined (reading 'compare')")
    })

    it("should have window.compareVersions and window.define.amd available after injecting UI5", async () => {
        await browser.execute(function () {
            "use strict"
            window.define = window.sap.ui.define
            window.define.amd = true
            window.compareVersions = undefined
        })
        await expect(ui5Service.injectUI5()).resolves.toBeUndefined()
        const result = await browser.execute(function () {
            "use strict"
            return {
                hasDefine: !!window.define,
                hasDefineAmd: !!window.define.amd,
                hasCompareVersion: window.compareVersions.compare("1.148.0", "1.96.0", ">")
            }
        })
        expect(result.hasCompareVersion).toBe(true)
        expect(result.hasDefine).toBe(true)
        expect(result.hasDefineAmd).toBe(true)
    })

    it("should have window.compareVersions available after injecting UI5", async () => {
        await browser.execute(function () {
            "use strict"
            window.compareVersions = undefined
        })
        await expect(ui5Service.injectUI5()).resolves.toBeUndefined()
        const result = await browser.execute(function () {
            "use strict"
            return {
                hasDefine: window.define,
                hasDefineAmd: window.define?.amd,
                hasCompareVersion: window.compareVersions.compare("1.148.0", "1.96.0", ">")
            }
        })
        expect(result.hasCompareVersion).toBe(true)
        expect(result.hasDefine).toBeUndefined()
        expect(result.hasDefineAmd).toBeUndefined()
    })

    it("should have window.compareVersions available by default due to browser.addInitScript()", async () => {
        const result = await browser.execute(function () {
            "use strict"
            return {
                hasDefine: window.define,
                hasDefineAmd: window.define?.amd,
                hasCompareVersion: window.compareVersions.compare("1.148.0", "1.96.0", ">")
            }
        })
        expect(result.hasCompareVersion).toBe(true)
        expect(result.hasDefine).toBeUndefined()
        expect(result.hasDefineAmd).toBeUndefined()
    })
})
