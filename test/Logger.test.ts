import * as sinon from "sinon"
import { notStrictEqual, strictEqual } from "assert"
import { wdi5 } from "../src/wdi5"

describe("wdi5 logger", () => {
    it("empty scope results in default 'wdi5'", () => {
        const logSpy = sinon.spy(console, "log")
        const logger = wdi5.getLogger()
        logger.log("test")
        strictEqual(logSpy.getCall(0).args[1].includes("wdi5"), true)
        logSpy.restore()
    })

    it("custom scope is included as log tag", () => {
        const tag = "my-scope"
        const logSpy = sinon.spy(console, "log")
        const logger = wdi5.getLogger(tag)
        logger.log("test")
        strictEqual(logSpy.getCall(0).args[1].includes(tag), true)
        logSpy.restore()
    })
    it("requesting different scopes delivers different logging instance", () => {
        const logger1 = wdi5.getLogger("some-scope1")
        const logger2 = wdi5.getLogger("some-scope2")
        notStrictEqual(logger1, logger2)
    })
    it("requesting a scope delivers the same logger instance", () => {
        const logger1 = wdi5.getLogger("some-scope")
        const logger2 = wdi5.getLogger("some-scope")
        strictEqual(logger1, logger2)
    })
})
