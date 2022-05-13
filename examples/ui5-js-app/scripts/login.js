/**
 * login in BTP
 *
 * use wdi5.skipInjectOnStart: true
 *
 * expect to be on UI5 app under test after login
 *
 * @param {*} capabilities
 * @param {*} username
 * @param {*} password
 */
module.exports = async (capabilities, username, password) => {
    "use strict"
    // log the spec file the login is executed
    const testfile = capabilities[0].substr(capabilities[0].lastIndexOf("/") + 1)
    // eslint-disable-next-line no-console
    console.log(`Login executed for: ${testfile}`)

    // ********* login ******** //

    const _ids = {
        username: "#j_username",
        password: "#j_password",
        logOnButton: "#logOnFormSubmit",
        globalIdPw: "#password",
        globaIdSignInButton:
            "/html/body/div[1]/main/div/div/div[1]/div/div[2]/div[2]/div/div/div/div[1]/div[2]/form/div/div[2]/button",
        globaIdAccount: "/html/body/div[1]/main/div/div[2]/div[1]/div/div[2]/div/div/div[3]/div[1]/div/div[1]"
    }

    console.log(`start login for ${username}`)
    await $(_ids.username).setValue(username)

    if (process.env.USE_GLOBAL_ID !== "true") {
        console.log(`setting passoword`)
        await $(_ids.password).setValue(password)
        await $(_ids.logOnButton).click()
    } else {
        // Global ID
        console.log(`using global id for login`)
        await $(_ids.logOnButton).click()
        await $(_ids.globalIdPw).setValue(password)
        await $(_ids.globaIdSignInButton).click()
        await $(_ids.globaIdAccount).click()
    }

    await $(".sapUiBody").waitForExist()

    const title = await browser.getTitle()
    expect(title).toContain("Sample UI5 Application")

    // ********** get instance ************ //
    // require the service implementation and instantiate separately
    if (title === "Sample UI5 Application") {
        console.log("injecting wdio-ui5-service")
        const _ui5Service = require("wdio-ui5-service").default
        const wdioUI5Service = new _ui5Service()
        await wdioUI5Service.injectUI5()
    } else {
        console.log("cannot inject wdio-ui5-service on non UI5 page")
    }
}
