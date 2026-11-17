// Updates as the person asks for them. A look only reads the version page on claudopus.ai, on its own as often as Config says or
// only at Config's Check now, and the panel's header then says a newer version is out, quietly, in one small box. Each step is a
// press: Download fetches the release and checks it is what the release published, Install puts it in place (Claude Code's own
// steps for an installed copy). A chat run from a folder of the code has one press, Update, for both: the fetch, its check, then a
// fast-forward only once the check holds. Then the header says, beside the version, to type /reload-plugins, which switches the
// chat. Not now and Skip this version keep it quiet.
// The pure parts are in hooks/update.ts

// ---- One at a time, under a lock the other chats see ----

// A look and each step run one at a time, under a lock the other chats see; the look keeps what it saw in update-seen.json (a
// version number only), the steps where they stand in update-steps.json
let isUpdating = false
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-step is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
const UPDATE_BUSY = 'busy' as const
const LOCK_SKEW = 60_000
const underUpdateLock = async <T,>($: EngineInterface, act: () => Promise<T>): Promise<T | typeof UPDATE_BUSY> => {
  const lock = `${dir}/update.lock`
  const token = `${await $.clock.now()} ${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  const take = async () =>
    (await $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(() => ({ exitCode: 1 }))).exitCode === 0
  if (!(await take())) {
    const now = await $.clock.now()
    const at = Number((await readOr($, lock)).split(' ')[0]) || (await $.fs.stat(lock).catch(() => undefined))?.mtimeMs || now
    // A lock dated ahead of this Mac's clock, past what two chats' clocks can differ by, was never taken by a chat here: it is stale
    if (now - at < UPDATE_LOOK && at - now <= LOCK_SKEW) return UPDATE_BUSY
    const seen = await readOr($, lock)
    const aside = `${lock}.${token.split(' ')[1]}`
    if ((await $.process.run(['mv', lock, aside]).catch(() => ({ exitCode: 1 }))).exitCode !== 0) return UPDATE_BUSY
    // Another chat took the stale lock over in between: what was moved is its fresh lock, put back where it was
    if ((await readOr($, aside)) !== seen) return ((await $.process.run(['mv', '-n', aside, lock]).catch(() => undefined)), UPDATE_BUSY)
    await $.process.run(['rm', '-f', aside]).catch(() => undefined)
    if (!(await take())) return UPDATE_BUSY
  }
  try {
    return await act()
  } finally {
    // Only this chat's own lock is removed: one taken over meanwhile is the other chat's
    if ((await readOr($, lock)) === token) await $.process.run(['rm', '-f', lock]).catch(() => undefined)
  }
}
// The Mac, as one step needs it
const lookIo = ($: EngineInterface): LookIo => ({
  read: path => readOr($, path),
  write: (path, text) => $.fs.write(path, text),
  run: (argv, timeoutMs) => $.process.run(argv, { timeoutMs }),
  page: () =>
    Promise.race([
      $.http.fetch(VERSION_PAGE).catch(err => ({ ok: false, status: 0, text: String(err) })),
      new Promise<{ ok: false; status: 0; text: string }>(done => void $.clock.after(VERSION_WAIT, () => done({ ok: false, status: 0, text: 'no answer' }))),
    ]),
  now: () => $.clock.now(),
  log: text => log($, text),
  wait: ms => new Promise<void>(done => void $.clock.after(ms, done)),
})
// Claude Code's own program: the one the app names, else the first on the PATH, else where its installer puts it, as a terminal started without a login shell
// (seen on Linux, in tmux started over ssh) has no ~/.local/bin on its PATH, else claude on the PATH
const engineOf = async ($: EngineInterface) => {
  const named = await $.env.get('CLAUDE_CODE_EXECPATH')
  if (named) return named
  // The PATH first, as the shell would find it, so an install by npm or another copy earlier on it is still the one used
  const onPath = ((await $.env.get('PATH')) ?? '').split(':').filter(one => one.startsWith('/')).map(one => `${one.replace(/\/+$/, '')}/claude`)
  for (const one of [...onPath, `${(await $.env.get('HOME')) ?? ''}/.local/bin/claude`, '/opt/homebrew/bin/claude', '/usr/local/bin/claude', '/usr/bin/claude'])
    if (one.startsWith('/') && (await $.fs.exists(one).catch(() => false))) return one
  return 'claude'
}

// ---- Looking: the version page only ----

// What the last look saw, a version number and when, shared by every chat; and the page itself as this chat last read it, kept in
// this chat only, as the lines of what is new are shown from it and never from a file any program could write
const lookedPath = () => `${dir}/update-seen.json`
let pageRead: { page: Published; at: number } | undefined
const PAGE_AGAIN = 10 * 60_000
let pageAsked = 0
// One read of the page; a page with no fingerprint is no release a download can be checked against, and is read as none
const readPage = async ($: EngineInterface): Promise<{ page?: Published; why: string }> => {
  const answer = await lookIo($).page()
  const page = answer.ok ? publishedOf(answer.text) : undefined
  if (page) pageRead = { page, at: await $.clock.now() }
  return { page, why: page ? '' : answer.ok ? (versionOnPage(answer.text) ? FAILS.unchecked : "claudopus.ai didn't name a version") : answer.status ? `claudopus.ai answered with error ${answer.status}` : "claudopus.ai didn't answer" }
}
// The page, read now under the lock, its version kept for every chat
const lookOnly = async ($: EngineInterface) => {
  const now = await $.clock.now()
  const before = stampOf(await readOr($, lookedPath()))
  const { page, why } = await readPage($)
  await $.fs.write(lookedPath(), JSON.stringify({ at: now, version: page?.version ?? before?.version ?? '', result: page ? 'seen' : `version page not read: ${why}` }))
  if (page) redraw($)
  return { page, why }
}
// The look on its own, as often as Config says; Only when I ask reads nothing
const lookForNew = async ($: EngineInterface) => {
  if (isUpdating || !dir) return
  const config = await readConfig($, dir)
  if (config.updates === false) return
  const every = lookEveryOf(config.updateEvery)
  if (!isUpdateDue(stampOf(await readOr($, lookedPath())), await $.clock.now(), every)) return
  isUpdating = true
  try {
    await underUpdateLock($, async () => {
      // Another chat may have looked between this chat's reading and its lock, or the person turned the look off meanwhile
      const again = await readConfig($, dir)
      if (!isUpdateDue(stampOf(await readOr($, lookedPath())), await $.clock.now(), lookEveryOf(again.updateEvery)) || again.updates === false) return
      await lookOnly($)
    })
  } finally {
    isUpdating = false
  }
}
// Config's Check now: the page read now, whatever the setting; it only looks, and Config and the panel offer what it found
const checkNow = async ($: EngineInterface): Promise<{ text: string; isError: boolean; isOut?: boolean }> => {
  if (!dir) return { text: "Couldn't check: this chat has no Memory folder.", isError: true }
  const loaded = (await versionsOf($)).version
  for (let tries = 0; tries < 20; tries++) {
    if (!isUpdating) {
      isUpdating = true
      try {
        const got = await underUpdateLock($, () => lookOnly($))
        if (got !== UPDATE_BUSY) {
          await log($, `Claudopus looked for a new version from Config: ${got.page?.version ?? got.why}`)
          if (!got.page) return { text: `Couldn't check: ${got.why}. Try again later.`, isError: true }
          await knowSource($, true)
          if (!loaded || !isNewer(got.page.version, loaded)) return { text: `You have the newest version, v${got.page.version}.`, isError: false }
          // Asked for now: a Not now pressed earlier no longer keeps it quiet, and Config shows its Update right under the press
          if ((await readOr($, laterPath())).trim()) await $.fs.write(laterPath(), JSON.stringify({ version: got.page.version, until: 0 }))
          return { text: `v${got.page.version} is out.`, isError: false, isOut: true }
        }
      } finally {
        isUpdating = false
      }
    }
    await new Promise<void>(done => void $.clock.after(3000, done))
  }
  return { text: "Couldn't check: another chat's update did not finish. Try again later.", isError: true }
}
// A chat whose panel shows a newer version than any page it has read reads the page itself once, for that version's lines, at most
// every PAGE_AGAIN; never while the look is set to only when asked, when only a press reads it
const pageFor = async ($: EngineInterface, version: string) => {
  if (pageRead && !isNewer(version, pageRead.page.version)) return pageRead.page
  const now = await $.clock.now()
  if (now - pageAsked < PAGE_AGAIN || (await readConfig($, dir)).updates === false) return pageRead?.page
  pageAsked = now
  void readPage($).then(({ page }) => page && redraw($)).catch(() => undefined)
  return pageRead?.page
}

