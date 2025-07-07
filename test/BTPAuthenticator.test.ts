import BTPAuthenticator from "../src/lib/authentication/BTPAuthenticator.js"
import { ok, strictEqual } from "assert"

describe("BTPAuthenticator", () => {
    let mockBrowserInstance: any

    beforeEach(() => {
        mockBrowserInstance = {
            dummy: true,
            setCookies: () => Promise.resolve(),
            $: () => Promise.resolve({ elementId: "test", click: () => Promise.resolve() }),
            getIsLoggedIn: () => Promise.resolve(false)
        }
        globalThis.browser = mockBrowserInstance
    })

    it("should set idpDomainOpt to provided idpDomain value", () => {
        const auth = new BTPAuthenticator(
            {
                provider: "BTP",
                idpDomain: "example.accounts.ondemand.com"
            },
            mockBrowserInstance
        )
        
        strictEqual((auth as any).idpDomainOpt, "example.accounts.ondemand.com")
    })

    it("should set idpDomainOpt to empty string when idpDomain is not provided", () => {
        const auth = new BTPAuthenticator(
            {
                provider: "BTP"
            },
            mockBrowserInstance
        )
        
        strictEqual((auth as any).idpDomainOpt, "")
    })

    it("should set idpDomainOpt to empty string when idpDomain is undefined", () => {
        const auth = new BTPAuthenticator(
            {
                provider: "BTP",
                idpDomain: undefined
            },
            mockBrowserInstance
        )
        
        strictEqual((auth as any).idpDomainOpt, "")
    })

    it("should correctly handle boolean check for idpDomainOpt when it has a value", () => {
        const auth = new BTPAuthenticator(
            {
                provider: "BTP",
                idpDomain: "example.accounts.ondemand.com"
            },
            mockBrowserInstance
        )
        
        // Test that the boolean check would work correctly
        const idpDomainOpt = (auth as any).idpDomainOpt
        ok(!!idpDomainOpt, "idpDomainOpt should be truthy when value is provided")
    })

    it("should correctly handle boolean check for idpDomainOpt when it's empty", () => {
        const auth = new BTPAuthenticator(
            {
                provider: "BTP"
            },
            mockBrowserInstance
        )
        
        // Test that the boolean check would work correctly
        const idpDomainOpt = (auth as any).idpDomainOpt
        ok(!idpDomainOpt, "idpDomainOpt should be falsy when empty string")
    })
})