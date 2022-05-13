# Issues

WDI5 supports multiple browsers via wdio. Nevertheless there is an issues in the combination of firefox with RegEx in `properties` selectors.

You can find examples of this in `basic.test.js`.

```js
// not working in firefox
await browser.asControl({
  selector: {
    controlType: "sap.m.Button",
    viewName: "test.Sample.view.Main",
    properties: {
      text: new RegExp(/.*ialog.*/gm)
    }
  }
})
```

```js
// working also in firefox
await browser.asControl({
  selector: {
    id: new RegExp(/.*DialogButton.*/gm)
  }
})
```
