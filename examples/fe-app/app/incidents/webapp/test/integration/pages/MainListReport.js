sap.ui.define(["sap/fe/test/ListReport"], function (ListReport) {
    "use strict"

    var AdditionalCustomListReportDefinition = {
        actions: {},
        assertions: {}
    }

    return new ListReport(
        {
            appId: "sap.fe.demo.incidents",
            componentId: "IncidentsList",
            entitySet: "Incidents"
        },
        AdditionalCustomListReportDefinition
    )
})
