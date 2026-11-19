# Writing tests with AI assistants

`wdi5` ships an [Agent Skill](https://agentskills.io) in [`skills/wdi5/SKILL.md`](https://github.com/ui5-community/wdi5/blob/main/skills/wdi5/SKILL.md).
It gives AI coding assistants the rules for writing `wdi5` tests that the docs spread over several pages: how to find selectors in the app's source instead of guessing them, which selector to prefer, when to use the Fiori elements test library, how waiting works and how to debug a failing run.

The skill is a plain Markdown file with a short frontmatter, so it works with any assistant that reads instruction files.

## Using the skill

Copy the folder `skills/wdi5` into the location your assistant reads skills or instructions from, for example:

| Assistant        | Location                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Claude Code      | `.claude/skills/wdi5/SKILL.md` in your project (or `~/.claude/skills/wdi5/` for all projects) |
| GitHub Copilot   | reference or paste it in `.github/copilot-instructions.md`                                    |
| other assistants | add it to the project instruction file (e.g. `AGENTS.md`) or attach it to the prompt          |

Then ask for the test in plain words, e.g. _"write a wdi5 test that opens the first travel and checks its status"_.

?> Add your project's own conventions next to it (where specs live, page objects, how to start the app) - the skill covers `wdi5` itself, not your project.

## Getting good results

- **Let the assistant run the test.** A spec only counts once it passed against the running app. Give the assistant the command to start the app and the `wdio` command for a single spec.
- **Point it at the source.** Selectors come from the XML views, `manifest.json` and the i18n files. Make sure the assistant can read them.
- **Review the selectors.** Watch for generated ids like `__xmlview0--button1` and for assertions that were loosened to make a test pass.
