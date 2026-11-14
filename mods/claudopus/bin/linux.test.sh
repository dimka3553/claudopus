#!/bin/bash
# Tests what stands in on Linux for what only a Mac has: bin/keyring's files for the keychain, bin/sips for macOS's sips, and
# bin/notify with no desktop. Everything runs under a home folder of its own. On a Mac it is skipped: there the keychain and sips
# are the Mac's own, which admin.test.sh and the plugin's tests cover.
#   bash mods/claudopus/bin/linux.test.sh
set -u
[ "$(uname)" = Linux ] || { echo "linux.test.sh: skipped, it tests what stands in for a Mac's own tools on Linux"; exit 0; }
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/claudopus-linux-test.XXXXXX") || exit 1
trap 'rm -rf "$tmp"' EXIT
export HOME=$tmp/home
mkdir -p "$HOME"
unset XDG_DATA_HOME DISPLAY WAYLAND_DISPLAY
failed=0
ok() { if eval "$2"; then echo "ok - $1"; else echo "NOT OK - $1"; failed=1; fi; }
k=$here/keyring
store=$HOME/.local/share/claudopus/keyring

ok 'nothing kept: get ends 1' '! "$k" get test-service one >/dev/null'
ok 'a value is kept from stdin' 'printf "%s\n" "s3cret value" | "$k" set test-service one "Test"'
ok 'and read back as it was' '[ "$("$k" get test-service one)" = "s3cret value" ]'
ok 'has says it is kept' '"$k" has test-service one'
ok 'its file only this user reads' '[ "$(stat -c %a "$store/test-service/one")" = 600 ] && [ "$(stat -c %a "$store")" = 700 ] && [ "$(stat -c %a "$store/test-service")" = 700 ]'
ok 'a second value replaces it' 'printf "%s\n" other | "$k" set test-service one "Test" && [ "$("$k" get test-service one)" = other ]'
printf '%s\n' two | "$k" set test-service two Test
ok 'list names the accounts, never values' '[ "$("$k" list test-service | tr "\n" " ")" = "one two " ]'
ok 'delete removes it' '"$k" delete test-service one && ! "$k" has test-service one'
ok 'delete of none ends 1' '! "$k" delete test-service one'
ok 'a name that climbs out of its folder is refused' '! "$k" get .. one 2>/dev/null && ! "$k" get test-service ../x 2>/dev/null && ! "$k" get test-service "a/b" 2>/dev/null'
ok 'the value never shows in a command line' '! grep -rq "s3cret" "$tmp/home/.bash_history" 2>/dev/null'

# bin/secret keeps and hides a key through bin/keyring
printf '%s\n' "abcd1234" | "$k" set claudopus-secret TEST_KEY "Claudopus: TEST_KEY"
ok 'secret --list names a kept key' '[ "$("$here/secret" --list)" = TEST_KEY ]'
ok 'secret runs a command with the key and hides it in what it prints' '[ "$("$here/secret" TEST_KEY here "echo got \$TEST_KEY")" = "got [hidden TEST_KEY]" ]'
ok 'secret --forget removes it' '"$here/secret" TEST_KEY --forget >/dev/null && [ -z "$("$here/secret" --list)" ]'

# bin/notify with no desktop: 3, and its status says so
ok 'notify with no desktop ends 3' '"$here/notify" --title T --text X; [ $? = 3 ]'
ok 'notify --status says unavailable' '[ "$("$here/notify" --status)" = unavailable ]'

# bin/sips: the calls the mod makes, answered with ImageMagick where it is installed
if command -v convert >/dev/null 2>&1 || command -v magick >/dev/null 2>&1; then
  im=$(command -v magick || command -v convert)
  "$im" -size 300x120 xc:red "$tmp/wide.png"
  "$im" -size 40x40 xc:none -fill blue -draw "circle 20,20 20,5" "$tmp/clear.png"
  s=$here/sips
  ok 'sips -g says the size' '"$s" -g pixelWidth -g pixelHeight "$tmp/wide.png" | grep -q "pixelWidth: 300" && "$s" -g pixelWidth -g pixelHeight "$tmp/wide.png" | grep -q "pixelHeight: 120"'
  ok 'sips -g hasAlpha: no for a plain picture, yes for one with see-through parts' '"$s" -g hasAlpha "$tmp/wide.png" | grep -q "hasAlpha: no" && "$s" -g hasAlpha "$tmp/clear.png" | grep -q "hasAlpha: yes"'
  ok 'sips -Z makes a small JPEG copy' '"$s" -Z 100 -s format jpeg -s formatOptions 60 "$tmp/wide.png" --out "$tmp/small.jpg" && "$s" -g pixelWidth -g pixelHeight "$tmp/small.jpg" | grep -q "pixelWidth: 100" && head -c 3 "$tmp/small.jpg" | od -An -tx1 | grep -q "ff d8 ff"'
  ok 'sips --resampleWidth sizes it to a width' '"$s" --resampleWidth 150 -s format png "$tmp/wide.png" --out "$tmp/half.png" && "$s" -g pixelHeight "$tmp/half.png" | grep -q "pixelHeight: 60"'
  ok 'sips --padToHeightWidth pads it in place' '"$s" --padToHeightWidth 62 150 "$tmp/half.png" && "$s" -g pixelHeight "$tmp/half.png" | grep -q "pixelHeight: 62"'
  ok 'sips -c cuts a band' '"$s" -c 20 150 --cropOffset 11 0 -s format jpeg -s formatOptions 70 "$tmp/half.png" --out "$tmp/band.jpg" && "$s" -g pixelWidth -g pixelHeight "$tmp/band.jpg" | grep -q "pixelHeight: 20"'
  ok 'sips of a missing picture fails' '! "$s" -g pixelWidth "$tmp/none.png" 2>/dev/null'
else
  echo "ok - sips skipped: ImageMagick is not installed here"
fi

[ "$failed" = 0 ] && echo "linux.test.sh: all passed" || echo "linux.test.sh: FAILED"
exit "$failed"
