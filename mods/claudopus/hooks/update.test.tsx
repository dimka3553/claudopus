import { expect, test } from 'claude-code/testing'

import { copyOf, download, DOWNLOAD_REF, fetchProgress, folderMarketplace, folderReady, install, installedFrom, installedVersionOf, isNewer, isReloadDue, isUpdateDue, lookEveryOf, missedOn, noticeOf, publishedOf, RELOAD_AGAIN, scopeOf, sizeText, stampOf, STEP_STALE, stepsOf, UPDATE_EVERY, updatedArt, updatedFrom, updatedLook, updateSteps, UPDATED_FOR, UPDATED_LATE, UPDATED_SAYS, VERSION_PAGE, versionOnPage } from './update'
import type { LookIo } from './update'

test('only a copy installed from a marketplace is updated, read off its cache folder', async () => {
  expect(installedFrom('/Users/sam/.claude/plugins/cache/claudopus/claudopus/0.2.25')).toEqual({ plugins: '/Users/sam/.claude/plugins', marketplace: 'claudopus', plugin: 'claudopus' })
  expect(installedFrom('/x/plugins/cache/my-market/claudopus/0.2.25/')).toEqual({ plugins: '/x/plugins', marketplace: 'my-market', plugin: 'claudopus' })
  expect(installedFrom('/Users/sam/Documents/GitHub/claudopus/mods/claudopus')).toBeUndefined()
  expect(installedFrom('/x/plugins/cache/a b/claudopus/1.0.0')).toBeUndefined()
})

test('the marketplace is refreshed before the update, with the engine the chat runs on', async () => {
  expect(updateSteps('/e/claude', { marketplace: 'claudopus', plugin: 'claudopus' })).toEqual([
    ['/e/claude', 'plugin', 'marketplace', 'update', 'claudopus'],
    ['/e/claude', 'plugin', 'update', 'claudopus@claudopus'],
  ])
  expect(updateSteps('claude', { marketplace: 'm', plugin: 'claudopus' }, 'project')[1]).toEqual(['claude', 'plugin', 'update', 'claudopus@m', '--scope', 'project'])
})

test('the scope is the one this very copy was installed at', async () => {
  const installed = JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'user', installPath: '/p/cache/m/claudopus/0.2.1' }, { scope: 'project', installPath: '/p/cache/m/claudopus/0.2.2' }] } })
  expect(scopeOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.2/')).toBe('project')
  expect(scopeOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.9')).toBeUndefined()
  expect(scopeOf('not json', 'claudopus@m', '/p')).toBeUndefined()
})

test('a look is due every hour, at once when none was made or the clock moved back', async () => {
  expect(isUpdateDue(undefined, 1000)).toBe(true)
  expect(isUpdateDue({ at: 1000, version: '', result: '' }, 1000 + UPDATE_EVERY - 1)).toBe(false)
  expect(isUpdateDue({ at: 1000, version: '', result: '' }, 1000 + UPDATE_EVERY)).toBe(true)
  expect(isUpdateDue({ at: 5000, version: '', result: '' }, 1000)).toBe(true)
  expect(stampOf('{"at":1,"version":"0.2.26","result":"updated"}')).toEqual({ at: 1, version: '0.2.26', result: 'updated' })
  expect(stampOf('nope')).toBeUndefined()
})

test('versions compare by their numbers', async () => {
  expect(isNewer('0.2.26', '0.2.25')).toBe(true)
  expect(isNewer('0.2.10', '0.2.9')).toBe(true)
  expect(isNewer('0.2.25', '0.2.25')).toBe(false)
  expect(isNewer('0.2.9', '0.2.10')).toBe(false)
})

