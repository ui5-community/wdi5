import CustomAuthenticator from "../src/lib/authentication/CustomAuthenticator"
import { ok, throws } from "assert"

describe("custom auth", () => {
    it("should successfully inject a custom authentiator", () => {
        globalThis.browser = { dummy: true }

        const Auth = new CustomAuthenticator(
            {
                provider: "custom",
                usernameSelector: "#user",
                passwordSelector: "#passwd",
                submitSelector: "#submit"
            },
            {
                dummy: true
            }
        )
        ok(Auth instanceof CustomAuthenticator)
    })

    it("should throw if not all custom auth options are provided", () => {
        const configs = [
            {
                provider: "custom",
                passwordSelector: "#passwd",
                submitSelector: "#submit"
            },
            {
                provider: "custom",
                usernameSelector: "#user",
                submitSelector: "#submit"
            },
            {
                provider: "custom",
                usernameSelector: "#user",
                passwordSelector: "#passwd"
            }
        ]
        for (const config of configs) {
            // @ts-expect-error we're deliberately testing for invalid configs
            throws(() => new CustomAuthenticator(config, { dummy: true }), {
                name: /Error/,
                message: /all options must be provided/
            })
        }
    })
})
