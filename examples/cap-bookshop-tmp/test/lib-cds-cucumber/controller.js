const { env } = require("node:process")
const { Builder, By } = require("selenium-webdriver")

const SupportedBrowsers = ["chrome", "firefox"]

class Controller {
    constructor(process) {
        this.nosap = true
        this.process = process
    }

    getWorkingDirectory() {
        // return this.process.params.workingDirectory
        return process.cwd()
    }

    usingFirefox() {
        return this.browser == "firefox"
    }

    async initDriver() {
        let width = 1920
        let height = 1080
        this.browser = "chrome"
        let { CDS_CUCUMBER_BROWSER } = env
        if (CDS_CUCUMBER_BROWSER) {
            if (SupportedBrowsers.includes(CDS_CUCUMBER_BROWSER)) this.browser = CDS_CUCUMBER_BROWSER
            else
                throw Error(
                    `Browser not supported: ${CDS_CUCUMBER_BROWSER}, available: ${SupportedBrowsers.join(", ")}`
                )
        } else {
            if (env.WS_BASE_URL?.indexOf("applicationstudio.cloud") > 0) {
                this.browser = "firefox"
            }
        }
        let browserLib = require(`selenium-webdriver/${this.browser}`)
        let options = new browserLib.Options()

        options = options
            .windowSize({ width, height })
            .addArguments("--user-data-dir=" + this.getWorkingDirectory())
            .addArguments("--no-sandbox")
            .addArguments("--disable-dev-shm-usage")
        if (env.BROWSER_DEBUGGING_PORT) {
            this.remoteDebuggingPort = env.BROWSER_DEBUGGING_PORT
            options.addArguments(`--remote-debugging-port=${this.remoteDebuggingPort}`)
        }
        // if (env.SHOW_BROWSER !== "1") options = options.addArguments("--headless")
        if (env.ENABLE_CORS === "1") options.addArguments("--disable-web-security")
        if (env.ACCEPT_LANG) options.addArguments("--accept-lang=" + env.ACCEPT_LANG)
        process.env.TMPDIR = this.getWorkingDirectory()
        let builder = await new Builder().forBrowser(this.browser)
        if (this.usingFirefox()) builder.setFirefoxOptions(options)
        else builder.setChromeOptions(options)
        this.driver = builder.build()
        return !!this.driver
    }

    async quit() {
        if (env.CDS_INSTRUMENTED_CODECOV_BROWSER_EXT) await this.obtainCoverage()
        if (this.driver) await this.driver.quit()
    }

    async back() {
        await this.driver.navigate().back()
    }

    async authenticate(path, user, password = "") {
        let url = new URL(this.url)
        if (path.startsWith("http")) url = new URL(path)
        else url.pathname = path
        return await this.call("authenticate", url.toString(), user, password)
    }

    async reset() {
        return await this.call("reset")
    }

    async initializeLibrary() {
        try {
            if (env.CDS_CUCUMBER_DEBUG == "1") return await this.loadLibrary()
            else return await this.injectLibrary()
        } catch (e) {
            if (env.SLOW_QUIT) await this._sleep(1000 * parseInt(env.SLOW_QUIT))
            throw e
        }
    }

    getModuleName() {
        return require("../package.json").name
    }

    async injectLibrary() {
        const path = require("node:path")
        const fs = require("node:fs")
        let filename = "./lib/browser.js"
        try {
            const moduleName = this.getModuleName()
            filename = require.resolve(`${moduleName}/lib/browser.js`)
        } catch (e) {
            try {
                // local import from current directory
                filename = path.resolve(__dirname, "browser.js")
            } catch (e1) {}
        }
        if (env.CDS_INSTRUMENTED_CODECOV_BROWSER_EXT) {
            filename = env.CDS_INSTRUMENTED_CODECOV_BROWSER_EXT
        }
        const lib = path.resolve(filename)
        const src = 'try{!!sap;}catch(e){return "nix";};\n' + String(fs.readFileSync(lib)) + "\n return !!window.cds;"
        const rc = await this.driver.executeScript(src)
        this.nosap = rc == "nix"
        if (this.nosap) throw Error("injectLibrary failed: SAPUI5 not loaded")
        if (!(await this.attachEventHandler())) throw Error("injectLibrary: attachEventHandler failed")
        if (!this.nosap && env.SAP_UI5_VERSION) {
            const version = await this.getUI5Version()
            if (version != env.SAP_UI5_VERSION)
                throw Error(`SAP UI5 Version mismatch: expected ${env.SAP_UI5_VERSION}, actual: ${version}`)
        }
        return rc
    }