test('the version page on claudopus.ai is read as one version, anything else as none', async () => {
  expect(VERSION_PAGE).toBe('https://www.claudopus.ai/version.json')
  expect(versionOnPage('{"version":"0.2.32"}\n')).toBe('0.2.32')
  expect(versionOnPage('{"version":"1.0.0-beta.1"}')).toBe('1.0.0-beta.1')
  expect(versionOnPage('<!doctype html><title>404</title>')).toBeUndefined()
  expect(versionOnPage('{"version":"; rm -rf ~"}')).toBeUndefined()
  expect(versionOnPage('{"version":32}')).toBeUndefined()
})

test('the version compared with the page is the one the Mac has installed, not only the one this chat loaded', async () => {
  const installed = JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'user', installPath: '/p/cache/m/claudopus/0.2.32', version: '0.2.32' }, { scope: 'project', version: '0.2.30' }] } })
  expect(installedVersionOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.31', 'user')).toBe('0.2.32')
  expect(installedVersionOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.31', 'project')).toBe('0.2.30')
  expect(installedVersionOf('not json', 'claudopus@m', '/p/cache/m/claudopus/0.2.31/')).toBe('0.2.31')
  expect(installedVersionOf(installed, 'claudopus@other', '/p/cache/m/claudopus/0.2.31')).toBe('0.2.31')
  // No scope known (this chat's folder was replaced by an update): the user's entry; this very folder's entry wins over the scope
  expect(installedVersionOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.31')).toBe('0.2.32')
  expect(installedVersionOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.32/', 'project')).toBe('0.2.32')
})

test('an open chat reloads to a newer copy once it is whole on disk, and asks for the same version again only after a while', async () => {
  const installed = JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'user', installPath: '/p/cache/m/claudopus/0.2.34/', version: '0.2.34' }] } })
  // The chat's folder was replaced by the update: the user's entry, with the folder it is in
  const copy = copyOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.33', '/work')
  expect(copy).toEqual({ version: '0.2.34', installPath: '/p/cache/m/claudopus/0.2.34' })
  expect(copyOf('not json', 'claudopus@m', '/p/cache/m/claudopus/0.2.33')).toBeUndefined()
  const manifest = '{ "name": "claudopus", "version": "0.2.34" }'
  expect(isReloadDue('0.2.33', copy, manifest, undefined, 1000)).toBe(true)
  // Same or older installed, or nothing loaded known: no reload
  expect(isReloadDue('0.2.34', copy, manifest, undefined, 1000)).toBe(false)
  expect(isReloadDue('0.2.35', copy, manifest, undefined, 1000)).toBe(false)
  expect(isReloadDue('', copy, manifest, undefined, 1000)).toBe(false)
  // The new folder not yet holding that version as its own (another field naming it does not count)
  expect(isReloadDue('0.2.33', copy, '{ "version": "0.2.33" }', undefined, 1000)).toBe(false)
  expect(isReloadDue('0.2.33', copy, '{ "version": "0.2.33", "note": "0.2.34" }', undefined, 1000)).toBe(false)
  expect(isReloadDue('0.2.33', copy, 'half a fi', undefined, 1000)).toBe(false)
  // Asked already for this version: not again until RELOAD_AGAIN has passed; a newer version is asked at once; a mark that
  // makes no sense blocks nothing
  expect(isReloadDue('0.2.33', copy, manifest, { version: '0.2.34', at: 1000 }, 1000 + RELOAD_AGAIN - 1)).toBe(false)
  expect(isReloadDue('0.2.33', copy, manifest, { version: '0.2.34', at: 1000 }, 1000 + RELOAD_AGAIN)).toBe(true)
  expect(isReloadDue('0.2.33', copy, manifest, { version: '0.2.33', at: 1000 }, 1001)).toBe(true)
  expect(isReloadDue('0.2.33', copy, manifest, { version: '0.2.34', at: 'soon' }, 1001)).toBe(true)
})

