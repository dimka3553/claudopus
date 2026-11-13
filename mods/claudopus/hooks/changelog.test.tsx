import { expect, test } from 'claude-code/testing'

import { changelogOf, fitted, isScreenDue, missedOf, SCREEN_BUDGET, seenIn } from './changelog'

const LOG = ['# Changelog', '', 'What changed.', '', '## 0.2.3 · 13 November 2026', '- Three.', '- Three again.', '', '## 0.2.2 · 12 November 2026', '- Two.', '', '## 0.2.1', '- One.', ''].join('\n')

test('the changelog reads as its versions newest first, each with its date and changes', async () => {
  expect(changelogOf(LOG)).toEqual([
    { version: '0.2.3', date: '13 November 2026', changes: ['Three.', 'Three again.'] },
    { version: '0.2.2', date: '12 November 2026', changes: ['Two.'] },
    { version: '0.2.1', date: '', changes: ['One.'] },
  ])
})

test('the update screen shows every version after the one seen, up to the one moved to, and none for the same version', async () => {
  const versions = changelogOf(LOG)
  expect(missedOf(versions, '0.2.1', '0.2.3').shown.map(v => v.version)).toEqual(['0.2.3', '0.2.2'])
  expect(missedOf(versions, '0.2.2', '0.2.3').shown.map(v => v.version)).toEqual(['0.2.3'])
  expect(missedOf(versions, '0.2.1', '0.2.2').shown.map(v => v.version)).toEqual(['0.2.2'])
  expect(isScreenDue('0.2.3', '0.2.3')).toBe(false)
  expect(isScreenDue('0.2.3', '0.2.4')).toBe(false)
  expect(isScreenDue('0.2.3', '')).toBe(false)
  expect(isScreenDue('0.2.10', '0.2.9')).toBe(true)
})

test('after a long gap the screen keeps under the tab limit: the newest versions that fit, the rest counted', async () => {
  const long = Array.from({ length: 2000 }, (_, i) => `## 0.${Math.floor((2000 - i) / 100)}.${(2000 - i) % 100} · 1 January 2027\n- ${'A change in plain words. '.repeat(7)}\n- ${'Another one. '.repeat(10)}\n`).join('\n')
  const versions = changelogOf(long)
  const { shown, left } = missedOf(versions, '0.0.0', '99.0.0')
  expect(shown.length).toBeGreaterThan(10)
  expect(shown.length + left).toBe(2000)
  const chars = shown.reduce((n, v) => n + v.changes.join('').length + 600 * (v.changes.length + 2), 0)
  expect(chars).toBeLessThan(262_000)
  expect(fitted(versions, SCREEN_BUDGET).shown).toEqual(shown)
  // One enormous version still shows
  expect(fitted([{ version: '1.0.0', date: '', changes: ['x'.repeat(100_000)] }], SCREEN_BUDGET).shown.length).toBe(1)
})

test('the record of changes seen is one version, anything else none', async () => {
  expect(seenIn('{"version":"0.2.3"}')).toBe('0.2.3')
  expect(seenIn('{"version":3}')).toBe('')
  expect(seenIn('')).toBe('')
})
