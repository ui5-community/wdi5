import Authenticator from "./Authenticator"
class Office365Authenticator extends Authenticator {
    staySignedIn: boolean
    constructor(options, browserInstanceName) {
        super(browserInstanceName)
        this.usernameSelector = options.usernameSelector ?? "[name=loginfmt]"
        this.passwordSelector = options.passwordSelector ?? "[name=passwd]"
        this.submitSelector = options.submitSelector ?? "[data-report-event=Signin_Submit]"
        this.staySignedIn = options.staySignedIn ?? true
    }

    async login() {
        const usernameControl = await $(this.usernameSelector)
        await usernameControl.setValue(this.getUsername())
        await $(this.submitSelector).click()
        await browser.waitUntil(async () => await (await $(this.passwordSelector)).isClickable(), {
            timeout: 5000,
            timeoutMsg: "Password field is not visible"
        })
        const passwordControl = await $(this.passwordSelector)
        await passwordControl.setValue(this.getPassword())
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