// ---- Where this chat's copy comes from ----

// Known once a load and again at each look and step: where this chat's copy comes from, and, for a set-up a release never reaches,
// what it is and why
let sourceKnown: { src: Source; cannot?: { what: string; why: string }; where: string } | undefined
const knowSource = async ($: EngineInterface, isAgain = false) => {
  if (sourceKnown && !isAgain) return sourceKnown
  const root = $.plugin.root.replace(/\/+$/, '')
  const from = installedFrom(root)
  const io = lookIo($)
  const plugins = from?.plugins ?? dir.replace(/\/claudopus$/, '/plugins')
  const known = await readOr($, `${plugins}/known_marketplaces.json`)
  const entryOf = (name: string) => {
    try {
      return (JSON.parse(known) as Record<string, { source?: { source?: string; path?: string; repo?: string }; installLocation?: string }>)?.[name]
    } catch {
      return undefined
    }
  }
  const installed = await readOr($, `${plugins}/installed_plugins.json`)
  const done = (one: NonNullable<typeof sourceKnown>) => (sourceKnown = one)
  if (from) {
    const entry = entryOf(from.marketplace)
    const scope = scopeOf(installed, `${from.plugin}@${from.marketplace}`, root) ?? scopeOf(installed, `${from.plugin}@${from.marketplace}`, copyOf(installed, `${from.plugin}@${from.marketplace}`, root, cwd)?.installPath ?? root)
    const record = { plugins: from.plugins, marketplace: from.marketplace, plugin: from.plugin, scope }
    if (entry?.source?.source === 'directory' && typeof entry.source.path === 'string') {
      const repo = entry.source.path.replace(/\/+$/, '')
      const ready = await folderReady(io, repo)
      return done({
        src: { kind: 'folder', repo, sub: 'mods/claudopus', runs: 'copy', record },
        cannot: ready.ok ? undefined : { what: `Claude Code's copy is made from ${ready.what}`, why: ready.why },
        where: ready.ok ? "Claude Code's copy of the released code on this Mac" : `Claude Code's copy of ${ready.what}`,
      })
    }
    const location = typeof entry?.installLocation === 'string' ? entry.installLocation.replace(/\/+$/, '') : ''
    const isGit = location && (await $.fs.exists(`${location}/.git`).catch(() => false))
    const subOf = async () => {
      try {
        const market = JSON.parse(await readOr($, `${location}/.claude-plugin/marketplace.json`)) as { plugins?: { name?: string; source?: unknown }[] }
        const source = market.plugins?.find(one => one.name === from.plugin)?.source
        return typeof source === 'string' && /^\.\/[\w./-]+$/.test(source) && !source.includes('..') ? source.slice(2).replace(/\/+$/, '') : ''
      } catch {
        return ''
      }
    }
    const path = isGit ? await subOf() : ''
    if (isGit && path) return done({ src: { kind: 'clone', repo: location, sub: path, ...record }, where: "Claude Code's installed copy" })
    return done({ src: { kind: 'none', why: 'its marketplace is not one Claudopus can check a download in' }, cannot: { what: 'This chat runs a copy of Claudopus installed another way', why: 'update it with /plugin in Claude Code' }, where: "Claude Code's installed copy" })
  }
  // Run from a folder of the code: the folder is what a release has to reach
  const top = (await io.run(['git', '-C', root, 'rev-parse', '--show-toplevel'], 20_000).catch(() => ({ exitCode: 1, stdout: '', stderr: '' }))).stdout.trim()
  const ready = top ? await folderReady(io, top) : ({ ok: false, what: "Claudopus code that Update can't change", why: "it isn't Claudopus's released code" } as const)
  const marketplace = folderMarketplace(known, root)
  const scopes = (() => {
    try {
      return ((JSON.parse(installed)?.plugins?.[`claudopus@${marketplace}`] ?? []) as { scope?: unknown }[]).map(one => one?.scope)
    } catch {
      return []
    }
  })()
  const scope = scopes.includes('user') ? 'user' : (scopes.find(one => typeof one === 'string' && /^(user|project|local)$/.test(one)) as string | undefined)
  const sub = top && root.startsWith(`${top}/`) ? root.slice(top.length + 1) : 'mods/claudopus'
  return done({
    src: { kind: 'folder', repo: top || root, sub, runs: 'folder', ...(marketplace && scope ? { record: { plugins, marketplace, plugin: 'claudopus', scope } } : {}) },
    cannot: ready.ok ? undefined : { what: `This chat runs ${ready.what}`, why: ready.why },
    where: ready.ok ? 'the released code on this Mac' : ready.what,
  })
}

