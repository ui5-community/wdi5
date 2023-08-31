# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.5.5](https://github.com/ui5-community/wdi5/compare/v1.5.4...v1.5.5) (2023-08-31)


### Bug Fixes

* **devtools:** handle renewing webElements gracefully ([#527](https://github.com/ui5-community/wdi5/issues/527)) ([0190ce9](https://github.com/ui5-community/wdi5/commit/0190ce9d786bd42033f071128a969056b7661d88))

### [1.5.4](https://github.com/ui5-community/wdi5/compare/v1.5.3...v1.5.4) (2023-08-31)


### Bug Fixes

* safeguard devtools protocol stale web element ref ([#524](https://github.com/ui5-community/wdi5/issues/524)) ([ece986f](https://github.com/ui5-community/wdi5/commit/ece986f16f10426370fad4eb6d79b5f983262ab6))

### 1.5.3 (2023-08-22)


### Bug Fixes

* display different error message depending on the type ([#506](https://github.com/ui5-community/wdi5/issues/506)) ([0f8e356](https://github.com/ui5-community/wdi5/commit/0f8e356596429c5c34539ac00cfa20016aff00ce))

### 1.5.2 (2023-08-17)


### Bug Fixes

* invalidate control map when we injectUi5 ([#513](https://github.com/ui5-community/wdi5/issues/513)) ([b6b7210](https://github.com/ui5-community/wdi5/commit/b6b7210c2f760e97b4acc7bdb9e6ea84c4b16e73))

### 1.5.1 (2023-06-14)


### Bug Fixes

* safeguard browser.getTimeouts logging ([#483](https://github.com/ui5-community/wdi5/issues/483)) ([7ddd2ba](https://github.com/ui5-community/wdi5/commit/7ddd2ba1bd2368eb1a29fcf45e071ca4afa62d53)), closes [#473](https://github.com/ui5-community/wdi5/issues/473)

## 1.5.0 (2023-05-09)


### Features

* outsource auth tests, drop node 14, make node 16 dev default, align script timeout ([#465](https://github.com/ui5-community/wdi5/issues/465)) ([b2cb381](https://github.com/ui5-community/wdi5/commit/b2cb381f4f8319023a7a37e3946489c94af6ed11))

## 1.4.0 (2023-05-09)


### Features

* add exec to ui5 controls to boost performance for data retrieval from many ui5 child controls ([#456](https://github.com/ui5-community/wdi5/issues/456)) ([93116d4](https://github.com/ui5-community/wdi5/commit/93116d4efe01d7ef71c26dc1b63743bb6563e67e))

### 1.3.3 (2023-04-27)


### Bug Fixes

* queue on the node event loop to mitigate "waitAsync is already running bug" ([#455](https://github.com/ui5-community/wdi5/issues/455)) ([bed997e](https://github.com/ui5-community/wdi5/commit/bed997ec9816de75529df98505be4f2d31cb20f5)), closes [#452](https://github.com/ui5-community/wdi5/issues/452)

### 1.3.2 (2023-03-15)


### Bug Fixes

* **fe-lib:** transform milliseconds to seconds correctly for TestLibrary ([#443](https://github.com/ui5-community/wdi5/issues/443)) ([a7f840f](https://github.com/ui5-community/wdi5/commit/a7f840f2fb9ea1f57feebb37f77b9f432df240d2))

### 1.3.1 (2023-02-27)

## 1.3.0 (2023-02-24)


### Features

* devtools protocol enablement ([#430](https://github.com/ui5-community/wdi5/issues/430)) ([5eb8254](https://github.com/ui5-community/wdi5/commit/5eb8254a1f8f5ffc772f05eee958dab2f1ff0eac))

### 1.2.1 (2023-02-23)


### Bug Fixes

* make saveObject() work in unsecure contexts ([#419](https://github.com/ui5-community/wdi5/issues/419)) ([c293f0f](https://github.com/ui5-community/wdi5/commit/c293f0f23d7e8e8d3959a8be3d933f41a2e70ff0)), closes [#416](https://github.com/ui5-community/wdi5/issues/416)

## 1.2.0 (2023-02-08)


### Features

* allow for async client-side controller functions ([#423](https://github.com/ui5-community/wdi5/issues/423)) ([bde49d1](https://github.com/ui5-community/wdi5/commit/bde49d11cad0da58897326978c9fc65b6fd565ea)), closes [#417](https://github.com/ui5-community/wdi5/issues/417)

### 1.1.1 (2023-02-08)


### Bug Fixes

* rm obsolete design time artifacts ([#422](https://github.com/ui5-community/wdi5/issues/422)) ([f9bf300](https://github.com/ui5-community/wdi5/commit/f9bf3009a0760fdf1a025f23182d4ab7d03c11d2)), closes [#421](https://github.com/ui5-community/wdi5/issues/421)

## 1.1.0 (2023-01-30)


### Features

* make FE Test Library recognize Timeout Setting ([#411](https://github.com/ui5-community/wdi5/issues/411)) ([9d84414](https://github.com/ui5-community/wdi5/commit/9d8441400f735bfd4ad162943488e6a836624510))

### 1.0.5 (2023-01-13)


### Bug Fixes

* cucumber. again. ([#398](https://github.com/ui5-community/wdi5/issues/398)) ([a6123eb](https://github.com/ui5-community/wdi5/commit/a6123eba733ca9ccd5ad3e558060a02161d0c242)), closes [#348](https://github.com/ui5-community/wdi5/issues/348)

### 1.0.4 (2022-12-13)


### Bug Fixes

* resolve cucumber namespace conflict  ([#382](https://github.com/ui5-community/wdi5/issues/382)) ([acc4086](https://github.com/ui5-community/wdi5/commit/acc4086950b8ddfdcaaf918b00d52be400f42571)), closes [#348](https://github.com/ui5-community/wdi5/issues/348)

### 1.0.3 (2022-12-12)


### Bug Fixes

* **injectTools:** narrow down the UMD loader to window ([#387](https://github.com/ui5-community/wdi5/issues/387)) ([4f7994b](https://github.com/ui5-community/wdi5/commit/4f7994bbeedf65d50d27b86ce607f6034ad6d432)), closes [#386](https://github.com/ui5-community/wdi5/issues/386)

### 1.0.2 (2022-11-30)


### Bug Fixes

* wait for ui5 ([02d7f58](https://github.com/ui5-community/wdi5/commit/02d7f583ca7796af4b22879fd2286d8a44fef4f5))

### 1.0.1 (2022-11-24)


### Bug Fixes

* wait for the injection of wdi5 till the redirection finished ([#379](https://github.com/ui5-community/wdi5/issues/379)) ([2cc492e](https://github.com/ui5-community/wdi5/commit/2cc492e675d02af1618003e98abfb97c3324beab))

## 1.0.0 (2022-11-23)

## 1.0.0-pre.5 (2022-11-22)


### Bug Fixes

* make wdi5 config optional ([#376](https://github.com/ui5-community/wdi5/issues/376)) ([998e5c7](https://github.com/ui5-community/wdi5/commit/998e5c71ff818a75f3c953f95da69f0487176672))

## 1.0.0-pre.4 (2022-11-22)

## 1.0.0-pre.3 (2022-11-21)


### Features

* add watch support for authentication ([#372](https://github.com/ui5-community/wdi5/issues/372)) ([8eb564d](https://github.com/ui5-community/wdi5/commit/8eb564d338ac25d8279026c547a0324d2cd690c3))

## 1.0.0-pre.2 (2022-11-16)


### Bug Fixes

* planningcalender special case ([#371](https://github.com/ui5-community/wdi5/issues/371)) ([0258d71](https://github.com/ui5-community/wdi5/commit/0258d719b42786cb1913623838396dcbcfefe4ef))

## 1.0.0-pre.1 (2022-11-14)


### Features

* getObject ([#366](https://github.com/ui5-community/wdi5/issues/366)) ([2bca472](https://github.com/ui5-community/wdi5/commit/2bca472c792c7b3a6e82b197d7d4afedaa2c346f))

## 1.0.0-pre.0 (2022-11-14)


### Features

* authentication capabilities ([#369](https://github.com/ui5-community/wdi5/issues/369)) ([9c23bda](https://github.com/ui5-community/wdi5/commit/9c23bda7769a4421ed58eff28cae362ad9ea84ca)), closes [#207](https://github.com/ui5-community/wdi5/issues/207)

### 0.9.16 (2022-11-08)


### Features

* **types:** add viewId for dynamic UIs ([#365](https://github.com/ui5-community/wdi5/issues/365)) ([362d7d5](https://github.com/ui5-community/wdi5/commit/362d7d5498cea1b03bb62662d1e2c478486b86ea))

### 0.9.15 (2022-10-26)


### Bug Fixes

* multi-combo-box handling ([3432687](https://github.com/ui5-community/wdi5/commit/34326871e214d4a742fcc549adc1bdd1bd7a0232)), closes [#354](https://github.com/ui5-community/wdi5/issues/354)

### 0.9.14 (2022-10-26)

## 0.9.13 (2022-09-16)

### Features

* turn off logging per selector

## 0.9.12 (2022-09-09)

### Features

* support `press` OPA5 interaction for `wdi5` `press()` API
* enable `enterText()` in fluent async api
* more precise error messages (with causes)

## 0.9.11 (2022-09-08)

### Bug Fixes

## 0.9.10 (2022-07-27)

### Features

* improve error messages when control is not found ([#309](https://github.com/js-soft/wdi5/issues/309)) ([f7b3182](https://github.com/js-soft/wdi5/commit/f7b318263fe9eebc87ede950feeece51b865dec2)), closes [#304](https://github.com/js-soft/wdi5/issues/304)

## 0.9.9 (2022-07-05)

## 0.9.8 (2022-07-04)


### Features

* ts app sample ([#299](https://github.com/js-soft/wdi5/issues/299)) ([5f61a52](https://github.com/js-soft/wdi5/commit/5f61a52c6153f6463eb56330119fdd81ad721c64))

### 0.9.7 (2022-07-04)


### Bug Fixes

* remove typo from error handling ([#297](https://github.com/js-soft/wdi5/issues/297)) ([d549c74](https://github.com/js-soft/wdi5/commit/d549c747f15c750d94884cefbb497c866ce5133c))

## 0.9.6 (2022-06-29)

## 0.9.5 (2022-06-24)


### Features

* add multiremote support ([#272](https://github.com/js-soft/wdi5/issues/272)) ([fcb47cf](https://github.com/js-soft/wdi5/commit/fcb47cf1047c30ef653a890e022472afe885d613)), closes [#281](https://github.com/js-soft/wdi5/issues/281)

## 0.9.4 (2022-06-21)


### Bug Fixes

* FE testLibrary initialization ([#286](https://github.com/js-soft/wdi5/issues/286)) ([d5fddee](https://github.com/js-soft/wdi5/commit/d5fddeeb348eb503288a8f8978e58204d0642494)), closes [#276](https://github.com/js-soft/wdi5/issues/276)

## 0.9.3 (2022-06-20)


### Bug Fixes

* avoid referenced object manipulation ([#275](https://github.com/js-soft/wdi5/issues/275)) ([#280](https://github.com/js-soft/wdi5/issues/280)) ([a069544](https://github.com/js-soft/wdi5/commit/a069544166c4ba9b1494f63190bef121611d3229))

## 0.9.2 (2022-06-15)


### Features

* improved sync with ui5 core lifecycle ([#278](https://github.com/js-soft/wdi5/issues/278)) ([53e1a7e](https://github.com/js-soft/wdi5/commit/53e1a7e952a84825feb9b42a8a9a2684b2ff71f9))

## 0.9.1 (2022-05-23)


### Features

* support SAP's "v4 testing library" ([#221](https://github.com/js-soft/wdi5/issues/221)) ([0bbca82](https://github.com/js-soft/wdi5/commit/0bbca823277c8e814a04e6dc01bb497c3f683a42)), closes [#154](https://github.com/js-soft/wdi5/issues/154)

## 0.9.0 (2022-05-11)

## [0.9.0-rc4.3](https://github.com/js-soft/wdi5/compare/v0.9.0-rc4.2...v0.9.0-rc4.3) (2022-04-28)


### Bug Fixes

* **#241:** rm warning if control was not instatiated by $$ ([#242](https://github.com/js-soft/wdi5/issues/242)) ([0b6a111](https://github.com/js-soft/wdi5/commit/0b6a111ad66644fafb0856627850ba792641ce41)), closes [#241](https://github.com/js-soft/wdi5/issues/241)

## [0.9.0-rc4.2](https://github.com/js-soft/wdi5/compare/v0.9.0-rc4.1...v0.9.0-rc4.2) (2022-04-20)


### Features

* add to "best of UI5" ([#231](https://github.com/js-soft/wdi5/issues/231)) ([b17685c](https://github.com/js-soft/wdi5/commit/b17685c68c3f51ca1bf8b013b49eac90de1f9c73))
* proxy object-type return value ([#234](https://github.com/js-soft/wdi5/issues/234)) ([1959411](https://github.com/js-soft/wdi5/commit/1959411eb9e8dabf3b44521ee718991a7d9e2791))
* **wdi5-control:** .getControlInfo() for info on capabilities ([#214](https://github.com/js-soft/wdi5/issues/214)) ([965d8bb](https://github.com/js-soft/wdi5/commit/965d8bb02154f2bc59bf3be3076eb8950d3c6333))
* **wdi5-control:** .getControlInfo() for info on capabilities ([#214](https://github.com/js-soft/wdi5/issues/214)) ([073d917](https://github.com/js-soft/wdi5/commit/073d9177a89f898c7e89b6b9dfe5dd545e01ae54))

## [0.9.0-rc4.1](https://github.com/js-soft/wdi5/compare/v0.9.0-rc4...v0.9.0-rc4.1) (2022-04-12)


### Features

* wdio bridge via $() ([#179](https://github.com/js-soft/wdi5/issues/179)) ([41ef513](https://github.com/js-soft/wdi5/commit/41ef513960196de73c418d9f2357aec36f0fde13))


### Bug Fixes

* allControls with forceSelect ([#226](https://github.com/js-soft/wdi5/issues/226)) ([0dd6853](https://github.com/js-soft/wdi5/commit/0dd6853f3cebb4b4f134e7ef7664353bdbc4ec54)), closes [#225](https://github.com/js-soft/wdi5/issues/225)

## [0.9.0-rc4](https://github.com/js-soft/wdi5/compare/v0.9.0-rc3...v0.9.0-rc4) (2022-04-08)


### Features

* added selenium-service configuration sample ([#220](https://github.com/js-soft/wdi5/issues/220)) ([99dd250](https://github.com/js-soft/wdi5/commit/99dd250fd696371b7f68d0d56be30d62beaaa3fe))
* get all controls of a specific type ([#212](https://github.com/js-soft/wdi5/issues/212)) ([f4e8082](https://github.com/js-soft/wdi5/commit/f4e8082a6eae2116c12596524e7774bdb10bb6fa))
* **performance:** using custom waitForUI5 function to overcome sap.ui.test.RecordReplay promiseWaiter issue ([#217](https://github.com/js-soft/wdi5/issues/217)) ([53fd065](https://github.com/js-soft/wdi5/commit/53fd06511eb4d05004dbef72fa1bb9e931a7200d)), closes [#196](https://github.com/js-soft/wdi5/issues/196)
* wdio bridge via $() ([#179](https://github.com/js-soft/wdi5/issues/179)) ([acf026b](https://github.com/js-soft/wdi5/commit/acf026bd0cb7fdafa9412055ae0da23a51cad32c))


### Bug Fixes

* headless code example ([#216](https://github.com/js-soft/wdi5/issues/216)) ([a2d6ee8](https://github.com/js-soft/wdi5/commit/a2d6ee874627f699b9b5884ba14306e8245a2195))

## [0.9.0-rc3](https://github.com/js-soft/wdi5/compare/v0.9.0-rc2...v0.9.0-rc3) (2022-03-25)


### Features

* **combobox:** make aggregation work ([#191](https://github.com/js-soft/wdi5/issues/191)) ([c2984bd](https://github.com/js-soft/wdi5/commit/c2984bd153633105fe7ebe60c318b19fa8580525)), closes [#121](https://github.com/js-soft/wdi5/issues/121)


### Bug Fixes

* control getShorthand returns array-valued property ([#170](https://github.com/js-soft/wdi5/issues/170)) ([b7a2789](https://github.com/js-soft/wdi5/commit/b7a2789b1c26dd754afa5713a0f6431de7a5fca5)), closes [#172](https://github.com/js-soft/wdi5/issues/172)
* Version Checks ([#200](https://github.com/js-soft/wdi5/issues/200)) ([3648a98](https://github.com/js-soft/wdi5/commit/3648a984e442be37e17427b247c6f8d20a4422df))

## [0.9.0-rc2](https://github.com/js-soft/wdi5/compare/v0.9.0-rc1...v0.9.0-rc2) (2022-03-22)

## [0.9.0-rc1](https://github.com/js-soft/wdi5/compare/v0.9.0-alpha.1...v0.9.0-rc1) (2022-03-18)


### Features

* **devx:** auto open dev tools when DEBUG is set ([#168](https://github.com/js-soft/wdi5/issues/168)) ([048767b](https://github.com/js-soft/wdi5/commit/048767b4a1e240b7420bf33b6c000d531c04cc97))
* enhanced logger and tests ([#189](https://github.com/js-soft/wdi5/issues/189)) ([959f159](https://github.com/js-soft/wdi5/commit/959f159a78a3671ab169c415db9b1ed4781e351a))
* **logger:** custom tags in logger ([17eef1a](https://github.com/js-soft/wdi5/commit/17eef1aba365b1ed1620b99bb607157de0d9acc4))
* **matcher:** i18n, ancestor, descendant, sibling, labelFor ([1fd328c](https://github.com/js-soft/wdi5/commit/1fd328cab0de7cd0a6895d717447866ca7de0c7d)), closes [#129](https://github.com/js-soft/wdi5/issues/129) [#121](https://github.com/js-soft/wdi5/issues/121)


### Bug Fixes

* **118:** loggin of selector verification ([6ff7283](https://github.com/js-soft/wdi5/commit/6ff72836a1eccbf40cab524a3a07fe3c446c081d))
* **docs:** wdi5 types ref ([bfe7f6b](https://github.com/js-soft/wdi5/commit/bfe7f6b4dcd29c49bfba9c399235c19552d56ff0))
* **example-app:** types ref ([e983b4b](https://github.com/js-soft/wdi5/commit/e983b4b46d0993f78bef6f01bc4e29750ec80673))
* rm i18n changes ([6a1bcda](https://github.com/js-soft/wdi5/commit/6a1bcdac2893b54050b4102f6d7800aa7559fd38))
* safeguard empty baseURL ([#165](https://github.com/js-soft/wdi5/issues/165)) ([620f3b5](https://github.com/js-soft/wdi5/commit/620f3b5e0fa40280d87883d21fc366f9a8b6f7fb)), closes [#148](https://github.com/js-soft/wdi5/issues/148)

## [0.9.0-alpha.1](https://github.com/js-soft/wdi5/compare/v0.9.0-alpha.0...v0.9.0-alpha.1) (2022-03-04)


### Features

* support fiori elements id selector ([#159](https://github.com/js-soft/wdi5/issues/159)) ([352db78](https://github.com/js-soft/wdi5/commit/352db78190eaff9aa4d14b7b8239f51c85126a39))

## [0.9.0-alpha.0](https://github.com/js-soft/wdi5/compare/v0.8.2...v0.9.0-alpha.0) (2022-03-01)

### Features

- "ui5" plugin, webserver and tooling ([e912898](https://github.com/js-soft/wdi5/commit/e9128987ecaffbe6b09b649cecf819e3ea460539))
- add control selector ([f78dcb3](https://github.com/js-soft/wdi5/commit/f78dcb3ced30a86dcee846013517b3ce235e87b8))
- async api ([c94444b](https://github.com/js-soft/wdi5/commit/c94444b3dc40f57b0997061e433792af7bc8dd54))
- chrome flags ([c48a9bf](https://github.com/js-soft/wdi5/commit/c48a9bf799579b821be85680b6779ac9bf72ff35))
- colored console ([fd47ba5](https://github.com/js-soft/wdi5/commit/fd47ba53f5ad7da26f5eb052a665b78cef0561cd))
- **dev:** add commit linting ([a8ade45](https://github.com/js-soft/wdi5/commit/a8ade4528965710d39f396fae16245e04c081f67))
- **dev:** add linting for staged files ([f4fc3b1](https://github.com/js-soft/wdi5/commit/f4fc3b15eb82307c2be42216e0dc58b19f64ebfb))
- expose wdi5 class ([e88b25a](https://github.com/js-soft/wdi5/commit/e88b25af447f8af083985c3942ff41f5d2874020))
- hook up wdi5 commands to wdio ([37e55bd](https://github.com/js-soft/wdi5/commit/37e55bd11d23a5efd5f244db56a2ae895b96f621))
- initial plugin skeleton ([ea30572](https://github.com/js-soft/wdi5/commit/ea30572b6c51510ae20d5bab0058fc6995923693))
- introduce build script ([a6eac16](https://github.com/js-soft/wdi5/commit/a6eac16f929b6205917c2d4eae7a9e5e93774609))
- **late-inject:** make it work ([e523e43](https://github.com/js-soft/wdi5/commit/e523e435b51dd47300d7957d10f40cb3e214d9c5))
- logger ([7547b6a](https://github.com/js-soft/wdi5/commit/7547b6a4f5ef211737923cc0b5ea4ae99d78d9af))
- make \_getAggregation fluent-api compatible ([37ec913](https://github.com/js-soft/wdi5/commit/37ec91355dcc32d4d1c30449a6a2a6a5177e3948))
- **npm:** workspaces ([a0e77c1](https://github.com/js-soft/wdi5/commit/a0e77c113bf3a0ddd7ceaa92f4d4c64b3669fa11))
- outsource \_navTo ([9eaa97c](https://github.com/js-soft/wdi5/commit/9eaa97c4d6c6e169cb1898da5d7b5bd6b34031b6))
- prep npm distribution ([6228eef](https://github.com/js-soft/wdi5/commit/6228eefb6866cc9603397e047da6f92982393096))
- re-export browser commands ([1fea437](https://github.com/js-soft/wdi5/commit/1fea437ecc7f31e313a0d5556addc00efe6f1a5d))
- screenshot api ([bd9b3d2](https://github.com/js-soft/wdi5/commit/bd9b3d21c97c74bbff15e35650727fa26d67c056))
- **service:** expose injectUI5() ([4f3097a](https://github.com/js-soft/wdi5/commit/4f3097a8be3078bfb5b70c4993b5d9e2b1772025))
- **skeleton:** running e2e test ([0391fc8](https://github.com/js-soft/wdi5/commit/0391fc8ec440dc8a7cd596ff5b1cd12ac7b9e652))
- **types:** wdi5 browser ([d7496a9](https://github.com/js-soft/wdi5/commit/d7496a906f467a9e93a0fc8ca5c0b3f5cd666da9))
- use workspace for referencing wdio-ui5-service ([70ad24e](https://github.com/js-soft/wdi5/commit/70ad24e2be0705a4c249f079a01ae92daedff25b))
- wdi5 config ([7215bcb](https://github.com/js-soft/wdi5/commit/7215bcbcdeafa2b1b68fac7017382f5bd6d1ec62))
- **wdi5:** add "helper" class ([7e966c3](https://github.com/js-soft/wdi5/commit/7e966c31dc3680c2edfd9e7b6a1c2b06294e2226))
- **wdio-ui5-service:** assert ui5 page ([a74667f](https://github.com/js-soft/wdi5/commit/a74667f78d6569c31da8378874a8d30defda8ed2))
- **wdio,config:** working wdi5-enhanced config ([e1e5283](https://github.com/js-soft/wdi5/commit/e1e528375b9c9e70abeac8a65d5dedebc27fb904))

### Bug Fixes

- add missing wait for ui5 timeout option ([0e59dbe](https://github.com/js-soft/wdi5/commit/0e59dbe9d43f5d647f48ae2c02346dbe8e4dd776))
- api visibility ([eba53bd](https://github.com/js-soft/wdi5/commit/eba53bd05809828345795bd066658d7f2f54dabf))
- client side getAggregation ([6c9e98b](https://github.com/js-soft/wdi5/commit/6c9e98bb97e185915962ec9d2c35fd671199b95e))
- custom press api ([8cf76b6](https://github.com/js-soft/wdi5/commit/8cf76b6fbe7e235a7b949b0a7f884071c1905eff))
- disable control's fireEvent for wdi5's api ([ba367c6](https://github.com/js-soft/wdi5/commit/ba367c6708d4d70d5bb33e5c589638b8e472bd0f))
- export module ([9c57635](https://github.com/js-soft/wdi5/commit/9c57635d46a30973e6788853f8860516a5a877a1))
- make usable in fluent async api ([6300a1b](https://github.com/js-soft/wdi5/commit/6300a1b5aa34e4a3e6e20bdaf9e2d5ee7530ac6a))
- md ([b02c47f](https://github.com/js-soft/wdi5/commit/b02c47fbcb1ab9f64be0c27efc4bd9634d83e4e9))
- module export ([673830c](https://github.com/js-soft/wdi5/commit/673830ce169ca08fc08430d3be863c1ec53b78bf))
- **package.json:** main entry point ([04ce093](https://github.com/js-soft/wdi5/commit/04ce093c915244361a877e0d3c7c4277232354c5))
- pass over generated control id ([84fd727](https://github.com/js-soft/wdi5/commit/84fd727ba48d0539c26f0a3792cdd42ec517e159))
- reenable button for nav sequence ([d66a982](https://github.com/js-soft/wdi5/commit/d66a982bef925bd85eab77b37a9603bdb00a78b1))
- references ([54ecae7](https://github.com/js-soft/wdi5/commit/54ecae79a01fedc97a12694c7dee0597e1c17d10))
- safeguard cache control store ([0949fa0](https://github.com/js-soft/wdi5/commit/0949fa035df3d7cd0334b4a6881677868bf3fd60))
- **ts:** compile errors for mocha + jquery ([ae252eb](https://github.com/js-soft/wdi5/commit/ae252ebcaf73c97a350d204f98f9cdff9dd10d6f))
- using logger singleton ([22b70a0](https://github.com/js-soft/wdi5/commit/22b70a08ab85de44de88cf157bc1160e9a3731ef))
- wdi5 init sequence ([3a9eb2b](https://github.com/js-soft/wdi5/commit/3a9eb2b1aa129df7c12d083d4bb3ade180f5fb6b))
- work getWebElement with fluent async api ([07fd194](https://github.com/js-soft/wdi5/commit/07fd194c983d727c234401bbad8388dc4fbd0e7a))
