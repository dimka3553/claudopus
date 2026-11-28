// Long texts and patterns of the hooks' parts, kept here as the joined hooks file is near the 1 MB the engine reads: each is used
// in the part of src/claudopus named above it, as if it stood there

// ---- gate.tsx ----
// No admin password is kept: every one an earlier version kept leaves the keychain (on Linux, bin/keyring's folder) as the mod
// loads, with the "Let macOS ask" mark kept beside the gate's key and config.json's adminPassword, which no longer choose anything
export const FORGET_KEPT = 'if [ -x /usr/bin/security ]; then n=0; while [ $n -lt 50 ] && /usr/bin/security delete-generic-password -s claudopus-admin >/dev/null 2>&1; do n=$((n + 1)); done; /usr/bin/security delete-generic-password -s claudopus-admin-gate -a password >/dev/null 2>&1; else [ -x /usr/bin/cygpath ] && { p=$(/usr/bin/cygpath -F 40 2>/dev/null); HOME=$(/usr/bin/cygpath -u "${p:-${USERPROFILE:-}}" 2>/dev/null); [ -n "$HOME" ] || exit 0; }; d=$HOME/.local/share; o=${XDG_DATA_HOME:-}; case $o in /*) [ "$o" != "$d" ] && [ -d "$o/claudopus/keyring" ] && [ ! -e "$d/claudopus/keyring" ] && mkdir -p "$d/claudopus" && chmod 700 "$d/claudopus" && mv "$o/claudopus/keyring" "$d/claudopus/keyring" ;; esac; rm -rf "$d/claudopus/keyring/claudopus-admin"; rm -f "$d/claudopus/keyring/claudopus-admin-gate/password"; fi; exit 0'

// ---- files.tsx ----
export const LINK_ICON = '<rect x="2.5" y="4.5" width="23" height="23" rx="5" fill="#3b3b39" stroke="#9a9890" stroke-width="1.2"/><path d="M11 13.5h-1.5a3.5 3.5 0 0 0 0 7H11M17 13.5h1.5a3.5 3.5 0 0 1 0 7H17M11.5 17h5" fill="none" stroke="#C9A7FF" stroke-width="1.6" stroke-linecap="round"/>'
// A Claude artifact: a page with Claude's mark on it
export const ARTIFACT_ICON =
  '<rect x="2.5" y="4.5" width="23" height="23" rx="5" fill="#3b3b39" stroke="#9a9890" stroke-width="1.2"/><g stroke="#D97757" stroke-width="2.2" stroke-linecap="round"><path d="M14 10.5v13M7.5 17h13M9.4 12.4l9.2 9.2M18.6 12.4l-9.2 9.2"/></g>'
export const CODE_ICON = '<circle cx="9" cy="8" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><circle cx="9" cy="24" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><circle cx="19" cy="12" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><path d="M9 10.6v10.8M19 14.6c0 4-10 3-10 6.8" fill="none" stroke="#9a9890" stroke-width="1.5"/>'

// ---- tidy.tsx ----
export const CHROME_COPIED = `Not run: this starts your own Google Chrome app without a window. Each start makes a copy of the whole app on the disk, and a start that is stopped leaves it there. Use Playwright's own Chromium instead (chromium.launch() with no channel or executablePath, after npx playwright install chromium), start it once for every page the script needs, and close it in a finally block.`

// ---- rules.tsx ----
// What the work is told with a reply that does not settle its ask: the ask stays open on its card until it clears or replaces it
export const REPLY_HOLDS = `That reply does not settle your question by itself: act on it. Their card shows your question with their reply under it, and nothing more to press or type while you work on it. Once it is settled, clear it with the \`ask\` tool and empty \`text\`; if it still needs them after you have done what they said, ask it again, which brings back its buttons.`

// ---- reports.tsx ----
// The absolute paths a report names, as written, without the punctuation after them. A folder's name may hold spaces ("FaceIQ email
// lifecycle"), and so may a whole path on a line of its own or between backticks; the shorter readings stay beside the longer, for
// whoever looks a path up to keep the one that is there (27 Nov: a board in a folder with spaces was named as "/Users/…/FaceIQ")
export const PATH_PLAIN = /\/(?:Users|private|tmp|var)\/[^\s`'"()<>[\]{}|,;*]+/g
export const PATH_SPACED = /\/(?:Users|private|tmp|var)\/(?:[^\s/`'"()<>[\]{}|,;*]+(?: [^\s/`'"()<>[\]{}|,;*]+)*\/)+[^\s/`'"()<>[\]{}|,;*]+/g
export const PATH_TICKED = /`(\/(?:Users|private|tmp|var)\/[^`\n]+)`/g
export const PATH_LINE = /^[ \t]*(?:[-*•][ \t]+)?(?:\*\*)?(\/(?:Users|private|tmp|var)\/[^\n`'"<>|*]+?)(?:\*\*)?[ \t]*$/gm
// On Windows a path from a drive too, as Windows writes it (C:\Users\sam\x.png), with forward slashes (C:/Users/sam/x.png) or as Git's
// bash does (/c/Users/sam/x.png), each part parted by either slash. A letter and a colon inside a word (https://) begins none
export const DRIVE_ROOT = String.raw`(?:[A-Za-z]:[\\/]|\/[A-Za-z]\/)`
export const DRIVE_PART = String.raw`[^\s\\/\x60'"()<>[\]{}|,;*]+`
export const DRIVE_PLAIN = new RegExp(String.raw`(?<![\w./~:-])${DRIVE_ROOT}[^\s\x60'"()<>[\]{}|,;*]+`, 'g')
export const DRIVE_SPACED = new RegExp(String.raw`(?<![\w./~:-])${DRIVE_ROOT}(?:${DRIVE_PART}(?: ${DRIVE_PART})*[\\/])+${DRIVE_PART}`, 'g')
export const DRIVE_TICKED = new RegExp(String.raw`\x60(${DRIVE_ROOT}[^\x60\n]+)\x60`, 'g')
export const DRIVE_LINE = new RegExp(String.raw`^[ \t]*(?:[-*•][ \t]+)?(?:\*\*)?(${DRIVE_ROOT}[^\n\x60'"<>|*]+?)(?:\*\*)?[ \t]*$`, 'gm')
