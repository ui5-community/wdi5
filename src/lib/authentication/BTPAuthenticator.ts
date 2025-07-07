import { BTPAuthenticator as BTPAuthenticatorType } from "../../types/wdi5.types.js"
import Authenticator from "./Authenticator.js"

class BTPAuthenticator extends Authenticator {
    private disableBiometricAuth: boolean
    private idpDomain: string
    private idpDomainOpt: string

    constructor(options: BTPAuthenticatorType, browserInstanceName) {
        super(browserInstanceName)
        this.usernameSelector = options.usernameSelector ?? "#j_username"
        this.passwordSelector = options.passwordSelector ?? "#j_password"
        this.submitSelector = options.submitSelector ?? "#logOnFormSubmit"
        this.idpDomainOpt = options.idpDomain
        this.disableBiometricAuth = options.disableBiometricAuthentication ?? false
        if (this.disableBiometricAuth) {
            if (!options.idpDomain) {
                throw new Error(
                    "idpDomain is required when disableBiometricAuthentication is set to `true` your wdi5.conf.(j|t)s"
                )
            }
            this.idpDomain = options.idpDomain
        }
    }

    async disableBiometricAuthentication() {
        await this.browserInstance.setCookies({
            name: "skipPasswordlessAuthnDeviceConfig",
            value: "true",
            domain: this.idpDomain
        })
    }

    async login() {
        if (!(await this.getIsLoggedIn())) {
            if (!!this.idpDomainOpt) {
                const targetIdpEle = await this.browserInstance.$(`a[href*="idp=${this.idpDomainOpt}"]`)
                if (!!targetIdpEle.elementId) {
                    targetIdpEle.click()
                }
            }
            const usernameControl = await this.browserInstance.$(this.usernameSelector)
            const passwordControl = await this.browserInstance.$(this.passwordSelector)
            const submit = await this.browserInstance.$(this.submitSelector)
            const wdi5Username = this.getUsername()
            const wdi5Password = this.getPassword()

            if (await passwordControl.isExisting()) {
                await usernameControl.setValue(wdi5Username)
                await passwordControl.setValue(wdi5Password)
                await submit.click()
            } else {
                await usernameControl.setValue(wdi5Username)
                await submit.click()
                const password = await this.browserInstance.$(this.passwordSelector)
                await password.setValue(wdi5Password)
                await submit.click()
            }
            this.setIsLoggedIn(true)
        }
    }
}

export default BTPAuthenticator
