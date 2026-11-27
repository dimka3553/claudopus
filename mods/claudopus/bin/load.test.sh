#!/bin/bash
# Loads Claudopus into a real Claude Code, in a made-up home folder, and checks that it starts as in a person's first chat: its panel
# is offered, its memory folder is made in the home Claude Code uses (the profile on Windows), and its log says the chat started with
# nothing failing. No model is asked anything: the key is made up, so the chat's one message ends at once. ENGINE: the Claude Code to
# load it with (the desktop app's on a Mac by default, else claude on the PATH); with none it says so and passes.
#   bash mods/claudopus/bin/load.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
mod=$(cd "$here/.." && pwd)
ENGINE=${ENGINE:-${CLAUDE_CODE_EXECPATH:-$(command -v claude 2>/dev/null)}}
[ -n "$ENGINE" ] && [ -e "$ENGINE" ] || { echo "ok   skipped: no Claude Code here to load it with"; exit 0; }
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-load-test.XXXXXX") || exit 1
# On Windows a folder a process still works in cannot be removed: Git's processes working in it are ended first, and the removal
# is tried for a few seconds, then left to Windows' own temp clean-up, quietly
gone() {
  case "$(uname -s)" in
    MINGW* | MSYS* | CYGWIN*)
      for d in /proc/[0-9]*; do case "$(readlink "$d/cwd" 2>/dev/null)" in "$tmp" | "$tmp"/*) [ "${d#/proc/}" = $$ ] || kill -KILL "${d#/proc/}" 2>/dev/null ;; esac; done
      for _ in 1 2 3 4 5 6 7 8 9 10; do rm -rf "$tmp" 2>/dev/null && return; sleep 0.5; done; return 0 ;;
  esac
  rm -rf "$tmp"
}
trap gone EXIT
fails=0
check() { if eval "$2"; then printf 'ok   %s\n' "$1"; else printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); fi; }
mkdir -p "$tmp/home" "$tmp/work"
case "$(uname -s)" in
  MINGW* | MSYS* | CYGWIN*)
    # Windows: Claude Code's home is the profile, and the mod is given its folder as Windows names it
    home=$(cygpath -w "$tmp/home"); mod=$(cygpath -w "$mod")
    set -- env USERPROFILE="$home" HOME="$home" APPDATA="$home\\AppData\\Roaming" LOCALAPPDATA="$home\\AppData\\Local"
    memory=$tmp/home/.claude/claudopus ;;
  *)
    set -- env HOME="$tmp/home"
    memory=$tmp/home/.claude/claudopus ;;
esac
# The chat's one message: with a made-up key it ends without an answer, after the mod has loaded and the session has started
(cd "$tmp/work" && "$@" ANTHROPIC_API_KEY=sk-ant-made-up CLAUDE_CODE_TMPDIR="$tmp" DISABLE_AUTOUPDATER=1 \
  "$ENGINE" -p "hi" --plugin-dir "$mod" --output-format stream-json --verbose </dev/null >"$tmp/out.jsonl" 2>"$tmp/err.txt")
check "the chat ran to its end" 'grep -q "\"type\":\"result\"" "$tmp/out.jsonl"'
check "the Claudopus panel is offered" 'grep -q "\"subtype\":\"ui_panes\".*\"id\":\"claudopus\"" "$tmp/out.jsonl"'
check "its memory folder is in the home Claude Code uses" '[ -f "$memory/log.md" ] && [ -f "$memory/index.md" ]'
check "its log says the chat started" 'grep -q " start [0-9a-f-]* in " "$memory/log.md"'
# What the log says when something the mod needs is not there (its key store, a command, a file it made). A Mac's made-up home holds
# no keychain, and the mod says so rather than have macOS ask on the screen for one: that alone is no failure here
expected='^$'
[ "$(uname -s)" = Darwin ] && expected='keychain did not answer|use its key in this Mac.s keychain'
check "nothing it needs failed" '! grep -vE "$expected" "$memory/log.md" | grep -iE "not in force|did not answer|ENOENT|not found|cannot|couldn.t|failed|refused|threw"'
check "it told the person nothing went wrong" '! grep "\"subtype\":\"ui_log\"" "$tmp/out.jsonl" | grep -vE "$expected" | grep -iE "couldn.t|failed|not in force"'
if [ "$fails" = 0 ]; then echo "all passed"; exit 0; fi
echo "--- log.md"; cat "$memory/log.md" 2>/dev/null
echo "--- the chat's own words"; grep -E '"subtype":"(ui_log|init)"|"type":"result"' "$tmp/out.jsonl" | cut -c1-400
echo "--- stderr"; head -40 "$tmp/err.txt"
echo "$fails failed"; exit 1
