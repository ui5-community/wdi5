import Authenticator from "./Authenticator"
class BTPAuthenticator extends Authenticator {
    constructor(options) {
        super()
        this.usernameSelector = options.usernameSelector ?? "#j_username"
        this.passwordSelector = options.passwordSelector ?? "#j_password"
        this.submitSelector = options.submitSelector ?? "#logOnFormSubmit"
    }

    async login() {
        const username = await $(this.usernameSelector)
        const submit = await $(this.submitSelector)
        const password = await $(this.passwordSelector)

        if (await password.isExisting()) {
            await username.setValue(process.env.wdi5_username)
            await password.setValue(process.env.wdi5_password)
            await submit.click()
        } else {
            await username.setValue(process.env.wdi5_username)
            await submit.click()
            const password = await $(this.passwordSelector)
            await password.setValue(process.env.wdi5_password)
            await submit.click()
        }
    }
}

export default BTPAuthenticator
