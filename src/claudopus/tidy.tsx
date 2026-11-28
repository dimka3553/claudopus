// ---- What tasks leave behind, and the disk it fills ----
// On 19 Nov the person's Mac had under 1 GB of disk free: 205 copies Google Chrome made of itself each time a task started it
// without a window and it was stopped, 88 scratch folders of catch-up runs that were stopped (9.7 GB), browser profiles, task
// scratch folders untouched for days (36 GB) and worktrees merged long ago (19 GB). bin/tidy removes what is left of each and
// keeps what may matter (it says what); every chat starts it as it starts the catch-up, and again as a task ends, and it runs at
// most every ten minutes, one at a time. The disk is looked at every half minute or minute (lookDisk): under DISK_WARN the panel says so at its top,
// with Free up space, and a notification says it once every few hours; under DISK_STOP a task's download, install, build,
// render or browser command is refused at once with why
const TIDY_AFTER = 2 * 60_000
const TIDY_EVERY = 10 * 60_000
const DISK_EVERY = 30_000
const DISK_WARN = 20 * 1024 ** 3
const DISK_STOP = 5 * 1024 ** 3
const DISK_TOLD_EVERY = 6 * 3600_000
type DiskKept = { at: number; free: number; total: number }
let diskKept: DiskKept | undefined
let diskTriedAt = -Infinity
let isDiskForced = false
let diskLowSince = 0
let diskToldAt = -Infinity
// The person's press on Free up space, and what the last run of bin/tidy freed (its tidy/last.json)
let tidyPressedAt = 0
// and the person's big new files, which it never removes (28 Nov: a 113 GB screen recording)
type BigFile = { path: string; bytes: number }
let tidyLast: { at: number; freed: number; big: BigFile[] } | undefined

// In a session of its own, at a low priority, as the catch-up: it outlives the chat, and its log is set aside past a megabyte
const TIDY_START = `d=$1; shift; l="$d/tidy/log.txt"; mkdir -p "$d/tidy" || exit 1; [ -f "$l" ] && [ "$(wc -c < "$l")" -gt 1000000 ] && mv -f "$l" "$l.old"; nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' nice -n 10 "$@" >> "$l" 2>&1 < /dev/null &`
// On Windows nothing lists the commands that run with the folders they run in, which bin/tidy needs to know what is safe to
// remove, so it is not started there, and the disk's block has no Free up space
const startTidy = async ($: EngineInterface, flags: string[] = []) => {
  if (!dir || isOff || isWindows) return
  // Nothing is started while bin/tidy would end at once: its own stamp says a run began under its ten minutes ago
  const stamp = flags.length ? 0 : ((await $.fs.stat(`${dir}/tidy/stamp`).catch(() => undefined))?.mtimeMs ?? 0)
  const at = stamp ? await $.clock.now() : 0
  if (stamp && at >= stamp && at - stamp < TIDY_EVERY) return
  const r = await runOn($, ['/bin/sh', '-c', TIDY_START, 'sh', dir, `${pluginRoot($)}/bin/tidy`, ...flags, dir])
  if (r.exitCode !== 0) await log($, `leftovers not tidied: ${r.stderr.slice(0, 200)}`)
}

// The disk the person's files are on, as df gives it in kilobytes: its size, what is used, what is left; and after it the power, as
// the usage look reads it (whether the computer runs on its battery), so a chat with no work running knows it too
const DISK_LOOK =
  "# disk left\ndf -Pk \"$HOME\" 2>/dev/null | tail -n 1; echo @@POWER@@; if [ -d /sys/class/power_supply ]; then grep -H '' /sys/class/power_supply/*/type /sys/class/power_supply/*/scope /sys/class/power_supply/*/capacity /sys/class/power_supply/*/status 2>/dev/null; else pmset -g batt 2>/dev/null; fi; true"
