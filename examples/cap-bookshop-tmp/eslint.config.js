const cds = require("@sap/eslint-plugin-cds")

module.exports = [
    cds.configs.recommended,
    {
        plugins: {
            "@sap/cds": cds
        },
        rules: {
            ...cds.configs.recommended.rules
        }
    }
]
