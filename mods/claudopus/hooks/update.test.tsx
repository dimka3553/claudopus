import { expect, test } from 'claude-code/testing'

import { checkSaid, copyOf, folderLook, folderMarketplace, installedFrom, installedVersionOf, isNewer, isReloadDue, lookOnce, RELOAD_AGAIN, isUpdateDue, scopeOf, stampOf, UPDATE_EVERY, updatedArt, updatedFrom, updatedLook, updatedTo, updateSteps, UPDATED_FOR, UPDATED_LATE, UPDATED_SAYS, VERSION_PAGE, versionOnPage } from './update'
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

test("what plugin update printed is read as the version it moved to or found", async () => {
  expect(updatedTo('Checking for updates for plugin "claudopus@claudopus"…\n✔ Plugin "claudopus" updated from 0.2.22 to 0.2.25 for scope user. Restart to apply changes.')).toEqual({ version: '0.2.25', isNew: true })
  expect(updatedTo('✔ claudopus is already at the latest version (0.2.22).')).toEqual({ version: '0.2.22', isNew: false })
  expect(updatedTo('✘ Failed to update')).toBeUndefined()
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
  for (const [from, to] of [['0.2.63', '0.2.64'], ['0.2.59', '0.2.61'], ['0.2.99', '0.3.0']]) {
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

// A Mac for one look: installed_plugins.json naming `have`, the version page naming `page` (or not answering), and what the two
// update steps print
const mac = (have: string, page: string | undefined, steps: { refresh?: number; update?: string } = {}) => {
  const files = new Map<string, string>([['/p/installed_plugins.json', JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'user', version: have, installPath: `/p/cache/m/claudopus/${have}` }] } })]])
  const ran: string[][] = []
  const io: LookIo = {
    read: async path => files.get(path) ?? '',
    write: async (path, text) => void files.set(path, text),
    run: async argv => {
      ran.push(argv)
      if (argv[2] === 'marketplace') return { exitCode: steps.refresh ?? 0, stdout: '', stderr: steps.refresh ? 'fatal: could not read from remote' : '' }
      return { exitCode: 0, stdout: steps.update ?? '', stderr: '' }
    },
    page: async () => (page === undefined ? { ok: false, status: 0, text: 'no answer' } : { ok: true, status: 200, text: JSON.stringify({ version: page }) }),
    now: async () => 5,
    log: async () => undefined,
  }
  const at = { from: { plugins: '/p', marketplace: 'm', plugin: 'claudopus' }, root: `/p/cache/m/claudopus/${have}`, engine: 'claude', stampPath: '/u/update.json' }
  return { io, at, files, ran }
}

test('a look runs nothing when the page names the installed version, and says it is the newest', async () => {
  const { io, at, files, ran } = mac('0.2.70', '0.2.70')
  const look = await lookOnce(io, at)
  expect(look).toEqual({ kind: 'latest', version: '0.2.70' })
  expect(ran).toEqual([])
  expect(stampOf(files.get('/u/update.json') ?? '')).toEqual({ at: 5, version: '0.2.70', result: 'latest' })
  expect(checkSaid(look, '0.2.70')).toEqual({ text: "You're on the newest version (v0.2.70).", isError: false })
})

test('a look for a newer version runs both steps and says to type /reload-plugins', async () => {
  const { io, at, files, ran } = mac('0.2.69', '0.2.71', { update: '✔ Plugin "claudopus" updated from 0.2.69 to 0.2.71 for scope user. Restart to apply changes.' })
  const look = await lookOnce(io, at)
  expect(look).toEqual({ kind: 'updated', version: '0.2.71' })
  expect(ran).toEqual(updateSteps('claude', at.from, 'user'))
  expect(stampOf(files.get('/u/update.json') ?? '')?.result).toBe('updated')
  expect(checkSaid(look, '0.2.69')).toEqual({ text: 'v0.2.71 downloaded. Type /reload-plugins to switch this chat to it, or it switches by itself in a moment.', isError: false })
  // In a chat run from another Mac it only switches when typed
  expect(checkSaid(look, '0.2.69', true).text).toBe('v0.2.71 downloaded. Type /reload-plugins to switch this chat to it.')
  // Downloaded before by another chat while this one still runs the old copy: the same words, since this chat has yet to switch
  expect(checkSaid({ kind: 'latest', version: '0.2.71' }, '0.2.69', true).text).toBe('v0.2.71 downloaded. Type /reload-plugins to switch this chat to it.')
})

