import Authenticator from "./Authenticator.js"
import { BasicAuthAuthenticator as BasicAuthenticatorType } from "../../types/wdi5.types"

class BasicAuthenticator extends Authenticator {
    private options

    constructor(options: BasicAuthenticatorType, browserInstanceName) {
        super(browserInstanceName)
        this.options = options
    }
    async login() {
        const baseUrl = await this.browserInstance.config.baseUrl
        if (!this.options.basicAuthUrl || this.options.basicAuthUrl.length === 0) {
            // Authentication with baseUrl
            const matches = await baseUrl.match(/(\w*:?\/\/)(.+)/)
            const basicAuthUrl = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]
            await this.browserInstance.url(basicAuthUrl)
        } else {
            // Authentication with basicAuthUrl from BasicAuth
            for (const basicAuthUrlConfig of this.options.basicAuthUrl) {
                const matches = basicAuthUrlConfig.match(/(\w*:?\/\/)(.+)/)
                const basicAuthUrl = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]
                await this.browserInstance.url(basicAuthUrl)
            }
        }
        // trick 17
        await this.browserInstance.url(baseUrl)
    }
}

export default BasicAuthenticator
