#!/bin/bash
# Tests bin/tidy on made-up folders, in a folder of its own: the temp folder, Chrome's copies, the scratch folders, the repos and
# the running commands it asks about are all made up. Nothing real is read or removed.
#   bash mods/claudopus/bin/tidy.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-tidy-test.XXXXXX") || exit 1
trap '[ -n "${TIDY_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
check() { if eval "$2"; then ok "$1"; else no "$1"; fi; }
old() { find "$@" -exec touch -t 202001010000 {} +; }
ago() { local t; t=$(perl -MPOSIX -e 'print strftime("%Y%m%d%H%M.%S", localtime(time - $ARGV[0]))' "$1"); shift; find "$@" -exec touch -t "$t" {} +; }
# A socket's times, which touch may not set
old_socket() { perl -e 'utime 1577836800, 1577836800, @ARGV or die' "$@"; }
socket_at() { (cd "$1" && perl -MIO::Socket::UNIX -e 'IO::Socket::UNIX->new(Local => $ARGV[0], Listen => 1) or die "$!\n"' "$2"); }
mtime() { perl -e 'print +(stat $ARGV[0])[9]' "$1"; }

# Every place it looks is a made-up one, the temp folder with spaces in its name as Chrome's paths have
export HOME=$tmp/home TMPDIR="$tmp/t m p" GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@example.com GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@example.com
T=$TMPDIR X=$tmp/x S=$tmp/scratch mem=$tmp/memory R=$tmp/repo W=$tmp/wt
mkdir -p "$HOME" "$T" "$X" "$S" "$mem/reports/r1/files" "$W" "$tmp/bin"
export TIDY_TEMP=$T TIDY_CLONES=$X TIDY_SCRATCH=$S TIDY_REPOS=$R TIDY_EVERY=0 TIDY_DAYS=2
for f in ps starts cwds; do printf '#!/bin/sh\ncat "%s/%s.txt"\n' "$tmp" "$f" > "$tmp/bin/$f"; chmod +x "$tmp/bin/$f"; done
export TIDY_PS="'$tmp/bin/ps'" TIDY_STARTS="'$tmp/bin/starts'" TIDY_CWDS="'$tmp/bin/cwds'"
run() { "$here/tidy" "$@" "$mem" > "$tmp/out" 2>&1; }

# A. Browser leftovers: old ones, one a running Chrome uses, a fresh one, and the copy of Chrome a running Chrome made
mkdir "$T/playwright_chromiumdev_profile-old1" "$T/puppeteer_dev_chrome_profile-busy" "$T/playwright-artifacts-new"
echo x > "$T/playwright_chromiumdev_profile-old1/Cookies"
echo x > "$T/puppeteer_dev_chrome_profile-busy/Preferences"
echo x > "$T/playwright-artifacts-new/trace"
echo x > "$T/.com.google.Chrome.Ab3dEf"
clones=$X/com.google.Chrome.code_sign_clone
for c in old mine; do mkdir -p "$clones/code_sign_clone.$c/Google Chrome.app.bundle/Contents"; echo x > "$clones/code_sign_clone.$c/Google Chrome.app.bundle/Contents/Info.plist"; done
old "$T/playwright_chromiumdev_profile-old1" "$T/puppeteer_dev_chrome_profile-busy" "$T/.com.google.Chrome.Ab3dEf" "$clones/code_sign_clone.old"
find "$clones/code_sign_clone.mine" -exec touch -t 202101010000 {} +
chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
printf '%s\n' "$chrome --headless --user-data-dir=$T/puppeteer_dev_chrome_profile-busy" '/bin/zsh -l' > "$tmp/ps.txt"
# A helper started near the old copy's time does not keep it; the main Chrome started a minute after its copy keeps that one
{
  echo "$(($(mtime "$clones/code_sign_clone.old") + 30)) /Applications/Google Chrome.app/Contents/Frameworks/Google Chrome Framework.framework/Helpers/Google Chrome Helper.app/Contents/MacOS/Google Chrome Helper --type=renderer"
  echo "$(($(mtime "$clones/code_sign_clone.mine") + 60)) $chrome --restore-last-session"
} > "$tmp/starts.txt"
printf '%s\n' / "$W/busy" > "$tmp/cwds.txt"

# B. The temp folder: a catch-up run's leftover, an unknown folder 5 years old and one a day old, macOS's own, and sockets
mkdir "$T/claudopus-catch-up.Q1w2E3" "$T/shot-old" "$T/server-new" "$T/com.apple.launchd.Zz" "$T/tmux-1"
echo x > "$T/claudopus-catch-up.Q1w2E3/lines"
echo x > "$T/shot-old/a.png"
echo x > "$T/server-new/log"
echo x > "$T/com.apple.launchd.Zz/x"
socket_at "$T" sock && socket_at "$T/tmux-1" s
old "$T/claudopus-catch-up.Q1w2E3" "$T/shot-old" "$T/com.apple.launchd.Zz"
ago 86400 "$T/server-new"
old_socket "$T/sock" "$T/tmux-1/s" "$T/tmux-1"

