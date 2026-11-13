import { expect, test } from 'claude-code/testing'

import { copyOf, installedFrom, installedVersionOf, isNewer, isReloadDue, RELOAD_AGAIN, isUpdateDue, scopeOf, stampOf, UPDATE_EVERY, updatedArt, updatedFrom, updatedLook, updatedTo, updateSteps, UPDATED_FOR, UPDATED_LATE, VERSION_PAGE, versionOnPage } from './update'

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
  expect(text(0)).toBe('Claudopus updated')
  expect(updatedLook('0.2.40', 0)!.every(p => p.tone !== 'name')).toBe(true)
  expect(text(4900)).toBe('Claudopus v0.2.40')
  expect(updatedLook('0.2.40', 4900)!.at(-1)).toEqual({ text: 'v0.2.40', tone: 'blue' })
  expect(updatedLook('0.2.40', UPDATED_FOR)).toBeUndefined()
  expect(updatedLook('0.2.40', -1)).toBeUndefined()
  expect(UPDATED_FOR).toBe(5000)
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
  const happy = '<svg><g fill="#4EBA65"><animate values="a;b" dur="2s" fill="freeze"/></g></svg>'
  const art = updatedArt(happy, '#4E93EF')
  expect(art).not.toContain('#4EBA65')
  expect(art).toContain('fill="#4E93EF"')
  expect(art).toContain('dur="1.25s" repeatCount="4"')
})
