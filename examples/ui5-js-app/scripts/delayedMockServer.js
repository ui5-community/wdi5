const femiddleware = require("@sap-ux/ui5-middleware-fe-mockserver")

module.exports = async function middleware(middlewareConfig) {
    const feMiddleware = await femiddleware(middlewareConfig)
    return async (req, res, next) => {
        if (req.originalUrl.startsWith("/V2") && req.originalUrl.includes("/Categories")) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            feMiddleware(req, res, next)
            return
        }
        next()
    }
}
