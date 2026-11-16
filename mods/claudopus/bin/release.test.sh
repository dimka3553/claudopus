#!/bin/bash
# Tests bin/release with stand-ins: a repo with a bare remote of its own, a stand-in for gh playing GitHub's checks (a commit
# fails on "Linux" the tests named in its file linux-red, a line each), and this Mac's checks a script of the repo's. The runner
# is the real one with two lines changed in its copy: gh is the stand-in, and the person's allow is taken as given. Nothing
# leaves the test's own folder.
#   bash mods/claudopus/bin/release.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-release-test.XXXXXX") || exit 1
tmp=$(cd "$tmp" && pwd -P)
trap 'pkill -f "$tmp/" 2>/dev/null; [ -n "${RELEASE_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
S=$tmp/github R=$tmp/owner/remote.git
mkdir -p "$S/runs" "$S/push" "$tmp/bin" "$tmp/locks" "$tmp/out" "$tmp/owner"

# The runner's copy: the stand-in gh, and the allow given
sed -e "s#^gh_bin=.*#gh_bin=$tmp/bin/gh#" -e 's#^\[ "\$granted" = granted \] || die#granted=granted; &#' "$here/release" >"$tmp/bin/release"
chmod +x "$tmp/bin/release"
[ "$(grep -cE "^gh_bin=$tmp/bin/gh\$|^granted=granted; " "$tmp/bin/release")" = 2 ] || { echo "FAIL the runner's copy could not be made"; exit 1; }

# The stand-in for gh, answering the calls the runner makes in the shapes GitHub's API gives them. A run of a commit has two jobs:
# "check (linux)", ended after $S/secs seconds, failing when the commit's linux-red names tests (a line each, written as the
# shell tests write them: FAIL <name>, or as given when it starts NOT OK), and "check (mac)", ended three seconds later, passing.
# Main's own runs on a push are found by commit and ended at once. Logs carry GitHub's time stamps, the first line its BOM
cat >"$tmp/bin/gh" <<EOF
#!/bin/bash
S=$S R=$R
EOF
cat >>"$tmp/bin/gh" <<'EOF'
secs=$(cat $S/secs 2>/dev/null || echo 3)
jq= prev= url= sha=
for a in "$@"; do [ "$prev" = --jq ] && jq=$a; case $a in repos/*) url=$a ;; inputs\[sha\]=*) sha=${a#*=} ;; esac; prev=$a; done
red() { git -C $R show "$1:linux-red" 2>/dev/null | grep .; }
concl() { [ -n "$(red "$1")" ] && echo failure || echo success; }
# <run id> <job: 0 linux, 1 mac, or run>: status, conclusion and commit
state() {
  local c h t age=999 need
  if [ -f $S/runs/$1 ]; then read -r c h t <$S/runs/$1; age=$(( $(date +%s) - t )); else c=$(cat $S/push/$1); fi
  case $2 in 0) need=$secs ;; *) need=$((secs + 3)) ;; esac
  [ $age -ge $need ] || { echo "in_progress - $c"; return; }
  case $2 in 0 | run) echo "completed $(concl $c) $c" ;; 1) echo "completed success $c" ;; esac
}
[ "$1" = auth ] && exit 0
case $url in
  */dispatches)
    n=$(( $(cat $S/n 2>/dev/null || echo 100) + 1 )); echo $n >$S/n
    echo "$sha $(git -C $R rev-parse main) $(date +%s)" >$S/runs/$n ;;
  *'runs?head_sha='*)
    c=${url#*head_sha=}; c=${c%%&*}
    git -C $R merge-base --is-ancestor $c main 2>/dev/null || exit 0
    id=$(grep -lx $c $S/push/* 2>/dev/null | head -1); id=${id##*/}
    [ -n "$id" ] || { id=$(( $(cat $S/p 2>/dev/null || echo 900) + 1 )); echo $id >$S/p; echo $c >$S/push/$id; }
    set -- $(state $id run); printf '%s\t%s\t%s\n' $id completed $2 ;;
  *'runs?event=workflow_dispatch'*)
    want=$(printf %s "$jq" | grep -oE 'Release check [0-9a-f]{40}' | cut -d' ' -f3)
    for f in $S/runs/*; do
      [ -f "$f" ] || continue; read -r c h t <$f; [ "$c" = "$want" ] || continue
      id=${f##*/}; set -- $(state $id run)
      case $jq in *status*) printf '%s\t%s\t%s\n' $id $1 "$([ $1 = completed ] && echo $2)" ;; *) printf '%s\t%s\n' $id $h ;; esac
    done ;;
  */jobs/*/logs)
    # (as gh 2.97 does: a log holds the terminal's colour codes, so it is printed only when allowed)
    case " $* " in *" --allow-escape-sequences "*) ;; *) echo "the response contains terminal escape sequences" >&2; exit 1 ;; esac
    id=${url%/logs}; id=${id##*/}; job=$((id % 10)); id=$((id / 10)); set -- $(state $id $job)
    printf '\357\273\2772026-01-01T00:00:00.0000000Z Set up job\n'
    # the mod's tests' own count, then each shell test's lines in a group of its own, as check.yml writes them
    echo "2026-01-01T00:00:01.0000000Z  12 pass"; echo "2026-01-01T00:00:01.0000000Z  0 fail"
    if [ $job = 0 ] && [ -n "$(red $3)" ]; then
      echo "2026-01-01T00:00:01.0000000Z ##[group]revive.test.sh"
      red $3 | sed -e '/^NOT OK/!s/^/FAIL /' -e 's/^/2026-01-01T00:00:01.1234567Z /'
      echo "2026-01-01T00:00:01.2000000Z ##[endgroup]"
      echo "2026-01-01T00:00:01.3000000Z ##[error]revive.test.sh failed"
      echo "2026-01-01T00:00:02.0000000Z ##[error]Process completed with exit code 1."
    fi ;;
  */jobs*)
    id=${url#*/runs/}; id=${id%%/*}
    for job in 0 1; do
      set -- $(state $id $job); name="check (linux)"; [ $job = 1 ] && name="check (mac)"
      done=$([ $1 = completed ] && echo $2)
      case $jq in
        *html_url*) printf '%s\t%s\t%s\t%s\n' "$name" $1 "$done" "https://example/$id/$job" ;;
        *) printf '%s\t%s\t%s\t%s\t%s\n' $((id * 10 + job)) "$name" $1 "${done:-none}" "$([ "$done" = failure ] && echo "The tests pass")" ;;
      esac
    done ;;
  */runs/*) id=${url##*/}; set -- $(state $id run); printf '%s\t%s\n' $1 "$([ $1 = completed ] && echo $2)" ;;
