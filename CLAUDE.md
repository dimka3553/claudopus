# Claudopus

- The mod is `mods/claudopus`; the site is `site/` (claudopus.ai builds `site/` from `main`).
- Test with the Claude desktop app's own engine, which is newer than the `claude` on the PATH: `"<app engine>" plugin test mods/claudopus` and `plugin validate --strict mods/claudopus` and `plugin validate --strict .`
- `README.md` and `mods/claudopus/README.md` are the same text; the plugin's copy has paths relative to the plugin folder. Change both together.
- Raise `version` in `mods/claudopus/.claude-plugin/plugin.json` with every release pushed to `main`, or installs keep the old copy.
- Everything here is public: no keys, private paths, names or notes.
