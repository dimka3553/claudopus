#!/bin/bash
# Tests bin/revive with stand-ins: processes for chats', their beat files, and settings files of their own. Nothing real is changed;
# everything is under a folder of its own.
#   bash mods/claudopus/bin/revive.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-revive-test.XXXXXX") || exit 1
trap 'pkill -f "$tmp/" 2>/dev/null; [ -n "${REVIVE_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
# The watcher run from a copy of its own, so ending it ends no other
cp "$here/revive" "$tmp/revive"
revive=$tmp/revive
mem=$tmp/memory
mkdir -p "$mem/keep"
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
within() { local n=0; while ! eval "$1"; do sleep 0.2; n=$((n + 1)); [ "$n" -ge $(($2 * 5)) ] && return 1; done; return 0; }
export CLAUDOPUS_REVIVE_STEP=1 CLAUDOPUS_REVIVE_QUIET=2 CLAUDOPUS_REVIVE_WOKE_QUIET=2 CLAUDOPUS_REVIVE_GAP=2 CLAUDOPUS_REVIVE_TRIES=2 CLAUDOPUS_REVIVE_RELOAD_WAIT=2 CLAUDOPUS_REVIVE_IDLE=60 CLAUDOPUS_REVIVE_SLOW_QUIET=10000000000 CLAUDOPUS_REVIVE_SLOW_CLEAR=3
# A chat's process: runs until its file is removed
cat > "$tmp/chat" <<'EOF'
#!/bin/bash
while [ -e "$0.run" ]; do sleep 0.2; done
EOF
chmod +x "$tmp/chat"
touch "$tmp/chat.run"
"$tmp/chat" & chat=$!
settings=$tmp/settings.json
printf '{\n  "theme": "dark",\n  "enabledPlugins": {\n    "claudopus@claudopus": true,\n    "claudopus@other": true,\n    "other@else": true\n  },\n  "hooks": {}\n}\n' > "$settings"
revived() { grep -c '"revived"' "$1" 2>/dev/null | tr -d ' '; }
beat() { printf '%s\t%s\t%s\n' "$1" "$2" "$3" > "$mem/keep/$4.beat"; }
stale() { touch -t 202001010000 "$mem/keep/$1.beat"; }
tries() { wc -l < "$mem/keep/$1.revived" 2>/dev/null | tr -d ' '; }
# A chat beating as Claudopus does, far more often than QUIET, so a busy machine never makes a beating chat look quiet: beating
# <beat file> starts it, still <beat file> stops it, and no touch comes after
beating() { : > "$1.on"; while [ -e "$1.on" ]; do touch "$1"; sleep 0.2; done & beater=$!; }
still() { rm -f "$1.on"; wait "$beater" 2>/dev/null; }

# A chat beating: nothing changes
beat "$chat" claudopus@claudopus "$settings" s1
"$revive" "$mem" &
watcher=$!
beating "$mem/keep/s1.beat"; sleep 4; still "$mem/keep/s1.beat"
[ "$(revived "$settings")" = 0 ] && ok "a chat that beats is left alone" || no "a chat that beats is left alone"
# A second watcher of the same copy leaves the one running
"$revive" "$mem" & second=$!
within '! kill -0 $second 2>/dev/null' 3 && kill -0 "$watcher" 2>/dev/null && ok "one watcher at a time" || no "one watcher at a time"

# Quiet while its process runs: only its own copy's setting changes, every other key as it was (and then it is said, so the log is
# waited for)
stale s1
within '[ "$(revived "$settings")" = 1 ]' 8 && ok "a quiet beat changes its own copy's setting" || no "a quiet beat changes its own copy's setting"
grep -q '"theme": "dark"' "$settings" && grep -q '"other@else": true' "$settings" && grep -q '"hooks": {}' "$settings" && ! grep -A3 '"claudopus@other"' "$settings" | grep -q revived && ok "the other settings and copies are kept" || no "the other settings and copies are kept"
within 'grep -q "chat s1: quiet" "$mem/keep/revive.log"' 5 && ok "it says what it did" || no "it says what it did"
# Still quiet: tried again, then left for as long as it stays quiet, however long that is
within '[ -e "$mem/keep/s1.gaveup" ]' 10 && ok "a chat that does not come back is left after its tries" || no "a chat that does not come back is left after its tries"
n=$(tries s1); sleep 6
[ "$(tries s1)" = "$n" ] && [ "$n" = 2 ] && ok "and is not tried again while it stays quiet" || no "and is not tried again while it stays quiet"
# Back (its beat moves): its tries start afresh
beating "$mem/keep/s1.beat"
within '[ ! -e "$mem/keep/s1.gaveup" ] && [ ! -e "$mem/keep/s1.revived" ]' 5 && ok "a chat that comes back has its tries afresh" || no "a chat that comes back has its tries afresh"
still "$mem/keep/s1.beat"; rm -f "$mem/keep/s1.beat"