// ---- The steps ----

const stepsPath = () => `${dir}/update-steps.json`
const laterPath = () => `${dir}/update-later.json`
// Not now keeps a version quiet for this long
const LATER_FOR = 24 * 3_600_000
const writeSteps = ($: EngineInterface, steps: Steps) => $.fs.write(stepsPath(), JSON.stringify(steps))
// What the last step in this chat said beyond its kind of failure, kept in this chat only
const stepSaid = { version: '', detail: '', dirty: false }
let isStepping = false
// The press found another chat at a step: said for a moment in this chat
let busyAt = 0
const atStep = async ($: EngineInterface, act: () => Promise<void>) => {
  if (isStepping || isUpdating || !dir) return
  isStepping = true
  isUpdating = true
  redraw($)
  try {
    const got = await underUpdateLock($, act)
    if (got === UPDATE_BUSY) busyAt = await $.clock.now()
  } catch (err) {
    await log($, `update step failed: ${String(err)}`)
  } finally {
    isStepping = false
    isUpdating = false
    redraw($)
  }
}
// A chat run from Claudopus's own checkout: Download and Install are one press, Update (the fetch, its check against the release,
// then the fast-forward, under the one lock); an installed copy keeps them as two
const isOnePress = (src: Source) => src.kind === 'folder' && src.runs === 'folder'
// The page read again at each press: a step is checked only against what claudopus.ai says now, never against a kept file
const freshPage = async ($: EngineInterface, version: string, step: 'download' | 'install', now: number) => {
  const { page } = await readPage($)
  if (!page) await writeSteps($, { version, stage: 'failed', fail: 'page', step, at: now })
  return page
}
// Download, pressed for the version the notice showed: the newest the page names now is what is fetched
let downloadProgress: { version: string; pct: number; got: number; phase: string } | undefined
// What the download's last drawing showed, and when
const progressDrawn = { shown: '', phase: '', at: 0 }
// Update's press, from its fetch to the end of its move: the panel says Updating throughout, and offers no press in between
let isUpdatePress = false
// A press while only a look runs (the timed one, or Config's Check now) waits for the look to end, then acts: before, it did nothing
const afterLook = ($: EngineInterface, act: () => void) =>
  void (async () => {
    for (const end = (await $.clock.now()) + 30_000; isUpdating && !isStepping && (await $.clock.now()) < end; ) await new Promise<void>(done => void $.clock.after(250, done))
    if (!isUpdating && !isStepping) act()
  })()
