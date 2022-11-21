sap.ui.require(
    [
        "sap/fe/test/JourneyRunner",
        "sap/fe/demo/incidents/test/integration/pages/MainListReport",
        "sap/fe/demo/incidents/test/integration/pages/MainObjectPage",
        "sap/fe/demo/incidents/test/integration/OpaJourney"
    ],
    function (JourneyRunner, MainListReport, MainObjectPage, Journey) {
        "use strict"
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("sap/fe/demo/incidents") + "/index.html#fe-lrop-v4"
        })

        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        )
    }
)