test('the copy a chat would load is the install of the folder it runs in, the nearest first, else the user\'s', async () => {
  const installed = JSON.stringify({
    plugins: {
      'claudopus@m': [
        { scope: 'user', installPath: '/p/cache/m/claudopus/0.2.30', version: '0.2.30' },
        { scope: 'project', projectPath: '/code/other', installPath: '/p/cache/m/claudopus/0.2.40', version: '0.2.40' },
        { scope: 'project', projectPath: '/code/app', installPath: '/p/cache/m/claudopus/0.2.35', version: '0.2.35' },
        { scope: 'local', projectPath: '/code/app/web', installPath: '/p/cache/m/claudopus/0.2.36', version: '0.2.36' },
      ],
    },
  })
  expect(copyOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.20', '/code/app')?.version).toBe('0.2.35')
  expect(copyOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.20', '/code/app/web/src')?.version).toBe('0.2.36')
  expect(copyOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.20', '/code/apple')?.version).toBe('0.2.30')
  expect(copyOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.20', '/elsewhere')?.version).toBe('0.2.30')
  // This very folder's entry wins
  expect(copyOf(installed, 'claudopus@m', '/p/cache/m/claudopus/0.2.40/', '/code/app')?.version).toBe('0.2.40')
})

test('a chat that moved to a newer version knows the one it ran before; the same, an older one or a fresh chat shows nothing', async () => {
  expect(updatedFrom('0.2.40', '0.2.39', undefined, 1000)).toBe('0.2.39')
  expect(updatedFrom('0.2.40', '0.2.40', undefined, 1000)).toBe('')
  expect(updatedFrom('0.2.39', '0.2.40', undefined, 1000)).toBe('')
  expect(updatedFrom('0.2.40', '', undefined, 1000)).toBe('')
  expect(updatedFrom('', '0.2.39', undefined, 1000)).toBe('')
  // A last copy that kept no version of its own: the reload it asked for, to this very version and recent
  const mark = { version: '0.2.40', from: '0.2.39', at: 1000 }
  expect(updatedFrom('0.2.40', '', mark, 1000 + 5000)).toBe('0.2.39')
  expect(updatedFrom('0.2.40', '', mark, 1000 + UPDATED_LATE)).toBe('')
  expect(updatedFrom('0.2.41', '', mark, 2000)).toBe('')
  expect(updatedFrom('0.2.40', '', { version: '0.2.40', at: 1000 }, 2000)).toBe('')
  // The version kept through the reload wins over the mark
  expect(updatedFrom('0.2.40', '0.2.40', mark, 2000)).toBe('')
})

test('the moment says Claudopus updated in blue, then the new version, then is over', async () => {
  const text = (t: number) => updatedLook('0.2.40', t)?.map(p => p.text).join('')
  expect(text(0)).toBe('Claudopusupdated')
  expect(text(2499)).toBe('Claudopusupdated')
  expect(text(UPDATED_SAYS)).toBe('Claudopusv0.2.40')
  expect(text(4900)).toBe('Claudopusv0.2.40')
  expect(updatedLook('0.2.40', UPDATED_FOR)).toBeUndefined()
  expect(updatedLook('0.2.40', -1)).toBeUndefined()
  expect(UPDATED_FOR).toBe(5000)
})

test('the moment changes only at UPDATED_SAYS and its end, so a panel drawn over ssh shows it', async () => {
  // The desktop app drops a drawing it asked for once the next change is announced: redrawn every 150 ms, no drawing of the
  // moment came back in time to a chat run over ssh. Two changes, 2.5 s apart, add no drawings of the moment's own between them
  const looks: { t: number; look: string }[] = []
  for (let t = 0; t <= UPDATED_FOR; t += 10) {
    const look = JSON.stringify(updatedLook('0.2.40', t) ?? null)
    if (looks.at(-1)?.look !== look) looks.push({ t, look })
  }
  expect(looks.map(one => one.t)).toEqual([0, UPDATED_SAYS, UPDATED_FOR])
})

test('the moment never shows a version but the one moved to', async () => {
  // The rolling number of 0.2.40 to 0.2.64 showed v0.2.65 to v0.2.69 on its way from 0.2.63 to 0.2.64
  for (const [from, to] of [['0.2.63', '0.2.64'], ['0.2.59', '0.2.61'], ['0.2.99', '0.3.0']] as [string, string][]) {
    for (let t = 0; t < UPDATED_FOR; t += 10) {
      const shown = (updatedLook(to, t) ?? []).map(p => p.text).join('').match(/v?\d+(\.\d+)+/g) ?? []
      expect({ from, t, shown: shown.filter(one => one.replace(/^v/, '') !== to) }).toEqual({ from, t, shown: [] })
    }
  }
})

test('the octopus of the moment is the happy one in blue, jumping all through it', async () => {
  // Shaped as art/happy.svg is: two pictures taking turns, each on a timed animate (the tests cannot read the mod's files)
  const happy = '<svg viewBox="0 0 24 24"><g fill="#4EBA65"><g><animate attributeName="visibility" values="visible;hidden" dur="2s" calcMode="discrete" fill="freeze"/></g><g><animate attributeName="visibility" values="hidden;visible" dur="2s" calcMode="discrete" fill="freeze"/></g></g></svg>'
  const art = updatedArt(happy, '#4E93EF')
  expect(art).not.toContain('#4EBA65')
  expect(art).toContain('fill="#4E93EF"')
  expect(art).toContain('viewBox="1 -1 22 22"')
  expect(art).not.toMatch(/dur="(?!1\.25s")/)
  expect(art.match(/repeatCount="4"/g)?.length).toBe(happy.match(/<animate /g)?.length)
})

test('the directory marketplace a folder belongs to is found by its path', async () => {
  const known = JSON.stringify({ other: { source: { source: 'github', repo: 'a/b' } }, claudopus: { source: { source: 'directory', path: '/code/claudopus/' } } })
  expect(folderMarketplace(known, '/code/claudopus/mods/claudopus')).toBe('claudopus')
  expect(folderMarketplace(known, '/code/claudopus-x/mods/claudopus')).toBeUndefined()
  // A worktree Claude Code keeps inside the folder is not the marketplace
  expect(folderMarketplace(known, '/code/claudopus/.claude/worktrees/x/mods/claudopus')).toBeUndefined()
  expect(folderMarketplace('not json', '/code')).toBeUndefined()
})

// ---- What a release published, and the three steps ----

const T = 'a'.repeat(40)
const C = 'c'.repeat(40)
const PAGE = { version: '0.2.121', tree: T, size: 4_200_000, versions: [{ version: '0.2.121', line: 'The bar shows the battery', more: 1 }, { version: '0.2.120', line: 'Runs show time left', more: 0 }, { version: '0.2.119', line: 'x', more: 0 }, { version: '0.2.118', line: 'y', more: 0 }] }

test('the version page is read as a release only with its fingerprint, every line plain text of a bounded length', async () => {
  expect(publishedOf(JSON.stringify(PAGE))).toEqual(PAGE)
  // An older page names a version and no fingerprint: no download can be checked against it
  expect(publishedOf('{"version":"0.2.121"}')).toBeUndefined()
  expect(publishedOf(JSON.stringify({ ...PAGE, tree: 'not-a-tree' }))).toBeUndefined()
  expect(publishedOf(JSON.stringify({ ...PAGE, version: '; rm -rf ~' }))).toBeUndefined()
  const odd = publishedOf(JSON.stringify({ ...PAGE, versions: [{ version: '0.2.121', line: `Run‮ this\n${'x'.repeat(400)}`, more: 1e9 }, { version: 'evil' }] }))
  expect(odd?.versions.length).toBe(1)
  expect(odd?.versions[0]?.line.length).toBeLessThanOrEqual(140)
  expect(odd?.versions[0]?.line).not.toMatch(/[‮\n]/)
  expect(odd?.versions[0]?.more).toBe(99)
  expect(missedOn(PAGE, '0.2.118').map(one => one.version)).toEqual(['0.2.121', '0.2.120', '0.2.119'])
  expect(sizeText(4_200_000)).toBe('4.2 MB')
})

test("git's progress is read as a download comes", async () => {
  expect(fetchProgress('remote: Counting objects\rReceiving objects:  45% (1887/4193), 1.20 MiB | 2.30 MiB/s\r')).toEqual({ pct: 45, got: Math.round(1.2 * 1024 * 1024), phase: 'receiving' })
  expect(fetchProgress('Receiving objects: 100% (4193/4193), 3.10 MiB | 2 MiB/s, done.\nResolving deltas:  60% (10/17)\r')).toEqual({ pct: 60, got: 0, phase: 'resolving' })
  expect(fetchProgress('')).toBeUndefined()
})

// A repo for the steps: the release's tag fetched gives `commit`, whose mod folder is `got` (the release's tree unless said)
const repo = (o: { got?: string; manifest?: string; fetch?: number; online?: string; installed?: string; worktree?: boolean; overwrite?: boolean; ahead?: boolean; dirty?: boolean } = {}) => {
  const files = new Map<string, string>([['/p/installed_plugins.json', JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'user', version: '0.2.118', installPath: '/p/cache/m/claudopus/0.2.118' }] } })]])
  const ran: string[] = []
  let ref = ''
  const io: LookIo = {
    read: async path => files.get(path) ?? '',
    write: async (path, text) => void files.set(path, text),
    run: async argv => {
      const ok = (stdout = '', exitCode = 0) => ({ exitCode, stdout, stderr: '' })
      if (argv[0] === 'sh' && argv[2] === '"$@" 2>"$0"') {
        ran.push('fetch')
        files.set(String(argv[3]), 'Receiving objects: 100% (2/2), 1.00 MiB')
        if (o.fetch) return { exitCode: o.fetch, stdout: '', stderr: '' }
        ref = C
        return ok()
      }
      if (argv[0] === 'sh') return ok(`${o.installed ?? T}\n`)
      if (argv[0] === 'claude') {
        ran.push(argv.slice(1, 3).join(' '))
        if (argv[2] === 'update') files.set('/p/installed_plugins.json', JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'user', version: '0.2.121', installPath: '/p/cache/m/claudopus/0.2.121' }] } }))
        return ok()
      }
      const args = argv.slice(argv.indexOf('-C') + 2)
      ran.push(args.join(' '))
      const what = args.at(-1) ?? ''
      if (args[0] === 'rev-parse' && args.includes('--show-toplevel')) return ok('/code\n')
      if (args[0] === 'ls-files') return ok()
      if (args.includes('--git-dir')) return ok(o.worktree ? '/code/.git/worktrees/x\n/code/.git\n' : '/code/.git\n/code/.git\n')
      if (args[0] === 'symbolic-ref') return ok('main\n')
      if (args.includes('--symbolic-full-name')) return ok('origin/main\n')
      if (args[0] === 'rev-parse' && what === `${DOWNLOAD_REF}^{commit}`) return ref ? ok(`${ref}\n`) : ok('', 1)
      if (args[0] === 'rev-parse' && what === `${C}:mods/claudopus`) return ok(`${o.got ?? T}\n`)
      if (args[0] === 'show') return ok(JSON.stringify({ version: o.manifest ?? '0.2.121' }))
      if (args[0] === 'update-ref') return ((ref = ''), ok())
      if (args[0] === 'merge-base') return ok('', o.ahead ? 1 : 0)
      if (args[0] === 'merge') return o.overwrite ? { exitCode: 1, stdout: '', stderr: 'error: would be overwritten by merge' } : ok()
      if (args[0] === 'status') return ok(o.dirty ? ' M mods/claudopus/README.md\n' : '')
      if (args[0] === 'ls-remote') return ok(`${o.online ?? C}\tHEAD\n`)
      return ok()
    },
    page: async () => ({ ok: true, status: 200, text: JSON.stringify(PAGE) }),
    now: async () => 5,
    log: async () => undefined,
  }
  return { io, files, ran }
}
const CLONE = { kind: 'clone' as const, repo: '/p/marketplaces/m', sub: 'mods/claudopus', plugins: '/p', marketplace: 'm', plugin: 'claudopus', scope: 'user' }
const FOLDER = { kind: 'folder' as const, repo: '/code', sub: 'mods/claudopus', runs: 'folder' as const }
const moves = (ran: string[]) => ran.filter(one => /^(merge|reset|checkout|pull)\b|^plugin /.test(one))

