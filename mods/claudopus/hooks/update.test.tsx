import { expect, test } from 'claude-code/testing'

import { installedFrom, installedVersionOf, isNewer, isUpdateDue, scopeOf, stampOf, UPDATE_EVERY, updatedTo, updateSteps, VERSION_PAGE, versionOnPage } from './update'

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
