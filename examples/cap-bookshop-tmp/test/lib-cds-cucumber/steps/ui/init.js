/** @namespace UI **/

/**
 * @module Initialization
 * @memberof UI
 */

const { Given, When } = require("@cucumber/cucumber")

const Controller = require("../../controller")
const loadModel = require("../common/loadModel")

const { env } = process

function infoProcess(process) {
    if (process.pid === 0) console.log(`Connected to process '${process.params?.stack || "node"}'`)
    else console.log(`Started process '${process.params.stack}' with pid ${process.pid}`)
}

/**
 * @name Given we have started the application
 * @description Starts the cds service.
 * @example Given we have started the application
 */
Given("we have started the application", async function () {
    // const startProcess = require("../../startProcess")
    // this.process = await startProcess()
    // this.allProcesses.push(this.process)
    // infoProcess(this.process)
    await loadModel()
})

/**
* @name Given we have started application {string}
* @param {string} application name to start
* @description Starts the cds service of the specified application.
    The application name is passed as a parameter to the cds command.
* @example Given we have started application "fiori"
*/
Given("we have started application {string}", async function (application) {
    const startProcess = require("../../startProcess")
    this.process = await startProcess({ application })
    this.allProcesses.push(this.process)
    infoProcess(this.process, application)
    await loadModel({ application })
})

/**
* @name Given we have started application {string} in path {string}
* @param {string} application name of the application to start
* @param {string} directory directory of the application
* @description Starts the cds service of the specified application.
    The application name is passed as a parameter to the cds command.
    The cds command is started with the specified path as current directory.
* @example Given we have started application "fiori" in path "directory"
*/
Given("we have started application {string} in directory {string}", async function (application, directory) {
    const startProcess = require("../../startProcess")
    this.process = await startProcess({ application, directory })
    this.allProcesses.push(this.process)
    infoProcess(this.process, application)
    await loadModel({ application, directory })
})

/**
 * @name Given we have started the java application
 * @description Starts the java cds service using the following command: "mvn clean spring-boot:run"
 * @example Given we have started the java application
 */
Given("we have started the java application", async function () {
    const startProcess = require("../../startProcess")
    this.process = await startProcess({ stack: "java" })
    this.allProcesses.push(this.process)
    infoProcess(this.process, "java")
    await loadModel()
})

/**
 * @name Given we have started the node application
 * @description Starts the node cds service using the following command: "npx cds-serve"
 * @example Given we have started node application
 */
Given("we have started the node application", async function () {
    const startProcess = require("../../startProcess")
    this.process = await startProcess({ stack: "node" })
    this.allProcesses.push(this.process)
    infoProcess(this.process)
    await loadModel()
})

/**
 * @name Given we have started the java application in path {string}
 * @description Starts the java cds service using the following command: "mvn clean spring-boot:run"
 * @param {string} directory directory of the application
 * @example Given we have started java application
 */
Given("we have started the java application in directory {string}", async function (directory) {
    const startProcess = require("../../startProcess")
    this.process = await startProcess({ stack: "java", directory })
    this.allProcesses.push(this.process)
    infoProcess(this.process)
    await loadModel({ directory })
})

// internal
Given("we have inspected url {string}", async function (url) {
    let { username, password } = getCredentials()
    let info = await inspectUrl(this.process, url, username, password)
    console.log("URL info", url, info) //TODO remove
})

/**
 * @name Given we have set language to {string}
 * @description Sets the used UI language
 * @param {string} language language to use
 * @example Given we have set language to "DE"
 */
Given("we have set language to {string}", async function (language) {
    this.language = language
})

/**
 * @name Given we have opened the url {string}
 * @param {string} url url to open
 * @description Opens the specified url in the browser
 * @example Given we have opened the url "/"
 */
Given("we have opened the url {string}", async function (url) {
    this.controller = new Controller("dummy")
    // this.controller = await openUrl(this.controller, this.process, url, { language: this.language })
})

/**
 * @name Given we have opened the url {string} with user {string}
 * @param {string} url url to open
 * @param {string} username name of the user
 * @description Opens the specified url in the browser and uses the specified username to login
 * @example Given we have opened the url "/" with user "alice"
 */
Given("we have opened the url {string} with user {string}", async function (url, username) {
    process.env.wdi5_username = username
    process.env.wdi5_password = ""
    this.controller = new Controller("dummy")
    // this.controller = await openUrl(this.controller, this.process, url, { username, language: this.language })
})

/**
 * @name Given we have opened the url {string} with user {string} and password {string}
 * @param {string} url url to open
 * @param {string} username name of the user to authenticate with
 * @param {string} password password to use for authentication
 * @description Opens the specified url in the browser and uses the specified username and password to login
 * @example Given we have opened the url "/" with user "alice" and password "admin"
 */
Given(
    "we have opened the url {string} with user {string} and password {string}",
    async function (url, username, password) {
        this.controller = await openUrl(this.controller, this.process, url, {
            username,
            password,
            language: this.language
        })
    }
)

/**
 * @name Given we login with user {string} via {string}
 * @param {string} username name of the user to authenticate with
 * @param {string} endpoint endpoint to use for authentication
 * @description Opens the specified url in the browser and uses the specified username to login
 * @example Given we login with user "alice" via "/"
 */
Given("we login with user {string} via {string}", async function (username, endpoint) {
    await this.controller.authenticate(endpoint, username)
})

/**
 * @name Given we login with user {string} and password {string} via {string}
 * @param {string} username name of the user to authenticate with
 * @param {string} password password to use for authentication
 * @param {string} endpoint endpoint to use for authentication
 * @description Opens the specified url in the browser and uses the specified username to login
 * @example Given we login with user "alice" via "/"
 */