# A chat whose own load beats again after a change was never off, only slow: it is left alone, so the other chats are not reloaded
# again and again, until a newer load beats or it stays quiet SLOW_QUIET
beatl() { printf '%s\t%s\t%s\n%s\n' "$1" "$2" "$3" "$5" > "$mem/keep/$4.beat"; }
slowset=$tmp/slow.json
printf '{ "enabledPlugins": { "claudopus@claudopus": true } }\n' > "$slowset"
beatl "$chat" claudopus@claudopus "$slowset" s8 load-a; stale s8
within '[ "$(revived "$slowset")" = 1 ]' 8 && ok "a quiet load is changed for once" || no "a quiet load is changed for once"
within 'grep -q "chat s8: quiet" "$mem/keep/revive.log"' 5
c1=$(grep -c "chat s8: quiet" "$mem/keep/revive.log")
beating "$mem/keep/s8.beat"
within 'grep -q "chat s8: beats again from the same load" "$mem/keep/revive.log"' 5 && ok "the same load beating again is seen as slow, not off" || no "the same load beating again is seen as slow, not off"
still "$mem/keep/s8.beat"; stale s8; sleep 6
[ "$(grep -c "chat s8: quiet" "$mem/keep/revive.log")" = "$c1" ] && ok "a slow load quiet again changes nothing" || no "a slow load quiet again changes nothing"
# nor after a few seconds of steady beats: the mark lasts SLOW_KEEP from its last stall, so a chat slow on and off is not reloaded
# at every short stall
beating "$mem/keep/s8.beat"; sleep 5; still "$mem/keep/s8.beat"
stale s8; sleep 5
[ "$(grep -c "chat s8: quiet" "$mem/keep/revive.log")" = "$c1" ] && ok "a chat slow on and off is not changed at its next short stall" || no "a chat slow on and off is not changed at its next short stall"
beatl "$chat" claudopus@claudopus "$slowset" s8 load-b; sleep 2; stale s8
within '[ "$(grep -c "chat s8: quiet" "$mem/keep/revive.log")" -gt "$c1" ]' 8 && ok "a newer load quiet is changed again" || no "a newer load quiet is changed again"
rm -f "$mem/keep/s8.beat"

# A copy loaded from a folder has its own key, with no entry in enabledPlugins
beat "$chat" claudopus@inline "$settings" s2
stale s2
within 'grep -q "claudopus@inline" "$settings"' 8 && ok "a copy loaded from a folder is brought back by its own key" || no "a copy loaded from a folder is brought back by its own key"
rm -f "$mem/keep/s2.beat"

# Each beat names its own settings file
other=$tmp/other.json
printf '{ "enabledPlugins": { "claudopus@claudopus": true } }\n' > "$other"
before=$(revived "$settings")
beat "$chat" claudopus@claudopus "$other" s3
stale s3
within '[ "$(revived "$other")" = 1 ]' 8 && [ "$(revived "$settings")" = "$before" ] && ok "a chat's own settings file is the one changed" || no "a chat's own settings file is the one changed"
rm -f "$mem/keep/s3.beat"

