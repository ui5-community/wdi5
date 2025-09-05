module.exports = {
    /**
     * define actions for the page object
     */

    iEnterTitle: async (sBook) => {
        await browser
            .asControl({
                selector: {
                    id: "books::BooksDetailsList--fe::EditableHeaderForm::EditableHeaderTitle::Field-edit"
                }
            })
            .enterText(sBook)
    },

    iSelectGenre: async () => {
        await browser
            .asControl({
                selector: {
                    id: "books::BooksDetailsList--fe::FormContainer::FieldGroup::General::FormElement::DataField::genre_ID::Field-edit-inner-vhi"
                }
            })
            .press()
        await browser
            .asControl({
                selector: {
                    controlType: "sap.m.Text",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "books::BooksDetailsList",
                    bindingPath: {
                        path: "/Genres(10)",
                        propertyPath: "ID"
                    },
                    searchOpenDialogs: true
                }
            })
            .press()
    },

    iSelectAuthor: async () => {
        await browser
            .asControl({
                selector: {
                    id: "books::BooksDetailsList--fe::FormContainer::FieldGroup::General::FormElement::DataField::author_ID::Field-edit-inner-vhi"
                }
            })
            .press()
        await browser
            .asControl({
                selector: {
                    controlType: "sap.m.Text",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "books::BooksDetailsList",
                    bindingPath: {
                        path: "/Authors(107)",
                        propertyPath: "name"
                    },
                    searchOpenDialogs: true
                }
            })
            .press()
    },

    iClickOnCreateButton: async () => {
        await browser
            .asControl({
                selector: {
                    id: "fe::FooterBar::StandardAction::Save",
                    viewId: "books::BooksDetailsList",
                    interaction: {
                        idSuffix: "BDI-content"
                    }
                }
            })
            .press()
    },

    iNavigateBack: async () => {
        await browser
            .asControl({
                selector: {
                    id: "backBtn"
                }
            })
            .press()
    },

    /**
     * define assertions for the page object
     */

    iSeeEditButton: async function () {
        const editButton = await browser.asControl({
            selector: {
                id: "fe::StandardAction::Edit",
                viewId: "books::BooksDetailsList",
                interaction: {
                    idSuffix: "BDI-content"
                }
            }
        })
        expect(editButton.isInitialized()).toBeTruthy()
    }
}
