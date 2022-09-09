const { afterEach } = require("mocha")
const sinon = require("sinon")

const expectDefaultErrorMessages = (wdi5Control) => {
    expect(console.red.called).toBeTruthy()
    expect(
        console.red
            .getCall(0)
            .calledWith(
                "[wdi5]",
                `call of _getControl() failed because of: Error: No DOM element found using the control selector ${JSON.stringify(
                    wdi5Control._controlSelector.selector
                )}`
            )
    ).toBeTruthy() // dirty but otherwise we have no access to the selector
    expect(
        console.red.getCall(1).calledWith("[wdi5]", `error retrieving control: ${wdi5Control._wdio_ui5_key}`)
    ).toBeTruthy() // dirty but otherwise we have no acces to the key
}

/**
 * test the error logs of the wdi5 logger when controls cannot be found
 * for every test we are using a slightly different selector so we don't have
 * to use "foceSelect: true" all the time
 */
describe("Error logging", () => {
    const sandbox = sinon.createSandbox()

    beforeEach(() => {
        sandbox.spy(console, "red")
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
        expect(console.red.callCount).toEqual(2)
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
        expect(console.red.callCount).toEqual(3)
        expect(
            console.red.getCall(2).calledWith("[wdi5]", `cannot call press(), because control could not be found`)
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
        expect(console.red.callCount).toEqual(3)
        expect(
            console.red.getCall(2).calledWith("[wdi5]", `cannot call press(), because control could not be found`)
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

        expect(console.red.callCount).toEqual(3)
        expect(
            console.red
                .getCall(2)
                .calledWith("[wdi5]", `cannot get aggregation "items", because control could not be found`)
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
        expect(console.red.callCount).toEqual(3)
        expect(
            console.red
                .getCall(2)
                .calledWith("[wdi5]", `cannot get aggregation "items", because control could not be found`)
        ).toBeTruthy()
    })

    it("should log the correct error messages when 'getAggregation' is executed on an control with a wrong aggregation; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getAggregation("tooltip")

        expect(console.red.callCount).toEqual(1)
        expect(
            console.red
                .getCall(0)
                .calledWith("[wdi5]", `call of _getAggregation() failed because of: Error: Aggregation was not found!`)
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

        expect(console.red.callCount).toEqual(3)
        expect(
            console.red.getCall(2).calledWith("[wdi5]", `cannot call enterText(), because control could not be found`)
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

        expect(console.red.callCount).toEqual(3)
        expect(
            console.red.getCall(2).calledWith("[wdi5]", `cannot call enterText(), because control could not be found`)
        ).toBeTruthy()
    })

    it("should log the correct error messages when multiple functions are executed on an control where an error in the queue occurrs; WITH fluent async api", async () => {
        const selectorWithWrongId = {
            selector: {
                id: "container-Sample---Main--NavFwdButton"
            }
        }

        await browser.asControl(selectorWithWrongId).getWrongFunction().getSecondWrongFunction()

        expect(console.red.callCount).toEqual(2)
        expect(
            console.red
                .getCall(0)
                .calledWith(
                    "[wdi5]",
                    `One of the calls in the queue "getWrongFunction().getSecondWrongFunction()" previously failed!`
                )
        ).toBeTruthy()
        expect(
            console.red
                .getCall(1)
                .calledWith("[wdi5]", `Cannot read property 'getSecondWrongFunction' in the execution queue!`)
        ).toBeTruthy()
    })
})
