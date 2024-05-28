const httpGet = require("./httpGet")

async function inspectInbounds(urlBase, inbounds) {
    let result = {}
    //let inbounds = [["BrowseBooks","/browse/webapp"],["BrowseAuthors","/admin-authors/webapp"],["BrowseGenres","/genres/webapp"],["ManageBooks","/admin-books/webapp"],["ManageOrders","/orders/webapp"]]
    for (let i = 0; i < inbounds.length; i++) {
        let X = inbounds[i]
        if (X[1].startsWith("http")) continue // skip test apps
        let path = X[1]
        if (path[0] != "/") path = "/" + path
        let url = urlBase + path + "/manifest.json"
        let res = await httpGet(url)
        if (res.statusCode == 301) {
            // redirect
            url = urlBase + res.headers.location
            res = await httpGet(url)
        }
        if (res.contentType.indexOf("application/json") == 0) {
            let data = JSON.parse(res.content)
            let { dataSources } = data["sap.app"]
            for (let ds in dataSources) {
                let dso = dataSources[ds]
                if (dso.type != "OData") continue
                let url = urlBase
                let uri = dso.uri
                if (uri[0] != "/") url += "/"
                url += uri
                try {
                    let dsr = await httpGet(url)
                    if (!result[dsr.statusCode]) result[dsr.statusCode] = []
                    if (!result[dsr.statusCode].includes(url)) result[dsr.statusCode].push(url)
                } catch (e) {}
            }
        }
    }
    return result
}

async function findProtectedEndpoint(appUrl, username, password, scan = false) {
    let log = scan ? console.log : () => {}
    log("findProtectedEndpoint", appUrl, username, password, scan)
    let url = new URL(appUrl)
    let res = await httpGet(url)
    log(url.toString(), res.statusCode)
    if (res.statusCode == 200) {
        // detect app shell:	<script id="sap-ushell-bootstrap" src="sandbox.js"></script>
        if (res.content.indexOf("sap-ushell-bootstrap") != -1) {
            log("Detected App shell")
            return "shell"
        }
    }
    if (!scan && res.statusCode == 401) return url
    if (url.pathname.endsWith(".html")) {
        let sp = url.pathname.split("/")
        url.pathname = sp
            .splice(0, sp.length - 1)
            .concat("manifest.json")
            .join("/")
        let res = await httpGet(url)
        log(url.toString(), res.statusCode)
        if (!scan && res.statusCode == 401) return url
        if (username) url.username = username
        if (password) url.password = password
        res = await httpGet(url)
        if (res.statusCode !== 200) throw Error("Could not obtain manifest.json even with credentials!")
        if (res.statusCode == 200) {
            let manifest = JSON.parse(res.content)
            let { dataSources } = manifest["sap.app"]
            for (let name in dataSources) {
                let service = dataSources[name]
                if (service.type !== "OData") continue
                let { uri } = service
                log(`OData(${name}) uri: ${uri}`)
                let url = new URL(appUrl)
                url.pathname = uri
                res = await httpGet(url)
                if (!scan && res.statusCode == 401) return url
                log(url.toString(), res.statusCode)
                if (username) url.username = username
                if (password) url.password = password
                res = await httpGet(url)
                log(res.statusCode)
                if (!scan && res.statusCode == 401) return url
                url.search = "$format=json"
                res = await httpGet(url)
                log(url.toString(), res.statusCode)
                let entities = JSON.parse(res.content)
                for (let i = 0; i < entities.value.length; i++) {
                    let url = new URL(appUrl)
                    url.pathname = uri
                        .split("/")
                        .filter((X) => X.length > 0)
                        .concat(entities.value[i].name)
                        .join("/")
                    let res = await httpGet(url)
                    log(url.toString(), res.statusCode)
                    if (!scan && res.statusCode == 401) return url
                }
            }
        }
    }
}

module.exports = { inspectInbounds, findProtectedEndpoint }
