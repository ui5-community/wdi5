/** @ignore **/

const { When, Then } = require("@wdio/cucumber-framework")

When("find protected data source", async function () {
    let inbounds = await this.controller.getInbounds()
    let inspect = require("../../inspectWebPage").inspectInbounds
    let urlBase = buildUrl(this.process)
    let res = await inspect(urlBase, inbounds)
    if (res["401"]) console.log("Found", res["401"][0])
    else throw Error("Protected data source not found")
})

When("we wait for debugger to attach", async function () {
    await this.controller.waitDebuggerToAttach()
})

When("we wait {int} seconds for debugger to attach", async function (seconds) {
    await this.controller.waitDebuggerToAttach(seconds)
})

Then("sleep for {int} seconds", async function (seconds) {
    await sleep(1000 * seconds)
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
