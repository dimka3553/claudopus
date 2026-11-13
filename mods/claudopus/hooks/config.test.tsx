import { expect, test } from 'claude-code/testing'

import { fillModels, modelsOf, parse, sectionsOf } from './config'

test('as shipped, the models rule says what the chat was told before Config existed', async () => {
  const m = modelsOf({})
  expect(fillModels('- {models}', m)).toBe(
    '- Most work runs on Opus 5.5, `model: "opus"`. Long legwork such as indexing runs on Sonnet 5.5, `model: "sonnet"`. Fable 5.2, `model: "fable"`, is only for heavy or really complicated work. Work that checks or verifies what was built runs on Opus 5.5, `model: "opus"`, or Fable 5.2, `model: "fable"`, when what it checks was built on Fable 5.2: never on a model weaker than the one that built it, so never on Sonnet 5.5. Never Haiku.',
  )
  expect(fillModels('Helpers run on {helpers}.', m)).toBe('Helpers run on Sonnet 5.5, never Haiku.')
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
  expect(fillModels('{helpers}', picked)).toBe('Haiku 5.5')
  expect(picked.heavy).toBe('fable')
  expect(parse('{ broken')).toEqual({})
})

test('the principles read by their parts, numbered or bulleted', async () => {
  expect(sectionsOf('# T\n\nintro\n\n## Principles\n\n1. One.\n2. Two.\n\n## Working rules\n\n- Three.\n\n## Empty\n\ntext\n')).toEqual([
    { title: 'Principles', lines: ['One.', 'Two.'] },
    { title: 'Working rules', lines: ['Three.'] },
  ])
})
