import { isMultiRemote } from "../src/lib/multiRemote.js"
import { strictEqual } from "node:assert"

describe("isMultiRemote", function () {
    for (const flag of ["isMultiremote", "isMultiRemote"]) {
        it(`should detect the ${flag} flag`, function () {
            const browserInstance = { [flag]: true } as unknown as WebdriverIO.MultiRemoteBrowser
            strictEqual(isMultiRemote(browserInstance), true)
        })
    }

    it("should return false when neither flag is present", function () {
        const browserInstance = {} as unknown as WebdriverIO.Browser
        strictEqual(isMultiRemote(browserInstance), false)
    })
})
