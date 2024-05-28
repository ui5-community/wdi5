/**
 * @module Modify
 * @memberof UI
 */

const { When } = require("@wdio/cucumber-framework")

/**
 * @name When we change field {string} to {string}
 * @description Changes the specified field to the provided value
 * @param {string} field name of the target field
 * @param {string} text the new value of the field
 * @example When we change field "Name" to "John"
 */
When("we change field {string} to {string}", async function (field, text) {
    await this.controller.editField(field, text)
    await this.controller.waitToLoad()
})

/**
* @name When we modify field {string} to {string}
* @description Changes the value of specified field to the provided one.
  Works also for fields with ValueHelp where the value will be selected in the ValueHelp popup or dialog.
  In case of ValueHelp dialogs with multiple columns, the text lookup is performed only in the first column.
* @param {string} field name of the target field
* @param {string} text the new value of the field
* @example When we modify field "Editing Status" to "All"
*/
When("we modify field {string} to {string}", async function (field, text) {
    if (false == (await this.controller.modifyField(field, text))) {
        await this.controller.waitEvents()
        let componentId = await this.controller.selectItemInValueHelp(field, text, true)
        await this.controller.waitEvents()
        if (await this.controller.isComponentOpened(componentId)) throw Error("Component still visible: " + componentId)
    }
})

/**
 * @name When we change the header field {string} to {string}
 * @description Changes the specified field located in the header section of an ObjectPage to the provided value
 * @param {string} field name of the target field
 * @param {string} text the new value of the field
 * @example When we change the header field "Name" to "John"
 */
When("we change the header field {string} to {string}", async function (field, text) {
    await this.controller.editHeaderField(field, text)
    await this.controller.waitToLoad()
})

/**
 * @name When we change the identification field {string} to {string}
 * @description Changes the specified identification field of an ObjectPage to the provided value
 * @param {string} field name of the target field
 * @param {string} text the new value of the field
 * @example When we change the identification field "Product" to "cucumber"
 */
When("we change the identification field {string} to {string}", async function (field, text) {
    await this.controller.editIdentificationField(field, text)
    await this.controller.waitToLoad()
})

/**
 * @name When we change the field {string} in group {string} to {string}
 * @description Changes the specified field located in the named field group of an ObjectPage to the provided value
 * @param {string} field name of the target field
 * @param {string} group name of the group
 * @param {string} text the new value of the field
 * @example When we change the field "Description" in group "General" to "product description"
 */
When("we change the field {string} in group {string} to {string}", async function (field, group, text) {
    await this.controller.editGroupField(group, field, text)
    await this.controller.waitToLoad()
})

/**
 * @name When we change the field {string} in the last row of table in section {string} to {string}
 * @description Changes the specified field located in the last row of the LineItem table located in the named section of an ObjectPage to the provided value
 * @param {string} field name of the target field
 * @param {string} section name of the section where the target LineItem table is located
 * @param {string} text the new value of the field
 * @example When we change the field "Flight Price" in the last row of table in section "Bookings" to "99"
 */
When(
    "we change the field {string} in the last row of table in section {string} to {string}",
    async function (field, section, text) {
        await this.controller.editFieldInLastRowOfLineItemTableInSection(section, field, text)
        await this.controller.waitToLoad()
    }
)

/**
 * @name When we enter in the prompt {string}
 * @description Changes the current prompt (active dialog) to the specified value
 * @param {string} value the new value to set in the prompt. For numeric prompts the value will be converted automatically to number
 * @example When we enter in the prompt "100"
 */
When("we enter in the prompt {string}", async function (value) {
    await this.controller.enterValueInPrompt(value)
    await this.controller.waitEvents()
})
