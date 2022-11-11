import Authenticator from "./Authenticator"
class Office365Authenticator extends Authenticator {
    staySignedIn: boolean
    constructor(options) {
        super()
        this.usernameSelector = options.usernameSelector ?? "[name=loginfmt]"
        this.passwordSelector = options.passwordSelector ?? "[name=passwd]"
        this.submitSelector = options.submitSelector ?? "[data-report-event=Signin_Submit]"
        this.staySignedIn = options.staySignedIn ?? true
    }

    async login() {
        const username = await $(this.usernameSelector)
        await username.setValue(process.env.wdi5_username)
        await $(this.submitSelector).click()
        await browser.waitUntil(async () => await (await $(this.passwordSelector)).isClickable(), {
            timeout: 5000,
            timeoutMsg: "Password field is not visible"
        })
        const password = await $(this.passwordSelector)
        await password.setValue(process.env.wdi5_password)
        await $(this.submitSelector).click()
        if (this.staySignedIn) {
            await browser.waitUntil(async () => await (await $("#KmsiDescription")).isClickable(), {
                timeout: 5000,
                timeoutMsg:
                    "StaySignedIn step is not visible. If this step doesnt exist, set in wdi5 configuration 'staySignedIn' option to false."
            })
            await $(this.submitSelector).click()
        }
    }
}

export default Office365Authenticator