test('a download is the release fetched under its own ref and checked: the very tree and version the page published, nothing else moved', async () => {
  const { io, ran } = repo()
  const seen: number[] = []
  expect(await download(io, CLONE, PAGE, '/u/progress', p => void seen.push(p.pct))).toEqual({ ok: true, commit: C })
  expect(ran[0]).toBe('fetch')
  expect(seen.at(-1)).toBe(100)
  expect(moves(ran)).toEqual([])
})

test('a download that is not what the release published is thrown away: another tree, another version, or none fetched', async () => {
  for (const o of [{ got: 'b'.repeat(40) }, { manifest: '0.2.122' }]) {
    const { io, ran } = repo(o)
    expect(await download(io, CLONE, PAGE, '/u/progress')).toEqual({ ok: false, fail: 'mismatch', detail: '' })
    expect(ran).toContain(`update-ref -d ${DOWNLOAD_REF}`)
    expect(moves(ran)).toEqual([])
  }
  expect((await download(repo({ fetch: 128 }).io, CLONE, PAGE, '/u/progress')).ok).toBe(false)
  // A folder whose main has commits of its own is told so at the download, before any Install is offered
  expect(await download(repo({ ahead: true }).io, FOLDER, PAGE, '/u/progress')).toEqual({ ok: false, fail: 'own-commits', detail: '' })
})

