/** @namespace OData **/

/**
 * @module Initialization
 * @memberof OData
 */

const { env } = require("node:process")
const { After, Given } = require("@cucumber/cucumber")
const assert = require("assert")

After(async function () {
    const cds = require("@sap/cds")
    for (let name in cds.env.requires) {
        if (cds.env.requires[name].dynamic) {
            delete cds.env.requires[name]
        }
    }
    if (this.cdsService) delete this.cdsService
    if (this.server) {
        this.server.close()
        delete this.server
    }
    if (this.error) {
        throw Error("Pending error: " + this.error.stack)
    }
})

/**
 * @name Given we have started embedded server
 * @description Initializes the CAP service in embedded mode utilizing the model of the current application,
 *              enabling port rotation and configuring the sqlite database usage with in-memory option.
 * @example Given we have started embedded server
 */
Given("we have started embedded server", async function () {
    if (getRemotePort()) {
        // remote service port configured - do not start embedded server
        const loadModel = require("../common/loadModel")
        await loadModel()
        return
    }
    const cds = require("@sap/cds")
    cds.log("remote")._warn = false // disable warnings
    cds.log("deploy")._info = false // disable deploy info
    cds.requires.db = {
        kind: "sqlite"
    }
    cds.env.in_memory = true
    cds.env.port = 0 // enable port rotation
    if (this.server) throw Error("Embedded server already started")
    this.server = await cds.server(cds.env) // start server
    this.port = this.server.address().port // save the port
})

/**
 * @name Given we have connected to service {word}
 * @description Connects to the specified service
 * @param {word} serviceName name of the service to connect to
 * @example Given we have connected to service bookshop
 */
Given("we have connected to service {word}", async function (serviceName) {
    let port = getRemotePort() || this.process?.port || this.port
    if (port) await configureRemoteService(serviceName, port)
    await connect(this, serviceName)
})

/**
 * @name Given we have connected to service {word} as user {string} with password {string}
 * @description Connects to the specified service using the provided credentials
 * @param {word} serviceName name of the service to connect to
 * @param {string} username name of the user to connect with
 * @param {string} password valid password to use for authentication
 * @example Given we have connected to service bookshop as user "alice" with password "secret"
 */
Given(
    "we have connected to service {word} as user {string} with password {string}",
    async function (serviceName, username, password) {
        if (this.process) {
            const loadModel = require("../common/loadModel")
            await loadModel()
        }
        let port = getRemotePort() || this.process?.port || this.port
        let serviceNameWithUser = await configureRemoteService(serviceName, port, username, password)
        await connect(this, serviceNameWithUser)
    }
)

/**
 * @name Given we have connected to service {word} in directory {string} as user {string} with password {string}
 * @description Connects to the specified service located in the mentioned directory using the provided credentials
 * @param {word} serviceName name of the service to connect to
 * @param {string} directory name of the directory where the service is located
 * @param {string} username name of the user to connect with
 * @param {string} password valid password to use for authentication
 * @example Given we have connected to service bookshop in directory "fiori" as user "alice" with password "secret"
 */
Given(
    "we have connected to service {word} in directory {string} as user {string} with password {string}",
    async function (serviceName, directory, username, password) {
        let port = getRemotePort() || this.process?.port || this.port
        let serviceNameWithUser = await configureRemoteService(serviceName, port, username, password, directory)
        await connect(this, serviceNameWithUser)
    }
)

async function connect(that, serviceName) {
    if (cds.failedServices && cds.failedServices[serviceName])
        // prevent to connect twice to failing services as it blocks the execution
        throw Error(`Already failed to connect to ${serviceName} with error ${cds.failedServices[serviceName]}`)
    try {
        that.cdsService = await cds.connect.to(serviceName) // connect to odata service
        that.run = tryRun.bind(that)
        that.serviceName = serviceName
        if (getRemotePort()) await that.cdsService.get("/") // perform single GET to check the connection
        that.storeResult = storeResult.bind(that)
        that.getEntity = getEntity.bind(that)
        that.getResultKeys = getResultKeys.bind(that)
        that.selectFrom = selectFrom.bind(that)
        that.initPrepare = initPrepare.bind(that)
        that.initPrepare()
    } catch (e) {
        // persist failed connection establishments
        if (!cds.failedServices) cds.failedServices = {}
        cds.failedServices[serviceName] = e
        throw e
    }
}

