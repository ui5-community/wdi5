module.exports = {
    /**
     * define actions for the page object
     */
    iClickOnCreateNewBook: async () => {
        await browser
            .asControl({
                selector: {
                    id: "fe::table::Books::LineItem::StandardAction::Create",
                    viewId: "books::BooksList",
                    interaction: {
                        idSuffix: "BDI-content"
                    }
                }
            })
            .press()
    },

    /**
     * define assertions for the page object
     */

    theBookListContains: async (sBook) => {
        const text = await browser
            .asControl({
                selector: {
                    controlType: "sap.m.Link",
                    viewId: "books::BooksList",
                    properties: {
                        text: sBook
                    }
                }
            })
            .getText()
        expect(text).toEqual(sBook)
    }
}