# A file with comments, or a number too long to carry, is left as it is, and said once
printf '{\n  // mine\n  "enabledPlugins": { "claudopus@claudopus": true }\n}\n' > "$tmp/comments.json"
printf '{ "enabledPlugins": { "claudopus@claudopus": true }, "big": 12345678901234567890 }\n' > "$tmp/big.json"
cp "$tmp/comments.json" "$tmp/comments.was"; cp "$tmp/big.json" "$tmp/big.was"
beat "$chat" claudopus@claudopus "$tmp/comments.json" s4; stale s4
beat "$chat" claudopus@claudopus "$tmp/big.json" s5; stale s5
within '[ -e "$mem/keep/s4.gaveup" ] && [ -e "$mem/keep/s5.gaveup" ]' 10 && cmp -s "$tmp/comments.json" "$tmp/comments.was" && cmp -s "$tmp/big.json" "$tmp/big.was" && ok "a file it cannot carry whole is left as it was" || no "a file it cannot carry whole is left as it was"
sleep 4
[ "$(grep -c 'chat s4' "$mem/keep/revive.log")" = 1 ] && ok "and said once" || no "and said once"
rm -f "$mem/keep/s4.beat" "$mem/keep/s5.beat"

# A chat whose process ended is forgotten and nothing changed for it
rm -f "$tmp/chat.run"; wait "$chat" 2>/dev/null
beat "$chat" claudopus@claudopus "$settings" s6; stale s6
before=$(revived "$settings")
within '[ ! -e "$mem/keep/s6.beat" ]' 5 && [ "$(revived "$settings")" = "$before" ] && ! grep -q "chat s6" "$mem/keep/revive.log" && ok "a chat whose process ended is forgotten" || no "a chat whose process ended is forgotten"

# Turned off in the settings: nothing is changed
touch "$tmp/chat.run"; "$tmp/chat" & chat=$!
printf '{ "enabledPlugins": { "claudopus@claudopus": false } }\n' > "$tmp/off.json"
beat "$chat" claudopus@claudopus "$tmp/off.json" s7; stale s7
within 'grep -q "chat s7: quiet .* turned off" "$mem/keep/revive.log"' 8 && [ "$(revived "$tmp/off.json")" = 0 ] && ok "Claudopus turned off is left off" || no "Claudopus turned off is left off"

# A watcher whose own file an update rewrote since it started (one path for every version) gives way to one started from it now
kill -0 "$watcher" 2>/dev/null || no "the first watcher still runs"
touch -t 203001010000 "$revive"
"$revive" "$mem" & fresh=$!
within '! kill -0 $watcher 2>/dev/null' 5 && kill -0 "$fresh" 2>/dev/null && [ "$(head -n 1 "$mem/keep/revive.pid")" = "$fresh" ] && ok "a watcher of an older file at the same path gives way" || no "a watcher of an older file at the same path gives way"
watcher=$fresh

# A newer copy's watcher takes over from an older one's
cp "$revive" "$tmp/revive-newer"
"$tmp/revive-newer" "$mem" & newer=$!
within '! kill -0 $watcher 2>/dev/null' 5 && kill -0 "$newer" 2>/dev/null && ok "a newer copy's watcher takes over" || no "a newer copy's watcher takes over"
kill "$newer" 2>/dev/null
rm -f "$tmp/chat.run"

# A fresh load is given RELOAD_WAIT to beat before another try, so a Mac slow to start one is not reloaded again and again
mem3=$tmp/memory3; mkdir -p "$mem3/keep"
cp "$tmp/chat" "$tmp/chat3"; touch "$tmp/chat3.run"; "$tmp/chat3" & chat3=$!
set3=$tmp/set3.json
printf '{ "enabledPlugins": { "claudopus@claudopus": true } }\n' > "$set3"
printf '%s\t%s\t%s\n%s\n' "$chat3" claudopus@claudopus "$set3" load-r > "$mem3/keep/r1.beat"; touch -t 202001010000 "$mem3/keep/r1.beat"
CLAUDOPUS_REVIVE_RELOAD_WAIT=30 "$revive" "$mem3" & w4=$!
within 'grep -q "chat r1: quiet" "$mem3/keep/revive.log" 2>/dev/null' 8; sleep 6
[ "$(grep -c "chat r1: quiet" "$mem3/keep/revive.log")" = 1 ] && [ ! -e "$mem3/keep/r1.gaveup" ] && ok "a fresh load has time to beat before another try" || no "a fresh load has time to beat before another try"
kill "$w4" 2>/dev/null; rm -f "$tmp/chat3.run"

