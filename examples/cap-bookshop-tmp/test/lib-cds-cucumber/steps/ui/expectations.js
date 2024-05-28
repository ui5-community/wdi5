/**
 * @module Expectations
 * @memberof UI
 */

const assert = require("assert")
const chai = require("chai")
chai.use(require("chai-shallow-deep-equal"))

const { Then } = require("@cucumber/cucumber")

/**
 * @name Then we expect the result to match array ignoring element order
 * @description Compares the already extracted array of sortable elements (string, integer, number) ignoring the order of elements with the provided array with strings
 * @param {string} expected expected result provided as JSON formatted array
 * @example Then we expect the result to match array ignoring element order
 * """
 * ["John Doe", "Richard Roe"]
 * """
 */
Then("we expect the result to match array ignoring element order", async function (expected) {
    assert.deepEqual(this.result.sort(), JSON.parse(expected).sort())
})

/**
 * @name Then we expect the result to contain the following details
 * @description Performs partial deep-match utilizing the already extracted structure with the provided structure
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal"
 * @param {string} expected expected result provided as JSON formatted structure
 * @example Then we expect the result to contain the following details
 * """
 * {"name": "John Doe"}
 * """
 */
Then("we expect the result to contain the following details", async function (expected) {
    chai.expect(this.result).to.shallowDeepEqual(JSON.parse(expected))
})

/**
 * @name Then we expect the result to match the saved one
 * @description Performs partial deep-match utilizing the previously saved structure with the provided structure
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal"
 * @example Then we expect the result to match the saved one
 * """
 * {"name": "John Doe"}
 * """
 */
Then("we expect the result to match the saved one", async function () {
    chai.expect(this.result).to.shallowDeepEqual(this.saved)
})

/**
 * @name Then we expect the result to be {string}
 * @description Compares the already extracted information with the provided text
 * @param {string} text expected result
 * @example Then we expect the result to be "John Doe"
 */
Then("we expect the result to be {string}", async function (text) {
    assert.equal(this.result, text)
})

// TODO
Then("we expect the next step to fail", async function () {
    await this.controller.setExpectToFail()
})

/**
 * @name Then we expect table {string} to contain the following rows
 * @description Extracts the content of the specified table and compares it with the provided structure
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal"
 * @param {string} tableName caption of the target table
 * @param {string} expected expected result provided as JSON formatted array
 * @example Then we expect table "Books" to contain the following rows
 * """
 * [{"Author": "Edgar Allen Poe"}]
 * """
 */
Then("we expect table {string} to contain the following rows", async function (tableName, expected) {
    let content = await this.controller.extractTableContent(tableName)
    chai.expect(content).to.shallowDeepEqual(JSON.parse(expected))
})

/**
 * @name Then we expect table {string} to contain records
 * @description Extracts the content of the specified table and confirms it contains the specified records
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal" when comparing single records.
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {string} expected the records to search for provided as JSON formatted array
 * @example Then we expect table "Books" to contain records
 * """
 * [ {"name": "John Doe"}, {"name": "Richard Roe"} ]
 * """
 */
Then("we expect table {string} to contain records", async function (tableName, expected) {
    let content = await this.controller.extractTableContent(tableName)
    expected = JSON.parse(expected)
    let missingRecords = []
    expected.forEach((E) => {
        let found = false
        content.forEach((R) => {
            try {
                chai.expect(R).to.shallowDeepEqual(E)
                found = true
            } catch (e) {}
        })
        if (!found) missingRecords.push(E)
    })
    assert.ok(missingRecords.length == 0, `Records not found: ${JSON.stringify(missingRecords)}`)
})

/**
 * @name Then we expect table {string} not to contain records
 * @description Extracts the content of the specified table and confirms it does not contain the specified records
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal" when comparing single records.
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {string} unexpected the records to search for provided as JSON formatted array
 * @example Then we expect table "Books" not to contain records
 * """
 * [ {"name": "John Doe"}, {"name": "Richard Roe"} ]
 * """
 */
Then("we expect table {string} not to contain records", async function (tableName, unexpected) {
    let content = await this.controller.extractTableContent(tableName)
    unexpected = JSON.parse(unexpected)
    let foundRecords = []
    unexpected.forEach((E) => {
        let found = false
        content.forEach((R) => {
            try {
                chai.expect(R).to.shallowDeepEqual(E)
                found = true
            } catch (e) {}
        })
        if (found) foundRecords.push(E)
    })
    assert.ok(foundRecords.length == 0, `Records found: ${JSON.stringify(foundRecords)}`)
})

