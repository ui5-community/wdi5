import Authenticator from "./Authenticator.js"
import { BasicAuthAuthenticator as BasicAuthenticatorType } from "../../types/wdi5.types"

class BasicAuthenticator extends Authenticator {
    private basicAuthUrl

    constructor(options: BasicAuthenticatorType, browserInstanceName) {
        super(browserInstanceName)
        this.basicAuthUrl = options.basicAuthUrl ?? false
    }
    async login() {
        if (!(await this.getIsLoggedIn()) && !this.basicAuthUrl) {
            const url = await this.browserInstance.getUrl()
            const matches = await url.match(/(\w*:?\/\/)(.+)/)

            const basicAuthUrl = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]

            await this.browserInstance.url(basicAuthUrl)

            // trick 17
            await this.browserInstance.url(url)
            this.setIsLoggedIn(true)
        } else {
            const url = await this.browserInstance.getUrl()
            const matches = await this.basicAuthUrl.match(/(\w*:?\/\/)(.+)/)

            // the only relevant change
            const basicAuthUrl = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]

            await this.browserInstance.url(basicAuthUrl)

            // trick 17
            await this.browserInstance.url(url)
        }
    }
}

export default BasicAuthenticator
