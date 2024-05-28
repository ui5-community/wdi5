/**
 * @module Filter
 * @memberof UI
 */

const { When } = require("@wdio/cucumber-framework")

/**
 * @name When we filter by {string} equal to {string} having Id {string}
 * @description Adds "equals" condition for the specified filter field
 * @param {string} field name of the field
 * @param {string} text textual representation of the filter value
 * @param {string} id id of the filter value
 * @example When we filter by "Customer" equal to "John Doe" having Id "01234"
 */
When("we filter by {string} equal to {string} having Id {string}", async function (field, text, id) {
    await this.controller.addConditionEqualInFilterField(field, [id, text])
    await this.controller.waitEvents()
})

/**
 * @name When we filter by {string} equal to {string}
 * @description Adds "equals" condition for the specified filter field
 * @param {string} field name of the field
 * @param {string} text textual representation of the filter value
 * @example When we filter by "Customer" equal to "01234"
 */
When("we filter by {string} equal to {string}", async function (field, text) {
    await this.controller.addConditionEqualInFilterField(field, text)
    await this.controller.waitEvents()
})

/**
 * @name When we filter by {string} greater than {int}
 * @description Adds "greater than" condition for the specified filter field
 * @param {string} field name of the field
 * @param {string} value the value to compare with
 * @example When we filter by "Customer" greater than "01234"
 */
When("we filter by {string} greater than {int}", async function (field, value) {
    await this.controller.addConditionGreaterInFilterField(field, value)
    await this.controller.waitEvents()
})

/**
 * @name When we show the adapt filter dialog
 * @description Opens the dialog to adapt the field filter
 * @example When we show the adapt filter dialog
 */
When("we show the adapt filter dialog", async function () {
    await this.controller.firePressOnAdaptFilterButton()
    await this.controller.waitToLoad()
})

/**
 * @name When we select field {string} in adapt filter
 * @description Selects the specified field the adapt filter dialog
 * @param {string} columnName name of the column to add to the filter
 * @example When we select field "Customer" in adapt filter
 */
When("we select field {string} in adapt filter", async function (columnName) {
    await this.controller.selectFieldInAdaptFilterDialog(columnName)
    await this.controller.waitEvents()
})

/**
 * @name When we select all fields in adapt filter
 * @description Selects all fields the adapt filter dialog
 * @example When we select all fields in adapt filter
 */
When("we select all fields in adapt filter", async function () {
    await this.controller.selectAllFieldsInAdaptFilterDialog()
    await this.controller.waitEvents()
})

/**
 * @name When we apply the adapt filter
 * @description Applies the field selection in the adapt filter dialog
 * @example When we apply the adapt filter
 */
When("we apply the adapt filter", async function () {
    await this.controller.pressOkInAdaptFilterDialog()
    await this.controller.waitToLoad()
})
