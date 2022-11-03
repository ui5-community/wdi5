import Authenticator from "./Authenticator"
class BasicAuthenticator extends Authenticator {
    async login() {
        const url = await browser.getUrl()
        const matches = await url.match(/(\w*:?\/\/)(.+)/)

        const basicAuthUrl = matches[1] + process.env.wdi5_username + ":" + process.env.wdi5_password + "@" + matches[2]

        await browser.url(basicAuthUrl)

        // trick 17
        await browser.url(url)
    }
}

export default new BasicAuthenticator()