# C. Scratch folders: in a fresh session an old task folder holding a picture a result names, a fresh one and an old one holding
# CT data; and an old session
s1=$S/-p/s1
mkdir -p "$s1/scratchpad/old-task" "$s1/scratchpad/new-task" "$s1/scratchpad/ct-task" "$S/-p/s0/scratchpad/t" "$S/-p/s0/tasks"
echo pic > "$s1/scratchpad/old-task/pic one.png"
echo x > "$s1/scratchpad/new-task/notes"
echo x > "$s1/scratchpad/ct-task/scan.nii.gz"
echo x > "$S/-p/s0/tasks/out"
old "$s1/scratchpad/old-task" "$s1/scratchpad/ct-task" "$S/-p/s0"
# The result's files folder already holds another file of the picture's name
echo other > "$mem/reports/r1/files/pic one.png"
printf 'See the picture `%s`.\nAgain: %s\n' "$s1/scratchpad/old-task/pic one.png" "$s1/scratchpad/old-task/pic one.png" > "$mem/reports/r1/report.md"

# D. Worktrees: merged and clean, merged with only node_modules ignored, merged with an untracked file, merged with an ignored
# .env, unmerged, and one a running command works in
git init -q -b main "$R"
printf 'node_modules/\n.env\n' > "$R/.gitignore"
echo a > "$R/a"
git -C "$R" add . && git -C "$R" commit -qm one
for b in clean nm untracked env busy unmerged; do git -C "$R" worktree add -q -b "$b" "$W/$b" main; done
echo u > "$W/unmerged/u" && git -C "$W/unmerged" add u && git -C "$W/unmerged" commit -qm u
mkdir "$W/nm/node_modules" && echo x > "$W/nm/node_modules/x.js"
echo x > "$W/untracked/new.txt"
echo KEY=1 > "$W/env/.env"
old "$W"

run
cp "$tmp/out" "$tmp/out1"
out=$(cat "$tmp/out")
# Git names worktrees by their resolved paths
Wr=$(cd "$W" && pwd -P)
check "an old Playwright profile, an old Chrome download and an old copy of Chrome are removed" '[ ! -e "$T/playwright_chromiumdev_profile-old1" ] && [ ! -e "$T/.com.google.Chrome.Ab3dEf" ] && [ ! -e "$clones/code_sign_clone.old" ] && [[ "$out" == *"removed browser $clones/code_sign_clone.old"* ]]'
check "a profile a running Chrome names, a fresh one and the copy of a running Chrome are kept" '[ -d "$T/puppeteer_dev_chrome_profile-busy" ] && [ -d "$T/playwright-artifacts-new" ] && [ -d "$clones/code_sign_clone.mine" ] && [[ "$out" == *"kept $T/puppeteer_dev_chrome_profile-busy: a running command names it"* && "$out" == *"kept $clones/code_sign_clone.mine: it is the copy of a Chrome that is running"* ]]'
check "an old catch-up scratch folder is removed" '[ ! -e "$T/claudopus-catch-up.Q1w2E3" ] && [[ "$out" == *"removed temp $T/claudopus-catch-up.Q1w2E3"* ]]'
check "an unknown temp folder older than 3 days goes, a day-old one stays" '[ ! -e "$T/shot-old" ] && [ -d "$T/server-new" ]'
check "a socket, a folder holding one and macOS's own stay" '[ -S "$T/sock" ] && [ -S "$T/tmux-1/s" ] && [ -d "$T/com.apple.launchd.Zz" ]'
check "an old scratch task folder goes, a fresh one in its session stays, and an old session goes whole" '[ ! -e "$s1/scratchpad/old-task" ] && [ -d "$s1/scratchpad/new-task" ] && [ ! -e "$S/-p/s0" ]'
copy="$mem/reports/r1/files/pic one-2.png"
check "a picture a result names is copied beside the result, which now names the copy" '[ "$(cat "$copy")" = pic ] && [ "$(cat "$mem/reports/r1/files/pic one.png")" = other ] && [ "$(cat "$mem/reports/r1/report.md")" = "$(printf "See the picture \`%s\`.\nAgain: %s" "$copy" "$copy")" ]'
check "a folder holding CT data is kept" '[ -e "$s1/scratchpad/ct-task/scan.nii.gz" ] && [[ "$out" == *"kept $s1/scratchpad/ct-task: it holds CT data"* ]]'
check "a merged clean worktree goes with its branch, and one with only node_modules ignored" '[ ! -e "$W/clean" ] && [ ! -e "$W/nm" ] && ! git -C "$R" rev-parse -q --verify refs/heads/clean >/dev/null && ! git -C "$R" rev-parse -q --verify refs/heads/nm >/dev/null'
check "worktrees with an untracked file, an ignored .env, an unmerged branch, or a command in them are kept" '[ -e "$W/untracked/new.txt" ] && [ -e "$W/env/.env" ] && [ -e "$W/unmerged/u" ] && [ -d "$W/busy" ] && [[ "$out" == *"$Wr/untracked: it has changes not committed"* && "$out" == *"$Wr/env: it has ignored files that may be unsaved"* && "$out" == *"$Wr/unmerged: its branch is not merged"* && "$out" == *"$Wr/busy: a running command works in it"* ]] && git -C "$R" rev-parse -q --verify refs/heads/busy >/dev/null'
check "the main checkout is untouched" '[ "$(cat "$R/a")" = a ] && [ -z "$(git -C "$R" status --porcelain)" ]'
check "last.json says what came out" 'grep -Eq "^\{\"at\": [0-9]{13}, \"freed\": [1-9][0-9]*, \"removed\": \{\"browser\": 3, \"temp\": 2, \"scratch\": 2, \"worktrees\": 2\}, \"rescued\": 1, \"kept\": [1-9][0-9]*\}$" "$mem/tidy/last.json"'
check "the last line says what came out" '[[ "$(tail -1 "$tmp/out")" == "freed "*": removed 3 browser leftovers, 2 temp leftovers, 2 scratch folders, 2 worktrees, saved 1 file results name, kept "* ]]'

