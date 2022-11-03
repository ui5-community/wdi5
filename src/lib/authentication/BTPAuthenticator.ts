import Authenticator from "./Authenticator"
class BTPAuthenticator extends Authenticator {
    async login() {
        const username = await $("#j_username")
        const submit = await $("#logOnFormSubmit")
        const password = await $("#j_password")

        if (await password.isExisting()) {
            await username.setValue(process.env.wdi5_username)
            await password.setValue(process.env.wdi5_password)
            await submit.click()
        } else {
            await username.setValue(process.env.wdi5_username)
            await submit.click()
            const password = await $("#j_password")
            await password.setValue(process.env.wdi5_password)
            await submit.click()
        }
    }
}

export default new BTPAuthenticator()
