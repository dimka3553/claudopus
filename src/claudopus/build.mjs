#!/usr/bin/env node
// Joins the parts in this folder into the one hooks module the mod loads, mods/claudopus/hooks/register.tsx, and the parts in
// tests/ into mods/claudopus/hooks/register.test.tsx. Anthropic's plugin directory lets the engine ($) and `on` pass only to
// functions in the same file, so the mod ships one file; the parts are kept apart by job for reading and editing. Each part is a
// script with no imports or exports: all of them are one scope, as in the joined file, and globals.d.ts (made here from
// imports.tsx) gives them what the joined file imports. `node src/claudopus/build.mjs` writes the files; `--check` only says
// whether they are up to date, and fails when they are not
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const hooks = join(here, '../../mods/claudopus/hooks')

// The parts in the order they are joined: a part that uses another's value while the module loads comes after it
const PARTS = [
  'common.tsx', 'rules.tsx', 'settings.tsx', 'subjects.tsx', 'cards.tsx', 'talk.tsx', 'servers.tsx', 'reports.tsx', 'welcome.tsx',
  'results-tab.tsx', 'memory.tsx', 'stats-tab.tsx', 'about.tsx', 'art.tsx', 'term-art.tsx', 'pictures.tsx', 'workflows.tsx', 'notify.tsx',
  'updating.tsx', 'changelog.tsx', 'asking.tsx', 'sharing.tsx', 'macs.tsx', 'afar.tsx', 'boxes.tsx', 'gate.tsx', 'prompts.tsx', 'chat.tsx', 'stuck.tsx', 'steps.tsx', 'work.tsx', 'commands.tsx', 'tools.tsx', 'band.tsx',
  'panel.tsx', 'tabs.tsx', 'register.tsx',
]
const TEST_PARTS = [
  'world.tsx', 'chat.test.tsx', 'cards.test.tsx', 'finish.test.tsx', 'notify.test.tsx', 'commands.test.tsx', 'servers.test.tsx',
  'reports.test.tsx', 'pictures.test.tsx', 'memory.test.tsx', 'workflows.test.tsx', 'tabs.test.tsx', 'settings.test.tsx',
  'asking.test.tsx', 'welcome.test.tsx', 'sharing.test.tsx', 'prompts.test.tsx', 'macs.test.tsx', 'stuck.test.tsx', 'term-art.test.tsx', 'terminal-look.test.tsx', 'gate.test.tsx', 'steps.test.tsx',
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
  const text = `${HEAD(dir === here ? 'src/claudopus' : 'src/claudopus/tests', out)}${lines.join('\n')}\n\n${bodies.join('\n\n')}\n`
  // A test's '<shipped: path>' string becomes the text of that file as the mod ships it, so a test can hold the shipped file itself
  return dir === here ? text : text.replace(/'<shipped: ([\w./-]+)>'/g, (_, path) => JSON.stringify(read(join(hooks, '..', path))))
}


// ---- The changelog ----
// mods/claudopus/CHANGELOG.md holds what changed for the person in each version; the mod's About opens it, its update screen shows
// the versions a person did not have, and the site's changelog page is made from it here. Work never writes a version's heading:
// it says what it changed in a file of its own in mods/claudopus/changes/ (a "- " line each), and the build that finds the version
// newer than the changelog's newest, as in release's own checkout once it numbered the version, makes it that version's entry and
// removes the files. A newer version with no such file fails the build, so no release goes out without its entry
const CHANGELOG = join(hooks, '../CHANGELOG.md')
const CHANGES = join(hooks, '../changes')
const isNewer = (a, b) => {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0)
  return false
}
const versionsIn = text => {
  const out = []
  for (const line of text.split('\n')) {
    const head = /^## (\d+\.\d+\.\d+)(?:\s+·\s+(.+))?\s*$/.exec(line)
    if (head) out.push({ version: head[1], date: (head[2] || '').trim(), changes: [] })
    else if (out.length && /^- \S/.test(line)) out.at(-1).changes.push(line.slice(2).trim())
  }
  return out
}
const pending = () =>
  (existsSync(CHANGES) ? readdirSync(CHANGES) : []).filter(name => name.endsWith('.md') && name !== 'README.md').sort().map(name => {
    const lines = read(join(CHANGES, name)).split('\n').map(line => line.trimEnd()).filter(Boolean)
    const odd = lines.find(line => !/^- \S/.test(line))
    if (!lines.length || odd) throw new Error(`mods/claudopus/changes/${name}: write each change for the person as a "- " line${odd ? `, not "${odd.slice(0, 60)}"` : ''}`)
    return { name, lines }
  })
const version = JSON.parse(read(join(hooks, '../.claude-plugin/plugin.json'))).version
let changelog = read(CHANGELOG)
const newest = versionsIn(changelog)[0]?.version ?? '0.0.0'
const waiting = pending()
if (isNewer(version, newest)) {
  if (!waiting.length) {
    console.error(`Version ${version} has no changelog entry: say what it changed for the person, in plain words, a "- " line each, in mods/claudopus/changes/<your branch>.md, commit it and release again.`)
    process.exit(1)
  }
  if (!process.argv.includes('--check')) {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const entry = `## ${version} · ${date}\n${waiting.flatMap(one => one.lines).join('\n')}\n\n`
    const at = changelog.search(/^## /m)
    changelog = at < 0 ? `${changelog.trimEnd()}\n\n${entry}` : `${changelog.slice(0, at)}${entry}${changelog.slice(at)}`
    writeFileSync(CHANGELOG, changelog)
    for (const one of waiting) rmSync(join(CHANGES, one.name))
    console.log(`Changelog: ${version} from ${waiting.map(one => one.name).join(', ')}`)
  }
}
const escaped = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// The site's page: the site's own look, each version a section
const changelogPage = () => {
  const page = read(join(here, 'changelog-page.html'))
  const body = versionsIn(changelog)
    .map(v => `<section id="v${v.version}"><h2>v${v.version}</h2><p class="note">${escaped(v.date)}</p><ul>${v.changes.map(one => `<li>${escaped(one)}</li>`).join('')}</ul></section>`)
    .join('\n')
  return page.replace('<!-- versions -->', body)
}

const files = [
  [join(hooks, 'register.tsx'), joined(here, PARTS, 'It is the hooks module hooks.json names.')],
  [join(here, 'globals.d.ts'), globalsOf(importsOf(join(here, 'imports.tsx')), m => (m.startsWith('./') ? `../../mods/claudopus/hooks/${m.slice(2)}` : m === '../types' ? '../../mods/claudopus/types' : m))],
  [join(hooks, 'register.test.tsx'), joined(join(here, 'tests'), TEST_PARTS, "Its tests run with the engine's plugin test.")],
  [join(here, 'tests/globals.d.ts'), globalsOf(importsOf(join(here, 'tests/imports.tsx')), m => (m.startsWith('./') ? `../../../mods/claudopus/hooks/${m.slice(2)}` : m))],
  // The page claudopus.ai serves with the current version, which every install reads to know when to update: made from plugin.json,
  // so it moves with each release pushed to main
  [join(here, '../../site/changelog.html'), changelogPage()],
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
