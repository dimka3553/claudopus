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
  named(`Refused by {name}: {name} pressed Deny on this ${gate?.kind === 'release' ? 'release, so nothing was released. Do not try to release it another way' : gate?.kind === 'file' ? 'change, so the file was not changed. Do not try to change it another way' : 'admin command, so it did not run. Do not try to run it another way'}. Carry on without it, or say what it is needed for and ask again.`)
const gateThing = (gate?: Pick<Gate, 'kind'>) => (gate?.kind === 'release' ? 'This release did not run' : gate?.kind === 'file' ? 'This change was not made' : 'This admin command did not run')
const GATE_GONE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: the wait for {name} to allow it was cut short. Run it again if it is still needed.`)
const GATE_LATE = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: {name} did not answer in the time a call can be held. Run it again when it is needed, and {name} is asked again.`)
const GATE_BLIND = (gate?: Pick<Gate, 'kind'>) => named(`${gateThing(gate)}: {name} is asked first, on a card in the Claudopus panel, and no panel is drawn for this chat.`)
const GATE_UNSEALED = () => `This admin command did not run: what was allowed could not be sealed in ${keptWhere()}. Run it again.`
const NO_GATE_TOUCH = () =>
  named('The list of admin commands {name} always allows, what {name} allowed and the key that seals them are never read or written by work: only {name} adds to them, with a press on a card or in Config.')

// What a gate asks, in words, by its kind
const gateWhat = (gate: Gate) =>
  gate.kind === 'release' ? `Wants to release ${gate.host} to its main branch` : gate.kind === 'file' ? `Wants to change ${gate.host}` : `Wants to run an admin command on ${gate.host === 'here' ? thisMac() : gate.host}`

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
if [ -x /usr/bin/security ]; then
  key() { /usr/bin/security find-generic-password -s ${GATE_SERVICE} -a seal -w 2>/dev/null; }
  keep() { printf 'add-generic-password -U -s "${GATE_SERVICE}" -a "seal" -l "Claudopus admin gate" -w "%s"\\n' "$1" | /usr/bin/security -i >/dev/null 2>&1; }
