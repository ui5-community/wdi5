# wdi5

## what

```
              Node.js                │        browser
                                     │
       ┌────────────────────┐        │  ┌─────────────────────┐
       │                    ├────────┼─►│        UI5          │
       │       wdi5         │        │  │  RecordReplay API   │
       │                    │◄───────┼──┤     w3c-webdriver   │
       │ (wdio-ui5-service) │        │  └─────────────────────┘
┌──────┼────────────────────┼──────┐ │
│      │                    │      │ │
│      └────────────────────┘      │ │
│           WebdriverIO            │ │
│                                  │ │
│                                  │ │
└──────────────────────────────────┘ │
                                     │
                                     │
```

---

# wdi5

## how

```
        ┌─────  you/CI  ──────┐
        │                     │
        ▼                     ▼
┌──────────────┐    ┌────────────────┐
│              │    │                │
│ ui5-tooling  │    │                │
│ (webserver)  │◄───┤     wdi5       │
│              │    │                │
│   UI5 app    │    │ test execution │
│              │    │                │
└──────────────┘    └────────────────┘
```

---

# wdi5

## where

```
          ┌───────────┐
          │           │     you are
          │    e2e    │◄───  here
          │           │
      ┌───┴───────────┴───┐
      │                   │
      │                   │
      │    Integration    │
      │                   │
   ┌──┴───────────────────┴──┐
   │                         │
   │                         │
   │        Component        │
   │                         │
┌──┴─────────────────────────┴──┐
│                               │
│             Unit              │
│                               │
│                               │
└───────────────────────────────┘
```

---

# wdi5

## why

- auto-sync w/ UI5 runtime
- UI5 api alignment
  - controls
  - managed object
- re-use OPA5 selectors

---

# wdi5

## next

- `wdio^8` enablement
- support SAP BUILD Work Zone, std edition
- hybride DSAG Schulung "CI mit UI5 + wdi5", 8.3.23
