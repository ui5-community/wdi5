/**
 * @module Query
 * @memberof OData
 */

const assert = require("assert")

const { When } = require("@wdio/cucumber-framework")

/**
 * @name When we prepare to {word} entity {word}
 * @description Prepares internal structure to perform the specified operation on the target entity
 * @param {word} operation name of the CRUD operation, currently supported: 'read'
 * @param {word} entity target entity
 * @example When we prepare to read entity Books
 */
When("we prepare to {word} entity {word}", async function (operation, entity) {
    this.initPrepare(operation, entity)
})

// we have entity and result already
/**
 * @name When we prepare to {word} this {word}
 * @description Prepares internal structure to perform the specified operation on the previously mentioned entity
 * @param {word} operation name of the CRUD operation, currently supported: 'read'
 * @param {word} _ placeholder for increased readability
 * @example When we prepare to read this Book
 */
When("we prepare to {word} this {word}", async function (operation, _) {
    this.initPrepare(operation)
})

/**
 * @name When field {word} equals {int}
 * @description Extends the current query speficying a WHERE clause requiring the specified field to be equal to the specified value
 * @param {word} field name of the field to check
 * @param {int} value name of the integer vlaue perform the equation operator with
 * @example And field Count equals 100
 */
When("field {word} equals {int}", async function (field, value) {
    this.prepare.where = { [field]: value }
})

/**
 * @name When select its {word}
 * @description MArks the specified field as requested in the current query
 * @param {word} field name of the field to include in the result
 * @example And select its Title
 */
When("select its {word}", async function (field) {
    this.prepare.columns.push(field)
})

/**
 * @name When select the count of records
 * @description Requests the current query to return the count of selected records
 * @example And select the count of records
 */
When("select the count of records", async function () {
    this.prepare.columns.push({ func: "count", args: ["*"], as: "$count" })
})

/**
 * @name When aggregate {word} using {}
 * @description Specifies the current query should perform aggregation operation using the specified function
 * @param {word} field name of hte target field to perform the operation on
 * @param {} func name of the function to use when performing the aggregation
 * @example And aggregate Price using max
 */
When("aggregate {word} using {}", async function (field, func) {
    this.prepare.columns.push({ func, args: [field], as: "$" + func })
})

/**
 * @name When aggregate {word} into {word} using {}
 * @description Specifies the current query should perform aggregation operation using the specified function
 *             and provides an alias for the resulting value
 * @param {word} field name of the field to use while performing the aggregation
 * @param {word} alias name of the alias
 * @param {} func name of the function to use when performing the aggregation
 * @example And aggregate Price into Total using sum
 */
When("aggregate {word} into {word} using {}", async function (field, alias, func) {
    this.prepare.columns.push({ func, args: [field], as: alias })
})

/**
 * @name When order by {word}
 * @description Requires the current query to order the result using the specified field
 * @param {word} field name of the field to use while ordering the records
 * @example And order by Price
 */
When("order by {word}", async function (field) {
    this.prepare.orderBy.push([field, "asc"])
})

/**
 * @name When order descending by {word}
 * @description Requires the current query to order the result in descending order using the specified field
 * @param {word} field name of the field to use while ordering the records
 * @example And order descending by Price
 */
When("order descending by {word}", async function (field) {
    this.prepare.orderBy.push([field, "desc"])
})

/**
* @name When expand field {word} by selecting its {word}
* @description Requires the current query to expand the specified association
      and return the requested field being part of the associated entity
* @param {word} associationName name of the association to expand
* @param {word} field name of the field of the associated record to return
* @example And expand field Name by selecting its author
*/
When("expand field {word} by selecting its {word}", async function (associationName, field) {
    this.prepare.expand.push({ field: associationName, select: [field] })
})

/**
 * @name When expand field {word}
 * @description Requires the current query to expand the specified association
 * @param {word} associationName name of the association to expand
 * @example And expand field author
 */
When("expand field {word}", async function (associationName) {
    this.prepare.expand.push(associationName)
})

/**
 * @name When group by {word}
 * @description Requires the current query to group the result by the specified field
 * @param {word} field name of the field to group by
 * @example And group by category
 */
When("group by {word}", async function (field) {
    this.prepare.groupBy.push(field)
})

/**
 * @name When limit to {int} records
 * @description Requires the current query to limit the count of records returned as a result of the operation
 * @param {int} limit requested number of records
 * @example And limit to 5 records
 */
When("limit to {int} records", async function (limit) {
    this.prepare.limit = limit
})

/**
 * @name When skip first {int} records
 * @description Requires the current query to skip the first N records returned as a result of the operation
 * @param {int} offset cound of records to skip
 * @example And skip first 5 records
 */
When("skip first {int} records", async function (offset) {
    this.prepare.offset = offset
})

/**
 * @name When do perform the {word}
 * @description Performs the already prepared query
 * @param {word} operation name of the operation that should be the same as the one used in the already prepared query
 * @example And do perform the read
 */
When("do perform the {word}", async function (operation) {
    assert.equal(this.prepare.operation, operation)
    await this.selectFrom()
})