    async loadLibrary() {
        let src = `
    let xsj = document.createElement("script");
    xsj.src = '${this.process.libUrl}';
    xsj.async = true;
    document.head.appendChild(xsj);
    try{ !!sap; } catch(e) { return "nix"; }
    return true;
    `
        let rc = await this.driver.executeScript(src)
        this.nosap = rc == "nix"
        if (this.nosap) throw Error("loadLibrary failed: SAPUI5 not loaded")
        await this.waitForWindowCDS()
        if (!(await this.attachEventHandler())) throw Error("loadLibrary: attachEventHandler failed")
        if (env.CDS_CUCUMBER_WAIT_DEBUGGER == "1") await this.waitDebuggerToAttach()
        return rc
    }

    async waitForWindowCDS(seconds = 60) {
        process.stdout.write(`waiting for window.cds ${seconds} seconds...\n`)
        for (let loops = seconds; loops > 0; loops--) {
            let rc = await this.driver.executeScript("try { return !!window.cds;}catch(e){return false;}")
            if (rc) {
                process.stdout.write("C")
                return
            }
            process.stdout.write("c")
            await this._sleep(1000)
        }
        process.stdout.write(":(")
    }

    async waitDebuggerToAttach(seconds = 60) {
        process.stdout.write(`\nImported library: ${this.process.libUrl}`)
        process.stdout.write(`\nYou can add breakpoints in file: ${this.process.libFile}`)
        if (!this.remoteDebuggingPort) throw Error("Remote debugging port not set (see BROWSER_DEBUGGING_PORT)!")
        process.stdout.write(`\nYou can attach debugger to port ${this.remoteDebuggingPort}...\n`)
        for (let loops = seconds; loops > 0; loops--) {
            let rc = await this.driver.executeScript("try { return __jsDebugIsReady;}catch(e){return false;}")
            if (rc) {
                process.stdout.write("!")
                return
            }
            process.stdout.write("?")
            await this._sleep(1000)
        }
        process.stdout.write(":(")
    }

    async obtainCoverage() {
        let content = await this.driver.executeScript("return window.__coverage__")
        let fs = require("node:fs")
        let id = new Date().toISOString().replaceAll("-", "").replaceAll(".", "").replaceAll(":", "")
        let filename = `./tmp/coverage-${id}.json`
        await fs.writeFile(filename, JSON.stringify(content, null, 2))
        console.log("code coverage:", filename)
    }

    async openUrl(url, language = undefined) {
        this.url = url
        if (language) return await this.driver.get(url + `?sap-language=${language}`)
        return await this.driver.get(url)
    }

    async getTitle() {
        return await this.driver.getTitle()
    }

    async getUI5Version() {
        if (this.nosap) return "no sap"
        return await this.call("getUI5Version")
    }

    async attachEventHandler() {
        if (this.nosap) return true
        return await this.call("attachEventHandler")
    }

    async getEvents() {
        if (this.nosap) return 0
        return await this._scall("getEvents")
    }

    async getTiles() {
        return await this.call("getTiles")
    }

    async pressTile(name) {
        const selector = {
            selector: {
                controlType: "sap.m.GenericTile",
                viewName: "module:sap/ushell/components/homepage/DashboardContent.view",
                properties: {
                    header: name
                }
            }
        }
        return await browser.asControl(selector).press()
    }

    async _getPageCount() {
        return await this._scall("getPageCount")
    }

    async extractTableContent(tableName) {
        return await this.call("extractTableContent", tableName)
    }

    async extractTableRowsTotalCount(tableName) {
        return await this.call("extractTableRowsTotalCount", tableName)
    }

    async extractCurrentPageContent() {
        return await this.call("extractCurrentPageContent")
    }

    async extractObjectPageContent() {
        return await this.call("extractObjectPageContent")
    }

    async extractObjectPageContentWithBindingInfo() {
        return await this.call("extractObjectPageContentWithBindingInfo")
    }

    async extractTableContentWithBindingInfo() {
        return await this.call("extractTableContentWithBindingInfo")
    }

    async extractTableRows() {
        return await this.call("extractTableRows")
    }

    async performBasicSearch(text) {
        return await this.call("performBasicSearch", text)
    }

    async editSearchField(text) {
        return await this.call("editSearchField", text)
    }

    async editField(field, text) {
        return await this.call("editField", field, text)
    }

    async modifyField(field, text) {
        return await this.call("modifyField", field, text)
    }

    async hasValueHelp(field) {
        return await this.call("hasValueHelp", field)
    }

    async selectItemInValueHelp(field, text, tap = false) {
        return await this.call("selectItemInValueHelp", field, text, tap)
    }

