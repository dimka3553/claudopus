#!/bin/sh
# Fails when a committed file of the two notification apps, or one they are built from, differs from its SHA-256 in
# checksums.txt (written by build.sh), or when an app holds a file the record does not name. Runs in CI and in the release's checks.
set -eu
cd "$(dirname "$0")"
# shasum on a Mac and most Linux, sha256sum where perl's shasum is not (Git for Windows)
sha256() { if command -v shasum >/dev/null 2>&1; then shasum -a 256 "$@"; else sha256sum "$@"; fi; }
grep -v '^#' checksums.txt | sha256 -c - >/dev/null || { grep -v '^#' checksums.txt | sha256 -c - | grep -v ': OK$'; echo "notifier: a file differs from checksums.txt; run build.sh and commit what it makes" >&2; exit 1; }
if [ "$(find Claudopus.app ClaudopusAsks.app -type f | LC_ALL=C sort)" != "$(grep -v '^#' checksums.txt | sed 's/^[0-9a-f]*  //' | grep '\.app/' | LC_ALL=C sort)" ]; then
  echo "notifier: the apps hold files checksums.txt does not name, or lack some it names; run build.sh" >&2
  exit 1
fi
echo "notifier: both apps match checksums.txt"
