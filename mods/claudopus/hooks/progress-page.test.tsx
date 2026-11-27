import { expect, test } from 'claude-code/testing'

import { CHART_DAYS, chartOf } from './progress-page'
import type { ChartArea, ProgressGoal } from './progress-page'

// Made-up goals and areas: some with long names, some under no goal, one at work; tasks only in the last 12 days, one area very busy
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
    days: Array.from({ length: CHART_DAYS }, (_, d) => (d < CHART_DAYS - 12 ? 0 : i === 3 ? 400 : (i + d) % 3)),
    live: i === 3,
  }))
const now = new Date(2026, 10, 27, 15).getTime()
const squaresIn = (source: string) => (source.match(/h[34]v[34]h-[34]z/g) ?? []).length
// Each goal's name and count, not the north star's lines: where it stands and what it says
const namesOf = (source: string) => [...source.matchAll(/<text x="([\d.]+)" y="([\d.]+)"(?: text-anchor="end")? (?![^>]*font-style)[^>]*font-size="(?:12\.5|11)"[^>]*>([^<]*)<\/text>/g)].map(m => ({ x: Number(m[1]), y: Number(m[2]), name: m[3] as string }))

test('the chart is a square for each task, a row for each goal from the first busy day to today, its steps done of all at the right, the goal at work in purple', () => {
  for (const width of [728, 398]) {
    for (const n of [3, 12, 40]) {
      const areas = areasOf(n)
      const chart = chartOf('Software people trust to grow their small shop', goals, areas, width, now)
      expect(chart.source.length).toBeLessThanOrEqual(131_072)
      const used = new Set(areas.map(area => area.goal)).size
      const names = namesOf(chart.source).filter(one => !/^\d/.test(one.name) && one.name !== '–')
      expect(names.length).toBe(used)
      for (const one of names) expect(one.y).toBeLessThan(chart.height)
      // Every task a square, but a day busier than its row can hold drawn only as high as the row allows
      const tasks = areas.reduce((s, area) => s + area.days.reduce((t, d) => t + d, 0), 0)
      if (n < 4) expect(squaresIn(chart.source)).toBe(tasks)
      else expect(squaresIn(chart.source)).toBeLessThan(tasks)
      // The days start where the tasks start, not three weeks back
      expect(chart.alt).toContain('Results a day, the last 12 days.')
    }
  }
  const chart = chartOf('Software people trust to grow their small shop', goals, areasOf(12), 728, now)
  expect(chart.source).toContain('“Software people trust to grow their small shop”')
  // Fast checkout holds areas 0, 5 and 10: 0 + 1 + 2 done of 3 + 1 + 3 + 2; what was set aside is not in the chart
  expect(chart.source).toContain('>3<tspan fill="#9b9a93" font-weight="400">/9</tspan>')
  expect(chart.source).not.toContain('aside')
  expect(chart.source).toMatch(/fill="#8A63F0" font-weight="600">Tools that help</)
  // A long name is cut to the space beside its row
  expect(chart.source).toContain('>A sound company with…</text>')
  expect(chart.source).toContain('>today</text>')
  expect(chart.alt).toContain('Fast checkout: ')
  expect(chart.alt).toContain('3 of 9 steps done.')
  expect(chart.alt).toContain('Area 3: 3 done, 1 next, working now.')
})

test('past five weeks the chart counts tasks a week, a square stands for more tasks once a week would stand too tall, and a line shows where Claudopus came in', () => {
  const weeks = (n: number): ChartArea[] =>
    Array.from({ length: n }, (_, i) => ({ ...areasOf(n)[i], days: Array.from({ length: CHART_DAYS }, (_, d) => (d < CHART_DAYS - 100 ? 0 : i === 0 ? 60 : 1)) }) as ChartArea)
  const since = now - 20 * 86_400_000
  for (const width of [728, 398]) {
    const chart = chartOf('Software people trust to grow their small shop', goals, weeks(3), width, now, since)
    expect(chart.source.length).toBeLessThanOrEqual(131_072)
    expect(chart.alt).toMatch(/Results a week, the last 1[45] weeks\./)
    expect(chart.alt).toMatch(/Each square is \d+ results\./)
    expect(chart.alt).toContain('Claudopus came in on 7 Nov.')
    expect(chart.source).toContain('>Claudopus</text>')
    expect(chart.source).toContain('>this week</text>')
    expect(chart.source).toMatch(/> ?\d+ results<\/text>/)
  }
  // A short chart has no line when Claudopus came in before its first day, and a square is one task
  const short = chartOf('Software people trust to grow their small shop', goals, areasOf(3), 728, now, now - 60 * 86_400_000)
  expect(short.source).not.toContain('>Claudopus</text>')
  expect(short.alt).not.toContain('Each square is')
})