    async editHeaderField(field, text) {
        return await this.call("editHeaderField", field, text)
    }

    async editIdentificationField(field, text) {
        return await this.call("editIdentificationField", field, text)
    }

    async editGroupField(group, field, text) {
        return await this.call("editGroupField", group, field, text)
    }

    async editFieldInLastRowOfLineItemTableInSection(subsectionTitle, columnName, value) {
        return await this.call("editFieldInLastRowOfLineItemTableInSection", subsectionTitle, columnName, value)
    }

    async addConditionEqualInFilterField(field, text) {
        return await this.call("addConditionEqualInFilterField", field, text)
    }

    async addConditionGreaterInFilterField(field, text) {
        return await this.call("addConditionGreaterInFilterField", field, text)
    }

    async applySearchFilter() {
        return await this.call("applySearchFilter")
    }

    async createDraft() {
        return await this.call("createDraft")
    }

    async saveDraft() {
        return await this.call("saveDraft")
    }

    async discardDraft() {
        return await this.call("discardDraft")
    }

    async confirmDiscardDraft() {
        return await this.call("confirmDiscardDraft")
    }

    async confirmDiscardDraftOnObjectPage() {
        return await this.call("confirmDiscardDraftOnObjectPage")
    }

    async createDraft() {
        return await this.call("createDraft")
    }

    async applyChanges() {
        return await this.call("applyChanges")
    }

    async switchToDraftVersion() {
        return await this.call("switchToDraftVersion")
    }

    async switchToActiveVersion() {
        return await this.call("switchToActiveVersion")
    }

    async deleteObjectInstance() {
        return await this.call("deleteObjectInstance")
    }

    async pressObjectPageActionBarButton(name) {
        return await this.call("pressObjectPageActionBarButton", name)
    }

    async pressStandardActionButtonInObjectPageHeader(name) {
        return await this.call("pressStandardActionButtonInObjectPageHeader", name)
    }

    async selectAllRowsLineItemTable(table = undefined) {
        return this.call("selectAllRowsLineItemTable", table)
    }

    async tapOnRowInLineItemTable(table = undefined, row) {
        return this.call("tapOnRowInLineItemTable", table, row)
    }

    async selectRowInLineItemTable(table = undefined, row) {
        return this.call("selectRowInLineItemTable", table, row)
    }

    async selectRowsInLineItemTableHaving(table, columnName, value) {
        return this.call("selectRowsInLineItemTableHaving", table, columnName, value)
    }

    async pressButtonForLineItemTable(button, table = undefined) {
        return await this.call("pressButtonForLineItemTable", button, table)
    }

    async pressButtonForLineItemTableInSection(button, section) {
        return await this.call("pressButtonForLineItemTableInSection", button, section)
    }

    async pressButtonInDialog(buttonText, dialogCaption) {
        return await this.call("pressButtonInDialog", buttonText, dialogCaption)
    }

    async pressGoBackButton() {
        return await this.call("pressGoBackButton")
    }

    async pressLogOutButton() {
        return await this.call("pressLogOutButton")
    }

    async pressButton(label) {
        return await this.call("pressButton", label)
    }

    async chooseItemInListDialog(dialogName, itemText) {
        return await this.call("chooseItemInListDialog", dialogName, itemText)
    }

    async hasActiveErrorDialog() {
        return await this.call("hasActiveErrorDialog")
    }

    async hasInactiveErrorDialog() {
        return await this.call("hasInactiveErrorDialog")
    }

    async extractActiveErrorDialogItems() {
        return await this.call("extractActiveErrorDialogItems")
    }

    async extractInactiveErrorDialogItems() {
        return await this.call("extractInactiveErrorDialogItems")
    }

    async extractFooterBarMessages() {
        return await this.call("extractFooterBarMessages")
    }

    async pressViewDetailsInInactiveErrorDialog() {
        return await this.call("pressViewDetailsInInactiveErrorDialog")
    }

    async pressViewDetailsInActiveErrorDialog() {
        return await this.call("pressViewDetailsInActiveErrorDialog")
    }

    async openValueHelpDialogForField(fieldName) {
        return await this.call("openValueHelpDialogForField", fieldName)
    }

    async openValueHelpDialogForObjectField(fieldName) {
        return await this.call("openValueHelpDialogForObjectField", fieldName)
    }

    async openValueHelpDialogForFilterField(fieldName) {
        return await this.call("openValueHelpDialogForFilterField", fieldName)
    }

    async pressOkInValueHelpDialog() {
        return await this.call("pressOkInValueHelpDialog")
    }

