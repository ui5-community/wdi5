/**
 * @module Preconditions
 * @memberof UI
 */

const assert = require("assert")

const { Given } = require("@wdio/cucumber-framework")

/**
 * @name Given table {string} has {int} records
 * @description Checks if the table has the specified count of total records
 * @param {string} tableName of the table as displayed in the browser
 * @param {int} expectedRowCount expected count of total records
 * @example Given table "Books" has 200 records
 */
Given("table {string} has {int} records", async function (tableName, expectedRowCount) {
    let totalRowCount = await this.controller.extractTableRowsTotalCount(tableName)
    assert.equal(totalRowCount, expectedRowCount)
})

/**
 * @name Given table {string} has {int} visible records
 * @description Checks if the table has the specified amount of visible records
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {int} expectedRowCount expected count of visible records
 * @example Given table "Books" has 15 visible records
 */
Given("table {string} has {int} visible records", async function (tableName, expectedRowCount) {
    let content = await this.controller.extractTableContent(tableName)
    assert.equal(content.length, expectedRowCount)
})
