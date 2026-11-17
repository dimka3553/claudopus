#!/bin/bash
# Tests bin/pane-file's server: each part's page sends the pane on to the site with the part after the #, the parts make the
# file again byte for byte, and it answers nothing else. The JavaScript run in the pane is tried on the real sites, not here.
#   bash mods/claudopus/bin/pane-file.test.sh
set -u
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-pane-file-test.XXXXXX") || exit 1
trap 'kill $pid 2>/dev/null; rm -rf "$tmp"' EXIT
pid=
fails=0
ok() { printf 'ok   %s\n' "$1"; }
no() { printf 'FAIL %s\n' "$1"; fails=$((fails + 1)); }
within() { local n=0; while ! eval "$1"; do sleep 0.2; n=$((n + 1)); [ "$n" -ge $(($2 * 5)) ] && return 1; done; return 0; }

# A file of three parts (a part is 1.5 million characters of base64) and a small one with a space in its name
head -c 3000000 /dev/urandom > "$tmp/big.mp4"
printf 'hello' > "$tmp/small one.txt"

"$here/pane-file" >/dev/null 2>&1; [ $? = 2 ] && ok "with no file it says how it is used" || no "with no file it says how it is used"
"$here/pane-file" "$tmp/none.mp4" >/dev/null 2>&1; [ $? = 1 ] && ok "a missing file stops it" || no "a missing file stops it"

"$here/pane-file" "$tmp/big.mp4" "$tmp/small one.txt" > "$tmp/log" 2>&1 & pid=$!
within 'grep -q "^progress: 0/4 parts" "$tmp/log"' 10 && ok "it serves and says how far it has got" || no "it serves and says how far it has got: $(head -3 "$tmp/log")"
base=$(grep -o 'http://127\.0\.0\.1:[0-9]*' "$tmp/log" | head -1)
big=$(grep -o '^file [0-9a-f]*: big.mp4' "$tmp/log" | cut -d' ' -f2 | tr -d :)
small=$(grep -o '^file [0-9a-f]*: small one.txt' "$tmp/log" | cut -d' ' -f2 | tr -d :)
grep -q "^file $big: big.mp4, 3000000 bytes, 3 parts" "$tmp/log" && ok "it names each file with its size and parts" || no "it names each file with its size and parts"
grep -q "const ids=\[\"$big\", \"$small\"\]" "$tmp/log" && ok "the PUT script it prints names these files" || no "the PUT script it prints names these files"
grep -q "document.querySelector('\[aria-modal=true\] input\[type=file\]" "$tmp/log" && ok "the PUT script prefers the open dialog's file input, where a page has one behind it too" || no "the PUT script prefers the open dialog's file input"
grep -q "indexedDB.deleteDatabase('claudopus-files')" "$tmp/log" && ok "the PUT script clears the parts from the site once set" || no "the PUT script clears the parts from the site once set"
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
assert json.loads(urllib.parse.unquote(meta)) == {'name': 'small one.txt', 'type': 'text/plain', 'size': 5}, meta
PY
within 'grep -q "^progress: 4/4 parts" "$tmp/log"' 15 && ok "it counts the parts carried" || no "it counts the parts carried"

# Nothing else is answered: another path, an unknown file, a part past the end, a page that is not https
for q in "/x?id=$big&i=0&to=$to" "/go?id=000000000000&i=0&to=$to" "/go?id=$big&i=3&to=$to" "/go?id=$big&i=-1&to=$to" "/go?id=$big&i=0&to=http://www.example.com/" "/go?id=$big&i=0&to=javascript:alert(1)"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$base$q")
  [ "$code" = 404 ] && ok "it answers $q with nothing" || no "it answers $q with nothing (got $code)"
done
# Only this Mac reaches it
host=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | cut -d' ' -f1)
if [ -n "$host" ]; then
  port=${base##*:}
  curl -s -m 2 -o /dev/null "http://$host:$port/go?id=$big&i=0&to=$to" && no "it answers only on 127.0.0.1" || ok "it answers only on 127.0.0.1"
fi

[ $fails = 0 ] && echo "pane-file: all passed" || { echo "pane-file: $fails failed"; exit 1; }
