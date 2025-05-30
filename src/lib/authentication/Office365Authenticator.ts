import type { Office365Authenticator as Office365AuthenticatorType } from "../../types/wdi5.types.js"
import Authenticator from "./Authenticator.js"

class Office365Authenticator extends Authenticator {
    staySignedIn: boolean
    constructor(options: Office365AuthenticatorType, browserInstanceName) {
        super(browserInstanceName)
        this.usernameSelector = options.usernameSelector ?? "[name=loginfmt]"
        this.passwordSelector = options.passwordSelector ?? "[name=passwd]"
        this.submitSelector = options.submitSelector ?? "[data-report-event=Signin_Submit]"
        this.staySignedIn = options.staySignedIn ?? true
    }

    async login() {
        if (!(await this.getIsLoggedIn())) {
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
                        "StaySignedIn step is not visible. If this step doesn't exist, set in wdi5 configuration 'staySignedIn' option to false."
                })
                await $(this.submitSelector).click()
            }
            this.setIsLoggedIn(true)
        }
    }
}

export default Office365Authenticator
