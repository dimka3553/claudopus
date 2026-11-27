import { expect, test } from 'claude-code/testing'

import { CHART_DAYS, chartMonths, chartOf, fewerProgress, progressView } from './progress-page'
import type { ChartArea } from './progress-page'

// Made-up areas: one with a long name, some under no goal, one at work; results only in the last 12 days, one area very busy
const areasOf = (n: number): ChartArea[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `a${i}`,
    name: i === 1 ? 'An area with a rather long name' : `Area ${i}`,
    color: '#5B8DEF',
    goal: i % 7 === 6 ? '' : `g${i % 5}`,
    done: i % 4,
    aside: i % 5 === 0 ? 1 : 0,
    month: (i * 7) % 13,
    days: Array.from({ length: CHART_DAYS }, (_, d) => (d < CHART_DAYS - 12 ? 0 : i === 3 ? 400 : (i + d) % 3)),
    live: i === 3,
  }))
const now = new Date(2026, 10, 27, 15).getTime()
// The chart's drawings as one text: what stands above its rows, each row, and the days under them
const src = (chart: ReturnType<typeof chartOf>) => [chart.head, ...chart.rows, chart.foot].map(part => part.source).join('\n')
const squaresIn = (source: string) => (source.match(/h[34]v[34]h-[34]z/g) ?? []).length
// Each goal's name and count, not the north star's lines: where it stands and what it says
const namesOf = (source: string) => [...source.matchAll(/<text x="([\d.]+)" y="([\d.]+)"(?: text-anchor="end")? (?![^>]*font-style)[^>]*font-size="(?:12\.5|11)"[^>]*>([^<]*)<\/text>/g)].map(m => ({ x: Number(m[1]), y: Number(m[2]), name: m[3] as string }))

test('the chart is one month and its rows are the areas: a square for each result, a row for each area worked on in it with the busiest first and its results of the month at the right, at most seven and the rest as Other, the area at work in purple', () => {
  for (const width of [728, 398]) {
    for (const n of [3, 12, 40]) {
      const areas = areasOf(n)
      const chart = chartOf('Software people trust to grow their small shop', areas, width, now)
      expect(Math.max(...[chart.head, ...chart.rows, chart.foot].map(part => part.source.length))).toBeLessThanOrEqual(131_072)
      const names = namesOf(src(chart)).filter(one => !/^\d+$/.test(one.name))
      expect(names.length).toBe(Math.min(n, 7))
      expect(chart.others.length).toBe(n === 3 ? 0 : n - 7)
      // Every task a square, but a day busier than its row can hold drawn only as high as the row allows
      const tasks = areas.reduce((s, area) => s + area.days.reduce((t, d) => t + d, 0), 0)
      if (n < 4) expect(squaresIn(src(chart))).toBe(tasks)
      else expect(squaresIn(src(chart))).toBeLessThan(tasks)
      expect(chart.alt).toContain('Results a day in November 2026, the area with the most first.')
      expect(chart.label).toBe('November 2026')
    }
  }
  const chart = chartOf('Software people trust to grow their small shop', areasOf(12), 728, now)
  expect(src(chart)).toContain('“Software people trust to grow their small shop”')
  // Area 3 is the busiest by far, so its row is the first; each row ends in its results of the month
  expect(namesOf(src(chart))[0]?.name).toBe('Area 3')
  expect(src(chart)).toContain(`fill="#5CB85C">${12 * 400}</text>`)
  expect(src(chart)).not.toContain('aside')
  expect(src(chart)).toMatch(/fill="#8A63F0" font-weight="600">Area 3</)
  // A long name is cut to the space beside its row
  expect(src(chart)).toContain('>An area with a rathe…</text>')
  expect(src(chart)).toContain('>today</text>')
  expect(chart.alt).toContain('Area 0: 12 results in November 2026.')
  expect(chart.alt).toContain('Area 3: 4800 results in November 2026, working now.')
  // Each row is an area that can be opened; past the first seven the rest are Other, named, and have rows only when asked for
  expect(chart.rows.map(row => row.id)).toEqual(['a3', 'a0', 'a1', 'a2', 'a4', 'a5', 'a6'])
  expect(chart.others).toEqual(['Area 7', 'Area 8', 'Area 9', 'Area 10', 'Area 11'])
  const whole = chartOf('Software people trust to grow their small shop', areasOf(12), 728, now, 0, 0, true)
  expect([whole.rows.length, whole.top, whole.others.length]).toEqual([12, 7, 5])
})