    async enterValueInPrompt(value) {
        return await this.call("enterValueInPrompt", value)
    }

    async pressButtonInActiveDialog(label) {
        return await this.call("pressButtonInActiveDialog", label)
    }

    async selectFirstMatchingRowInValueHelpDialog(columnName, searchText) {
        return await this.call("selectFirstMatchingRowInValueHelpDialog", columnName, searchText)
    }

    async selectOneRowInValueHelpDialog(columnName, searchText) {
        return await this.call("selectOneRowInValueHelpDialog", columnName, searchText)
    }

    async selectItemInFieldValueHelp(fieldName, searchText) {
        return await this.call("selectItemInFieldValueHelp", fieldName, searchText)
    }

    async firePressOnAdaptFilterButton() {
        return await this.call("firePressOnAdaptFilterButton")
    }

    async pressOkInAdaptFilterDialog() {
        return await this.call("pressOkInAdaptFilterDialog")
    }

    async selectFieldInAdaptFilterDialog(columnName) {
        return await this.call("selectFieldInAdaptFilterDialog", columnName)
    }

    async selectAllFieldsInAdaptFilterDialog(columnName) {
        return await this.call("selectAllFieldsInAdaptFilterDialog", columnName)
    }

    async clearSelectionInValueHelpDialog() {
        return await this.call("clearSelectionInValueHelpDialog")
    }

    async clickOnElementWithClass(className) {
        let element = await this.driver.findElement(By.className(className))
        let actions = this.driver.actions({ async: true })
        await actions.move({ origin: element }).click().perform()
        return { className, elementId: await element.getId() }
    }

    async clickOnElementWithId(id) {
        let element = await this.driver.findElement(By.id(id))
        let actions = this.driver.actions({ async: true })
        await actions.move({ origin: element }).click().perform()
        return { id, elementId: await element.getId() }
    }

    async clickOnLink(value) {
        let id = await this.call("getParentOfComponentWithProperty", "sap.m.Link", "text", value)
        return this.clickOnElementWithId(id)
    }

    async clickOnText(value) {
        let id = await this.call("getParentOfComponentWithProperty", "sap.m.Text", "text", value)
        return this.clickOnElementWithId(id)
    }

    async clickOnObjectIdentifier(value) {
        let id = await this.call("getParentOfComponentWithProperty", "sap.m.ObjectIdentifier", "title", value)
        return this.clickOnElementWithId(id)
    }

    async tapOnText(text, parent = false) {
        return await this.call("tapOnText", text, parent)
    }

    async tapOnLink(text, parent = false) {
        return await this.call("tapOnLink", text, parent)
    }

    async tapOnObjectIdentifier(title, parent = false) {
        return await this.call("tapOnObjectIdentifier", title, parent)
    }

    async tapOn(textOrLink, parent = false) {
        return await this.call("tapOn", textOrLink, parent)
    }

    async getInbounds() {
        return await this.call("getInbounds")
    }

    async selectDayInVisibleCalendar(text) {
        return await this.call("selectDayInVisibleCalendar", text)
    }

    async selectYearInVisibleCalendar(text) {
        return await this.call("selectYearInVisibleCalendar", text)
    }

    async selectMonthInVisibleCalendar(text) {
        return await this.call("selectMonthInVisibleCalendar", text)
    }

    async rollVisibleCalendar(action) {
        return await this.call("rollVisibleCalendar", action)
    }

    async performActionOnVisibleCalendar(action) {
        return await this.call("performActionOnVisibleCalendar", action)
    }

    async extractErrorPageMessage(action) {
        return await this.call("extractErrorPageMessage", action)
    }

    async hasVisibleValueHelpForField(field, vhi) {
        return await this.call("hasVisibleValueHelpForField", field, vhi)
    }

    async getVisiblePopoverCount() {
        return await this.call("getVisiblePopoverCount")
    }

    async isComponentOpened(componentId) {
        return await this.call("isComponentOpened", componentId)
    }

    async takeScreenshot() {
        let date = new Date().toISOString().replaceAll(".", "_").replaceAll(":", "_").replaceAll("-", "_")
        const path = require("node:path")
        const os = require("node:os")
        let filename = path.join(os.tmpdir(), `cap.screenshot.${date}.png`)
        let png = await this.driver.takeScreenshot()
        const { writeFile } = require("node:fs/promises")
        await writeFile(filename, png, "base64")
        return filename
    }

