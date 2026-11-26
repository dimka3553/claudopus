import { expect, test } from 'claude-code/testing'

import { chartOf } from './progress-page'
import type { ChartArea, ProgressGoal } from './progress-page'

// Made-up goals and areas: some with long names, some under no goal, some at work
const goals: ProgressGoal[] = ['Fast checkout', 'One clear brand', 'A sound company with a rather long name', 'Tools that help', 'Happy buyers'].map((name, i) => ({ id: `g${i}`, name, color: '#5B8DEF' }))
const areasOf = (n: number): ChartArea[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `a${i}`,
    name: `Area ${i}`,
    color: '#5B8DEF',
    goal: i % 7 === 6 ? '' : `g${i % 5}`,
    done: i % 4,
    aside: i % 5 === 0 ? 1 : 0,
    next: 1 + (i % 3),
    month: (i * 7) % 13,
    weeks: [0, 0, 0, 0, 0, 0, 0, 0],
    live: i === 3,
  }))
// Each ring's name: where it stands and what it says
const namesOf = (source: string) => [...source.matchAll(/<text x="([\d.]+)" y="([\d.]+)" text-anchor="middle"[^>]*font-size="(?:12|10\.5)"[^>]*>([^<]*)<\/text>/g)].map(m => ({ x: Number(m[1]), y: Number(m[2]), name: m[3] as string }))

test('the chart is one ring per goal, its done of all in the middle and its name under it, in rows that fit the pane, the goal at work in purple', () => {
  for (const width of [728, 398]) {
    for (const n of [3, 12, 40]) {
      const chart = chartOf('Software people trust to grow their small shop', goals, areasOf(n), width)
      expect(chart.source.length).toBeLessThanOrEqual(131_072)
      const used = new Set(areasOf(n).map(area => area.goal)).size
      const names = namesOf(chart.source)
      expect(names.length).toBeGreaterThanOrEqual(used)
      expect(names.length).toBeLessThanOrEqual(2 * used)
      // Every name inside the pane, and no two in a row closer than their own width
      for (const one of names) expect(one.x - (one.name.length * (width >= 560 ? 12 : 10.5) * 0.55) / 2).toBeGreaterThanOrEqual(0)
      for (const one of names) expect(one.x + (one.name.length * (width >= 560 ? 12 : 10.5) * 0.55) / 2).toBeLessThanOrEqual(width)
      for (const one of names) expect(one.y).toBeLessThan(chart.height)
    }
  }
  const chart = chartOf('Software people trust to grow their small shop', goals, areasOf(12), 728)
  expect(chart.source).toContain('“Software people trust to grow their small shop”')
  // Fast checkout holds areas 0, 5 and 10: 0 + 1 + 2 done, 3 aside, 1 + 3 + 2 next
  expect(chart.source).toContain('>3<tspan fill="#9b9a93" font-size="12" font-weight="400">/12</tspan>')
  expect(chart.source).toMatch(/fill="#8A63F0" font-weight="600">Tools that help</)
  // A long name takes a second line rather than being cut
  expect(chart.source).toContain('>A sound company</text>')
  expect(chart.source).toContain('>with a rather lo…</text>')
  expect(chart.alt).toContain('Fast checkout: 3 done, 3 aside, 6 next.')
  expect(chart.alt).toContain('Area 3: 3 done, 1 next, working now.')
})
