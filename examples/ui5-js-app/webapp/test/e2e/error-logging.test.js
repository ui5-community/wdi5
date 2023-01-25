const { afterEach } = require("mocha")
const sinon = require("sinon")
const { wdi5 } = require("wdio-ui5-service")
const Logger = wdi5.getLogger()

const expectDefaultErrorMessages = (wdi5Control) => {
    expect(Logger.error.called).toBeTruthy()
    expect(
        Logger.error
            .getCall(0)
            .calledWith(
                `call of _getControl() failed because of: Error: No DOM element found using the control selector ${JSON.stringify(
                    wdi5Control._controlSelector.selector
                )}`
            )
    ).toBeTruthy() // dirty but otherwise we have no access to the selector
    expect(Logger.error.getCall(1).calledWith(`error retrieving control: ${wdi5Control._wdio_ui5_key}`)).toBeTruthy() // dirty but otherwise we have no acces to the key
}

/**
 * test the error logs of the wdi5 logger when controls cannot be found
 * for every test we are using a slightly different selector so we don't have
 * to use "foceSelect: true" all the time
 */
describe("Error logging", () => {
    const sandbox = sinon.createSandbox()

    beforeEach(() => {
        sandbox.spy(Logger, "error")
    })

    afterEach(() => {
        sandbox.restore()
    })

    it("should log the correct error messages when control was not found", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongId"
            }
        }
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)

        expectDefaultErrorMessages(wdi5ControlWithWrongId)
        expect(Logger.error.callCount).toEqual(2)
    })

    it("should log the correct error messages when 'press' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithPress"
            }
        }
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.press()

        expectDefaultErrorMessages(wdi5ControlWithWrongId)
        expect(Logger.error.callCount).toEqual(3)
        expect(
            Logger.error.getCall(2).calledWith("cannot call press(), because control could not be found")
        ).toBeTruthy()
    })

    it("should log the correct error messages when 'press' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithPressFluentAsync"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId).press()

        expectDefaultErrorMessages(wdi5ControlWithWrongId)
        expect(Logger.error.callCount).toEqual(3)
        expect(
            Logger.error.getCall(2).calledWith("cannot call press(), because control could not be found")
        ).toBeTruthy()
    })

    it("should log the correct error messages when 'getAggregation' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithGetAggregation"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.getAggregation("items")

        expectDefaultErrorMessages(wdi5ControlWithWrongId)

        expect(Logger.error.callCount).toEqual(3)
        expect(
            Logger.error.getCall(2).calledWith(`cannot get aggregation "items", because control could not be found`)
        ).toBeTruthy()
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

        expectDefaultErrorMessages(wdi5ControlWithWrongId)
        expect(Logger.error.callCount).toEqual(3)
        expect(
            Logger.error.getCall(2).calledWith(`cannot get aggregation "items", because control could not be found`)
        ).toBeTruthy()
    })

    it("should log the correct error messages when 'getAggregation' is executed on an control with a wrong aggregation; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getAggregation("tooltip")

        expect(Logger.error.callCount).toEqual(1)
        expect(
            Logger.error
                .getCall(0)
                .calledWith("call of _getAggregation() failed because of: Error: Aggregation was not found!")
        ).toBeTruthy()
    })

    it("should log the correct error messages when 'enterText' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithEnterText"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongId.enterText("test")

        expectDefaultErrorMessages(wdi5ControlWithWrongId)

        expect(Logger.error.callCount).toEqual(3)
        expect(
            Logger.error.getCall(2).calledWith("cannot call enterText(), because control could not be found")
        ).toBeTruthy()
    })
    it("should log the correct error messages when 'enterText' is executed on an not found control WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "wrongIdWithEnterTextFluentAsync"
            }
        }

        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId).enterText()

        expectDefaultErrorMessages(wdi5ControlWithWrongId)

        expect(Logger.error.callCount).toEqual(3)
        expect(
            Logger.error.getCall(2).calledWith("cannot call enterText(), because control could not be found")
        ).toBeTruthy()
    })

    it("should log the correct error messages when multiple functions are executed on an control where an error in the queue occurrs; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getWrongFunction().getSecondWrongFunction()

        expect(Logger.error.callCount).toEqual(2)
        expect(
            Logger.error
                .getCall(0)
                .calledWith(
                    `One of the calls in the queue "getWrongFunction().getSecondWrongFunction()" previously failed!`
                )
        ).toBeTruthy()
        expect(
            Logger.error.getCall(1).calledWith(`Cannot read property 'getSecondWrongFunction' in the execution queue!`)
        ).toBeTruthy()
    })
})

/**
 * test that the wdi5 logger can be disabled for specific selectors
 * for every test we are using a slightly different selector so we don't have
 * to use "foceSelect: true" all the time
 */
describe("No error logging", () => {
    const sandbox = sinon.createSandbox()

    beforeEach(() => {
        sandbox.spy(Logger, "error")
    })

    afterEach(() => {
        sandbox.restore()
    })
    it("should log nothing when control was not found", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdNoLog"
            }
        }
        await browser.asControl(selectorWithWrongId)
        expect(Logger.error.callCount).toEqual(0)
    })

    it("should log when control was not found with 'logging' explicitly set to 'true'", async () => {
        const selectorWithWrongId = {
            logging: true,
            selector: {
                id: "wrongIdExplicitLog"
            }
        }
        const wdi5ControlWithWrongId = await browser.asControl(selectorWithWrongId)

        expectDefaultErrorMessages(wdi5ControlWithWrongId)
        expect(Logger.error.callCount).toEqual(2)
    })

    it("should log nothing when 'press' is executed on an not found control; WITHOUT fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithPressNoLog"
            }
        }
        wdi5ControlWithWrongIdNoLog = await browser.asControl(selectorWithWrongId)
        await wdi5ControlWithWrongIdNoLog.press()
        expect(Logger.error.callCount).toEqual(0)
    })

    it("should log nothing when 'press' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithPressNoLogFluentAsync"
            }
        }
        wdi5ControlWithWrongIdNoLog = await browser.asControl(selectorWithWrongId).press()

        expect(Logger.error.callCount).toEqual(0)
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

        expect(Logger.error.callCount).toEqual(0)
    })
    it("should log nothing when 'enterText' is executed on an not found control; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            logging: false,
            selector: {
                id: "wrongIdWithEnterTextNoLogFluentAsync"
            }
        }

        await browser.asControl(selectorWithWrongId).enterText()

        expect(Logger.error.callCount).toEqual(0)
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

        expect(Logger.error.callCount).toEqual(0)
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

        expectDefaultErrorMessages(wdi5ControlWithLogOutput)
        expect(Logger.error.callCount).toEqual(2)
    })
})
