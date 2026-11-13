#!/usr/bin/env node
// Joins the parts in this folder into the one hooks module the mod loads, mods/claudopus/hooks/register.tsx, and the parts in
// tests/ into mods/claudopus/hooks/register.test.tsx. Anthropic's plugin directory lets the engine ($) and `on` pass only to
// functions in the same file, so the mod ships one file; the parts are kept apart by job for reading and editing. Each part is a
// script with no imports or exports: all of them are one scope, as in the joined file, and globals.d.ts (made here from
// imports.tsx) gives them what the joined file imports. `node src/claudopus/build.mjs` writes the files; `--check` only says
// whether they are up to date, and fails when they are not
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const hooks = join(here, '../../mods/claudopus/hooks')

// The parts in the order they are joined: a part that uses another's value while the module loads comes after it
const PARTS = [
  'common.tsx', 'rules.tsx', 'settings.tsx', 'subjects.tsx', 'cards.tsx', 'talk.tsx', 'servers.tsx', 'reports.tsx', 'welcome.tsx',
  'results-tab.tsx', 'memory.tsx', 'stats-tab.tsx', 'about.tsx', 'art.tsx', 'pictures.tsx', 'workflows.tsx', 'notify.tsx',
  'updating.tsx', 'asking.tsx', 'sharing.tsx', 'macs.tsx', 'afar.tsx', 'prompts.tsx', 'chat.tsx', 'stuck.tsx', 'work.tsx', 'commands.tsx', 'tools.tsx', 'band.tsx',
  'panel.tsx', 'tabs.tsx', 'register.tsx',
]
const TEST_PARTS = [
  'world.tsx', 'chat.test.tsx', 'cards.test.tsx', 'finish.test.tsx', 'notify.test.tsx', 'commands.test.tsx', 'servers.test.tsx',
  'reports.test.tsx', 'pictures.test.tsx', 'memory.test.tsx', 'workflows.test.tsx', 'tabs.test.tsx', 'settings.test.tsx',
  'asking.test.tsx', 'welcome.test.tsx', 'sharing.test.tsx', 'prompts.test.tsx', 'macs.test.tsx', 'stuck.test.tsx',
]

const read = path => readFileSync(path, 'utf8')
// The import lines of imports.tsx, each whole, its comments left out
const importsOf = path =>
  read(path)
    .split('\n')
    .filter(line => !line.startsWith('//'))
    .join('\n')
    .split(/\n(?=import )/)
    .map(one => one.trim())
    .filter(Boolean)
const HEAD = (from, out) =>
  `// Made by src/claudopus/build.mjs from the parts in ${from}: change them there and build again, never this file. ${out}\n`

// What the joined file imports, as globals for the parts: each module once, each name aliased from it
const globalsOf = (lines, toPart) => {
  const modules = []
  const names = []
  for (const line of lines) {
    const m = /^import (type )?\{([^}]*)\} from '([^']+)'$/s.exec(line)
    if (!m) throw new Error(`imports.tsx: a line this build cannot read: ${line}`)
    const module = toPart(m[3])
    if (!modules.includes(module)) modules.push(module)
    for (const spec of m[2].split(',').map(one => one.trim()).filter(Boolean)) {
      const [imported, local = imported] = spec.replace(/^type /, '').split(/\s+as\s+/)
      names.push(`  export import ${local} = M${modules.indexOf(module)}.${imported}`)
    }
  }
  return [
    '// Made by build.mjs from imports.tsx: what the joined file imports, as globals for the parts, which share one scope as they do there',
    ...modules.map((module, i) => `import * as M${i} from '${module}'`),
    '',
    'declare global {',
    ...names,
    '}',
    '',
  ].join('\n')
}

const joined = (dir, parts, out) => {
  // A part left off the list would be left out of the joined file
  const unlisted = readdirSync(dir).filter(name => name.endsWith('.tsx') && name !== 'imports.tsx' && !parts.includes(name))
  if (unlisted.length) throw new Error(`build.mjs: add ${unlisted.join(', ')} to the list of parts, in its place`)
  const lines = importsOf(join(dir, 'imports.tsx'))
  const bodies = parts.map(name => read(join(dir, name)).replace(/\n+$/, ''))
  return `${HEAD(dir === here ? 'src/claudopus' : 'src/claudopus/tests', out)}${lines.join('\n')}\n\n${bodies.join('\n\n')}\n`
}

const files = [
  [join(hooks, 'register.tsx'), joined(here, PARTS, 'It is the hooks module hooks.json names.')],
  [join(here, 'globals.d.ts'), globalsOf(importsOf(join(here, 'imports.tsx')), m => (m.startsWith('./') ? `../../mods/claudopus/hooks/${m.slice(2)}` : m === '../types' ? '../../mods/claudopus/types' : m))],
  [join(hooks, 'register.test.tsx'), joined(join(here, 'tests'), TEST_PARTS, "Its tests run with the engine's plugin test.")],
  [join(here, 'tests/globals.d.ts'), globalsOf(importsOf(join(here, 'tests/imports.tsx')), m => (m.startsWith('./') ? `../../../mods/claudopus/hooks/${m.slice(2)}` : m))],
  // The page claudopus.ai serves with the current version, which every install reads to know when to update: made from plugin.json,
  // so it moves with each release pushed to main
  [join(here, '../../site/version.json'), `${JSON.stringify({ version: JSON.parse(read(join(hooks, '../.claude-plugin/plugin.json'))).version })}\n`],
]

const isCheck = process.argv.includes('--check')
const stale = []
for (const [path, text] of files) {
  let now = ''
  try {
    now = read(path)
  } catch {}
  if (now === text) continue
  stale.push(path)
  if (!isCheck) writeFileSync(path, text)
}
if (isCheck && stale.length) {
  console.error(`Not built from the parts: ${stale.join(', ')}. Run node src/claudopus/build.mjs`)
  process.exit(1)
}
console.log(isCheck ? 'Up to date.' : stale.length ? `Wrote ${stale.join(', ')}` : 'Up to date.')
