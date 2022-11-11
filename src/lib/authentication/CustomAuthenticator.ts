import Authenticator from "./Authenticator"
class CustomAuthenticator extends Authenticator {
    constructor(options, browserInstance) {
        super(browserInstance)
        this.usernameSelector = options.usernameSelector ?? "Logger.error()"
        this.passwordSelector = options.passwordSelector ?? "Logger.error()"
        this.submitSelector = options.submitSelector ?? "Logger.error"
    }

    async login() {
        const username = await this.browserInstance.$(this.usernameSelector)
        const submit = await this.browserInstance.$(this.submitSelector)
        const password = await this.browserInstance.$(this.passwordSelector)
        const wdi5Username = this.getUsername()
        const wdi5Password = this.getPassword()

        await username.setValue(wdi5Username)
        await password.setValue(wdi5Password)
        await submit.click()
    }
}

export default CustomAuthenticator
