/**
 * @module Actions
 * @memberof UI
 */

const { When } = require("@cucumber/cucumber")

/**
 * @name When we press button {string} in active dialog
 * @description Press the specified button in the currently active dialog
 * @param {string} label the label of the target button as displayed in the browser
 * @example When we press button "Accept" in active dialog
 */
When("we press button {string} in active dialog", async function (label) {
    await this.controller.pressButtonInActiveDialog(label)
    await this.controller.waitToLoad()
})

/**
 * @name When we press button {string}
 * @description Press the specified button located on the current page
 * @param {string} label the label of the target button as displayed in the browser
 * @example When we press button "Create"
 */
When("we press button {string}", async function (label) {
    await this.controller.pressButton(label)
    await this.controller.waitToLoad()
})

/**
 * @name When we create new item
 * @description Triggers creation of a new item by pressing the "Create" button located on the current page
 * @example When we create new item
 */
When("we create new item", async function () {
    await this.controller.pressButtonForLineItemTable("Create")
    await this.controller.waitToLoad()
})

/**
 * @name When we create new item for table {string}
 * @description Triggers creation of a new item for the specified table located on the current page by pressing its "Create" button
 * @param {string} tableName the name of the target table as displayed in the browser
 * @example When we create new item for table "Books"
 */
When("we create new item for table {string}", async function (tableName) {
    await this.controller.pressButtonForLineItemTable("Create", tableName)
    await this.controller.waitToLoad()
})

/**
 * @name When we delete selected rows in table {string}
 * @description Triggers deletion of selected items for the specified table located on the current page by pressing its "Delete" button
 * @param {string} tableName the name of the target table as displayed in the browser
 * @example When we delete selected rows in table "Books"
 */
When("we delete selected rows in table {string}", async function (tableName) {
    await this.controller.pressButtonForLineItemTable("Delete", tableName)
    await this.controller.waitEvents()
})

/**
 * @name When we create new item for table in section {string}
 * @description Triggers creation of a new item for the table located in the section with the specified name by pressing its "Create" button
 * @param {string} sectionName the name of the section as displayed in the browser which contais the target table
 * @example When we create new item for table in section "Books"
 */
When("we create new item for table in section {string}", async function (sectionName) {
    await this.controller.pressButtonForLineItemTableInSection("Create", sectionName)
    await this.controller.waitToLoad()
})

/**
 * @name When we delete the object instance
 * @description Triggers deletion of the current object instance in an ObjectPage by pressing its "Delete" button
 * @example When we delete the object instance
 */
When("we delete the object instance", async function () {
    await this.controller.deleteObjectInstance()
    await this.controller.waitEvents()
})

/**
 * @name When we confirm the deletion
 * @description Confirms triggered deletion in the currently visible "Delete" dialog by pressing its "Delete" button
 * @example When we confirm the deletion
 */
When("we confirm the deletion", async function () {
    await this.controller.pressButtonInDialog("Delete", "Delete")
    await this.controller.waitToLoad()
})

/**
 * @name When we perform object action {string}
 * @description Triggers the specified action of the current object instance located on an ObjectPage by pressing the button with the specified label
 * @param {string} label the label of the target button as displayed in the browser
 * @example When we perform object action "Reject"
 */
When("we perform object action {string}", async function (label) {
    await this.controller.pressObjectPageActionBarButton(label)
    await this.controller.waitEvents()
})

/**
 * @name When we click on text {string}
 * @description Locates an element having the specified text and performs a mouse click on it.
 * @param {string} text the text of the target UI element
 * @example When we click on text "John Doe"
 */
When("we click on text {string}", async function (text) {
    this.result = await this.controller.clickOnText(text)
    await this.controller.waitToLoad()
})

/**
 * @name When we click on link {string}
 * @description Locates a link having the specified text and performs a mouse click on it.
 * @param {string} text the text of the target link
 * @example When we click on link "John Doe"
 */
When("we click on link {string}", async function (text) {
    this.result = await this.controller.clickOnLink(text)
    await this.controller.waitToLoad()
})

/**
 * @name When we click on object identifier {string}
 * @description Locates an object identifier having the specified text and performs a mouse click on it.
 * @param {string} text the text of the target object identifier
 * @example When we click on object identifier "John Doe"
 */
When("we click on object identifier {string}", async function (text) {
    this.result = await this.controller.clickOnObjectIdentifier(text)
    await this.controller.waitToLoad()
})

/**
 * @name When we tap on text {string}
 * @description Locates an element having the specified text and fires a tap event on it.
 * @param {string} text the text of the target UI element
 * @example When we tap on text "John Doe"
 */
When("we tap on text {string}", async function (text) {
    this.result = await this.controller.tapOnText(text)
    await this.controller.waitToLoad()
})

/**
 * @name When we tap on link {string}
 * @description Locates a link having the specified text and fires a tap event on it.
 * @param {string} text the text of the target link
 * @example When we tap on link "John Doe"
 */
When("we tap on link {string}", async function (text) {
    this.result = await this.controller.tapOnLink(text)
    await this.controller.waitToLoad()
})

/**
 * @name When we tap on object identifier {string}
 * @description Locates an object identifier having the specified text and fires a tap event on it.
 * @param {string} text the text of the target object identifier
 * @example When we tap on object identifier "John Doe"
 */
When("we tap on object identifier {string}", async function (text) {
    this.result = await this.controller.tapOnObjectIdentifier(text)
    await this.controller.waitToLoad()
})

/**
 * @name When we tap on {string}
 * @description Locates a Text or a Link element having the specified text and fires a tap event on it.
 * @param {string} text the text of the target UI element
 * @example When we tap on "John Doe"
 */
When("we tap on {string}", async function (textOrLink) {
    this.result = await this.controller.tapOn(textOrLink)
    await this.controller.waitToLoad()
})

// TODO
When("save the result", async function () {
    this.saved = this.result
})

/**
 * @name When we tap on row {int} in table {string}
 * @description Locates the target table labeled with that name and fires a tap event on the specified row number.
 * @param {int} row target row number
 * @param {string} tableName target table
 * @example When we tap on row 5 in table "Books"
 */
When("we tap on row {int} in table {string}", async function (row, tableName) {
    if (row < 1) throw Error(`row number should be greater than zero, got: ${row}`)
    await this.controller.tapOnRowInLineItemTable(tableName, row - 1)
    await this.controller.waitEvents()
})

/**
 * @name When we apply the changes
 * @description Locates button with label "Apply" in an ObjectPage footer bar and fires a press event on it.
 * @example When we apply the changes
 */
When("we apply the changes", async function () {
    await this.controller.applyChanges()
    await this.controller.waitToLoad()
})
