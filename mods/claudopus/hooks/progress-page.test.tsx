import { expect, test } from 'claude-code/testing'

import { wheelOf } from './progress-page'
import type { ProgressGoal, WheelArea } from './progress-page'

// A made-up wheel: goals, and many areas with long names, some at work, some with a busy last 8 weeks
const goals: ProgressGoal[] = ['Fast checkout', 'One clear brand', 'A sound company', 'Tools that help', 'Happy buyers'].map((name, i) => ({ id: `g${i}`, name, color: '#5B8DEF' }))
const areasOf = (n: number): WheelArea[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `a${i}`,
    name: i % 3 ? `Area number ${i}` : `A rather long area name ${i} that goes on`,
    color: '#5B8DEF',
    goal: i % 7 === 6 ? '' : `g${i % 5}`,
    done: i % 4,
    aside: i % 5 === 0 ? 1 : 0,
    next: 1 + (i % 3),
    month: (i * 7) % 13,
    weeks: [0, 1, 2, 3, 4, 5, 6, 7].map(w => (i + w) % 5),
    live: i % 9 === 0,
  }))
// Each name's place: its side, and its line's middle
const namesOf = (source: string, size: string) =>
  [...source.matchAll(new RegExp(`<text x="([\\d.]+)" y="([\\d.]+)" text-anchor="(start|end)"[^>]*font-size="${size}"[^>]*>([^<]*)</text>`, 'g'))].map(m => ({ x: Number(m[1]), y: Number(m[2]), side: m[3] as string, name: m[4] as string }))

test('the wheel of many areas stays one Svg the app draws, every name beside it apart from the others, and long names cut to fit a narrow pane', () => {
  for (const [width, size, apart] of [[728, '12.5', 30], [398, '10.5', 12.5]] as const) {
    for (const n of [3, 12, 40]) {
      const wheel = wheelOf('Software people trust to grow their small shop', goals, areasOf(n), width)
      expect(wheel.source.length).toBeLessThanOrEqual(131_072)
      expect(wheel.height).toBeLessThan(width)
      const names = namesOf(wheel.source, size)
      expect(names.length).toBeGreaterThan(0)
      for (const side of ['start', 'end']) {
        const ys = names.filter(one => one.side === side).map(one => one.y).sort((a, b) => a - b)
        for (let i = 1; i < ys.length; i++) expect((ys[i] ?? 0) - (ys[i - 1] ?? 0)).toBeGreaterThanOrEqual(apart - 0.2)
        for (const one of names.filter(o => o.side === side)) expect(side === 'start' ? width - one.x : one.x).toBeGreaterThanOrEqual(one.name.length * Number(size) * 0.56)
      }
      for (const one of names) expect(one.y).toBeGreaterThan(0)
      for (const one of names) expect(one.y).toBeLessThan(wheel.height)
    }
  }
  // The north star in the centre, and the areas at work named in purple, a long name cut short where the pane ends
  const wheel = wheelOf('Software people trust to grow their small shop', goals, areasOf(12), 728)
  expect(wheel.source).toContain('“Software people')
  expect(wheel.source).toMatch(/fill="#8A63F0" font-weight="600">A rather long area name…</)
  expect(wheel.alt).toContain('A rather long area name 0 that goes on: 0 done, 1 aside, 1 next, working now.')
})
