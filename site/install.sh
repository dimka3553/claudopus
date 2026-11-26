#!/bin/sh
# Installs Claudopus for Claude Code and switches it on, in one line in Terminal:
#   curl -fsSL https://www.claudopus.ai/install.sh | sh
# It finds Claude Code (the Claude desktop app's own copy, or `claude` in a terminal), makes sure git is there (on a Mac,
# Apple's command line tools, which it offers to install and waits for), then runs Claude Code's own steps: add the
# claudopus marketplace from GitHub (dimka3553/claudopus), install claudopus@claudopus for you (user scope) and switch it on.
# Claude Code merges both into ~/.claude/settings.json and keeps everything else in it. It then sets subagentPromptCacheTtl to
# "1h" there, so tasks and their helpers keep their prompt cache an hour, as the chat does, unless the file already holds a value
# for it (Claudopus itself does the same as each chat starts, for an install made without this script). Running it again brings Claudopus
# up to date. The whole script is one function called on its last line, so a download cut off half way runs nothing, and
# every command reads nothing from the pipe the script itself comes through.

main() {
  REPO=${CLAUDOPUS_SOURCE:-dimka3553/claudopus}
  PLUGIN=claudopus@claudopus
  CONFIG="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
  APP_ENGINES="$HOME/Library/Application Support/Claude/claude-code"

  say() { printf '%s\n' "$*"; }
  stop() { printf '\nClaudopus is not installed: %s\n' "$*" >&2; exit 1; }

  # Claude Code: the newest copy the desktop app keeps, else `claude` on the PATH or where its installers put it
  ENGINE=""
  if [ -d "$APP_ENGINES" ]; then
    ENGINE=$(for e in "$APP_ENGINES"/*/*/claude.app/Contents/MacOS/claude; do
      [ -x "$e" ] || continue
      v=${e#"$APP_ENGINES"/}
      printf '%s\t%s\n' "${v%%/*}" "$e"
    done | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1 | cut -f2-)
  fi
  if [ -z "$ENGINE" ]; then
    for e in "$(command -v claude 2>/dev/null)" "$HOME/.local/bin/claude" "$HOME/.claude/local/claude"; do
      if [ -n "$e" ] && [ -x "$e" ]; then ENGINE=$e; break; fi
    done
  fi
  [ -n "$ENGINE" ] || stop "Claude Code isn't on this computer yet.
Install the Claude app from https://claude.ai/download, open its Code tab once, then paste this line again."

  # git: Claude Code fetches the marketplace with it. On a Mac it comes with Apple's command line tools.
  if [ "$(uname)" = Darwin ]; then
    git_path=$(command -v git 2>/dev/null)
    if [ -z "$git_path" ] || [ "$git_path" = /usr/bin/git ]; then
      if ! xcode-select -p >/dev/null 2>&1; then
        say "Claude Code needs Apple's command line tools (they include git) to fetch Claudopus."
        say "A box opens now: press Install there. This waits until they are in, then carries on."
        xcode-select --install </dev/null >/dev/null 2>&1
        waited=0
        until xcode-select -p >/dev/null 2>&1 && [ -x /usr/bin/git ] && /usr/bin/git --version </dev/null >/dev/null 2>&1; do
          [ "$waited" -ge 3600 ] && stop "the command line tools did not arrive within an hour.
Install them with: xcode-select --install
Then paste this line again."
          sleep 10
          waited=$((waited + 10))
          [ $((waited % 60)) -eq 0 ] && say "Still waiting for the command line tools to finish installing..."
        done
        say "The command line tools are in."
      fi
      PATH="/usr/bin:$PATH"
      export PATH
    fi
  elif ! command -v git >/dev/null 2>&1; then
    stop "Claude Code needs git to fetch Claudopus. Install git (on Ubuntu or Debian: sudo apt install git), then paste this line again."
  fi

  # task_cache <settings file>: subagentPromptCacheTtl set to "1h" with the system's own JSON (JavaScript on macOS, Python
  # elsewhere), every other key as it was. Prints "set", or "kept" when the file already held a value for it; fails, changing
  # nothing, on a file that is not a JSON object or holds a number of more than 15 digits, which would come back changed
  task_cache() {
    if [ -x /usr/bin/osascript ]; then
      /usr/bin/osascript -l JavaScript - "$1" <<'JS'
ObjC.import('Foundation')
function run(argv) {
  const path = $(argv[0]).stringByResolvingSymlinksInPath.js
  const text = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null)
  if (text.isNil()) throw new Error('unread')
  if (/[-:\[,\s]\d{16,}|\d\.\d{16,}/.test(text.js)) throw new Error('numbers')
  const d = text.js.trim() ? JSON.parse(text.js) : {}
  if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('not an object')
  if ('subagentPromptCacheTtl' in d) return 'kept'
  d.subagentPromptCacheTtl = '1h'
  if (!$(JSON.stringify(d, null, 2) + '\n').writeToFileAtomicallyEncodingError(path, true, $.NSUTF8StringEncoding, null)) throw new Error('unwritten')
  return 'set'
}
JS
    else
      python3 - "$1" <<'PY'
import json, os, re, sys, tempfile
path = os.path.realpath(sys.argv[1])
with open(path, encoding='utf-8') as f: text = f.read()
if re.search(r'[-:\[,\s]\d{16,}|\d\.\d{16,}', text): sys.exit(1)
d = json.loads(text) if text.strip() else {}
if not isinstance(d, dict): sys.exit(1)
if 'subagentPromptCacheTtl' in d: print('kept'); sys.exit(0)
d['subagentPromptCacheTtl'] = '1h'
fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path))
with os.fdopen(fd, 'w', encoding='utf-8') as f: f.write(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
os.chmod(tmp, os.stat(path).st_mode & 0o777); os.replace(tmp, path)
print('set')
PY
    fi
  }

  run() {
    out=$("$ENGINE" "$@" </dev/null 2>&1) && return 0
    printf '%s\n' "$out" >&2
    return 1
  }

  say "Adding the Claudopus marketplace from GitHub..."
  run plugin marketplace add "$REPO" || stop "Claude Code could not add the marketplace (its words are above)."
  run plugin marketplace update claudopus || stop "Claude Code could not fetch the newest Claudopus (its words are above)."
  say "Installing Claudopus..."
  run plugin install "$PLUGIN" --scope user || stop "Claude Code could not install it (its words are above)."
  run plugin update "$PLUGIN" --scope user || true
  run plugin enable "$PLUGIN" --scope user >/dev/null 2>&1 || true

  grep -q '"claudopus@claudopus": *true' "$CONFIG/settings.json" 2>/dev/null ||
    stop "Claude Code installed it but did not switch it on in $CONFIG/settings.json."
  # Tasks keep their prompt cache an hour, as the chat does: with Claude Code's 5 minutes, a task that waits longer on a command
  # or a helper pays to read its whole context again
  cache=$(task_cache "$CONFIG/settings.json" 2>/dev/null)
  version=$(sed -n 's|.*/cache/claudopus/claudopus/\([^"/]*\)".*|\1|p' "$CONFIG/plugins/installed_plugins.json" 2>/dev/null | tail -n 1)

  say ""
  say "Claudopus ${version:+$version }is installed and on, in every chat."
  [ "$cache" = set ] && say "Tasks keep their prompt cache for an hour, as the chat does (subagentPromptCacheTtl in $CONFIG/settings.json)."
  say "In the Claude app, open a new chat in the Code tab. In a chat that is already open, type /reload-plugins."
  say "In a terminal, start claude. The Claudopus panel opens with a welcome; /claudopus opens it again."
}

main "$@"
