/**
 * @module Draft
 * @memberof UI
 */

const { When } = require("@wdio/cucumber-framework")

/**
 * @name When we decide to keep the draft
 * @description Locates an active dialog with caption "Warning" and selects option "Keep Draft"
 * @example When we decide to keep the draft
 */
When("we decide to keep the draft", async function () {
    await this.controller.chooseItemInListDialog("Warning", "Keep Draft")
    await this.controller.waitToLoad()
})

/**
 * @name When we decide to discard the draft
 * @description Locates an active dialog with caption "Warning" and selects option "Discard Draft"
 * @example When we decide to discard the draft
 */
When("we decide to discard the draft", async function () {
    await this.controller.chooseItemInListDialog("Warning", "Discard Draft")
    await this.controller.waitToLoad()
})

/**
 * @name When we decide to save the draft
 * @description Locates an active dialog with caption "Warning" and selects option "Create"
 * @example When we decide to save the draft
 */
When("we decide to save the draft", async function () {
    await this.controller.chooseItemInListDialog("Warning", "Create")
    await this.controller.waitToLoad()
})

/**
 * @name When switch to active version
 * @description Switches to the active version of the current object instance displayed in an ObjectPage
 * @example When switch to active version
 */
When("switch to active version", async function () {
    await this.controller.switchToActiveVersion()
    await this.controller.waitToLoad()
})

/**
 * @name When switch to draft version
 * @description Switches to the draft version of the current object instance displayed in an ObjectPage
 * @example When switch to draft version
 */
When("switch to draft version", async function () {
    await this.controller.switchToDraftVersion()
    await this.controller.waitToLoad()
})

/**
 * @name When we edit current object
 * @description In ObjectPage performs press on button with caption "Edit"
 * @example When we edit current object
 */
When("we edit current object", async function () {
    await this.controller.pressStandardActionButtonInObjectPageHeader("Edit")
    await this.controller.waitToLoad()
})

/**
 * @name When we create draft
 * @description In ListReport performs press on button with caption "Create"
 * @example When we create draft
 */
When("we create draft", async function () {
    await this.controller.createDraft()
    await this.controller.waitToLoad()
})

/**
 * @name When we save the draft
 * @description In ObjectPage performs press on button with caption "Save"
 * @example When we save the draft
 */
When("we save the draft", async function () {
    await this.controller.saveDraft()
    await this.controller.waitToLoad()
})

/**
* @name When we discard draft
* @description In ObjectPage performs press on button with caption "Cancel",
    then confirms the action by choosing the "Discard" option in the dialog with question "Discard all changes?".
* @example When we discard draft
*/
When("we discard draft", async function () {
    await this.controller.discardDraft()
    await this.controller.waitEvents()
    await this.controller.confirmDiscardDraftOnObjectPage()
    await this.controller.waitToLoad()
})

/**
 * @name When we select draft editing status {string}
 * @description Selects the specified option in the appropriate ValueHelp element
 * @param {string} text editing status text
 * @example When we select draft editing status "Locked by Another User"
 */
When("we select draft editing status {string}", async function (text) {
    await this.controller.selectItemInValueHelp("Editing Status", text)
    await this.controller.waitEvents()
})
