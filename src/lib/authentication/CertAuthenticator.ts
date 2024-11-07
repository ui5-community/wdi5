import { CertAuthenticator as CertAuthenticatorType } from "../../types/wdi5.types.js"
import Authenticator from "./Authenticator.js"
import { CertificateAuthSession } from "playwright-client-certificate-login"

class CertAuthenticator extends Authenticator {
    private origin: string
    private url: string
    private pfxPath: string
    private pfxPassword: string

    constructor(options: CertAuthenticatorType, browserInstanceName, baseUrl: string) {
        super(browserInstanceName)
        this.origin = options.certificateOrigin || "https://accounts.sap.com"
        this.url = options.certificateUrl || baseUrl
        this.pfxPath = options.certificatePfxPath
        this.pfxPassword = options.certificatePfxPassword
    }

    async login() {
        if (!(await this.getIsLoggedIn())) {
            let sapSession
            try {
                // Instantiate the CertificateAuthSession
                // sapSession = new CertificateAuthSession({
                //     origin: "https://accounts.sap.com",
                //     url: "https://emea.cockpit.btp.cloud.sap/cockpit#/", // Target URL for login
                //     pfxPath: "./sap.pfx", // Updated PFX file path created in workflow
                //     passphrase: "", // Passphrase for PFX if needed
                //     timeout: 60000 // Optional timeout
                // })
                sapSession = new CertificateAuthSession({
                    origin: this.origin,
                    url: this.url, // Target URL for login
                    pfxPath: this.pfxPath, // Updated PFX file path created in workflow
                    passphrase: this.pfxPassword, // Passphrase for PFX if needed
                    timeout: 60000 // Optional timeout
                })

                // Authenticate
                await sapSession.authenticate()

                // Check if login was successful by verifying the URL or a page element
                // const page = sapSession.getPage()

                const cookies = sapSession.getCookies()

                for (const cookie of cookies) {
                    try {
                        // Handle __HOST- prefixed cookies differently
                        if (cookie.name.startsWith("__HOST-")) {
                            await this.browserInstance.setCookies({
                                name: cookie.name,
                                value: cookie.value,
                                path: "/",
                                secure: true,
                                sameSite: cookie.sameSite || "Strict",
                                httpOnly: cookie.httpOnly
                            })
                        } else {
                            // Remove leading dot from domain if present
                            // const domain = cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain
                            const domain = "sap.com"

                            await this.browserInstance.setCookies({
                                name: cookie.name,
                                value: cookie.value,
                                domain: domain,
                                path: cookie.path,
                                httpOnly: cookie.httpOnly,
                                secure: cookie.secure,
                                sameSite: cookie.sameSite
                            })
                        }
                    } catch (error) {
                        console.warn(`Failed to set cookie ${cookie.name}: ${error.message}`)
                        // Continue with other cookies even if one fails
                    }
                }
                await this.browserInstance.refresh()
            } catch (error) {
                console.error("Error during login:", error.message)
                process.exit(1) // Exit with failure on error
            } finally {
                // Ensure the session closes properly
                if (sapSession) {
                    await sapSession.close()
                }
            }
            this.setIsLoggedIn(true)
        }
    }
}

export default CertAuthenticator
