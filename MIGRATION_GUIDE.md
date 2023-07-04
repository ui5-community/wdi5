# migrating to `wdi5` 2.x

Version >= 2 of `wdi5` is WebdriverIO v8 compatible. This entails a move to ESM as primary module, with CJS compatibility ensured.

## check file sys dir references in your test code

dir references start from the dir the file is in now,  
not from `cwd`

```diff
const config = {
  - specs: [join("webapp", "test", "e2e", "ui5-late.test.js")],
  + specs: [join("..", "webapp", "test", "e2e", "ui5-late.test.js")],
  baseUrl: "https://github.com/ui5-community/wdi5/"
}
```
