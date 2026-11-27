#!/bin/bash
# Tests bin/run-it for real with harmless commands, everything under a folder of its own:
#   bash mods/claudopus/bin/run-it.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-run-it-test.XXXXXX") && tmp=$(cd "$tmp" && pwd) || exit 1
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
trap 'pkill -f "$tmp/" 2>/dev/null; gone' EXIT
run=$here/run-it
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
within() { local n=0; while ! eval "$1"; do sleep 0.2; n=$((n + 1)); [ "$n" -ge $(($2 * 5)) ] && return 1; done; return 0; }
mkdir -p "$tmp/folder" "$tmp/home"
# The person's shell is a plain sh here, in a home of its own
export HOME=$tmp/home SHELL=/bin/sh ENV=
export CLAUDECODE=1 CLAUDE_CODE_ENTRYPOINT=cli ANTHROPIC_BASE_URL=http://example.invalid MCP_TIMEOUT=5 GIT_EDITOR=true KEEP_ME=kept

# Exactly the command, in its folder, with Claude Code's marks gone and everything else kept; its exit written last
out=$tmp/a.log
g=$("$run" start 'echo "in $PWD"; echo "cc=${CLAUDECODE-} ep=${CLAUDE_CODE_ENTRYPOINT-} api=${ANTHROPIC_BASE_URL-} mcp=${MCP_TIMEOUT-} ed=${GIT_EDITOR-} keep=$KEEP_ME"; echo "it'"'"'s; quoted"; exit 3' "$out" "$tmp/folder")
[[ "$g" =~ ^[0-9]+$ ]] && ok "start prints the run's group" || no "start prints the run's group (got: $g)"
within 'grep -q "^claudopus-exit" "$out"' 10 || no "the run ends"
grep -qx "in $tmp/folder" "$out" && ok "it runs in its folder" || no "it runs in its folder: $(cat "$out")"
grep -qx 'cc= ep= api= mcp= ed= keep=kept' "$out" && ok "Claude Code's marks are taken out, the rest kept" || no "Claude Code's marks are taken out: $(cat "$out")"
grep -qx "it's; quoted" "$out" && ok "the command runs as written, quotes and all" || no "the command runs as written: $(cat "$out")"
[ "$(tail -n 1 "$out")" = 'claudopus-exit 3' ] && ok "its exit is its output's last line" || no "its exit is its output's last line: $(tail -n 1 "$out")"
"$run" alive "$g" "$out" && no "an ended run is not alive" || ok "an ended run is not alive"

# A folder that is gone: nothing runs, and its end says so
out=$tmp/b.log
g=$("$run" start 'echo ran' "$out" "$tmp/gone")
within 'grep -q "^claudopus-exit" "$out"' 10 && ! grep -qx ran "$out" && [ "$(tail -n 1 "$out")" = 'claudopus-exit 1' ] && ok "a missing folder runs nothing" || no "a missing folder runs nothing: $(cat "$out")"

# A long one: alive while it runs; stop with another run's output file leaves it be; stop ends its whole group and says so
out=$tmp/c.log
g=$("$run" start "echo started; $tmp/folder/long" "$out" "$tmp/folder")
printf '#!/bin/sh\nsleep 30 &\necho $! > "%s/folder/sleep.pid"\nwait\n' "$tmp" > "$tmp/folder/long"; chmod +x "$tmp/folder/long"
within 'grep -q started "$out"' 10
within '[ -s "$tmp/folder/sleep.pid" ]' 10
"$run" alive "$g" "$out" && ok "a running run is alive" || no "a running run is alive"
"$run" stop "$g" "$tmp/other.log"
"$run" alive "$g" "$out" && ok "a stop for another output file stops nothing" || no "a stop for another output file stops nothing"
"$run" stop "$g" "$out"
within '! "$run" alive "$g" "$out"' 10 && ok "stop ends the run" || no "stop ends the run"
within '! kill -0 "$(cat "$tmp/folder/sleep.pid")" 2> /dev/null' 10 && ok "stop ends what the run started too" || no "stop ends what the run started too"
if command -v pgrep > /dev/null 2>&1; then within '! pgrep -g "$g" > /dev/null' 10 && ok "stop ends the run's whole group" || no "stop ends the run's whole group"; fi
[ "$(tail -n 1 "$out")" = 'claudopus-exit 143 stopped' ] && ok "a stopped run says it was stopped" || no "a stopped run says it was stopped: $(tail -n 1 "$out")"

# The person's zsh, as on a Mac, reads its start files; stopped, nothing more of the command line runs (an interactive zsh ignores
# TERM and would go on to the next command)
if [ -x /bin/zsh ]; then
  printf 'export FROM_RC=yes\n' > "$tmp/home/.zshrc"
  out=$tmp/d.log
  g=$(SHELL=/bin/zsh ZDOTDIR=$tmp/home "$run" start 'echo "rc=${FROM_RC-}"; sleep 40 | cat; echo after' "$out" "$tmp/folder")
  within 'grep -q "^rc=" "$out"' 10
  grep -qx 'rc=yes' "$out" && ok "zsh reads the person's .zshrc" || no "zsh reads the person's .zshrc: $(cat "$out")"
  "$run" stop "$g" "$out"
  within '! "$run" alive "$g" "$out"' 10 && ok "a stopped zsh run ends" || no "a stopped zsh run ends"
  perl -e 'select(undef, undef, undef, 1.5)'
  ! grep -qx after "$out" && [ "$(tail -n 1 "$out")" = 'claudopus-exit 143 stopped' ] && ok "stopped, nothing more of its command line runs" || no "stopped, nothing more of its command line runs: $(cat "$out")"
fi

# On Windows a stop ends the Windows programs the run started too, which Git's kill never reaches
case "$(uname -s)" in
  MINGW* | MSYS* | CYGWIN*)
    out=$tmp/w.log
    g=$("$run" start "echo started; ping -n 60 127.0.0.1 > /dev/null & echo \$! > '$tmp/folder/ping.pid'; wait" "$out" "$tmp/folder")
    within '[ -s "$tmp/folder/ping.pid" ]' 10
    # (its Windows number is Git's fork of the shell until ping itself has started in it)
    within 'w=$(cat "/proc/$(cat "$tmp/folder/ping.pid")/winpid" 2> /dev/null) && tasklist //FI "PID eq $w" //NH 2> /dev/null | grep -qi ping' 10 && ok "a Windows program the run started runs" || no "a Windows program the run started runs (pid $w)"
    "$run" stop "$g" "$out"
    within '! tasklist //FI "PID eq $w" //NH 2> /dev/null | grep -qi ping' 10 && ok "stop ends the Windows programs the run started" || no "stop ends the Windows programs the run started"
    ;;
  *) echo "skip the Windows programs' stop: this is not Git's bash on Windows" ;;
esac

# A stop that comes after the run ended on its own leaves its own end
out=$tmp/e.log
g=$("$run" start 'exit 0' "$out" "$tmp/folder")
within 'grep -q "^claudopus-exit" "$out"' 10
"$run" stop "$g" "$out"
[ "$(tail -n 1 "$out")" = 'claudopus-exit 0' ] && ok "a late stop leaves the run's own end" || no "a late stop leaves the run's own end: $(tail -n 1 "$out")"

[ $fails = 0 ] && echo "all run-it tests passed" || echo "$fails run-it tests FAILED"
exit $fails
