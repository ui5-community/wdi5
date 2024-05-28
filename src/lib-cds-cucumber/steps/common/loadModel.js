/** @ignore **/

const path = require("node:path")
const { env } = require("node:process")

async function loadModel(params = {}) {
    try {
        let root = params.root || ""
        let directory = env.CDS_SERVICE_DIRECTORY || params.directory || ""
        let application = env.CDS_SERVICE_APPLICATION || params.application || ""
        let model = path.join(root, directory, application, "*")
        if (params.testOnly) return model

        const cds = require("@sap/cds")
        const csn = await cds.load(model).then(cds.minify)
        if (!csn) throw Error("Failed to load the model")
        if (!csn.definitions) throw Error("Failed to load the model - missing definitions")
        if (Object.keys(csn.definitions).length === 0) throw Error("Failed to load the model - empty definitions")
        cds.model = cds.compile.for.nodejs(csn)
        if (!cds.model) throw Error("Failed to compile the model")
    } catch (e) {
        console.log(e)
        throw e
    }
}

module.exports = loadModel
