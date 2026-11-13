#!/bin/bash
# Tests the gate in bin/admin on a Mac: no admin command gets past it without a grant the hook sealed, however the runner is reached.
# Everything runs under a home folder of its own, with a keychain of its own made there, so the person's keychain, settings and
# kept passwords are never touched; no command is run as admin (each case stops at the gate, or at the password it does not have).
#   sh mods/claudopus/bin/admin.test.sh
set -u
[ "$(uname)" = Darwin ] || { echo "admin.test.sh: skipped, it needs a Mac's keychain"; exit 0; }
here=$(cd "$(dirname "$0")" && pwd)
admin=$here/admin
real_home=$HOME
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-admin-test.XXXXXX") || exit 1
trap 'rm -rf "$tmp"' EXIT
export HOME=$tmp/home
memory=$HOME/.claude/claudopus
mkdir -p "$HOME/Library/Keychains" "$HOME/Library/Preferences" "$memory/admin-grants"
keychain=$HOME/Library/Keychains/login.keychain-db
security create-keychain -p "" "$keychain" && security list-keychains -s "$keychain" && security default-keychain -s "$keychain" || { echo "admin.test.sh: no keychain could be made under $HOME"; exit 1; }
security unlock-keychain -p "" "$keychain" 2>/dev/null
# The key the hook would have made, and seals as it makes them
key=$(openssl rand -hex 32)
security add-generic-password -s claudopus-admin-gate -a seal -w "$key" || exit 1
seal() { printf '%s\n%s' "${2:-$key}" "$1" | perl -MDigest::SHA=hmac_sha256_hex -e '$k = <STDIN>; chomp $k; local $/; $m = <STDIN>; print hmac_sha256_hex($m, $k)'; }
now() { perl -e 'print time() * 1000'; }
# grant <name> <host> <command> [at] [seal]
grant() {
  local at=${4:-$(now)} s
  s=${5:-$(seal "$(printf 'grant\n%s\n%s\n%s\n%s' "$1" "$at" "$2" "$3")")}
  perl -MJSON::PP -e 'print JSON::PP->new->canonical->encode({id => $ARGV[0], host => $ARGV[1], command => $ARGV[2], at => $ARGV[3] + 0, seal => $ARGV[4]})' "$1" "$2" "$3" "$at" "$s" >"$memory/admin-grants/$1.json"
}
config() { printf '%s\n' "$1" >"$memory/config.json"; }
# Past the gate the runner has no kept password here: it asks for one under this test's own home, where no panel takes the request,
# and with nobody at the screen (as over SSH) it says so after its usual wait and ends 3
export SSH_CONNECTION=test
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
PAST='No password was typed'
config '{}'

expect 'no grant: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
printf '#!/bin/sh\nexec "%s" here "id -u"\n' "$admin" >"$tmp/wrapper.sh" && chmod +x "$tmp/wrapper.sh"
expect 'through a wrapper script: refused' 6 "$REFUSED" -- "$tmp/wrapper.sh"
ln -s "$admin" "$tmp/another-name"
expect 'through a link under another name: refused' 6 "$REFUSED" -- "$tmp/another-name" here 'id -u'
expect 'through another spelling of its path: refused' 6 "$REFUSED" -- "$here/../bin/./admin" here 'id -u'
expect 'through a shell and a variable: refused' 6 "$REFUSED" -- /bin/sh -c 'a=adm; "$1/${a}in" here "id -u"' sh "$here"
expect 'handed to bash as a script: refused' 6 "$REFUSED" -- /bin/bash "$admin" here 'id -u'
printf 'security() { echo %s; }\nperl() { echo "granted keep"; }\n' "$key" >"$tmp/env.sh"
expect 'with BASH_ENV set to replace its tools: refused' 6 "$REFUSED" -- env BASH_ENV="$tmp/env.sh" "$admin" here 'id -u'
expect 'with a perl option set to load other code: refused' 6 "$REFUSED" -- env PERL5OPT=-MNoSuchModuleAtAll "$admin" here 'id -u'

grant forged here 'id -u' "$(now)" "$(seal x not-the-key)"
expect 'a grant with a seal from another key: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
grant unsealed here 'id -u' "$(now)" none
expect 'a grant with a made-up seal: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
rm -f "$memory"/admin-grants/*
grant other here 'id -u'
expect 'a grant for another command: refused' 6 "$REFUSED" -- "$admin" here 'id -u; rm -rf /tmp/x'
expect 'a grant for another Mac: refused' 6 "$REFUSED" -- "$admin" m4 'id -u'
rm -f "$memory"/admin-grants/*
grant old here 'id -u' "$(($(now) - 300000))"
expect 'a grant from five minutes ago: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
rm -f "$memory"/admin-grants/*

grant good here 'id -u'
expect 'a sealed grant for this Mac and this command: past the gate' 3 "$PAST" -- "$admin" here 'id -u'
[ ! -e "$memory/admin-grants/good.json" ] && echo "ok - the grant was taken" || { echo "NOT OK - the grant was left"; failed=1; }
expect 'the same command again, its grant taken: refused' 6 "$REFUSED" -- "$admin" here 'id -u'

config '{"admin":"never"}'
expect '"never" with no seal: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nnever')" not-the-key)\"}"
expect '"never" sealed by another key: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nwork')")\"}"
expect '"never" with the seal of "work": refused' 6 "$REFUSED" -- "$admin" here 'id -u'
config "{\"admin\":\"work\",\"adminSealed\":\"$(seal "$(printf 'mode\nwork')")\"}"
expect '"work" as Config sealed it, with no grant: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
config "{\"admin\":\"never\",\"adminSealed\":\"$(seal "$(printf 'mode\nnever')")\"}"
expect '"never" as Config sealed it: past the gate with no grant' 3 "$PAST" -- "$admin" here 'id -u'
expect '"never" as Config sealed it, through a wrapper as before: past the gate' 3 "$PAST" -- "$tmp/wrapper.sh"

config '{"adminPassword":"macos"}'
expect 'macOS asks, no grant: refused' 6 "$REFUSED" -- "$admin" here 'id -u'
grant mac1 here 'id -u'
expect 'macOS asks, in a chat reached over SSH: nothing runs' 7 'which nobody sees from a chat reached over SSH' -- "$admin" here 'id -u'
grant mac2 m4 'id -u'
expect 'macOS asks, on another Mac: nothing runs' 7 'works only on this Mac' -- "$admin" m4 'id -u'

config '{}'
expect 'forgetting a password needs no grant' 0 'No password was kept' -- "$admin" here --forget
expect 'with no command it says how it is used' 2 'usage' -- "$admin" here

# The person's own keychain is as it was
[ "$(HOME=$real_home security default-keychain 2>/dev/null)" != "$(security default-keychain 2>/dev/null)" ] || { echo "NOT OK - the test ran on the person's own keychain"; failed=1; }
[ "$failed" = 0 ] && echo "admin.test.sh: all passed" || echo "admin.test.sh: FAILED"
exit "$failed"