esac
exit 0
EOF
chmod +x "$tmp/bin/gh"

# The repo: main with its .release, this Mac's check (a second, failing when mac-red is in the tree), a version
git init -q --bare -b main "$R"
git init -q -b main "$tmp/repo"
cd "$tmp/repo" || exit 1
git config user.email t@t; git config user.name t
cat >.release <<'EOF'
VERSION_FILE=version.txt
CHECK="sh check.sh"
GITHUB_CHECKS="check (linux), check (mac)"
EOF
printf 'sleep 1\n[ ! -e mac-red ]\n' >check.sh
echo 1.0.0 >version.txt
git add -A && git commit -qm start && git remote add origin "$R" && git push -q origin main && git fetch -q origin
branch() { # <name> [file content]...: a branch of its own off main, in a worktree of its own, adding its file
  git -C "$tmp/repo" fetch -q origin
  git -C "$tmp/repo" worktree add -q -b "$1" "$tmp/wt-$1" origin/main
  echo "$1" >"$tmp/wt-$1/$1.txt"
  [ $# -gt 1 ] && printf '%s\n' "${@:2}" >"$tmp/wt-$1/linux-red"
  git -C "$tmp/wt-$1" add -A && git -C "$tmp/wt-$1" commit -qm "$1"
}
# Runs a release from a worktree, each line it prints stamped with the seconds since the test began
t0=$(perl -MTime::HiRes=time -e 'printf "%.1f", time')
release() { # <name>
  (cd "$tmp/wt-$1" && RELEASE_LOCKS=$tmp/locks RELEASE_BEAT=1 RELEASE_CHECK_EVERY=1 RELEASE_BARRIER=${barrier:-} "$tmp/bin/release" 2>&1; echo "exit $?") |
    perl -MTime::HiRes=time -ne 'BEGIN { $|=1; $t0 = shift; printf "%.1f start\n", time - $t0 } printf "%.1f %s", time - $t0, $_' "$t0" >"$tmp/out/$1"
}
exit_of() { tail -1 "$tmp/out/$1" | sed 's/^[0-9.]* exit //'; }
on_main() { git -C "$tmp/repo" fetch -q origin; git -C "$tmp/repo" cat-file -e "origin/main:$1" 2>/dev/null; }
# The longest any release went printing nothing, in seconds
quiet_of() { perl -ne '($t) = /^([\d.]+)/; $g = $t - $p if defined $p && $t - $p > $g; $p = $t; END { printf "%.0f\n", $g }' "$tmp/out/$1"; }
took() { perl -e 'printf "%.1f", $ARGV[1] - $ARGV[0]' "$(head -1 "$tmp/out/$1" | cut -d' ' -f1)" "$(tail -1 "$tmp/out/$1" | cut -d' ' -f1)"; }

# A process beside the releases, in the test's own process group as GitHub's runner leaves every step's processes: no release
# may stop it (16 Nov: on Linux the stop of this Mac's checks, in a group job control never made, stopped every process beside)
sleep 600 </dev/null >/dev/null 2>&1 &
beside=$!

# 1. One release alone: the measure the others are set beside
echo 3 >"$S/secs"
branch alone
release alone
one=$(took alone)
[ "$(exit_of alone)" = 0 ] && on_main alone.txt && ok "a release alone goes out" || { no "a release alone goes out"; cat "$tmp/out/alone"; }

# 2. Three released at once are checked side by side, each on the one ahead, and land in turn, each with its own number; none
# goes quiet past its beat
branch a; branch b; branch c
barrier=$tmp/go
for n in a b c; do release $n & done
sleep 0.3; touch "$barrier"; wait
barrier=
all=$(perl -e 'printf "%.1f", $ARGV[1] - $ARGV[0]' "$(head -1 "$tmp/out/a" | cut -d' ' -f1)" "$(for n in a b c; do tail -1 "$tmp/out/$n" | cut -d' ' -f1; done | sort -n | tail -1)")
if [ "$(exit_of a)$(exit_of b)$(exit_of c)" = 000 ] && on_main a.txt && on_main b.txt && on_main c.txt; then ok "three at once all go out"; else no "three at once all go out"; tail -5 "$tmp/out/a" "$tmp/out/b" "$tmp/out/c"; fi
[ "$(git -C "$tmp/repo" show origin/main:version.txt)" = 1.0.4 ] && [ "$(git -C "$tmp/repo" ls-remote --tags origin 'v1.0.*' | wc -l | tr -d ' ')" = 4 ] && ok "each has its own number, 1.0.2 to 1.0.4, and its tag" || { no "each has its own number, 1.0.2 to 1.0.4, and its tag"; echo "     main has $(git -C "$tmp/repo" show origin/main:version.txt)"; }
echo "     three at once took $all s, one alone $one s"
perl -e 'exit !($ARGV[0] < 2 * $ARGV[1])' "$all" "$one" && ok "three at once take less than two alone" || no "three at once take less than two alone"
q=$(for n in a b c; do quiet_of $n; done | sort -n | tail -1)
echo "     the longest any went quiet: $q s, with a beat of 1 s"
[ "$q" -le 3 ] && ok "none of them goes quiet for more than a few seconds" || no "none of them goes quiet for more than a few seconds"
[ -z "$(ls "$tmp/locks" | grep -v '\.line$')" ] && [ -z "$(ls "$tmp/locks/"*.line 2>/dev/null | grep -v '^seq$')" ] && ok "the lock and the line are left empty" || { no "the lock and the line are left empty"; ls -R "$tmp/locks"; }

# 3. The one ahead fails GitHub's checks with a failure of its own: it alone is refused, and the one behind, checked on top of it,
# is made again on main and goes out by itself
branch bad "bad's own test"; branch good
release bad &
n=0; until grep -q "waiting for GitHub's checks" "$tmp/out/bad" 2>/dev/null || [ $n -gt 100 ]; do sleep 0.1; n=$((n + 1)); done
release good; wait
[ "$(exit_of bad)" = 3 ] && ! on_main bad.txt && ok "a release bringing a failure of its own is refused" || { no "a release bringing a failure of its own is refused"; tail -4 "$tmp/out/bad"; }
[ "$(exit_of good)" = 0 ] && on_main good.txt && ! on_main linux-red && ok "the one behind it goes out by itself, without it" || { no "the one behind it goes out by itself, without it"; tail -6 "$tmp/out/good"; }
grep -q 'did not land; making this one again on main' "$tmp/out/good" && ok "it says it made its commit again on main" || no "it says it made its commit again on main"

# 4. Main fails on Linux (a test pushed with a fault). A release that changes nothing of it goes out; one that brings a new
# failure is refused, naming it; one that fixes one of main's two failures goes out
git -C "$tmp/repo" fetch -q origin
git -C "$tmp/repo" worktree add -q --detach "$tmp/wt-red" origin/main
printf 'one watcher at a time\na file it cannot carry whole\n' >"$tmp/wt-red/linux-red"
git -C "$tmp/wt-red" add -A && git -C "$tmp/wt-red" commit -qm "red main" && RELEASE_PUSH=1 git -C "$tmp/wt-red" push -q origin HEAD:main
branch plain; release plain
[ "$(exit_of plain)" = 0 ] && on_main plain.txt && ok "on a main that fails, a release that brings no failure of its own goes out" || { no "on a main that fails, a release that brings no failure of its own goes out"; tail -5 "$tmp/out/plain"; }
grep -q 'failed only where main already fails' "$tmp/out/plain" && ok "it says main already failed there" || no "it says main already failed there"
branch worse; printf 'one watcher at a time\na file it cannot carry whole\nNOT OK 7 - the gate holds\n' >"$tmp/wt-worse/linux-red"; git -C "$tmp/wt-worse" commit -qam worse
release worse
[ "$(exit_of worse)" = 3 ] && ! on_main worse.txt && grep -q 'what this release brings: check (linux): the gate holds;' "$tmp/out/worse" && ok "one that brings a new failure is refused, naming only that one" || { no "one that brings a new failure is refused, naming only that one"; tail -4 "$tmp/out/worse"; }
branch half; printf 'a file it cannot carry whole\n' >"$tmp/wt-half/linux-red"; git -C "$tmp/wt-half" commit -qam half
release half
[ "$(exit_of half)" = 0 ] && [ "$(git -C "$tmp/repo" show origin/main:linux-red)" = "a file it cannot carry whole" ] && ok "a fix of one of main's failures goes out while the other still fails" || { no "a fix of one of main's failures goes out while the other still fails"; tail -5 "$tmp/out/half"; }

# 5. This Mac's checks fail: refused, at once and not after GitHub's
echo 8 >"$S/secs"
branch mac; touch "$tmp/wt-mac/mac-red"; git -C "$tmp/wt-mac" add -A; git -C "$tmp/wt-mac" commit -qm mac
release mac
[ "$(exit_of mac)" = 3 ] && ! on_main mac.txt && perl -e 'exit !($ARGV[0] < 7)' "$(took mac)" && ok "a release whose checks on this Mac fail is refused before GitHub ends" || { no "a release whose checks on this Mac fail is refused before GitHub ends"; tail -4 "$tmp/out/mac"; }

kill -0 "$beside" 2>/dev/null && ok "a process beside the releases is never stopped by them" || no "a process beside the releases is never stopped by them"
kill "$beside" 2>/dev/null
[ -z "$(git -C "$R" for-each-ref refs/release-check)" ] && ok "no commit is left waiting on GitHub's checks" || { no "no commit is left waiting on GitHub's checks"; git -C "$R" for-each-ref refs/release-check; }
[ "$fails" -eq 0 ] && echo "release.test.sh: all passed" || { echo "release.test.sh: $fails failed"; exit 1; }
