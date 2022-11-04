import Authenticator from "./Authenticator"
class CustomAuthenticator extends Authenticator {
    async login(options) {
        const username = await $(options.usernameSelector)
        const submit = await $(options.submitSelector)
        const password = await $(options.passwordSelector)

        await username.setValue(process.env.wdi5_username)
        await password.setValue(process.env.wdi5_password)
        await submit.click()
    }
}

export default new CustomAuthenticator()
