module.exports = {
    extends: "eslint:recommended",
    env: {
        node: true,
        es6: true,
        jest: true
    },
    parserOptions: {
        ecmaVersion: 2017
    },
    globals: {
        browser: true,
        before: true,
        SELECT: true,
        INSERT: true,
        UPDATE: true,
        DELETE: true,
        CREATE: true,
        DROP: true,
        cds: true
    },
    rules: {
        "no-console": "off",
        "require-atomic-updates": "off"
    }
}
