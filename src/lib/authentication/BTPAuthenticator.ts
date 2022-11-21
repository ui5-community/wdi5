import { BTPAuthenticator as BTPAuthenticatorType } from "../../types/wdi5.types"
import Authenticator from "./Authenticator"

class BTPAuthenticator extends Authenticator {
    constructor(options: BTPAuthenticatorType, browserInstanceName) {
        super(browserInstanceName)
        this.usernameSelector = options.usernameSelector ?? "#j_username"
        this.passwordSelector = options.passwordSelector ?? "#j_password"
        this.submitSelector = options.submitSelector ?? "#logOnFormSubmit"
    }

    async login() {
        if (!(await this.getIsLoggedIn())) {
            const usernameControl = await this.browserInstance.$(this.usernameSelector)
            const passwordControl = await this.browserInstance.$(this.passwordSelector)
            const submit = await this.browserInstance.$(this.submitSelector)
            const wdi5Username = this.getUsername()
            const wdi5Password = this.getPassword()

            if (await passwordControl.isExisting()) {
                await usernameControl.setValue(wdi5Username)
                await passwordControl.setValue(wdi5Password)
                await submit.click()
            } else {
                await usernameControl.setValue(wdi5Username)
                await submit.click()
                const password = await this.browserInstance.$(this.passwordSelector)
                await password.setValue(wdi5Password)
                await submit.click()
            }
            this.setIsLoggedIn(true)
        }
    }
}

export default BTPAuthenticator
