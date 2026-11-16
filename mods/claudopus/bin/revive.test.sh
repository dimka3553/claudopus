#!/bin/bash
# Tests bin/revive with stand-ins: a process for a chat's, its beat file, and a settings file of its own. Nothing real is changed;
# everything is under a folder of its own.
#   bash mods/claudopus/bin/revive.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
revive=$here/revive
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-revive-test.XXXXXX") || exit 1
trap 'pkill -f "$tmp/" 2>/dev/null; [ -n "${REVIVE_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
mem=$tmp/memory
mkdir -p "$mem/keep"
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
within() { local n=0; while ! eval "$1"; do sleep 0.2; n=$((n + 1)); [ "$n" -ge $(($2 * 5)) ] && return 1; done; return 0; }
field() { /usr/bin/python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(json.dumps(eval(sys.argv[2])))' "$1" "$2" 2>/dev/null || /usr/bin/perl -MJSON::PP -e 'local $/; open(my $h, "<", $ARGV[0]); my $d = decode_json(<$h>); print encode_json([$d->{pluginConfigs}{"claudopus\@claudopus"}{options}{revived} // ""])' "$1"; }
export CLAUDOPUS_REVIVE_STEP=1 CLAUDOPUS_REVIVE_QUIET=2 CLAUDOPUS_REVIVE_GAP=3 CLAUDOPUS_REVIVE_TRIES=2 CLAUDOPUS_REVIVE_IDLE=30
# A chat's process: runs until its file is removed
cat > "$tmp/chat" <<'EOF'
#!/bin/bash
while [ -e "$0.run" ]; do sleep 0.2; done
EOF
chmod +x "$tmp/chat"
touch "$tmp/chat.run"
"$tmp/chat" & chat=$!
settings=$tmp/settings.json
printf '{\n  "theme": "dark",\n  "enabledPlugins": {\n    "claudopus@claudopus": true,\n    "other@else": true\n  },\n  "hooks": {}\n}\n' > "$settings"
revived() { grep -c '"revived"' "$settings" 2>/dev/null | tr -d ' '; }

# A chat beating: nothing changes
printf '%s\n' "$chat" > "$mem/keep/s1.beat"
"$revive" "$mem" "$settings" &
watcher=$!
for k in 1 2 3 4; do sleep 1; touch "$mem/keep/s1.beat"; done
[ "$(revived)" = 0 ] && ok "a chat that beats is left alone" || no "a chat that beats is left alone"
# A second watcher leaves the one running
"$revive" "$mem" "$settings" & second=$!
within '! kill -0 $second 2>/dev/null' 3 && ok "one watcher at a time" || no "one watcher at a time"

# Quiet while its process runs: Claudopus's own setting changes, every other key as it was
within '[ "$(revived)" = 1 ]' 8 && ok "a quiet beat changes Claudopus's own setting" || no "a quiet beat changes Claudopus's own setting"
grep -q '"theme": "dark"' "$settings" && grep -q '"other@else": true' "$settings" && grep -q '"hooks": {}' "$settings" && ok "the other settings are kept" || no "the other settings are kept"
grep -q "chat s1: quiet" "$mem/keep/revive.log" && [ -s "$mem/keep/s1.revived" ] && ok "it says what it did" || no "it says what it did"
# Still quiet: a second try after the gap, then no more for a while
within '[ "$(wc -l < "$mem/keep/s1.revived" | tr -d " ")" = 2 ]' 8 && ok "tried again after the gap" || no "tried again after the gap"
sleep 5
[ "$(wc -l < "$mem/keep/s1.revived" | tr -d ' ')" = 2 ] && grep -q "did not come back" "$mem/keep/revive.log" && ok "a chat that does not come back is left after its tries" || no "a chat that does not come back is left after its tries"

# A chat whose process ended has its beat removed and nothing changed for it
rm -f "$tmp/chat.run"
wait "$chat" 2>/dev/null
printf '%s\n' "$chat" > "$mem/keep/s2.beat"
touch -t 202001010000 "$mem/keep/s2.beat"
within '[ ! -e "$mem/keep/s2.beat" ]' 5 && ok "a chat whose process ended is forgotten" || no "a chat whose process ended is forgotten"
grep -q "chat s2" "$mem/keep/revive.log" && no "nothing done for an ended chat" || ok "nothing done for an ended chat"
kill "$watcher" 2>/dev/null

# Turned off in the settings: nothing is changed
touch "$tmp/chat.run"
"$tmp/chat" & chat=$!
printf '{ "enabledPlugins": { "claudopus@claudopus": false } }\n' > "$settings"
rm -f "$mem/keep/"*.beat "$mem/keep/"*.revived "$mem/keep/"*.gaveup
printf '%s\n' "$chat" > "$mem/keep/s3.beat"
touch -t 202001010000 "$mem/keep/s3.beat"
"$revive" "$mem" "$settings" & watcher=$!
within 'grep -q "chat s3: quiet .* turned off" "$mem/keep/revive.log"' 8 && [ "$(revived)" = 0 ] && ok "Claudopus turned off is left off" || no "Claudopus turned off is left off"
kill "$watcher" 2>/dev/null
rm -f "$tmp/chat.run"

[ "$fails" = 0 ] && echo "revive: all passed" || echo "revive: $fails failed"
exit "$fails"
