sap.ui.define(["sap/fe/test/ObjectPage"], function (ObjectPage) {
    "use strict"

    // OPTIONAL
    var AdditionalCustomObjectPageDefinition = {
        actions: {},
        assertions: {}
    }

    return new ObjectPage(
        {
            appId: "sap.fe.demo.incidents", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "IncidentsObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "Incidents" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomObjectPageDefinition
    )
})
