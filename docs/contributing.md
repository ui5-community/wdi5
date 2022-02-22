# get on up aboard ⛵️

"the more, the merrier" also holds true for contributions to `wdi5` 🤗

## prerequisites

- npm >= 7 - because we're using npm's `workspaces` feature
- accustomed to conventional commits <https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum>

## set up the dev env

- npm run build
  (work)
- npm run build:watch

if you add tests in one of the sample apps, "reinstall" `wdi5` in the respective `npm` workspace
by doing `$> npm install` in the project root.

## work on a single test

recommended approach:

- run server in terminal 1
- run test in terminal 2

## commiting changes

We're using `prettier` and `eslint` for code-formatting and validation.  
Staged files are linted and formatted according to the specs in `.prettierrc` and `.eslintrc.js`.  
`git` commit messages are linted to comply with "conventional commits" <https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum>. Additionally, the message subject `wip` is allowed:

```shell
wip(optional scope): the subject of the message
<optional blank line, req if body>
optional body
some more text
<optional blank line, req if footer>
optional 1-line footer
```

Please don't look at the above as restrictions, but rather as conventions: it helps to provide a harmonized codebase, both formatting- and code-style wise. And the coventional commits allow for automtically generating a `CHANGELOG.md` that we all benefit from ("what's new in version ....?"). Also, all of this combined aids tremendously in cutting automated releases - so new features or fixes can be published quickly!

## work on the docs

- npm i -g docsify-cli
- docsify serve ./docs -> <http://localhost:3000>
