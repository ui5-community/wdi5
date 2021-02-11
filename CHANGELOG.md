# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.1](https://github.com/js-soft/wdi5/compare/v0.5.0...v0.5.1) (2021-02-11)

**Note:** Version bump only for package --wdi5





# [0.5.0](https://github.com/js-soft/wdi5/compare/v0.0.3...v0.5.0) (2021-02-01)


### Bug Fixes

* **64:** solved issue browser.screenshot() throws error due to missing parameter [#64](https://github.com/js-soft/wdi5/issues/64) ([7ede8b9](https://github.com/js-soft/wdi5/commit/7ede8b90f38e05922adc8d796569bfb43dcfd14b))
* **aggregation:** when getAggregation retuns only one ([3bad8af](https://github.com/js-soft/wdi5/commit/3bad8af44890b811c54e79f4dc48a056b8c966ec))
* **env:** env.example file location into root ([252c242](https://github.com/js-soft/wdi5/commit/252c2425dea9a0d75ac75717b46b816299fb2359))
* **getcontrol:** fix error about circular ref ([0717995](https://github.com/js-soft/wdi5/commit/0717995241de1d343a5ff7a4aaa9bd7fbc049f0a))
* **navigation:** pr review ([f8b3741](https://github.com/js-soft/wdi5/commit/f8b374156c081f49fa6b1afc265d35e5c9f2241e))
* **open:** url in service with wrong condition ([b1b7b74](https://github.com/js-soft/wdi5/commit/b1b7b74051d2c13db84e1550de7c06f3b534b857))
* **plugins:** remove cordova-plugin-barcodescanner ([81af67d](https://github.com/js-soft/wdi5/commit/81af67d87a612f6ca9c81dab0752bfbcb02d4880))
* **readme:** update after merges ([78e9c1e](https://github.com/js-soft/wdi5/commit/78e9c1eab1b376b22f17c7e0d9285119d1b9fc14))
* **retrieval:** of new single aggegation control ([4d30204](https://github.com/js-soft/wdi5/commit/4d30204048221de36163e5cfab39d43ab971d681))
* **retrieveelement:** retrieve single wdi5 control as result ([3f34146](https://github.com/js-soft/wdi5/commit/3f341463a95f3debafee7458c7e54d53d575ea5c))
* **test:** execution ([461b910](https://github.com/js-soft/wdi5/commit/461b91059a5bdd34fe681df53d78e991c29a0057))
* **test:** screenshot to wait until file is present ([a8125cc](https://github.com/js-soft/wdi5/commit/a8125ccc4cbefcefc4a86c1db121325ee69bdf72))
* **test:** with expected current version ([fae1a4a](https://github.com/js-soft/wdi5/commit/fae1a4a6b3ed2d1884785436b77b070a3f75c1b1))
* **tests:** rafactor selector ([d990e83](https://github.com/js-soft/wdi5/commit/d990e83783bfb7408430f20dc07647c2bc230815))
* **tests:** testcases for selftest ([fbe422f](https://github.com/js-soft/wdi5/commit/fbe422f27b5802a1769fd48251cdb4d023de56fa))
* **title:** update test for title ([e675ecc](https://github.com/js-soft/wdi5/commit/e675ecc14b4adfaa8a852cb25a0d9ef328558262))
* differentiate web server env ([ba187ce](https://github.com/js-soft/wdi5/commit/ba187ce5323f743ad5570be0b40804d4c535a0dc))
* **typo:** correct variable name ([3d8337c](https://github.com/js-soft/wdi5/commit/3d8337c331916034bd4e2bc7d97566c9eb961055))
* allow use literal "ui5" (fixes [#39](https://github.com/js-soft/wdi5/issues/39)) ([dd4be15](https://github.com/js-soft/wdi5/commit/dd4be1548498cb24cd6c3f7a943da8b988a49690))
* cater towards non-id locators ([9b36c68](https://github.com/js-soft/wdi5/commit/9b36c685dd3da6e96ba81da9d2833eca7056e00b))
* harmonize "ui5" ref as wdio service ([c71d910](https://github.com/js-soft/wdi5/commit/c71d910d3e4667e86e15320016870b5546a76dc1))
* sanity check for fn args ([0384119](https://github.com/js-soft/wdi5/commit/03841199de3f94f17d9bf73dea952bca21264558))
* treat index.html as dir index ([569745f](https://github.com/js-soft/wdi5/commit/569745fc938b5bf92f6392ee90711480031e5d4b))
* **wdi5:** import of wdio-ui5-service ([707e4f2](https://github.com/js-soft/wdi5/commit/707e4f2ab1fe485f6b257787a41e689209055c9b))


### Features

* **#66:** implement new control as return type ([ff28045](https://github.com/js-soft/wdi5/commit/ff280454dcacab609e93e20786d7d08bc4b797b0)), closes [#66](https://github.com/js-soft/wdi5/issues/66)
* **loggin:** add error logging ([e089e01](https://github.com/js-soft/wdi5/commit/e089e01e39fb7cb2ca85adec10805f04251dda9c))
* **nav:** move navigation to wdio-ui5-service ([1704c31](https://github.com/js-soft/wdi5/commit/1704c31eefad27f904ac26724b7e56f21a10171b))
* **navto:** allow for plain string arg ([7673f6c](https://github.com/js-soft/wdi5/commit/7673f6ce6ad220fcfbd82eb455bd13aa72f23a3c))
* **navto:** using url config when navigating ([9978a0f](https://github.com/js-soft/wdi5/commit/9978a0f2828f3859d516f48382ac7b16f3d264c5))
* **nullcheck:** add nullchecks for control bridge ([20148f5](https://github.com/js-soft/wdi5/commit/20148f50945d0459fc432a1910c3bafce06fb6f8))
* **screenshot:** disable screenshots by config ([53f20c0](https://github.com/js-soft/wdi5/commit/53f20c0f148d9ec6c3b79dbe7bf06d00f810d189))
* **test:** add test for screenshot without name ([6a6acf4](https://github.com/js-soft/wdi5/commit/6a6acf450e47396fce5092fe9c9722906a2f1442))
* **test:** add testcase for new feature ([b18d14b](https://github.com/js-soft/wdi5/commit/b18d14b2b7a0f48304469771dae740e1f5f3c559))
* **wip:** accelerate getItems ([1d5a499](https://github.com/js-soft/wdi5/commit/1d5a49929232b39beeef8887f93cdfc44750cc82))
* **wip:** add testcase for flat aggregation retrieval ([f8c7510](https://github.com/js-soft/wdi5/commit/f8c75105cb1276810de4424823cea7a3d2c34ef2))
* locate ui5 controls via id regex ([bc0e0d4](https://github.com/js-soft/wdi5/commit/bc0e0d4fd50a8f7f3a18c52d2300a1d7e91b4656))
* support $control.focus() properly ([2d0b6df](https://github.com/js-soft/wdi5/commit/2d0b6dfa875d6a47d5cbe0f8152169cf72713704))
* support ui5 serve + other web servers ([a3f8e86](https://github.com/js-soft/wdi5/commit/a3f8e86fa72ea900733cb6db5ba80c8be69eff06))


### BREAKING CHANGES

* use via services > "ui5" only
and _don't_ require('../src/index') or similar
