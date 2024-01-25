const obj = {
    realFunc: () => "called",
    realProp: true
}

const newObject = {}
const chain = []
let chainCounter = 0

const handlers = {
    get: (target, name, receiver) => {
        console.log(`get - start w/ ${name}`)
        let isProp = true
        let args = []
        // anyCall = true
        if (name === "then" && chainCounter === 0) {
            console.log("then")

            return Promise.resolve()
        }

        Promise.resolve().then(() => {
            if (name === "then" && chainCounter > 0) {
                console.log("end of chain")
                // return
                // --> browser-scope
                console.log("call chain", chain)
                return chain
            } else if (isProp && name !== "then") {
                console.log(`resolving prop ${name}`)
                chain.push(["property", name])
            } else {
                console.log(`resolving fn ${name} with args ${args}`)
                chain.push(["function", name, args])
            }
        })

        chainCounter++

        return new Proxy(() => {}, {
            get: handlers.get,
            apply: function (target, thisArg, argList) {
                isProp = false
                args = argList
                return new Proxy(() => {}, handlers)
            }
        })
    },

    apply(target, thisArg, argList) {
        console.log("apply")
    }
}

const browser = {
    async asControl(selector) {
        return new Proxy(() => {}, handlers)
    }
}

;(async () => {
    const control = await browser.asControl()
    const result = await control.one("1").two.three("2")

    // const result2 = await browser.asControl().one("1").two.three("2")
    // const result2 = await browser._asControl().one
    debugger
    console.log("FINISHED")
})()
