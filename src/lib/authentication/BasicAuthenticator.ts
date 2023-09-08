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
        if (!this.options.basicAuthUrls || this.options.basicAuthUrls.length === 0) {
            // Authentication with baseUrl
            const matches = await this.baseUrl.match(/(\w*:?\/\/)(.+)/)
            const basicAuthUrls = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]
            await this.browserInstance.url(basicAuthUrls)
        } else {
            // Authentication with basicAuthUrls from BasicAuth
            for (const basicAuthUrlsConfig of this.options.basicAuthUrls) {
                const matches = basicAuthUrlsConfig.match(/(\w*:?\/\/)(.+)/)
                const basicAuthUrls = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]
                await this.browserInstance.url(basicAuthUrls)
            }
        }
        this.setIsLoggedIn(true)
        // trick 17 ;)
        // the preload flag of the OData models tries to load the $metadata to early for our authenticators.
        // We have to reload the application to "force" the application to reload the requests after we are authenticated.
        await this.browserInstance.url(this.baseUrl)
    }
}

export default BasicAuthenticator
