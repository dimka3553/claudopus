#!/bin/bash
# Tests bin/catch-up on made-up chat records, in a folder of its own, with another Mac played by a second home that a stand-in ssh
# reaches. Nothing real is read or changed.
#   bash mods/claudopus/bin/catch-up.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-catch-up-test.XXXXXX") || exit 1
trap '[ -n "${CATCH_UP_TEST_KEEP:-}" ] || rm -rf "$tmp"' EXIT
mem=$tmp/memory
projects=$tmp/projects
other=$tmp/other
mkdir -p "$mem/words" "$projects/-p-app/c1/subagents" "$projects/-p-app" "$projects/ssh-remote1" "$other/.claude/claudopus/words" "$tmp/bin"
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
check() { if eval "$2"; then ok "$1"; else no "$1"; fi; }
old() { touch -t 202001010000 "$@"; }
export CLAUDOPUS_CATCH_UP_EVERY=0 CLAUDOPUS_CATCH_UP_QUIET=60
run() { "$here/catch-up" "$mem" "$projects" "$@" > "$tmp/out" 2>&1; }
# The other Mac: what ssh would run there runs here with that Mac's home
cat > "$tmp/bin/ssh" <<'EOF'
#!/bin/bash
while [ $# -gt 0 ] && [ "$1" != "--" ]; do shift; done
shift 2
if command -v zsh > /dev/null; then HOME=$FAKE_HOME exec zsh -c "$1"; else HOME=$FAKE_HOME exec /bin/sh -c "$1"; fi
EOF
chmod +x "$tmp/bin/ssh"
export FAKE_HOME=$other

u() { printf '{"type":"user","sessionId":"%s","timestamp":"%s","origin":{"kind":"%s"},"message":{"role":"user","content":%s}}\n' "$1" "$2" "$3" "$4"; }
a() { printf '{"type":"assistant","sessionId":"%s","timestamp":"%s","message":{"role":"assistant","content":%s}}\n' "$1" "$2" "$3"; }

# c1: a chat Claudopus never saved, made from chat c0 (its first line is c0's), with a key, a program's message, a notice and tools
{
  u c0 2026-11-01T00:00:00Z human '"copied from the chat this one was made from"'
  u c1 2026-11-02T00:00:00Z human '"Please look at the VAT numbers. My key is sk-ant-api03-abcdefgh1234567890XYZ and password=hunter2hunter2, KAGGLE_KEY=0123abcd4567ef89, file https://cdn.example.com/a.csv?Policy=eyJTdGF0ZW1lbnQiOlt7&Signature=Zm9vYmFy&Key-Pair-Id=K1, client GOCSPX-abcdefghijklmnopqrstuvwx12 and npm-run-build-2024-11"'
  a c1 2026-11-02T00:00:01Z '[{"type":"text","text":"Looking now."},{"type":"tool_use","id":"t1","name":"mcp__sbos__get_report","input":{}},{"type":"tool_use","id":"t2","name":"mcp__sbos__secrets","input":{}},{"type":"tool_use","id":"t3","name":"Bash","input":{"command":"ls"}},{"type":"tool_use","id":"t4","name":"mcp__claudopus__recall","input":{}},{"type":"tool_use","id":"t7","name":"mcp__terminal__run_in_terminal","input":{}},{"type":"tool_use","id":"t8","name":"mcp__vercel__list_projects","input":{}}]'
  u c1 2026-11-02T00:00:02Z human '[{"type":"tool_result","tool_use_id":"t1","content":[{"type":"text","text":"Report: VAT owed in Ruritania is 4711 crowns"}]},{"type":"tool_result","tool_use_id":"t2","content":"THE-SECRET-VALUE"},{"type":"tool_result","tool_use_id":"t3","content":"bash output here"},{"type":"tool_result","tool_use_id":"t4","content":"recall output here"},{"type":"tool_result","tool_use_id":"t7","content":"terminal output here"},{"type":"tool_result","tool_use_id":"t8","content":"projects: [{\"key\":\"SESSION_SECRET\",\"value\":\"s3cr3tvalue99\"}]"}]'
  a c1 2026-11-02T00:00:03Z '[{"type":"tool_use","id":"t5","name":"Write","input":{"file_path":"/x/vat-table.md","content":"| country | owed |\n| Ruritania | 4711 |"}},{"type":"tool_use","id":"t6","name":"Write","input":{"file_path":"/x/code.ts","content":"const codeWritten = 1"}}]'
  u c1 2026-11-02T00:00:04Z task-notification '"<task-notification>done</task-notification>"'
  printf '{"type":"user","sessionId":"c1","timestamp":"2026-11-02T00:00:05Z","origin":null,"promptSource":"sdk","message":{"role":"user","content":"a message a program sent"}}\n'
  u c1 2026-11-02T00:00:05Z plugin '"a message the mod sent"'
  u c1 2026-11-02T00:00:05Z observer '"an observer digest"'
  u c1 2026-11-02T00:00:05Z slack-ping '"pinged from slack"'
  u c1 2026-11-02T00:00:05Z human '"settings {\\\"key\\\":\\\"SESSION_SECRET\\\",\\\"value\\\":\\\"esc4ped99\\\"} env {\\\"DATABASE_PASSWORD\\\":\\\"hunter22hunter\\\"} header {\\\"Authorization\\\": \\\"Basic dXNlcjpwYXNzd29yZA==\\\"} hook https://hooks.slack.com/services/T0001/B0002/XyZ123abc password=abcd1 and kept: max_tokens=100000 input_tokens: 123456 PWD=/Users/sam primary_key: user_id tokenizer=bert-base-uncased {\\\"name\\\":\\\"monkey\\\",\\\"value\\\":\\\"banana\\\"}"'
  a c1 2026-11-02T00:00:06Z '[{"type":"text","text":"The VAT owed is 4711 crowns."}]'
} > "$projects/-p-app/c1.jsonl"
# c2: a chat that saved its own words
u c2 2026-11-03T00:00:00Z human '"typed in c2"' > "$projects/-p-app/c2.jsonl"
printf '## 2026-11-03T00:00:00.000Z\ntyped in c2\n\n' > "$mem/words/c2.md"
# A helper of c1: asked, then handed back
{
  u c1 2026-11-02T01:00:00Z human '"Find the VAT rules for Ruritania"'
  a c1 2026-11-02T01:00:05Z '[{"type":"text","text":"thinking aloud"},{"type":"tool_use","id":"h1","name":"SubagentHandback","input":{"message":"Ruritania charges VAT from the first sale"}}]'
} > "$projects/-p-app/c1/subagents/agent-a1.jsonl"
printf '{"agentType":"claudopus:reader","description":"Read the VAT rules"}' > "$projects/-p-app/c1/subagents/agent-a1.meta.json"
# A chat another Mac runs, its copy kept here by the app
u remote1 2026-11-04T00:00:00Z human '"typed on the other mac"' > "$projects/ssh-remote1/remote1.jsonl"
# c3: a chat still being written
u c3 2026-11-05T00:00:00Z human '"still typing"' > "$projects/-p-app/c3.jsonl"
# An old words file holding a key, saved before keys were hidden
printf '## 2026-10-01T00:00:00.000Z\nuse ghp_abcdefghijklmnopqrstuvwxyz0123456789\n\n' > "$mem/words/old.md"
old "$projects"/-p-app/*.jsonl "$projects"/-p-app/c1/subagents/* "$projects"/ssh-remote1/*
touch "$projects/-p-app/c3.jsonl"

run
w1=$(cat "$mem/words/c1.md" 2>/dev/null)
k1=$(cat "$mem/work/c1.md" 2>/dev/null)
check "a chat Claudopus never saved gets its words, as the chat writes them" '[[ "$w1" == *"## 2026-11-02T00:00:00Z"$'"'"'\n'"'"'"Please look at the VAT numbers."* && "$w1" == *"### Claude 2026-11-02T00:00:06Z"$'"'"'\n'"'"'"The VAT owed is 4711 crowns."* ]]'
check "a program's message is saved and marked" '[[ "$w1" == *"(sent by a program)"$'"'"'\n'"'"'"a message a program sent"* ]]'
check "a message from Slack is saved, marked" '[[ "$w1" == *"(from Slack)"$'"'"'\n'"'"'"pinged from slack"* ]]'
check "keys in other shapes are hidden, ordinary words that look like them are kept" '[[ "$w1" != *"esc4ped99"* && "$w1" != *"hunter22hunter"* && "$w1" != *"dXNlcjpw"* && "$w1" != *"XyZ123abc"* && "$w1" != *"abcd1"* && "$w1" == *"max_tokens=100000 input_tokens: 123456 PWD=/Users/sam primary_key: user_id tokenizer=bert-base-uncased"* && "$w1" == *"monkey\\\",\\\"value\\\":\\\"banana"* ]]'
check "notices, an observer's digest, the mod's own messages, tool results and the chat it was made from are not its words" '[[ "$w1" != *"task-notification"* && "$w1" != *"the mod sent"* && "$w1" != *"observer digest"* && "$w1" != *"bash output"* && "$w1" != *"copied from the chat"* && "$w1" != *"4711 crowns\""* ]]'
check "keys and passwords in a chat are hidden" '[[ "$w1" != *"sk-ant-api03"* && "$w1" != *"hunter2"* && "$w1" == *"[key hidden]"* && "$w1" == *"password=[hidden]"* && "$w1" == *"KAGGLE_KEY=[hidden]"* && "$w1" == *"a.csv?Policy=[hidden]&Signature=[hidden]&Key-Pair-Id=K1"* && "$w1" != *"0123abcd"* && "$w1" != *"GOCSPX"* && "$w1" == *"npm-run-build-2024-11"* ]]'
check "a chat that saved its words keeps them as they were" '[ "$(cat "$mem/words/c2.md")" = "$(printf "## 2026-11-03T00:00:00.000Z\ntyped in c2")" ]'
check "what a connected service returned and a document written are kept as work" '[[ "$k1" == *"sbos get_report returned"*"VAT owed in Ruritania is 4711 crowns"* && "$k1" == *"## Wrote /x/vat-table.md"*"| Ruritania | 4711 |"* ]]'
check "key tools, Claudopus's own, commands and code are not kept" '[[ "$k1" != *"THE-SECRET-VALUE"* && "$k1" != *"recall output"* && "$k1" != *"bash output"* && "$k1" != *"codeWritten"* && "$k1" != *"terminal output"* && "$k1" == *"vercel list_projects returned"* && "$k1" != *"s3cr3tvalue"* ]]'
check "a helper's instructions and report are kept under its chat" '[[ "$k1" == *"## Helper 2026-11-02T01:00:00Z Read the VAT rules (claudopus:reader, agent-a1)"*"Asked:"$'"'"'\n'"'"'"Find the VAT rules for Ruritania"*"Reported 2026-11-02T01:00:05Z:"$'"'"'\n'"'"'"Ruritania charges VAT from the first sale"* ]]'
check "another Mac's chats and a chat still being written are left" '[ ! -e "$mem/words/remote1.md" ] && [ ! -e "$mem/words/c3.md" ]'
check "a words file saved before keys were hidden is hidden once" '! grep -q ghp_ "$mem/words/old.md" && grep -q "use \[key hidden\]" "$mem/words/old.md"'

# Read again: only what was added since, and a chat whose words it wrote stops being written once the chat writes them itself
before=$(cat "$mem/words/c1.md")
a c1 2026-11-06T00:00:00Z '[{"type":"text","text":"a later reply"}]' >> "$projects/-p-app/c1.jsonl"
old "$projects/-p-app/c1.jsonl" "$projects/-p-app/c3.jsonl"
run
check "a record read again adds only what came since" '[ "$(cat "$mem/words/c1.md")" = "$before"$'"'"'\n\n'"'"'"### Claude 2026-11-06T00:00:00Z"$'"'"'\n'"'"'"a later reply" ] && [ "$(grep -c "is 4711 crowns" "$mem/words/c1.md")" = 1 ]'
check "a chat quiet now is read" 'grep -q "still typing" "$mem/words/c3.md"'
printf '{"type":"user","sessionId":"c3","timestamp":"2026-11-05T01:00:00Z","origin":{"kind":"human"},"message":{"role":"user","content":"half a li' >> "$projects/-p-app/c3.jsonl"
old "$projects/-p-app/c3.jsonl"
run
printf 'ne, then whole"}}\n' >> "$projects/-p-app/c3.jsonl"
old "$projects/-p-app/c3.jsonl"
run
check "a line still being written is read whole once it ends" 'grep -q "half a line, then whole" "$mem/words/c3.md"'
# A run while another holds the lock does nothing and leaves that lock; one too soon after the last does nothing
mkdir "$mem/locks/catch-up"
u c4 2026-11-08T00:00:00Z human '"held back"' > "$projects/-p-app/c4.jsonl"
old "$projects/-p-app/c4.jsonl"
run
check "a run while another runs leaves it, and its lock, alone" '[ -d "$mem/locks/catch-up" ] && [ ! -e "$mem/words/c4.md" ]'
rmdir "$mem/locks/catch-up"
CLAUDOPUS_CATCH_UP_EVERY=3600 run
check "a run too soon after the last does nothing" '[ ! -e "$mem/words/c4.md" ]'
run
check "and the next one in time does its work" 'grep -q "held back" "$mem/words/c4.md"'
printf '## 2026-11-07T00:00:00.000Z\nthe chat saves itself now\n\n' >> "$mem/words/c1.md"
a c1 2026-11-07T00:00:01Z '[{"type":"text","text":"reply the chat saved"}]' >> "$projects/-p-app/c1.jsonl"
old "$projects/-p-app/c1.jsonl"
run
check "words the chat now writes itself are not written twice" '! grep -q "reply the chat saved" "$mem/words/c1.md"'

# A run over another projects folder, or one that is missing, leaves what was read of this one as it was
run_other() { "$here/catch-up" "$mem" "$tmp/no-projects" > "$tmp/out" 2>&1; }
w_before=$(cat "$mem/work/c1.md")
run_other
old "$projects/-p-app/c1/subagents/agent-a1.jsonl"
touch -t 202001010000 "$projects/-p-app/c1/subagents/agent-a1.jsonl"
run
check "a run over another projects folder makes no one read again" '[ "$(cat "$mem/work/c1.md")" = "$w_before" ]'

# The other Mac: its words come here, this Mac's go there, the longer copy wins, and no name a command could read crosses
printf 'words of a chat on the other mac\n' > "$other/.claude/claudopus/words/theirs.md"
printf '## 2026-11-03T00:00:00.000Z\n' > "$other/.claude/claudopus/words/c2.md"
printf 'x\n' > "$other/.claude/claudopus/words/bad;name.md"
# a file both Macs hold that differ is left as each has it, a link never comes, and a key in what comes is hidden
printf 'a different chat, longer than this Mac\x27s own copy of it\n' > "$other/.claude/claudopus/words/c3.md"
printf 'secret\n' > "$tmp/private.txt"
ln -s "$tmp/private.txt" "$other/.claude/claudopus/words/link.md"
printf 'their token ghp_abcdefghijklmnopqrstuvwxyz0123456789\n' > "$other/.claude/claudopus/words/keyed.md"
PATH="$tmp/bin:$PATH" run othermac
check "the other Mac's words come here" '[ "$(cat "$mem/words/theirs.md" 2>/dev/null)" = "words of a chat on the other mac" ]'
check "this Mac's words and work go there, the longer copy replacing the shorter" '[ "$(cat "$other/.claude/claudopus/words/c2.md")" = "$(cat "$mem/words/c2.md")" ] && grep -q "4711" "$other/.claude/claudopus/work/c1.md"'
check "a name no file of words could have never crosses" '[ ! -e "$mem/words/bad;name.md" ]'
check "a file that differs on the two Macs is left as each has it" 'grep -q "still typing" "$mem/words/c3.md" && grep -q "a different chat" "$other/.claude/claudopus/words/c3.md"'
check "a link on the other Mac never comes" '[ ! -e "$mem/words/link.md" ] && [ ! -L "$mem/words/link.md" ]'
check "a key in what the other Mac sends is hidden" 'grep -q "their token \[key hidden\]" "$mem/words/keyed.md"'
check "nothing that crossed is left waiting inside memory" '[ -z "$(find "$mem" -name "in.*")" ]'

if [ "$fails" = 0 ]; then echo "catch-up: all passed"; else echo "catch-up: $fails failed"; cat "$tmp/out"; exit 1; fi
