#!/bin/bash
# Tests the gate in bin/admin on a Mac: no admin command gets past it without a grant the hook sealed, however the runner is reached.
# Everything runs under a home folder of its own, with a keychain of its own made there, so the person's keychain, settings and
# kept passwords are never touched; no command is run as admin (each case stops at the gate, or at the password it does not have).
#   bash mods/claudopus/bin/admin.test.sh
set -u
# On a Mac it runs under a keychain of its own; on Linux bin/keyring keeps its files under this test's own home. Windows (Git's bash)
# keeps them as Linux does, but has no admin runner for the computer itself: there the gate is tested on a host reached over SSH,
# which no command gets past it to (the host is never reached), and what needs sudo, Python's terminal or jq is skipped, saying why
[ "$(uname)" = Darwin ] && mac=1 || mac=
case $(uname -s) in MINGW* | MSYS* | CYGWIN*) windows=1 ;; *) windows= ;; esac
# The computer the gate cases run for, and what a command past the gate says: here, where it then asks for the password nobody types,
# or on Windows a host that is never reached
if [ -n "$windows" ]; then H=m4.invalid PAST_STATUS=5 PAST_SAID='could not be reached'; else H=here PAST_STATUS=3 PAST_SAID='No password was typed'; fi
here=$(cd "$(dirname "$0")" && pwd)
admin=$here/admin
real_home=$HOME
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-admin-test.XXXXXX") || exit 1
trap 'rm -rf "$tmp"' EXIT
export HOME=$tmp/home
memory=$HOME/.claude/claudopus
mkdir -p "$memory/admin-grants"
unset XDG_DATA_HOME
# The runners take their home folder from the user database, never $HOME: the cases below run copies of them that take this test's
# home instead, so the person's own is never touched. The shipped runners, which take the person's, are run only where they must
# refuse (a forged key and grant under another home)
shipped=$here
src=$here/../../../src
mkdir -p "$tmp/bin" && cp -p "$here"/* "$tmp/bin/" || exit 1
for f in admin release secret keyring; do
  sed 's|^own_home=$(/usr/bin/perl .*$|own_home=$HOME|' "$here/$f" >"$tmp/bin/$f" && chmod +x "$tmp/bin/$f"
  ! cmp -s "$here/$f" "$tmp/bin/$f" || { echo "admin.test.sh: $f takes its home folder some other way now"; exit 1; }
done
# The release's copy takes this test's own gh, which answers as GitHub would (below)
sed -i.bak "s|^gh_bin=.*\$|gh_bin=$tmp/release/gh/gh|" "$tmp/bin/release" && rm -f "$tmp/bin/release.bak"
grep -qx "gh_bin=$tmp/release/gh/gh" "$tmp/bin/release" || { echo "admin.test.sh: release finds gh some other way now"; exit 1; }
here=$tmp/bin
admin=$here/admin
if [ -n "$mac" ]; then
  mkdir -p "$HOME/Library/Keychains" "$HOME/Library/Preferences"
  keychain=$HOME/Library/Keychains/login.keychain-db
  security create-keychain -p "" "$keychain" && security list-keychains -s "$keychain" && security default-keychain -s "$keychain" || { echo "admin.test.sh: no keychain could be made under $HOME"; exit 1; }
  security unlock-keychain -p "" "$keychain" 2>/dev/null
fi
# Seals are made by the hook's own script, read out of its source (src/claudopus/gate.tsx), which also makes the key: what the hook
# seals is then what this runner takes. A seal under another key is made here
hook_seal=$(node -e '
  const text = require("fs").readFileSync(process.argv[1], "utf8")
  const GATE_SERVICE = /const GATE_SERVICE = \x27([^\x27]+)\x27/.exec(text)[1]
  process.stdout.write(eval(/const SEAL = (`[\s\S]*?`)\n/.exec(text)[1]))
' "$src/claudopus/gate.tsx") && [ -n "$hook_seal" ] || { echo "admin.test.sh: the hook's seal script was not read from src/claudopus/gate.tsx"; exit 1; }
# (on Windows it takes the person's profile as its home, as the runners do: here it takes this test's own instead)
if [ -n "$windows" ]; then
  was=$hook_seal
  hook_seal=$(printf '%s\n' "$hook_seal" | grep -v '/usr/bin/cygpath')
  [ "$hook_seal" != "$was" ] || { echo "admin.test.sh: the hook's seal script finds the profile some other way now"; exit 1; }
fi
seal() {
  if [ -n "${2:-}" ]; then printf '%s\n%s' "$2" "$1" | perl -MDigest::SHA=hmac_sha256_hex -e '$k = <STDIN>; chomp $k; local $/; $m = <STDIN>; print hmac_sha256_hex($m, $k)'; else /bin/sh -c "$hook_seal" sh make "$1"; fi
}
[ "$(seal probe | wc -c)" -ge 64 ] || { echo "admin.test.sh: the hook's seal script made no seal"; exit 1; }
now() { perl -e 'print time() * 1000'; }
# grant <name> <host> <command> [at] [seal]
grant() {
  local at=${4:-$(now)} s
  s=${5:-$(seal "$(printf 'grant\n%s\n%s\n%s\n%s' "$1" "$at" "$2" "$3")")}
  perl -MJSON::PP -e 'print JSON::PP->new->canonical->encode({id => $ARGV[0], host => $ARGV[1], command => $ARGV[2], at => $ARGV[3] + 0, seal => $ARGV[4]})' "$1" "$2" "$3" "$at" "$s" >"$memory/admin-grants/$1.json"
}
config() { printf '%s\n' "$1" >"$memory/config.json"; }
# Past the gate the runner has no kept password here: it asks for one under this test's own home, where no panel takes the request,
# and with nobody at the screen (as over SSH) it says so and ends 3. It gives a panel one second to take the request, not its usual
# 15: no panel ever takes one here, and each of the cases past the gate waited out the 15
export SSH_CONNECTION=test
export CLAUDOPUS_BOX_TAKEN=1
failed=0
n=0
# expect <what> <exit status> <words in what it printed> -- <command...>
expect() {
  local what=$1 status=$2 words=$3 out got
  shift 4
  n=$((n + 1))
  out=$("$@" 2>&1)
  got=$?
  if [ "$got" = "$status" ] && printf '%s' "$out" | grep -q -e "$words"; then
    echo "ok $n - $what"
  else
    echo "NOT OK $n - $what: ended $got, wanted $status with \"$words\"; it printed: $out"
    failed=1
  fi
}
REFUSED='was not allowed on its card'
PAST=$PAST_SAID
config '{}'

expect 'no grant: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
printf '#!/bin/sh\nexec "%s" "%s" "id -u"\n' "$admin" "$H" >"$tmp/wrapper.sh" && chmod +x "$tmp/wrapper.sh"
expect 'through a wrapper script: refused' 6 "$REFUSED" -- "$tmp/wrapper.sh"
ln -s "$admin" "$tmp/another-name"
expect 'through a link under another name: refused' 6 "$REFUSED" -- "$tmp/another-name" "$H" 'id -u'
expect 'through another spelling of its path: refused' 6 "$REFUSED" -- "$here/../bin/./admin" "$H" 'id -u'
expect 'through a shell and a variable: refused' 6 "$REFUSED" -- /bin/sh -c 'a=adm; "$1/${a}in" "$2" "id -u"' sh "$here" "$H"
expect 'handed to bash as a script: refused' 6 "$REFUSED" -- /bin/bash "$admin" "$H" 'id -u'
printf 'security() { echo abc; }\nperl() { echo "granted keep"; }\n' >"$tmp/env.sh"
expect 'with BASH_ENV set to replace its tools: refused' 6 "$REFUSED" -- env BASH_ENV="$tmp/env.sh" "$admin" "$H" 'id -u'
expect 'handed to bash with BASH_ENV set: refused' 6 "$REFUSED" -- env BASH_ENV="$tmp/env.sh" /bin/bash "$admin" "$H" 'id -u'
expect 'with a perl option set to load other code: refused' 6 "$REFUSED" -- env PERL5OPT=-MNoSuchModuleAtAll "$admin" "$H" 'id -u'

grant forged "$H" 'id -u' "$(now)" "$(seal x not-the-key)"
expect 'a grant with a seal from another key: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
grant unsealed "$H" 'id -u' "$(now)" none
expect 'a grant with a made-up seal: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
rm -f "$memory"/admin-grants/*
grant other "$H" 'id -u'
expect 'a grant for another command: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u; rm -rf /tmp/x'
expect 'a grant for another Mac: refused' 6 "$REFUSED" -- "$admin" m4 'id -u'
rm -f "$memory"/admin-grants/*
grant old "$H" 'id -u' "$(($(now) - 300000))"
expect 'a grant from five minutes ago: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
rm -f "$memory"/admin-grants/*

grant good "$H" 'id -u'
expect 'a sealed grant for this Mac and this command: past the gate' "$PAST_STATUS" "$PAST" -- "$admin" "$H" 'id -u'
[ ! -e "$memory/admin-grants/good.json" ] && echo "ok - the grant was taken" || { echo "NOT OK - the grant was left"; failed=1; }
expect 'the same command again, its grant taken: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
# What root runs has the system's own PATH, never the caller's: a program planted earlier on the caller's PATH is not the one run
mkdir -p "$tmp/planted" && printf '#!/bin/sh\necho planted\n' >"$tmp/planted/id" && chmod +x "$tmp/planted/id"
[ -n "$mac" ] && system_path=/usr/bin:/bin:/usr/sbin:/sbin || system_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
grant path "$H" 'id -u'
if [ -n "$windows" ]; then
  echo "ok - what root runs on this computer skipped: Windows has no admin runner for it"
  rm -f "$memory"/admin-grants/*
  # and an admin command for this PC is refused before the gate, saying how it is run instead
  expect 'on Windows, an admin command for this PC: refused, run it in a terminal opened as administrator' 6 'Windows has no admin runner: run it yourself in a terminal opened as administrator' -- "$admin" here 'id -u'
else
  shown=$(PATH="$tmp/planted:$PATH" CLAUDOPUS_ADMIN_SHOW=1 "$admin" "$H" 'id -u' 2>&1)
  n=$((n + 1))
  if [ "$shown" = "PATH=$system_path; export PATH; id -u" ]; then echo "ok $n - a caller's PATH does not reach what root runs"; else echo "NOT OK $n - root was handed: $shown"; failed=1; fi
fi

config '{"admin":"never"}'
expect '"never" with no seal: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nnever')" not-the-key)\"}"
expect '"never" sealed by another key: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nwork')")\"}"
expect '"never" with the seal of "work": refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
config "{\"admin\":\"work\",\"adminSealed\":\"$(seal "$(printf 'mode\nwork')")\"}"
expect '"work" as Config sealed it, with no grant: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nnever')")\"}"
expect '"never" as Config sealed it: past the gate with no grant' "$PAST_STATUS" "$PAST" -- "$admin" "$H" 'id -u'
expect '"never" as Config sealed it, through a wrapper as before: past the gate' "$PAST_STATUS" "$PAST" -- "$tmp/wrapper.sh"

# adminPassword, which earlier versions read, chooses nothing: with no grant refused, with one the password is asked for
config '{"adminPassword":"keep"}'
expect 'adminPassword set, no grant: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
grant pw1 "$H" 'id -u'
expect 'adminPassword set, a grant: the password is asked for, as always' "$PAST_STATUS" "$PAST" -- "$admin" "$H" 'id -u'

config '{}'
# What takes something back makes a new key: a grant and a "never" sealed before it count for nothing
at=$(now)
old_grant=$(seal "$(printf 'grant\nkept\n%s\n%s\nid -u' "$at" "$H")")
old_never=$(seal "$(printf 'mode\nnever')")
/bin/sh -c "$hook_seal" sh new >/dev/null || { echo "NOT OK - no new key was made"; failed=1; }
grant kept "$H" 'id -u' "$at" "$old_grant"
expect 'a grant sealed before the key changed: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
rm -f "$memory"/admin-grants/*
config "{\"admin\":\"never\",\"adminSealed\":\"$old_never\"}"
expect '"never" sealed before the key changed: refused' 6 "$REFUSED" -- "$admin" "$H" 'id -u'
config '{}'
# The secret runner reads only its own keys: a setting in its environment never points it at the kept admin passwords
printf '%s\n' 'admin-pass-1' | "$here/keyring" set claudopus-admin m9 'Claudopus admin: m9'
listed=$(env CLAUDOPUS_SECRET_SERVICE=claudopus-admin "$here/secret" --list 2>&1)
n=$((n + 1))
if [ -z "$listed" ]; then echo "ok $n - the secret runner cannot be pointed at the admin passwords"; else echo "NOT OK $n - the secret runner listed: $listed"; failed=1; fi
"$here/keyring" delete claudopus-admin m9 >/dev/null 2>&1
# F-007 F-009: no admin password is kept or used. A "never" sealed with the gate's own key, as anything that reads the key could seal
# it, with a password an earlier version kept: the runner neither uses that password nor runs anything; it asks for the password,
# and the kept one is gone. Before this fix the kept password ran the command with no one asked
printf '%s\n' 'kept-admin-pw' | "$here/keyring" set claudopus-admin "$H" "Claudopus admin: $H"
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nnever')")\"}"
expect 'a "never" sealed with the real key and a password kept: nothing runs, the password is asked for' "$PAST_STATUS" "$PAST" -- "$admin" "$H" 'id -u'
n=$((n + 1))
if "$here/keyring" has claudopus-admin "$H"; then echo "NOT OK $n - the kept admin password was left"; failed=1; else echo "ok $n - the kept admin password was forgotten, never used"; fi
config '{}'
# What the panel types is sealed by the hook's own openssl line (read out of src/claudopus/boxes.tsx) to a key made as the runner
# makes it, and opened as the runner opens it: this machine's openssl takes every option both use
if [ -n "$windows" ]; then line=SEAL_FOR_WINDOWS; else line=SEAL_FOR; fi
seal_for=$(node -e 'const t = require("fs").readFileSync(process.argv[1], "utf8"); process.stdout.write(eval(new RegExp(`const ${process.argv[2]} =\\s+(\x27[^\\n]*\x27)\\n`).exec(t)[1]))' "$src/claudopus/boxes.tsx" "$line")
private=$(openssl genrsa 2048 2>/dev/null)
public=$(printf '%s\n' "$private" | openssl rsa -pubout -outform DER 2>/dev/null | openssl base64 -A)
sealed_value=$(printf '%s' 'pw "with" \quotes' | /bin/bash -c "$seal_for" sh "$public")
if [ -n "$windows" ]; then
  # (Git's openssl, a Windows program, opens the key as the runner has it there: a file of its own for that moment)
  printf '%s\n' "$private" >"$tmp/box.key"
  opened=$(printf '%s' "$sealed_value" | openssl base64 -d -A 2>/dev/null | openssl pkeyutl -decrypt -inkey "$tmp/box.key" -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 2>/dev/null)
  rm -f "$tmp/box.key"
else
  opened=$(printf '%s' "$sealed_value" | openssl base64 -d -A 2>/dev/null | openssl pkeyutl -decrypt -inkey /dev/fd/3 -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 3< <(printf '%s\n' "$private") 2>/dev/null)
fi
n=$((n + 1))
if [ "$opened" = 'pw "with" \quotes' ] && ! printf '%s' "$sealed_value" | grep -qF '"with"' ; then echo "ok $n - a box's value goes sealed and is opened only with the runner's key"; else echo "NOT OK $n - sealed '$sealed_value' opened as '$opened'"; failed=1; fi
grep -q 'pkeyutl -decrypt -inkey /dev/fd/3 -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256' "$admin" || { echo "NOT OK - the runner opens a box's value another way than tested here"; failed=1; }
unset private
# Nothing in the runner keeps an admin password
n=$((n + 1))
if grep -q 'keyring" set "$service"' "$admin"; then echo "NOT OK $n - the runner still keeps a password"; failed=1; else echo "ok $n - the runner keeps no admin password"; fi
rm -f "$memory"/admin-grants/*
# A kept admin password is hidden in what the secret runner hides, as a kept key is
printf '%s\n' 'adminpw-5678' | "$here/keyring" set claudopus-admin here 'Claudopus admin: here'
hidden=$(printf 'the password is adminpw-5678\n' | "$here/secret" --hide)
n=$((n + 1))
if [ "$hidden" = 'the password is [hidden admin password of here]' ]; then echo "ok $n - a kept admin password is hidden in what is printed"; else echo "NOT OK $n - it printed: $hidden"; failed=1; fi
"$here/keyring" delete claudopus-admin here >/dev/null 2>&1

# The release runner: a release only with the person's press, and nothing of a branch's .release run
r=$tmp/release
mkdir -p "$r" && git init -q --bare "$r/origin.git" && git clone -q "$r/origin.git" "$r/work" 2>/dev/null
(cd "$r/work" && git config user.email t@t && git config user.name t && git checkout -q -b main && printf 'CHECK=true\n' >.release && echo one >file && git add -A && git commit -q -m one && git push -q origin main)
# A branch whose .release would run code of its own as it is read, push somewhere else, run a step after and replace bash
(cd "$r/work" && git checkout -q -b fix-it && printf 'touch %q\nREMOTE=elsewhere\nAFTER="touch %q"\nbash() { touch %q; }\nCHECK=true\n' "$r/read" "$r/after" "$r/bash" >.release && echo two >file && git commit -q -am two)
export RELEASE_LOCKS=$tmp/locks
# Inside Claude Code, as work runs it, a release needs the press; a person's own release from their terminal does not
export CLAUDECODE=1
top=$(git -C "$r/work" rev-parse --show-toplevel)
# release_grant <id> <seal word> <branch>
release_grant() {
  local at s
  at=$(now)
  s=$(seal "$(printf '%s\n%s\n%s\nrelease\n%s\n%s' "$2" "$1" "$at" "$top" "$3")")
  perl -MJSON::PP -e 'print JSON::PP->new->canonical->encode({id => $ARGV[0], host => "release", command => $ARGV[1], at => $ARGV[2] + 0, seal => $ARGV[3]})' "$1" "$top
$3" "$at" "$s" >"$memory/admin-grants/$1.json"
}
release() { (cd "$r/work" && "$here/release"); }
RELEASE_REFUSED='nothing was released, because this release was not allowed on its card'
expect 'a release with no grant: refused' 6 "$RELEASE_REFUSED" -- release
release_grant rel1 release-grant other-branch
expect 'a release granted for another branch: refused' 6 "$RELEASE_REFUSED" -- release
rm -f "$memory"/admin-grants/*
release_grant rel2 grant fix-it
expect "a release with an admin command's seal: refused" 6 "$RELEASE_REFUSED" -- release
rm -f "$memory"/admin-grants/*
n=$((n + 1))
[ "$(git -C "$r/origin.git" rev-parse main)" = "$(git -C "$r/work" rev-parse main)" ] && echo "ok $n - main was not moved with no grant" || { echo "NOT OK $n - main moved with no grant"; failed=1; }
release_grant rel3 release-grant fix-it
expect 'a release granted for this worktree and branch: released' 0 'released' -- release
n=$((n + 1))
[ "$(git -C "$r/origin.git" show main:file)" = two ] && echo "ok $n - main has the branch" || { echo "NOT OK $n - main does not have the branch"; failed=1; }
n=$((n + 1))
[ ! -e "$memory/admin-grants/rel3.json" ] && echo "ok $n - the release's grant was taken" || { echo "NOT OK $n - the release's grant was left"; failed=1; }
for mark in read after bash; do
  n=$((n + 1))
  [ ! -e "$r/$mark" ] && echo "ok $n - the branch's .release did not run its $mark" || { echo "NOT OK $n - the branch's .release ran its $mark"; failed=1; }
done
(cd "$r/work" && echo three >file && git commit -q -am three)
# Outside Claude Code with no terminal, as a run detached or over ssh: still refused
expect 'outside Claude Code with no terminal and no grant: refused' 6 "$RELEASE_REFUSED" -- env -u CLAUDECODE bash -c 'cd "$1" && "$2" </dev/null' sh "$r/work" "$here/release"
# F-017: a key and a grant made under a home folder of the caller's own count for nothing: the shipped runner reads the person's
# own home, whatever HOME says, and XDG_DATA_HOME is never read
release_grant rel4 release-grant three
(cd "$r/work" && git checkout -q -b three 2>/dev/null; git commit -q --allow-empty -m forged)
expect 'the shipped release, with a valid grant and key under another HOME: refused' 6 "$RELEASE_REFUSED" -- env HOME="$HOME" XDG_DATA_HOME="$HOME/.local/share" bash -c 'cd "$1" && "$2" </dev/null' sh "$r/work" "$shipped/release"
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nnever')")\"}"
expect 'the shipped admin, with a valid never-ask seal under another HOME: refused' 6 "$REFUSED" -- env HOME="$HOME" XDG_DATA_HOME="$HOME/.local/share" "$shipped/admin" "$H" 'id -u'
config '{}'
rm -f "$memory"/admin-grants/*
(cd "$r/work" && git checkout -q fix-it)
# A person at their own terminal outside Claude Code: asked there, and a no releases nothing, a yes releases
at_terminal() {
  env -u CLAUDECODE python3 -c '
import os, pty, select, sys
pid, fd = pty.fork()
if pid == 0:
    os.chdir(sys.argv[1]); os.execv(sys.argv[2], [sys.argv[2]])
out, sent = b"", False
while True:
    if not select.select([fd], [], [], 60)[0]: break
    try: d = os.read(fd, 4096)
    except OSError: break
    if not d: break
    out += d
    if not sent and b"[y/N]" in out: os.write(fd, sys.argv[3].encode() + b"\n"); sent = True
_, st = os.waitpid(pid, 0)
sys.stdout.write(out.decode(errors="replace")); sys.exit(os.WEXITSTATUS(st) if os.WIFEXITED(st) else 1)
' "$r/work" "$here/release" "$1"
}
if [ -z "$windows" ]; then
  expect "a person's own release at a terminal, answered no: refused" 6 "$RELEASE_REFUSED" -- at_terminal n
  expect "a person's own release at a terminal, answered yes: released" 0 'released' -- at_terminal y
else
  echo "ok - a person's own release at a terminal skipped: it takes Python's terminal, which Windows has not"
  # (released by its grant instead, so what follows starts from the same main)
  release_grant rel-own release-grant fix-it
  expect "the person's release, by its grant" 0 'released' -- release
fi
n=$((n + 1))
[ "$(git -C "$r/origin.git" show main:file)" = three ] && echo "ok $n - main has the person's release" || { echo "NOT OK $n - main does not have the person's release"; failed=1; }

if ! command -v jq >/dev/null 2>&1; then
  echo "ok - main's own checks and GitHub's skipped: this test's stand-in for gh answers through jq, which is not installed here"
else
# Main's own checks are read and run even where the .release names only some of the settings (15 Nov: a read that ended on a name
# the file left out took none of them, so CHECK went unrun; GitHub's runner hid it, as it sets GITHUB_WORKFLOW itself)
(cd "$r/work" && git fetch -q origin && git checkout -q -B main origin/main && printf 'CHECK=false\n' >.release && git commit -q -am "checks fail" && RELEASE_PUSH=1 git push -q origin main && git checkout -q -b red-check && echo red >file && git commit -q -am red) || { echo "NOT OK - the repo for a failing check was not set up"; failed=1; }
release_grant rel-red release-grant red-check
expect "main's own check fails: refused" 3 'the checks failed on main with red-check' -- release
# GitHub's checks: with GITHUB_CHECKS in main's .release, main's own workflow is started on the very commit main is to become, and
# main moves only once every job of that run passed. This test's gh keeps the commit it was asked to check, lists run 77 for it as
# main's dispatch (and whatever $r/runs.extra adds, its SHA put in), through jq with the release's own filter; it answers 77's jobs
# from $r/checks (one "name<tab>status<tab>conclusion<tab>url" line each), or from $r/checks.later once asked twice, and any other
# run's as all passed
mkdir -p "$r/gh"
cat >"$r/gh/gh" <<EOF
#!/bin/bash
jobs() { if [ "\$(cat "$r/asks" 2>/dev/null || echo 0)" -gt 2 ] && [ -e "$r/checks.later" ]; then cat "$r/checks.later"; else cat "$r/checks"; fi; }
filter=; for a in "\$@"; do [ "\$prev" = --jq ] && filter=\$a; prev=\$a; done
case "\$*" in
  "auth status") exit 0 ;;
  "api -X POST repos/"*"/actions/workflows/check.yml/dispatches -f ref=refs/heads/main -f inputs[sha]="*) all=\$*; printf '%s\n' "\${all##*=}" >"$r/asked" ;;
  "api repos/"*"/actions/workflows/check.yml/runs?event=workflow_dispatch&branch=main"*)
    [ -s "$r/asked" ] || { echo '{"workflow_runs":[]}' | jq -r "\$filter"; exit; }
    sha=\$(cat "$r/asked"); at=\$(date -u +%Y-%m-%dT%H:%M:%SZ)
    { printf '{"id":77,"display_title":"Release check %s","head_branch":"main","head_sha":"%s","path":".github/workflows/check.yml","event":"workflow_dispatch","created_at":"%s"}\n' "\$sha" "\$(git -C "$r/origin.git" rev-parse main)" "\$at"
      [ -e "$r/runs.extra" ] && sed "s/SHA/\$sha/g; s/NOW/\$at/g" "$r/runs.extra"; } | jq -s '{workflow_runs: (reverse)}' | jq -r "\$filter" ;;
  "api repos/"*"/actions/runs/77 --jq"*) n=\$(( \$(cat "$r/asks" 2>/dev/null || echo 0) + 1 )); echo \$n >"$r/asks"; jobs | awk -F'\t' '\$2 != "completed" { busy = 1 } \$2 == "completed" && \$3 !~ /^(success|skipped|neutral)\$/ { red = 1 } END { print (busy ? "in_progress\t" : red ? "completed\tfailure" : "completed\tsuccess") }' ;;
  "api repos/"*"/actions/runs/"*" --jq"*) printf 'completed\tsuccess\n' ;;
  "api --paginate repos/"*"/actions/runs/77/jobs"*) jobs ;;
  "api --paginate repos/"*"/actions/runs/"*"/jobs"*) printf 'check (ubuntu-latest)\tcompleted\tsuccess\tu\ncheck (macos-latest)\tcompleted\tsuccess\tu\n' ;;
  *) echo "gh: not answered here: \$*" >&2; exit 1 ;;
esac
EOF
chmod +x "$r/gh/gh"
# (main of this test's own repo is pushed past the guard the release put in, as the test runs with CLAUDECODE set)
(cd "$r/work" && git fetch -q origin && git checkout -q -B main origin/main && printf 'CHECK="test -s %s && test ! -e %s && { test ! -e %s || touch stray; } && { test ! -e %s || git commit -q --allow-empty -m moved; } && { test ! -e %s || sleep 47.25; }"\nGITHUB_CHECKS="check (ubuntu-latest), check (macos-latest)"\n' "$r/asked" "$r/local-red" "$r/local-stray" "$r/local-move" "$r/local-slow" >.release && git commit -q -am "checks on GitHub" && RELEASE_PUSH=1 git push -q origin main && git checkout -q -b gh-checks && echo four >file && git commit -q -am four) || { echo "NOT OK - the repo for GitHub's checks was not set up"; failed=1; }
checks() { printf "$@" >"$r/checks"; rm -f "$r/checks.later" "$r/asks" "$r/asked" "$r/runs.extra"; }
gh_release() { release_grant "rel-$1" release-grant gh-checks; (cd "$r/work" && RELEASE_CHECK_EVERY=1 RELEASE_CHECK_WAIT=${WAIT:-4} "$here/release"); }
main_was=$(git -C "$r/origin.git" rev-parse main)
unmoved() { n=$((n + 1)); [ "$(git -C "$r/origin.git" rev-parse main)" = "$main_was" ] && echo "ok $n - $1: main was not moved" || { echo "NOT OK $n - $1: main moved"; failed=1; }; }
no_candidate() { n=$((n + 1)); [ -z "$(git -C "$r/origin.git" for-each-ref refs/release-check refs/heads/release-check)" ] && echo "ok $n - $1: the commit put up for GitHub to check is taken down" || { echo "NOT OK $n - $1: the commit put up for GitHub to check was left"; failed=1; }; }
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tfailure\thttps://github.com/run/2\n'
expect 'a red check on GitHub: refused, naming the check' 3 'failed on main with gh-checks.*check (macos-latest) (failure) https://github.com/run/2' -- gh_release red
unmoved 'a red check'; no_candidate 'a red check'
n=$((n + 1)); [ -n "$(cat "$r/asked" 2>/dev/null)" ] && git -C "$r/origin.git" cat-file -e "$(cat "$r/asked")" 2>/dev/null && echo "ok $n - the checks read were of the commit pushed for GitHub to check" || { echo "NOT OK $n - the checks read were of no commit pushed"; failed=1; }
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tin_progress\t\tu2\n'
expect 'a check still running when the wait runs out: refused, saying which' 3 'did not end in time.*check (macos-latest) running' -- gh_release running
unmoved 'a check still running'; no_candidate 'a check still running'
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\n'
expect 'a named check GitHub never started: refused, saying which' 3 'check (macos-latest) not started' -- gh_release missing
unmoved 'a named check missing'
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tsuccess\tu2\nother\tcompleted\tcancelled\tu3\n'
expect 'any other check on the commit that did not pass: refused' 3 'other (cancelled)' -- gh_release other
unmoved 'another check cancelled'
# A run named for the same commit but started on another branch (its own check.yml, all passing), newer than main's red one:
# never the one read
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tfailure\tu2\n'
printf '{"id":88,"display_title":"Release check SHA","head_branch":"evil","head_sha":"SHA","path":".github/workflows/check.yml","event":"workflow_dispatch","created_at":"NOW"}\n' >"$r/runs.extra"
expect "a passing run of the same commit from another branch: not taken, main's red run refuses it" 3 'check (macos-latest) (failure) u2' -- gh_release evil
unmoved 'a run from another branch'
# Two runs on main named for the same commit: refused
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tsuccess\tu2\n'
printf '{"id":89,"display_title":"Release check SHA","head_branch":"main","head_sha":"SHA","path":".github/workflows/check.yml","event":"workflow_dispatch","created_at":"NOW"}\n' >"$r/runs.extra"
expect 'two runs on main named for the same commit: refused' 3 'more than one run' -- gh_release twice
unmoved 'two runs for one commit'
# This Mac's own checks run while GitHub checks (main's CHECK above passes only once GitHub was asked): one that fails refuses the
# release at once, with GitHub's still running and a minute left to wait, and so does one that leaves a file the repo does not
# track or moves the release's commit, though GitHub's pass
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tin_progress\t\tu2\n'
touch "$r/local-red"
started=$SECONDS
WAIT=60 expect "this Mac's own check fails while GitHub's run: refused at once" 3 'the checks failed on main with gh-checks' -- gh_release local-red
rm -f "$r/local-red"
n=$((n + 1)); [ -s "$r/asked" ] && [ $((SECONDS - started)) -lt 30 ] && echo "ok $n - GitHub was asked first, and the refusal did not wait for it" || { echo "NOT OK $n - GitHub asked: $(cat "$r/asked" 2>/dev/null), after $((SECONDS - started)) s"; failed=1; }
unmoved "this Mac's own check failing"; no_candidate "this Mac's own check failing"
# A red check on GitHub while this Mac's checks still run: refused at once, and nothing of those checks is left running
checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tfailure\tu2\n'
touch "$r/local-slow"
started=$SECONDS
expect "GitHub red while this Mac's checks run: refused" 3 'check (macos-latest) (failure) u2' -- gh_release local-slow
rm -f "$r/local-slow"
command -v pgrep >/dev/null 2>&1 || echo "ok - whether this computer's checks are left running skipped: pgrep is not installed here"
n=$((n + 1)); [ $((SECONDS - started)) -lt 30 ] && ! { command -v pgrep >/dev/null 2>&1 && pgrep -f 'sleep 47.25' >/dev/null; } && echo "ok $n - it did not wait for this Mac's checks, and stopped them" || { echo "NOT OK $n - after $((SECONDS - started)) s, still running: $(pgrep -fl 'sleep 47.25')"; failed=1; pkill -f 'sleep 47.25'; }
for what in stray move; do
  checks 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tsuccess\tu2\n'
  touch "$r/local-$what"
  [ $what = stray ] && said='the checks left files the repo does not track' || said="the checks changed the release's commit"
  expect "this Mac's check that leaves $what: refused, though GitHub's pass" 3 "$said" -- gh_release "local-$what"
  rm -f "$r/local-$what"
  unmoved "this Mac's check that leaves $what"; no_candidate "this Mac's check that leaves $what"
done
checks 'check (ubuntu-latest)\tqueued\t\tu1\ncheck (macos-latest)\tin_progress\t\tu2\n'
printf 'check (ubuntu-latest)\tcompleted\tsuccess\tu1\ncheck (macos-latest)\tcompleted\tsuccess\tu2\n' >"$r/checks.later"
# (a wait long enough for a slow runner: it ends as soon as the checks pass)
WAIT=60
expect 'checks running, then green: released once they pass, after saying what it waits for' 0 "waiting for GitHub's checks: check (ubuntu-latest) running, check (macos-latest) running" -- gh_release green
WAIT=
n=$((n + 1)); [ "$(git -C "$r/origin.git" rev-parse main)" = "$(cat "$r/asked")" ] && echo "ok $n - main is the very commit GitHub checked" || { echo "NOT OK $n - main is not the commit GitHub checked"; failed=1; }
no_candidate 'a green release'
fi
unset CLAUDECODE
expect 'forgetting a password needs no grant' 0 'No password was kept' -- "$admin" here --forget
expect 'with no command it says how it is used' 2 'usage' -- "$admin" here

# The person's own keychain is as it was
if [ -n "$mac" ]; then
  [ "$(HOME=$real_home security default-keychain 2>/dev/null)" != "$(security default-keychain 2>/dev/null)" ] || { echo "NOT OK - the test ran on the person's own keychain"; failed=1; }
else
  kept_key=$HOME/.local/share/claudopus/keyring/claudopus-admin-gate/seal
  # (on Windows NTFS keeps no mode: the profile's own rights keep it the person's)
  [ -f "$kept_key" ] && { [ -n "$windows" ] || { [ "$(stat -c %a "$kept_key")" = 600 ] && [ "$(stat -c %a "$HOME/.local/share/claudopus/keyring")" = 700 ]; }; } && echo "ok - the gate's key is a file only this user reads, under the test's own home" || { echo "NOT OK - the gate's key file is missing or others can read it"; failed=1; }
fi
[ "$failed" = 0 ] && echo "admin.test.sh: all passed" || echo "admin.test.sh: FAILED"
exit "$failed"
