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

test('as shipped the chat does a short request itself in few steps and starts one task for a bigger one; set to a task each, it hands a clearly stated job to a quick task on Sonnet, on Fable only when every task runs on it; never a copy of itself', async () => {
  const m = modelsOf({})
  const itself = fillModels('{way}\n{lanes}\n{models}\n{second}', m)
  expect(itself).toContain('This chat does a job of a few minutes itself')
  expect(itself).toContain('do it yourself, at once. Start no agent for it.')
  expect(itself).toContain('one command for the same replacement across files')
  expect(itself).toContain('fix that as part of the job instead of reporting it')
  expect(itself).toContain('start one task: the Agent tool with `subagent_type: "claudopus:task"`')
  expect(itself).toContain('Its instructions set no limit {name} did not set.')
  expect(itself).toContain('Never start a copy of this chat')
  expect(itself).toContain('No second agent looks unless {name} asks for one')
  expect(itself).not.toContain('claudopus:quick')
  expect(itself).not.toContain('A clearly stated job')
  expect(itself).not.toContain('changes no file in its own thread')
  const shipped = fillModels('{way}\n{lanes}\n{models}', m, leanOf({ lean: { chat: 'tasks' } }))
  expect(shipped).toContain('This chat changes no file in its own thread')
  expect(shipped).toContain('gets its own agent right away')
  expect(shipped).toContain('`subagent_type: "claudopus:quick"` and `model: "sonnet"`')
  expect(shipped).toContain('Never start a copy of this chat')
  const all = fillModels('{lanes}\n{models}', m, leanOf({ lean: { chat: 'tasks', fable: 'all' } }))
  expect(all).toContain('`subagent_type: "claudopus:quick"` and `model: "fable"`')
  expect(all).not.toContain('A clearly stated job, and long legwork such as indexing, runs on Sonnet')
  expect(modelsShort(m)).toContain('"sonnet" for a clearly stated job (subagent_type "claudopus:quick")')
  expect(modelsShort(m, leanOf({ lean: { fable: 'all' } }))).toContain('"fable" for a clearly stated job')
  expect(shipped).toContain('when {name} names a model for the job, start it as a full task on that model')
})

test('the principles read by their parts, numbered or bulleted', async () => {
  expect(sectionsOf('# T\n\nintro\n\n## Principles\n\n1. One.\n2. Two.\n\n## Working rules\n\n- Three.\n\n## Empty\n\ntext\n')).toEqual([
    { title: 'Principles', lines: ['One.', 'Two.'] },
    { title: 'Working rules', lines: ['Three.'] },
  ])
})
