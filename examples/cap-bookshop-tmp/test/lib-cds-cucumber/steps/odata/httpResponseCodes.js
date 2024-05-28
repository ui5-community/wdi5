/**
 * @module HTTP-Response
 * @memberof OData
 */

const assert = require("assert")

const { Then } = require("@cucumber/cucumber")

function getResponse(that) {
    let error = that.error
    that.error = undefined
    let response = error?.error?.reason?.response || error?.reason?.response || error?.response
    // cds embedded - no 'reason' is set, sets only 'code'
    return response || { status: error.code }
}

/**
 * @name Then we expect to fail with response code {int}
 * @description Ensures there is a pending error and the HTTP response indicates the specified code
 * @param {int} code specified the expected code as an integer
 * @example Then we expect to fail with response code 404
 */
Then("we expect to fail with response code {int}", async function (code) {
    assert.ok(this.error)
    let response = getResponse(this)
    assert.equal(response.status, code)
})

/**
 * @name Then we expect the response code to be {int}
 * @description Ensures that the HTTP response indicates the specified code
 * @example Then we expect the response code to be 404
 */
Then("we expect the response code to be {int}", async function (code) {
    let response = getResponse(this)
    assert.equal(response.status, code)
})

/**
 * @name Then we expect the {word} not to be modified
 * @description Ensures the HTTP response indicates that the resource is not modified (HTTP response code 304)
 * @param {word} _ placeholder for increased readability
 * @example Then we expect the Book not to be modified
 */
Then("we expect the {word} not to be modified", async function (_) {
    assert.equal(this.result, undefined)
    let response = getResponse(this)
    if (response.statusText) assert.equal(response.statusText, "Not Modified")
    assert.equal(response.status, 304)
})

/**
 * @name Then we expect the access to be forbidden
 * @description Ensures the HTTP response indicates missing authorization to access the previous resource (HTTP response code 401)
 * @example Then we expect the access to be forbidden
 */
Then("we expect the access to be forbidden", async function () {
    assert.equal(this.result, undefined)
    let response = getResponse(this)
    if (response.statusText) assert.equal(response.statusText, "Unauthorized")
    assert.equal(response.status, 401)
})

/**
 * @name Then we expect to be not authorized
 * @description Ensures the HTTP response indicates the access to the previous resource is forbidden (HTTP response code 403)
 * @example Then we expect to be not authorized
 */
Then("we expect to be not authorized", async function () {
    assert.equal(this.result, undefined)
    let response = getResponse(this)
    if (response.statusText) assert.equal(response.statusText, "Forbidden")
    assert.equal(response.status, 403)
})

/**
 * @name Then we expect the {word} is missing
 * @description Ensures the HTTP response indicates the previously accessed resource is missing (HTTP response code 404)
 * @param {word} _ placeholder for increased readability
 * @example Then we expect the book is missing
 */
Then("we expect the {word} is missing", async function (_) {
    assert.equal(this.result, undefined)
    let response = getResponse(this)
    this.error = undefined
    if (response.statusText) assert.equal(response.statusText, "Not Found")
    assert.equal(response.status, 404)
})

/**
 * @name Then we expect that the operation is not allowed
 * @description Ensures the HTTP resource indicates it is not allowed to use the previous method (HTTP response code 405)
 * @example Then we expect that the operation is not allowed
 */
Then("we expect that the operation is not allowed", async function () {
    assert.equal(this.result, undefined)
    let response = getResponse(this)
    if (response.statusText) assert.equal(response.statusText, "Method Not Allowed")
    assert.equal(response.status, 405)
})

/**
 * @name Then we expect the precondition to fail
 * @description Ensures the HTTP resource indicates the precondition is not met (HTTP response code 412)
 * @example Then we expect the precondition to fail
 */
Then("we expect the precondition to fail", async function () {
    assert.equal(this.result, undefined)
    let response = getResponse(this)
    if (response.statusText) assert.equal(response.statusText, "Precondition Failed")
    assert.equal(response.status, 412)
})
