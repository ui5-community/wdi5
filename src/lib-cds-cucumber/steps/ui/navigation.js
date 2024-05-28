/**
 * @module Navigate
 * @memberof UI
 */

const { When } = require("@cucumber/cucumber")

/**
 * @name When we click on first Fiori preview page
 * @description Locates the first visible preview link in a default CAP home page and performs a click on it.
 * @example When we click on first Fiori preview page
 */
When("we click on first Fiori preview page", async function () {
    await this.controller.clickOnElementWithClass("preview")
    await this.controller.waitToLoad(100)
    if (!(await this.controller.initializeLibrary())) throw Error("Failed to initialize the library!")
    await this.controller.waitForPage(1000)
    await this.controller.waitToLoad(50)
})

/**
 * @name When we list all tiles
 * @description Retreives the list of all visible tiles in a Fiori Launchpad Home Page
 * @example When we list all tiles
 */
When("we list all tiles", async function () {
    this.result = await this.controller.getTiles()
})

/**
 * @name When we select tile {string}
 * @description Locates the specified tile in a Fiori Launchpad Home Page and performs a click on it.
 * @param {string} tile the name of the target tile
 * @example When we select tile "Browse Books"
 */
When("we select tile {string}", async function (tile) {
    await this.controller.pressTile(tile)
    // await this.controller.waitToLoad()
    // let message = await this.controller.extractErrorPageMessage()
    // if (message) throw Error(`Found unexpected error message: ${JSON.stringify(message)}`)
})

/**
 * @name When we go back
 * @description Locates the "go back" button in the browser navigation bar and performs a click on it.
 * @example When we go back
 */
When("we go back", async function () {
    await this.controller.back()
    await this.controller.waitBlockers(200)
})

/**
 * @name When we navigate back
 * @description Locates the "go back" button in a Fiori navigation bar and performs a click on it.
 * @example When we navigate back
 */
When("we navigate back", async function () {
    await this.controller.pressGoBackButton()
    await this.controller.waitToLoad()
})