async function configureRemoteService(serviceName, port, username, password, directory) {
    if (!port) throw Error("Missing service port")
    try {
        const loadModel = require("../common/loadModel")
        await loadModel(directory)
        if (!cds.model.definitions[serviceName])
            throw Error(`Service ${serviceName} not found, available: ${Object.keys(cds.model.definitions)}`)
    } catch (e) {
        console.log(e.stack)
        throw e
    }

    const hostname = getRemoteHostname()
    let path = cds.model.definitions[serviceName].path || cds.model.definitions[serviceName]["@path"]
    this.url = `http://${hostname}:${port}${path}`

    // inject odata service
    if (!cds.env.requires) cds.env.requires = {}
    let credentials = { url: this.url }
    if (username) {
        serviceName = `${username}/${password}@${serviceName}:${port}` // user dependent service name
        Object.assign(credentials, { username, password, authentication: "BasicAuthentication" })
    }
    cds.env.requires[serviceName] = {
        dynamic: true,
        kind: "odata",
        service: serviceName,
        credentials
    }
    return serviceName
}

function storeResult(result, entity = undefined) {
    this.result = result
    this.resultEntity = entity || this.entity
}

function getRemotePort() {
    return env.REMOTE_PORT
}

function getRemoteHostname() {
    return env.REMOTE_HOSTNAME || "localhost"
}

async function tryRun(query) {
    try {
        // TODO check for unhandled this.error?
        this.error = undefined
        return await this.cdsService.run(query)
    } catch (error) {
        this.error = error
    }
    return undefined
}

function getEntity(entity) {
    let result = cds.model.entities[`${entity}`]
    if (!result) result = cds.model.entities[`${this.serviceName}.${entity}`]
    return result
}

function getResultKeys(result = undefined) {
    const service = this.serviceName
    const entity = this.resultEntity
    const instance = result || this.result

    assert.ok(instance, "getResultKeys: result not set)")

    if (Array.isArray(instance)) return instance.map(this.getResultKeys)

    let name = `${service}.${entity}`
    const E = cds.model.definitions[name]
    let resultKeys = {}
    for (let prop in E.elements) {
        let value = instance[prop]
        if (E.elements[prop].key) resultKeys[prop] = value
    }
    ;["IsActiveEntity"].forEach((prop) => {
        if (instance[prop] !== undefined) resultKeys[prop] = instance[prop]
    })
    if (Object.keys(resultKeys).length === 1) return resultKeys // one key - no string quoting needed
    for (let key in resultKeys) {
        if (E.elements[key].type === "cds.UUID")
            resultKeys[key] = `${resultKeys[key]}` // do not quote UUIDs
        else if (typeof resultKeys[key] === "string") resultKeys[key] = `'${resultKeys[key]}'` // quote strings
    }
    return resultKeys
}

async function selectFrom(instance = undefined) {
    let entity = this.prepare.entity || this.entity
    let keys = instance ? this.getResultKeys(instance) : undefined
    let query = SELECT(entity, keys)
    let columns = Object.assign([], this.prepare.columns)
    this.prepare.expand.forEach((item) => {
        if (typeof item === "string") columns.push({ ref: [item], expand: ["*"] })
        else columns.push({ ref: [item.field], expand: [{ ref: item.select }] })
    })
    if (columns.length > 0) query.columns(columns)
    if (this.prepare.where) {
        query = query.where(this.prepare.where)
    }
    if (this.prepare.orderBy.length > 0) {
        let orderBy = this.prepare.orderBy.map((X) => {
            return { ref: X[0].split("."), sort: X[1] }
        })
        query = query.orderBy(...orderBy)
    }
    if (this.prepare.groupBy.length > 0) {
        query = query.groupBy(...this.prepare.groupBy)
    }
    if (this.prepare.limit !== undefined) {
        if (this.prepare.offset !== undefined) query.limit(this.prepare.limit, this.prepare.offset)
        else query.limit(this.prepare.limit)
    }
    this.storeResult(await this.cdsService.run(query))
    this.initPrepare()
}

function initPrepare(operation = undefined, entity = undefined) {
    this.prepare = {
        operation: operation || "read",
        entity: entity || this.entity,
        where: undefined,
        columns: [],
        expand: [],
        orderBy: [],
        groupBy: [],
        limit: undefined,
        offset: undefined
    }
}
