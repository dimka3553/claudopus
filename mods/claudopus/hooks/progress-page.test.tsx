import { expect, test } from 'claude-code/testing'

import { CHART_DAYS, chartMonths, chartOf, fewerProgress, progressView } from './progress-page'
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

test('the chart is one month: a square for each result, a row for each goal with the busiest first and its results of the month at the right, the goal at work in purple', () => {
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
      expect(chart.alt).toContain('Results a day in November 2026, the goal with the most first.')
      expect(chart.label).toBe('November 2026')
    }
  }
  const chart = chartOf('Software people trust to grow their small shop', goals, areasOf(12), 728, now)
  expect(chart.source).toContain('“Software people trust to grow their small shop”')
  // Tools that help holds area 3, the busiest by far, so its row is the first; each row ends in its results of the month
  expect(namesOf(chart.source).filter(one => !/^\d/.test(one.name))[0]?.name).toBe('Tools that help')
  expect(chart.source).toContain(`fill="#5CB85C">${12 * 400 + 12}</text>`)
  expect(chart.source).not.toContain('aside')
  expect(chart.source).toMatch(/fill="#8A63F0" font-weight="600">Tools that help</)
  // A long name is cut to the space beside its row
  expect(chart.source).toContain('>A sound company with…</text>')
  expect(chart.source).toContain('>today</text>')
  expect(chart.alt).toContain('Fast checkout: ')
  expect(chart.alt).toContain('Area 3: 3 done, 1 next, working now.')
})

test('an earlier month is its own chart, back to the first month with a result: no today, a square stands for more results once a day would stand too tall, and a line shows where Claudopus came in only in its month', () => {
  const long = (n: number): ChartArea[] =>
    Array.from({ length: n }, (_, i) => ({ ...areasOf(n)[i], days: Array.from({ length: CHART_DAYS }, (_, d) => (d < CHART_DAYS - 100 ? 0 : i === 0 ? 60 : i === 2 ? 0 : 1)) }) as ChartArea)
  const since = now - 20 * 86_400_000
  // 100 days back from 27 Nov is 20 Aug: August, September, October, November
  expect(chartMonths(long(3), now)).toBe(4)
  expect(chartMonths(areasOf(3), now)).toBe(1)
  for (const width of [728, 398]) {
    const chart = chartOf('Software people trust to grow their small shop', goals, long(3), width, now, since)
    expect(chart.source.length).toBeLessThanOrEqual(131_072)
    expect(chart.alt).toMatch(/Each square is \d+ results\./)
    expect(chart.alt).toContain('Claudopus came in on 7 Nov.')
    expect(chart.source).toContain('>Claudopus</text>')
    expect(chart.source).toContain('>today</text>')
    expect(chart.source).toMatch(/> ?\d+ results<\/text>/)
    const october = chartOf('Software people trust to grow their small shop', goals, long(3), width, now, since, 1)
    expect(october.label).toBe('October 2026')
    expect(october.source).toContain('>1 Oct</text>')
    expect(october.source).not.toContain('>today</text>')
    expect(october.source).not.toContain('>Claudopus</text>')
    // All 31 days of it: 60 a day in the first goal, 1 a day in the second, and the goal with nothing that month a dash
    expect(october.source).toContain(`fill="#5CB85C">${31 * 60}</text>`)
    expect(october.source).toContain('fill="#5CB85C">31</text>')
    expect(october.source).toContain('>–</text>')
    // August began on the 20th
    expect(chartOf('', goals, long(3), width, now, since, 3).source).toContain(`fill="#5CB85C">${12 * 60}</text>`)
  }
  // A quiet month's square is one result
  expect(chartOf('Software people trust to grow their small shop', goals, areasOf(3), 728, now, now - 60 * 86_400_000).alt).not.toContain('Each square is')
})

test('a list of every area too big to draw gives up its rows\' pictures, six at a time, and then nothing more', () => {
  Object.assign(progressView, { area: '', thumbs: 8 })
  expect([fewerProgress(), progressView.thumbs, fewerProgress(), progressView.thumbs, fewerProgress()]).toEqual([true, 2, true, 0, false])
})
