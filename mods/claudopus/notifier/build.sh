#!/bin/sh
# Builds the two notification apps from main.swift and the mod's icon: one program for Apple silicon and Intel, signed ad hoc.
#   Claudopus.app        the purple octopus, for work that finished or stopped
#   ClaudopusAsks.app    the amber octopus and the "needs you" sound (sound.py), for work that needs the person
# macOS takes a notification's icon from the app that sends it, so each colour is its own app.
# Needs Xcode or the Command Line Tools; only the author runs it, the built apps are committed so installs need neither.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

for arch in arm64 x86_64; do
  swiftc -O -target "$arch-apple-macos12" -o "$work/Claudopus-$arch" "$here/main.swift"
done
lipo -create -output "$work/Claudopus" "$work/Claudopus-arm64" "$work/Claudopus-x86_64"
python3 "$here/sound.py" "$work/needs-you.wav"

# build <app name> <bundle id> <display name> [<octopus colour> <sound file>]
build() {
  app="$here/$1.app"
  rm -rf "$app" "$work/icon.iconset"
  mkdir -p "$app/Contents/MacOS" "$app/Contents/Resources"
  cp "$here/Info.plist" "$app/Contents/Info.plist"
  plutil -replace CFBundleIdentifier -string "$2" "$app/Contents/Info.plist"
  plutil -replace CFBundleName -string "$3" "$app/Contents/Info.plist"
  plutil -replace CFBundleDisplayName -string "$3" "$app/Contents/Info.plist"
  cp "$work/Claudopus" "$app/Contents/MacOS/Claudopus"
  swift "$here/icon.swift" "$here/../.claude-plugin/icon.png" "$work/icon.iconset" ${4:-}
  iconutil -c icns -o "$app/Contents/Resources/Claudopus.icns" "$work/icon.iconset"
  if [ -n "${5:-}" ]; then cp "$5" "$app/Contents/Resources/"; fi
  codesign --force --sign - --timestamp=none "$app"
  codesign --verify --strict "$app"
  echo "built $app"
}
build Claudopus ai.claudopus.app Claudopus
# E5A50A is the amber of work that needs the person in the panel
build ClaudopusAsks ai.claudopus.asks "Claudopus Asks" E5A50A "$work/needs-you.wav"
