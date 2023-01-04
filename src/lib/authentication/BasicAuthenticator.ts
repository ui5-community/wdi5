import Authenticator from "./Authenticator"
class BasicAuthenticator extends Authenticator {
    constructor(browserInstanceName) {
        super(browserInstanceName)
    }
    async login() {
        if (!(await this.getIsLoggedIn())) {
            const url = await this.browserInstance.getUrl()
            const matches = await url.match(/(\w*:?\/\/)(.+)/)

            const basicAuthUrl = matches[1] + this.getUsername() + ":" + this.getPassword() + "@" + matches[2]

            await this.browserInstance.url(basicAuthUrl)

            // trick 17
            await this.browserInstance.url(url)
            this.setIsLoggedIn(true)
        }
    }
}

export default BasicAuthenticator