const downloadPress = ($: EngineInterface, version: string) => {
  if (isUpdating && !isStepping) return afterLook($, () => downloadPress($, version))
  presses += 1
  // A press while a step runs does nothing, as atStep would, and leaves the flag to the press that set it
  if (isStepping || isUpdating) return
  // Update's move, once its fetch was checked: each half takes the lock on its own, as two presses did, so neither holds it longer
  let next: { version: string; commit: string } | undefined
  isUpdatePress = true
  void atStep($, async () => {
    const now = await $.clock.now()
    const { src } = await knowSource($, true)
    if (src.kind === 'none') return
    const page = await freshPage($, version, 'download', now)
    if (!page) return
    const loaded = (await versionsOf($)).version
    // The page names no newer version than this chat runs (the notice came from a look that is out of date, or a planted file): the
    // look's record is set right, and nothing is fetched
    if (!loaded || !isNewer(page.version, loaded)) return void (await $.fs.write(lookedPath(), JSON.stringify({ at: now, version: page.version, result: 'seen' })))
    Object.assign(stepSaid, { version: page.version, detail: '', dirty: false })
    await writeSteps($, { version: page.version, stage: 'downloading', step: 'download', at: now, from: loaded })
    let wrote = 0
    const got = await download(lookIo($), src, page, `${dir}/update-progress.txt`, async p => {
      downloadProgress = { version: page.version, ...p }
      const at = await $.clock.now()
      if (at - wrote >= 1000) ((wrote = at), await writeSteps($, { version: page.version, stage: 'downloading', step: 'download', at, pct: p.pct, got: p.got, from: loaded }))
      // Each drawing makes the panel's buttons new, and a click on one just replaced is lost: the figures move every 2 s, and not
      // while the person is using the panel, unless the download moves to its next phase
      const shown = `${Math.round(p.pct)}|${p.got ? sizeText(p.got) : ''}|${p.phase}`
      const isPhase = p.phase !== progressDrawn.phase
      if (shown !== progressDrawn.shown && (isPhase || (at - progressDrawn.at >= 2000 && at - engagedAt >= ENGAGED))) {
        Object.assign(progressDrawn, { shown, phase: p.phase, at })
        redraw($)
      }
    })
    downloadProgress = undefined
    const at = await $.clock.now()
    heldChecked.clear()
    if (got.ok) {
      await writeSteps($, { version: page.version, stage: 'downloaded', step: 'download', commit: got.commit, tree: page.tree, at, from: loaded })
      // Update's second half: the fetch was checked against the release, and the move reads the page and checks it again
      if (isOnePress(src)) next = { version: page.version, commit: got.commit }
    } else {
      // What git or GitHub said is kept in the log only: the panel shows what failed in its own words
      if (got.detail) await log($, `Claudopus ${page.version} download failed (${got.fail}): ${got.detail}`)
      await writeSteps($, { version: page.version, stage: 'failed', step: 'download', fail: got.fail, at, from: loaded })
    }
  })
    .then(() => (next ? atStep($, () => installStep($, next!.version, next!.commit)) : undefined))
    .finally(() => ((isUpdatePress = false), redraw($)))
}
// Install, pressed for the download the notice showed: checked against the page read now, then put in place
const installPress = ($: EngineInterface, version: string, commit: string) => {
  if (isUpdating && !isStepping) return afterLook($, () => installPress($, version, commit))
  presses += 1
  void atStep($, () => installStep($, version, commit))
}
// Install itself, run under the lock: at Install's press, or as Update's second half
const installStep = async ($: EngineInterface, version: string, commit: string) => {
  const now = await $.clock.now()
  const { src } = await knowSource($, true)
  if (src.kind === 'none') return
  const page = await freshPage($, version, 'install', now)
  if (!page) return
  const loaded = (await versionsOf($)).version
  if (page.version !== version) return void (await writeSteps($, { version, stage: 'failed', step: 'install', fail: 'newer-out', at: now, from: loaded }))
  await writeSteps($, { version, stage: 'installing', step: 'install', commit, tree: page.tree, at: now, from: loaded })
  // A long install keeps its step alive for the other chats
  let isOn = true
  const beat = (): unknown =>
    $.clock.after(20_000, () => void (isOn && $.clock.now().then(at => writeSteps($, { version, stage: 'installing', step: 'install', commit, tree: page.tree, at, from: loaded })).then(() => isOn && beat())))
  beat()
  const got = await install(lookIo($), src, page, commit, await engineOf($)).finally(() => (isOn = false))
  const at = await $.clock.now()
  Object.assign(stepSaid, { version, detail: '', dirty: got.ok && got.dirty })
  if (!got.ok && got.detail) await log($, `Claudopus ${version} install failed (${got.fail}): ${got.detail}`)
  await writeSteps($, got.ok ? { version, stage: 'installed', step: 'install', commit, tree: page.tree, at, from: loaded } : { version, stage: 'failed', step: 'install', fail: got.fail, commit, at, from: loaded })
}
// Not now: quiet for a day, for this version; Skip this version: quiet until a newer one, kept as the person's own setting
const laterPress = async ($: EngineInterface, version: string) => {
  presses += 1
  await $.fs.write(laterPath(), JSON.stringify({ version, until: (await $.clock.now()) + LATER_FOR }))
  // What Check now said last is about the version just put off: no line is left in Config saying it is out with nothing to press
  Object.assign(updateCheck, { said: '', isError: false, isOut: false })
  redraw($)
}
const skipPress = async ($: EngineInterface, version: string) => {
  presses += 1
  await setConfig($, dir, 'skipVersion', version)
  // What Check now said last is about the version just skipped
  Object.assign(updateCheck, { said: '', isError: false, isOut: false })
  await loadSettings($)
  redraw($)
}

