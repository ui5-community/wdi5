import Authenticator from "../src/lib/authentication/Authenticator.js"
import { throws } from "node:assert"

describe("base authenticator", function () {
    before(function () {
        globalThis.browser = { isMultiremote: false }
    })

    after(function () {
        globalThis.browser = null
    })

    it("should throw if username is not provided", function () {
        const auth = new Authenticator("fake")
        throws(() => auth.getUsername(), {
            name: /Error/,
            message: /for username is not set/
        })
    })

    it("should throw if password is not provided", function () {
        const auth = new Authenticator("fake")
        throws(() => auth.getPassword(), {
            name: /Error/,
            message: /for password is not set/
        })
    })
})