test('a chat on a copy another update replaced compares the copy it would load, at that copy\'s scope', async () => {
  // Installed only for the project, already moved to 0.2.71 by another chat; this chat still runs the 0.2.69 folder
  const { io, at, files, ran } = mac('0.2.69', '0.2.71')
  files.set('/p/installed_plugins.json', JSON.stringify({ plugins: { 'claudopus@m': [{ scope: 'project', projectPath: '/repo', version: '0.2.71', installPath: '/p/cache/m/claudopus/0.2.71' }] } }))
  const look = await lookOnce(io, { ...at, cwd: '/repo/src' })
  expect(look).toEqual({ kind: 'latest', version: '0.2.71' })
  expect(ran).toEqual([])
  expect(checkSaid(look, '0.2.69', true).text).toBe('v0.2.71 downloaded. Type /reload-plugins to switch this chat to it.')
})

test('a look that cannot read the page or download says why, plainly', async () => {
  const silent = mac('0.2.70', undefined)
  const unread = await lookOnce(silent.io, silent.at)
  expect(unread).toEqual({ kind: 'failed', why: 'claudopus.ai did not answer' })
  expect(silent.ran).toEqual([])
  expect(checkSaid(unread, '0.2.70')).toEqual({ text: "Couldn't check: claudopus.ai did not answer. Try again later.", isError: true })
  const offline = mac('0.2.70', '0.2.71', { refresh: 1 })
  const refused = await lookOnce(offline.io, offline.at)
  expect(offline.ran.length).toBe(1)
  expect(checkSaid(refused, '0.2.70')).toEqual({ text: "Couldn't download v0.2.71: Claude Code could not refresh where it comes from (fatal: could not read from remote). Try again later.", isError: true })
  // A source left behind (a folder of its code not brought up to date) is no "newest"
  const behind = mac('0.2.64', '0.2.71', { update: '✔ claudopus is already at the latest version (0.2.64).' })
  expect(checkSaid(await lookOnce(behind.io, behind.at), '0.2.64').text).toBe("Couldn't download v0.2.71: where Claude Code installs it from still has v0.2.64. Bring that up to date, then check again.")
  const odd = mac('0.2.70', '0.2.71', { update: '✘ Failed to update' })
  expect(checkSaid(await lookOnce(odd.io, odd.at), '0.2.70').text).toBe("Couldn't download v0.2.71: Claude Code did not update it (✘ Failed to update). Try again later.")
})

