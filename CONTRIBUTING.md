# Contributing

Thanks for helping. Bugs and ideas go in [Issues](https://github.com/dimka3553/claudopus/issues/new/choose), and questions go in [Discussions](https://github.com/dimka3553/claudopus/discussions).

## How the code is laid out

- `mods/claudopus` is the mod, and `site/` is claudopus.ai.
- The hooks code lives in `src/claudopus/`, one file per job. `node src/claudopus/build.mjs` joins it into `mods/claudopus/hooks/register.tsx`, and joins `src/claudopus/tests/` into `register.test.tsx`. Claude Code's plugin directory needs the mod to ship as one file. Never edit the two joined files: change the parts, then build.
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

The GitHub check (`.github/workflows/check.yml`) runs the build check, the notification apps' checksums and every test, but not the two strict validations, on each push to `main` and each pull request, with the npm engine pinned to a version that passes them; a failing test fails the check. The release runs them again, and the validations, with the desktop app's engine. A test near the kit's 5-second limit takes `SLOW` (from `src/claudopus/tests/world.tsx`) as its options, since GitHub's runner is about twice as slow as a Mac.

- `README.md` and `mods/claudopus/README.md` are the same text, so change them together.
- A change under `mods/claudopus/notifier/` is rebuilt with `sh mods/claudopus/notifier/build.sh`, which rewrites `checksums.txt`; commit both.
- A release raises `version` in `mods/claudopus/.claude-plugin/plugin.json` and then builds. Installs update when that version changes.
- Everything here is public: no keys, private paths or personal notes.
