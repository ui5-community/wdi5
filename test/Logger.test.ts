import { mock } from "node:test"
import { notStrictEqual, strictEqual } from "node:assert"
import { wdi5 } from "../src/wdi5"

describe("wdi5 logger", function () {
    it("empty scope results in default 'wdi5'", function () {
        const logSpy = mock.method(console, "log", () => {})
        const logger = wdi5.getLogger()
        logger.log("test")
        strictEqual(logSpy.mock.calls[0].arguments[1].includes("wdi5"), true)
        logSpy.mock.restore()
    })

    it("custom scope is included as log tag", function () {
        const tag = "my-scope"
        const logSpy = mock.method(console, "log", () => {})
        const logger = wdi5.getLogger(tag)
        logger.log("test")
        strictEqual(logSpy.mock.calls[0].arguments[1].includes(tag), true)
        logSpy.mock.restore()
    })

    it("requesting different scopes delivers different logging instance", function () {
        const logger1 = wdi5.getLogger("some-scope1")
        const logger2 = wdi5.getLogger("some-scope2")
        notStrictEqual(logger1, logger2)
    })

    it("requesting a scope delivers the same logger instance", function () {
        const logger1 = wdi5.getLogger("some-scope")
        const logger2 = wdi5.getLogger("some-scope")
        strictEqual(logger1, logger2)
    })
})
