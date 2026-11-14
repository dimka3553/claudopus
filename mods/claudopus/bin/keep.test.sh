#!/bin/bash
# Tests bin/keep with stand-ins: a process for the chat's, a `claude` that records what it is asked, a process for the app's
# start of the chat again. Nothing real is started or stopped; everything is under a folder of its own.
#   bash mods/claudopus/bin/keep.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
keep=$here/keep
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-keep-test.XXXXXX") || exit 1
trap 'pkill -f "$tmp/" 2>/dev/null; [ -n "${KEEP_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
mem=$tmp/memory
mkdir -p "$mem/keep" "$tmp/bin" "$tmp/ccd-cli" "$tmp/work"
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
# Waits up to $2 seconds for a command to succeed
within() { local n=0; while ! eval "$1"; do sleep 0.2; n=$((n + 1)); [ "$n" -ge $(($2 * 5)) ] && return 1; done; return 0; }

# The stand-in for claude: --bg prints what Claude Code prints and records its arguments; agents lists the copy as working
# until stopped; stop records the id
cat > "$tmp/bin/claude" <<EOF
#!/bin/bash
case "\$1" in
  --bg) printf '%s\n' "\$*" > "$tmp/started"; printf 'backgrounded · 1a2b3c4d · kept\n'; touch "$tmp/listed" ;;
  agents) [ -e "$tmp/listed" ] && printf '[\n  {\n    "id": "1a2b3c4d",\n    "status": "busy",\n    "state": "working"\n  }\n]\n' || printf '[]\n' ;;
  stop) printf '%s\n' "\$2" >> "$tmp/stopped"; rm -f "$tmp/listed" ;;
esac
EOF
chmod +x "$tmp/bin/claude"
# The stand-in for the chat's process, with the app's arguments; it runs until its file is removed
cat > "$tmp/engine" <<'EOF'
#!/bin/bash
while [ -e "$0.run" ]; do sleep 0.2; done
EOF
chmod +x "$tmp/engine"
cp "$tmp/engine" "$tmp/ccd-cli/engine"
export CLAUDOPUS_KEEP_CLAUDE=$tmp/bin/claude CLAUDOPUS_KEEP_STEP=1 CLAUDOPUS_KEEP_GRACE=2 CLAUDOPUS_KEEP_REST=10
run() { # <session> <count>: a chat's process with that much at work, and its keeper; prints the process's pid
  touch "$tmp/engine.run"
  "$tmp/engine" --model=claude-opus-5-5 --effort=high --permission-mode=auto --setting-sources=user,project,local --plugin-dir=$tmp/work --resume=$1 > /dev/null 2>&1 &
  local p=$!
  printf '{"count":%s,"ids":["a1"],"title":"Face from video"}' "$2" > "$mem/keep/$1.json"
  bash "$keep" "$p" "$1" "$tmp/work" "$mem" > /dev/null 2>&1 &
  echo "$p"
}
end() { rm -f "$tmp/engine.run"; }

# 1. Ended with nothing at work: not kept
s=00000000-0000-0000-0000-000000000001
run $s 0 > /dev/null; sleep 1.5; end
within "grep -q 'nothing at work' '$mem/keep/$s.log' 2>/dev/null" 10 && [ ! -e "$tmp/started" ] && ok "a process that ends with nothing at work is not kept" || no "a process that ends with nothing at work is not kept"

# 2. Ended with work at work, and the app starts the chat again within the grace: not kept
s=00000000-0000-0000-0000-000000000002
run $s 1 > /dev/null; sleep 1.5; end; sleep 0.5
touch "$tmp/ccd-cli/engine.run"; "$tmp/ccd-cli/engine" --resume=$s & app=$!
within "grep -q 'started again by the app' '$mem/keep/$s.log' 2>/dev/null" 10 && [ ! -e "$tmp/started" ] && ok "the app starting the chat again within the minute keeps it in the app" || no "the app starting the chat again within the minute keeps it in the app"
rm -f "$tmp/ccd-cli/engine.run"; wait $app 2>/dev/null

