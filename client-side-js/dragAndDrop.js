async function clientSide_dragAndDrop(sourceWebElem, destWebElem) {
    return await browser.executeAsync(
        (sourceWebElem, destWebElem, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                const oSourceControl = window.wdi5.getUI5CtlForWebObj(sourceWebElem)
                const oDestControl = window.wdi5.getUI5CtlForWebObj(destWebElem)
                window.wdi5.simulateDragDrop(oSourceControl, oDestControl)
            })
            done(["success"])
        },
        sourceWebElem,
        destWebElem
    )
}

module.exports = {
    clientSide_dragAndDrop
}
