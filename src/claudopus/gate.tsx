// The admin gate: an admin command (bin/admin) waits for the person's press on its work's card before it runs

// config.json's "admin" says when the person is asked: "each" (as shipped) before every admin command, "work" once for a piece of
// work and its helpers until it ends, "never" not at all, as before the gate. The tool.call hook holds a Bash call that runs
// bin/admin and its work's card shows the exact command and the Mac, with Allow, Don't allow and Always allow this command. The answer
// is a press in this chat's own panel, kept only in this code's memory: no file, message or typed reply allows anything.
// What a press allows reaches bin/admin as a grant: a file naming the Mac and the exact command, sealed with a key kept in this Mac's
// keychain (GATE_SERVICE). bin/admin runs a command only with a grant whose seal is right, and takes it once, so an admin command
// that reaches it some other way (a script, another spelling of its path, a command built by the shell) is refused there. The
// commands always allowed (admin-allowed.json) and a "work" or "never" in config.json count only with the same seal, which only a
// press in Config or on a card makes; whatever takes one back makes a new key, so an old seal put back counts for nothing.
// The seal is as strong as the keychain: what runs as the person and reads the keychain can make one. So a seal never stands in for
// the password: no admin password is kept anywhere, and bin/admin runs nothing as admin until the person types it for that very
// command, into macOS's own box (which names the command) or the panel's box (sealed to that one run). A forged seal spares only
// the card's press, never the password, and there is no kept password to read.
// The same press gates two more things work could do in the person's place: a release to a repo's main branch (bin/release takes a
// grant as bin/admin does) and a change to the person's own settings and texts in the memory folder (config.json, rules/, roles/)
type Gate = NonNullable<Todo['admins']>[number]
type GateSaid = 'once' | 'always' | 'deny'
type AdminCall = { host: string; command: string }
const GATE_SERVICE = 'claudopus-admin-gate'
// The gates this copy of the mod holds a call for, and what was pressed for each: both only in memory
const gateHeld = new Set<string>()
// What each held gate's wait ends with: the press on its block, or 'gone' as its call was aborted or this copy replaced
const gateWaits = new Map<string, (said: GateSaid | 'gone' | 'words') => void>()
// Gates the person answered in words before pressing, by gate, with the card they are on: the held call ended with their words, so
// the task can answer them, and the block stays on the card with Allow and Don't allow until they press (wordsOnGate). Only in
// this code's memory, as every press is: a reload drops them, and the task's next run of the same command asks afresh
const gateParked = new Map<string, string>()
// What the person last typed on each gate, for the task's answer to the call it held
const gateWords = new Map<string, string>()
// and the files that went with them, said to the task after its answer
const gateNotes = new Map<string, string>()
// What a press on a parked gate allows: that card's next run of the very same admin command or change to a file, once, within
// RELEASE_ALLOWED of the press (a release goes through releaseAllowed). Taken out as the card ends (state.tsx)
const gateOnce = new Map<string, { kind: 'admin' | 'file'; host: string; command: string; at: number }[]>()
const takeOnce = async ($: EngineInterface, card: string, kind: 'admin' | 'file', host: string, command: string) => {
  const now = await $.clock.now()
  const list = (gateOnce.get(card) ?? []).filter(one => now - one.at < RELEASE_ALLOWED)
  const at = list.findIndex(one => one.kind === kind && one.host === host && one.command === command)
  const left = at < 0 ? list : list.filter((_, n) => n !== at)
  if (left.length) gateOnce.set(card, left)
  else gateOnce.delete(card)
  return at >= 0
}
// A hook has ten seconds of its own time, and only time spent in a call on the engine is not counted: so while a hook waits for a
// press, one sleep run by the engine is in flight, and the wait itself is the promise the press resolves, raced with it. The press
// ends the wait at once; the sleep only keeps the clock stopped, and is started again each HELD_STEP while nothing is pressed
const HELD_STEP = 60
const heldStep = ($: EngineInterface) => runOn($, ['/bin/sleep', String(HELD_STEP)], { timeoutMs: (HELD_STEP + 10) * 1000 }).then(() => undefined, () => undefined)
// A gate of the chat's own thread, which has no card (a chat that does its own work): drawn at the top of the panel
let looseGates: Gate[] = []
// The pieces of work allowed under "work", by card: taken out as the work ends (ended, in cards), so one that comes back asks again
const workAllowed = new Set<string>()
const GATE_DENIED = (gate?: Pick<Gate, 'kind'>) =>
  named(`Refused by {name}: {name} pressed Don't allow on this ${gate?.kind === 'release' ? "release, so nothing was released. Don't try to release it another way" : gate?.kind === 'file' ? "change, so the file was not changed. Don't try to change it another way" : "admin command, so it didn't run. Don't try to run it another way"}. Continue without it, or say what it is needed for and ask again.`)
const gateNoun = (gate?: Pick<Gate, 'kind'>) => (gate?.kind === 'release' ? 'release' : gate?.kind === 'file' ? 'change to their file' : 'admin command')
// The held call's answer when the person wrote instead of pressing, and the words they write after: the permission stays on the card
const GATE_WORDS = (gate: Pick<Gate, 'kind'>, words: string, note = '') =>
  `${named(
    `This ${gateNoun(gate)} did not run yet: {name} neither allowed nor refused it, and wrote to you about it instead, in their own words: “${words}”\nAnswer them with the \`ask\` tool: your answer in \`text\` (one plain line) and \`details\` (what it does and why, in everyday words), with no \`choices\`. Claudopus shows it inside the permission on your card, under their words, where Allow and Don't allow stay until {name} presses one. Typed words never allow anything. Don't run it again until then: when {name} presses Allow, Claudopus tells you, and your next run of exactly the same ${gate.kind === 'file' ? 'change' : 'command'} goes through once, with nothing more asked. With nothing else to do, end your step.`,
  )}${note}`
const GATE_WORDS_AGAIN = (gate: Gate, words: string) =>
  named(`{name} wrote to you again about the ${gateNoun(gate)} that waits on your card (${gateWhat(gate)}), in their own words: “${words}”\nAnswer them with the \`ask\` tool as before, with no \`choices\`: Claudopus shows it inside that permission, which stays until {name} presses Allow or Don't allow.`)
const GATE_ALLOWED_LATER = (gate: Gate) =>
  named(
    `{name} pressed Allow on the ${gateNoun(gate)} that waited on your card (${gateWhat(gate)}). ${gate.kind === 'file' ? 'Make exactly the same change again now' : 'Run exactly the same command again now, as your rules say'}: it goes through once, within the hour, with nothing more asked.`,
  )
