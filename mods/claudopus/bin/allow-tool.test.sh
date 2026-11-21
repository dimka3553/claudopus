#!/bin/bash
# Tests bin/allow-tool for real in a home of its own, at a terminal made by script(1) as the person's would be:
#   bash mods/claudopus/bin/allow-tool.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-allow-tool-test.XXXXXX") && tmp=$(cd "$tmp" && pwd) || exit 1
trap 'rm -rf "$tmp"' EXIT
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
export HOME=$tmp/home
unset CLAUDE_CONFIG_DIR CLAUDECODE
mkdir -p "$HOME/.claude"
file=$HOME/.claude/settings.json
rule=mcp__5a3e9d85-c502-4788-adea-8783a1c00ccc__confirm_cost
# At a terminal, as the person types it: a pseudo-terminal of Python's own, on macOS and Linux alike
atty() { python3 -I -c 'import os, pty, sys; sys.exit(os.waitstatus_to_exitcode(pty.spawn(sys.argv[1:])))' "$@" </dev/null; }
printf '{\n  "model": "opus",\n  "permissions": {\n    "allow": ["Read(//x/**)"],\n    "deny": ["Bash(rm -rf /)"]\n  }\n}\n' >"$file"
before=$(cat "$file")

# Inside Claude Code, or with no terminal, it changes nothing
out=$(CLAUDECODE=1 atty "$here/allow-tool" "$rule" 2>&1); rc=$?
[ $rc = 1 ] && [ "$(cat "$file")" = "$before" ] && printf %s "$out" | grep -q 'only you can run this' && ok 'refused inside Claude Code' || no "refused inside Claude Code ($rc: $out)"
out=$("$here/allow-tool" "$rule" </dev/null 2>&1); rc=$?
[ $rc = 1 ] && [ "$(cat "$file")" = "$before" ] && ok 'refused with no terminal' || no "refused with no terminal ($rc: $out)"
# Only one connector tool by its full name: no server-wide star, no other tool, nothing else
for bad in 'mcp__srv__*' 'Bash(rm -rf /)' 'mcp__srv' 'mcp__a b__c' "$rule\"]}"; do
  out=$(atty "$here/allow-tool" "$bad" 2>&1); rc=$?
  [ $rc = 2 ] && [ "$(cat "$file")" = "$before" ] && ok "refused the name $bad" || no "refused the name $bad ($rc: $out)"
done
# At the person's terminal: the rule is added, and everything else stays as it was, in its order
out=$(atty "$here/allow-tool" "$rule" 2>&1); rc=$?
got=$(python3 -I -c 'import json,sys; d=json.load(open(sys.argv[1])); print(list(d), d["model"], d["permissions"]["allow"], d["permissions"]["deny"])' "$file")
[ $rc = 0 ] && [ "$got" = "['model', 'permissions'] opus ['Read(//x/**)', '$rule'] ['Bash(rm -rf /)']" ] && printf %s "$out" | grep -q "Added $rule" && ok 'added the rule, keeping the rest' || no "added the rule ($rc: $out / $got)"
# Twice: it is there once
out=$(atty "$here/allow-tool" "$rule" 2>&1); rc=$?
[ $rc = 0 ] && [ "$(grep -c "$rule" "$file")" = 1 ] && printf %s "$out" | grep -q 'already allowed' && ok 'added once' || no "added once ($rc: $out)"
# No settings file yet: one is made with only the rule; a file that is not JSON is left alone
rm -f "$file"
atty "$here/allow-tool" "$rule" >/dev/null 2>&1
[ "$(python3 -I -c 'import json,sys; print(json.load(open(sys.argv[1])))' "$file")" = "{'permissions': {'allow': ['$rule']}}" ] && ok 'made the settings file' || no 'made the settings file'
printf '{ not json' >"$file"
out=$(atty "$here/allow-tool" "$rule" 2>&1); rc=$?
[ $rc = 1 ] && [ "$(cat "$file")" = '{ not json' ] && ok 'left a broken file alone' || no "left a broken file alone ($rc: $out)"
[ "$fails" = 0 ] && echo "all allow-tool tests passed" || { echo "$fails allow-tool tests failed"; exit 1; }
