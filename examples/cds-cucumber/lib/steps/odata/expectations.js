/**
 * @module Expectations
 * @memberof OData
 */

const assert = require("assert")
const chai = require("chai")
chai.use(require("chai-shallow-deep-equal"))
chai.use(require("chai-sorted"))

const { Then } = require("@wdio/cucumber-framework")

/**
 * @name Then its {word} to be {word}
 * @description Verifies the value of the specified field in the previously obtained result
 * @param {word} field name of the field to verify
 * @param {word} value expected value
 * @example Then its {word} to be {word}
 */
Then("its {word} to be {word}", async function (field, value) {
    assert.equal(this.result[field], value)
})

/**
 * @name Then we expect to succeed
 * @description Ensures there is no pending error from the previous operation
 * @example Then we expect to succeed
 */
Then("we expect to succeed", async function () {
    assert.ok(!this.error)
})

/**
 * @name Then we expect to fail
 * @description Ensures there is a pending error from the previous operation
 * @example Then we expect to fail
 */
Then("we expect to fail", async function () {
    assert.ok(this.error)
    this.error = undefined
})

/**
 * @name Then we expect no data returned
 * @description Ensures there is no result present
 * @example Then we expect no data returned
 */
Then("we expect no data returned", async function () {
    assert.equal(this.result, undefined)
})

/**
 * @name Then we expect data returned
 * @description Ensures there is a result present
 * @example Then we expect data returned
 */
Then("we expect data returned", async function () {
    assert.notEqual(this.result, undefined)
})

/**
 * @name Then we expect to have {int} records
 * @description Ensures the result is present as an array and contains the specified count of records
 * @param {int} count specifies the count of expected records
 * @example Then we expect to have 10 records
 */
Then("we expect to have {int} records", async function (count) {
    assert.ok(this.result, "No result")
    assert.ok(Array.isArray(this.result), "The result is not an array")
    assert.equal(this.result.length, count)
})

/**
 * @name Then we expect the count of records to be {int}
 * @description Ensures the result of the count(*) operation is present and states the expected count of records.
 *             It works in combination with the "select the count of records" step.
 * @param {int} count specifies the count of expected records
 * @example Then we expect the count of records to be 10
 */
Then("we expect the count of records to be {int}", async function (count) {
    assert.ok(this.result, "No result")
    assert.ok(Array.isArray(this.result), "The result is not an array")
    // check for count(*)
    assert.ok(this.result.length === 1, "The result does not contain only one record")
    assert.ok(this.result[0].$count !== undefined, "The result does not contain $count field")
    assert.equal(this.result[0].$count, count)
})

/**
 * @name Then we expect the result to contain the following record
 * @description Verifies that the present result contains the expected record provided as JSON-formatted string
 * @param {attachment} JSON-formatted string representing the record
 * @example Then we expect the result to contain the following record
 */
Then("we expect the result to contain the following record", async function (expected) {
    expected = JSON.parse(expected)
    let found = false
    this.result.forEach((R) => {
        try {
            chai.expect(R).to.shallowDeepEqual(expected)
            found = true
        } catch (e) {}
    })
    assert.ok(found, "Record not found - expected " + JSON.stringify(expected) + " in " + JSON.stringify(this.result))
})

/**
 * @name Then we expect the result to match
 * @description Ensures the present result to match the specified structure provided as JSON-formatted string
 * @param {attachment} expected specifies the expected result as JSON-formatted string
 * @example Then we expect the result to match
 */
Then("we expect the result to match", async function (expected) {
    assert.deepEqual(this.result, JSON.parse(expected))
})

/**
 * @name Then we expect the result to match partially
 * @description Ensures the present result to match partially the specified structure provided as JSON-formatted string
 * @param {attachment} expected specifies the expected result as JSON-formatted string
 * @example Then we expect the result to match partially
 */
Then("we expect the result to match partially", async function (expected) {
    chai.expect(this.result).to.shallowDeepEqual(JSON.parse(expected))
})

/**
 * @name Then we expect the result to be sorted by {word}
 * @description Ensures the present result is sorted by the specifield field
 * @param {word} field specifies the name of the target filed
 * @example Then we expect the result to be sorted by Title
 */
Then("we expect the result to be sorted by {word}", async function (field) {
    chai.expect(this.result).to.be.sortedBy(field)
})

/**
 * @name Then we expect the result to be sorted descending by {word}
 * @description Ensures the present result is sorted descending by the specifield field
 * @param {word} field specifies the name of the target filed
 * @example Then we expect the result to be sorted descending by Title
 */
Then("we expect the result to be sorted descending by {word}", async function (field) {
    chai.expect(this.result).to.be.sortedBy(field, { descending: true })
})

/**
 * @name Then we expect the result to contain records
 * @description Ensures the present result contains the specified records provided as a JSON-formatted string of an array with expected records
 * @param {attachment} expected JSON-formatted string of an array with expected records
 * @example Then we expect the result to contain records
 * """
 * [ { "category": 1 }, { "category": 2 } ]
 * """
 */
Then("we expect the result to contain records", async function (expected) {
    expected = JSON.parse(expected)
    let missingRecords = []
    expected.forEach((E) => {
        let found = false
        this.result.forEach((R) => {
            try {
                chai.expect(R).to.shallowDeepEqual(E)
                found = true
            } catch (e) {}
        })
        if (!found) missingRecords.push(E)
    })
    assert.ok(missingRecords.length == 0, `Records not found: ${JSON.stringify(missingRecords)}`)
})