test('an earlier month is its own chart with its own rows, back to the first month with a result: no today, a square stands for more results once a day would stand too tall, and a line shows where Claudopus came in only in its month', () => {
  const long = (n: number): ChartArea[] =>
    Array.from({ length: n }, (_, i) => ({ ...areasOf(n)[i], days: Array.from({ length: CHART_DAYS }, (_, d) => (d < CHART_DAYS - 100 ? 0 : i === 0 ? 60 : i === 2 ? 0 : 1)) }) as ChartArea)
  const since = now - 20 * 86_400_000
  // 100 days back from 27 Nov is 20 Aug: August, September, October, November
  expect(chartMonths(long(3), now)).toBe(4)
  expect(chartMonths(areasOf(3), now)).toBe(1)
  for (const width of [728, 398]) {
    const chart = chartOf('Software people trust to grow their small shop', long(3), width, now, since)
    expect(Math.max(...[chart.head, ...chart.rows, chart.foot].map(part => part.source.length))).toBeLessThanOrEqual(131_072)
    expect(chart.alt).toMatch(/Each square is \d+ results\./)
    expect(chart.alt).toContain('Claudopus came in on 7 Nov.')
    expect(src(chart)).toContain('>Claudopus</text>')
    expect(src(chart)).toContain('>today</text>')
    expect(src(chart)).toMatch(/> ?\d+ results<\/text>/)
    const october = chartOf('Software people trust to grow their small shop', long(3), width, now, since, 1)
    expect(october.label).toBe('October 2026')
    expect(src(october)).toContain('>1 Oct</text>')
    expect(src(october)).not.toContain('>today</text>')
    expect(src(october)).not.toContain('>Claudopus</text>')
    // All 31 days of it: 60 a day in the first area, 1 a day in the second, and the area with nothing that month has no row
    expect(src(october)).toContain(`fill="#5CB85C">${31 * 60}</text>`)
    expect(src(october)).toContain('fill="#5CB85C">31</text>')
    expect(namesOf(src(october)).filter(one => !/^\d+$/.test(one.name)).map(one => one.name)).toEqual(['Area 0', width === 728 ? 'An area with a rathe…' : 'An area with a rather long name'])
    // A month before the first result says nothing is kept from it
    expect(src(chartOf('', long(3), width, now, since, 5))).toContain('>Nothing is kept from June 2026</text>')
    // August began on the 20th
    expect(src(chartOf('', long(3), width, now, since, 3))).toContain(`fill="#5CB85C">${12 * 60}</text>`)
  }
  // A quiet month's square is one result
  expect(chartOf('Software people trust to grow their small shop', areasOf(3), 728, now, now - 60 * 86_400_000).alt).not.toContain('Each square is')
})

test('a page of every area too big to draw gives up its boxes\' pictures, six at a time, then shuts the chart\'s Other, then the areas under no goal, and then has nothing more to give up', () => {
  Object.assign(progressView, { area: '', thumbs: 8, isAllOpen: true, isOtherOpen: true })
  expect([fewerProgress(), progressView.thumbs, fewerProgress(), progressView.thumbs, fewerProgress(), progressView.isAllOpen, fewerProgress(), progressView.isOtherOpen, fewerProgress()]).toEqual([true, 2, true, 0, true, false, true, false, false])
})
