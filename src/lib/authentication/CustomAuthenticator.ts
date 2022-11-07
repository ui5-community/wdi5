import Authenticator from "./Authenticator"
class CustomAuthenticator extends Authenticator {
    constructor(options) {
        super()
        this.usernameSelector = options.usernameSelector ?? "Logger.error()"
        this.passwordSelector = options.passwordSelector ?? "Logger.error()"
        this.submitSelector = options.submitSelector ?? "Logger.error"
    }

    async login() {
        const username = await $(this.usernameSelector)
        const submit = await $(this.submitSelector)
        const password = await $(this.passwordSelector)

        await username.setValue(process.env.wdi5_username)
        await password.setValue(process.env.wdi5_password)
        await submit.click()
    }
}

export default CustomAuthenticator
