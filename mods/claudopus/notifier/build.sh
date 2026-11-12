#!/bin/sh
# Builds notifier/Claudopus.app from main.swift and the mod's icon: one app for Apple silicon and Intel, signed ad hoc.
# Needs Xcode or the Command Line Tools; only the author runs it, the built app is committed so installs need neither.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
app="$here/Claudopus.app"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

rm -rf "$app"
mkdir -p "$app/Contents/MacOS" "$app/Contents/Resources"
cp "$here/Info.plist" "$app/Contents/Info.plist"
for arch in arm64 x86_64; do
  swiftc -O -target "$arch-apple-macos12" -o "$work/Claudopus-$arch" "$here/main.swift"
done
lipo -create -output "$app/Contents/MacOS/Claudopus" "$work/Claudopus-arm64" "$work/Claudopus-x86_64"
swift "$here/icon.swift" "$here/../.claude-plugin/icon.png" "$work/Claudopus.iconset"
iconutil -c icns -o "$app/Contents/Resources/Claudopus.icns" "$work/Claudopus.iconset"
codesign --force --sign - --timestamp=none "$app"
codesign --verify --strict "$app"
echo "built $app"
