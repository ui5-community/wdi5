# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