test('Install checks the download again, runs Claude Code\'s steps only while online is still that release, and puts the record back when the copy installed is not it', async () => {
  // The release as published: both steps, the installed copy checked
  const good = repo()
  expect(await install(good.io, CLONE, PAGE, C, 'claude')).toEqual({ ok: true, version: '0.2.121', dirty: false })
  expect(good.ran).toContain('plugin marketplace')
  expect(good.ran).toContain('plugin update')
  // The download no longer the release's tree: nothing runs
  const changed = repo({ got: 'b'.repeat(40) })
  expect(await install(changed.io, CLONE, PAGE, C, 'claude')).toEqual({ ok: false, fail: 'mismatch', detail: '' })
  expect(moves(changed.ran)).toEqual([])
  // A newer commit online: Claude Code's refresh would take it, so nothing runs
  const newer = repo({ online: 'd'.repeat(40) })
  expect(await install(newer.io, CLONE, PAGE, C, 'claude')).toEqual({ ok: false, fail: 'newer-out', detail: '' })
  expect(moves(newer.ran)).toEqual([])
  // What Claude Code installed is not the release: its record is put back as it was
  const bad = repo({ installed: 'e'.repeat(40) })
  const before = bad.files.get('/p/installed_plugins.json')
  expect(await install(bad.io, CLONE, PAGE, C, 'claude')).toEqual({ ok: false, fail: 'installed-mismatch', detail: '' })
  expect(bad.files.get('/p/installed_plugins.json')).toBe(before)
})