# A run within TIDY_EVERY of the last does nothing, one with --now does its work
mkdir "$T/playwright_chromiumdev_profile-old2" && old "$T/playwright_chromiumdev_profile-old2"
TIDY_EVERY=3600 run
check "a second run within TIDY_EVERY does nothing" '[ -d "$T/playwright_chromiumdev_profile-old2" ] && [ ! -s "$tmp/out" ]'
TIDY_EVERY=3600 run --now
check "and one with --now does its work" '[ ! -e "$T/playwright_chromiumdev_profile-old2" ]'
# A run while another holds the lock does nothing
mkdir "$mem/locks/tidy" "$T/playwright_chromiumdev_profile-old3" && old "$T/playwright_chromiumdev_profile-old3"
run --now
check "a run while another runs leaves it alone" '[ -d "$T/playwright_chromiumdev_profile-old3" ] && [ -d "$mem/locks/tidy" ]'
rmdir "$mem/locks/tidy"

# --deep clears uv's and npm's caches, here made-up ones
mkdir -p "$tmp/tools" "$tmp/uvc" "$tmp/npmc"
echo x > "$tmp/uvc/wheel" && echo x > "$tmp/npmc/pkg"
printf '#!/bin/sh\ncase "$1 $2" in "cache dir") echo "%s/uvc";; "cache prune") rm -f "%s/uvc/wheel"; echo "uv cache pruned";; esac\n' "$tmp" "$tmp" > "$tmp/tools/uv"
printf '#!/bin/sh\ncase "$1 $2" in "config get") echo "%s/npmc";; "cache clean") rm -f "%s/npmc/pkg"; echo "npm cache cleaned";; esac\n' "$tmp" "$tmp" > "$tmp/tools/npm"
chmod +x "$tmp/tools/uv" "$tmp/tools/npm"
PATH="$tmp/tools:$PATH" run --deep
check "--deep clears uv's and npm's caches, with what they say" '[ ! -e "$tmp/uvc/wheel" ] && [ ! -e "$tmp/npmc/pkg" ] && grep -q "uv cache pruned" "$tmp/out" && grep -q "npm cache cleaned" "$tmp/out"'

# On Windows nothing lists what runs with its folder, so a run there removes nothing and says why
case "$(uname -s)" in
  MINGW* | MSYS* | CYGWIN*)
    mkdir -p "$T/playwright_chromiumdev_profile-win"; old "$T/playwright_chromiumdev_profile-win"
    rmdir "$mem/locks/tidy" 2>/dev/null
    (unset TIDY_PS; run --now)
    check "on Windows it removes nothing, and says why" '[ -d "$T/playwright_chromiumdev_profile-win" ] && grep -q "can.t be listed" "$tmp/out" && grep -q "\"freed\": 0" "$mem/tidy/last.json"' ;;
  *) echo "skip the Windows run: this is not Git's bash on Windows" ;;
esac

if [ "$fails" = 0 ]; then echo "tidy: all passed"; else echo "tidy: $fails failed"; cat "$tmp/out1"; exit 1; fi
