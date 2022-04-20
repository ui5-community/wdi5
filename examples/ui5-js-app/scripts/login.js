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

    const _ids = { username: "#j_username", password: "#j_password", logOnButton: "#logOnFormSubmit" }

    await $(_ids.username).setValue(username)
    await $(_ids.password).setValue(password)

    await $(_ids.logOnButton).click()

    const title = await browser.getTitle()
    expect(title).toContain("") // TODO: check browser title

    // ********** get instance ************ //
    // require the service implementation and instantiate separately
    const _ui5Service = require("wdio-ui5-service").default
    const wdioUI5Service = new _ui5Service()
    await wdioUI5Service.injectUI5()
}
