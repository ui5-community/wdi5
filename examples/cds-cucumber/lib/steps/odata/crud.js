/**
 * @module CRUD
 * @memberof OData
 */

const { Given, When, Then } = require("@wdio/cucumber-framework")

/**
 * @name Given we have created a new empty record
 * @description Create a new empty record targeting previously specified entity
 * @example Given we have created a new empty record
 */
Given("we have created a new empty record", async function () {
    const record = {}
    this.storeResult(await this.cdsService.create(this.entity, record))
})

/**
 * @name Given we have created a new empty record in entity {word}
 * @description Create a new empty record targeting the specified entity
 * @param {word} entity target entity name
 * @example Given we have created a new empty record in entity Books
 */
Given("we have created a new empty record in entity {word}", async function (entity) {
    this.entity = entity
    const record = {}
    this.storeResult(await this.cdsService.create(entity, record), entity)
})

/**
 * @name Given we have created a new record
 * @description Create a new record targeting previously specified entity
 * @param {attachment} data provides JSON-formatted record
 * @example Given we have created a new record
 * """
 * { "id":1, "name": "new instance" }
 * """
 */
Given("we have created a new record", async function (data) {
    const record = JSON.parse(data)
    this.storeResult(await this.cdsService.create(this.entity, record), this.entity)
})

/**
 * @name Given we have created a new record in entity {word}
 * @description Create a new record targeting the specified entity
 * @param {word} entity target entity name
 * @param {attachment} data provides JSON-formatted record
 * @example Given we have created a new record in entity Books
 * """
 * { "id":1, "name": "new book" }
 * """
 */
Given("we have created a new record in entity {word}", async function (entity, data) {
    this.entity = entity
    const record = JSON.parse(data)
    this.storeResult(await this.cdsService.create(entity, record), entity)
})

/**
 * @name Given we have created new records in entity {word}
 * @description Create a new record targeting the specified entity
 * @param {word} entity target entity name
 * @param {attachment} data provides the JSON-formatted record
 * @example Given we have created new records in entity {word}
 */
Given("we have created new records in entity {word}", async function (entity, data) {
    this.entity = entity
    const records = JSON.parse(data)
    // TODO        Deserialization Error: Value for structural type must be an object.
    //           at run (.../node_modules/@sap/cds/libx/_runtime/remote/utils/client.js:310:31)
    // this.storeResult(await this.cdsService.create(entity, records));
    let result = []
    for (let record of records) result.push(await this.cdsService.create(entity, record))
    this.storeResult(result, entity)
})

/**
 * @name Given we have created a new record with {word} set to {float}
 * @description Create a new record targeting previously specified entity
 * @param {word} field name of the target field
 * @param {float} value float value to store into the specified field
 * @example Given we have created a new record with Price set to 12,50
 */
Given("we have created a new record with {word} set to {float}", async function (field, value) {
    const record = { [field]: value }
    this.storeResult(await this.cdsService.create(this.entity, record))
})

/**
 * @name Given we have created a new record with {word} set to {string}
 * @description Create a new record targeting previously specified entity
 * @param {word} field name of the target field
 * @param {string} value string value to store into the specified field
 * @example Given we have created a new record with Name set to "New Name"
 */
Given("we have created a new record with {word} set to {string}", async function (field, value) {
    const record = { [field]: value }
    this.storeResult(await this.cdsService.create(this.entity, record))
})

// TODO try to reduce to one step using model info -> type casting?
/**
 * @name Given we have created a new record with {word} set to {word}
 * @description Create a new record targeting previously specified entity
 * @param {word} field name of the target field
 * @param {word} value value to store into the specified field
 * @example Given we have created a new record with Status set to Open
 */
Given("we have created a new record with {word} set to {word}", async function (field, value) {
    const record = { [field]: value }
    this.storeResult(await this.cdsService.create(this.entity, record))
})

/**
 * @name Given we have read records matching {word} equal to {string}
 * @description Performs a read request targeting previously specified entity while filtering by the specified field equal to the provided value
 * @param {word} field name of the field to use in the filter
 * @param {string} value exact value to match the specified field with
 * @example Given we have read records matching Title equal to "New Title"
 */
