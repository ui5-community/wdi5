/**
 * @module ValueHelp
 * @memberof UI
 */

const { When } = require("@cucumber/cucumber")

/**
 * @name When we open value help for field {string}
 * @description Openes the ValueHelp dialog for the specified field.
 * @param {string} field name of the target field
 * @example When we open value help for field "Customer"
 */
When("we open value help for field {string}", async function (field) {
    if ((await this.controller.getVisiblePopoverCount()) > 0) throw Error("There is already a visible popover!")
    const vhi = await this.controller.openValueHelpDialogForField(field)
    await this.controller.waitEvents()
    let hasPopup = await this.controller.hasVisibleValueHelpForField(field, vhi)
    if (!hasPopup) throw Error(`Missing visible popup for field '${field}'`)
})

/**
 * @name When we open value help for object field {string}
 * @description Openes the ValueHelp dialog for the specified object field.
 * @param {string} field name of the target field
 * @example When we open value help for object field "Customer"
 */
When("we open value help for object field {string}", async function (field) {
    if ((await this.controller.getVisiblePopoverCount()) > 0) throw Error("There is already a visible popover!")
    const vhi = await this.controller.openValueHelpDialogForObjectField(field)
    await this.controller.waitEvents()
    let hasPopup = await this.controller.hasVisibleValueHelpForField(field, vhi)
    if (!hasPopup) throw Error(`Missing visible popup for field '${field}'`)
})

/**
 * @name When we open value help for filter field {string}
 * @description Openes the ValueHelp dialog for the specified filter field.
 * @param {string} field name of the target field
 * @example When we open value help for filter field "Customer"
 */
When("we open value help for filter field {string}", async function (field) {
    if ((await this.controller.getVisiblePopoverCount()) > 0) throw Error("There is already a visible popover!")
    const vhi = await this.controller.openValueHelpDialogForFilterField(field)
    await this.controller.waitEvents()
    let hasPopup = await this.controller.hasVisibleValueHelpForField(field, vhi)
    if (!hasPopup) throw Error(`Missing visible popup for field '${field}', vhi:${vhi}`)
})

/**
 * @name When we close value help for field {string}
 * @description Closes the ValueHelp dialog for the specified filter field.
 * @param {string} field name of the target field
 * @example When we close value help for field "Customer"
 */
When("we close value help for field {string}", async function (field) {
    if ((await this.controller.getVisiblePopoverCount()) == 0) return
    await this.controller.openValueHelpDialogForField(field)
    await this.controller.waitEvents()
})

/**
 * @name When we close value help for object field {string}
 * @description Closes the ValueHelp dialog for the specified object field.
 * @param {string} field name of the target field
 * @example When we close value help for object field "Customer"
 */
When("we close value help for object field {string}", async function (field) {
    if ((await this.controller.getVisiblePopoverCount()) == 0) return
    await this.controller.openValueHelpDialogForObjectField(field)
    await this.controller.waitEvents()
})

/**
 * @name When we close value help for filter field {string}
 * @description Closes the ValueHelp dialog for the specified filter field.
 * @param {string} field name of the target field
 * @example When we close value help for filter field "Customer"
 */
When("we close value help for filter field {string}", async function (field) {
    if ((await this.controller.getVisiblePopoverCount()) == 0) return
    await this.controller.openValueHelpDialogForFilterField(field)
    await this.controller.waitEvents()
})

/**
 * @name When we confirm value help dialog
 * @description Clicks the "Ok" button in the currently opened ValueHelp dialog.
 * @example When we confirm value help dialog
 */
When("we confirm value help dialog", async function () {
    await this.controller.pressOkInValueHelpDialog()
    await this.controller.waitEvents()
})

/**
 * @name When we select first row in value help dialog having field {string} equal to {string}
 * @description Selects the first row in the visible ValueHelp dialog where the specified column matches the provided value and
 *   in addition clears the previous selection.
 * @param {string} columnName name of the target column
 * @param {string} searchText value to search for in the target column
 * @example When we select first row in value help dialog having field "Flight Number" equal to "0400"
 */
When(
    "we select first row in value help dialog having field {string} equal to {string}",
    async function (columnName, searchText) {
        await this.controller.selectFirstMatchingRowInValueHelpDialog(columnName, searchText)
        await this.controller.waitEvents()
    }
)

/**
 * @name When we select one row in value help dialog having field {string} equal to {string}
 * @description Selects the row in the visible ValueHelp dialog where the specified column matches the provided value.
 *   Fails if there are more than one matching rows.
 * @param {string} columnName name of the target column
 * @param {string} searchText value to search for in the target column
 * @example When we select one row in value help dialog having field "Travel Status" equal to "Open"
 */
When(
    "we select one row in value help dialog having field {string} equal to {string}",
    async function (columnName, searchText) {
        await this.controller.selectOneRowInValueHelpDialog(columnName, searchText)
        await this.controller.waitEvents()
    }
)

/**
 * @name When we select one suggestion in value help dialog for field {string} equal to {string}
 * @description Selects one of the suggested values in a ValueHelp dialog.
 *   It supports sap.ui.mdc.ValueHelp and sap.ui.mdc.field.ListFieldHelp ValueHelp types.
 * @param {string} fieldName name of the target field
 * @param {string} searchText value to search for in the target column
 * @example When we select one suggestion in value help dialog for field "Travel Status" equal to "Open"
 */
When(
    "we select one suggestion in value help dialog for field {string} equal to {string}",
    async function (fieldName, searchText) {
        await this.controller.selectItemInFieldValueHelp(fieldName, searchText)
        await this.controller.waitEvents()
    }
)

/**
 * @name When we remove selections in value help dialog for field {string}
 * @description Clears the selection in a ValueHelp dialog.
 * @param {string} fieldName name of the target field
 * @example When we remove selections in value help dialog for field "Travel Status"
 */
When("we remove selections in value help dialog for field {string}", async function (fieldName) {
    await this.controller.selectItemInFieldValueHelp(fieldName, undefined)
    await this.controller.waitEvents()
})

// internal
When("field {string} has value help", async function (fieldName) {
    if (!(await this.controller.hasValueHelp(fieldName))) throw Error(`${fieldName} has no ValueHelp`)
})

// internal
When("field {string} has no value help", async function (fieldName) {
    if (await this.controller.hasValueHelp(fieldName)) throw Error(`${fieldName} has ValueHelp`)
})
