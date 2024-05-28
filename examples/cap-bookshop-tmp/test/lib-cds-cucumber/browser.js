class CDS {
    getTableUtils() {
        if (this.TableUtils) return this.TableUtils
        this.TableUtils = sap.ui.require("sap/ui/table/utils/TableUtils")
        if (!this.TableUtils) throw Error("TableUtils not loaded")
        return this.TableUtils
    }

    authenticate(url, username, password = "") {
        return this.httpGet(url, username, password)
    }

    reset() {
        let url = new URL(document.location.href)
        return this.httpGet(url.origin + "/RESET")
    }

    httpGet(url, username, password) {
        let that = this
        return (async function () {
            return await that._httpGet(url, username, password)
        })().then((x) => console.log("done", x))
    }

    _httpGet(_url, username, password) {
        let url = new URL(_url)
        if (username != undefined) url.username = username
        if (password != undefined) url.password = password
        return new Promise((resolve, reject) => {
            let http = new XMLHttpRequest()
            function getResponse() {
                return { code: http.status, response: http.responseText, type: http.responseType }
            }
            http.onload = function () {
                console.log("got", http.status, username || "")
                if (http.status !== 200) reject(getResponse())
                resolve(getResponse())
            }
            http.onerror = function (e) {
                console.log("error", username || "", e)
                reject(getResponse())
            }
            http.ontimeout = function (e) {
                console.log("timeout", username || "", e)
                reject({ code: http.status, response: http.responseText })
            }
            console.log("url", url)
            http.open("GET", url, true)
            http.send()
        })
    }

    getUI5VersionInfo() {
        return sap.ui.getVersionInfo()
    }

    getUI5Version() {
        return sap.ui.getVersionInfo().version
    }

    getVersionInt() {
        const re = /(\d+)\.(\d+)\.(\d+)/
        let r = this.getUI5Version().match(re)
        return parseInt(r[2])
    }

    getCore() {
        return sap.ui.getCore()
    }

    getRootControl() {
        return sap.ui.core.Element.registry.get("mainShell")
    }

    getUIArea() {
        return this.getRootControl().getOUnifiedShell().getUIArea()
    }

    getSplitShell() {
        return this.getRootControl().getContent()[0].getCanvasSplitContainer()
    }

    getAppContainer() {
        return this.getSplitShell()
            .getContent()
            .filter((X) => X.isA("sap.ushell.ui.AppContainer"))[0]
    }

    getPages() {
        return this.getAppContainer().getPages()
    }

    getApplicationContainer() {
        return this.getPages().filter((X) => X.isA("sap.ushell.components.container.ApplicationContainer"))[0]
    }

    getComponents(className) {
        let elements = sap.ui.core.Element.registry.all()
        let result = []
        for (let elementName in elements) {
            let element = elements[elementName]
            if (
                className == undefined ||
                (Array.isArray(className) && className.find((CN) => element.isA(CN))) ||
                element.isA(className)
            )
                result.push(element)
        }
        return result
    }

    getComponentsById(id) {
        let elements = sap.ui.core.Element.registry.all()
        let result = []
        for (let elementName in elements) if (elements[elementName].getId() === id) result.push(elements[elementName])
        return result
    }

    getComponentsByIdRe(res) {
        if (!Array.isArray(res)) res = [res]
        let elements = sap.ui.core.Element.registry.all()
        let result = []
        for (let elementName in elements) {
            res.forEach((re) => {
                if (elements[elementName].getId().match(re)) result.push(elements[elementName])
            })
        }
        return result
    }

    getComponentsByIdReExt(re) {
        let elements = sap.ui.core.Element.registry.all()
        let result = []
        for (let elementName in elements) {
            let match = elements[elementName].getId().match(re)
            if (match) result.push(match[1])
        }
        return result
    }

    getTiles() {
        return this.getComponents("sap.m.GenericTile")
            .filter((X) => X.mProperties.header)
            .map((X) => X.mProperties.header)
    }

    findListReportTableStandardActionButton(actionName) {
        let prefix = this.getVisibleListReportTableLineItem().getId()
        let id = `${prefix}::StandardAction::${actionName}`
        return this.getComponents("sap.m.Button").find((X) => X.getId() == id)
    }

    findObjectPageStandardActionButton(actionName) {
        let pageName = this.getVisibleObjectPageName()
        let id = `${pageName}--fe::StandardAction::${actionName}`
        return this.getComponents("sap.m.Button").find((X) => X.getId() == id)
    }

    getObjectPageActionsToolbar() {
        return this.getVisibleObjectPage().getHeaderTitle()._getActionsToolbar()
    }

    findObjectPageActionBarButton(label) {
        let toolbar = this.getObjectPageActionsToolbar()
        return toolbar
            .getContent()
            .filter((X) => X.isA("sap.m.Button"))
            .filter((X) => X.getText() == label)[0]
    }

    pressObjectPageActionBarButton(label) {
        let button = this.findObjectPageActionBarButton(label)
        if (!button) throw Error(`findObjectPageActionBarButton(${label}): button not found!`)
        button.firePress()
    }

    editFieldInLastRowOfLineItemTableInSection(subsectionTitle, columnName, value) {
        return this.editFieldInLineItemTableInSection(subsectionTitle, columnName, -1, value)
    }

    editFieldInLineItemTableInSection(subsectionTitle, columnName, rowNumber, value) {
        // sap.fe.macros.table.TableAPI
        let tableApi = this.findObjectPageLineItemTableBySubsectionTitle(subsectionTitle)
        // sap.ui.mdc.Table
        let mdcTable = tableApi.getContent()
        let columns = mdcTable.getColumns()
        let columnNames = columns.map((C) => C.getHeader())
        let columnIndex = columnNames.findIndex((C) => C == columnName)
        if (columnIndex === -1)
            throw Error(
                `editFieldInLineItemTableInSection: column ${columnName} not found, avaibale columns: ${columnNames.join(", ")}`
            )
        // sap.m.Table
        let table = mdcTable.getAggregation("_content")
        let rows = table.getItems()
        if (rowNumber == -1) rowNumber = rows.length - 1 // last row
        let row = rows[rowNumber]
        let cell = row.getCells()[columnIndex]
        //sap.m.Input
        cell.getContent().contentEdit[0].setValue(value)
        return true
    }

    findObjectPageLineItemTableBySubsectionTitle(subsectionTitle) {
        let pageName = this.getVisibleObjectPageName()
        let re = `^${pageName}--fe::table::.*::LineItem::Table$`
        let allLineItemTables = this.getComponentsByIdRe(re)
        let tables = allLineItemTables.filter((T) => {
            let subsection = this.upToParentOfType(T, "sap.uxap.ObjectPageSubSection")
            return subsection.getTitle() == subsectionTitle
        }, this)
        if (tables.length != 1) {
            let available = this.listObjectPageLineItemSubsectionNames()
            throw Error(
                `findObjectPageLineItemTableBySubsectionTitle: subsection ${subsectionTitle} not found, length: ${tables.length}, available: ${available.join(", ")}`
            )
        }
        return tables[0]
    }

    listObjectPageLineItemSubsections() {
        let pageName = this.getVisibleObjectPageName()
        let re = `^${pageName}--fe::table::.*::LineItem::Table$`
        let tables = this.getComponentsByIdRe(re)
        return tables.map((T) => this.upToParentOfType(T, "sap.uxap.ObjectPageSubSection"), this)
    }

    listObjectPageLineItemSubsectionNames() {
        let subsections = this.listObjectPageLineItemSubsections()
        return subsections.map((S) => S.getTitle())
    }

    listObjectPageLineItemTableNames() {
        let pageName = this.getVisibleObjectPageName()
        let re = `^${pageName}--fe::table::(.*)::LineItem::Table$`
        return this.getComponentsByIdReExt(re)
    }

    selectAllRowsLineItemTable(nameOrTitle = undefined) {
        let table = this.findTable(nameOrTitle)
        let checkbox = table._getSelectAllCheckbox()
        return !!$(this.jqid(checkbox.getId())).tap()
    }

    selectAllRowsInLineItemTable(tableName) {
        let table = this.findTableByTitle(tableName)
        let checkbox = table._getSelectAllCheckbox()
        let found = $(this.jqid(checkbox.getId()))
        if (found.length == 0)
            throw Error(`selectAllRowsInLineItemTable(${tableName}): can not select all records in table ${tableName}`)
        return !!found.tap()
    }

    tapOnRowInLineItemTable(tableName, targetRow) {
        let table = this.findTableByTitle(tableName)
        let items = table.getItems()
        this.tapOnAnyId(items[targetRow].getId())
    }

    selectRowInLineItemTable(tableName, targetRow) {
        let table = this.findTableByTitle(tableName)
        let items = table.getItems()
        let checkbox = items[targetRow].getMultiSelectControl()
        checkbox.fireSelect({ selected: true })
    }

    selectRowsInLineItemTableHaving(tableName, columnName, value) {
        let table = this.findTableByTitle(tableName)
        let columns = table.getColumns()
        let labels = columns.map((C) => C.getHeader().getLabel().getText())
        if (columnName === "?")
            throw Error(`selectRowsInLineItemTableHaving - available columns: ${JSON.stringify(labels)}`)
        let columnIndex = labels.findIndex((C) => C == columnName)
        if (columnIndex === -1) {
            let available = labels.map((C) => C.columnName)
            throw Error(
                `selectRowsInLineItemTableHaving - column ${columnName} not found, available: ${JSON.stringify(available)}`
            )
        }
        let items = table.getItems()
        let values = items.map((I) => I.getCells()[columnIndex]).map(this.dumpTableCellText, this)
        if (value === "?") {
            values = values.map((X) => (X.text ? X.text : X))
            throw Error(`selectRowsInLineItemTableHaving - available values: ${JSON.stringify(values)}`)
        }
        let rowIndexes = values
            .map((T, i) => ((T.text && T.text == value) || T == value ? i : -1))
            .filter((X) => X >= 0)
        rowIndexes.forEach((i) => items[i].getMultiSelectControl().fireSelect({ selected: true }))
    }

    pressButtonForLineItemTable(buttonName, tableTitle = undefined) {
        return this.pressStandardActionButtonForLineItemTable(tableTitle, buttonName)
    }

    pressButtonForLineItemTableInSection(buttonName, sectionName) {
        let subsections = this.listObjectPageLineItemSubsectionNames()
        let index = subsections.map((S, I) => (S === sectionName ? I : undefined)).filter((X) => X !== undefined)[0]
        let tables = this.listObjectPageLineItemTableNames()
        let tableName = tables[index]
        return this.pressStandardActionButtonForLineItemTable(tableName, buttonName)
    }

    pressStandardActionButtonForLineItemTable(nameOrTitle, actionName) {
        let table = this.findTable(nameOrTitle)
        let actions = table.getHeaderToolbar().getActions()
        let action = actions.filter((A) => A.getLabel() == actionName)[0]
        if (!action) {
            let available = actions.map((A) => A.getLabel())
            throw Error(
                `pressStandardActionButtonForLineItemTable: action ${actionName} in table ${nameOrTitle} not found, available: ${available.join(", ")}`
            )
        }
        let button = action.getAction()
        if (!button.getEnabled())
            throw Error(`pressStandardActionButtonForLineItemTable(${nameOrTitle},${actionName}): button not enabled`)
        return !!button.firePress()
    }

    findStandardActionButtonSwitchDraftAndActiveObject() {
        return this.findObjectPageStandardActionButton("SwitchDraftAndActiveObject")
    }

    switchToDraftVersion() {
        let button = this.findStandardActionButtonSwitchDraftAndActiveObject()
        button.firePress()
        this.chooseItemByKeyInPopoverSelectList("switchToDraft")
    }

    switchToActiveVersion() {
        let button = this.findStandardActionButtonSwitchDraftAndActiveObject()
        button.firePress()
        this.chooseItemByKeyInPopoverSelectList("switchToActive")
    }

    chooseItemByKeyInPopoverSelectList(key) {
        let pops = this.getComponents("sap.m.Popover")
        let pop0 = pops[pops.length - 1]
        let content = pop0.getContent()
        let list = content[0]
        let items = list.getItems().filter((I) => I.getKey() == key)
        if (items.length != 1) throw Error(`Item '${key}' not found, length: ${items.length}`)
        let item = items[0]
        list.fireItemPress({ item })
    }

    findStandardActionButtonEdit() {
        return this.findObjectPageStandardActionButton("Edit")
    }

    findStandardActionButtonEdit() {
        return this.findObjectPageStandardActionButton("Delete")
    }

    createDraft() {
        return this.pressButtonForTableStandardAction("Create")
    }

    findObjectPageFooterBarStandardButton(actionName) {
        let pageName = this.getVisibleObjectPageName()
        let id = `${pageName}--fe::FooterBar::StandardAction::${actionName}`
        return this.getComponents("sap.m.Button").find((X) => X.sId == id)
    }

    findObjectPageStandardActionButton(actionName) {
        let pageName = this.getVisibleObjectPageName()
        let id = `${pageName}--fe::StandardAction::${actionName}`
        return this.getComponents("sap.m.Button").find((X) => X.sId == id)
    }

    applyChanges() {
        let applyButton = this.findObjectPageFooterBarStandardButton("Apply")
        return !!applyButton.firePress()
    }

    saveDraft() {
        let saveButton = this.findObjectPageFooterBarStandardButton("Save")
        return !!saveButton.firePress()
    }

    discardDraft() {
        let saveButton = this.findObjectPageFooterBarStandardButton("Cancel")
        return !!saveButton.firePress()
    }

    upToParentOfType(component, type) {
        if (!component) return undefined
        if (component.getMetadata().getName() === type) return component
        return this.upToParentOfType(component.getParent(), type)
    }

    findDiscardDraftPopover() {
        let found = this.getComponents("sap.m.Text")
            .filter((X) => X.getText() == "Discard all changes?")
            .map((X) => this.upToParentOfType(X, "sap.m.Popover"), this)
            .filter((X) => X.oPopup && X.oPopup.isOpen())
        if (found.length != 1) throw Error(`findDiscardDraftPopover: Exact popover not found, length: ${found.length}`)
        return found[0]
    }

    confirmDiscardDraft() {
        let popover = this.findDiscardDraftPopover()
        if (!popover) return // silent
        let button = popover
            .getContent()[0]
            .getItems()
            .filter((X) => X.getMetadata().getName() == "sap.m.Button")
            .filter((X) => X.getText() === "Discard")[0]
        if (!button) throw Error("confirmDiscardDraft: button not found")
        button.firePress()
    }

    confirmDiscardDraftOnObjectPage() {
        if (this.getVisibleObjectPage()) {
            this.confirmDiscardDraft()
        }
    }

    deleteObjectInstance() {
        let saveButton = this.findObjectPageStandardActionButton("Delete")
        return !!saveButton.firePress()
    }

    pressButtonForTableStandardAction(name) {
        let button = this.findListReportTableStandardActionButton(name)
        if (!button) throw Error(`Button '${name}' not found`)
        return !!button.firePress()
    }

    pressGoBackButton() {
        let buttons = this.getComponents("sap.ushell.ui.shell.ShellHeadItem").filter(
            (X) => X.getProperty("icon") === "sap-icon://nav-back"
        )
        if (buttons.length != 1) throw Error("pressGoBackButton: Button not found, length: " + buttons.length)
        let button = buttons[0]
        return !!button.firePress()
    }

    getComponentClassName(component) {
        return component.getMetadata().getName()
    }

    getLaunchpadActionItems() {
        return this.getComponents("sap.ushell.ui.launchpad.ActionItem")
    }

    pressLogOutButton() {
        let buttons = this.getLaunchpadActionItems()
            .filter((X) => X.getProperty("icon") === "sap-icon://log")
            .filter((X) => X.getId() === "logoutBtn")
            .filter((X) => X.getProperty("text") === "Sign Out")
        if (buttons.length != 1) throw Error("pressLogOutButton: Button not found, length: " + buttons.length)
        let button = buttons[0]
        return !!button.firePress()
    }

    pressButton(label) {
        let buttons = this.getComponents("sap.m.Button")
            .filter((X) => X.getText() == label)
            .filter((X) => this.hasVisibleParent(X), this)
        if (buttons.length != 1) {
            let avaibale = this.getComponents("sap.m.Button")
                .map((X) => X.getText())
                .filter((T) => T.length)
            throw Error(`pressButton(${label}): Button not found, length: ${buttons.length} ${avaibale.join(", ")}`)
        }
        let button = buttons[0]
        if (!button.getEnabled()) throw Error(`pressButton(${label}): Button not enabled`)
        return !!button.firePress()
    }

    getVisiblePage() {
        return this.getComponents("sap.m.Page").filter((X) => this.isVisibleContainer(X))[0]
    }

    extractErrorPageMessage() {
        let page = this.getVisiblePage()
        if (!page) return undefined
        let content = page.getContent()[0]
        if (content.isA("sap.m.IllustratedMessage"))
            return { title: content.getTitle(), description: content.getDescription() }
        return undefined
    }

    getDynamicPages() {
        return this.getComponents("sap.f.DynamicPage")
    }

    getObjectPageLayouts() {
        return this.getComponents("sap.uxap.ObjectPageLayout")
    }

    getPageCount() {
        let found = this.getObjectPageLayouts()
            .concat(this.getDynamicPages())
            .filter((X) => this.hasVisibleContainer(X), this)
        return found.length
    }

    getCurrentPage() {
        let found = this.getObjectPageLayouts()
            .concat(this.getDynamicPages())
            .filter((X) => this.hasVisibleContainer(X), this)
        if (found.length != 1) throw Error(`getCurrentPage: exact page not found, length: ${found.length}`)
        return found[0]
    }

    listTableTitlesWithTotals() {
        let pageName = this.getCurrentPage().getParent().getId()
        let re = new RegExp(`${pageName}--fe::table::.*::LineItem-title$`)
        return this.getComponentsByIdRe(re)
            .map((X) => X.getText())
            .filter((X) => X.length)
    }

    extractTableNameFromTotals(s) {
        if (s.indexOf("(") == -1) return s
        let re = /(.*) \([\d\.\,]*\)/
        return s.match(re)[1]
    }

    getTableName(table) {
        let pageId = this.getCurrentPage().getParent().getId()
        let re = new RegExp(`${pageId}--fe::table::(.*)::LineItem`)
        return table.getId().match(re)[1]
    }

    findTable(nameOrTitle) {
        let table = this.findTableByName(nameOrTitle)
        if (table) return table
        return this.findTableByTitle(nameOrTitle)
    }

    findTableByName(name) {
        let pageName = this.getCurrentPage().getParent().getId()
        let re = new RegExp(`${pageName}--fe::table::${name}::LineItem-innerTable$`)
        return this.getComponentsByIdRe(re)[0]
    }

    findTableByTitle(title) {
        let pageName = this.getCurrentPage().getParent().getId()
        let re = new RegExp(`${pageName}--fe::table::.*::LineItem-title$`)
        let titles = this.getComponentsByIdRe(re)
            .filter((X) => X.getText && X.getText())
            .map((X) => {
                if (X.getText) {
                    return [this.extractTableNameFromTotals(X.getText()), X.getParent().getParent()]
                }
                return undefined
            }, this)
            .filter((X) => X)
        if (title === "?") throw Error(`findTableByTitle - available: ${titles.map((T) => T[0]).join(", ")}`)
        let found = titles.filter((X) => X[0].startsWith(title))
        if (found.length == 0) return this.findTableByTitleInSection(title)
        if (found.length != 1) {
            let available = titles.map((T) => T[0])
            throw Error(
                `findTableByTitle(${title}): exact table not found, length: ${found.length}, available: ${available.join(", ")}`
            )
        }
        return found[0][1]
    }

    findTableByTitleInSection(title) {
        let pageName = this.getCurrentPage().getParent().getId()
        let re = new RegExp(`${pageName}--fe::FacetSection::.*::LineItem$`)
        let titles = this.getComponentsByIdRe(re)
            .filter((X) => X.getTitle && X.getTitle())
            .map((X) => {
                if (X.getTitle) {
                    let ren = new RegExp(`${pageName}--fe::FacetSection::(.*)::LineItem$`)
                    let extr = X.getId().match(ren)
                    let ret = new RegExp(`${pageName}--fe::table::${extr[1]}::LineItem-innerTable$`)
                    let table = this.getComponentsByIdRe(ret)[0]
                    return [X.getTitle(), table]
                }
                return undefined
            }, this)
            .filter((X) => X)
        if (title === "?") throw Error(`findTableByTitleInSection - available: ${titles.map((T) => T[0]).join(", ")}`)
        let found = titles.filter((X) => X[0].startsWith(title))
        if (found.length != 1) {
            let available = titles.map((T) => T[0])
            throw Error(
                `findTableByTitleInSection(${title}): exact table not found, length: ${found.length}, available: ${available.join(", ")}`
            )
        }
        return found[0][1]
    }

    getListReports() {
        let re = /\-\-fe\:\:ListReport$/
        return this.getComponentsByIdRe(re)
    }

    getObjectPages() {
        let re = /\-\-fe\:\:ObjectPage$/
        return this.getComponentsByIdRe(re)
    }

    getVisibleListReport() {
        let reports = this.getListReports().filter((X) => this.hasVisibleContainer(X))
        if (reports.length != 1)
            throw Error(`getVisibleListReport: failed to find a visible report, found: ${reports.length}`)
        return reports[0]
    }

    getVisibleListReportName() {
        let report = this.getVisibleListReport()
        return report.getParent().getId()
    }

    getVisibleObjectPage() {
        let pages = this.getObjectPages().filter((X) => this.hasVisibleContainer(X))
        if (!pages) throw Error("No visible Object Page located, length: " + pages.length)
        return pages[0]
    }

    getVisibleObjectPageName() {
        let objectPage = this.getVisibleObjectPage()
        if (!objectPage) throw Error("Not an Object Page")
        return objectPage.getParent().getId()
    }

    pressTile(name) {
        const found = this.getComponents("sap.m.GenericTile").filter((X) => X.getProperty("header") === name)
        if (found.length !== 1) return "Tile not found, length:" + found.length
        return !!found[0].firePress()
    }

    extractObjectPageContentWithBindingInfo() {
        function isCompositeBinding(X) {
            return X instanceof sap.ui.model.CompositeBinding
        }

        function getBindings(X) {
            let binding = X.getBinding("text")
            if (isCompositeBinding(binding)) return binding.getBindings().map((X) => X.getPath())
            return binding.getPath()
        }

        function extractData(X) {
            return {
                bindings: getBindings(X),
                text: X.getProperty("text"),
                value: X.getBinding("text").getValue(),
                composite: isCompositeBinding(X.getBinding("text"))
            }
        }

        return this.getComponents()
            .filter((X) => X.getAggregation)
            .map((X) => X.getAggregation("content"))
            .filter((X) => X && X.getAggregation)
            .map((X) => X.getAggregation("contentDisplay"))
            .filter((X) => X && X.getProperty && X.getProperty("text"))
            .filter((X) => X && X.getBinding && X.getBinding("text"))
            .map(extractData)
    }

    extractTableContentWithBindingInfo() {
        function isCompositeBinding(X) {
            return X instanceof sap.ui.model.CompositeBinding
        }

        function getBindings(X, p) {
            let binding = X.getBinding(p)
            if (!binding) return undefined
            if (isCompositeBinding(binding)) return binding.getBindings().map((Y) => Y.getPath())
            return binding.getPath()
        }

        function extractData(X) {
            if (!X.mBindingInfos) return undefined
            let info = Object.keys(X.mBindingInfos)
                .map((name) => {
                    let path = getBindings(X, name)
                    return { name, value: X.mProperties[name], path }
                })
                .filter((Y) => Y.path) // no bindings
            if (info.length == 0) return undefined
            return info
        }

        function extractCells(X) {
            return X.map(extractData).filter((Y) => Y && Y.length > 0)
        }

        return this.getComponents()
            .filter((X) => X.getAggregation)
            .map((X) => X.getAggregation("cells"))
            .filter((X) => X)
            .map(extractCells)
            .filter((Y) => Y && Y.length > 0)
    }

    dumpObjectPageHeader(header) {
        let items = header.getItems()
        return this.reduce(
            items.map((I) => {
                return {
                    title: I.getTitle(),
                    data: this.reduce(
                        I.getItems().map((II) => {
                            return this.reduce(
                                II.getItems().map((III) => {
                                    return this.reduce(this.dumpTableCellText(III))
                                })
                            )
                        })
                    )
                }
            })
        )
    }

    // unpack array with one element
    reduce(A) {
        if (typeof A === "object") {
            if (Array.isArray(A)) {
                if (A.length == 1) return this.reduce(A[0])
                return A
            }
            if (A.title && A.data && A.data.length == 2 && A.title == A.data[0]) return { [A.title]: A.data[1] }
        }
        return A
    }

    extractObjectPageContent() {
        let objectPage = this.getVisibleObjectPage()
        return this.extractSectionsContent(objectPage)
    }

    dumpObjectPageHeaderTitle(headerTitle) {
        // sap.uxap.ObjectPageDynamicHeaderTitle
        let snappedHeading = this.dumpFormElementWrapperItems(headerTitle.getSnappedHeading().getItems())
        let snappedContent = headerTitle
            .getSnappedContent()
            .map((T) => T.getItems && this.dumpFormElementWrapperItems(T.getItems()), this)
            .filter((X) => X)
        let R = {}
        this.addReduced("heading", this.reduce(snappedHeading), R)
        this.addReduced("content", this.reduce(snappedContent), R)
        return R
    }

    extractSectionsContent(objectPage) {
        // sap.uxap.ObjectPageSection
        let R = {}

        let headerTitle = this.dumpObjectPageHeaderTitle(objectPage.getHeaderTitle())
        this.addReduced("headerTitle", headerTitle, R)

        let headers = objectPage.getHeaderContent()
        let head = this.reduce(headers.map((H) => this.dumpObjectPageHeader(H)))
        let sections = objectPage.getSections()
        sections.map((S) => {
            let title = S.getTitle()
            let value = this.dumpObjectPageSection(S)
            if (title && value) R[title] = value
        })
        this.addReduced("head", head, R)
        return R
    }

    addReduced(name, element, result) {
        if (Object.keys(element).length == 1) {
            let oneKey = Object.keys(element)[0]
            let oneElement = element[oneKey]
            if (!result[oneKey]) result[oneKey] = oneElement
            else result[name] = element
        } else {
            result[name] = element
        }
    }

    dumpObjectPageSection(section) {
        let R = {}
        let title = section.getTitle()
        let subsections = section.getSubSections()
        if (subsections.length == 1 && subsections[0].getTitle() == title)
            return this.dumpObjectPageSubSection(subsections[0]) //section as subsection - skip one level
        subsections.forEach((S, I) => {
            let title = S.getTitle()
            let value = this.dumpObjectPageSubSection(S)
            if (title && value) R[title] = value
        }, this)
        return R
    }

    dumpObjectPageSubSection(subsection) {
        let grid = subsection._getGrid()
        let gridContent = grid.getContent()
        if (gridContent.length == 0) {
            return this.dumpBlockContent(subsection.getBlocks()[0])
        }
        gridContent = gridContent.filter((C) => C.getMetadata().getName() != "sap.ui.core.InvisibleText")
        let block = gridContent[0]
        if (!block.getContent) {
            return this.dumpBlockContent(block)
        }
        let blockContent = block.getContent()
        let content2 = blockContent.getContent()
        return this.dumpBlockContent(content2)
    }

    dumpBlockContent(block) {
        let type = block.getMetadata().getName()
        if (type == "sap.ui.mdc.Table") return this.dumpMdcTable(block)
        if (type == "sap.ui.layout.form.Form") {
            let data = {}
            block.getFormContainers().forEach((C) => this.dumpFormContainer(C, data), this)
            return data
        }
        if (type == "sap.ui.core.InvisibleText") return
        throw Error(`dumpBlockContent: ${type} no supported`)
    }

    dumpFormContainer(formContainer, data) {
        let formElements = formContainer.getFormElements()
        formElements.forEach((E) => {
            let fields = E.getFields()
            let label = E.getLabel()
            if (label != null && typeof label !== "string") label = label.getText()
            let value = this.reduce(
                fields
                    .filter((F) => F.getContent())
                    .map((F) => F.getContent())
                    .map((C) => (C.getContentDisplay ? C.getContentDisplay().getText() : ""))
            )
            if (label === "" && value.length == 0) return
            if (data[label] != undefined) {
                let _label = label
                let idx = 1
                while (data[label] != undefined) label = `${_label}.${idx++}`
            }
            data[label] = value
        })
        if (Object.keys(data) === 0) return undefined
    }

    getFieldWrapperControls(oFieldWrapper) {
        return oFieldWrapper.getEditMode() === "Display"
            ? [oFieldWrapper.getContentDisplay()]
            : oFieldWrapper.getContentEdit()
    }

    dumpTableCellText(cell) {
        let type = cell.getMetadata().getName()
        if (type == "sap.fe.macros.field.FieldAPI") {
            let content = cell.getContent().contentDisplay
            if (!content) content = cell.getContent()
            let cdType = content.getMetadata().getName()
            if (cdType == "sap.fe.core.controls.FormElementWrapper") return this.dumpFormElementWrapper(content)
            if (cdType == "sap.fe.core.controls.ConditionalWrapper") return this.getConditionalWrapperText(content)
            if (cdType == "sap.m.VBox") return this.dumpFormElementWrapperItems(content.getItems())
            if (cdType == "sap.m.HBox") return this.dumpFormElementWrapperItems(content.getItems())
            return content.getText()
        } else if (type == "sap.fe.core.controls.FormElementWrapper") {
            return this.dumpFormElementWrapper(cell)
        } else if (type == "sap.fe.core.controls.ConditionalWrapper") {
            return this.getConditionalWrapperText(cell)
        } else if (type == "sap.m.HBox") {
            return this.dumpFormElementWrapperItems(cell.getItems())
        } else if (type == "sap.m.Text") {
            return cell.getText()
        } else if (type == "sap.m.Title") {
            return cell.getText()
        } else if (type == "sap.m.ObjectIdentifier") {
            return cell.getTitle()
        } else if (cell.getText) {
            return cell.getText()
        }
        throw Error(`extractTableCellText - Error: Cell ${type} not supported ${cell.getId()}`)
    }

    getConditionalWrapperText(wrapper) {
        let content = wrapper.getCondition() ? wrapper.getContentTrue() : wrapper.getContentFalse()
        return content.getText()
    }

    dumpFormElementWrapper(wrapper) {
        let content = wrapper.content
        let ctype = content.getMetadata().getName()
        if (ctype == "sap.m.VBox") return this.dumpFormElementWrapperItems(content.getItems())
        else if (ctype == "sap.ui.unified.Currency")
            return { value: content.getStringValue() || content.getValue(), currency: content.getCurrency() }
        else if (ctype == "sap.m.Avatar") return content.getSrc()
        return `dumpFormElementWrapper - Error: Cell value ${ctype} not supported`
    }

    dumpTable(table) {
        // sap.m.Table
        let columns = table.getColumns()
        let columnNames = columns.map((C) => C.getHeader().getLabel().getText())
        let items = table.getItems()
        return items.map((row) => {
            let cells = row.getCells()
            let R = {}
            cells.map((column, i) => {
                let columnName = columnNames[i]
                R[columnName] = this.dumpTableCellText(column)
            }, this)
            return R
        })
    }

    dumpMdcTable(table) {
        let columns = table.getColumns()
        let columnNames = columns.map((C) => {
            let name = C.getHeader()
            if (name.trim().length == 0) name = C.getDataProperty()
            return name
        })

        let content = table.getAggregation("_content")
        let items = content.getItems()
        return items.map((row) => {
            let cells = row.getCells()
            let R = {}
            cells.map((column, i) => {
                let columnName = columnNames[i]
                R[columnName] = this.dumpTableCellText(column)
            }, this)
            return R
        })
    }

    attachEventHandler() {
        window.allUIEvents = 0
        sap.ui.getCore().attachEvent("UIUpdated", (e) => {
            window.allUIEvents += 1
        })
        return true
    }

    getEvents() {
        let ret = window.allUIEvents
        window.allUIEvents = 0
        return ret
    }

    getListReportTableDefinition() {
        return this.getVisibleListReport().getContent().getTableDefinition()
    }

    getListReportTableActions() {
        return this.getListReportTableDefinition().annotation.standardActions.actions
    }

    getListReportFilterBar() {
        // sap.fe.core.controls.FilterBar
        let listReport = this.getVisibleListReport()
        let items = listReport.getAggregation("header").getAggregation("content")[0].getAggregation("items")
        let filterBarAPI = items[0]
        return filterBarAPI.content
    }

    findSearchButtonInFilterBar() {
        let filterBar = this.getListReportFilterBar()
        let searchButton = filterBar._getSearchButton()
        return searchButton
    }

    findBasicSearchFieldInFilterBar() {
        let filterBar = this.getListReportFilterBar()
        let basicSearchField = filterBar.getBasicSearchField()
        return basicSearchField
    }

    firePressOnBasicSearchButton() {
        let searchButton = this.findSearchButtonInFilterBar()
        return !!searchButton.firePress()
    }

    firePressOnAdaptFilterButton() {
        let filterBar = this.getListReportFilterBar()
        let adaptButton = filterBar._btnAdapt
        return !!adaptButton.firePress()
    }

    //sap.suite.ui.generic.template.ListReport
    isListReportSmartTemplate(page) {
        let re = /\:\:sap.suite.ui.generic.template.ListReport.view.ListReport\:\:/
        return page.getId().match(re) != null
    }

    isListReport(page) {
        let re = /\-\-fe\:\:ListReport$/
        return page.getId().match(re) != null
    }

    getCurrentFilter() {
        let page = this.getCurrentPage()
        if (this.isListReportSmartTemplate(page)) {
            let header = page.getHeader()
            let filter = header.getContent()[0]
            return {
                button: {
                    adaptFilters: filter._oFiltersButton,
                    search: filter._oSearchButton
                },
                field: {
                    search: filter._oBasicSearchField
                }
            }
        }
        if (this.isListReport(page)) {
            let filterBar = this.getListReportFilterBar()
            return {
                button: {
                    adaptFilters: filterBar._btnAdapt,
                    search: filterBar._getSearchButton()
                },
                field: {
                    search: filterBar.getBasicSearchField()._getContent()[0]
                }
            }
        }
        throw Error(`getCurrentFilterBar: page not supported: ${page.getId()}`)
    }

    getListReportTable() {
        return this.getVisibleListReport().getContent() // bookshop::BooksList--fe::table::Books::LineItem::Table
    }

    pressButtonHavingIcon(icon) {
        const buttons = this.getComponents("sap.m.Button")
            .filter((X) => X.mProperties)
            .filter((X) => X.mProperties.icon === icon)
        if (buttons.length != 1)
            throw Error(`pressButtonHavingIcon: target button not found, length: ${buttons.length}`)
        return !!buttons[0].firePress()
    }

    // view report -> adapt filters -> group view
    pressGroupViewButtonInAdaptFilters() {
        return this.pressButtonHavingIcon("sap-icon://group-2")
    }

    pressListViewButtonInAdaptFilters() {
        return this.pressButtonHavingIcon("sap-icon://list")
    }

    pressOkInAdaptFilterDialog() {
        let dialog = this.findDialogByTitle("Adapt Filters")
        let buttons = dialog.getButtons().filter((B) => B.getText() === "OK")
        if (buttons.length != 1)
            throw Error(`pressOkInAdaptFilterDialog: Button not found, length: ${foundItem.length}`)
        let buttonOK = buttons[0]
        return !!buttonOK.firePress()
    }

    selectRowInAdaptFilterDialog(targetRow) {
        let dialog = this.findDialogByTitle("Adapt Filters")
        let filterBar = dialog.getContent()[0] // sap.ui.mdc.filterbar.p13n.AdaptationFilterBar
        let layout = filterBar._oFilterBarLayout
        let panel = layout.getInner()
        let view = panel.getCurrentViewContent()
        let table = view._oListControl // sap.m.Table
        let tableItems = table.getItems() // sap.m.ColumnListItem[]
        let checkbox = tableItems[targetRow].getMultiSelectControl() // sap.m.CheckBox
        if (!checkbox.getSelected()) {
            let id = checkbox.getId()
            return !!$("#" + id).tap()
        }
        return undefined
    }

    tapOnAnyId(id) {
        $(this.jqid(id)).trigger("tap")
    }

    tapOnComponentWithProperty(type, property, value, parent = false) {
        let found = this.getComponents(type)
            .filter((X) => X.mProperties[property] == value)
            .filter((X) => this.hasVisibleParent(X))
        if (found.length != 1)
            throw Error(
                `tapOnComponent(${type},${property},${value}): exact component not found, length: ${found.length}`
            )
        let component = found[0]
        if (parent) component = component.getParent()
        return !!$("#" + component.getId()).tap()
    }

    tapOnText(text, parent = false) {
        return this.tapOnComponentWithProperty("sap.m.Text", "text", text, parent)
    }

    tapOnLink(text, parent = false) {
        return this.tapOnComponentWithProperty("sap.m.Link", "text", text, parent)
    }

    tapOnObjectIdentifier(title, parent = false) {
        return this.tapOnComponentWithProperty("sap.m.ObjectIdentifier", "title", title, parent)
    }

    tapOn(textOrLink, parent = false) {
        try {
            return this.tapOnComponentWithProperty("sap.m.Text", "text", textOrLink, parent)
        } catch (e) {}
        return this.tapOnComponentWithProperty("sap.m.Link", "text", textOrLink, parent)
    }

    selectFieldInAdaptFilterDialog(fieldLabel) {
        let dialog = this.findDialogByTitle("Adapt Filters")
        let filterBar = dialog.getContent()[0] // sap.ui.mdc.filterbar.p13n.AdaptationFilterBar
        let filterItems = filterBar.getFilterItems() // sap.ui.mdc.FilterField
        let targetRow = filterItems.findIndex((X) => X.getLabel() == fieldLabel)
        if (targetRow == -1) {
            let available = filterItems.map((X) => X.getLabel())
            throw Error(`selectRowInAdaptFilterDialog(${fieldLabel}) - no found, avaibale: ${available.join(", ")}`)
        }
        return this.selectRowInAdaptFilterDialog(targetRow)
    }

    selectAllFieldsInAdaptFilterDialog() {
        let dialog = this.findDialogByTitle("Adapt Filters")
        let filterBar = dialog.getContent()[0] // sap.ui.mdc.filterbar.p13n.AdaptationFilterBar
        let filterItems = filterBar.getFilterItems()
        filterItems
            .map((_, row) => {
                // sap.ui.mdc.FilterField
                return this.selectRowInAdaptFilterDialog(row)
            })
            .filter((X) => X)
    }

    pressButtonInDialog(buttonText, dialogCaption) {
        let buttons = this.getComponents("sap.m.Button")
            .filter((X) => X.mProperties && X.getText() == buttonText)
            .filter((X) => X.getParent().getMetadata().getName() == "sap.m.Dialog")
            .filter((X) => X.getParent().getTitle() == dialogCaption)
            .filter((X) => X.getParent().isActive())
        if (buttons.length != 1) throw Error("Button not found, length: " + buttons.length)
        return !!buttons[0].firePress()
    }

    findDialogByTitle(title) {
        let dialogs = this.getComponents("sap.m.Dialog")
            .filter((X) => X.getTitle() === title)
            .filter((X) => X.isActive())
        if (dialogs.length != 1) throw Error("Dialog not found, length: " + dialogs.length)
        return dialogs[0]
    }

    findActiveDialogByState(state) {
        return this.getComponents("sap.m.Dialog").filter((X) => X.getState() === state && X.isActive())
    }

    findInactiveDialogByState(state) {
        return this.getComponents("sap.m.Dialog").filter((X) => X.getState() === state && !X.isActive())
    }

    findActiveErrorDialog() {
        let dialogs = this.findActiveDialogByState("Error")
        return dialogs[0]
    }

    findLastInactiveErrorDialog() {
        let dialogs = this.findInactiveDialogByState("Error")
        if (dialogs.length === 0) return
        return dialogs[dialogs.length - 1]
    }

    hasActiveErrorDialog() {
        return this.findActiveDialogByState("Error").length > 0
    }

    hasInactiveErrorDialog() {
        return this.findInctiveDialogByState("Error").length > 0
    }

    findFieldInValueHelpDialog(fieldLabel) {
        let filterBar = this.findVisibleValueHelpDialogFilterBar() // sap.ui.mdc.filterbar.vh.FilterBar
        let filterItems = filterBar.getFilterItems()
        let found = filterItems.filter((X) => X.getLabel() == fieldLabel)
        if (found.length != 1) {
            let available = filterItems.map((X) => X.getLabel())
            throw Error(
                `selectRowInAdaptFilterDialog(${fieldLabel}) - no exact match, found: ${found.length}, avaibale: ${available.join(", ")}`
            )
        }
        return found[0]
    }

    findVisibleValueHelpDialogFilterBar() {
        let found = this.getComponents([
            "sap.ui.mdc.filterbar.vh.FilterBar",
            "sap.ui.mdc.filterbar.p13n.AdaptationFilterBar"
        ]).filter((X) => this.hasVisibleParentDialog(X), this)
        if (found.length != 1)
            throw Error(`findVisibleValueHelpDialogFilterBar: FilterBar not found, length: ${found.length}`)
        return found[0]
    }

    enterValueInPrompt(value) {
        let dialog = this.findActiveDialog()
        let form = dialog.getContent()[0]
        let field = form.getContent()[1]
        if (field.getBaseType() == "Numeric") field.setValue(parseFloat(value))
        else field.setValue(value)
    }

    pressButtonInActiveDialog(label) {
        let dialog = this.findActiveDialog()
        let button = dialog.getButtons().filter((X) => X.getText() == label)[0]
        if (!button) throw Error(`pressButtonInActiveDialog(${label}): button not found`)
        if (!button.getVisible())
            throw Error(`pressButtonInActiveDialog(${label},${button.getId()}): button not visible`)
        return !!button.firePress()
    }

    extractErrorDialogContent(dialog) {
        return this.reduce(
            dialog
                .getContent()[0]
                .getItems()
                .map((I) => {
                    if (I.getTitle) return I.getTitle()
                    if (I.getText) return I.getText()
                    return JSON.stringify(I.mProperties)
                })
        )
    }

    extractActiveErrorDialogItems() {
        let dialog = this.findActiveErrorDialog()
        if (!dialog) return
        return this.extractErrorDialogContent(dialog)
    }

    extractInactiveErrorDialogItems() {
        let dialog = this.findLastInactiveErrorDialog()
        if (!dialog) return
        return this.extractErrorDialogContent(dialog)
    }

    async pressViewDetailsInErrorDialog(dialog) {
        let links = this.reduce(
            dialog
                .getContent()[0]
                .getItems()
                .filter((I) => I.getMetadata().getName() == "sap.m.Link")
        )
        links.map((L) => !!$("#" + this.jqid(L.getId())).tap())
        return links.length > 0
    }

    async pressViewDetailsInActiveErrorDialog() {
        let dialog = this.findActiveErrorDialog()
        if (!dialog) return
        return !!this.pressViewDetailsInErrorDialog(dialog)
    }

    async pressViewDetailsInInactiveErrorDialog() {
        let dialog = this.findLastInactiveErrorDialog()
        if (!dialog) return
        return !!this.pressViewDetailsInErrorDialog(dialog)
    }

    findListItemInDialog(dialog, itemText) {
        function hasItemWithText(items, itemText) {
            return (
                items
                    .getContent()[0]
                    .getItems()
                    .filter((I) => I.getText() === itemText).length > 0
            )
        }

        let lists = dialog.getContent().filter((X) => X.getMetadata().getName() === "sap.m.List")
        if (lists.length != 1) throw Error("List not found, length: " + lists.length)
        let listItems = lists[0].getItems()
        let foundItem = listItems.filter((X) => hasItemWithText(X, itemText))
        if (foundItem.length != 1) throw Error("Item not found, length: " + foundItem.length)
        return foundItem[0]
    }

    chooseItemInListDialog(dialogName, itemText) {
        let dialog = this.findDialogByTitle(dialogName)
        let item = this.findListItemInDialog(dialog, itemText)
        let buttons = dialog.getButtons().filter((B) => B.getText() === "OK")
        if (buttons.length != 1) throw Error("Button not found, length: " + foundItem.length)
        let buttonOK = buttons[0]
        item.getList().attachEvent("select", () => buttonOK.firePress())
        item.getList().setSelectedItem(item, true, true)
    }

    _sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    findSearchFieldInFilterBar() {
        //sap.ui.mdc.FilterField
        let basicSearchField = this.findBasicSearchFieldInFilterBar()
        //sap.m.SearchField
        if (basicSearchField._getContent) return basicSearchField._getContent()[0]
        return basicSearchField.getCurrentContent()[0]
    }

    editSearchField(value) {
        return !!this.findSearchFieldInFilterBar().fireChange({ value })
    }

    performBasicSearch(value) {
        let filter = this.getCurrentFilter()
        return filter.field.search.clear({ value })
    }

    findShellSearchByIcon() {
        return this.getComponents("sap.ushell.ui.shell.ShellHeadItem").filter(
            (X) => X.getProperty("icon") == "sap-icon://search"
        )
    }

    findHeaderField(fieldLabel) {
        let pageName = this.getVisibleObjectPageName()
        let formName = pageName + "--fe::EditableHeaderForm"
        let forms = this.getComponentsById(formName)
        if (forms.length != 1) throw Error(`Header form missing, got ${forms.length} forms`)
        let elements = forms[0].getFormContainers()[0].getFormElements()
        let found = elements.filter((EE) => EE.getLabel().getText() == fieldLabel)
        if (found.length != 1) throw Error(`Field ${fieldLabel} in header not found, got: ${found.length} elements`)
        return found[0]
    }

    listFieldGroupFields() {
        let groups = this.listFieldGroups()
        return groups.map((group) => {
            let elements = group.getFormElements()
            let fields = elements.map((E) => E.getLabel())
            return { group, fields }
        })
    }

    listFieldGroupFieldLabels() {
        let groups = this.listFieldGroups()
        return groups
            .map((group) => {
                let elements = group.getFormElements()
                return elements.map((E) => E.getLabel())
            })
            .flat()
    }

    listFieldGroups() {
        let pageName = this.getVisibleObjectPageName()
        let formName = new RegExp(`^${pageName}--fe::FormContainer::FieldGroup::[a-zA-Z]*$`)
        return this.getComponentsByIdRe(formName)
    }

    listFieldGroupNames() {
        let pageName = this.getVisibleObjectPageName()
        let formName = new RegExp(`^${pageName}--fe::FormContainer::FieldGroup::([a-zA-Z]*)$`)
        return this.getComponentsByIdReExt(formName)
    }

    findGroup(groupName) {
        let pageName = this.getVisibleObjectPageName()
        let formName = pageName + "--fe::FormContainer::FieldGroup::" + groupName
        let forms = this.getComponentsById(formName)
        if (forms.length != 1) throw Error(`Form for group ${groupName} missing, got ${forms.length} forms`)
        return forms[0]
    }

    findGroupField(groupName, fieldLabel) {
        let form = this.findGroup(groupName)
        let elements = form.getFormElements()
        let found = elements.filter((E) => E.getLabel() == fieldLabel)
        if (found.length != 1)
            throw Error(`Field ${fieldLabel} in group ${groupName} not found, got: ${found.length} elements`)
        return found[0]
    }

    listGroupFields(groupName) {
        let form = this.findGroup(groupName)
        let elements = form.getFormElements()
        return elements.map((E) => E.getLabel())
    }

    getFormAPIs() {
        let pageName = this.getPageName()
        return this.getComponents("sap.fe.macros.form.FormAPI").filter((X) => X.getId().startsWith(pageName))
    }

    getAllFormContainers() {
        return this.getFormAPIs()
            .map((X) => X.getContent())
            .map((X) => X.getFormContainers())
    }

    getAllFormFontainerElements() {
        return this.getAllFormContainers()
            .flat()
            .map((X) => X.getFormElements())
    }

    listFormContainerElementLabels() {
        return this.getAllFormFontainerElements()
            .flat()
            .map((X) => X.getLabel())
    }

    findFormElementField(fieldLabel) {
        let found = this.getAllFormFontainerElements()
            .flat()
            .filter((X) => X.getLabel() === fieldLabel)
        if (found.length === 1) return found[0]
        let available = this.listAllFieldLabels()
        throw Error(
            `findFormElementField: one field ${fieldLabel} not found, length: ${found.length}, available: ${available.join(", ")}`
        )
    }

    listAllFieldLabels() {
        let groupFields = this.listFieldGroupFieldLabels()
        let feLabels = this.listFormContainerElementLabels()
        return groupFields.concat(feLabels)
    }

    getIdentificationForm() {
        let pageName = this.getVisibleObjectPageName()
        let formName = pageName + "--fe::FormContainer::Identification"
        let forms = this.getComponentsById(formName)
        if (forms.length != 1) throw Error(`Identificatoin form missing, got ${forms.length} forms`)
        return forms[0]
    }

    listIdentificationFields() {
        let form = this.getIdentificationForm()
        let elements = form.getFormElements()
        return elements.map((E) => E.getLabel())
    }

    findIdentificationField(fieldLabel) {
        let form = this.getIdentificationForm()
        let elements = form.getFormElements()
        let found = elements.filter((E) => E.getLabel() == fieldLabel)
        if (found.length != 1)
            throw Error(`Field ${fieldLabel} in group ${groupName} not found, got: ${found.length} elements`)
        return found[0]
    }

    setFieldText(field, newText) {
        field.getFields()[0].getContent().getContentDisplay().setText(newText)
    }

    findField(fieldLabel) {
        if (this.hasActiveDialog()) return this.findFieldInValueHelpDialog(fieldLabel)
        try {
            let groupFields = this.listFieldGroupNames()
                .map((F) => {
                    try {
                        return this.findGroupField(F, fieldLabel)
                    } catch (e) {}
                }, this)
                .filter((X) => X)
            if (groupFields.length == 1) {
                return groupFields[0]
            }
        } catch (e) {}
        try {
            return this.findHeaderField(fieldLabel)
        } catch (e) {}
        try {
            return this.findIdentificationField(fieldLabel)
        } catch (e) {}
        try {
            return this.findFormElementField(fieldLabel)
        } catch (e) {}
        try {
            return this.findFilterBarField(fieldLabel)
        } catch (e) {}
        let available = this.listAllFieldLabels()
        throw Error(`findField: field ${fieldLabel} not found, available: ${available.join(", ")}`)
    }

    editField(fieldLabel, newText) {
        let field = this.findField(fieldLabel)
        return this.setFieldText(field, newText)
    }

    modifyField(fieldLabel, newText) {
        let field = this.findField(fieldLabel)
        if (field.getMetadata().getName() == "sap.ui.layout.form.FormElement") {
            if (!this.hasAtLeastOneFieldInputWithoutValueHelp(fieldLabel))
                if (this.openValueHelpDialogForField(fieldLabel)) return false
        }
        if (field.getMetadata().getName() == "sap.ui.mdc.FilterField") {
            if (this.openValueHelpDialogForFilterField(fieldLabel)) return false
        }
        this.setFieldText(field, newText)
        return true
    }

    editGroupField(groupName, fieldLabel, newText) {
        let field = this.findGroupField(groupName, fieldLabel)
        this.setFieldText(field, newText)
    }

    editHeaderField(fieldLabel, newText) {
        let field = this.findHeaderField(fieldLabel)
        this.setFieldText(field, newText)
    }

    editIdentificationField(fieldLabel, newText) {
        let field = this.findIdentificationField(fieldLabel)
        this.setFieldText(field, newText)
    }

    hasOpenedValueHelpPopover() {
        let found = this.getComponents("sap.ui.mdc.valuehelp.Popover").filter((X) => X.isOpen())
        return found.length > 0
    }

    findOpenedValueHelpPopover() {
        let found = this.getComponents("sap.ui.mdc.valuehelp.Popover").filter((X) => X.isOpen())
        if (found.length == 0) throw Error("findOpenedValueHelpPopover - nothing found")
        if (found.length > 1) throw Error(`findOpenedValueHelpPopover - found too many: ${found.length}`)
        return found[0]
    }

    findOpenedPopover() {
        let found = this.getComponents("sap.m.Popover").filter((X) => X.isOpen())
        if (found.length == 0) throw Error("findOpenedPopover - nothing found")
        if (found.length > 1) throw Error(`findOpenedPopover - found too many: ${found.length}`)
        return found[0]
    }

    findVisibleCalendar() {
        let popover = this.findOpenedPopover()
        let calendar = popover.getContent()[1]
        if (!calendar || !calendar.isA("sap.ui.unified.Calendar")) {
            let available = popover.getContent().map((X) => X.getMetadata().getName())
            throw Error(`findVisibleCalendar - missing calendar, available: ${available.join(", ")}`)
        }
        return calendar
    }

    selectDayInVisibleCalendar(text) {
        let calendar = this.findVisibleCalendar() // sap.ui.unified.Calendar
        let month = calendar.getAggregation("month")[0] //sap.ui.unified.calendar.Month
        var aDomRefs = month._oItemNavigation.getItemDomRefs()
        for (let i = 0; i < aDomRefs.length; i++) {
            if (aDomRefs[i].innerText == text)
                return !!month.onsapselect({ target: aDomRefs[i], stopPropagation: () => {}, preventDefault: () => {} })
        }
        throw Error(`selectDayInVisibleCalendar - text not found: ${text}`)
    }

    selectYearInVisibleCalendar(text) {
        let calendar = this.findVisibleCalendar() // sap.ui.unified.Calendar
        let years = calendar.getAggregation("yearPicker") //sap.ui.unified.calendar.YearPicker
        let itemNavigation = years._oItemNavigation
        var aDomRefs = itemNavigation.getItemDomRefs()
        for (let i = 0; i < aDomRefs.length; i++) {
            if (aDomRefs[i].innerText == text) {
                itemNavigation.setFocusedIndex(i)
                if (!years._selectYear(i))
                    throw Error("selectYearInVisibleCalendar - could not select year, index: ${i}")
                years.fireSelect()
                return true
            }
        }
        throw Error(`selectYearInVisibleCalendar - text not found: ${text}`)
    }

    selectMonthInVisibleCalendar(text) {
        let calendar = this.findVisibleCalendar() // sap.ui.unified.Calendar
        let months = calendar.getAggregation("monthPicker") //sap.ui.unified.calendar.MonthPicker
        let itemNavigation = months._oItemNavigation
        var aDomRefs = itemNavigation.getItemDomRefs()
        for (let i = 0; i < aDomRefs.length; i++) {
            if (aDomRefs[i].innerText == text) {
                itemNavigation.setFocusedIndex(i)
                months._selectMonth(i)
                months.fireSelect()
                return true
            }
        }
        throw Error(`selectMonthInVisibleCalendar - text not found: ${text}`)
    }

    rollVisibleCalendar(action) {
        let calendar = this.findVisibleCalendar() // sap.ui.unified.Calendar
        let date = new Date()
        if (action == "tomorrow") date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        else if (action == "next month") date.setFullYear(date.getFullYear(), date.getMonth() + 1)
        else if (action == "next year") date.setFullYear(date.getFullYear() + 1)
        else throw Error(`scrollVisibleCallendar - wrong action: ${action}`)
        calendar.focusDate(date)
    }

    performActionOnVisibleCalendar(action) {
        let calendar = this.findVisibleCalendar() // sap.ui.unified.Calendar
        let header = calendar.getAggregation("header")
        if (action === "today") return !!header.firePressCurrentDate()
        if (action === "month") return !!header.firePressButton1()
        if (action === "year") return !!header.firePressButton2()
        if (action === "next") return !!header.firePressNext()
        if (action === "previous") return !!header.firePressPrevious()
        throw Error(`performActionOnVisibleCalendar - wrong action: ${action}`)
    }

    pressStandardActionButtonInObjectPageHeader(name) {
        let button = this.findObjectPageStandardActionButton(name)
        button.firePress()
    }

    dumpFormElementWrapperItems(items) {
        let R = {}
        items.map((I) => {
            let type = I.getMetadata().getName()
            if (type == "sap.m.ObjectIdentifier") {
                R.text = I.getTitle() || I.getText()
            } else if (type == "sap.m.ObjectMarker") {
                R.marker = I.getType()
                if (I.getAdditionalInfo()) R.info = I.getAdditionalInfo()
            } else if (type == "sap.m.VBox") {
                R.items = this.dumpFormElementWrapperItems(I.getItems())
            } else if (type == "sap.m.FlexBox") {
                R.items = this.dumpFormElementWrapperItems(I.getItems())
            } else if (type == "sap.m.ObjectStatus") {
                R.status = I.getText()
            } else if (type == "sap.m.Label") {
                R.text = I.getText()
            } else if (type == "sap.m.Text") {
                R.text = I.getText()
            } else if (type == "sap.m.FormattedText") {
                R.html = I.getHtmlText()
            } else if (type == "sap.m.Title") {
                R.title = I.getText()
            } else if (type == "sap.ui.layout.cssgrid.CSSGrid") {
                R.grid = this.dumpFormElementWrapperItems(I.getItems())
            } else if (type == "sap.ui.codeeditor.CodeEditor") {
                R.value = I.getValue()
            } else if (type == "sap.m.MessageStrip") {
                R.message = I.getText()
            } else {
                throw Error("extractFormElementWrapperItems does not support " + type + ":" + I.sId)
            }
        })
        return R
    }

    // extract title or text from all rows
    extractTableRows() {
        let listReportName = this.getVisibleListReportName()
        let rex = "^" + listReportName + "--fe::table::.*::LineItem-innerTableRow-__clone\\d*$"
        let reInnerTableRow = new RegExp(rex.replaceAll(":", "\\:"))

        let that = this

        //X:ColumnListItem
        function getCellProperties(X) {
            let table = X.getTable()
            let columns = table.getColumns()
            let columnNames = columns.map((C) => {
                let header = C.getHeader()
                if (header && header.isA("sap.ui.mdc.table.ColumnHeaderLabel")) return header.getText()
                return undefined
            })
            let cells = X.getCells()
            let R = {}
            try {
                cells.map((C, iC) => {
                    let columnName = columnNames[iC]
                    R[columnName] = that.dumpTableCellText(C)
                })
            } catch (e) {
                console.log("getCellProperties failed", e)
            }
            return R
        }

        function isRowVisible(elementId) {
            let element = document.getElementById(elementId)
            if (!element) return false
            return element.tagName == "TR" // is it table row?
        }

        function isVisibleInnerTableRow(X) {
            let id = X.sId
            if (!id) return false
            if (!id.match(reInnerTableRow)) return false
            return isRowVisible(id)
        }

        return this.getComponents().filter(isVisibleInnerTableRow).map(getCellProperties)
    }

    getParentOfComponentWithProperty(type, property, value) {
        let components = this.getComponents(type).filter((X) => X.mProperties && X.mProperties[property] == value && X)
        if (components.length != 1)
            throw Error(`getParentOfComponentWithProperty: failed to find the component, found: ${components.length}`)
        return components[0].getParent().getId()
    }

    getElementsWithProperty(property, value) {
        return this.getComponents().filter((X) => X.mProperties && X.mProperties[property] == value && X)
    }

    dumpParents(element) {
        if (!element) return
        console.log("-----", element.getMetadata().getName(), "-----")
        this._dumpParents(element.getParent())
    }

    _dumpParents(element) {
        if (!element) return
        console.log(element.getMetadata().getName())
        console.log("     ->", element.sId)
        this._dumpParents(element.getParent())
    }

    getElementWithPropertyAndDump(property, value) {
        let elements = this.getComponents().filter((X) => X.mProperties && X.mProperties[property] == value && X)
        if (elements.length != 1) {
            elements.map((E) => {
                console.log(E.sId, E)
                this.dumpParents(E)
            })
            throw Error(`getElementWithPropertyAndDump: failed to find the element, found: ${elements.length}`)
        }
        this.dumpParents(elements[0])
    }

    getVisibleListReportView() {
        let report = this.getVisibleListReport()
        return report.getParent()
    }

    getVisibleTableRows() {
        let listReportName = this.getVisibleListReportName()
        let rex = "^" + listReportName + "--fe::table::.*::LineItem-innerTableRow-__clone\\d*$"
        let reInnerTableRow = new RegExp(rex.replaceAll(":", "\\:"))
        return this.getComponents()
            .filter((X) => X.sId)
            .filter((X) => X.sId.match(reInnerTableRow))
            .filter((X) => document.getElementById(X.sId))
            .filter((X) => document.getElementById(X.sId).tagName == "TR")
            .map((X) => X.sId)
    }

    isReportViewVisible() {
        let hidden = Array.from(document.getElementsByClassName("sapMNavItemHidden")).map((X) => X.id)
        let view = this.getVisibleListReportView()
        if (!view) return false
        let parentId = view.getParent().oContainer.getId()
        if (hidden.includes(parentId)) return false
        return true
    }

    isNavItemHidden(id) {
        let items = Array.from(document.getElementsByClassName("sapMNavItemHidden")).filter((X) => X.id === id)
        return items.length === 1
    }

    isNavItem(id) {
        let items = Array.from(document.getElementsByClassName("sapMNavItem")).filter((X) => X.id === id)
        return items.length === 1
    }

    hasVisibleParent(component) {
        let container = this.getCurrentPage()
        while (component) {
            if (component.getId() == container.getId()) return true
            component = component.getParent()
        }
        return false
    }

    hasVisibleParentDialog(component) {
        let activeParentDialogId = this.findActiveDialog().getParent().getId()
        while (component) {
            if (component.getId() == activeParentDialogId) return true
            component = component.getParent()
        }
        return false
    }

    getVisibleListReportTable() {
        let report = this.getVisibleListReport()
        let content = report.getAggregation("content")
        if (!content) throw Error("getVisibleListReportTable - content not found")
        return content
    }

    getVisibleListReportTableLineItem() {
        return this.getVisibleListReportTable().getContent()
    }

    findContainer(component) {
        if (!component) return undefined
        if (component.oContainer) return component.oContainer
        return this.findContainer(component.getParent())
    }

    isVisibleContainer(container) {
        let id = container.getId()
        return this.isNavItem(id) && !this.isNavItemHidden(id)
    }

    hasVisibleContainer(component) {
        let container = this.findContainer(component)
        if (!container) return false
        if (this.isVisibleContainer(container)) return true
        while (container.getParent()) {
            container = container.getParent()
            if (this.isVisibleContainer(container)) return true
        }
        return false
    }

    getVisiblePopoverCount() {
        return this.getComponents("sap.m.Popover").filter((X) => X.oPopup.isOpen()).length
    }

    isComponentOpened(componentId) {
        let component = this.getComponentsById(componentId)[0]
        if (!component) throw Error(`Component ${componentId} not found`)
        return component.isOpen()
    }

    hasVisibleValueHelpForField(fieldName, origin) {
        let org = this.getComponentsById(origin)[0]
        let src = org.getParent().getParent()
        let search
        if (!src.isA("sap.ui.mdc.FilterField") && !src.isA("sap.ui.mdc.Field"))
            throw Error(`hasVisibleValueHelpForField(${fieldName}): unexpected type ${src.getMetadata().getName()}`)
        search = src.getId()
        let dialogs = this.getComponents("sap.m.Dialog").filter((X) => X.isOpen())
        let dialog = dialogs.filter((D) => {
            let valueHelp = D.getParent().getParent() // sap.ui.mdc.ValueHelp
            let control = valueHelp.getControl()
            if (!control) throw Error(`hasVisibleValueHelpForField(${fieldName}) - missing ValueHelp control`)
            return control.getId() == search
        })[0]
        if (dialog) return true
        let popups = this.getComponents("sap.m.Popover")
        let opened = popups.filter((X) => X.oPopup.isOpen())
        let found = opened[0]
        if (!found) return false
        let openByParentId
        if (found._oOpenBy.id) {
            openByParentId = found._oOpenBy.id
            let component = this.getComponentsById(openByParentId)[0]
            let field = this.upToParentOfType(component, "sap.ui.mdc.Field")
            return field.getId() == src.getId()
        } else {
            openByParentId = found._oOpenBy.getParent().getId()
        }
        return openByParentId == search
    }

    getFilterBarSearchButton() {
        let filterBar = this.getFilterBarInHeaderOfVisibleListReport()
        return filterBar._btnSearch
    }

    pressSearchButtonInFilterBar() {
        let button = this.getFilterBarSearchButton()
        button.firePress()
    }

    findFilterBarFieldByName(name) {
        let filterBar = this.getFilterBarInHeaderOfVisibleListReport()
        return filterBar._getFilterField(name)
    }

    findFilterBarFieldByLabel(label) {
        let items = this.getFilterItemsOfVisibleListReport()
        let available = items.map((X) => X.getLabel())
        let fields = available.filter((L) => L === label)
        if (fields.length != 1)
            throw Error(
                `findFilterBarFieldByLabel(${label}) - exact matching field not found, length: ${fields.length}, available: ${available.join(", ")}`
            )
        let found = available.findIndex((L) => L === label)
        return items[found]
    }

    findFilterBarField(name) {
        let field = this.findFilterBarFieldByName(name)
        if (!field) field = this.findFilterBarFieldByLabel(name)
        if (!field) throw Error(`FilterBar field not found: ${name}`)
        return field
    }

    findFieldValueHelp(name) {
        let field = this.findField(name)
        let vh = field.getFieldHelp()
        if (vh == null) vh = field.getId().replace("::FilterField::", "::FilterFieldValueHelp::")
        let found = this.getComponentsById(vh)
        if (found.length != 1)
            throw Error(`findFieldValueHelp(${name}): Failed to find component, length: ${found.length}`)
        return found[0]
    }

    selectItemInValueHelp(fieldName, text, tap = false) {
        if (this.hasOpenedValueHelpPopover()) return this.selectItemInValueHelpPopup(fieldName, text, tap)
        if (this.hasActiveDialog()) return this.selectOneRowInValueHelpDialog(0, text)
        return this.selectItemInFieldValueHelp(fieldName, text)
    }

    selectItemInValueHelpPopup(fieldName, text, tap = false) {
        let field = this.findField(fieldName)
        let fieldFieldValueHelpId
        try {
            fieldFieldValueHelpId = field
                .getFields()[0]
                .getContent()
                .contentEdit[0].getFocusElementForValueHelp()
                .getId()
        } catch (e) {}
        if (!fieldFieldValueHelpId) {
            let currentContent = field.getCurrentContent ? field.getCurrentContent() : field._getContent() // 1.114.6
            fieldFieldValueHelpId = currentContent[0]._getValueHelpIcon().getId()
        }

        let popover = this.findOpenedValueHelpPopover() //sap.ui.mdc.valuehelp.Popover
        let popoverFieldValueHelpId = popover.getParent().getId()
        popoverFieldValueHelpId = popoverFieldValueHelpId
            .replace("::FilterFieldValueHelp::", "::FilterField::")
            .replace("::FieldValueHelp::", "::FormElement::DataField::")

        if (!fieldFieldValueHelpId.startsWith(popoverFieldValueHelpId))
            throw Error(
                `selectItemInValueHelpPopup() - id mismatch ${fieldFieldValueHelpId}!=${popoverFieldValueHelpId}`
            )
        let content = popover.getContent()[0]
        if (content.isA("sap.ui.mdc.valuehelp.content.FixedList")) {
            this._selectItemInFixedList(content, text)
        } else {
            let table = content.getTable() //sap.m.Table
            this._selectItemInTable(table, text, tap)
        }
        return popover.getId()
    }

    selectItemInFieldValueHelp(fieldName, text) {
        let valueHelp = this.findFieldValueHelp(fieldName)
        let type = valueHelp.getMetadata().getName()
        if (type == "sap.ui.mdc.ValueHelp") return this._selectItemInValueHelp(valueHelp, text)
        if (type == "sap.ui.mdc.field.ListFieldHelp") return this._selectItemInValueHelpList(valueHelp, text)
        throw Error(`selectItemInValueHelp(${fieldName}): ${type} not supported`)
    }

    _selectItemInValueHelpList(valueHelp, text) {
        let vhid = valueHelp.getId()
        let list = this.getComponentsByIdRe(`^${vhid}-List$`)[0]
        if (!list) throw Error(`_selectItemInValueHelpList(${text}): list not found ${vhid}`)
        let found = list.getItems().filter((X) => X.getLabel() == text)
        if (found.length != 1)
            throw Error(`_selectItemInValueHelpList(${text}): item not found, length: ${found.length}`)
        let item = found[0]
        return !!$(this.jqid(item.getId())).tap()
    }

    _selectItemInValueHelp(valueHelp, value) {
        // sap.ui.mdc.ValueHelp
        let typeahead = valueHelp.getTypeahead()
        let content = typeahead._getContent()
        if (content.isA("sap.ui.mdc.valuehelp.content.FixedList"))
            this._selectItemInList(content.getDisplayContent(), value)
        else this._selectItemInTable(content.getTable(), value)
    }

    _selectItemInList(list, text) {
        // sap.m.List
        let items = list.getItems()
        let found = items.filter((X) => X.getLabel() == text)
        if (found.length != 1) {
            let available = items.map((X) => X.getLabel())
            throw Error(
                `_selectItemInList: Failed to find one matching item, length: ${found.length}, available: ${available.join(", ")}`
            )
        }
        let listItem = found[0]
        list.fireItemPress({ listItem })
    }

    _selectItemInFixedList(list, text) {
        // sap.ui.mdc.valuehelp.content.FixedList
        let items = list.getItems()
        let index = items.findIndex((X) => X.getText() == text)
        if (index == -1) {
            let available = items.map((X) => X.getText())
            throw Error(
                `_selectItemInFixedList: Failed to find one matching item, length: ${found.length}, available: ${available.join(", ")}`
            )
        }
        let id = list.getId() + "-item-" + list.getDomRef("List").id + "-" + index
        return !!$(this.jqid(id)).tap()
    }

    _selectItemInTable(table, value, tap = false) {
        if (!table.isA("sap.m.Table"))
            throw Error(
                `_selectItemInTable(${table.getId()}): expected: sap.m.Table, actual: ${table.getMetadata.getName()}`
            )
        let columnVisible = table.getColumns().map((C) => C.getVisible())
        let items = table.getItems()
        if (!value) {
            items.forEach((item) => {
                let checkbox = item.getMultiSelectControl()
                if (checkbox) checkbox.fireSelect({ selected: false })
                else throw Error(`_selectItemInTable: Failed to remove selection - missing MultiSelectControl`)
            })
            return
        }
        let found = items
            .map((I, index) => {
                let texts = I.getCells()
                    .filter((C, I) => columnVisible[I])
                    .map(this.dumpTableCellText, this)
                return texts.filter((T) => T == value).length == 0 ? -1 : index
            }, this)
            .filter((X) => X >= 0)
        if (found.length != 1)
            throw Error(`_selectItemInTable: Failed to find one matching row, length: ${found.length}`)
        let item = items[found[0]]
        let checkbox = item.getMultiSelectControl()
        if (checkbox && !tap) checkbox.fireSelect({ selected: true })
        else this.tapOnAnyId(item.getId())
    }

    _getColumnIndexByNameInMdcTable(mdcTable, columnName) {
        let columns = mdcTable.getColumns()
        if (typeof columnName === "number") return columnName
        let found = columns
            .map((C, I) => {
                if (C.getHeader() == columnName) return I
                return undefined
            })
            .filter((C) => C !== undefined)
        if (found.length != 1) throw Error(`Column '${columnName}' not found, length: ${found.length}`)
        return found[0]
    }

    findVisibleValueHelpDialog() {
        let dialogs = this.getComponents("sap.ui.mdc.valuehelp.Dialog")
        let found = dialogs.filter((D) => D.isOpen())
        if (found.length != 1) throw Error(`Dialog not found, length: ${found.length}`)
        return found[0]
    }

    clearSelectionInValueHelpDialog() {
        let mdcTable = this.getMdcTableInValueHelpDialog()
        mdcTable.clearSelection()
    }

    _selectRowInValueHelpDialog(rowIndex) {
        let table = this.getInnerTableInValueHelpDialog()
        if (!this.getTableUtils().hasRowHeader(table)) {
            // the selector is hidden
            let row = table.getRows()[rowIndex]
            if (this.getVersionInt() < 116) $(row.getDomRef("col0")).click()
            else $(row.getDomRef("col0")).tap()
        } else {
            if (this.getVersionInt() < 116) $(table.getDomRef("rowsel" + rowIndex)).click()
            else $(table.getDomRef("rowsel" + rowIndex)).tap()
        }
    }

    selectFirstMatchingRowInValueHelpDialog(columnName, searchText) {
        let rowIndex = this.findRowIndexInValueHelpDialog(columnName, searchText, true)
        this._selectRowInValueHelpDialog(rowIndex)
        return rowIndex
    }

    selectOneRowInValueHelpDialog(columnName, searchText) {
        let dialog = this.findVisibleValueHelpDialog()
        let rowIndex = this.findRowIndexInValueHelpDialog(columnName, searchText)
        this._selectRowInValueHelpDialog(rowIndex)
        return dialog.getId()
    }

    getMdcTableInValueHelpDialog() {
        let dialog = this.findVisibleValueHelpDialog()
        let mdcTable = dialog.getContent()[0].getTable()
        return mdcTable
    }

    getInnerTableInValueHelpDialog() {
        let dialog = this.findVisibleValueHelpDialog()
        let mdcTable = dialog.getContent()[0].getTable()
        let innerTable = mdcTable.getAggregation("_content")
        return innerTable
    }

    findRowIndexInValueHelpDialog(columnName, searchText, firstMatching = false) {
        let table = this.getInnerTableInValueHelpDialog()
        let mdcTable = this.getMdcTableInValueHelpDialog()
        let columnIndex = this._getColumnIndexByNameInMdcTable(mdcTable, columnName)
        let rows = table.getRows()
        let found = rows
            .map((R, I) => {
                let cells = R.getCells()
                let cell = cells[columnIndex]
                let text = this.dumpTableCellText(cell)
                if (searchText === text) return I
                return undefined
            })
            .filter((R) => R !== undefined)
        if (firstMatching && found.length > 0) return found[0]
        if (found.length != 1) throw Error(`Failed to find one matching row, length: ${found.length}`)
        return found[0]
    }

    getParentsOfType(component, type) {
        let R = [component]
        while (component) {
            if (component.isA(type) && component.getId) R.push(component)
            component = component.getParent && component.getParent()
        }
        return R
    }

    hasActiveDialog() {
        return this.getComponents("sap.m.Dialog").filter((X) => X.isActive()).length > 0
    }

    findActiveDialog() {
        let dialogs = this.getComponents("sap.m.Dialog").filter((X) => X.isActive())
        if (dialogs.length == 0) throw Error("findActiveDialog: no active dialogs")
        if (dialogs.length == 1) return dialogs[0]
        let found = []
        dialogs.forEach((dialog) => {
            let chain = this.getParentsOfType(dialog, "sap.ui.mdc.valuehelp.Dialog")
            if (chain.length > found.length) found = chain
        })
        return found[0]
    }

    hasFieldInputWithValueHelp(fieldName) {
        // price+currency
        let field = this.findField(fieldName)
        try {
            let edit = field.getFields()[0].getContent().getContentEdit()[0]
            let content = edit.getAggregation("_content")
            let vhFields = content.filter((c) => c.getShowValueHelp())
            return vhFields.length > 0
        } catch (e) {}
        return false
    }

    hasAtLeastOneFieldInputWithoutValueHelp(fieldName) {
        // price+currency
        let field = this.findField(fieldName)
        try {
            let edit = field.getFields()[0].getContent().getContentEdit()[0]
            let content = edit.getAggregation("_content")
            let vhFields = content.filter((c) => !c.getShowValueHelp())
            return vhFields.length > 0
        } catch (e) {}
        return false
    }

    callOnFocusInForField(field) {
        let currentContent = field.getCurrentContent()[0]
        let targetId = currentContent.getIdForLabel()
        let target = document.getElementById(targetId)
        field.onfocusin({ target })
    }

    openValueHelpForFieldInput(fieldName) {
        // price+currency
        let field = this.findField(fieldName)
        try {
            let edit = field.getFields()[0].getContent().getContentEdit()[0]
            this.callOnFocusInForField(edit)
            let content = edit.getAggregation("_content")
            let vhFields = content.filter((c) => c.getShowValueHelp())
            if (vhFields.length != 1)
                throw Error(`openValueHelpForFieldInput(${fieldName}): missing FieldInput with showValueHelp`)
            if (edit.getFocusElementForValueHelp) {
                edit.getFocusElementForValueHelp()
                let vhi = edit.getFocusElementForValueHelp()
                vhi.firePress()
                return vhi.getId()
            }
            vhFields[0].fireValueHelpRequest()
            return [vhFields[0]._oValueHelpIcon.getId(), field.getId()]
        } catch (e) {
            console.log("exception in openValueHelpForFieldInput", fieldName, e)
        }
        return false
    }

    hasValueHelp(fieldName) {
        if (this.hasFieldInputWithValueHelp(fieldName)) return true
        let field = this.findField(fieldName)
        if (field.getFocusElementForValueHelp) return true
        try {
            let edit = field.getFields()[0].getContent().getContentEdit()[0]
            if (edit.getFocusElementForValueHelp) return true
        } catch (e) {}
        return false
    }

    openValueHelpDialogForField(fieldName) {
        if (this.hasFieldInputWithValueHelp(fieldName)) return this.openValueHelpForFieldInput(fieldName)
        if (this.hasActiveDialog()) return this.openValueHelpDialogForDialogFilterField(fieldName)
        else if (this.getVisibleObjectPage()) return this.openValueHelpDialogForObjectField(fieldName)
        else return this.openValueHelpDialogForFilterField(fieldName)
    }

    openValueHelpDialogForObjectField(fieldName) {
        let field = this.findField(fieldName)
        let edit = field.getFields()[0].getContent().getContentEdit()[0]
        if (!edit.getFocusElementForValueHelp) return undefined
        let content = edit.getAggregation("_content")
        if (content?.length > 1) return undefined // price+currency
        this.callOnFocusInForField(edit)
        let vhi = edit.getFocusElementForValueHelp()
        vhi.firePress()
        return vhi.getId()
    }

    openValueHelpDialogForFilterField(fieldName) {
        let field = this.findFilterBarField(fieldName)
        if (!field.getFocusElementForValueHelp) return undefined
        this.callOnFocusInForField(field)
        let vhi = field.getFocusElementForValueHelp()
        vhi.firePress()
        return vhi.getId()
    }

    openValueHelpDialogForDialogFilterField(fieldName) {
        let field = this.findField(fieldName)
        if (!field.getFocusElementForValueHelp) return undefined
        this.callOnFocusInForField(field)
        let vhi = field.getFocusElementForValueHelp()
        vhi.firePress()
        return vhi.getId()
    }

    pressOkInValueHelpDialog() {
        let dialog = this.findVisibleValueHelpDialog()
        //dialog.oButtonOK.firePress();
        let container = dialog._getContainer ? dialog._getContainer() : dialog.getAggregation("_container")
        let okButton = container.getButtons().filter((B) => B.getText() == "OK")[0]
        if (!okButton) throw Error("pressOkInValueHelpDialog: button 'OK' not found!")
        okButton.firePress()
    }

    listFilterBarFields() {
        let filterBar = this.getFilterBarInHeaderOfVisibleListReport()
        return filterBar.getAggregation("dependents")
    }

    getFilterItemsOfVisibleListReport() {
        let filterBar = this.getFilterBarInHeaderOfVisibleListReport()
        return filterBar.getFilterItems()
    }

    getFilterBarButtons() {
        let filterBar = this.getFilterBarInHeaderOfVisibleListReport()
        return filterBar._oFilterBarLayout.getAllButtons()
    }

    listFilterBarFieldLabels() {
        let items = this.getFilterItemsOfVisibleListReport()
        return items.map((X) => X.getLabel())
    }

    listFilterBarFieldConditions() {
        let items = this.getFilterItemsOfVisibleListReport()
        return items.map((X) => X.getProperty("conditions"))
    }

    setTextInFilterField(name, value) {
        let field = this.findFilterBarField(name)
        field._getContent()[0].setValue(value)
    }

    getConditionsInFilterField(name) {
        let field = this.findFilterBarField(name)
        return field.getConditions()
    }

    appendConditionInFilterField(name, operator, values) {
        let field = this.findFilterBarField(name)
        if (!Array.isArray(values)) values = [values]
        let conditions = field.getConditions()
        conditions.push({ operator, values })
        field.setConditions(conditions)
    }

    addConditionEqualInFilterField(name, value) {
        this.appendConditionInFilterField(name, "EQ", value)
    }

    addConditionGreaterInFilterField(name, value) {
        this.appendConditionInFilterField(name, "GT", value)
    }

    clearConditionsInFilterBar(name) {
        let field = this.findFilterBarField(name)
        field.setConditions([])
    }

    applySearchFilter() {
        return !!this.getFilterBarInHeaderOfVisibleListReport().fireSearch()
    }

    getFilterBarInHeaderOfVisibleListReport() {
        let header = this.getVisibleListReport().getHeader()
        // sap.fe.macros.filterBar.FilterBarAPI
        let filterBarAPI = header.getContent()[0].getItems()[0]
        // sap.fe.core.controls.FilterBar
        let filterBar = filterBarAPI.getContent()
        return filterBar
    }

    getPageName() {
        let pageName
        try {
            pageName = this.getVisibleListReportName()
        } catch (e) {}
        if (!pageName)
            try {
                pageName = this.getVisibleObjectPageName()
            } catch (e) {}
        if (!pageName) throw Error("Failed to guess the name of the page")
        return pageName
    }

    extractTableRowsTotalCount(tableName) {
        let tablesWithTotals = this.listTableTitlesWithTotals()
        let filtered = tablesWithTotals.filter((X) => X.startsWith(tableName))
        if (filtered.length != 1) {
            let re = /(.*)( \([\d\.\,]*\))?/
            let available = tablesWithTotals
                .map((X) => X.match(re))
                .filter((X) => X)
                .map((X) => X[1])
            throw Error(
                `extractTableRowsTotalCount(${tableName}) - table not found, available: ${available.join(", ")}`
            )
        }
        let rext = /\(([\d\.\,]*)\)/
        let res = filtered[0].match(rext)
        if (!res) return 0
        let count = res[1].replaceAll(",", "").replaceAll(".", "")
        return parseInt(count)
    }

    extractTableContent(nameOrTitle) {
        return this.dumpTable(this.findTable(nameOrTitle))
    }

    extractCurrentPageContent() {
        let page = this.getCurrentPage()
        let type = page.getMetadata().getName()
        if (type === "sap.f.DynamicPage") return this.extractDynamicPageContent(page.getContent())
        if (type === "sap.uxap.ObjectPageLayout") {
            if (page.getContent) return this.extractObjectPageContent(page.getContent())
            if (page.getSections) return this.extractSectionsContent(page)
        }
        throw Error(`extractCurrentPageContent: unknown type ${type}`)
    }

    extractDynamicPageContent(content) {
        let type = content.getMetadata().getName()
        if (type === "sap.ui.comp.smarttable.SmartTable") {
            let result = content
                .getItems()
                .map((I) => this.extractKnownComponentsContent(I))
                .filter((L) => L !== undefined)
            return this.reduce(result)
        }
        if (type === "sap.fe.macros.table.TableAPI") {
            return this.dumpMdcTable(content.getContent())
        }
        throw Error(`extractDynamicPageContent: unknown type ${type}`)
    }

    extractKnownComponentsContent(component) {
        let type = component.getMetadata().getName()
        if (type === "sap.ui.table.TreeTable") return this.extractTreeTableContent(component)
        return undefined
    }

    extractTreeTableContent(table) {
        let rows = table.getRows()
        return rows.map((R) => R.getCells().map((C) => C.getText())).filter((V) => V[0] || V[1])
    }

    findObjectPageFooterBarMessageButton() {
        let pageName = this.getPageName()
        let id = `${pageName}--fe::FooterBar::MessageButton`
        return this.getComponents("sap.fe.macros.messages.MessageButton").filter((X) => X.sId == id)[0]
    }

    pressFooterBarMessageButton() {
        let button = this.findObjectPageFooterBarMessageButton()
        if (!button) throw Error("pressFooterBarMessageButton: button not found")
        return !!button.firePress()
    }

    extractFooterBarMessages() {
        let button = this.findObjectPageFooterBarMessageButton()
        if (!button) return []
        return button.oMessagePopover.getItems().map((X) => X.getTitle())
    }

    getBlockers() {
        let blockers = document.getElementsByClassName("sapUiBlockLayerTabbable")
        return blockers.length
    }

    jqid(id) {
        return "#" + $.escapeSelector(id)
    }

    getInbounds() {
        let ushellConfig = window["sap-ushell-config"]
        if (!ushellConfig) throw Error("No ushell config found!")
        let inbounds = ushellConfig.services.ClientSideTargetResolution.adapter.config.inbounds
        return Object.keys(inbounds).map((K) => [K, inbounds[K].resolutionResult.url])
    }
}

window.cds = new CDS()
x = window.cds