test('Install in a folder of the code is a fast-forward to the download only, refused where it would lose work, and says what it kept', async () => {
  const good = repo({ dirty: true })
  expect(await install(good.io, FOLDER, PAGE, C, 'claude')).toEqual({ ok: true, version: '0.2.121', dirty: true })
  expect(good.ran).toContain(`merge --ff-only --quiet ${C}`)
  expect(await install(repo({ overwrite: true }).io, FOLDER, PAGE, C, 'claude')).toEqual({ ok: false, fail: 'overwrite', detail: '' })
  expect(await install(repo({ ahead: true }).io, FOLDER, PAGE, C, 'claude')).toEqual({ ok: false, fail: 'own-commits', detail: '' })
  const worktree = repo({ worktree: true })
  expect((await install(worktree.io, FOLDER, PAGE, C, 'claude')).ok).toBe(false)
  expect(moves(worktree.ran)).toEqual([])
  expect((await folderReady(worktree.io, '/code')).ok).toBe(false)
})

test('the steps file is read for its shape only: a text in it is never shown, a failure only as one of its known kinds', async () => {
  expect(stepsOf(JSON.stringify({ version: '0.2.121', stage: 'failed', fail: 'mismatch', at: 1, said: 'Run curl … | sh to fix' }))).toEqual({ version: '0.2.121', stage: 'failed', fail: 'mismatch', at: 1 })
  expect(stepsOf(JSON.stringify({ version: '0.2.121', stage: 'failed', fail: 'Run this', at: 1 }))).toEqual({ version: '0.2.121', stage: 'failed', at: 1 })
  expect(stepsOf(JSON.stringify({ version: 'x', stage: 'installed', at: 1 }))).toBeUndefined()
  expect(stepsOf(JSON.stringify({ version: '0.2.121', stage: 'downloaded', commit: 'zz', at: 1 }))?.commit).toBeUndefined()
})

