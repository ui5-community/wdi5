import { isMultiRemote } from "../multiRemote.js"

export default class Authenticator {
    usernameSelector?: string
    passwordSelector?: string
    submitSelector?: string
    browserInstanceName?: string
    browserInstance: WebdriverIO.Browser

    constructor(browserInstanceName?: string) {
        this.browserInstanceName = browserInstanceName
        if (browserInstanceName) {
            this.browserInstance = (browser as unknown as WebdriverIO.MultiRemoteBrowser).getInstance(
                browserInstanceName
            )
        } else {
            this.browserInstance = browser
        }
    }

    private envName(key: "username" | "password"): string {
        return isMultiRemote(browser) ? `wdi5_${this.browserInstanceName}_${key}` : `wdi5_${key}`
    }

    getUsername(): string {
        const envName = this.envName("username")
        const sUserName = process.env[envName]
        if (!sUserName) {
            throw new Error(`Environment variable ${envName} for username is not set!`)
        }
        return sUserName
    }

    getPassword(): string {
        const envName = this.envName("password")
        const sPassword = process.env[envName]
        if (!sPassword) {
            throw new Error(`Environment variable ${envName} for password is not set!`)
        }
        return sPassword
    }

    async getIsLoggedIn(): Promise<boolean> {
        const cookies = await this.browserInstance.getCookies()
        const index = cookies.findIndex((item) => {
            return item.name === "isLoggedIn"
        })
        const value = index !== -1 ? cookies[index].value : "false"
        return value === "true"
    }

    async setIsLoggedIn(status: boolean) {
        await this.browserInstance.setCookies({ name: "isLoggedIn", value: status.toString() })
    }
}
