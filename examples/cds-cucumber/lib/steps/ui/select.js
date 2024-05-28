/**
 * @module Select
 * @memberof UI
 */

const { When } = require("@wdio/cucumber-framework")

/**
 * @name When we select all rows in table {string}
 * @description Locates the specified table and selects all visible rows in it.
 * @param {string} tableName caption of the target table
 * @example When we select all rows in table "Books"
 */
When("we select all rows in table {string}", async function (tableName) {
    await this.controller.selectAllRowsLineItemTable(tableName)
    await this.controller.waitEvents()
})

/**
 * @name When we select row {int} in table {string}
 * @description Locates the specified table and selects the specified row in it.
 * @param {int} row number of the row to select
 * @param {string} tableName caption of the target table
 * @example When we select row 2 in table "Books"
 */
When("we select row {int} in table {string}", async function (row, tableName) {
    if (row < 1) throw Error(`row number should be greater than zero, got: ${row}`)
    await this.controller.selectRowInLineItemTable(tableName, row - 1)
    await this.controller.waitEvents()
})

/**
 * @name When we select rows in table {string} having {string} equal to {string}
 * @description Locates the specified table and selects the rows where the specified column matches the provided value.
 * @param {string} tableName caption of the target table
 * @param {string} columnName caption of the target column
 * @param {string} value value to look for
 * @example When we select rows in table "Books" having "Name" equal to "John Doe"
 */
When(
    "we select rows in table {string} having {string} equal to {string}",
    async function (tableName, columnName, value) {
        await this.controller.selectRowsInLineItemTableHaving(tableName, columnName, value)
        await this.controller.waitEvents()
    }
)

/**
 * @name When we select day {string}
 * @description Selects the specified day in the currently opened calendar.
 * @param {string} day target number of day in a month
 * @example When we select day "15"
 */
When("we select day {string}", async function (day) {
    await this.controller.selectDayInVisibleCalendar(day)
    await this.controller.waitEvents()
})

/**
 * @name When we select year {string}
 * @description Selects the specified year in the currently opened calendar.
 * @param {string} year target year to select
 * @example When we select year "2030"
 */
When("we select year {string}", async function (day) {
    await this.controller.performActionOnVisibleCalendar("year")
    await this.controller.waitEvents()
    await this.controller.selectYearInVisibleCalendar(day)
    await this.controller.waitEvents()
})

/**
 * @name When we select month {string}
 * @description Selects the specified month in the currently opened calendar.
 * @param {string} year target year to select
 * @example When we select month "December"
 */
When("we select month {string}", async function (month) {
    await this.controller.performActionOnVisibleCalendar("month")
    await this.controller.waitEvents()
    await this.controller.selectMonthInVisibleCalendar(month)
    await this.controller.waitEvents()
})

/**
 * @name When we roll calendar to {string}
 * @description Performs the specified action on the currently opened calendar.
 * @param {string} action action to perform on the calendar: "next month", "next year"
 * @example When we roll calendar to "next month"
 */
When("we roll calendar to {string}", async function (action) {
    await this.controller.rollVisibleCalendar(action)
    await this.controller.waitEvents()
})
