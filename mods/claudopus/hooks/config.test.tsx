import { expect, test } from 'claude-code/testing'

import { fillModels, leanOf, modelsOf, modelsShort, parse, sectionsOf } from './config'

test('as shipped, the models rule says what the chat was told before Config existed, with clearly stated jobs on Sonnet', async () => {
  const m = modelsOf({})
  expect(fillModels('- {models}', m)).toBe(
    '- Most work runs on Opus 5.5, `model: "opus"`. A clearly stated job, and long legwork such as indexing, runs on Sonnet 5.5, `model: "sonnet"`. Fable 5.2, `model: "fable"`, is only for heavy or really complicated work. Work that checks or verifies what was built runs on Opus 5.5, `model: "opus"`, or Fable 5.2, `model: "fable"`, when what it checks was built on Fable 5.2: never on a model weaker than the one that built it, so never on Sonnet 5.5. Never Haiku. A model is named by these aliases, never by an older version: an agent named an older model starts on its newest.',
  )
  expect(fillModels('Helpers run on {helpers}.', m)).toBe('Helpers run on Sonnet 5.5, `model: "sonnet"`, never Haiku, and never on an older model.')
  // A check runs on most work's model or heavy work's, never on legwork's
  expect(fillModels('It runs on {checker}.', m)).toBe(
    'It runs on Opus 5.5, `model: "opus"`, or Fable 5.2, `model: "fable"`, when what it checks was built on Fable 5.2: never on a model weaker than the one that built what it checks, so never on Sonnet 5.5.',
  )
  // Never two names for one model, and never a check on Sonnet even when most work runs on it
  expect(fillModels('{checker}', modelsOf({ models: { work: 'fable' } }))).toBe(
    'Fable 5.2, `model: "fable"`: never on a model weaker than the one that built what it checks, so never on Sonnet 5.5',
  )
  expect(fillModels('{checker}', modelsOf({ models: { work: 'sonnet', legwork: 'opus' } }))).toBe(
    'Opus 5.5, `model: "opus"`, or Fable 5.2, `model: "fable"`, when what it checks was built on Fable 5.2: never on a model weaker than the one that built what it checks',
  )
  // A model picked is named; with Haiku picked the rules no longer forbid it; a name it does not know is as shipped
  const picked = modelsOf({ models: { legwork: 'haiku', heavy: 'nonsense' } })
  expect(fillModels('{helpers}', picked)).toBe('Haiku 5.5, `model: "haiku"`, and never on an older model')
  expect(picked.heavy).toBe('fable')
  expect(parse('{ broken')).toEqual({})
})

test('the chat hands a clearly stated job to a quick task on Sonnet, on Fable only when every task runs on it, and never to a copy of itself; a choice of who does a short request that a config.json still holds counts for nothing, and an own copy of the rules made when there was one reads as the rules do now', async () => {
  const m = modelsOf({})
  const shipped = fillModels('{lanes}\n{models}', m)
  expect(shipped).toContain('`subagent_type: "claudopus:quick"` and `model: "sonnet"`')
  expect(shipped).toContain('Never start a copy of this chat')
  expect(shipped).not.toContain('do it yourself, at once')
  const all = fillModels('{lanes}\n{models}', m, leanOf({ lean: { fable: 'all' } }))
  expect(all).toContain('`subagent_type: "claudopus:quick"` and `model: "fable"`')
  expect(all).not.toContain('A clearly stated job, and long legwork such as indexing, runs on Sonnet')
  expect(modelsShort(m)).toContain('"sonnet" for a clearly stated job (subagent_type "claudopus:quick")')
  expect(modelsShort(m, leanOf({ lean: { fable: 'all' } }))).toContain('"fable" for a clearly stated job')
  expect(shipped).toContain('when {name} names a model for the job, start it as a full task on that model')
  // The choice of 0.2.201 to 0.2.205 is read as nothing: every change goes to a task whatever it says
  for (const chat of ['itself', 'tasks']) {
    expect(leanOf({ lean: { chat } as never })).toEqual(leanOf({}))
    expect(fillModels('{lanes}\n{models}', m, leanOf({ lean: { chat } as never }))).toBe(shipped)
  }
  // An own copy from before that choice is filled as it is, and one made under it opens as the rules do now and holds each line once
  const before = 'This chat changes no file in its own thread.\n\n- My own line.\n{lanes}\n- A request that can be done on its own gets its own agent right away.\n- {models}'
  expect(fillModels(before, m).match(/gets its own agent right away/g)?.length).toBe(1)
  const under = fillModels('{way}\n\n- My own line.\n{lanes}\n- {models}', m)
  expect(under.startsWith('This chat changes no file in its own thread, and runs a command only as the rules below allow')).toBe(true)
  expect(under).toContain('- My own line.')
  expect(under.match(/gets its own agent right away/g)?.length).toBe(1)
  expect(under).not.toContain('{way}')
})

test('the principles read by their parts, numbered or bulleted', async () => {
  expect(sectionsOf('# T\n\nintro\n\n## Principles\n\n1. One.\n2. Two.\n\n## Working rules\n\n- Three.\n\n## Empty\n\ntext\n')).toEqual([
    { title: 'Principles', lines: ['One.', 'Two.'] },
    { title: 'Working rules', lines: ['Three.'] },
  ])
})