/**
 * @name Then we expect table {string} to contain record
 * @description Extracts the content of the specified table and confirms it contains the specified record
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal" when comparing single records.
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {string} expected the records to search for provided as JSON formatted structure
 * @example Then we expect table "Books" to contain record
 * """
 * {"name": "John Doe"}
 * """
 */
Then("we expect table {string} to contain record", async function (tableName, expected) {
    let content = await this.controller.extractTableContent(tableName)
    expected = JSON.parse(expected)
    let found = false
    content.forEach((R) => {
        try {
            chai.expect(R).to.shallowDeepEqual(expected)
            found = true
        } catch (e) {}
    })
    assert.ok(found, `Record not found - expected:${JSON.stringify(expected)} in ${JSON.stringify(content)}`)
})

/**
 * @name Then we expect table {string} not to contain record
 * @description Extracts the content of the specified table and confirms it does not contain the specified record
 *    by utilizing the function shallowDeepEqual of the nodejs module "chai-shallow-deep-equal" when comparing single records.
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {string} unexpected the record to search for provided as JSON formatted structure
 * @example Then we expect table "Books" not to contain record
 * """
 * {"name": "John Doe"}
 * """
 */
Then("we expect table {string} not to contain record", async function (tableName, unexpected) {
    let content = await this.controller.extractTableContent(tableName)
    unexpected = JSON.parse(unexpected)
    let found = false
    content.forEach((R) => {
        try {
            chai.expect(R).to.shallowDeepEqual(unexpected)
            found = true
        } catch (e) {}
    })
    assert.ok(!found, `Record found:${JSON.stringify(unexpected)} in ${JSON.stringify(content)}`)
})

/**
 * @name Then we expect table {string} to have {int} records
 * @description Confirms the visible record count of the specified table
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {int} expectedRowCount expected count of rows in the table
 * @example Then we expect table "Books" to have 100 records
 */
Then("we expect table {string} to have {int} records", async function (tableName, expectedRowCount) {
    let content = await this.controller.extractTableContent(tableName)
    assert.equal(content.length, expectedRowCount)
})

/**
 * @name Then we expect table {string} to have {int} records in total
 * @description Confirms the total record count of the specified table
 * @param {string} tableName the name of the target table as displayed in the browser
 * @param {int} expectedRowCount expected count of rows in the table
 * @example Then we expect table "Books" to have 4000 records in total
 */
Then("we expect table {string} to have {int} records in total", async function (tableName, expectedRowCount) {
    let totalRowCount = await this.controller.extractTableRowsTotalCount(tableName)
    assert.equal(totalRowCount, expectedRowCount)
})

/**
 * @name Then we expect to have {int} table records
 * @description Confirms the visible count of rows in the current ListReport table
 * @param {int} expectedRowCount expected visible count of rows in the table
 * @example Then we expect to have 500 table records
 */
Then("we expect to have {int} table records", async function (expectedRowCount) {
    let content = await this.controller.extractTableRows()
    assert.equal(content.length, expectedRowCount)
})

function findFieldInObjectStructure(content, fieldName) {
    if (typeof content === "object") {
        for (let key in content) {
            let value = content[key]
            if (typeof value !== "object") {
                if (key == fieldName) return value
                continue
            }
            let found = findFieldInObjectStructure(value, fieldName)
            if (found && typeof found !== "object") return found
        }
    }
    return undefined
}

/**
 * @name Then we expect field {string} to be {string}
 * @description Confirms the value of the field which is part of the current page content structure
 * @param {string} fieldName name of the target field
 * @param {string} expected expected string value
 * @example Then we expect field "Title" to be "The Raven"
 */
Then("we expect field {string} to be {string}", async function (fieldName, expected) {
    let content = await this.controller.extractCurrentPageContent()
    let found = findFieldInObjectStructure(content, fieldName)
    if (!found) throw Error(`Field ${fieldName} not found, fields: ${Object.keys(content)}`)
    found = found.replaceAll(" ", " ") // replace non-breaking space
    assert.equal(found, expected)
})