// ---- The notice ----

// What this chat found of each download it was told of, by commit and tree, so the check runs once
const heldChecked = new Map<string, boolean>()
const isDownloadHeld = async ($: EngineInterface, src: Source, steps: Steps) => {
  if (src.kind === 'none' || !steps.commit || !steps.tree) return false
  // Checked against what this chat read on the page itself, never only against what the file says the tree is
  const page = pageRead?.page ?? (await pageFor($, steps.version))
  if (!page || page.version !== steps.version || page.tree !== steps.tree) return false
  const key = `${src.repo}|${steps.commit}|${steps.tree}`
  const known = heldChecked.get(key)
  if (known !== undefined) return known
  const git = (args: string[]) => $.process.run(['env', 'GIT_TERMINAL_PROMPT=0', 'git', '-C', src.repo, ...args], { timeoutMs: 20_000 }).catch(() => ({ exitCode: 1, stdout: '' }))
  const held = (await git(['rev-parse', '--verify', '-q', 'refs/claudopus/update^{commit}'])).stdout.trim()
  const tree = held === steps.commit ? (await git(['rev-parse', '--verify', '-q', `${steps.commit}:${src.sub}`])).stdout.trim() : ''
  const isHeld = tree === steps.tree
  heldChecked.set(key, isHeld)
  return isHeld
}

// Where updating stands for this chat, from what is true now
const noticeNow = async ($: EngineInterface, loaded: string, installed: string): Promise<Notice | undefined> => {
  if (!dir || !loaded) return undefined
  const config = await readConfig($, dir)
  const seen = stampOf(await readOr($, lookedPath()))?.version ?? ''
  const laterText = await readOr($, laterPath())
  const later = () => {
    try {
      const v = JSON.parse(laterText) as { version?: unknown; until?: unknown }
      return isVersion(v?.version) && typeof v.until === 'number' ? { version: v.version, until: v.until } : undefined
    } catch {
      return undefined
    }
  }
  const known = await knowSource($)
  const steps = stepsOf(await readOr($, stepsPath()))
  return noticeOf({
    loaded,
    installed,
    seen: isVersion(seen) ? seen : '',
    // A download is said to be checked only once this chat has seen it so: its repo's download ref holds that commit, whose mod folder
    // is the tree the steps name, and the page this chat read names it too
    steps: steps?.stage === 'downloaded' && !(await isDownloadHeld($, known.src, steps)) ? undefined : steps,
    page: pageRead?.page,
    skipped: isVersion(config.skipVersion) ? config.skipVersion : undefined,
    later: later(),
    cannot: known.cannot,
    now: await $.clock.now(),
  })
}

// Where updating stands, as far as the panel's drawing changes with it: a step, a look, a press put off or skipped, what the Mac has,
// the seen record of the note after a move, and this chat's own progress and presses, so a held drawing is never shown past it
const updateShape = async ($: EngineInterface) =>
  dir
    ? JSON.stringify([
        await readOr($, lookedPath()),
        await readOr($, stepsPath()),
        await readOr($, laterPath()),
        await readOr($, `${dir}/seen.json`),
        (await readConfig($, dir)).skipVersion ?? '',
        await installedNow($).catch(() => ''),
        pageRead?.page.version ?? '',
        downloadProgress ? Math.round(downloadProgress.pct) : -1,
        isStepping,
        busyAt,
      ])
    : ''