const diskOf = (text: string, at: number): DiskKept | undefined => {
  const m = /(\d+)\s+(\d+)\s+(\d+)\s+\d+%/.exec(text)
  return m ? { at, total: Number(m[1]) * 1024, free: Number(m[3]) * 1024 } : undefined
}
const lastOf = (text: string) => {
  try {
    const j = JSON.parse(text) as { at?: unknown; freed?: unknown; big?: unknown }
    return typeof j.at === 'number' ? { at: j.at, freed: typeof j.freed === 'number' ? j.freed : 0, big: Array.isArray(j.big) ? (j.big as BigFile[]) : [] } : undefined
  } catch {
    return undefined
  }
}
const isDiskLow = (d: DiskKept | undefined) => Boolean(d && d.free < DISK_WARN)
const bigLine = (one: BigFile) => {
  const parts = one.path.split(/[\\/]/)
  const at = parts.find(part => /^(?:Desktop|Movies|Downloads)$/.test(part))
  return `“${parts.at(-1)}”${!at ? '' : at === 'Desktop' ? ' on your Desktop' : ` in your ${at}`}, ${gbText(one.bytes)} GB`
}
const isDiskFull = (d: DiskKept | undefined) => Boolean(d && d.free < DISK_STOP)

// One look when the last is due: the panel redraws when what it says changes, and a disk that runs low is told once in a while
const lookDisk = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now >= diskTriedAt && now - diskTriedAt < DISK_EVERY / 2) return diskKept
  diskTriedAt = now
  // One chat looks for every chat on this computer, through a small file beside the usage line's: every minute while far more
  // is free than the warning needs, as often as before once it nears it, and at once after the person's press
  const path = (await usagePathOf($)).replace(/usage\.json$/, 'disk.json')
  const shared = parsedOr<{ at?: unknown; out?: unknown }>(await $.fs.read(path).catch(() => ''), {}) ?? {}
  const sharedAt = Number(shared.at) || 0
  const every = isDiskLow(diskKept) ? DISK_EVERY / 2 : diskKept && diskKept.free > 2 * DISK_WARN ? 1.5 * DISK_EVERY : DISK_EVERY - 1000
  let out = !isDiskForced && typeof shared.out === 'string' && now >= sharedAt && now - sharedAt < every ? shared.out : undefined
  isDiskForced = false
  if (out === undefined) {
    await $.fs.write(path, JSON.stringify({ ...shared, at: now })).catch(() => undefined)
    out = (await runOn($, ['sh', '-c', DISK_LOOK], { timeoutMs: 5000 }).catch(() => undefined))?.stdout ?? ''
    if (out) await $.fs.write(path, JSON.stringify({ at: now, out })).catch(() => undefined)
  }
  const was = diskKept
  const wasLast = tidyLast
  const [disk = '', power] = out.split('@@POWER@@')
  diskKept = diskOf(disk, now) ?? diskKept
  if (power !== undefined) isOnBattery = isOnBatteryLook(power, isLinux)
  if (dir) tidyLast = lastOf(await $.fs.read(`${dir}/tidy/last.json`).catch(() => '')) ?? tidyLast
  if (!isDiskLow(diskKept)) diskLowSince = 0
  else if (!diskLowSince) diskLowSince = now
  const said = (d: DiskKept | undefined) => (isDiskLow(d) ? `${gbText(d?.free ?? 0)}:${isDiskFull(d)}` : '')
  if (said(was) !== said(diskKept) || wasLast?.at !== tidyLast?.at) drawAgain($)
  if (diskKept && isDiskLow(diskKept) && !isOff) await tellDisk($, diskKept, now)
  return diskKept
}
// A notification, once in DISK_TOLD_EVERY, whichever chat looks first
const tellDisk = async ($: EngineInterface, d: DiskKept, now: number) => {
  if (now >= diskToldAt && now - diskToldAt < DISK_TOLD_EVERY) return
  diskToldAt = now
  const told = dir ? Number(await $.fs.read(`${dir}/tidy/told`).catch(() => '0')) || 0 : 0
  if (now >= told && now - told < DISK_TOLD_EVERY) return
  if (dir) await $.fs.write(`${dir}/tidy/told`, String(now)).catch(() => undefined)
  await alertPerson($, 'disk', `Your ${machineWord()} is almost out of disk space`, isWindows ? `${gbText(d.free)} GB left.` : `${gbText(d.free)} GB left. Free up space from the Claudopus panel.`, 'disk-low')
}

// The person's press: bin/tidy at once, with the download caches too; the block says it frees space until its run ends
const freeSpace = async ($: EngineInterface) => {
  tidyPressedAt = await $.clock.now()
  presses += 1
  diskTriedAt = -Infinity
  isDiskForced = true
  drawAgain($)
  await log($, 'the person asked to free up disk space')
  await startTidy($, ['--now', '--deep'])
}

