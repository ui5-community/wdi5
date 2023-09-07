import Authenticator from "./Authenticator.js"
import { BasicAuthAuthenticator as BasicAuthenticatorType } from "../../types/wdi5.types"

class BasicAuthenticator extends Authenticator {
    private options
    private baseUrl

    constructor(options: BasicAuthenticatorType, browserInstanceName, baseUrl: string) {
        super(browserInstanceName)
        this.options = options
        this.baseUrl = baseUrl
    }
    async login() {
        if (!this.options.basicAuthUrl || this.options.basicAuthUrl.length === 0) {
            // Authentication with baseUrl
            const matches = await this.baseUrl.match(/(\w*:?\/\/)(.+)/)
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
        this.setIsLoggedIn(true)
        await this.browserInstance.url(this.baseUrl)
    }
}

export default BasicAuthenticator
