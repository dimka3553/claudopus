#!/bin/bash
# Every test once, as GitHub's check runs them after a release: the shell tests beside the mod's tests (most of their time is
# waiting), then the strict checks. A piece of work runs this once before it asks for its release, which itself runs only the
# build check and the strict checks, so a release goes out seconds after the person's press. ENGINE: the engine to test with
# (the desktop app's by default). On battery they run on GitHub instead (below). What failed is said last: a shell test's failing lines, then the mod's tests' failures and count
cd "$(dirname "$0")/../.." || exit 1
ENGINE=${ENGINE:-${CLAUDE_CODE_EXECPATH:-claude}}
node src/claudopus/build.mjs --check && sh mods/claudopus/notifier/check.sh || exit 1
# On battery every test runs on GitHub instead, as after a release, on this branch's commit: run here, the mod's test kit starts a
# claude for each test file at once, about thirty, and the Mac drew 50 to 60 W on its battery (27 Nov). --here runs them here anyway
here=; [ "${1:-}" = --here ] && here=1
battery=; if [ -d /sys/class/power_supply ]; then grep -qx Discharging /sys/class/power_supply/*/status 2>/dev/null && battery=1; else pmset -g batt 2>/dev/null | grep -q "'Battery Power'" && battery=1; fi
if [ -n "$battery" ] && [ -z "$here" ]; then
  command -v gh >/dev/null && gh auth status >/dev/null 2>&1 || { echo "On battery, but gh is not signed in to GitHub, so the tests run here (sh src/claudopus/test-all.sh --here does so without this line)"; battery=; }
fi
if [ -n "$battery" ] && [ -z "$here" ]; then
  [ -z "$(git status --porcelain --untracked-files=no)" ] || { echo "On battery the tests run on GitHub, on what is committed: commit first, or run them here with --here"; exit 1; }
  sha=$(git rev-parse HEAD)
  repo=$(git remote get-url origin | sed -E 's#/+$##; s#\.git$##' | awk -F'[/:]' '{ print $(NF-1) "/" $NF }')
  ref="refs/release-check/test-$(git rev-parse --short HEAD)"
  echo "On battery: every test runs on GitHub, on Linux and a Mac, on this commit"
  git push -q origin "HEAD:$ref" || { echo "The commit could not be pushed for GitHub to check"; exit 1; }
  trap 'git push -q origin ":$ref" 2>/dev/null' EXIT
  since=$(date -u -r $(( $(date +%s) - 60 )) +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d "@$(( $(date +%s) - 60 ))" +%Y-%m-%dT%H:%M:%SZ)
  gh api -X POST "repos/$repo/actions/workflows/check.yml/dispatches" -f ref=refs/heads/main -f "inputs[sha]=$sha" || { echo "GitHub would not start its checks"; exit 1; }
  run=; n=0
  while [ -z "$run" ] && [ $n -lt 20 ]; do
    n=$((n + 1)); echo "progress: $n tries finding the run on GitHub"; sleep 6
    run=$(gh api "repos/$repo/actions/workflows/check.yml/runs?event=workflow_dispatch&branch=main&per_page=30" --jq ".workflow_runs[] | select(.display_title == \"Release check $sha\" and .created_at >= \"$since\") | .id" 2>/dev/null | head -n 1)
  done
  [ -n "$run" ] || { echo "GitHub started no run for the checks"; exit 1; }
  echo "Following GitHub's run: https://github.com/$repo/actions/runs/$run"
  gh run watch "$run" --repo "$repo" --interval 20 --exit-status; r=$?
  gh run view "$run" --repo "$repo" --json jobs --jq '.jobs[] | "\(.name): \(.conclusion)"'
  [ $r = 0 ] && echo "every test passed on GitHub" || { gh run view "$run" --repo "$repo" --log-failed 2>/dev/null | grep -E '\(fail\)|NOT OK|failed' | cut -c1-300 | head -8; echo "tests failed on GitHub"; }
  exit $r
fi
o=$(mktemp -d)
# Stopped partway, it stops the shell tests it started and leaves no folder behind
trap 'kill $(jobs -p) 2>/dev/null; rm -rf "$o"' EXIT
trap 'exit 1' INT TERM HUP
for t in admin revive linux run-it pane-file catch-up tidy allow-tool install load; do { bash mods/claudopus/bin/$t.test.sh >"$o/$t" 2>&1 && echo 0 || echo 1; } >"$o/$t.rc" & done
{ "$ENGINE" plugin test mods/claudopus && "$ENGINE" plugin validate --strict mods/claudopus && "$ENGINE" plugin validate --strict .; } >"$o/mod" 2>&1; r=$?
wait
for t in admin revive linux run-it pane-file catch-up tidy allow-tool install load; do [ "$(cat "$o/$t.rc")" = 0 ] || { grep -E 'NOT OK|^FAIL|failed|FAILED' "$o/$t" | cut -c1-300 | head -4; echo "$t.test.sh failed"; r=1; }; done
if [ $r != 0 ]; then grep -E '^\(fail\)|^ *[0-9]+ (pass|fail)$|^Ran |rror' "$o/mod" | cut -c1-300 | tail -8 | grep . || tail -8 "$o/mod"; else echo "every test and strict check passed"; fi
rm -rf "$o"; exit $r
