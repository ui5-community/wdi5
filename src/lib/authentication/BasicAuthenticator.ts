import Authenticator from "./Authenticator.js"
import { BasicAuthAuthenticator as BasicAuthenticatorType } from "../../types/wdi5.types"

class BasicAuthenticator extends Authenticator {
    private options: BasicAuthenticatorType
    private baseUrl: string

    constructor(options: BasicAuthenticatorType, browserInstanceName, baseUrl: string) {
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
            const basicAuthUrls = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]
            if (!matches[1] || !matches[2]) {
                throw new Error(`Invalid basicAuthUrls config: ${basicAuthUrlsConfig}`)
            }
            await this.browserInstance.url(basicAuthUrls)
        }
    }
}

export default BasicAuthenticator
