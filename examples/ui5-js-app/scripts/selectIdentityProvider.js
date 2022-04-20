/**
 * select IDP on start
 *
 * use wdi5.skipInjectOnStart: true
 *
 * @param {*} capabilities
 */
module.exports = async (capabilities) => {
    "use strict"
    console.log("searching for ident provider")
    const aIDPs = await $$(".saml-login-link")

    aIDPs.forEach(async (identProvider) => {
        const idpName = await identProvider.getText()
        if (idpName === "Default Identity Provider") {
            console.log("found requested IDP")
            await identProvider.click()
        } else {
            console.log(`found other IDP ${idpName}`)
        }
    })
}
