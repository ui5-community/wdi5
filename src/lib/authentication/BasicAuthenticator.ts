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
        // trick 17 ;)
        // the preload flag of the OData models tries to load the $metadata to early for our authenticators.
        // We have to reload the application to "force" the application to reload the requests after we are authenticated.
        await this.browserInstance.url(this.baseUrl)
    }

    private async basicAuthLogin(basicAuthUrls: string[]) {
        for (const basicAuthUrlsConfig of basicAuthUrls) {
            const matches = basicAuthUrlsConfig.match(/(\w*:?\/\/)(.+)/)
            const username = encodeURIComponent(this.getUsername() || "")
            const password = encodeURIComponent(this.getPassword() || "")
            if (!matches || !matches[1] || !matches[2]) {
                throw new Error(`Invalid basicAuthUrls config: ${basicAuthUrlsConfig}`)
            }
            const basicAuthUrls = matches[1] + username + ":" + password + "@" + matches[2]
            await this.browserInstance.url(basicAuthUrls)
        }
    }
}

export default BasicAuthenticator