else
  # Linux: where bin/keyring keeps it, a file only this user reads
  d=\${XDG_DATA_HOME:-$HOME/.local/share}
  case $d in /*) ;; *) d=$HOME/.local/share ;; esac
  f=$d/claudopus/keyring/${GATE_SERVICE}
  key() { [ -f "$f/seal" ] && cat "$f/seal" 2>/dev/null; }
  keep() { (umask 077; mkdir -p "$f" && chmod 700 "$d/claudopus" "$d/claudopus/keyring" "$f" && printf '%s' "$1" >"$f/.seal.new" && mv -f "$f/.seal.new" "$f/seal"); }
fi
k=$(key)
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
const sealed = async ($: EngineInterface, mode: 'read' | 'make' | 'new', messages: string[]) => {
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
    const kept = JSON.parse((await readOr($, allowedPath())) || '{}') as Record<string, unknown>
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
  return $.fs.write(allowedPath(), `${JSON.stringify(kept, null, 2)}\n`)
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
const FORGET_KEPT = 'if [ -x /usr/bin/security ]; then n=0; while [ $n -lt 50 ] && /usr/bin/security delete-generic-password -s claudopus-admin >/dev/null 2>&1; do n=$((n + 1)); done; /usr/bin/security delete-generic-password -s claudopus-admin-gate -a password >/dev/null 2>&1; else d=${XDG_DATA_HOME:-$HOME/.local/share}; case $d in /*) ;; *) d=$HOME/.local/share ;; esac; rm -rf "$d/claudopus/keyring/claudopus-admin"; rm -f "$d/claudopus/keyring/claudopus-admin-gate/password"; fi; exit 0'
let isKeptForgotten = false
const forgetKeptPasswords = async ($: EngineInterface) => {
  if (isKeptForgotten || !dir) return
  isKeptForgotten = true
  await $.process.run(['/bin/sh', '-c', FORGET_KEPT], { timeoutMs: 30_000 }).catch(err => log($, `kept admin passwords not forgotten: ${String(err)}`))
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
const movesRunner = (command: string) =>
  [command, unquoted(command)].map(one => one.replace(/^\s*#.*$/gm, '')).some(one => RUNNER_NAMED.test(one) && RUNNER_MOVED.test(one))
const NO_RUNNER_MOVED =
  "This command did not run: Claudopus's runners (bin/admin, bin/secret, bin/release, bin/keyring) run with the home folder and the marks Claude Code gave the shell, so a command that sets HOME or XDG_DATA_HOME for one, or takes CLAUDECODE away, is refused. Run the runner as it is."
const touchesGate = (e: ToolCallInput) => {
  if (e.tool === 'Bash') {
    const command = String((e as { command?: unknown }).command ?? '')
    return [command, unquoted(command)].some(one => /claudopus\/admin-(?:allowed\.json|grants)\b/.test(one) || (/\b(?:security|keyring)\b/.test(one) && /claudopus-admin\b/.test(one)))
  }
  const path = String((e as { file_path?: unknown; notebook_path?: unknown }).file_path ?? (e as { notebook_path?: unknown }).notebook_path ?? '')
  return ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool) && /\/claudopus\/admin-(?:allowed\.json$|grants(?:\/|$))/.test(path)
}

const setGates = async ($: EngineInterface, top: string, fn: (list: Gate[]) => Gate[]) => {
  if (!top) looseGates = fn(looseGates)
  else await update($, todos, list => list.map(one => (one.id !== top ? one : { ...one, admins: fn(one.admins ?? []).length ? fn(one.admins ?? []) : undefined })))
  redraw($)
}
// No hold outlives the copy of the mod that made it: a card that still shows one as a chat starts is cleared
const clearGates = async ($: EngineInterface) => {
  looseGates = looseGates.filter(one => gateHeld.has(one.id))
  if ((await read($, todos)).some(one => one.admins?.some(gate => !gateHeld.has(gate.id))))
    await update($, todos, list => list.map(one => (one.admins ? { ...one, admins: one.admins.filter(gate => gateHeld.has(gate.id)).length ? one.admins.filter(gate => gateHeld.has(gate.id)) : undefined } : one)))
}
// Holds the call until the person presses. A hook's own time is bounded, and time spent in a call on the engine is not counted:
// the wait is a one-second sleep run by the engine, again and again, the press read from memory between them
const holdGate = async ($: EngineInterface, next: { signal?: AbortSignal; budget?: { remainingMs: number } }, gate: Gate, top: string): Promise<GateSaid | 'gone' | 'late' | 'blind'> => {
  if (!(await $.session.surfaces().catch(() => [])).length) return 'blind'
  gateHeld.add(gate.id)
  await setGates($, top, list => [...list.filter(one => one.id !== gate.id), gate])
  await openList($).catch(() => undefined)
  const card = top ? (await read($, todos)).find(one => one.id === top) : undefined
  const text = `${gateWhat(gate)}: ${cut(oneLine(gate.command), 200)}`
  await (card ? askAloud($, card, text) : aloud($, 'ask', gate.kind === 'release' ? 'A release needs you' : gate.kind === 'file' ? 'A change to your settings needs you' : 'An admin command needs you', text, `gate-${gate.id}`)).catch(err => log($, `admin command not told: ${String(err)}`))
  $.ui.log(
    `${card ? `The work "${titleOf(card)}"` : 'This chat'} ${gateWhat(gate).replace(/^Wants/, 'wants')}: ${cut(oneLine(gate.command), 300)} · Press ${gate.kind ? 'Allow once or Deny' : `${gate.isWork ? 'Allow for this work' : 'Allow once'}, Always allow this command or Deny`} ${card ? 'on its card' : 'at the top'} in the Claudopus panel (/claudopus opens it). Nothing typed in the chat allows it.`,
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
  await log($, `${gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on'} ${gate.host}: ${said === 'once' ? 'allowed once' : said === 'always' ? 'always allowed' : said === 'deny' ? 'denied' : 'not answered'}`)
  return said
}
const answerGate = ($: EngineInterface, gate: Gate, said: GateSaid) => {
  presses += 1
  const id = gate.id
  if (gateHeld.has(id)) {
    gateSaid.set(id, said)
    void noteDone($, {
      id: `gate-${id}`,
      head: gate.kind === 'release' ? `A release of ${gate.host}` : gate.kind === 'file' ? `A change to ${gate.host}` : `An admin command on ${gate.host === 'here' ? thisMac() : gate.host}`,
      said:
        said === 'deny'
          ? `You denied it · ${gate.kind === 'release' ? 'nothing was released' : gate.kind === 'file' ? 'nothing was changed' : 'it did not run'}, and the work was told`
          : gate.kind
            ? `You allowed it once · ${gate.kind === 'release' ? 'it releases now' : 'the change is made now'}`
            : said === 'always'
            ? 'You always allow this command · it runs now, and will not ask again'
            : gate.isWork
              ? "You allowed this work's admin commands · it runs now"
              : 'You allowed it once · it runs now',
      what: cut(oneLine(gate.command), 200),
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
      const said = await holdGate($, next, { id: `${e.tool_use_id}-${n}`, host: call.host, command: call.command, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}), ...(isWork ? { isWork: true } : {}) }, card ? top : '')
      if (said !== 'once' && said !== 'always') {
        await dropGrants($, grants)
        return { deny: said === 'deny' ? GATE_DENIED() : said === 'late' ? GATE_LATE() : said === 'blind' ? GATE_BLIND() : GATE_GONE(), grants: [] }
      }
      if (said === 'always') await allowAlways($, call).catch(err => log($, `admin command not always allowed: ${String(err)}`))
      if (isWork) workAllowed.add(top)
    }
    const grant = await issueGrant($, `${e.tool_use_id}-${n}`, call)
    if (!grant) {
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
const releaseCalls = (command: string, root: string, from: string): ReleaseCall[] => {
  let folder = from
  const home = dir.replace(/\/\.claude\/claudopus$/, '')
  const found: ReleaseCall[] = []
  for (const words of shellWords(command)) {
    const i = commandAt(words)
    const name = (words[i] ?? '').split('/').pop() ?? ''
    if ((name === 'cd' || name === 'pushd') && words[i + 1]) {
      folder = pathOf(words[i + 1]!, home, folder)
      continue
    }
    // Run by a shell handed it as a script, or by itself
    const at = ['bash', 'sh', 'zsh'].includes(name) ? i + 1 + words.slice(i + 1).findIndex(one => !one.startsWith('-')) : i
    if (at < i || !isAdminPath(words[at] ?? '', root, 'release')) continue
    const args = words.slice(at + 1)
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
    const said = await holdGate($, next, { id, kind: 'release', host: repo.split('/').pop() ?? repo, command: `${branch} from ${repo}`, at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
    if (said !== 'once') {
      await dropGrants($, grants)
      const gate = { kind: 'release' as const }
      return { deny: said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate), grants: [] }
    }
    const grant = await issueGrant($, id, { host: 'release', command: `${repo}\n${branch}` }, 'release-grant')
    if (!grant) {
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
  if (lower === `${memory}/roles` || lower.startsWith(`${memory}/roles/`)) return `your role text (${full.slice(dir.length + 1)})`
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
  const said = await holdGate($, next, { id: `${e.tool_use_id}-f`, kind: 'file', host: file, command: cut(change, 2000), at: await $.clock.now(), ...(e.agentId ? { from: e.agentId } : {}) }, card ? top : '')
  const gate = { kind: 'file' as const }
  return said === 'once' ? '' : said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate)
}

// On the card: what it wants to run, whole, and the three presses. Another chat's panel shows it with no buttons: only the chat
// that holds the call allows it
const gateRow = ($: EngineInterface, ui: Ui, gate: Gate, key: string, isElsewhere: boolean) => (
  <ui.Box key={key} flexDirection="column" gap={1}>
    <ui.Text wrap="wrap" color={NEEDS} bold>{gateWhat(gate)}</ui.Text>
    {gate.command ? (
      <ui.Box backgroundColor={FILL} paddingLeft={2}>
        <ui.Text mono wrap="wrap">{gate.command}</ui.Text>
      </ui.Box>
    ) : (
      <ui.Text dimColor wrap="wrap">What it is is shown only on its own Mac.</ui.Text>
    )}
    <ui.Text wrap="wrap">
      {gate.kind === 'release'
        ? 'Allow: this branch is merged into main, checked and pushed, with its version and tag. Deny: nothing is released, and the work is told.'
        : gate.kind === 'file'
          ? 'Allow: the change is made to this file of yours. Deny: the file stays as it is, and the work is told.'
          : `Allow: it runs with admin rights${gate.isWork ? ', and this work runs its next admin commands without asking' : ''}. Deny: it does not run, and the work is told.`}
    </ui.Text>
    {gateHeld.has(gate.id) && !isElsewhere ? (
      <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
        <ui.Button key={`${key}-once-${loadMark}`} label={gate.isWork ? 'Allow for this work' : 'Allow once'} onPress={() => answerGate($, gate, 'once')} />
        {gate.kind ? null : <ui.Button key={`${key}-always-${loadMark}`} label="Always allow this command" onPress={() => answerGate($, gate, 'always')} />}
        <ui.Button key={`${key}-deny-${loadMark}`} label="Deny" onPress={() => answerGate($, gate, 'deny')} />
      </ui.Box>
    ) : (
      <ui.Text dimColor wrap="wrap">{isElsewhere ? 'Allow or deny it on its card in its own chat.' : 'It no longer waits.'}</ui.Text>
    )}
  </ui.Box>
)
const adminBlock = ($: EngineInterface, ui: Ui, one: Todo, key: string) =>
  one.admins?.length ? (
    <ui.Box key={key} flexDirection="column" gap={1}>
      {one.admins.map(gate => gateRow($, ui, gate, `gate-${gate.id}`, Boolean(one.chat)))}
    </ui.Box>
  ) : null
// A gate with no card, at the top of the panel
const gatesPart = ($: EngineInterface, ui: Ui) =>
  looseGates.map(gate => (
    <ui.Box key={`gate-top-${gate.id}`} flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      {gateRow($, ui, gate, `gate-${gate.id}`, false)}
    </ui.Box>
  ))