// The notice: a small grey outlined box in the header, under the version this chat runs, never a demand as the amber boxes are.
// What is out and, in a line, what is new; the steps and where they stand; the one press that comes next, Not now and Skip. A chat
// run from Claudopus's own checkout has one, Update, and is told nothing of where it loads from (Config says)
const NOTICE_EDGE = '#80808070'
// The last step, switching this chat, is no press: the header says to type /reload-plugins
const STEPS = ['Download', 'Install'] as const
// Why Update could not update this chat, where Update's own words differ from FAILS'
const ONE_PRESS_FAILS: Partial<Record<Fail, string>> = {
  'newer-out': 'a newer version came out while Claudopus was updating',
  gone: 'the new version is no longer there',
}
const noticeCard = async ($: EngineInterface, ui: Ui, n: Notice | undefined, loaded: string) => {
  const now = await $.clock.now()
  const busy = now - busyAt < 10_000 ? <ui.Text key="update-busy" dimColor wrap="wrap">Another chat is updating Claudopus. Try again in a moment.</ui.Text> : null
  if (!n) return null
  const known = await knowSource($)
  const { src } = known
  const isOne = isOnePress(src)
  // A copy Claude Code installs from Claudopus's code on this Mac keeps Download and Install, in the same words as any installed copy
  // Update is one press: it has no steps to show
  const track = (at: number) =>
    isOne ? null : (
    <ui.Text key="update-track" dimColor wrap="truncate-end">
      {STEPS.map((one, i) => `${i < at ? '✓' : i === at ? '●' : '○'} ${one}`).join('   ')}
    </ui.Text>
  )
  const quiet = (key: string, version: string, withSkip = true) => [
    <ui.Button key={`update-later-${key}-${presses}`} label="Not now" plain dimColor onPress={() => void laterPress($, version).catch(err => log($, `update not put off: ${String(err)}`))} />,
    withSkip ? <ui.Button key={`update-skip-${key}-${presses}`} label="Skip this version" plain dimColor onPress={() => void skipPress($, version).catch(err => log($, `version not skipped: ${String(err)}`))} /> : null,
  ]
  const box = (key: string, lines: (JSX.Element | null)[], buttons: (JSX.Element | null)[]) => (
    <ui.Box key="update-notice" flexDirection="column" borderStyle="round" borderColor={NOTICE_EDGE} paddingX={1} flexShrink={0}>
      {lines.filter(Boolean)}
      {buttons.some(Boolean) ? (
        <ui.Box key={`update-${key}-buttons`} flexDirection="row" flexWrap="wrap" columnGap={2} alignItems="center">
          {buttons.filter(Boolean)}
        </ui.Box>
      ) : null}
      {busy}
    </ui.Box>
  )
  const title = (text: string, side = '') => (
    <ui.Box key="update-title" flexDirection="row" gap={1} minWidth={0}>
      <ui.Box flexShrink={0}>
        <ui.Text>{text}</ui.Text>
      </ui.Box>
      {side ? <ui.Text dimColor wrap="truncate-end">{side}</ui.Text> : null}
    </ui.Box>
  )
  const line = (key: string, text: string, color?: string) => (
    <ui.Text key={`update-${key}`} dimColor={!color} color={color} wrap="wrap">
      {text}
    </ui.Text>
  )
  const v = n.version
  // Update's press between its fetch and its move: still updating
  if (isOne && (n.kind === 'installing' || (n.kind === 'downloaded' && (isStepping || isUpdatePress)))) return box('installing', [title(`Updating Claudopus v${v}…`), track(0)], [])
  // A fetch checked earlier, left by a copy before Update was one press, is offered as any version out: its Update moves it forward,
  // after checking it once more
  if (n.kind === 'available' || n.kind === 'cannot' || (isOne && n.kind === 'downloaded')) {
    const page = await pageFor($, v)
    const missed = page && page.version === v ? missedOn(page, loaded) : []
    const newest = missed[0]
    const more = missed.reduce((sum, one) => sum + 1 + one.more, 0) - 1
    const count = n.kind === 'available' ? n.count : missed.length || 1
    const what = newest?.line ? `${newest.line}${more > 0 ? ` · and ${more} more ${more === 1 ? 'change' : 'changes'}` : ''}` : ''
    const head = title(`Claudopus v${v} is out`, count > 1 ? `· ${count} versions since v${loaded}` : '')
    if (n.kind === 'cannot') return box('cannot', [head, line('why', `${n.what}: ${n.why}.`)], quiet('cannot', v))
    return box(
      'available',
      [head, what ? line('what', what) : null],
      [
        n.kind === 'downloaded' ? (
          <ui.Button key={`update-install-${presses}`} label="Update" onPress={() => installPress($, v, n.commit)} />
        ) : (
          <ui.Button key={`update-download-${presses}`} label={isOne ? 'Update' : page?.size ? `Download · ${sizeText(page.size)}` : 'Download'} onPress={() => downloadPress($, v)} />
        ),
        ...quiet(n.kind, v),
      ],
    )
  }
  if (n.kind === 'downloading') {
    const live = downloadProgress?.version === v ? downloadProgress : undefined
    const pct = live?.pct ?? n.pct
    const got = live?.got ?? n.got
    const said = live?.phase === 'checking' ? 'checking the download' : [pct !== undefined ? `${Math.round(pct)}%` : '', got ? sizeText(got) : '', live?.phase === 'resolving' ? 'unpacking' : ''].filter(Boolean).join(' · ')
    return box('downloading', [title(`${isOne ? 'Updating' : 'Downloading'} Claudopus v${v}…`, said ? `· ${said}` : ''), track(0)], [])
  }
  if (n.kind === 'downloaded') {
    const replaces = `Install puts v${v} on this Mac in place of v${loaded}. Then type /reload-plugins to use it.`
    return box(
      'downloaded',
      [title(`Claudopus v${v} downloaded`), line('replaces', replaces), track(1)],
      [<ui.Button key={`update-install-${presses}`} label="Install" onPress={() => installPress($, v, n.commit)} />, ...quiet('downloaded', v, false)],
    )
  }
  if (n.kind === 'installing') return box('installing', [title(`Installing Claudopus v${v}…`), track(1)], [])
  // The Mac has it and this chat still runs the older one: the header says so beside the version, and to type /reload-plugins
  if (n.kind === 'reload') return null
  // A step that failed: what failed, and that what this chat runs is as it was
  const detail = ''
  const which = isOne ? 'update' : n.step === 'download' ? 'download' : 'install'
  const why = (isOne ? ONE_PRESS_FAILS[n.fail] : undefined) ?? FAILS[n.fail]
  const kept =
    n.fail === 'installed-mismatch'
      ? `New chats keep v${loaded}.`
      : n.fail === 'kept-copy'
        ? `This chat still runs v${loaded}.`
        : `Nothing changed: this chat still runs v${loaded}.`
  return box(
    'failed',
    [title(`Couldn't ${which} Claudopus v${v}`), line('why', `${why.replace(/^./, c => c.toUpperCase())}${detail}. ${kept}`)],
    [<ui.Button key={`update-again-${presses}`} label="Try again" onPress={() => downloadPress($, v)} />, ...quiet('failed', v)],
  )
}

