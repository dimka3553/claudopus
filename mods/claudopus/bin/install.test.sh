#!/bin/bash
# Tests claudopus.ai's one-line installer (site/install.sh) in made-up home folders, piped into sh as `curl ... | sh` does, with
# this repo as its marketplace so nothing is fetched. ENGINE: the Claude Code to install with (the desktop app's by default);
# with none it says so and passes, as on GitHub's runners. Nothing in the real home folder is read or changed.
#   bash mods/claudopus/bin/install.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/../../.." && pwd)
script=$repo/site/install.sh
ENGINE=${ENGINE:-${CLAUDE_CODE_EXECPATH:-$(command -v claude 2>/dev/null)}}
[ -n "$ENGINE" ] && [ -x "$ENGINE" ] || { echo "ok   skipped: no Claude Code here to install with"; exit 0; }
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-install-test.XXXXXX") || exit 1
trap '[ -n "${INSTALL_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
check() { if eval "$2"; then ok "$1"; else no "$1"; fi; }
version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$repo/mods/claudopus/.claude-plugin/plugin.json" | head -n 1)
# A Mac's app keeps its engine in the home folder; elsewhere Claude Code is `claude` on the PATH
mkdir -p "$tmp/bin"
case "$ENGINE" in
  */claude.app/Contents/MacOS/claude) app=${ENGINE%/Contents/MacOS/claude} ;;
  *) app="" ;;
esac
# home <name>: a fresh home folder with Claude Code where the person has it: the app's copy, or `claude` on the PATH (path)
home() {
  H=$tmp/$1; mkdir -p "$H"
  if [ -n "$app" ] && [ "${2:-}" != path ]; then
    mkdir -p "$H/Library/Application Support/Claude/claude-code/2.1.1/abc" "$H/Library/Application Support/Claude/claude-code/2.1.99/def"
    ln -s "$app" "$H/Library/Application Support/Claude/claude-code/2.1.99/def/claude.app"
    P=/usr/bin:/bin:/usr/sbin:/sbin
  else
    P=$tmp/bin:/usr/bin:/bin:/usr/sbin:/sbin
    ln -sf "$ENGINE" "$tmp/bin/claude"
  fi
}
# install <home>: the script piped into sh, as from curl, with only what a fresh Terminal has
install() { cat "$script" | env -i HOME="$H" PATH="$P" TERM=dumb CLAUDOPUS_SOURCE="$repo" sh > "$H.out" 2>&1; echo $? > "$H.rc"; }
on() { grep -q '"claudopus@claudopus": *true' "$H/.claude/settings.json"; }
cache() { grep -q "\"subagentPromptCacheTtl\": *\"$1\"" "$H/.claude/settings.json"; }

# A. A home with nothing in it: installed, on, and the version said
home empty; install
check "a fresh home installs and exits 0" '[ "$(cat "$H.rc")" = 0 ]'
check "it is on in settings.json" on
check "the marketplace is known to Claude Code" 'grep -q "\"claudopus\"" "$H/.claude/settings.json"'
check "Claude Code's record has it" 'grep -q "cache/claudopus/claudopus/$version" "$H/.claude/plugins/installed_plugins.json"'
check "it says the version and how to start" 'grep -q "Claudopus $version is installed and on" "$H.out" && grep -q "/reload-plugins" "$H.out"'
check "it runs to its last line through the pipe" 'grep -q "/claudopus opens it again" "$H.out"'
check "tasks keep their prompt cache an hour, and it says so" 'cache 1h && grep -q "prompt cache for an hour" "$H.out"'

# B. A settings.json with the person's own settings, another plugin, and Claudopus switched off: all kept, Claudopus on, and the
# hour's cache for tasks added
home full
mkdir -p "$H/.claude"
cat > "$H/.claude/settings.json" <<'EOF'
{
  "env": { "SOME_SETTING": "1" },
  "permissions": { "allow": ["Bash(ls:*)"] },
  "model": "opus",
  "enabledPlugins": { "other@elsewhere": true, "claudopus@claudopus": false }
}
EOF
install
check "a home with settings installs and exits 0" '[ "$(cat "$H.rc")" = 0 ]'
check "a switched-off Claudopus is switched on" on
check "the person's own settings stay" 'grep -q SOME_SETTING "$H/.claude/settings.json" && grep -q "Bash(ls:\*)" "$H/.claude/settings.json" && grep -q "\"model\": *\"opus\"" "$H/.claude/settings.json" && grep -q "other@elsewhere" "$H/.claude/settings.json"'
check "the hour's cache for tasks is added beside them" 'cache 1h'
check "the file is still valid JSON" 'node -e "JSON.parse(require(\"fs\").readFileSync(process.argv[1], \"utf8\"))" "$H/.claude/settings.json" 2>/dev/null || python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$H/.claude/settings.json"'

# C. The same line again, after the person chose 5 minutes for tasks: nothing breaks, still on, their choice kept
sed 's/"subagentPromptCacheTtl": *"1h"/"subagentPromptCacheTtl": "5m"/' "$H/.claude/settings.json" > "$H.json" && mv "$H.json" "$H/.claude/settings.json"
install
check "running it again exits 0 and leaves it on" '[ "$(cat "$H.rc")" = 0 ] && on'
check "a cache time the person set is kept, and nothing said of it" 'cache 5m && ! grep -q "prompt cache" "$H.out"'

# D. Claude Code as `claude` on the PATH, with no app
home path path; install
check "claude on the PATH is used when there is no app" '[ "$(cat "$H.rc")" = 0 ] && on'

# E. No Claude Code at all: it stops, says where to get it, and writes nothing
H=$tmp/none; mkdir -p "$H"; P=/usr/bin:/bin:/usr/sbin:/sbin
if command -v claude >/dev/null 2>&1 && [ "$(command -v claude)" != "$tmp/bin/claude" ] && env -i PATH="$P" sh -c 'command -v claude' >/dev/null 2>&1; then
  ok "skipped: a claude in the system's own folders"
else
  install
  check "with no Claude Code it fails and says where to get it" '[ "$(cat "$H.rc")" = 1 ] && grep -q "claude.ai/download" "$H.out" && [ ! -e "$H/.claude/settings.json" ]'
fi

[ "$fails" = 0 ] && echo "all passed" || { echo "$fails failed"; for f in "$tmp"/*.out; do echo "--- $f"; cat "$f"; done; exit 1; }