# 3. Ended with work at work and no one starts it: started again here with the same model, effort, mode, sources and plugins
s=00000000-0000-0000-0000-000000000003
run $s 1 > /dev/null; sleep 1.5; end
if within "[ -e '$tmp/started' ]" 15; then
  args=$(cat "$tmp/started")
  case "$args" in *"--bg --resume $s -n Face from video (kept on this Mac) --remote-control Face from video (kept on this Mac) --model claude-opus-5-5 --effort high --permission-mode auto --setting-sources user,project,local --plugin-dir $tmp/work"*) ok "cut off with work at work, the chat is started again here as it ran" ;; *) no "cut off with work at work, the chat is started again here as it ran: $args" ;; esac
else no "cut off with work at work, the chat is started again here as it ran"; fi
grep -q '"cutAt":[0-9]*,"movedAt":[0-9]*,"copy":"1a2b3c4d"' "$mem/keep/$s.state" && ok "its state says when it was cut off and when it went on" || no "its state says when it was cut off and when it went on: $(cat "$mem/keep/$s.state")"

# 4. The app starts the chat again while the copy runs: the copy is stopped at once, and the state says when
touch "$tmp/ccd-cli/engine.run"; "$tmp/ccd-cli/engine" --resume=$s & app=$!
within "grep -q 1a2b3c4d '$tmp/stopped' 2>/dev/null" 5 && grep -q '"backAt":' "$mem/keep/$s.state" && ok "the app's start of the chat stops the copy within seconds" || no "the app's start of the chat stops the copy within seconds"
rm -f "$tmp/ccd-cli/engine.run"; wait $app 2>/dev/null

# 5. The copy's work is done: it is stopped once it has rested
s=00000000-0000-0000-0000-000000000005
rm -f "$tmp/started" "$tmp/stopped"
run $s 1 > /dev/null; sleep 1.5; end
within "[ -e '$tmp/started' ]" 15
printf '{"count":0,"ids":[],"title":"Face from video"}' > "$mem/keep/$s.json"
within "grep -q 'its work is done' '$mem/keep/$s.log' 2>/dev/null" 40 && grep -q 1a2b3c4d "$tmp/stopped" && ok "a copy whose work is done is stopped after its rest" || no "a copy whose work is done is stopped after its rest"

# 6. A reload of the mod in the same process starts no second keeper
s=00000000-0000-0000-0000-000000000006
p=$(run $s 1); sleep 0.5
bash "$keep" "$p" "$s" "$tmp/work" "$mem" & second=$!
sleep 1; kill -0 $second 2>/dev/null && no "a second keeper for the same process leaves" || ok "a second keeper for the same process leaves"
end

# 7. The mod asks for a hand-over (the app's sign-in lapsed): the process is ended and the chat goes on here at once
s=00000000-0000-0000-0000-000000000007
rm -f "$tmp/started" "$tmp/stopped"
export CLAUDOPUS_KEEP_GRACE=30
p=$(run $s 1); sleep 1.5
printf '%s' "$p" > "$mem/keep/$s.handover"
within "[ -e '$tmp/started' ]" 8 && ! kill -0 "$p" 2>/dev/null && grep -q 'sign-in the app lent the chat lapsed' "$mem/keep/$s.log" && ok "a lapsed sign-in ends the process and the chat goes on here without the minute's wait" || no "a lapsed sign-in ends the process and the chat goes on here without the minute's wait"
end

# 8. A hand-over left behind for another process ends no healthy one
s=00000000-0000-0000-0000-000000000008
printf '12345' > "$mem/keep/$s.handover"
p=$(run $s 1); sleep 3
kill -0 "$p" 2>/dev/null && [ ! -e "$mem/keep/$s.handover" ] && ok "a hand-over left for another process is dropped and ends nothing" || no "a hand-over left for another process is dropped and ends nothing"
end

[ "$fails" -eq 0 ] && echo "keep.test.sh: all passed" || { echo "keep.test.sh: $fails failed"; exit 1; }
