import { MultiRemoteDriver } from "webdriverio/build/multiremote"

export default class Authenticator {
    usernameSelector: string
    passwordSelector: string
    submitSelector: string
    browserInstanceName: string
    browserInstance: WebdriverIO.Browser

    constructor(browserInstanceName?) {
        this.browserInstanceName = browserInstanceName
        if (browserInstanceName) {
            this.browserInstance = browser[browserInstanceName]
        } else {
            this.browserInstance = browser
        }
    }

    getUsername() {
        let envName = "wdi5_username"
        if (browser instanceof MultiRemoteDriver) {
            envName = `wdi5_${this.browserInstanceName}_username`
        }
        return process.env[envName]
    }

    getPassword() {
        let envName = "wdi5_password"
        if (browser instanceof MultiRemoteDriver) {
            envName = `wdi5_${this.browserInstanceName}_password`
        }
        return process.env[envName]
    }
}