// A folder of the code for one look: a git checkout on main following origin/main, its manifest at `have`; `git` says how each git
// command answers (by its first word after -C <folder>), and a merge that succeeds moves the manifest to `online`
const folder = (have: string, page: string | undefined, online: string, git: Record<string, { exitCode?: number; stdout?: string; stderr?: string }> = {}) => {
  const root = '/code/claudopus/mods/claudopus'
  const files = new Map<string, string>([
    [`${root}/.claude-plugin/plugin.json`, JSON.stringify({ name: 'claudopus', version: have })],
    ['/p/known_marketplaces.json', JSON.stringify({ claudopus: { source: { source: 'directory', path: '/code/claudopus' } } })],
    ['/p/installed_plugins.json', JSON.stringify({ plugins: { 'claudopus@claudopus': [{ scope: 'user', version: have, installPath: `/p/cache/claudopus/claudopus/${have}` }] } })],
  ])
  const ran: string[][] = []
  const io: LookIo = {
    read: async path => files.get(path) ?? '',
    write: async (path, text) => void files.set(path, text),
    run: async argv => {
      ran.push(argv)
      if (argv[0] !== 'env') return { exitCode: 0, stdout: '', stderr: '' }
      const args = argv.slice(argv.indexOf('-C') + 2)
      const key = args.includes('--symbolic-full-name') ? 'upstream' : args[0] === 'rev-parse' ? `rev-parse ${args.at(-1)}` : args[0]
      const plain: Record<string, string> = { 'rev-parse --show-toplevel': '/code/claudopus', 'symbolic-ref': 'main\n', upstream: 'origin/main\n', 'rev-parse @{u}': have === online ? 'aaa\n' : 'bbb\n', 'rev-parse HEAD': 'aaa\n' }
      const said = git[key] ?? { stdout: plain[key] ?? '' }
      const out = { exitCode: said.exitCode ?? 0, stdout: said.stdout ?? '', stderr: said.stderr ?? '' }
      if (key === 'merge' && out.exitCode === 0) files.set(`${root}/.claude-plugin/plugin.json`, JSON.stringify({ name: 'claudopus', version: online }))
      return out
    },
    page: async () => (page === undefined ? { ok: false, status: 0, text: 'no answer' } : { ok: true, status: 200, text: JSON.stringify({ version: page }) }),
    now: async () => 5,
    log: async () => undefined,
  }
  return { io, at: { root, plugins: '/p', engine: 'claude', stampPath: '/u/update.json' }, files, ran }
}
const gitRan = (ran: string[][]) => ran.filter(argv => argv[0] === 'env').map(argv => argv.slice(argv.indexOf('-C') + 2)[0])

test('a copy run from a folder of its code brings that folder up to date by a fast-forward, then refreshes Claude Code\'s record', async () => {
  const { io, at, files, ran } = folder('0.2.76', '0.2.88', '0.2.88')
  const look = await folderLook(io, at)
  expect(look).toEqual({ kind: 'updated', version: '0.2.88' })
  expect(gitRan(ran)).toEqual(['rev-parse', 'symbolic-ref', 'rev-parse', 'fetch', 'rev-parse', 'rev-parse', 'merge-base', 'merge'])
  expect(ran.find(argv => argv.includes('merge'))?.slice(-3)).toEqual(['--ff-only', '--quiet', '@{u}'])
  // Never asks for a password at the terminal
  expect(ran.filter(argv => argv[0] === 'env').every(argv => argv.includes('GIT_TERMINAL_PROMPT=0'))).toBe(true)
  expect(ran.filter(argv => argv[0] === 'claude')).toEqual(updateSteps('claude', { marketplace: 'claudopus', plugin: 'claudopus' }, 'user'))
  expect(stampOf(files.get('/u/update.json') ?? '')).toEqual({ at: 5, version: '0.2.88', result: 'updated' })
  expect(checkSaid(look, '0.2.76', false, true)).toEqual({ text: 'v0.2.88 is in its folder now. Type /reload-plugins to switch this chat to it, or it switches by itself in a moment.', isError: false })
})

test('a folder already at the version the page names runs nothing, and says it is the newest', async () => {
  const { io, at, ran } = folder('0.2.88', '0.2.88', '0.2.88')
  const look = await folderLook(io, at)
  expect(look).toEqual({ kind: 'latest', version: '0.2.88' })
  expect(ran).toEqual([])
  expect(checkSaid(look, '0.2.88', false, true).text).toBe("You're on the newest version (v0.2.88).")
  // Brought up to date by another chat while this one runs the old copy: this chat has yet to switch
  expect(checkSaid(look, '0.2.76', false, true).text).toBe('v0.2.88 is in its folder now. Type /reload-plugins to switch this chat to it, or it switches by itself in a moment.')
})