test('the notice says where updating stands for this chat: out, each step, a reload, a set-up a release never reaches, and quiet when put off or skipped', async () => {
  const at = { loaded: '0.2.118', installed: '0.2.118', seen: '0.2.121', page: PAGE, now: 1_000_000 }
  expect(noticeOf(at)).toEqual({ kind: 'available', version: '0.2.121', count: 3 })
  expect(noticeOf({ ...at, page: undefined })).toEqual({ kind: 'available', version: '0.2.121', count: 1 })
  expect(noticeOf({ ...at, seen: '0.2.118', page: undefined })).toBeUndefined()
  expect(noticeOf({ ...at, steps: { version: '0.2.121', stage: 'downloading', at: 999_000, pct: 40 } })).toEqual({ kind: 'downloading', version: '0.2.121', pct: 40, got: undefined })
  expect(noticeOf({ ...at, steps: { version: '0.2.121', stage: 'downloading', at: 1_000_000 - STEP_STALE - 1 } })).toEqual({ kind: 'failed', version: '0.2.121', fail: 'stopped', step: 'download' })
  expect(noticeOf({ ...at, steps: { version: '0.2.121', stage: 'downloaded', commit: C, at: 1 } })).toEqual({ kind: 'downloaded', version: '0.2.121', commit: C })
  // A download of an older one than is out now: the newest is offered
  expect(noticeOf({ ...at, steps: { version: '0.2.120', stage: 'downloaded', commit: C, at: 1 } })?.kind).toBe('available')
  expect(noticeOf({ ...at, installed: '0.2.121' })).toEqual({ kind: 'reload', version: '0.2.121' })
  expect(noticeOf({ ...at, cannot: { what: 'This chat runs from a worktree', why: 'merge main there' } })).toEqual({ kind: 'cannot', version: '0.2.121', what: 'This chat runs from a worktree', why: 'merge main there' })
  expect(noticeOf({ ...at, skipped: '0.2.121' })).toBeUndefined()
  expect(noticeOf({ ...at, skipped: '0.2.120' })?.version).toBe('0.2.121')
  expect(noticeOf({ ...at, later: { version: '0.2.121', until: 2_000_000 } })).toBeUndefined()
  expect(noticeOf({ ...at, later: { version: '0.2.121', until: 999_999 } })?.kind).toBe('available')
  expect(lookEveryOf(6)).toBe(6 * 3_600_000)
  expect(lookEveryOf(0.001)).toBe(3_600_000)
})