Given("we have read records matching {word} equal to {string}", async function (field, value) {
    let query = SELECT.from(this.entity).where({ [field]: value })
    this.storeResult(await this.cdsService.run(query))
})

/**
 * @name When we read all records
 * @description Performs a read request without any restrictions targeting previously specified entity
 * @example When we read all records
 */
When(/^we read all records$/, async function () {
    this.storeResult(await this.cdsService.run(SELECT(this.entity)))
})

/**
 * @name When we read all records from entity {word}
 * @description Performs a read request without any restrictions targeting the specified entity
 * @param {word} entity target entity name
 * @example When we read all records from entity Books
 */
When("we read all records from entity {word}", async function (entity) {
    this.entity = entity
    this.storeResult(await this.cdsService.run(SELECT(entity)))
})

// fields: comma-separated list of names with optional aliases, also support expressions
// see: https://cap.cloud.sap/docs/node.js/cds-ql#select-columns
// example: field1,field1 as alias1,field1||field2 as alias2
/**
 * @name When we read entity {word} by selecting the following fields
 * @description Performs a read request targeting the specified entity and obtaining only the requested fields
 * @param {word} entity target entity name
 * @param {attachment} fields comma-separated list of fields provided as a string attachment
 * @example When we read entity Books by selecting the following fields
 * """
 * id, name, price
 * """
 */
When("we read entity {word} by selecting the following fields", async function (entity, fields) {
    this.entity = entity
    this.prepare.columns.push(...fields.split(",").map((F) => F.trim()))
    await this.selectFrom()
})

/**
 * @name When we read entity {word} by selecting {word} and {word}
 * @description Performs a read request targeting the specified entity and obtaining only the requested two fields
 * @param {word} entity target entity name
 * @param {word} fieldName1 first target field
 * @param {word} fieldName2 second target field
 * @example When we read entity Books by selecting name and price
 */
When("we read entity {word} by selecting {word} and {word}", async function (entity, fieldName1, fieldName2) {
    this.entity = entity
    this.prepare.columns.push(fieldName1, fieldName2)
    await this.selectFrom()
})

/**
 * @name When we read entity {word} by selecting {word}
 * @description Performs a read request targeting the specified entity and obtaining only the requested field
 * @param {word} entity target entity name
 * @param {word} fieldName target field
 * @example When we read entity Books by selecting title
 */
When("we read entity {word} by selecting {word}", async function (entity, fieldName) {
    this.entity = entity
    this.prepare.columns.push(fieldName)
    await this.selectFrom()
})

/**
 * @name When we read entity {word} by expanding {word}
 * @description Performs a read request targeting the specified entity and expanding the specified association
 * @param {word} entity target entity name
 * @param {word} associationName association to follow
 * @example When we read entity Author by expanding books
 */
When("we read entity {word} by expanding {word}", async function (entity, associationName) {
    this.entity = entity
    this.prepare.columns.push({ ref: [associationName], expand: ["*"] })
    await this.selectFrom()
})

/**
 * @name When we use the following filter
 * @description Appends the specified filter to the WHERE clause of the current query ( see: {@link https://cap.cloud.sap/docs/node.js/cds-ql#where|CDS QL: where} )
 * @param {attachment} filter specified filter provided as a JSON-formatted string attachment
 * @example When we use the following filter
 * """
 * [{ "ref": ["id"] }, ">", { "val": 2 }]
 * """
 */
When("we use the following filter", async function (filter) {
    this.prepare.where = JSON.parse(filter)
})

/**
 * @name When we want to order ascending by {word}
 * @description Appends the specified field to the ORDER BY clause of the current query requesting ascending order of the values
 * @param {word} field name of the field to use
 * @example When we want to order ascending by {word}
 */
When("we want to order ascending by {word}", async function (field) {
    this.prepare.orderBy.push([field, "asc"])
})