    async call(name, ...args) {
        let exceptions = []
        for (let i = 0; i < 10; i++) {
            try {
                return await this._call(name, ...args)
            } catch (e) {
                if (i == 0) exceptions.push(e)
                this._sleep(500)
            }
        }
        try {
            let filename = await this.takeScreenshot()
            exceptions.push(filename)
        } catch (e) {
            exceptions.push(e)
        }
        throw Error(`call(${name}): failed ${exceptions}`)
    }

    async _call(name, ...args) {
        let params = args.map(JSON.stringify)
        let src = `return window.cds.${name}(${params.join(",")})`
        if (env.SLOW_DOWN && name != "getEvents") await this._sleep(1000 * parseInt(env.SLOW_DOWN))
        if (this.expectToFail && name != "getEvents") return await this._executeFailingScript(src)
        return await this._executeScript(src)
    }

    async _scall(name, ...args) {
        let params = args.map(JSON.stringify)
        let src = `return window.cds.${name}(${params.join(",")})`
        return await this._executeScript(src)
    }

    async setExpectToFail() {
        this.expectToFail = true
    }

    async _executeFailingScript(src) {
        this.expectToFail = false
        try {
            await this.driver.executeScript(src)
        } catch (e) {
            return true // exception thrown as expected
        }
        throw Error("Did not fail as it was expected")
    }

    async _executeScript(src) {
        let wrapped = `
    try {
      ${src}
    } catch (e) {
      return "Exception: "+e.stack;
    }
    `
        let result = await this.driver.executeScript(wrapped)
        if (typeof result == "string" && result.indexOf("Exception: ") == 0) throw Error(result)
        return result
    }

    _sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    async waitEvents(maxLoops = 20) {
        for (let loops = maxLoops; loops > 0; loops--) {
            let count = await this.getEvents()
            process.stdout.write(".")
            if (count != 0) loops = maxLoops
            await this._sleep(20)
        }
        process.stdout.write("\n")
    }

    async isUIInitialized() {
        try {
            return await this.driver.executeScript("return sap && sap.ui.getCore().isInitialized() || false")
        } catch (e) {}
        return false
    }

    async waitToLoadPage(maxLoops = 20) {
        let len = 0
        while (true) {
            len = (await this.driver.getPageSource()).length
            if (len > 0) break
            await this._sleep(5)
        }
        for (let loops = maxLoops; loops > 0; loops--) {
            let newlen = (await this.driver.getPageSource()).length
            if (newlen != len) loops = maxLoops
            len = newlen
            await this._sleep(this.usingFirefox() ? 50 : 20)
        }
    }

    async waitForPage(maxLoops = 200) {
        let loops
        for (loops = maxLoops; loops > 0; loops--) {
            let count = await this._getPageCount()
            if (count > 0) break
            process.stdout.write("p")
            await this._sleep(100)
        }
        process.stdout.write("P\n")
    }

    async waitBlockers(maxLoops = 20) {
        await this.waitToLoadPage()
        let loops
        for (loops = maxLoops; loops > 0; loops--) {
            if (await this.isUIInitialized()) {
                process.stdout.write("I")
                break
            }
            process.stdout.write("i")
            await this._sleep(20)
        }
        if (loops == 0) throw Error(`waitBlockers(${maxLoops}): not initialized`)
        for (loops = maxLoops; loops > 0; loops--) {
            let blockers = await this.getBlockers()
            if (blockers == 0) break
            process.stdout.write("#")
            await this._sleep(200)
            await this.checkForErrors()
        }
        if (loops == 0) throw Error(`waitBlockers(${maxLoops}): still blocked`)
        process.stdout.write("\n")
        await this.checkForErrors()
    }

    async waitToLoad(maxLoops = 20) {
        if (this.nosap) return
        for (let loops = maxLoops; loops > 0; loops--) {
            let count = (await this.getBlockers()) + (await this.getEvents())
            process.stdout.write(".")
            if (count != 0) loops = maxLoops
            await this._sleep(10)
            await this.checkForErrors()
        }
        process.stdout.write("\n")
        await this.checkForErrors()
    }

    async checkForErrors() {
        let error
        let messages = []
        error = await this.extractInactiveErrorDialogItems()
        if (error) {
            try {
                messages = await this.extractFooterBarMessages()
            } catch (e) {}
            throw Error(`Error occured: ${error}, Messages: ${messages.join(", ")}`)
        }
        error = await this.extractActiveErrorDialogItems()
        if (error) {
            try {
                messages = await this.extractFooterBarMessages()
            } catch (e) {}
            throw Error(`Error occured: ${error}, Messages: ${messages.join(", ")}`)
        }
    }

    async getBlockers() {
        let blockers = await this.driver.findElements(By.className("sapUiBlockLayerTabbable"))
        return blockers.length
    }
}

module.exports = Controller