// Config's Updates band: where updating stands, in the same box as the panel's header and with the same presses, right under Check
// now, so a version it found is updated where it was asked for (16 Nov: the Update button only in the panel's header was confusing).
// Once the Mac has it, what is left is said there too: type /reload-plugins
const configUpdateBox = async ($: EngineInterface, ui: Ui) => {
  const versions = await versionsOf($)
  if (!versions.version) return null
  const n = await noticeNow($, versions.version, versions.installed).catch(() => undefined)
  if (n?.kind === 'reload') return <ui.Text key="update-ready" wrap="wrap">{`Claudopus v${n.version} is ready: type /reload-plugins to use it.`}</ui.Text>
  return noticeCard($, ui, n, versions.version).catch(() => null)
}

// ---- Moving an open chat to the version installed ----

// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; for a copy
// run from a folder of its code, the version that folder has now, which a reload loads
const installedNow = async ($: EngineInterface) => (await installedCopy($))?.version ?? ''
const installedCopy = async ($: EngineInterface) => {
  const from = installedFrom($.plugin.root)
  if (!from) {
    // Only a main checkout (its .git a folder, not a worktree's file) follows its folder: a worktree's version rises as work merges
    // main or a release numbers it, mid-build, and a chat loaded from it is reloaded by hand
    const root = $.plugin.root.replace(/\/+$/, '')
    if (!(await readOr($, `${root}/../../.git/HEAD`)).trim()) return undefined
    const version = versionOnPage(await readOr($, `${root}/.claude-plugin/plugin.json`))
    return version ? { version, installPath: root } : undefined
  }
  const installed = await readOr($, `${from.plugins}/installed_plugins.json`)
  const id = `${from.plugin}@${from.marketplace}`
  return copyOf(installed, id, $.plugin.root, cwd)
}