# A slow load, on a watcher of its own with short limits: one quiet SLOW_QUIET has its tries, one that goes SLOW_KEEP without a
# stall is as any other again, a beat with no load line leaves the mark, a change not made is not taken for one, and the last change outlives
# its watcher
mem2=$tmp/memory2; mkdir -p "$mem2/keep"
cp "$tmp/chat" "$tmp/chat2"; touch "$tmp/chat2.run"; "$tmp/chat2" & chat2=$!
set2=$tmp/set2.json
printf '{ "enabledPlugins": { "claudopus@claudopus": true } }\n' > "$set2"
beat2() { printf '%s\t%s\t%s\n%s\n' "$chat2" claudopus@claudopus "$2" "$3" > "$mem2/keep/$1.beat"; }
stale2() { touch -t 202001010000 "$mem2/keep/$1.beat"; }
log2() { grep -c "chat $1: $2" "$mem2/keep/revive.log" 2>/dev/null | tr -d ' '; }
CLAUDOPUS_REVIVE_SLOW_QUIET=4 CLAUDOPUS_REVIVE_SLOW_KEEP=3 "$revive" "$mem2" & w2=$!
# Marked slow: changed once, then beats from the same load
beat2 t1 "$set2" load-1; stale2 t1
within '[ "$(log2 t1 quiet)" = 1 ]' 8; beating "$mem2/keep/t1.beat"
within '[ "$(log2 t1 "beats again from the same load")" = 1 ]' 5 || no "a slow chat is marked"
still "$mem2/keep/t1.beat"
# A beat half written, with no load line, leaves the mark
printf '%s\t%s\t%s\n' "$chat2" claudopus@claudopus "$set2" > "$mem2/keep/t1.beat"; sleep 1
[ "$(head -n 1 "$mem2/keep/t1.slow" 2>/dev/null)" = load-1 ] && ok "a beat with no load line leaves the slow mark" || no "a beat with no load line leaves the slow mark"
# Quiet past SLOW_QUIET: its tries, as any other's (a slow process is when the engine switches an add-on off), then left
beat2 t1 "$set2" load-1; stale2 t1
within 'grep -q "chat t1: Claudopus did not come back after 2 tries" "$mem2/keep/revive.log"' 15 && [ "$(log2 t1 quiet)" = 3 ] && ok "a slow chat quiet past SLOW_QUIET has its tries" || no "a slow chat quiet past SLOW_QUIET has its tries"
# SLOW_KEEP without a stall: the mark lapses, and a switch-off then is tried as any other's, at once
beating "$mem2/keep/t1.beat"
within '[ "$(log2 t1 "no stall for")" = 1 ] && [ ! -e "$mem2/keep/t1.slow" ]' 10 && ok "a slow chat with no stall for SLOW_KEEP is as any other again" || no "a slow chat with no stall for SLOW_KEEP is as any other again"
still "$mem2/keep/t1.beat"
n=$(log2 t1 quiet); stale2 t1
within '[ "$(log2 t1 quiet)" -ge $((n + 2)) ]' 12 && ok "and has its tries again" || no "and has its tries again"
rm -f "$mem2/keep/t1.beat"
# A change not made (Claudopus turned off) is not taken for one
printf '{ "enabledPlugins": { "claudopus@claudopus": false } }\n' > "$tmp/off2.json"
beat2 t2 "$tmp/off2.json" load-2; stale2 t2
within 'grep -q "chat t2: quiet .* turned off" "$mem2/keep/revive.log"' 8 && [ ! -e "$mem2/keep/t2.changed" ] && ok "a change not made leaves no mark of one" || no "a change not made leaves no mark of one"
rm -f "$mem2/keep/t2.beat"
# The last change outlives its watcher: a new one keeps to the gap after it
kill "$w2" 2>/dev/null; wait "$w2" 2>/dev/null
beat2 t3 "$set2" load-3; stale2 t3
printf '%s\n' "$(date +%s)" > "$mem2/keep/revive.lastchange"
CLAUDOPUS_REVIVE_GAP=30 "$revive" "$mem2" & w3=$!
sleep 4
[ "$(log2 t3 quiet)" = 0 ] && ok "a new watcher keeps to the gap after the last change" || no "a new watcher keeps to the gap after the last change"
kill "$w3" 2>/dev/null
rm -f "$tmp/chat2.run"

[ "$fails" = 0 ] && echo "revive: all passed" || echo "revive: $fails failed"
exit "$fails"
