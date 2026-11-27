// ---- What tasks leave behind, and the disk it fills ----
// On 19 Nov the person's Mac had under 1 GB of disk free: 205 copies Google Chrome made of itself each time a task started it
// without a window and it was stopped, 88 scratch folders of catch-up runs that were stopped (9.7 GB), browser profiles, task
// scratch folders untouched for days (36 GB) and worktrees merged long ago (19 GB). bin/tidy removes what is left of each and
// keeps what may matter (it says what); every chat starts it as it starts the catch-up, and again as a task ends, and it runs at
// most every ten minutes, one at a time. The disk is looked at every half minute: under DISK_WARN the panel says so at its top,
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
let diskLowSince = 0
let diskToldAt = -Infinity
// The person's press on Free up space, and what the last run of bin/tidy freed (its tidy/last.json)
let tidyPressedAt = 0
let tidyLast: { at: number; freed: number } | undefined

// In a session of its own, at a low priority, as the catch-up: it outlives the chat, and its log is set aside past a megabyte
const TIDY_START = `d=$1; shift; l="$d/tidy/log.txt"; mkdir -p "$d/tidy" || exit 1; [ -f "$l" ] && [ "$(wc -c < "$l")" -gt 1000000 ] && mv -f "$l" "$l.old"; nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' nice -n 10 "$@" >> "$l" 2>&1 < /dev/null &`
const startTidy = async ($: EngineInterface, flags: string[] = []) => {
  if (!dir || isOff) return
  const r = await $.process.run(['/bin/sh', '-c', TIDY_START, 'sh', dir, `${$.plugin.root}/bin/tidy`, ...flags, dir])
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
    const j = JSON.parse(text) as { at?: unknown; freed?: unknown }
    return typeof j.at === 'number' ? { at: j.at, freed: typeof j.freed === 'number' ? j.freed : 0 } : undefined
  } catch {
    return undefined
  }
}
const isDiskLow = (d: DiskKept | undefined) => Boolean(d && d.free < DISK_WARN)
const isDiskFull = (d: DiskKept | undefined) => Boolean(d && d.free < DISK_STOP)

// One look when the last is due: the panel redraws when what it says changes, and a disk that runs low is told once in a while
const lookDisk = async ($: EngineInterface) => {
  const now = await $.clock.now()
  if (now >= diskTriedAt && now - diskTriedAt < DISK_EVERY / 2) return diskKept
  diskTriedAt = now
  const r = await $.process.run(['sh', '-c', DISK_LOOK], { timeoutMs: 5000 }).catch(() => undefined)
  const was = diskKept
  const wasLast = tidyLast
  const [disk = '', power] = (r?.stdout ?? '').split('@@POWER@@')
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
  await alertPerson($, 'disk', 'Your Mac is almost out of disk space', `${gbText(d.free)} GB left. Free up space from the Claudopus panel.`, 'disk-low')
}

// The person's press: bin/tidy at once, with the download caches too; the block says it frees space until its run ends
const freeSpace = async ($: EngineInterface) => {
  tidyPressedAt = await $.clock.now()
  presses += 1
  diskTriedAt = -Infinity
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
      text: `Your Mac has ${gbText(d.free)} GB of disk space left. Free up space?`,
      details: [
        isDiskFull(d) ? `Tasks' downloads, installs, builds, renders and browser commands wait until more than ${stop} GB is free.` : `Below ${stop} GB, tasks' downloads, installs, builds, renders and browser commands wait.`,
        'Free up space removes what tasks left behind: temporary files, copies Chrome made of itself, browser profiles, scratch folders untouched for 2 days, code copies whose work is merged, and download caches. Pictures a result shows move into its folder first. Your CT data, photos, videos and Desktop are never touched.',
      ].join('\n\n'),
      buttons: isFreeing ? [] : [{ key: `disk-free-${tidyPressedAt}-${presses}`, label: 'Free up space', onPress: () => void freeSpace($).catch(err => log($, `space not freed: ${String(err)}`)) }],
      ...(isFreeing ? { line: 'Freeing up space' } : isDone && tidyLast ? { line: `Freed ${gbText(tidyLast.freed)} GB` } : {}),
    },
  ]
}

// Whether a task's command may run: refused at once with why, else '' (the disk running out, or Chrome copied for nothing)
const CHROME_APP = /\/Google Chrome\.app\/Contents\/MacOS\/Google Chrome(?![\w ]*(?:Helper|for Testing))/
const CHROME_IN_SCRIPT = /executablePath\s*[:=]\s*[^\n]*\/Google Chrome\.app\b|\bchannel\s*[:=]\s*['"]chrome(?:-beta|-dev|-canary)?['"]/
const CHROME_COPIED = `Not run: this starts your own Google Chrome app without a window. Each start makes a copy of the whole app on the disk, and a start that is stopped leaves it there. Use Playwright's own Chromium instead (chromium.launch() with no channel or executablePath, after npx playwright install chromium), start it once for every page the script needs, and close it in a finally block.`
const DISK_FULL = (what: string, d: DiskKept) =>
  named(`Not run: the Mac has ${gbText(d.free)} GB of disk space left, and "${what}" can fill it. Remove what you made that is no longer needed (your scratch folder, temporary files), run heavy work in the cloud, and send the same command again once more than ${gbText(DISK_STOP)} GB is free. {Name} can free up space from the Claudopus panel.`)
const turnLeftovers = async ($: EngineInterface, e: ToolCallInput) => {
  const input = e as { command?: unknown; description?: unknown }
  const command = String(input.command ?? '')
  const agent = e.agentId ?? ''
  if (!command || !(await read($, todos)).some(one => one.id === agent && !one.chat)) return ''
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