// A /reload-plugins run from afar loads the new copy but leaves the old one's timers running in the same chat, and copies before
// 0.2.56 send it whatever the connection, each a refused line. They all wait while reloads/<chat>.json names the installed version from under RELOAD_AGAIN ago, so
// in a chat run from afar this copy keeps that mark naming it, looked at every HOLD_EVERY, which is far below their RELOAD_EVERY.
// A copy that a newer load in this chat has replaced (the version this chat ran last is not its own) does nothing, so the holds of
// copies left behind by typed reloads do not pile up
const HOLD_EVERY = 1000
const holdOldCopies = async ($: EngineInterface) => {
  if (!dir) return
  const loaded = (await versionsOf($)).version
  if (!loaded || (await read($, ranVersion)) !== loaded) return
  const copy = await installedCopy($)
  if (!copy?.version) return
  const mark = `${dir}/reloads/${await $.session.id()}.json`
  const before = await readOr($, mark).then(text => {
    try {
      return JSON.parse(text) as { version?: unknown; at?: unknown }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  const at = typeof before?.at === 'number' ? before.at : 0
  if (before?.version === copy.version && now >= at && now - at < RELOAD_AGAIN / 2) return
  await $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))
}
// ---- The moment a chat moves to a newer version ----

// The version this chat loaded last, kept through a reload of this code, so the load after it knows what it moved from
const ranVersion = atom({ plugin: 'claudopus', key: 'ran' } as const, '', { shape: 'ran-1' })
// A move to a newer version this load made, from the version it ran before; its moment begins at the panel's first drawing once
// the load has started whole (isReady), or UPDATED_READY after the load if its start never finishes: in a chat run over ssh the
// start took 6 s, and drawings asked for meanwhile can be dropped as each new change is announced, so a moment begun then could be
// over before one of its drawings arrived. Until then the header is as before, so the octopus's jump and the words keep time
const UPDATED_READY = 15_000
let updatedMoment: { from: string; to: string; loadedAt: number; startedAt: number; isReady: boolean } | undefined
const noteLoaded = async ($: EngineInterface) => {
  updatedMoment = undefined
  const loaded = (await versionsOf($)).version
  if (!loaded) return
  const ran = await read($, ranVersion)
  const mark = await readOr($, `${dir}/reloads/${await $.session.id()}.json`).then(text => {
    try {
      return JSON.parse(text) as { version?: unknown; from?: unknown; at?: unknown }
    } catch {
      return undefined
    }
  })
  const now = await $.clock.now()
  const from = updatedFrom(loaded, ran, mark, now)
  await update($, ranVersion, () => loaded)
  if (!from) return
  updatedMoment = { from, to: loaded, loadedAt: now, startedAt: 0, isReady: false }
  // A panel drawn while this load was still reading has no moment yet: it is drawn again now
  await update($, tick, n => n + 1)
  const moment = updatedMoment
  $.clock.after(UPDATED_READY, () => void (updatedMoment === moment && readyUpdated($)))
  await log($, `Claudopus moved from ${from} to ${loaded} in this chat: the header's octopus turns blue and says so`)
}
// The load has started whole: the moment begins at the next drawing, asked for now
const readyUpdated = async ($: EngineInterface) => {
  if (!updatedMoment || updatedMoment.isReady) return
  updatedMoment.isReady = true
  await update($, tick, n => n + 1)
}
// The sound of the moment, a file of the mod's: three bright rising notes, 0.9 s, made by mockups/claudopus-sound/updated.py
const UPDATED_SOUND = 'sounds/updated.wav'
// The sound plays once for each version on this Mac, however many chats move to it: the first to begin its moment makes the file
// updated/<version> (made only where none is, the shell's noclobber) and plays it; config.json's sound off keeps it silent
const playUpdated = async ($: EngineInterface, version: string) => {
  if (!dir || !/^[0-9A-Za-z.+-]{1,40}$/.test(version)) return
  let config: { sound?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves the sound on
  }
  if (config.sound === false) return
  const played = `${dir}/updated/${version}`
  const made = await $.process
    .run(['sh', '-c', 'mkdir -p "$(dirname "$1")" && set -C && : > "$1"', 'sh', played])
    .catch(() => ({ exitCode: 1 }))
  if (made.exitCode !== 0) return
  // A sound that could not play leaves the version free for the next chat that moves to it
  await $.audio.play({ asset: UPDATED_SOUND }).catch(async err => {
    await $.process.run(['rm', '-f', played]).catch(() => undefined)
    await log($, `updated sound not played: ${String(err)}`)
  })
}
// The moment as it stands now, while it lasts: the name line's pieces in Claudopus's workflow blue, the panel drawing the blue
// octopus beside them. The panel is drawn again only where the look changes, at UPDATED_SAYS and at its end (see UPDATED_SAYS)
const updatedPieces = async ($: EngineInterface, version: string) => {
  const moment = updatedMoment
  if (!moment || moment.to !== version) return undefined
  const now = await $.clock.now()
  // Drawn while the load is still starting: nothing of it yet
  if (!moment.isReady) return undefined
  if (!moment.startedAt) {
    if (now - moment.loadedAt > UPDATED_LATE) return void (updatedMoment = undefined)
    moment.startedAt = now
    void playUpdated($, moment.to)
    for (const at of [UPDATED_SAYS, UPDATED_FOR]) $.clock.after(at + 20, () => void (updatedMoment === moment && update($, tick, n => n + 1)))
  }
  const look = updatedLook(moment.to, now - moment.startedAt)
  if (!look && updatedMoment === moment) updatedMoment = undefined
  return look
}
const nameLine = (ui: Ui, pieces: NonNullable<ReturnType<typeof updatedLook>>) => (
  // "Claudopus" first, then the word or version beside it
  <ui.Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
    {pieces.map((piece, i) => (
      <ui.Box key={`head-name-${i}`} flexDirection="row" flexShrink={i ? 1 : 0} minWidth={0}>
        <ui.Text key={`head-name-${i}-0`} wrap="truncate-end" color={FLOW} bold>
          {piece.text}
        </ui.Text>
      </ui.Box>
    ))}
  </ui.Box>
)