/**
 * @name When we want to order descending by {word}
 * @description Appends the specified field to the ORDER BY clause of the current query requesting descending order of the values
 * @param {word} field name of the field to use
 * @example When we want to order descending by {word}
 */
When("we want to order descending by {word}", async function (field) {
    this.prepare.orderBy.push([field, "desc"])
})

/**
 * @name When we want to group by {word}
 * @description Appends the specified field to the GROUP BY clause of the current query
 * @param {word} field name of the field to use when grouping the records
 * @example When we want to group by {word}
 */
When("we want to group by {word}", async function (field) {
    this.prepare.groupBy.push(field)
})

// Update

/**
 * @name When we update the record with the following data
 * @description Performs an update of a record identified by the previously stored keys
 * @param {attachment} data specified the fields with corresponding values as a JSON-formatted string to use in the update operation
 * @example When we update the record with the following data
 */
When("we update the record with the following data", async function (data) {
    const record = JSON.parse(data)
    this.storeResult(await this.run(UPDATE(this.entity, this.getResultKeys()).with(record)))
})

/**
 * @name When we update records by setting {string} to {string} using filter
 * @description Performs an update of a field in records matching the specified filter
 * @param {string} field name of the field to update
 * @param {string} value value update the field with
 * @param {attachment} filter JSON-formatted string used to identify the target records
 * @example When we update records by setting {string} to {string} using filter
 */
When("we update records by setting {string} to {string} using filter", async function (field, value, filter) {
    const record = { [field]: value }
    this.storeResult(await this.run(UPDATE(this.entity, JSON.parse(filter)).with(record)))
})

/**
 * @name When we delete the record from entity {word}
 * @description Deletes record identified by the previously stored keys located in the target entity
 * @param {word} entity target entity name
 * @example When we delete the record from entity {word}
 */
When("we delete the record from entity {word}", async function (entity) {
    this.storeResult(await this.run(DELETE(entity, this.getResultKeys())))
})

/**
 * @name When we delete matching records from entity {word}
 * @description Deletes the records located in the target entity and matching filter provided as JSON-formatted string
 * @param {word} entity target entity name
 * @param {attachment} filter JSON-formatted string specifying the filter to use
 * @example When we delete matching records from entity {word}
 */
When("we delete matching records from entity {word}", async function (entity, filter) {
    this.storeResult(await this.run(DELETE(entity).where(JSON.parse(filter))))
})

/**
 * @name When we delete the records
 * @description Delete previously selected records using their keys
 * @example When we delete the records
 */
When("we delete the records", async function () {
    this.storeResult(
        await Promise.all(
            this.result.map(async (result) => await this.run(DELETE(this.entity, this.getResultKeys(result))))
        )
    )
})

/**
 * @name When we delete the record
 * @description Delete previously selected record using its key
 * @example When we delete the record
 */
When("we delete the record", async function () {
    this.storeResult(await this.run(DELETE(this.entity, this.getResultKeys())))
})

/**
 * @name Then read all records in entity {word}
 * @description Obtain a list of all records in an entity by selecting their IDs
 * @param {word} entity target entity name
 * @example Then read all records in entity Books
 */
Then("read all records in entity {word}", async function (entity) {
    this.storeResult(await this.cdsService.run(SELECT.from(entity).columns("ID")))
})

/**
 * @name Then show result keys
 * @description Prints the current results keys on the console
 * @example Then show result keys
 */
Then("show result keys", async function () {
    console.log(this.getResultKeys())
})

/**
 * @name Then show the result
 * @description Prints the current result on the console
 * @example Then show the result
 */
Then("show the result", async function () {
    console.log(this.result)
})

/**
 * @name When we read {word} of entity {word} with key {int}
 * @description Selects the associated records of record with the specified key the target entity
 * @param {word} association name of the association to follow
 * @param {word} entity target entity name
 * @param {int} key key of the target record
 * @example When we read auhtor of entity Books with key 1001
 */
When("we read {word} of entity {word} with key {int}", async function (association, entity, key) {
    query = cds.parse.cql(`SELECT * from ${entity}[${key}]:${association}`)
    this.storeResult(await this.run(query))
})
