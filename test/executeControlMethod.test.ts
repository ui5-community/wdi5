import { mock } from "node:test"
import { strictEqual } from "node:assert"
import { clientSide_executeControlMethod } from "../src/client-side-js/executeControlMethod"
import type { wdi5Control } from "../src/types/wdi5.types"

const control = { _controlSelector: { selector: { id: "idNavigateBtn" } } } as unknown as wdi5Control
const webElement = {} as WebdriverIO.Element

function browserRejectingWith(message: string) {
    return {
        execute: () => Promise.reject(new Error(message))
    } as unknown as WebdriverIO.Browser
}

describe("clientSide_executeControlMethod", function () {
    let logSpy: ReturnType<typeof mock.method>

    beforeEach(function () {
        logSpy = mock.method(console, "log", () => {})
    })

    afterEach(function () {
        logSpy.mock.restore()
    })

    const realmErrors = [
        "Promise was collected",
        "unknown error - Cannot find context with specified id",
        "stale element reference: element belongs to different document",
        "no such node"
    ]
    for (const methodName of ["firePress", "press", "$press", "tap", "click", "dblclick", "doubleClick"]) {
        for (const message of realmErrors) {
            it(`${methodName}() torn down by navigation ("${message}") is reported as success`, async function () {
                const result = await clientSide_executeControlMethod(
                    webElement,
                    methodName,
                    browserRejectingWith(message),
                    [],
                    control
                )
                strictEqual(result.status, 0)
                strictEqual(result.returnType, "element")
            })
        }
    }

    it("non-press method with a realm error is still reported as failed", async function () {
        const result = await clientSide_executeControlMethod(
            webElement,
            "getText",
            browserRejectingWith("Promise was collected"),
            [],
            control
        )
        strictEqual(result.status, 1)
    })

    it("press method with an unrelated error is still reported as failed", async function () {
        const result = await clientSide_executeControlMethod(
            webElement,
            "firePress",
            browserRejectingWith("javascript error: oControl[methodName] is not a function"),
            [],
            control
        )
        strictEqual(result.status, 1)
    })

    it("successful execution result is passed through", async function () {
        const browser = {
            execute: () => Promise.resolve({ status: 0, result: "ok", returnType: "result" })
        } as unknown as WebdriverIO.Browser
        const result = await clientSide_executeControlMethod(webElement, "getText", browser, [], control)
        strictEqual(result.status, 0)
        strictEqual(result.result, "ok")
    })
})
