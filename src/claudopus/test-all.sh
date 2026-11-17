#!/bin/bash
# Every test once, as GitHub's check runs them after a release: the shell tests beside the mod's tests (most of their time is
# waiting), then the strict checks. A piece of work runs this once before it asks for its release, which itself runs only the
# build check and the strict checks, so a release goes out seconds after the person's press. ENGINE: the engine to test with
# (the desktop app's by default). What failed is said last: a shell test's failing lines, then the mod's tests' failures and count
cd "$(dirname "$0")/../.." || exit 1
ENGINE=${ENGINE:-${CLAUDE_CODE_EXECPATH:-claude}}
node src/claudopus/build.mjs --check && sh mods/claudopus/notifier/check.sh || exit 1
o=$(mktemp -d)
# Stopped partway, it stops the shell tests it started and leaves no folder behind
trap 'kill $(jobs -p) 2>/dev/null; rm -rf "$o"' EXIT
trap 'exit 1' INT TERM HUP
for t in admin keep revive linux run-it; do { bash mods/claudopus/bin/$t.test.sh >"$o/$t" 2>&1 && echo 0 || echo 1; } >"$o/$t.rc" & done
{ "$ENGINE" plugin test mods/claudopus && "$ENGINE" plugin validate --strict mods/claudopus && "$ENGINE" plugin validate --strict .; } >"$o/mod" 2>&1; r=$?
wait
for t in admin keep revive linux run-it; do [ "$(cat "$o/$t.rc")" = 0 ] || { grep -E 'NOT OK|^FAIL|failed|FAILED' "$o/$t" | cut -c1-300 | head -4; echo "$t.test.sh failed"; r=1; }; done
if [ $r != 0 ]; then grep -E '^\(fail\)|^ *[0-9]+ (pass|fail)$|^Ran |rror' "$o/mod" | cut -c1-300 | tail -8 | grep . || tail -8 "$o/mod"; else echo "every test and strict check passed"; fi
rm -rf "$o"; exit $r
