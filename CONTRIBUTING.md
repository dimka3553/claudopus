# Contributing

Thanks for helping. Bugs and ideas go in [Issues](https://github.com/dimka3553/claudopus/issues/new/choose), and questions go in [Discussions](https://github.com/dimka3553/claudopus/discussions).

## How the code is laid out

- `mods/claudopus` is the mod, and `site/` is claudopus.ai.
- The hooks code lives in `src/claudopus/`, one file per job. `node src/claudopus/build.mjs` joins it into `mods/claudopus/hooks/register.tsx`, and joins each part of `src/claudopus/tests/`, after `world.tsx`, into `mods/claudopus/hooks/tests/`. Claude Code's plugin directory needs the mod to ship as one file. Never edit the joined files: change the parts, then build.
- The parts are plain scripts with no imports or exports, and they share one scope. An import goes in `imports.tsx`.

## Before a pull request

```sh
node src/claudopus/build.mjs            # join the parts
node src/claudopus/build.mjs --check    # fails if the joined files are stale
sh mods/claudopus/notifier/check.sh     # fails if a notification app differs from its checksums
claude plugin test mods/claudopus
claude plugin validate --strict mods/claudopus
claude plugin validate --strict .
```

Use a recent Claude Code engine: the desktop app's, the `claude` on your PATH or the public one from npm all run every test, since the tests need Claude Code's own test kit, not the desktop app.

The GitHub check (`.github/workflows/check.yml`) runs the build check, the notification apps' checksums and every test, but not the two strict validations, on each push to `main` and each pull request, with the npm engine pinned to a version that passes them; a failing test fails the check. The release runs them again, and the validations, with the desktop app's engine. Every test may take a minute (the `test` of `src/claudopus/tests/world.tsx`), since the areas' files run side by side and GitHub's runner is about twice as slow as a Mac.

## Tests

- Before adding a test, find the one that already covers the behaviour and extend it. A new test must fail without your change, for a reason no other test catches: `node src/claudopus/guard.mjs new` runs your branch's tests on main's code and lists the new ones that still pass, and `node src/claudopus/guard.mjs break <file> <text> <replacement>` puts a fault back and lists the tests that catch it. Each takes about a minute.
- A change that makes a test redundant removes it in the same change. Several inputs of one behaviour are one table-driven test. Set-ups more than one area uses go in `src/claudopus/tests/world.tsx`.
- A pull request says what its tests guard, not how many there are.

- `README.md` and `mods/claudopus/README.md` are the same text, so change them together.
- A change under `mods/claudopus/notifier/` is rebuilt with `sh mods/claudopus/notifier/build.sh`, which rewrites `checksums.txt`; commit both.
- A release raises `version` in `mods/claudopus/.claude-plugin/plugin.json` and then builds. Installs update when that version changes. Once pushed, it makes that version a GitHub release marked latest, with its changelog entry (`build.mjs --notes`), so the repo page and the README's release badge always name it.
- Everything here is public: no keys, private paths or personal notes.
