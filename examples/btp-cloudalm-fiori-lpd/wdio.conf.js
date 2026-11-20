import { baseConfig } from "../wdio.root-base.conf.cjs"

export const config = {
    ...baseConfig,
    specs: ["./*.test.js", "./*.test.ts"],
    baseUrl: "https://calm-demo.eu10.alm.cloud.sap/launchpad#Shell-home",
    capabilities: [
        {
            ...baseConfig.capabilities[0],
            // TODO: Tenant access and user details - SAP Cloud ALM Cloud Demo Tenant
            // https://support.sap.com/en/alm/demo-systems/cloud-alm-demo-system.html?anchorId=section_1154284084
            "wdi5:authentication": {
                provider: "BTP" //> mandatory
                //usernameSelector: "#j_username", //> optional; default: "#j_username"
                //passwordSelector: "#j_password", //> optional; default: "#j_password"
                //submitSelector: "#logOnFormSubmit" //> optional; default: "#logOnFormSubmit"
            }
        }
    ]
}