const gateThing = (gate?: Pick<Gate, 'kind'>) => (gate?.kind === 'release' ? 'This release did not run' : gate?.kind === 'file' ? 'This change was not made' : 'This admin command did not run')
const GATE_GONE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: the wait for {name} to allow it was interrupted. Run it again if it is still needed.`)
const GATE_LATE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: {name} didn't answer in time. Run it again when it is needed, and Claudopus will ask {name} again.`)
const GATE_BLIND = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: Claudopus asks {name} first, on a card in its panel, and this chat has no panel open.`)
const ADMIN_NOT_HERE = () =>
  named("This admin command didn't run: Windows has no admin runner, so Claudopus can't run a command as admin on this PC. Ask {name} to run it in a terminal opened as administrator: give it whole in the `ask` tool's `command`, with the folder it runs in. An admin command on a Mac or Linux machine reached over SSH runs as before.")
const GATE_UNSEALED = () => `This admin command did not run: Claudopus could not secure what was allowed in ${keptWhere()}. Run it again.`
const NO_GATE_TOUCH = () =>
  named('Claude never reads or writes the list of admin commands {name} always allows, what {name} allowed, or the key that locks them. Only {name} adds to them, with a press on a card or in Config.')

// What a gate asks, in words, by its kind: the act, for a notification, and the one amber line of its block
// A release is called what it is in its project: Release where the repo numbers its versions (its `.release` names a version file),
// else Push, which is what the runner does there (28 Nov, the person: "a release sometimes is a push, sometimes is a merge ...
// replace the copy that says 'release' with something that the user would understand from the context of the project")
const releaseVerb = (gate: Pick<Gate, 'isVersion'>) => (gate.isVersion ? 'Release' : 'Push')
const gateAct = (gate: Gate) =>
  gate.isUndone ? `Make the change to ${gate.host} again` : gate.kind === 'release' ? `${releaseVerb(gate)} ${gate.host} to main` : gate.kind === 'file' ? `Change ${gate.host}` : `Run an admin command on ${gate.host === 'here' ? thisMac() : gate.host}`
const gateWhat = (gate: Gate) =>
  gate.isUndone ? `Make the change to ${gate.host} again?` : gate.kind === 'release' ? `${releaseVerb(gate)} ${gate.branch || gate.host} to main?` : gate.kind === 'file' ? `Change ${gate.host}?` : `Run this as admin on ${gate.host === 'here' ? thisMac() : gate.host}?`

// The admin commands a Bash command runs, as the shell splits it: bin/admin by any spelling of its path, after what runs a
// command it is handed, and inside a shell's -c or an eval. What the shell would build (a variable, a substitution) is read as
// written, so the grant names what was shown and bin/admin refuses what differs
const isAdminPath = (word: string, root: string, name = 'admin') => {
  // (on Windows by either separator, C:\x or Git's bash's /c/x alike, in any case)
  const [said, own] = isWindows ? [windowsPath(word).toLowerCase(), windowsPath(root).toLowerCase()] : [word, root]
  const parts: string[] = []
  for (const part of said.split('/')) {
    if (part === '..' && parts.length && parts.at(-1) !== '..' && parts.at(-1) !== '') parts.pop()
    else if (part !== '.' && (part !== '' || !parts.length)) parts.push(part)
  }
  const path = parts.join('/')
  // Reached from its own folder, by the mod's own path, or by a path that names the mod or is filled in by the shell: another
  // tool that happens to be called admin is none of this
  return path === name || path === `bin/${name}` || (path.endsWith(`/bin/${name}`) && (path === `${own}/bin/${name}` || /claudopus/i.test(path) || path.includes('$')))
}
const adminCalls = (command: string, root: string, depth = 0): AdminCall[] => {
  if (depth > 4) return []
  return shellWords(command).flatMap(words => {
    let i = 0
    for (;;) {
      while (i < words.length && /^\w+=/.test(words[i]!)) i++
      const head = progName(words[i] ?? '')
      if (!['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'builtin', 'timeout', 'caffeinate', 'nice', 'if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{'].includes(head)) break
      i++
      while (i < words.length && (words[i]!.startsWith('-') || (head === 'sudo' && words[i - 1] === '-u') || /^\d+[smhd]?$/.test(words[i]!) || (head === 'env' && /^\w+=/.test(words[i]!)))) i++
    }
    const tool = progName(words[i] ?? '')
    if (tool === 'eval') return adminCalls(words.slice(i + 1).join(' '), root, depth + 1)
    if (tool === 'bash' || tool === 'sh' || tool === 'zsh') {
      const c = words.findIndex((one, n) => n > i && /^-[a-z]*c$/.test(one))
      if (c > 0) return adminCalls(words[c + 1] ?? '', root, depth + 1)
      // A shell handed the runner as a script
      i++
      while (i < words.length && words[i]!.startsWith('-')) i++
    }
    if (!isAdminPath(words[i] ?? '', root)) return []
    const [host = '', run = ''] = [words[i + 1], words[i + 2]]
    return !host || !run || host.startsWith('-') || run === '--forget' ? [] : [{ host, command: run }]
  })
}

// One seal for each message: its HMAC under the key in this Mac's keychain, which never leaves that shell. "make" makes the key when
// there is none, "new" makes a new one, so every seal of the old one is void
const SEAL = `set -u
PATH=/usr/bin:/bin
mode=$1
shift
# The kept copy of the person's settings and texts has a key of its own ("known"), so its being there says a copy was made here
acct=seal
case $mode in known-*) acct=known; mode=\${mode#known-} ;; esac
if [ -x /usr/bin/security ]; then
  key() { /usr/bin/security find-generic-password -s ${GATE_SERVICE} -a "$acct" -w 2>/dev/null; }
  keep() { printf 'add-generic-password -U -s "${GATE_SERVICE}" -a "%s" -l "Claudopus admin gate" -w "%s"\\n' "$acct" "$1" | /usr/bin/security -i >/dev/null 2>&1; }
else
  # Linux and Windows: where bin/keyring keeps it, a file only this user reads, under the home folder (never XDG_DATA_HOME). On
  # Windows, in Git's bash, that is the person's profile, as bin/keyring finds it
  [ -x /usr/bin/cygpath ] && { p=$(/usr/bin/cygpath -F 40 2>/dev/null); HOME=$(/usr/bin/cygpath -u "\${p:-\${USERPROFILE:-}}" 2>/dev/null); [ -n "$HOME" ] || exit 1; }
  d=$HOME/.local/share
  f=$d/claudopus/keyring/${GATE_SERVICE}
  key() { [ -f "$f/$acct" ] && cat "$f/$acct" 2>/dev/null; }
  keep() { (umask 077; mkdir -p "$f" && chmod 700 "$d/claudopus" "$d/claudopus/keyring" "$f" && printf '%s' "$1" >"$f/.$acct.new" && mv -f "$f/.$acct.new" "$f/$acct"); }
fi
k=$(key)
if [ "$mode" = has ]; then [ -n "$k" ] && exit 0; exit 3; fi
if [ "$mode" = new ] || { [ -z "$k" ] && [ "$mode" = make ]; }; then
  k=$(/usr/bin/openssl rand -hex 32 2>/dev/null || od -An -tx1 -N32 /dev/urandom | tr -d ' \\n') || exit 1
  [ \${#k} = 64 ] || exit 1
  keep "$k"
  [ "$(key)" = "$k" ] || exit 1
fi
[ -n "$k" ] || exit 3
for m in "$@"; do
  printf '%s\\n%s' "$k" "$m" | /usr/bin/perl -MDigest::SHA=hmac_sha256_hex -e '$k = <STDIN>; chomp $k; local $/; $m = <STDIN>; print hmac_sha256_hex($m // "", $k), "\\n"' || exit 1
done`
const sealed = async ($: EngineInterface, mode: 'read' | 'make' | 'new' | 'known-read' | 'known-make', messages: string[]) => {
  if (!(await hasKeychain($))) return undefined
  const r = await runOn($, ['/bin/sh', '-c', SEAL, 'sh', mode, ...messages], { timeoutMs: 20_000 }).catch(() => undefined)
  const lines = r?.exitCode === 0 ? r.stdout.split(/\r?\n/).filter(Boolean) : undefined
  return lines && lines.length === messages.length && lines.every(line => /^[0-9a-f]{64}$/.test(line)) ? lines : undefined
}

// What is in force: "work" or "never" only as Config sealed it, every command asked otherwise
const gateOf = async ($: EngineInterface) => {
  const config = await readConfig($, dir)
  const said: 'each' | 'work' | 'never' = config.admin === 'work' || config.admin === 'never' ? config.admin : 'each'
  if (said === 'each') return { mode: 'each' as const, unsealed: '' }
  const seal = (await sealed($, 'read', [`mode\n${said}`]))?.[0]
  const isSealed = Boolean(seal) && seal === config.adminSealed
  return { mode: isSealed ? said : ('each' as const), unsealed: isSealed ? '' : said }
}

// The commands always allowed, by Mac: admin-allowed.json, { "<mac>": [{ command, seal, at }] }. One whose seal is not right
// allows nothing
type Allowed = AdminCall & { seal: string; at: number }
const allowedPath = () => `${dir}/admin-allowed.json`
const allowMessage = (one: AdminCall) => `allow\n${one.host}\n${one.command}`
const readAllowed = async ($: EngineInterface): Promise<Allowed[]> => {
  try {
    const kept = JSON.parse((await personText($, dir, 'admin-allowed.json')) || '{}') as Record<string, unknown>
    return Object.entries(kept).flatMap(([host, list]) =>
      (Array.isArray(list) ? list : []).flatMap(one => {
        const { command, seal, at } = (one ?? {}) as { command?: unknown; seal?: unknown; at?: unknown }
        return typeof command === 'string' && typeof seal === 'string' ? [{ host, command, seal, at: typeof at === 'number' ? at : 0 }] : []
      }),
    )
  } catch {
    return []
  }
}
const writeAllowed = ($: EngineInterface, list: Allowed[]) => {
  const kept: Record<string, { command: string; seal: string; at: number }[]> = {}
  for (const { host, command, seal, at } of list) (kept[host] ??= []).push({ command, seal, at })
  const text = `${JSON.stringify(kept, null, 2)}\n`
  return personWrote($, dir, 'admin-allowed.json', text).then(() => $.fs.write(allowedPath(), text))
}
// Read once for each state of the file: the Config tab draws the list often
let allowedRead = { key: '', valid: [] as Allowed[], unsealed: 0 }
const validAllowed = async ($: EngineInterface) => {
  const all = await readAllowed($)
  if (!all.length) return { valid: [] as Allowed[], unsealed: 0 }
  const key = JSON.stringify(all)
  if (allowedRead.key === key) return allowedRead
  const seals = await sealed($, 'read', all.map(allowMessage))
  const valid = all.filter((one, n) => seals?.[n] === one.seal)
  allowedRead = { key, valid, unsealed: all.length - valid.length }
  return allowedRead
}
const isAllowed = async ($: EngineInterface, call: AdminCall) => {
  const entry = (await readAllowed($)).find(one => one.host === call.host && one.command === call.command)
  return Boolean(entry) && (await sealed($, 'read', [allowMessage(call)]))?.[0] === entry?.seal
}
const allowAlways = async ($: EngineInterface, call: AdminCall) => {
  const seal = (await sealed($, 'make', [allowMessage(call)]))?.[0]
  if (!seal) throw new Error(`the seal could not be made in ${keptWhere()}`)
  const at = await $.clock.now()
  allowedRead = { key: '', valid: [], unsealed: 0 }
  await writeAllowed($, [...(await readAllowed($)).filter(one => one.host !== call.host || one.command !== call.command), { ...call, seal, at }])
}
// A change that takes something back (another setting, a command removed): what stays is sealed again under a new key, so no seal
// made before counts, whoever kept a copy of it
const regate = async ($: EngineInterface, change: { mode?: 'each' | 'work' | 'never'; remove?: AdminCall }) => {
  const { valid } = await validAllowed($)
  const kept = change.remove ? valid.filter(one => one.host !== change.remove?.host || one.command !== change.remove.command) : valid
  const mode = change.mode ?? (await gateOf($)).mode
  const seals = await sealed($, 'new', [...kept.map(allowMessage), ...(mode === 'each' ? [] : [`mode\n${mode}`])])
  if (!seals) throw new Error(`the seal could not be made in ${keptWhere()}`)
  allowedRead = { key: '', valid: [], unsealed: 0 }
  await writeAllowed($, kept.map((one, n) => ({ ...one, seal: seals[n] ?? '' })))
  await setConfig($, dir, 'admin', mode === 'each' ? undefined : mode)
  await setConfig($, dir, 'adminSealed', mode === 'each' ? undefined : seals[kept.length])
  if (change.mode) workAllowed.clear()
}
let isKeptForgotten = false
const forgetKeptPasswords = async ($: EngineInterface) => {
  if (isKeptForgotten || !dir) return
  isKeptForgotten = true
  if (await hasKeychain($)) await runOn($, ['/bin/sh', '-c', FORGET_KEPT], { timeoutMs: 30_000 }).catch(err => log($, `kept admin passwords not forgotten: ${String(err)}`))
  if ((await readConfig($, dir)).adminPassword !== undefined) await setConfig($, dir, 'adminPassword', undefined).catch(() => undefined)
}

// What a press allowed, for bin/admin to take once: the Mac and the exact command, sealed. One nothing took goes as its call ends
const grantsDir = () => `${dir}/admin-grants`
// A release's grant is sealed under a word of its own, so neither runner ever takes the other's
const issueGrant = async ($: EngineInterface, id: string, call: AdminCall, word: 'grant' | 'release-grant' = 'grant') => {
  const at = await $.clock.now()
  const name = `${id.replace(/[^A-Za-z0-9_-]/g, '')}-${at}`
  const seal = (await sealed($, 'make', [`${word}\n${name}\n${at}\n${call.host}\n${call.command}`]))?.[0]
  if (!seal) return ''
  // Grants a call sent to the background never took are cleared as the next one is made
  await runOn($, ['/usr/bin/find', grantsDir(), '-type', 'f', '-mmin', '+10', '-delete'], { timeoutMs: 10_000 }).catch(() => undefined)
  await $.fs.write(`${grantsDir()}/${name}.json`, JSON.stringify({ id: name, host: call.host, command: call.command, at, seal }))
  return name
}
const dropGrants = async ($: EngineInterface, names: string[]) => {
  for (const name of names) await runOn($, ['rm', '-f', `${grantsDir()}/${name}.json`]).catch(() => undefined)
}

// A tool call that would read or write the list, the grants or the key itself
// A command is read as written and again with its quotes and backslashes taken out, so `-"w"` or `claudopus-admin-"gate"` is read as
// the shell reads it. Any command that names the keychain's admin services (the gate's key and what Config chose, and the kept admin
// passwords) with security or the keyring runner counts, whatever it does with them
const unquoted = (command: string) => command.replace(/["'\\]/g, '')
// The runners find their key, grants and settings under the home folder, and release asks for a press only inside Claude Code: a
// command that names one and sets another home or data folder, or takes Claude Code's mark away, would have it read the caller's own
// (its comment lines left out, so a test script that makes a home of its own and only names a runner in a comment is not refused)
const RUNNER_NAMED = /\bbin[\\/](?:admin|secret|release|keyring)(?![\w.-])/
const RUNNER_MOVED = /(?:^|[\s;&|(`'"])(?:HOME|XDG_DATA_HOME|CLAUDECODE)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:HOME|XDG_DATA_HOME|CLAUDECODE)\b|\benv\b[^;&|\n]*\s(?:-u\s*|--unset[= ])CLAUDECODE\b|\benv\b[^;&|\n]*\s-i\b|\benv(?:\s+-\w+)*\s+-(?=\s|$)|\bexec\s+-\w*c/
// The release runs as itself (#!/bin/bash -p: no startup file, no functions from the environment), so what its shell runs, the
// GitHub checks' verdict among it, is its own: a command that names it and sets what a shell or git reads first (a startup file,
// functions, options, the PATH, git's settings), sources a script first, or starts it through a shell of its own choosing, is refused
const RELEASE_NAMED = /\bbin[\\/]release(?![\w.-])/
const RELEASE_MOVED =
  /(?:^|[\s;&|(`'"])(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+|BASH_FUNC_\S+)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+)\b|\b(?:export|declare|typeset)\s+(?:-\w+\s+)*-\w*f|(?:^|[;&|(]\s*)(?:source|\.)\s|\b(?:ba|z|da|k|c|tc|fi)?sh(?:\.exe)?\s+(?:-\S+\s+)*\S*bin[\\/]release(?![\w.-])/
const movesRunner = (command: string) =>
  [command, unquoted(command)].map(one => one.replace(/^\s*#.*$/gm, '')).some(one => (RUNNER_NAMED.test(one) && RUNNER_MOVED.test(one)) || (RELEASE_NAMED.test(one) && RELEASE_MOVED.test(one)))
const touchesGate = (e: ToolCallInput) => {
  if (e.tool === 'Bash') {
    const command = String((e as { command?: unknown }).command ?? '')
    return [command, unquoted(command)].some(one => /claudopus[\\/]admin-(?:allowed\.json|grants|known\.json)\b/.test(one) || (/\b(?:security|keyring)\b/.test(one) && /claudopus-admin\b/.test(one)))
  }
  const said = String((e as { file_path?: unknown; notebook_path?: unknown }).file_path ?? (e as { notebook_path?: unknown }).notebook_path ?? '')
  const path = isWindows ? windowsPath(said) : said
  return ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool) && new RegExp(/\/claudopus\/admin-(?:allowed\.json$|known\.json$|grants(?:\/|$))/.source, isWindows ? 'i' : '').test(path)
}

const setGates = async ($: EngineInterface, top: string, fn: (list: Gate[]) => Gate[]) => {
  if (!top) looseGates = fn(looseGates)
  else await changeTodos($, list => list.map(one => (one.id !== top ? one : { ...one, admins: fn(one.admins ?? []).length ? fn(one.admins ?? []) : undefined })))
  redraw($)
}
// No hold outlives the copy of the mod that made it: a card that still shows one as a chat starts is cleared
const clearGates = async ($: EngineInterface) => {
  looseGates = looseGates.filter(one => gateHeld.has(one.id))
  const isKept = (gate: Gate) => gateHeld.has(gate.id) || gateParked.has(gate.id)
  if ((await ownCards($)).some(one => one.admins?.some(gate => !isKept(gate))))
    await changeTodos($, list => list.map(one => (one.admins ? { ...one, admins: one.admins.filter(isKept).length ? one.admins.filter(isKept) : undefined } : one)))
}
// Holds the call until the person presses: the wait is a promise the press resolves (answerGate), ended also by the call's
// abort and by this copy of the mod being replaced, with no loop that looks for the press (heldStep)
const holdGate = async ($: EngineInterface, next: { signal?: AbortSignal; budget?: { remainingMs: number } }, gate: Gate, top: string): Promise<GateSaid | 'gone' | 'late' | 'blind' | 'words'> => {
  if (!(await $.session.surfaces().catch(() => [])).length) return 'blind'
  const wait: { said?: GateSaid | 'gone' | 'late' | 'words' } = {}
  let end: (said: GateSaid | 'gone' | 'words') => void = () => undefined
  const pressed = new Promise<void>(resolve => (end = said => void (wait.said === undefined && ((wait.said = said), resolve()))))
  const stop = () => end('gone')
  gateHeld.add(gate.id)
  gateWaits.set(gate.id, end)
  // A gate held afresh waits for a press of its own: a mark an earlier one of the same id left never hides it
  gatePressed.delete(gate.id)
  next.signal?.addEventListener('abort', stop, { once: true })
  whenLeft.add(stop)
  try {
    await setGates($, top, list => [...list.filter(one => one.id !== gate.id), gate])
    await openList($).catch(() => undefined)
    const card = top ? (await ownCards($)).find(one => one.id === top) : undefined
    const text = `${gateAct(gate)}: ${cut(oneLine(gate.command), 200)}`
    await (card ? askAloud($, card, text) : aloud($, 'ask', 'This chat has a question for you', text, `gate-${gate.id}`)).catch(err => log($, `admin command not told: ${String(err)}`))
    const act = gateAct(gate)
    // The press is on the card or at the top of the panel, which the notification above points to: the chat shows nothing of it, and
    // its model is told only so it knows, should the person ask (18 Nov: a line in the chat for each release was "garbage I don't need")
    await tellChat($, named(GATE_IN_CHAT(card ? titleOf(card) : '', `${act.charAt(0).toLowerCase()}${act.slice(1)}`, cut(oneLine(gate.command), 120))))
    while (wait.said === undefined) {
      if (next.signal?.aborted || (await isReplaced($))) wait.said ??= 'gone'
      else if ((next.budget?.remainingMs ?? Infinity) < 1500) wait.said ??= 'late'
      else await Promise.race([pressed, heldStep($)])
    }
  } finally {
    whenLeft.delete(stop)
    gateHeld.delete(gate.id)
    if (gateWaits.get(gate.id) === end) gateWaits.delete(gate.id)
    // Answered in words on a task's card: the block stays there for the press (gateParked)
    if (wait.said === 'words' && top) gateParked.set(gate.id, top)
    else await setGates($, top, list => list.filter(one => one.id !== gate.id)).catch(() => undefined)
  }
  const said = wait.said ?? 'gone'
  if (said === 'words') return (await log($, `${gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on'} ${gate.host}: answered in words, still waiting for the press`), said)
  // A press the wait did not take (it stopped waiting as the press came) is said as such where its line is
  const press = gatePressed.get(gate.id)
  gatePressed.delete(gate.id)
  if (press && press !== said) pressedLine($, top, gateLabel(press), `it had stopped waiting, so ${gateNothing(gate)}`)
  await log($, `${gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on'} ${gate.host}: ${said === 'once' ? 'allowed once' : said === 'always' ? 'always allowed' : said === 'deny' ? 'not allowed' : 'not answered'}`)
  return said
}
// The words of each press on a gate's block, and what did not happen when one came to nothing
const gateLabel = (said: GateSaid) => (said === 'deny' ? DONT_ALLOW : said === 'always' ? ALWAYS_ALLOW : ALLOW)
const gateNothing = (gate: Pick<Gate, 'kind'>) => (gate.kind === 'release' ? 'nothing was released' : gate.kind === 'file' ? 'nothing changed' : "it didn't run")
// The gates pressed and not yet let go by their wait, with what was pressed: the panel draws each answered from the press itself.
// Only the first press counts: a second, on a drawing a moment old, sends nothing
const gatePressed = new Map<string, GateSaid>()
// `card` names the work whose card the gate is on: one grey line there says what was pressed, where the block was
const answerGate = ($: EngineInterface, gate: Gate, said: GateSaid, card = '') => {
  presses += 1
  const id = gate.id
  // A put-back goes from the panel in the press's own drawing too, and comes back only if it could not be answered
  if (gate.isUndone) {
    if (gatePressed.has(id)) return
    gatePressed.set(id, said)
    pressedLine($, card, gateLabel(said))
    redraw($)
    return void answerUndone($, gate, said)
      .catch(err => log($, `undone change not answered: ${String(err)}`))
      .finally(() => (gatePressed.delete(id), redraw($)))
  }
  if (gateParked.has(id)) return answerParked($, gate, said, gateParked.get(id) ?? card)
  const end = gateWaits.get(id)
  if (gateHeld.has(id) && !gatePressed.has(id) && end) {
    gatePressed.set(id, said)
    pressedLine($, card, gateLabel(said))
    end(said)
  }
  redraw($)
}

// Words typed on a gate of a task's card (Answer in words): kept on its block, and to the task. A call still held ends with them,
// so the task can answer; one already ended that way hears them as a message. Never a press: the block keeps Allow and Don't allow
const wordsOnGate = ($: EngineInterface, card: string, id: string, value: string, note = '') => {
  const run = (async () => {
    const words = value.trim()
    const one = (await ownCards($)).find(other => other.id === card)
    const gate = one?.admins?.find(other => other.id === id)
    if (!words || !one || !gate || gatePressed.has(id) || gate.isUndone) return
    presses += 1
    await setGates($, card, list => list.map(other => (other.id === id ? { ...other, talk: [...(other.talk ?? []), { by: 'you' as const, text: cut(words, ASK_DETAILS) }].slice(-PERMIT_TALK_KEPT) } : other)))
    gateWords.set(id, words)
    gateNotes.set(id, note)
    pressedLine($, card, '', '', `You answered “${cut(oneLine(words), 80)}”`)
    const end = gateWaits.get(id)
    if (gateHeld.has(id) && end) return end('words')
    if (gateParked.has(id)) await toTask($, card, gate.from ?? card, `${GATE_WORDS_AGAIN(gate, words)}${note}`, words, gateWhat(gate))
  })()
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(err => log($, `words on a permission not sent: ${String(err)}`))
  return run
}
// What a task is told of the person's words or press on its card when no call of its own waits for it: written in at its next step,
// or sent to it paused, which starts it with them
const toTask = async ($: EngineInterface, card: string, target: string, text: string, label: string, asked: string) => {
  const one = (await ownCards($)).find(other => other.id === card)
  if (!one) return
  const working = (await ownCards($)).find(other => other.id === target)?.status === 'working'
  const told = working ? await tell($, target, text) : undefined
  if (told && !told.deny) return void writtenIn($, target, card)
  await toEnded($, one, target, `${text}\n${RESUMED_BY_ANSWER}`, { text: label, ask: asked, at: await $.clock.now(), line: lineOf(one), isCard: true, isPress: true })
}
// A press on a gate answered in words: Allow lets the task's next run of the very same command or change through once (a release
// by releaseAllowed, the rest by gateOnce), Always allow also keeps the admin command, Don't allow refuses it; the task is told
const answerParked = ($: EngineInterface, gate: Gate, said: GateSaid, card: string) => {
  const id = gate.id
  if (gatePressed.has(id)) return
  gatePressed.set(id, said)
  pressedLine($, card, gateLabel(said))
  redraw($)
  const run = (async () => {
    const now = await $.clock.now()
    if (said !== 'deny') {
      if (gate.kind === 'release') releaseAllowed.set(card, { folder: gate.folder ?? '', branch: gate.branch ?? '', at: now })
      else gateOnce.set(card, [...(gateOnce.get(card) ?? []), { kind: gate.kind === 'file' ? 'file' : 'admin', host: gate.host, command: gate.command, at: now }])
      if (said === 'always' && !gate.kind) await allowAlways($, { host: gate.host, command: gate.command }).catch(err => log($, `admin command not always allowed: ${String(err)}`))
    }
    gateParked.delete(id)
    gateWords.delete(id)
    gateNotes.delete(id)
    await setGates($, card, list => list.filter(one => one.id !== id))
    await log($, `${gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on'} ${gate.host}: ${said === 'deny' ? 'not allowed' : 'allowed once'} after words`)
    await toTask($, card, gate.from ?? card, said === 'deny' ? GATE_DENIED(gate) : GATE_ALLOWED_LATER(gate), gateLabel(said), gateWhat(gate))
    pressedLine($, card, gateLabel(said))
  })().finally(() => (gatePressed.delete(id), redraw($)))
  answersOnWay.add(run)
  void run.finally(() => answersOnWay.delete(run)).catch(err => log($, `press on a permission not sent: ${String(err)}`))
}
// What the person and the task said on a permission, under what it is about
const PERMIT_TALK_KEPT = 8

// Before a Bash call runs: each admin command in it is allowed already (never asked, this work allowed, the command always
// allowed) or waits for the press; allowed, it gets its grant. Refused, the call does not run
const gateAdmin = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ deny?: string; grants: string[] }> => {
  const calls = adminCalls(String((e as { command?: unknown }).command ?? ''), pluginRoot($))
  if (!calls.length || !dir) return { grants: [] }
  // Windows has no sudo for the runner to hand a command to: one for this PC is refused before anyone is asked
  if (isWindows && calls.some(one => one.host === 'here')) return { deny: ADMIN_NOT_HERE(), grants: [] }
  const gate = await gateOf($)
  if (gate.mode === 'never') return { grants: [] }
  const list = await ownCards($)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const grants: string[] = []
  for (const [n, call] of calls.entries()) {
    // "Once per piece of work" is for work with a card, which ends; the chat's own thread never does, so there each command asks
    const isWork = gate.mode === 'work' && Boolean(card)
    const isCovered = (isWork && workAllowed.has(top)) || (await isAllowed($, call)) || (Boolean(card) && (await takeOnce($, top, 'admin', call.host, call.command)))
    if (!isCovered) {
      const said = await holdGate($, next, { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}), ...(isWork ? { isWork: true } : {}) }, card ? top : '')
      if (said !== 'once' && said !== 'always') {
        await dropGrants($, grants)
        return { deny: said === 'deny' ? GATE_DENIED() : said === 'words' ? GATE_WORDS({}, gateWords.get(`${e.tool_use_id}-${n}`) ?? '', gateNotes.get(`${e.tool_use_id}-${n}`)) : said === 'late' ? GATE_LATE() : said === 'blind' ? GATE_BLIND() : GATE_GONE(), grants: [] }
      }
      if (said === 'always')
        await allowAlways($, call).catch(async err => {
          await log($, `admin command not always allowed: ${String(err)}`)
          pressedLine($, card ? top : '', ALWAYS_ALLOW, "it runs now, but it couldn't be saved as always allowed")
        })
      if (isWork) workAllowed.add(top)
    }
    const grant = await issueGrant($, `${e.tool_use_id}-${n}`, call)
    if (!grant) {
      pressedLine($, card ? top : '', ALLOW, "the keychain key couldn't be used, so it didn't run")
      await dropGrants($, grants)
      return { deny: GATE_UNSEALED(), grants: [] }
    }
    grants.push(grant)
  }
  return { grants }
}

// A release to main waits for the person's press on its card, as an admin command does, whatever Config says of admin commands: the
// release runner named by any spelling of its path, from the folder the command runs it in (a cd before it moves that). Allowed, it gets
// a grant naming that worktree and its branch, which bin/release takes once; its --status asks nothing
type ReleaseCall = { folder: string; branch: string; title?: string }
// The runner's own arguments, as the shell hands them: a redirection (`> log`, `2>log`, `>>log`, `<in`) and what it names are the
// shell's, never a branch. Read otherwise, `release > log` asked to release a branch called ">", whose grant the runner (on its
// own branch) refused, so the work ran it again and the person was asked twice
const releaseArgs = (words: string[]) => {
  const args: string[] = []
  for (let n = 0; n < words.length; n++) {
    const word = words[n]!
    if (/^\d*(?:>>?|<<?|>\||<>)$/.test(word)) {
      n++
      continue
    }
    if (/^\d*[<>]/.test(word)) continue
    const cut = word.search(/[<>]/)
    if (cut >= 0) {
      if (cut > 0) args.push(word.slice(0, cut))
      // `branch>log` hands the branch and sends what it prints to log; `branch> log` names the log in the next word
      if (/[<>]$/.test(word)) n++
      continue
    }
    args.push(word)
  }
  return args
}
const releaseCalls = (command: string, root: string, from: string): ReleaseCall[] => {
  let folder = from
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const found: ReleaseCall[] = []
  for (const said of shellWords(command)) {
    // `release>log` is the runner and a redirection, as the shell reads it: the runner's own word alone is split
    const words = said.flatMap(word => {
      const cut = word.search(/[<>]/)
      return cut > 0 && isAdminPath(word.slice(0, cut), root, 'release') ? [word.slice(0, cut), word.slice(cut)] : [word]
    })
    const i = commandAt(words)
    const name = progName(words[i] ?? '')
    if ((name === 'cd' || name === 'pushd') && words[i + 1]) {
      folder = pathOf(words[i + 1]!, home, folder)
      continue
    }
    // Run by a shell handed it as a script, or by itself
    const at = ['bash', 'sh', 'zsh'].includes(name) ? i + 1 + words.slice(i + 1).findIndex(one => !one.startsWith('-')) : i
    if (at < i || !isAdminPath(words[at] ?? '', root, 'release')) continue
    const args = releaseArgs(words.slice(at + 1))
    if (args[0] === '--status') continue
    const rest = args[0] === '-m' ? args.slice(2) : args
    const title = args[0] === '-m' ? oneLine(args[1] ?? '') : ''
    found.push({ folder, branch: rest[0] ?? '', ...(title ? { title: cut(title, 300) } : {}) })
  }
  return found
}
// What a press on a task's own go-ahead allows (asking.tsx, answerCleared): that card's runs of the release runner for that worktree
// and its branch until one of them goes out, within RELEASE_ALLOWED of the press and only until the card ends (state.tsx). A run
// that stopped before pushing (main changed the same lines, a check failed) is run again as the rules say, and asking again for it
// put a second Allow after Release it (21 Nov, twice). Each run keeps the branch's tip then: once one of those is on main, the
// release went out and the press is spent. Kept only in this code's memory, as every press is: no file, message or typed reply
// allows a release
const RELEASE_ALLOWED = 60 * 60_000
const RELEASE_IT = 'Release it'
const releaseAllowed = new Map<string, { folder: string; branch: string; at: number; tips?: string[] }>()
const allowRelease = async ($: EngineInterface, card: string, folder: string) => {
  const git = (args: string[]) => runOn($, ['git', '-C', folder, ...args], { timeoutMs: 15_000 }).then(r => (r.exitCode === 0 ? r.stdout.trim() : '')).catch(() => '')
  const repo = await git(['rev-parse', '--show-toplevel'])
  const branch = await git(['rev-parse', '--abbrev-ref', 'HEAD'])
  // Only a worktree on a branch, of a repo that says how it is released
  if (!repo || !branch || branch === 'HEAD' || (await $.fs.stat(`${repo}/.release`).catch(() => undefined))?.kind !== 'file') return false
  releaseAllowed.set(card, { folder: repo, branch, at: await $.clock.now() })
  await log($, `release of ${branch} from ${repo} allowed once for ${card} by ${who()}'s press on its go-ahead`)
  return true
}
// What a release puts on main, for its card: the subjects of the branch's own commits that main lacks, the newest first, and how many
// files it changes, against the remote's main (else the local one)
const RELEASE_COMMITS_SHOWN = 8
const releaseFacts = async (git: (args: string[]) => Promise<string>, branch: string): Promise<{ commits?: string[]; more?: number; files?: number }> => {
  const named = (await git(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'])) || ((await git(['rev-parse', '--verify', '-q', 'refs/remotes/origin/main'])) ? 'origin/main' : 'main')
  const subjects = (await git(['log', '--no-merges', '--format=%s', '-n', '200', `${named}..${branch}`])).split('\n').map(line => oneLine(line)).filter(Boolean)
  const changed = (await git(['diff', '--name-only', `${named}...${branch}`])).split('\n').filter(Boolean).length
  return {
    ...(subjects.length ? { commits: subjects.slice(0, RELEASE_COMMITS_SHOWN).map(one => cut(one, 200)), ...(subjects.length > RELEASE_COMMITS_SHOWN ? { more: subjects.length - RELEASE_COMMITS_SHOWN } : {}) } : {}),
    ...(changed ? { files: changed } : {}),
  }
}
// Whether a run under a go-ahead went out: one of the tips it ran with is on main as the remote has it (the runner fetches main after
// its push). A tip that could not be read counts as gone out, so nothing is let through on what was not seen
const isReleased = async (git: (args: string[]) => Promise<string>, tips: string[]) => {
  if (!tips.length) return false
  if (tips.some(tip => !tip)) return true
  const main = (await git(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'])) || 'origin/main'
  for (const tip of tips) if ((await git(['merge-base', tip, main])) === tip) return true
  return false
}
const gateRelease = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ deny?: string; grants: string[] }> => {
  const calls = releaseCalls(String((e as { command?: unknown }).command ?? ''), pluginRoot($), cwd || dir.replace(/\/\.claude\/claudopus$/, ''))
  if (!calls.length || !dir) return { grants: [] }
  const list = await ownCards($)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const grants: string[] = []
  for (const [n, call] of calls.entries()) {
    const git = (args: string[]) => runOn($, ['git', '-C', call.folder, ...args], { timeoutMs: 15_000 }).then(r => (r.exitCode === 0 ? r.stdout.trim() : '')).catch(() => '')
    const repo = await git(['rev-parse', '--show-toplevel'])
    const branch = call.branch || (await git(['rev-parse', '--abbrev-ref', 'HEAD']))
    // Not a repo, or no branch: the runner itself says what is wrong, and it releases nothing without a grant
    if (!repo || !branch || branch === 'HEAD') continue
    const id = `${e.tool_use_id}-r${n}`
    // Named by the repo itself, not the worktree's folder: a worktree's git folder is inside the repo's own
    const common = await git(['rev-parse', '--path-format=absolute', '--git-common-dir'])
    const name = (/\/\.git$/.test(common) ? common.replace(/\/\.git$/, '') : repo).split('/').pop() || repo
    // The person's press on this task's own go-ahead for this folder is the permission: no second box (allowRelease). It is
    // used once, by this card alone, within RELEASE_ALLOWED; any other release is asked on its card
    const now = await $.clock.now()
    const allowed = card ? releaseAllowed.get(top) : undefined
    const isSame = Boolean(allowed && allowed.folder === repo && allowed.branch === branch && now - allowed.at < RELEASE_ALLOWED)
    const isSpent = isSame && (await isReleased(git, allowed?.tips ?? []))
    const isPressed = isSame && !isSpent
    if (allowed && (isSpent || now - allowed.at >= RELEASE_ALLOWED)) releaseAllowed.delete(top)
    if (isPressed && allowed) {
      const tip = await git(['rev-parse', '--verify', '-q', `refs/heads/${branch}`])
      releaseAllowed.set(top, { ...allowed, tips: [...(allowed.tips ?? []), tip] })
      await log($, `release of ${branch} in ${name}: allowed by the press on its task's go-ahead${allowed.tips?.length ? ', run again as nothing went out before' : ''}`)
    }
    const said = isPressed ? 'once' : await holdGate($, next, { id, call: e.tool_use_id, kind: 'release', host: name, command: `${branch} from ${repo}`, folder: repo, branch, at: now, ...(/^\s*VERSION_FILE=\S/m.test(await readOr($, `${repo}/.release`).catch(() => '')) ? { isVersion: true } : {}), ...(e.agentId ? { from: e.agentId } : {}), ...(await releaseFacts(git, branch)), ...(call.title ? { reason: call.title } : {}) }, card ? top : '')
    if (said !== 'once') {
      await dropGrants($, grants)
      const gate = { kind: 'release' as const }
      return { deny: said === 'deny' ? GATE_DENIED(gate) : said === 'words' ? GATE_WORDS(gate, gateWords.get(id) ?? '', gateNotes.get(id)) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate), grants: [] }
    }
    const grant = await issueGrant($, id, { host: 'release', command: `${repo}\n${branch}` }, 'release-grant')
    if (!grant) {
      pressedLine($, card ? top : '', isPressed ? RELEASE_IT : ALLOW, "the keychain key couldn't be used, so nothing was released")
      await dropGrants($, grants)
      return { deny: GATE_UNSEALED(), grants: [] }
    }
    grants.push(grant)
  }
  return { grants }
}
// The person's own settings and texts in the memory folder: config.json (the admin gate's mode, the Macs reached, the name every
// text uses) and their copies of the rules and roles every chat and work runs on. Config's own acts write them without a tool call;
// work's Write or Edit there waits for the person's press on its card, showing the file and the change
const ownFileOf = (path: string) => {
  if (!dir) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const full = pathOf(path, home, cwd || home)
  const memory = dir.toLowerCase()
  const lower = full.toLowerCase()
  if (lower === `${memory}/config.json`) return 'your Claudopus settings (config.json)'
  if (lower === `${memory}/rules` || lower.startsWith(`${memory}/rules/`)) return `your rules (${full.slice(dir.length + 1)})`
  if (lower === `${memory}/roles` || lower.startsWith(`${memory}/roles/`)) return `your role file (${full.slice(dir.length + 1)})`
  // A repo's release.local, which its release runner reads as this Mac's own settings
  if (/\/\.git\/release\.local$/i.test(full)) return `${thisMac()}'s release settings (${full})`
  return ''
}
const FILE_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit']
const gateOwnFile = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<string> => {
  if (!FILE_TOOLS.includes(e.tool)) return ''
  const input = e as { file_path?: unknown; notebook_path?: unknown; content?: unknown; new_string?: unknown; old_string?: unknown; edits?: unknown; new_source?: unknown }
  const file = ownFileOf(String(input.file_path ?? input.notebook_path ?? ''))
  if (!file) return ''
  const change =
    typeof input.content === 'string'
      ? input.content
      : typeof input.new_string === 'string'
        ? `${typeof input.old_string === 'string' && input.old_string ? `In place of:\n${input.old_string}\n\nIt writes:\n` : ''}${input.new_string}`
        : Array.isArray(input.edits)
          ? input.edits.map(one => String((one as { new_string?: unknown })?.new_string ?? '')).join('\n…\n')
          : String(input.new_source ?? '')
  const list = await ownCards($)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  if (card && (await takeOnce($, top, 'file', file, cut(change, 2000)))) return ''
  const said = await holdGate($, next, { id: `${e.tool_use_id}-f`, call: e.tool_use_id, kind: 'file', host: file, command: cut(change, 2000), at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
  const gate = { kind: 'file' as const }
  return said === 'once' ? '' : said === 'deny' ? GATE_DENIED(gate) : said === 'words' ? GATE_WORDS(gate, gateWords.get(`${e.tool_use_id}-f`) ?? '', gateNotes.get(`${e.tool_use_id}-f`)) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate)
}

// What a command did to them: a command can write the person's own settings and texts, and the commands always allowed, in ways no
// reading of its text finds (a path built from variables, a program's own code, a process left running that writes later), so they
// are judged by what is in them. What each one last held as the mod or the person put it there is kept in admin-known.json, sealed
// with the gate's key as the always-allowed list is, which work never reads or writes. Every chat compares the files with it as the
// mod loads, as a message of the person's comes, as each tool call begins, as each command ends, and before the mod reads one of
// them (the texts a chat or work is told, the settings the gate and Config read). One that differs is put back as it was, whatever
// changed it and whenever, what it held is kept beside it as <file>.<time>.put-back, and a change to the settings or texts is
// shown on a card, the work's when a command of its made it, where Allow makes it again. A kept copy that is missing, or whose seal
// is not right, is never taken as what they hold: each of them there is moves aside to its .put-back copy, and is offered on a card.
// What this does not stop: a program running as the person that reads the gate's key (F-007) and seals a copy of its own
const PERSON_FILES = ['config.json', 'rules/CLAUDE.md', 'roles/chat.md', 'roles/work.md', 'admin-allowed.json']
const knownPath = () => `${dir}/admin-known.json`
const knownMessage = (files: Record<string, string | null>, count: number) => `known\n${count}\n${JSON.stringify(files)}`
// A file's text, null when there is none, undefined when it could not be read (then it is left alone)
const personRead = async ($: EngineInterface, name: string): Promise<string | null | undefined> => {
  const path = `${dir}/${name}`
  const isThere = await $.fs.exists(path).catch(() => undefined)
  if (isThere === undefined) return undefined
  return isThere ? $.fs.read(path).catch(() => undefined) : null
}
const personNow = async ($: EngineInterface) => {
  const now = new Map<string, string | null>()
  for (const name of PERSON_FILES) {
    const text = await personRead($, name)
    if (text !== undefined) now.set(name, text)
  }
  return now
}
// What this chat last found sealed, or sealed itself: the kept copy is checked again only when its text changed. A copy this chat
// took before and that was replaced since (an older copy put back) is not taken again; each carries a count one past the one before
let knownSeen: { text: string; files: Map<string, string | null>; count: number } | undefined
const knownPast = new Set<string>()
// The last read could not be checked (the keychain did not answer): not the same as a seal that is wrong
let isKnownUnsure = false
// What each file is known to hold: undefined when no sealed copy is there (missing, changed by hand, or never made)
const knownRead = async ($: EngineInterface): Promise<Map<string, string | null> | undefined> => {
  isKnownUnsure = false
  const text = await $.fs.read(knownPath()).catch(() => '')
  if (knownSeen && knownSeen.text === text) return new Map(knownSeen.files)
  if (knownPast.has(text)) return undefined
  try {
    const kept = JSON.parse(text) as { files?: Record<string, unknown>; count?: unknown; seal?: unknown }
    const files = Object.fromEntries(Object.entries(kept.files ?? {}).filter(([name, one]) => PERSON_FILES.includes(name) && (one === null || typeof one === 'string'))) as Record<string, string | null>
    const count = typeof kept.count === 'number' && Number.isSafeInteger(kept.count) ? kept.count : -1
    if (typeof kept.seal !== 'string') return undefined
    const seal = (await sealed($, 'known-read', [knownMessage(files, count)]))?.[0]
    if (seal === undefined) isKnownUnsure = true
    if (seal !== kept.seal) return undefined
    if (knownSeen) knownPast.add(knownSeen.text)
    knownSeen = { text, files: new Map(Object.entries(files)), count }
    return new Map(knownSeen.files)
  } catch {
    return undefined
  }
}
// Whether the kept copy's own key is there: 'no' only when the keychain answered that it is not, 'error' when it did not answer
const knownKey = async ($: EngineInterface): Promise<'yes' | 'no' | 'error'> => {
  if (!(await hasKeychain($))) return 'error'
  const r = await runOn($, ['/bin/sh', '-c', SEAL, 'sh', 'known-has'], { timeoutMs: 20_000 }).catch(() => undefined)
  return r?.exitCode === 0 ? 'yes' : r?.exitCode === 3 ? 'no' : 'error'
}
// Said once in a chat, at the top of the panel: while the key cannot be made or read, a change made outside Claudopus is not caught
let isKnownWarned = false
const knownWarn = ($: EngineInterface, why: string) => {
  void log($, `the kept copy of the settings and texts is not in force: ${why}`)
  if (isKnownWarned) return
  isKnownWarned = true
  $.ui.log(`Claudopus couldn't use its key in ${keptWhere()}: ${why}. Until it can, Claudopus won't undo changes made outside it to your settings or rules in this chat. Unlock the keychain, or start a new chat once it's unlocked.`)
}
const knownWrite = async ($: EngineInterface, known: Map<string, string | null>, after: number) => {
  const files = Object.fromEntries(known)
  const count = after + 1
  const seal = (await sealed($, 'known-make', [knownMessage(files, count)]))?.[0]
  if (!seal) {
    knownWarn($, "it couldn't make a seal")
    throw new Error(`the kept copy could not be sealed in ${keptWhere()}`)
  }
  const text = `${JSON.stringify({ files, count, seal }, null, 2)}\n`
  // Written beside it and moved into place, so no chat ever reads half of it
  const aside = `${knownPath()}.${count}-${Math.random().toString(36).slice(2)}.new`
  await $.fs.write(aside, text)
  const moved = await runOn($, ['mv', '-f', aside, knownPath()], { timeoutMs: 10_000 }).catch(() => undefined)
  if (moved?.exitCode !== 0) await $.fs.write(knownPath(), text)
  if (knownSeen) knownPast.add(knownSeen.text)
  knownSeen = { text, files: new Map(known), count }
}
// One chat's changes to it at a time, so two never lose each other's
let knownQueue: Promise<unknown> = Promise.resolve()
const knownSet = ($: EngineInterface, change: (known: Map<string, string | null>) => void) => {
  const step = knownQueue.then(async () => {
    // A copy that is not sealed right is built on what this chat last knew, never on what it says
    const known = (await knownRead($)) ?? new Map(knownSeen?.files ?? [])
    change(known)
    await knownWrite($, known, knownSeen?.count ?? 0)
  })
  knownQueue = step.catch(() => undefined)
  return step
}
// The mod wrote one of them itself: that is what it holds now. Kept before the file is written, so no chat takes the write for
// someone else's
const personWrote = async ($: EngineInterface, memory: string, name: string, text: string | null) => {
  if (!dir || memory !== dir || !PERSON_FILES.includes(name)) return
  await knownSet($, known => void known.set(name, text))
}
// Put back as it was; what it held is kept beside it, so nothing the person wrote is ever lost, whatever is pressed
const personPut = async ($: EngineInterface, name: string, text: string | null, is: string | null) => {
  if (is !== null) {
    const at = new Date(await $.clock.now()).toISOString().slice(0, 23).replace(/[-:]/g, '').replace('T', '-').replace('.', '')
    await $.fs.write(`${dir}/${name}.${at}${Math.random().toString(36).slice(2, 6)}.put-back`, is).catch(() => undefined)
  }
  // Taken away first, so a link put in its place is replaced, never written through
  await runOn($, ['rm', '-f', `${dir}/${name}`], { timeoutMs: 10_000 }).catch(() => undefined)
  if (text !== null) await $.fs.write(`${dir}/${name}`, text)
}
// The files compared with what they are known to hold: what differs is put back and offered on a card. `by` is the call whose
// command just ended, when one did; a change found as a call begins, or as the mod loads, is offered at the top of the panel
let personChecking: Promise<string[]> | undefined
const personCheck = async ($: EngineInterface, by?: ToolCallInput): Promise<string[]> => {
  if (!dir) return []
  // One look at a time in a chat: one asked for while another runs waits for it, then looks again
  while (personChecking) await personChecking.catch(() => undefined)
  const look = personLook($, by)
  personChecking = look
  try {
    return await look
  } finally {
    personChecking = undefined
  }
}
const personLook = async ($: EngineInterface, by?: ToolCallInput): Promise<string[]> => {
  await knownQueue
  let sealedKnown = await knownRead($)
  // Not checked, as the keychain did not answer: a chat that knows what they hold leaves them for the next look, and reads what it
  // knows meanwhile; one that knows nothing yet says so below
  if (!sealedKnown && isKnownUnsure && knownSeen) {
    knownWarn($, 'the keychain did not answer')
    return []
  }
  // No sealed copy, and this Mac never made one (no key of its own): the first load of a version that keeps one, and what is there
  // is the person's
  const key = !sealedKnown && !knownSeen ? await knownKey($) : 'yes'
  // Not sealed right as this chat first looks, where a key is: once more a moment later, as another chat may be writing it just now
  if (!sealedKnown && !knownSeen && key === 'yes') {
    await $.clock.sleep(300)
    sealedKnown = await knownRead($)
  }
  const now = await personNow($)
  // The keychain did not answer (locked, or refusing): nothing can be told apart, so the files are left as they are, and said
  if (key === 'error') {
    knownWarn($, 'the keychain did not answer')
    return []
  }
  if (key === 'no') {
    await knownSet($, kept => {
      kept.clear()
      for (const name of PERSON_FILES) if (now.has(name)) kept.set(name, now.get(name) ?? null)
    })
    await log($, 'what the settings and texts hold is kept from now on')
    return []
  }
  // No sealed copy where one was made: what this chat last knew, else (as the mod loads) shipped settings and texts, each own one
  // moved aside and offered, so a copy taken away or rewritten never decides what is in force
  const known = sealedKnown ?? (knownSeen ? new Map(knownSeen.files) : new Map<string, string | null>())
  if (!sealedKnown) await log($, knownSeen ? 'the kept copy of the settings and texts was changed or taken away: made again from what this chat knew' : 'the kept copy of the settings and texts is not sealed right: each own one is offered on a card')
  const undone: string[] = []
  for (const [name, is] of now) {
    if (personWriting.has(name)) continue
    const was = known.has(name) ? (known.get(name) ?? null) : null
    if (is === was) continue
    // The always-allowed list holds nothing its seals do not allow: one there as the copy is first made is kept
    if (name === 'admin-allowed.json' && !known.has(name)) {
      known.set(name, is)
      continue
    }
    await personPut($, name, was, is)
    undone.push(name)
    await log($, `${name} was changed outside Claudopus${by ? ' by a command' : ''}, and put back`)
    // Offered before the look ends, so the card is there once the call or the load that found it goes on (left to run on its own, a
    // slow Mac drew it late, and one begun under an earlier load could land after the next load's and take its card away)
    if (name !== 'admin-allowed.json') await offerUndone($, by, name, is).catch(err => log($, `change to ${name} not offered: ${String(err)}`))
  }
  for (const name of PERSON_FILES) if (now.has(name) && !known.has(name)) known.set(name, null)
  if (!sealedKnown) {
    for (const name of undone) known.set(name, known.get(name) ?? null)
    await knownSet($, kept => {
      kept.clear()
      for (const [name, text] of known) kept.set(name, text)
    }).catch(err => log($, `the kept copy not sealed: ${String(err)}`))
  }
  return undone
}
// One of them as the mod reads it: what it is known to hold, never a change made since, which a look puts back. A file that is not
// one of them, or a memory folder other than this chat's, is read as it is
const personText = async ($: EngineInterface, memory: string, name: string): Promise<string> => {
  const is = await readOr($, `${memory}/${name}`)
  if (!dir || memory !== dir || !PERSON_FILES.includes(name) || personWriting.has(name)) return is
  // A kept copy changed since this chat last looked (another chat's press, or anyone's write) has its seal checked first; one not
  // sealed right counts for nothing, and what this chat last knew is read
  const known = (await knownRead($).catch(() => undefined)) ?? knownSeen?.files
  if (!known) {
    void personCheck($).catch(() => undefined)
    return is
  }
  if (!known.has(name)) return is
  const was = known.get(name) ?? ''
  if (was === is) return is
  void personCheck($).catch(() => undefined)
  return was
}
// The one of these an Edit or Write call names, if any
const personNamed = (e: ToolCallInput) => {
  if (!dir) return ''
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const full = pathOf(String((e as { file_path?: unknown; notebook_path?: unknown }).file_path ?? (e as { notebook_path?: unknown }).notebook_path ?? ''), home, cwd || home)
  return PERSON_FILES.find(one => full.toLowerCase() === `${dir}/${one}`.toLowerCase()) ?? ''
}
// The ones an Edit or Write the person allowed is writing now, in this chat: not compared until it is done
const personWriting = new Set<string>()
// What an allowed Write or Edit leaves in a file that held `before`: undefined when that cannot be worked out
const personMeant = (e: ToolCallInput, before: string | null | undefined): string | undefined => {
  const input = e as { content?: unknown; old_string?: unknown; new_string?: unknown; replace_all?: unknown; edits?: unknown }
  if (e.tool === 'Write') return typeof input.content === 'string' ? input.content : undefined
  const edit = (text: string | undefined, one: { old_string?: unknown; new_string?: unknown; replace_all?: unknown }) => {
    if (text === undefined || typeof one.old_string !== 'string' || typeof one.new_string !== 'string') return undefined
    if (one.old_string === '') return text === '' ? one.new_string : undefined
    if (!text.includes(one.old_string)) return undefined
    return one.replace_all ? text.split(one.old_string).join(one.new_string) : text.replace(one.old_string, () => String(one.new_string))
  }
  if (e.tool === 'Edit') return edit(before ?? undefined, input)
  if ((e.tool as string) === 'MultiEdit' && Array.isArray(input.edits)) return input.edits.reduce<string | undefined>((text, one) => edit(text, (one ?? {}) as never), before ?? undefined)
  return undefined
}
// A file of these that Edit or Write changed, as the person allowed: what it holds now is the person's, when it is what the call
// meant to write. Anything else (a program writing in the same moment) is left for the next look to put back and offer
const personSeen = async ($: EngineInterface, e: ToolCallInput, before?: string | null) => {
  if (!dir || !FILE_TOOLS.includes(e.tool)) return
  const name = personNamed(e)
  if (!name) return
  const text = await personRead($, name)
  if (text === undefined) return
  if (text !== personMeant(e, before)) return void log($, `${name} after an allowed ${e.tool} is not what it wrote: left for the look to put back`)
  await personWrote($, dir, name, text)
}
const PERSON_UNDONE = (names: string[]) =>
  named(`This command changed ${names.join(', ')} in {name}'s memory folder, and the change was undone: {name}'s own settings and texts are changed only with the Edit or Write tool, which waits for {name}'s press on the task's card. Don't try to change them another way.`)
// The change undone, on the card of the work whose command made it, else at the top: Allow makes it again. One card for each file:
// a later change to it replaces the one shown
const offerUndone = async ($: EngineInterface, by: ToolCallInput | undefined, name: string, text: string | null) => {
  const list = await ownCards($)
  const top = by?.agentId === undefined ? '' : topOf(list, by.agentId)
  const card = list.find(one => one.id === top)
  const what = name === 'config.json' ? 'your Claudopus settings (config.json)' : name.startsWith('rules/') ? `your rules (${name})` : `your role file (${name})`
  const at = await $.clock.now()
  const id = `${by ? by.tool_use_id : `seen${at.toString(36)}`}-u-${name.replace(/[^A-Za-z0-9]/g, '')}`
  for (const [other, offer] of undoneOffers) {
    if (offer.name !== name) continue
    undoneOffers.delete(other)
    gateHeld.delete(other)
    await setGates($, offer.top, gates => gates.filter(one => one.id !== other))
  }
  // Nothing waits on it: the card offers it until pressed, and the press itself makes the change again
  undoneOffers.set(id, { name, text, top: card ? top : '' })
  gateHeld.add(id)
  gatePressed.delete(id)
  await setGates($, card ? top : '', gates => [...gates.filter(one => one.id !== id), { id, kind: 'file', isUndone: true, ...(by ? {} : { isOutside: true }), host: what, command: cut(text ?? '(the file was removed)', 2000), at, ...(by?.agentId ? { from: by.agentId } : {}) }])
  await openList($).catch(() => undefined)
  $.ui.log(`${card ? `A command of "${titleOf(card)}" changed` : by ? 'A command changed' : 'Something outside Claudopus changed'} ${what}, so Claudopus undid it. To make the change again, press Allow ${card ? 'on its card in' : 'at the top of'} the Claudopus panel. Don't allow keeps it undone.`)
}
const undoneOffers = new Map<string, { name: string; text: string | null; top: string }>()
const answerUndone = async ($: EngineInterface, gate: Gate, said: GateSaid) => {
  const offer = undoneOffers.get(gate.id)
  undoneOffers.delete(gate.id)
  gateHeld.delete(gate.id)
  const list = await ownCards($)
  await setGates($, list.some(one => one.admins?.some(g => g.id === gate.id)) ? (list.find(one => one.admins?.some(g => g.id === gate.id))?.id ?? '') : '', gates => gates.filter(one => one.id !== gate.id))
  if (said !== 'once' || !offer || !dir) return log($, `change to ${gate.host}: left undone`)
  await personWrote($, dir, offer.name, offer.text)
  await personPut($, offer.name, offer.text, null)
  await log($, `change to ${gate.host}: made again, as allowed`)
}

// A path in one line: the home folder as ~, and the middle left out past `room` characters, keeping its last folders
const shortPath = (path: string, room = 44) => {
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const p = home && (path === home || path.startsWith(`${home}/`)) ? `~${path.slice(home.length)}` : path
  if (p.length <= room) return p
  const parts = p.split('/')
  for (let keep = parts.length - 2; keep >= 1; keep--) {
    const short = `${parts[0]}/…/${parts.slice(-keep).join('/')}`
    if (short.length <= room) return short
  }
  return `…/${parts.at(-1) ?? ''}`
}
