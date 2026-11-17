// The admin gate: an admin command (bin/admin) waits for the person's press on its work's card before it runs

// config.json's "admin" says when the person is asked: "each" (as shipped) before every admin command, "work" once for a piece of
// work and its helpers until it ends, "never" not at all, as before the gate. The tool.call hook holds a Bash call that runs
// bin/admin and its work's card shows the exact command and the Mac, with Allow once, Always allow this command and Deny. The answer
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
const gateSaid = new Map<string, GateSaid>()
// A gate of the chat's own thread, which has no card (a chat that does its own work): drawn at the top of the panel
let looseGates: Gate[] = []
// The pieces of work allowed under "work", by card: taken out as the work ends (ended, in cards), so one that comes back asks again
const workAllowed = new Set<string>()
const GATE_DENIED = (gate?: Pick<Gate, 'kind'>) =>
  named(`Refused by {name}: {name} pressed Deny on this ${gate?.kind === 'release' ? "release, so nothing was released. Don't try to release it another way" : gate?.kind === 'file' ? "change, so the file was not changed. Don't try to change it another way" : "admin command, so it didn't run. Don't try to run it another way"}. Continue without it, or say what it is needed for and ask again.`)
const gateThing = (gate?: Pick<Gate, 'kind'>) => (gate?.kind === 'release' ? 'This release did not run' : gate?.kind === 'file' ? 'This change was not made' : 'This admin command did not run')
const GATE_GONE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: the wait for {name} to allow it was interrupted. Run it again if it is still needed.`)
const GATE_LATE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: {name} didn't answer in time. Run it again when it is needed, and Claudopus will ask {name} again.`)
const GATE_BLIND = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: Claudopus asks {name} first, on a card in its panel, and this chat has no panel open.`)
const GATE_UNSEALED = () => `This admin command did not run: Claudopus could not secure what was allowed in ${keptWhere()}. Run it again.`
const NO_GATE_TOUCH = () =>
  named('Claude never reads or writes the list of admin commands {name} always allows, what {name} allowed, or the key that locks them. Only {name} adds to them, with a press on a card or in Config.')

// What a gate asks, in words, by its kind: the act, and the question on its card
const gateAct = (gate: Gate) =>
  gate.isUndone ? `Make the change to ${gate.host} again` : gate.kind === 'release' ? `Release ${gate.host} to main` : gate.kind === 'file' ? `Change ${gate.host}` : `Run an admin command on ${gate.host === 'here' ? thisMac() : gate.host}`
const gateWhat = (gate: Gate) => `${gateAct(gate)}?`

// The admin commands a Bash command runs, as the shell splits it: bin/admin by any spelling of its path, after what runs a
// command it is handed, and inside a shell's -c or an eval. What the shell would build (a variable, a substitution) is read as
// written, so the grant names what was shown and bin/admin refuses what differs
const isAdminPath = (word: string, root: string, name = 'admin') => {
  const parts: string[] = []
  for (const part of word.split('/')) {
    if (part === '..' && parts.length && parts.at(-1) !== '..' && parts.at(-1) !== '') parts.pop()
    else if (part !== '.' && (part !== '' || !parts.length)) parts.push(part)
  }
  const path = parts.join('/')
  // Reached from its own folder, by the mod's own path, or by a path that names the mod or is filled in by the shell: another
  // tool that happens to be called admin is none of this
  return path === name || path === `bin/${name}` || (path.endsWith(`/bin/${name}`) && (path === `${root}/bin/${name}` || /claudopus/i.test(path) || path.includes('$')))
}
const adminCalls = (command: string, root: string, depth = 0): AdminCall[] => {
  if (depth > 4) return []
  return shellWords(command).flatMap(words => {
    let i = 0
    for (;;) {
      while (i < words.length && /^\w+=/.test(words[i]!)) i++
      const head = (words[i] ?? '').split('/').pop() ?? ''
      if (!['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'builtin', 'timeout', 'caffeinate', 'nice', 'if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{'].includes(head)) break
      i++
      while (i < words.length && (words[i]!.startsWith('-') || (head === 'sudo' && words[i - 1] === '-u') || /^\d+[smhd]?$/.test(words[i]!) || (head === 'env' && /^\w+=/.test(words[i]!)))) i++
    }
    const tool = (words[i] ?? '').split('/').pop() ?? ''
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
  # Linux: where bin/keyring keeps it, a file only this user reads, under the home folder (never XDG_DATA_HOME)
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
  const r = await $.process.run(['/bin/sh', '-c', SEAL, 'sh', mode, ...messages], { timeoutMs: 20_000 }).catch(() => undefined)
  const lines = r?.exitCode === 0 ? r.stdout.split('\n').filter(Boolean) : undefined
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
// No admin password is kept: every one an earlier version kept leaves the keychain (on Linux, bin/keyring's folder) as the mod
// loads, with the "Let macOS ask" mark kept beside the gate's key and config.json's adminPassword, which no longer choose anything
const FORGET_KEPT = 'if [ -x /usr/bin/security ]; then n=0; while [ $n -lt 50 ] && /usr/bin/security delete-generic-password -s claudopus-admin >/dev/null 2>&1; do n=$((n + 1)); done; /usr/bin/security delete-generic-password -s claudopus-admin-gate -a password >/dev/null 2>&1; else d=$HOME/.local/share; o=${XDG_DATA_HOME:-}; case $o in /*) [ "$o" != "$d" ] && [ -d "$o/claudopus/keyring" ] && [ ! -e "$d/claudopus/keyring" ] && mkdir -p "$d/claudopus" && chmod 700 "$d/claudopus" && mv "$o/claudopus/keyring" "$d/claudopus/keyring" ;; esac; rm -rf "$d/claudopus/keyring/claudopus-admin"; rm -f "$d/claudopus/keyring/claudopus-admin-gate/password"; fi; exit 0'
let isKeptForgotten = false
const forgetKeptPasswords = async ($: EngineInterface) => {
  if (isKeptForgotten || !dir) return
  isKeptForgotten = true
  if (await hasKeychain($)) await $.process.run(['/bin/sh', '-c', FORGET_KEPT], { timeoutMs: 30_000 }).catch(err => log($, `kept admin passwords not forgotten: ${String(err)}`))
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
  await $.process.run(['/usr/bin/find', grantsDir(), '-type', 'f', '-mmin', '+10', '-delete'], { timeoutMs: 10_000 }).catch(() => undefined)
  await $.fs.write(`${grantsDir()}/${name}.json`, JSON.stringify({ id: name, host: call.host, command: call.command, at, seal }))
  return name
}
const dropGrants = async ($: EngineInterface, names: string[]) => {
  for (const name of names) await $.process.run(['rm', '-f', `${grantsDir()}/${name}.json`]).catch(() => undefined)
}

// A tool call that would read or write the list, the grants or the key itself
// A command is read as written and again with its quotes and backslashes taken out, so `-"w"` or `claudopus-admin-"gate"` is read as
// the shell reads it. Any command that names the keychain's admin services (the gate's key and what Config chose, and the kept admin
// passwords) with security or the keyring runner counts, whatever it does with them
const unquoted = (command: string) => command.replace(/["'\\]/g, '')
// The runners find their key, grants and settings under the home folder, and release asks for a press only inside Claude Code: a
// command that names one and sets another home or data folder, or takes Claude Code's mark away, would have it read the caller's own
// (its comment lines left out, so a test script that makes a home of its own and only names a runner in a comment is not refused)
const RUNNER_NAMED = /\bbin\/(?:admin|secret|release|keyring)(?![\w.-])/
const RUNNER_MOVED = /(?:^|[\s;&|(`'"])(?:HOME|XDG_DATA_HOME|CLAUDECODE)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:HOME|XDG_DATA_HOME|CLAUDECODE)\b|\benv\b[^;&|\n]*\s(?:-u\s*|--unset[= ])CLAUDECODE\b|\benv\b[^;&|\n]*\s-i\b|\benv(?:\s+-\w+)*\s+-(?=\s|$)|\bexec\s+-\w*c/
// The release runs as itself (#!/bin/bash -p: no startup file, no functions from the environment), so what its shell runs, the
// GitHub checks' verdict among it, is its own: a command that names it and sets what a shell or git reads first (a startup file,
// functions, options, the PATH, git's settings), sources a script first, or starts it through a shell of its own choosing, is refused
const RELEASE_NAMED = /\bbin\/release(?![\w.-])/
const RELEASE_MOVED =
  /(?:^|[\s;&|(`'"])(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+|BASH_FUNC_\S+)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+)\b|\b(?:export|declare|typeset)\s+(?:-\w+\s+)*-\w*f|(?:^|[;&|(]\s*)(?:source|\.)\s|\b(?:ba|z|da|k|c|tc|fi)?sh\s+(?:-\S+\s+)*\S*bin\/release(?![\w.-])/
const movesRunner = (command: string) =>
  [command, unquoted(command)].map(one => one.replace(/^\s*#.*$/gm, '')).some(one => (RUNNER_NAMED.test(one) && RUNNER_MOVED.test(one)) || (RELEASE_NAMED.test(one) && RELEASE_MOVED.test(one)))
const NO_RUNNER_MOVED =
  "This command didn't run: Claudopus's runners (bin/admin, bin/secret, bin/release, bin/keyring) run with the home folder and the environment variables Claude Code gave the shell, so a command that sets HOME or XDG_DATA_HOME for one, or removes CLAUDECODE, is refused, and so is one that sets the PATH, BASH_ENV, shell options or git's settings for bin/release, sources a script before it, or starts it through a shell. Run the runner as it is."
const touchesGate = (e: ToolCallInput) => {
  if (e.tool === 'Bash') {
    const command = String((e as { command?: unknown }).command ?? '')
    return [command, unquoted(command)].some(one => /claudopus\/admin-(?:allowed\.json|grants|known\.json)\b/.test(one) || (/\b(?:security|keyring)\b/.test(one) && /claudopus-admin\b/.test(one)))
  }
  const path = String((e as { file_path?: unknown; notebook_path?: unknown }).file_path ?? (e as { notebook_path?: unknown }).notebook_path ?? '')
  return ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool) && /\/claudopus\/admin-(?:allowed\.json$|known\.json$|grants(?:\/|$))/.test(path)
}

const setGates = async ($: EngineInterface, top: string, fn: (list: Gate[]) => Gate[]) => {
  if (!top) looseGates = fn(looseGates)
  else await changeTodos($, list => list.map(one => (one.id !== top ? one : { ...one, admins: fn(one.admins ?? []).length ? fn(one.admins ?? []) : undefined })))
  redraw($)
}
// No hold outlives the copy of the mod that made it: a card that still shows one as a chat starts is cleared
const clearGates = async ($: EngineInterface) => {
  looseGates = looseGates.filter(one => gateHeld.has(one.id))
  if ((await read($, todos)).some(one => one.admins?.some(gate => !gateHeld.has(gate.id))))
    await changeTodos($, list => list.map(one => (one.admins ? { ...one, admins: one.admins.filter(gate => gateHeld.has(gate.id)).length ? one.admins.filter(gate => gateHeld.has(gate.id)) : undefined } : one)))
}
// Holds the call until the person presses. A hook's own time is bounded, and time spent in a call on the engine is not counted:
// the wait is a one-second sleep run by the engine, again and again, the press read from memory between them
const holdGate = async ($: EngineInterface, next: { signal?: AbortSignal; budget?: { remainingMs: number } }, gate: Gate, top: string): Promise<GateSaid | 'gone' | 'late' | 'blind'> => {
  if (!(await $.session.surfaces().catch(() => [])).length) return 'blind'
  gateHeld.add(gate.id)
  // A gate held afresh waits for a press of its own: a mark an earlier one of the same id left never hides it
  gatePressed.delete(gate.id)
  await setGates($, top, list => [...list.filter(one => one.id !== gate.id), gate])
  await openList($).catch(() => undefined)
  const card = top ? (await read($, todos)).find(one => one.id === top) : undefined
  const text = `${gateAct(gate)}: ${cut(oneLine(gate.command), 200)}`
  await (card ? askAloud($, card, text) : aloud($, 'ask', 'This chat has a question for you', text, `gate-${gate.id}`)).catch(err => log($, `admin command not told: ${String(err)}`))
  const act = gateAct(gate)
  $.ui.log(
    `${card ? `"${titleOf(card)}"` : 'This chat'} wants to ${act.charAt(0).toLowerCase()}${act.slice(1)}: ${cut(oneLine(gate.command), 300)}. Press ${gate.kind ? 'Allow once or Deny' : `${gate.isWork ? 'Allow for this task' : 'Allow once'}, Always allow this command or Deny`} ${card ? 'on its card in' : 'at the top of'} the Claudopus panel. /claudopus opens it. Nothing you type in the chat allows it.`,
  )
  let said: GateSaid | 'gone' | 'late' | undefined
  try {
    for (;;) {
      said = gateSaid.get(gate.id)
      if (said) break
      if (next.signal?.aborted || (await isReplaced($))) said = 'gone'
      else if ((next.budget?.remainingMs ?? Infinity) < 1500) said = 'late'
      if (said) break
      await $.process.run(['/bin/sleep', '1'], { timeoutMs: 10_000 }).catch(() => undefined)
    }
  } finally {
    gateHeld.delete(gate.id)
    gateSaid.delete(gate.id)
    await setGates($, top, list => list.filter(one => one.id !== gate.id)).catch(() => undefined)
  }
  // A press the wait did not take (it stopped waiting as the press came) is said as such where its note was
  const pressed = gatePressed.get(gate.id)
  gatePressed.delete(gate.id)
  if (pressed && pressed !== said) await gateNoteFailed($, gate, top, `It had stopped waiting when you pressed. ${gate.kind === 'release' ? 'Nothing was released.' : gate.kind === 'file' ? 'Nothing changed.' : "It didn't run."}`)
  await log($, `${gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on'} ${gate.host}: ${said === 'once' ? 'allowed once' : said === 'always' ? 'always allowed' : said === 'deny' ? 'denied' : 'not answered'}`)
  return said
}
// What a gate's note heads with: the kind of thing it let through, and where
const gateHead = (gate: Gate) => (gate.kind === 'release' ? `Release of ${gate.branch ?? gate.host}` : gate.kind === 'file' ? `Change to ${gate.host}` : `Admin command on ${gate.host === 'here' ? thisMac() : gate.host}`)
const gateWhatLine = (gate: Gate) => (gate.kind === 'release' && gate.folder ? `from ${shortPath(gate.folder)}` : gate.kind === 'file' ? '' : cut(oneLine(gate.command), 200))
// The gates pressed and not yet let go by their wait, with what was pressed: the panel draws each answered from the press itself,
// before the wait (a one-second sleep the engine runs) reads it, which kept the amber box and its buttons up to a second after the
// press (15 Nov). Only the first press counts: a second, on a drawing a moment old, sends nothing
const gatePressed = new Map<string, GateSaid>()
// What a gate's note says when what it said was allowed did not come about, in the same place, grey: never a false "allowed"
const gateNoteFailed = ($: EngineInterface, gate: Gate, card: string, said: string) =>
  doneNotes.some(one => one.id === `gate-${gate.id}`)
    ? noteDone($, { id: `gate-${gate.id}`, ...(gate.call ? { call: gate.call } : {}), ...(card ? { card } : {}), endedAt: 0, head: gateHead(gate), said, what: gateWhatLine(gate), isOn: false }).catch(() => undefined)
    : Promise.resolve()
// A call refused after a press, by another of its commands denied or not let through: nothing in it runs, so a gate of it already
// allowed says so in grey, never green
const callRefused = async ($: EngineInterface, call: string) => {
  for (const one of doneNotes.filter(note => note.call === call && note.isOn && note.id.startsWith('gate-'))) {
    const { at: _at, ...rest } = one
    await noteDone($, { ...rest, endedAt: 0, isOn: false, said: "It didn't run: another part of the same command was denied, so none of it ran." }).catch(() => undefined)
  }
}
// `card` names the work whose card the gate is on: what was done is said in that card, where the gate was
const answerGate = ($: EngineInterface, gate: Gate, said: GateSaid, card = '') => {
  presses += 1
  const id = gate.id
  // A put-back goes from the panel in the press's own drawing too, and comes back only if it could not be answered
  if (gate.isUndone) {
    if (gatePressed.has(id)) return
    gatePressed.set(id, said)
    redraw($)
    return void answerUndone($, gate, said)
      .catch(err => log($, `undone change not answered: ${String(err)}`))
      .finally(() => (gatePressed.delete(id), redraw($)))
  }
  if (gateHeld.has(id) && !gatePressed.has(id)) {
    gatePressed.set(id, said)
    gateSaid.set(id, said)
    void noteDone($, {
      id: `gate-${id}`,
      ...(gate.call ? { call: gate.call } : {}),
      ...(card ? { card } : {}),
      // Refused, nothing runs: what it says is over at once
      ...(said === 'deny' ? { endedAt: 0 } : {}),
      head: gateHead(gate),
      said:
        said === 'deny'
          ? `You denied it. ${gate.kind === 'release' ? 'Nothing was released' : gate.kind === 'file' ? 'Nothing changed' : "It didn't run"}, and Claudopus told Claude.`
          : gate.kind
            ? `You allowed it. ${gate.kind === 'release' ? 'Claude is releasing it now.' : 'Claude is making the change now.'}`
            : said === 'always'
            ? "You always allow this command. It runs now, and Claudopus won't ask again."
            : gate.isWork
              ? 'You allowed admin commands for this task. This one runs now.'
              : 'You allowed it. It runs now.',
      what: gateWhatLine(gate),
      isOn: said !== 'deny',
    }).catch(() => undefined)
  }
  redraw($)
}

// Before a Bash call runs: each admin command in it is allowed already (never asked, this work allowed, the command always
// allowed) or waits for the press; allowed, it gets its grant. Refused, the call does not run
const gateAdmin = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ deny?: string; grants: string[] }> => {
  const calls = adminCalls(String((e as { command?: unknown }).command ?? ''), $.plugin.root)
  if (!calls.length || !dir) return { grants: [] }
  const gate = await gateOf($)
  if (gate.mode === 'never') return { grants: [] }
  const list = await read($, todos)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const grants: string[] = []
  for (const [n, call] of calls.entries()) {
    // "Once per piece of work" is for work with a card, which ends; the chat's own thread never does, so there each command asks
    const isWork = gate.mode === 'work' && Boolean(card)
    const isCovered = (isWork && workAllowed.has(top)) || (await isAllowed($, call))
    if (!isCovered) {
      const said = await holdGate($, next, { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}), ...(isWork ? { isWork: true } : {}) }, card ? top : '')
      if (said !== 'once' && said !== 'always') {
        await dropGrants($, grants)
        return { deny: said === 'deny' ? GATE_DENIED() : said === 'late' ? GATE_LATE() : said === 'blind' ? GATE_BLIND() : GATE_GONE(), grants: [] }
      }
      if (said === 'always')
        await allowAlways($, call).catch(async err => {
          await log($, `admin command not always allowed: ${String(err)}`)
          const gate = { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: 0 }
          if (doneNotes.some(one => one.id === `gate-${gate.id}`)) await noteDone($, { id: `gate-${gate.id}`, call: e.tool_use_id, ...(card ? { card: top } : {}), head: gateHead(gate), said: "You allowed it. It runs now, but Claudopus couldn't save it as always allowed.", what: gateWhatLine(gate), isOn: true })
        })
      if (isWork) workAllowed.add(top)
    }
    const grant = await issueGrant($, `${e.tool_use_id}-${n}`, call)
    if (!grant) {
      await gateNoteFailed($, { id: `${e.tool_use_id}-${n}`, call: e.tool_use_id, host: call.host, command: call.command, at: 0 }, card ? top : '', "Claudopus couldn't use its keychain key. It didn't run, and Claudopus told Claude.")
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
type ReleaseCall = { folder: string; branch: string }
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
    const name = (words[i] ?? '').split('/').pop() ?? ''
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
    found.push({ folder, branch: rest[0] ?? '' })
  }
  return found
}
const gateRelease = async ($: EngineInterface, e: ToolCallInput, next: { signal?: AbortSignal; budget?: { remainingMs: number } }): Promise<{ deny?: string; grants: string[] }> => {
  const calls = releaseCalls(String((e as { command?: unknown }).command ?? ''), $.plugin.root, cwd || dir.replace(/\/\.claude\/claudopus$/, ''))
  if (!calls.length || !dir) return { grants: [] }
  const list = await read($, todos)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const grants: string[] = []
  for (const [n, call] of calls.entries()) {
    const git = (args: string[]) => $.process.run(['git', '-C', call.folder, ...args], { timeoutMs: 15_000 }).then(r => (r.exitCode === 0 ? r.stdout.trim() : '')).catch(() => '')
    const repo = await git(['rev-parse', '--show-toplevel'])
    const branch = call.branch || (await git(['rev-parse', '--abbrev-ref', 'HEAD']))
    // Not a repo, or no branch: the runner itself says what is wrong, and it releases nothing without a grant
    if (!repo || !branch || branch === 'HEAD') continue
    const id = `${e.tool_use_id}-r${n}`
    // Named by the repo itself, not the worktree's folder: a worktree's git folder is inside the repo's own
    const common = await git(['rev-parse', '--path-format=absolute', '--git-common-dir'])
    const name = (/\/\.git$/.test(common) ? common.replace(/\/\.git$/, '') : repo).split('/').pop() || repo
    const said = await holdGate($, next, { id, call: e.tool_use_id, kind: 'release', host: name, command: `${branch} from ${repo}`, folder: repo, branch, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
    if (said !== 'once') {
      await dropGrants($, grants)
      const gate = { kind: 'release' as const }
      return { deny: said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate), grants: [] }
    }
    const grant = await issueGrant($, id, { host: 'release', command: `${repo}\n${branch}` }, 'release-grant')
    if (!grant) {
      await gateNoteFailed($, { id, call: e.tool_use_id, kind: 'release', host: name, command: `${branch} from ${repo}`, folder: repo, branch, at: 0 }, card ? top : '', "Claudopus couldn't use its keychain key. Nothing was released, and Claudopus told Claude.")
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
  if (/\/\.git\/release\.local$/.test(full)) return `this Mac's release settings (${full})`
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
  const list = await read($, todos)
  const top = e.agentId === undefined ? '' : topOf(list, e.agentId)
  const card = list.find(one => one.id === top)
  const said = await holdGate($, next, { id: `${e.tool_use_id}-f`, call: e.tool_use_id, kind: 'file', host: file, command: cut(change, 2000), at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
  const gate = { kind: 'file' as const }
  return said === 'once' ? '' : said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate)
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
  const r = await $.process.run(['/bin/sh', '-c', SEAL, 'sh', 'known-has'], { timeoutMs: 20_000 }).catch(() => undefined)
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
  const moved = await $.process.run(['mv', '-f', aside, knownPath()], { timeoutMs: 10_000 }).catch(() => undefined)
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
  await $.process.run(['rm', '-f', `${dir}/${name}`], { timeoutMs: 10_000 }).catch(() => undefined)
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
  const list = await read($, todos)
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
  $.ui.log(`${card ? `A command of "${titleOf(card)}" changed` : by ? 'A command changed' : 'Something outside Claudopus changed'} ${what}, so Claudopus undid it. To make the change again, press Allow once ${card ? 'on its card in' : 'at the top of'} the Claudopus panel. Deny keeps it undone.`)
}
const undoneOffers = new Map<string, { name: string; text: string | null; top: string }>()
const answerUndone = async ($: EngineInterface, gate: Gate, said: GateSaid) => {
  const offer = undoneOffers.get(gate.id)
  undoneOffers.delete(gate.id)
  gateHeld.delete(gate.id)
  const list = await read($, todos)
  await setGates($, list.some(one => one.admins?.some(g => g.id === gate.id)) ? (list.find(one => one.admins?.some(g => g.id === gate.id))?.id ?? '') : '', gates => gates.filter(one => one.id !== gate.id))
  if (said !== 'once' || !offer || !dir) return log($, `change to ${gate.host}: left undone`)
  await personWrote($, dir, offer.name, offer.text)
  await personPut($, offer.name, offer.text, null)
  await log($, `change to ${gate.host}: made again, as allowed`)
}

// On the card: what it wants to run, whole, and the three presses. Another chat's panel shows it with no buttons: only the chat
// that holds the call allows it
// Drawn as Claude Code draws its own permission asks: an outlined box with the kind of ask at its top, never a filled card with an
// edge as work's cards are, so an ask is not taken for one more piece of work
const gateKind = (gate: Gate) => (gate.isUndone ? 'Change undone' : gate.kind === 'release' ? 'Release' : gate.kind === 'file' ? 'Change to your files' : 'Admin command')
const gateRow = ($: EngineInterface, ui: Ui, gate: Gate, key: string, isElsewhere: boolean, card = '') => (
  <ui.Box key={key} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
    <ui.Text wrap="truncate-end" dimColor>{`${gateKind(gate)} · ${gateHeld.has(gate.id) && !isElsewhere ? 'waiting for you' : isElsewhere ? 'waiting in another chat' : 'no longer waiting'}`}</ui.Text>
    <ui.Text wrap="wrap" color={NEEDS} bold>{gateWhat(gate)}</ui.Text>
    {gate.kind === 'release' && gate.folder ? (
      <ui.Box flexDirection="column">
        <ui.Text wrap="truncate-end">{`Branch ${gate.branch ?? ''}`}</ui.Text>
        <ui.Text dimColor wrap="truncate-start">{`from ${shortPath(gate.folder)}`}</ui.Text>
      </ui.Box>
    ) : gate.command ? (
      <ui.Box backgroundColor={FILL} paddingLeft={2}>
        <ui.Text mono wrap="wrap">{gate.command}</ui.Text>
      </ui.Box>
    ) : (
      <ui.Text dimColor wrap="wrap">Its details show only on its own Mac.</ui.Text>
    )}
    <ui.Text wrap="wrap">
      {gate.kind === 'release'
        ? 'Allow once: Claude merges this branch into main, checks it and pushes it with its version and tag. Deny: nothing is released, and Claudopus tells Claude.'
        : gate.isUndone && gate.isOutside
          ? 'Something outside Claudopus changed this file, maybe you in an editor or a program a command left running, so Claudopus undid it. Allow once: Claudopus makes the change again. If you made it, allow it. Deny: the file stays as it was. Either way Claudopus keeps the changed text beside it as a .put-back copy.'
          : gate.isUndone
          ? 'A command wrote to this file, so Claudopus undid it: Claude changes it only with Edit or Write, which ask you first. Allow once: Claudopus makes the change again. If you made it, allow it. Deny: the file stays as it was. Either way Claudopus keeps the changed text beside it as a .put-back copy.'
          : gate.kind === 'file'
          ? 'Allow once: Claude makes this change to your file. Deny: the file stays as it is, and Claudopus tells Claude.'
          : `${gate.isWork ? "Allow for this task: it runs as admin, and so do this task's next admin commands, without asking" : 'Allow once: it runs as admin'}. Deny: it doesn't run, and Claudopus tells Claude.`}
    </ui.Text>
    {gateHeld.has(gate.id) && !isElsewhere ? (
      <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
        <ui.Button key={`${key}-once-${loadMark}`} label={gate.isWork ? 'Allow for this task' : 'Allow once'} onPress={() => answerGate($, gate, 'once', card)} />
        {gate.kind ? null : <ui.Button key={`${key}-always-${loadMark}`} label="Always allow this command" onPress={() => answerGate($, gate, 'always', card)} />}
        <ui.Button key={`${key}-deny-${loadMark}`} label="Deny" onPress={() => answerGate($, gate, 'deny', card)} />
      </ui.Box>
    ) : (
      <ui.Text dimColor wrap="wrap">{isElsewhere ? 'Allow or deny it on its card in its own chat.' : "It's no longer waiting for you."}</ui.Text>

    )}
  </ui.Box>
)
// The gates on a work's card, and once one is answered, what was done in the same place, outlined green (grey once refused)
const adminBlock = ($: EngineInterface, ui: Ui, one: Todo, key: string, at: number) =>
  one.admins?.some(gate => !gatePressed.has(gate.id)) || cardNotesOf(one.id, at).length ? (
    <ui.Box key={key} flexDirection="column" gap={1}>
      {(one.admins ?? []).filter(gate => !gatePressed.has(gate.id)).map(gate => gateRow($, ui, gate, `gate-${gate.id}`, Boolean(one.chat), one.chat ? '' : one.id))}
      {cardNotesPart(ui, one.id, at)}
    </ui.Box>
  ) : null
// A gate with no card, at the top of the panel
const gatesPart = ($: EngineInterface, ui: Ui) => looseGates.filter(gate => !gatePressed.has(gate.id)).map(gate => gateRow($, ui, gate, `gate-${gate.id}`, false))
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
