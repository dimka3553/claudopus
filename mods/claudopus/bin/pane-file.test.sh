#!/bin/bash
# Tests bin/pane-file's server: each part's page sends the pane on to the site with the part after the #, the parts make the
# file again byte for byte, and it answers nothing else. The JavaScript run in the pane is tried on the real sites, not here.
#   bash mods/claudopus/bin/pane-file.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-pane-file-test.XXXXXX") || exit 1
trap '[ -n "$pid" ] && { kill $pid 2>/dev/null; wait $pid 2>/dev/null; }; rm -rf "$tmp"' EXIT
pid=
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
within() { local n=0; while ! eval "$1"; do sleep 0.2; n=$((n + 1)); [ "$n" -ge $(($2 * 5)) ] && return 1; done; return 0; }

# A file of three parts (a part is 1.5 million characters of base64) and a small one with a space in its name
head -c 3000000 /dev/urandom > "$tmp/big.mp4"
printf 'hello' > "$tmp/small one.txt"

use=$("$here/pane-file" 2>&1); [ $? = 2 ] && case $use in "Puts files"*"sends nothing over the network itself.") true ;; *) false ;; esac && ok "with no file it says how it is used, and only that" || no "with no file it says how it is used, and only that"
"$here/pane-file" "$tmp/none.mp4" >/dev/null 2>&1; [ $? = 1 ] && ok "a missing file stops it" || no "a missing file stops it"
python3 -c 'import sys; open(sys.argv[1], "wb").truncate(251 * 1024 * 1024)' "$tmp/huge.mp4"
"$here/pane-file" "$tmp/huge.mp4" 2>&1 | grep -q "more than the 250 MB" && ok "a file over 250 MB stops it" || no "a file over 250 MB stops it"
rm -f "$tmp/huge.mp4"

"$here/pane-file" "$tmp/big.mp4" "$tmp/small one.txt" > "$tmp/log" 2>&1 & pid=$!
within 'grep -q "^progress: 0/4 parts sent" "$tmp/log"' 10 && ok "it serves and says how far it has got" || no "it serves and says how far it has got: $(head -3 "$tmp/log")"
base=$(grep -o 'http://127\.0\.0\.1:[0-9]*' "$tmp/log" | head -1)
big=$(grep -o '^file [0-9a-f]*: big.mp4' "$tmp/log" | cut -d' ' -f2 | tr -d :)
small=$(grep -o '^file [0-9a-f]*: small one.txt' "$tmp/log" | cut -d' ' -f2 | tr -d :)
grep -q "^file $big: big.mp4, 3000000 bytes, 3 parts" "$tmp/log" && ok "it names each file with its size and parts" || no "it names each file with its size and parts"
grep -q "const ids=\[\"$big\"\]" "$tmp/log" && grep -q "const ids=\[\"$small\"\]" "$tmp/log" && ok "it prints a PUT script for each file" || no "it prints a PUT script for each file"
[ ${#big} = 32 ] && [ "$big" != "$(shasum -a 256 "$tmp/big.mp4" | cut -c1-32)" ] && ok "a file's id is random, not from its bytes" || no "a file's id is random, not from its bytes: $big"
grep -q "input\[type=file\]')\].find(e=>shown(e.closest(" "$tmp/log" && grep -q "w<30&&!(inp=boxed())" "$tmp/log" && ok "the PUT script prefers the file input of the dialog that shows, and waits for it, where a page has one behind it too" || no "the PUT script prefers the file input of the dialog that shows"
grep -q "h!==meta.sha" "$tmp/log" && ok "the PUT script refuses a file whose SHA-256 differs" || no "the PUT script refuses a file whose SHA-256 differs"
grep -q "for(const k of gone)t.objectStore('parts').delete(k)" "$tmp/log" && ! grep -q "^(async.*deleteDatabase" "$tmp/log" && ok "the PUT script clears only its own files' parts from the site once set" || no "the PUT script clears only its own files' parts"
grep -q "location.replace('$base/go?id=" "$tmp/log" && ok "the CARRY script it prints comes back to this server" || no "the CARRY script it prints comes back to this server"

# Each part's page, and what its address after the # holds (read with python3: a shell's patterns take minutes on 2 MB)
to='https://www.example.com/robots.txt'
python3 -I - "$base" "$big" "$small" "$to" "$tmp/big.mp4" <<'PY' && ok "each part's page sends the pane to the site with the part, and the parts make the file again byte for byte" || no "each part's page sends the pane to the site with the part, and the parts make the file again byte for byte"
import base64, json, re, sys, urllib.parse, urllib.request
base, big, small, to, path = sys.argv[1:]
def dest(fid, i):
    page = urllib.request.urlopen('%s/go?id=%s&i=%d&to=%s' % (base, fid, i, urllib.parse.quote(to, safe=''))).read().decode()
    return json.loads(re.search(r'location\.replace\((".*")\)</script>', page).group(1))
joined = ''
for i in range(3):
    d = dest(big, i)
    head = '%s#cpf:%s:%d:3:' % (to, big, i)
    assert d.startswith(head), d[:120]
    meta, part = d[len(head):].split(':', 1)
    joined += part
assert base64.b64decode(joined) == open(path, 'rb').read()
d = dest(small, 0)
meta = d[len('%s#cpf:%s:0:1:' % (to, small)):].split(':', 1)[0]
import hashlib
assert json.loads(urllib.parse.unquote(meta)) == {'name': 'small one.txt', 'type': 'text/plain', 'size': 5, 'sha': hashlib.sha256(b'hello').hexdigest()}, meta
PY
within 'grep -q "^progress: 4/4 parts sent" "$tmp/log"' 15 && ok "it counts the parts sent" || no "it counts the parts sent"

# Nothing else is answered: another path, an unknown file, a part past the end, a page that is not https
for q in "/go?id=$big&i=0&to=https://user:pw@www.example.com/" "/x?id=$big&i=0&to=$to" "/go?id=000000000000&i=0&to=$to" "/go?id=$big&i=3&to=$to" "/go?id=$big&i=-1&to=$to" "/go?id=$big&i=0&to=http://www.example.com/" "/go?id=$big&i=0&to=javascript:alert(1)"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$base$q")
  [ "$code" = 404 ] && ok "it answers $q with nothing" || no "it answers $q with nothing (got $code)"
done
# No page reaches it by another name, frames it, or ends its script with what it puts in the address
code=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: other.example' "$base/go?id=$small&i=0&to=$to")
[ "$code" = 404 ] && ok "it answers another Host with nothing" || no "it answers another Host with nothing (got $code)"
curl -s -D - -o /dev/null "$base/go?id=$small&i=0&to=$to" | grep -qi '^X-Frame-Options: DENY' && ok "its pages are never shown inside another page" || no "its pages are never shown inside another page"
page=$(curl -s "$base/go?id=$small&i=0&to=https://x.example/%3C/script%3E%3Cb%3Einjected%3C/b%3E")
case $page in *'</script><b>'*) no "the address in its page cannot end the script" ;; *'\u003c/script>'*) ok "the address in its page cannot end the script" ;; *) no "the address in its page cannot end the script: no page" ;; esac
# Only this Mac reaches it
host=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | cut -d' ' -f1)
if [ -n "$host" ]; then
  port=${base##*:}
  curl -s -m 2 -o /dev/null "http://$host:$port/go?id=$big&i=0&to=$to" && no "it answers only on 127.0.0.1" || ok "it answers only on 127.0.0.1"
fi

[ $fails = 0 ] && echo "pane-file: all passed" || { echo "pane-file: $fails failed"; exit 1; }
