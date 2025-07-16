import { mock } from "node:test"
import { wdi5 } from "wdio-ui5-service"
const Logger = wdi5.getLogger()

const expectDefaultErrorMessages = (wdi5Control, spy) => {
    expect(spy.mock.callCount()).toBeTruthy()
    let message = `call of _getControl() failed because of: Error: No DOM element found using the control selector ${JSON.stringify(
        wdi5Control._controlSelector.selector
    )}`
    let mockedCall = spy.mock.calls[0]
    expect(typeof mockedCall.arguments[0]).toEqual("string")
    expect(typeof mockedCall.arguments[1]).toEqual("string")
    expect(mockedCall.arguments[2]).toContain(message)

    message = `error retrieving control: ${wdi5Control._wdio_ui5_key}`
    mockedCall = spy.mock.calls[1]
    expect(typeof mockedCall.arguments[0]).toEqual("string")
    expect(typeof mockedCall.arguments[1]).toEqual("string")
    expect(mockedCall.arguments[2]).toEqual(message)
}

/**
 * test the error logs of the wdi5 logger when controls cannot be found
 * for every test we are using a slightly different selector so we don't have
 * to use "forceSelect: true" all the time
 */
describe("Error logging", () => {
    let spy

    beforeEach(() => {
        spy = mock.method(console, "log", () => {})
    })

    afterEach(() => {
        spy.mock.restore()
    })

    it("should log the correct error messages when control was not found", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongId"
            }
        }
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)
        expect(spy.mock.callCount()).toEqual(2)
    })

    it("should log the correct error messages when 'press' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithPress"
            }
        }
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.press()

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)
        expect(spy.mock.callCount()).toEqual(3)
        const mockedCall = spy.mock.calls[2]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual("cannot call press(), because control could not be found")
    })

    it("should log the correct error messages when 'press' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithPressFluentAsync"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId).press()

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)
        expect(spy.mock.callCount()).toEqual(3)
        const mockedCall = spy.mock.calls[2]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual("cannot call press(), because control could not be found")
    })

    it("should log the correct error messages when 'getAggregation' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithGetAggregation"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.getAggregation("items")

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)

        expect(spy.mock.callCount()).toEqual(3)
        const mockedCall = spy.mock.calls[2]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual(`cannot get aggregation "items", because control could not be found`)
    })

    it("should log the correct error messages when 'getAggregation' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithGetAggregationFluentAsync"
            }
        }
        await browser.asControl(selectorWithWrongId).getAggregation("items")
        // we need the wdi5 control for the assertions. As we are not using forceSelect
        // there should be no additional error messages
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)
        expect(spy.mock.callCount()).toEqual(3)
        const mockedCall = spy.mock.calls[2]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual(`cannot get aggregation "items", because control could not be found`)
    })

    it("should log the correct error messages when 'getAggregation' is executed on an control with a wrong aggregation; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getAggregation("tooltip")

        expect(spy.mock.callCount()).toEqual(1)
        const mockedCall = spy.mock.calls[0]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual(
            "call of _getAggregation() failed because of: Error: Aggregation was not found!"
        )
    })

    it("should log the correct error messages when 'enterText' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithEnterText"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.enterText("test")

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)

        expect(spy.mock.callCount()).toEqual(3)
        const mockedCall = spy.mock.calls[2]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual("cannot call enterText(), because control could not be found")
    })

    it("should log the correct error messages when 'enterText' is executed on an not found control WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithEnterTextFluentAsync"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId).enterText()

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)

        expect(spy.mock.callCount()).toEqual(3)
        const mockedCall = spy.mock.calls[2]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual("cannot call enterText(), because control could not be found")
    })

    it("should log the correct error messages when multiple functions are executed on an control where an error in the queue occurrs; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getWrongFunction().getSecondWrongFunction()

        expect(spy.mock.callCount()).toEqual(2)
        let mockedCall = spy.mock.calls[0]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual(
            `One of the calls in the queue "getWrongFunction().getSecondWrongFunction()" previously failed!`
        )
        mockedCall = spy.mock.calls[1]
        expect(typeof mockedCall.arguments[0]).toEqual("string")
        expect(typeof mockedCall.arguments[1]).toEqual("string")
        expect(mockedCall.arguments[2]).toEqual(`Cannot read property 'getSecondWrongFunction' in the execution queue!`)
    })
})

/**
 * test that the wdi5 logger can be disabled for specific selectors
 * for every test we are using a slightly different selector so we don't have
 * to use "foceSelect: true" all the time
 */
describe("No error logging", () => {
    let spy

    beforeEach(() => {
        // instead of spying on the spy method,
        // we need to double down on console.log
        // b/c of some node process design no one understands
        // that generates multiple instance of the Logger
        // esm - cjs - ts-node - man...
        // this is what you'd expect:
        // spy = sandbox.spy(Logger, "error")
        // instead we need to do:
        spy = mock.method(console, "log", () => {})
    })

    afterEach(() => {
        spy.mock.restore()
    })
    it("should log nothing when control was not found", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdNoLog"
            }
        }
        await browser.asControl(selectorWithWrongId)
        expect(spy.mock.callCount()).toEqual(0)
    })

    it("should log when control was not found with 'logging' explicitly set to 'true'", async () => {
        const selectorWithWrongId = {
            logging: true,
            selector: {
                id: "wrongIdExplicitLog"
            }
        }
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)

        expectDefaultErrorMessages(wdi5ControlWithWrongId, spy)
        expect(spy.mock.callCount()).toEqual(2)
    })

    it("should log nothing when 'press' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithPressNoLog"
            }
        }
        const wdi5ControlWithWrongIdNoLog = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongIdNoLog.press()
        expect(spy.mock.callCount()).toEqual(0)
    })

    it("should log nothing when 'press' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithPressNoLogFluentAsync"
            }
        }
        const wdi5ControlWithWrongIdNoLog = await browser.asControl(selectorWithWrongId).press()

        expect(spy.mock.callCount()).toEqual(0)
    })

    it("should log nothing when 'enterText' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithEnterTextNoLog"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.enterText("test")

        expect(spy.mock.callCount()).toEqual(0)
    })
    it("should log nothing when 'enterText' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithEnterTextNoLogFluentAsync"
            }
        }

        await browser.asControl(selectorWithWrongId).enterText()

        expect(spy.mock.callCount()).toEqual(0)
    })

    it("should log nothing when multiple functions are executed on an control where an error in the queue occurrs; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            forceSelect: true, // we need the forceSelect as the NavFwdButton was already located
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getWrongFunction().getSecondWrongFunction()

        expect(spy.mock.callCount()).toEqual(0)
    })

    it("should log the first selector but not the second", async () => {
        const firstSelectorWithLog = {
            selector: {
                id: "wrongIdWithLog"
            }
        }
        const secondSelectorNoLog = {
            logging: false,
            selector: {
                id: "wrongIdWithoutLog"
            }
        }
        const wdi5ControlWithLogOutput = await browser.asControl(firstSelectorWithLog)
        await browser.asControl(secondSelectorNoLog)

        expectDefaultErrorMessages(wdi5ControlWithLogOutput, spy)
        expect(spy.mock.callCount()).toEqual(2)
    })
})