Given("we login with user {string} and password {string} via {string}", async function (username, password, endpoint) {
    await this.controller.authenticate(endpoint, username, password)
})

/**
 * @name When we navigate to url {string}
 * @param {string} url url to open
 * @description Points the already opened browser to the specified url
 * @example When we navigate to url "/"
 */
When("we navigate to url {string}", async function (url) {
    url = buildUrl(this.process, url)
    await this.controller.openUrl(url)
    if (!(await this.controller.initializeLibrary())) throw Error("Failed to initialize the library!")
    await this.controller.waitBlockers(200)
})

/**
 * @name When we quit
 * @description Closes the current browser
 * @example When we quit
 */
When("we quit", async function () {
    if (this.controller) {
        await this.controller.quit()
        this.controller = undefined
    }
})

// internal
When("we logout", async function () {
    await this.controller.pressLogOutButton()
    await this.controller.waitToLoad()
    await this.controller.pressButtonInDialog("OK", "Sign Out")
    if (!(await this.controller.initializeLibrary())) throw Error("Failed to initialize the library!")
})

function buildUrl(process, url) {
    if (url && url.startsWith("http")) return url
    let hostname = env.REMOTE_HOSTNAME || "localhost"
    let port = env.REMOTE_PORT ? parseInt(env.REMOTE_PORT) : process ? process.port : 4004
    if (!url) return `http://${hostname}:${port}`
    if (!url.startsWith("http")) {
        if (!url.startsWith("/")) url = "/" + url
        url = `http://${hostname}:${port}${url}`
    }
    return replaceUrl(url)
}

async function openUrl(controller, process, url, options) {
    let waitBlockersIter = 500
    if (options.language) waitBlockersIter *= 50
    let { username, password } = getCredentials(options)
    url = buildUrl(process, url)
    let info = await inspectUrl(process, url, username, password)
    const isUI5url = info.ui5bootstrap

    if (controller && (!info.protected || controller.username === username)) {
        await controller.openUrl(url, options.language)
        if (isUI5url) {
            if (!(await controller.initializeLibrary())) throw Error("Failed to initialize the library!")
            await controller.waitBlockers(waitBlockersIter)
        }
        return controller
    }
    if (controller) {
        // terminate current browser
        await controller.quit()
        controller = undefined
    }
    try {
        controller = new Controller(process)
        await controller.initDriver()
        let protectedOdataEndpoint
        if (isUI5url) {
            let { findProtectedEndpoint } = require("../../inspectWebPage")
            protectedOdataEndpoint = await findProtectedEndpoint(url)
            if (!username && protectedOdataEndpoint)
                throw Error(`URl ${url} requires username for endpoint ${protectedOdataEndpoint.href}`)
        }
        let isShell = protectedOdataEndpoint == "shell"
        if (username && isUI5url) {
            if (protectedOdataEndpoint && protectedOdataEndpoint !== "shell") {
                controller.username = username
                let credUrl = new URL(protectedOdataEndpoint)
                credUrl.username = username
                credUrl.password = password
                {
                    // validate
                    const httpGet = require("../../httpGet")
                    let res = await httpGet(credUrl)
                    if (res.statusCode != 200)
                        throw Error(`http get '${credUrl.toString()}' failed with ${res.statusCode}`)
                }
                await controller.openUrl(credUrl, options.language)
            }
        }
        await controller.openUrl(url, options.language)
        if (isUI5url) {
            if (!(await controller.initializeLibrary())) throw Error("Failed to initialize the library!")
            await controller.waitBlockers(waitBlockersIter)
        }
        if (isShell) {
            // find odata endpoint returning 401 Unauthorized Error
            let { inspectInbounds } = require("../../inspectWebPage")
            let inbounds = await controller.getInbounds()
            let urlBase = buildUrl(process)
            let res = await inspectInbounds(urlBase, inbounds)
            if (res["401"])
                // use first protected endpoint to authenticate
                await controller.authenticate(res["401"][0], username, password)
            else throw Error("Protected data source not found")
        }
    } catch (e) {
        if (controller) controller.quit()
        throw e
    }
    return controller
}

async function inspectUrl(process, url, username, password) {
    url = buildUrl(process, url)
    const httpGet = require("../../httpGet")
    let { statusCode, content } = await httpGet(url)
    const isProtected = statusCode === 401 // not authorized
    let protectedStatusCode
    if (isProtected && username) {
        url = new URL(url)
        url.username = username
        url.password = password
        ;({ content, statusCode: protectedStatusCode } = await httpGet(url))
    }
    let ui5bootstrap
    let fioriPreview
    if (statusCode == 200 || protectedStatusCode == 200) {
        ui5bootstrap = !!content.match("sap-ui-bootstrap")
        fioriPreview = !!content.match("Fiori preview")
    }
    return {
        statusCode,
        protectedStatusCode,
        protected: isProtected,
        fioriPreview,
        ui5bootstrap
    }
}

function getCredentials(options = {}) {
    return {
        username: options.username || env.CDS_USERNAME,
        password: options.password || env.CDS_PASSWORD
    }
}

function replaceUrl(url) {
    if (env.REPLACE_PAGE) {
        if (env.REPLACE_PAGE === url) {
            if (env.REPLACE_PREFIX) {
                url = env.REPLACE_PREFIX + url
                console.log("REPLACED: " + url)
            } else if (env.SAP_UI5_VERSION) {
                url = env.SAP_UI5_VERSION + "-" + url
                console.log("REPLACED: " + url)
            }
        } else if (url.indexOf(env.REPLACE_PAGE) != -1) {
            let prefix = env.REPLACE_PREFIX || env.SAP_UI5_VERSION + "-"
            url = url.replace(env.REPLACE_PAGE, prefix + env.REPLACE_PAGE)
            console.log("REPLACED: " + url)
        }
    }
    return url
}
