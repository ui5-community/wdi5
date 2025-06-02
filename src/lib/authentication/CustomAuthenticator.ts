import type { CustomAuthenticator as CustomAuthenticatorType } from "../../types/wdi5.types.js"
import { Logger } from "../Logger.js"
import Authenticator from "./Authenticator.js"

class CustomAuthenticator extends Authenticator {
    constructor(
        options: CustomAuthenticatorType,
        browserInstanceName: string
        // browserInstance: WebdriverIO.Browser | WebdriverIO.MultiRemoteBrowser // TODO: is that instance or name?
    ) {
        if (!options.usernameSelector || !options.passwordSelector || !options.submitSelector) {
            const msg =
                "all options must be provided for a custom authenticator:\nusernameSelector, passwordSelector, submitSelector"
            Logger.getInstance().error(msg)
            throw new Error(msg)
        }
        super(browserInstanceName)
        this.usernameSelector = options.usernameSelector
        this.passwordSelector = options.passwordSelector
        this.submitSelector = options.submitSelector
    }

    async login() {
        if (!(await this.getIsLoggedIn())) {
            const username = await this.browserInstance.$(this.usernameSelector)
            const submit = await this.browserInstance.$(this.submitSelector)
            const password = await this.browserInstance.$(this.passwordSelector)
            const wdi5Username = this.getUsername()
            const wdi5Password = this.getPassword()

            await username.setValue(wdi5Username)
            await password.setValue(wdi5Password)
            await submit.click()
            this.setIsLoggedIn(true)
        }
    }
}

export default CustomAuthenticator