// The block at the top of the panel while the disk is low
const diskNeeds = ($: EngineInterface): Need[] => {
  const d = diskKept
  if (!dir || isOff || !d || !isDiskLow(d)) return []
  const isDone = Boolean(tidyPressedAt && tidyLast && tidyLast.at >= tidyPressedAt)
  const isFreeing = Boolean(tidyPressedAt) && !isDone
  const stop = gbText(DISK_STOP)
  return [
    {
      id: 'disk-low',
      kind: 'disk',
      at: diskLowSince || d.at,
      text: `Your ${machineWord()} has ${gbText(d.free)} GB of disk space left.${isWindows ? '' : ' Free up space?'}`,
      details: [
        isDiskFull(d) ? `Tasks' downloads, installs, builds, renders and browser commands wait until more than ${stop} GB is free.` : `Below ${stop} GB, tasks' downloads, installs, builds, renders and browser commands wait.`,
        isWindows
          ? "Free up space isn't on Windows yet. Remove what tasks left behind yourself: their scratch folders, browser profiles and code copies whose work is merged."
          : 'Free up space removes what tasks left behind: temporary files, copies Chrome made of itself, browser profiles, scratch folders untouched for 2 days, code copies whose work is merged, packages of code copies idle for 2 days, and download caches. Pictures a result shows move into its folder first. Your CT data, photos, videos and Desktop are never touched.',
        ...(tidyLast?.big.length ? [`Your big new files, which only you can delete: ${tidyLast.big.map(bigLine).join('; ')}.`] : []),
      ].join('\n\n'),
      buttons: isFreeing || isWindows ? [] : [{ key: `disk-free-${tidyPressedAt}-${presses}`, label: 'Free up space', onPress: () => void freeSpace($).catch(err => log($, `space not freed: ${String(err)}`)) }],
      ...(isFreeing ? { line: 'Freeing up space' } : isDone && tidyLast ? { line: `Freed ${gbText(tidyLast.freed)} GB` } : {}),
    },
  ]
}

// Whether a task's command may run: refused at once with why, else '' (the disk running out, or Chrome copied for nothing)
const CHROME_APP = /\/Google Chrome\.app\/Contents\/MacOS\/Google Chrome(?![\w ]*(?:Helper|for Testing))/
const CHROME_IN_SCRIPT = /executablePath\s*[:=]\s*[^\n]*\/Google Chrome\.app\b|\bchannel\s*[:=]\s*['"]chrome(?:-beta|-dev|-canary)?['"]/
const DISK_FULL = (what: string, d: DiskKept) =>
  named(`Not run: the ${machineWord()} has ${gbText(d.free)} GB of disk space left, and "${what}" can fill it. Remove what you made that is no longer needed (your scratch folder, temporary files), run heavy work in the cloud, and send the same command again once more than ${gbText(DISK_STOP)} GB is free.${isWindows ? '' : ' {Name} can free up space from the Claudopus panel.'}`)
const turnLeftovers = async ($: EngineInterface, e: ToolCallInput) => {
  const input = e as { command?: unknown; description?: unknown }
  const command = String(input.command ?? '')
  const agent = e.agentId ?? ''
  if (!command || !(await ownCards($)).some(one => one.id === agent && !one.chat)) return ''
  const scripts = await scriptsRun($, command)
  const plain = command.replace(/\\ /g, ' ').replace(/["']/g, '')
  if ((CHROME_APP.test(plain) && /--headless\b/.test(plain)) || scripts.some(text => CHROME_IN_SCRIPT.test(text) || (CHROME_APP.test(text) && /--headless\b/.test(text)))) {
    await log($, `refused work ${agent}'s command that starts the person's own Chrome without a window`)
    return CHROME_COPIED
  }
  if (!heavyOf(command, scripts) && jobKindOf(command, '') !== 'download') return ''
  const d = await lookDisk($).catch(() => diskKept)
  if (!d || !isDiskFull(d)) return ''
  await log($, `refused work ${agent}'s command while the disk has ${gbText(d.free)} GB left`)
  return DISK_FULL(cut(oneLine(String(input.description ?? '')) || labelOf('', command), 120), d)
}