test('a folder is never changed when git would overwrite work there, or its branch has commits of its own', async () => {
  const dirty = folder('0.2.76', '0.2.88', '0.2.88', { merge: { exitCode: 1, stderr: 'error: Your local changes to the following files would be overwritten by merge:\n\tsrc/a.tsx\nAborting' } })
  const refused = await folderLook(dirty.io, dirty.at)
  expect(checkSaid(refused, '0.2.76', false, true)).toEqual({ text: "Couldn't update to v0.2.88: changes in its folder that aren't committed touch files the update changes. Nothing in it was changed.", isError: true })
  expect(dirty.ran.filter(argv => argv[0] === 'claude')).toEqual([])
  const ahead = folder('0.2.76', '0.2.88', '0.2.88', { 'merge-base': { exitCode: 1 } })
  expect(checkSaid(await folderLook(ahead.io, ahead.at), '0.2.76', false, true).text).toBe("Couldn't update to v0.2.88: its folder's branch main has commits of its own that origin/main does not have. Nothing in it was changed.")
  expect(gitRan(ahead.ran)).not.toContain('merge')
  const loose = folder('0.2.76', '0.2.88', '0.2.88', { 'symbolic-ref': { exitCode: 1, stdout: '' } })
  expect(checkSaid(await folderLook(loose.io, loose.at), '0.2.76', false, true).text).toBe("Couldn't update to v0.2.88: its folder is on no branch. Nothing in it was changed.")
  const offline = folder('0.2.76', '0.2.88', '0.2.88', { fetch: { exitCode: 128, stderr: 'fatal: unable to access github.com' } })
  expect(checkSaid(await folderLook(offline.io, offline.at), '0.2.76', false, true).text).toBe("Couldn't update to v0.2.88: its folder could not fetch origin/main (unable to access github.com). Nothing in it was changed.")
  const silent = folder('0.2.76', undefined, '0.2.88')
  expect(checkSaid(await folderLook(silent.io, silent.at), '0.2.76', false, true).text).toBe("Couldn't check: claudopus.ai did not answer. Try again later.")
  expect(silent.ran).toEqual([])
})

test('a folder whose branch online is still behind the page says so, not newest', async () => {
  const { io, at } = folder('0.2.76', '0.2.88', '0.2.87')
  expect(checkSaid(await folderLook(io, at), '0.2.76', false, true).text).toBe("Couldn't update to v0.2.88: its folder's branch online still has v0.2.87. Check again in a few minutes.")
})

test('the directory marketplace a folder belongs to is found by its path', async () => {
  const known = JSON.stringify({ other: { source: { source: 'github', repo: 'a/b' } }, claudopus: { source: { source: 'directory', path: '/code/claudopus/' } } })
  expect(folderMarketplace(known, '/code/claudopus/mods/claudopus')).toBe('claudopus')
  expect(folderMarketplace(known, '/code/claudopus-x/mods/claudopus')).toBeUndefined()
  expect(folderMarketplace('not json', '/code')).toBeUndefined()
})

test('an installed copy whose marketplace is a folder of the code brings that folder up to date before refreshing', async () => {
  const { io, at, files, ran } = mac('0.2.64', '0.2.71', { update: '✔ claudopus is already at the latest version (0.2.64).' })
  files.set('/p/known_marketplaces.json', JSON.stringify({ m: { source: { source: 'directory', path: '/code/claudopus' } } }))
  const look = await lookOnce({ ...io, run: async (argv, t) => (argv[0] === 'env' ? (argv.includes('merge-base') ? { exitCode: 1, stdout: '', stderr: '' } : { exitCode: 0, stdout: argv.includes('symbolic-ref') ? 'main' : argv.includes('--symbolic-full-name') ? 'origin/main' : argv.at(-1) === 'HEAD' ? 'aaa' : 'bbb', stderr: '' }) : io.run(argv, t)) }, at)
  expect(checkSaid(look, '0.2.64').text).toBe("Couldn't download v0.2.71: where Claude Code installs it from still has v0.2.64: its folder's branch main has commits of its own that origin/main does not have. Nothing in it was changed.")
  expect(ran).toEqual(updateSteps('claude', at.from, 'user'))
})

test('a page that answered with an error is said with its status, not as no answer', async () => {
  const { io, at } = mac('0.2.70', '0.2.70')
  const look = await lookOnce({ ...io, page: async () => ({ ok: false, status: 404, text: 'Not Found' }) }, at)
  expect(look).toEqual({ kind: 'failed', why: 'claudopus.ai answered 404' })
})
