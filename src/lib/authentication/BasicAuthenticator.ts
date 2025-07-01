import type { BasicAuthAuthenticator as BasicAuthenticatorType } from "../../types/wdi5.types.js"
import Authenticator from "./Authenticator.js"

class BasicAuthenticator extends Authenticator {
    private options: BasicAuthenticatorType
    private baseUrl: string

    constructor(options: BasicAuthenticatorType, browserInstanceName: string, baseUrl: string) {
        super(browserInstanceName)
        this.options = options
        this.baseUrl = baseUrl
    }
    async login() {
        const basicAuthUrls = this.options.basicAuthUrls || [this.baseUrl]
        await this.basicAuthLogin(basicAuthUrls)
        this.setIsLoggedIn(true)
    }

    private async basicAuthLogin(basicAuthUrls: string[]) {
        for (const basicAuthUrlsConfig of basicAuthUrls) {
            await this.browserInstance.url(basicAuthUrlsConfig, {
                auth: {
                    user: encodeURIComponent(this.getUsername() || ""),
                    pass: encodeURIComponent(this.getPassword() || "")
                }
            })
        }
    }
}

export default BasicAuthenticator
