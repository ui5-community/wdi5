describe("drive in Work Zone with testlib support", () => {
    let FioriElementsFacade
    before(async () => {
        FioriElementsFacade = await browser.fe.initialize({
            onTheMainPage: {
                ListReport: {
                    appId: "sap.fe.cap.travel",
                    componentId: "TravelList",
                    entitySet: "Travel"
                }
            },
            onTheDetailPage: {
                ObjectPage: {
                    appId: "sap.fe.cap.travel",
                    componentId: "TravelObjectPage",
                    entitySet: "Travel"
                }
            },
            onTheItemPage: {
                ObjectPage: {
                    appId: "sap.fe.cap.travel",
                    componentId: "BookingObjectPage",
                    entitySet: "Booking"
                }
            },
            onTheShell: {
                Shell: {}
            }
        })
    })

    it("should see the List Report page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Then.onTheMainPage.iSeeThisPage()
        })
    })

    it("should see the Object Pages load and then returns to list", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            When.onTheMainPage.onTable().iPressRow(1)
            Then.onTheDetailPage.iSeeThisPage()

            When.onTheDetailPage.onTable({ property: "to_Booking" }).iPressRow({ BookingID: "1" })
            Then.onTheItemPage.iSeeThisPage()

            // When.onTheShell.iNavigateBack() // beh, b/c wrong iframe
        })

        await FioriElementsFacade.onTheShell.iNavigateBack()
        await FioriElementsFacade.onTheShell.iNavigateBack()

        // we want:
        // await wdi5.wz.iNavigateBack()

        await FioriElementsFacade.execute((Given, When, Then) => {
            Then.onTheMainPage.iSeeThisPage()
        })
    })
})
