#!/usr/bin/env node
// Joins the parts in this folder into the one hooks module the mod loads, mods/claudopus/hooks/register.tsx, and each part in
// tests/, after tests/world.tsx, into mods/claudopus/hooks/tests/<part>. Anthropic's plugin directory lets the engine ($) and `on` pass only to
// functions in the same file, so the mod ships one file; the parts are kept apart by job for reading and editing. Each part is a
// script with no imports or exports: all of them are one scope, as in the joined file, and globals.d.ts (made here from
// imports.tsx) gives them what the joined file imports. `node src/claudopus/build.mjs` writes the files; `--check` only says
// whether they are up to date, and fails when they are not
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const hooks = join(here, '../../mods/claudopus/hooks')
// Where each area's joined tests go
const TESTS_OUT = join(hooks, 'tests')

// The parts in the order they are joined: a part that uses another's value while the module loads comes after it
const PARTS = [
  'common.tsx', 'recorder.tsx', 'rules.tsx', 'settings.tsx', 'subjects.tsx', 'progress.tsx', 'cards.tsx', 'state.tsx', 'talk.tsx', 'servers.tsx', 'reports.tsx', 'opening.tsx', 'welcome.tsx',
  'results-tab.tsx', 'colours.tsx', 'memory.tsx', 'stats-tab.tsx', 'about.tsx', 'art.tsx', 'term-art.tsx', 'pictures.tsx', 'files.tsx', 'workflows.tsx', 'notify.tsx',
  'updating.tsx', 'changelog.tsx', 'asking.tsx', 'sharing.tsx', 'macs.tsx', 'afar.tsx', 'boxes.tsx', 'gate.tsx', 'prompts.tsx', 'runit.tsx', 'lean.tsx', 'needs.tsx', 'typed.tsx', 'chat.tsx', 'stuck.tsx', 'jobs.tsx', 'naming.tsx', 'heavy.tsx', 'tidy.tsx', 'steps.tsx', 'keep.tsx', 'keys.tsx', 'crossing.tsx', 'work.tsx', 'commands.tsx', 'tools.tsx', 'usage.tsx', 'pace.tsx', 'band.tsx',
  'progress-tab.tsx', 'panel.tsx', 'tabs.tsx', 'register.tsx',
]
const TEST_PARTS = [
  'world.tsx', 'chat.test.tsx', 'cards.test.tsx', 'left.test.tsx', 'finish.test.tsx', 'notify.test.tsx', 'commands.test.tsx', 'servers.test.tsx',
  'reports.test.tsx', 'pictures.test.tsx', 'memory.test.tsx', 'workflows.test.tsx', 'tabs.test.tsx', 'settings.test.tsx',
  'asking.test.tsx', 'welcome.test.tsx', 'sharing.test.tsx', 'prompts.test.tsx', 'macs.test.tsx', 'stuck.test.tsx', 'term-art.test.tsx', 'terminal-look.test.tsx', 'gate.test.tsx', 'security.test.tsx', 'steps.test.tsx', 'keep.test.tsx', 'keys.test.tsx', 'usage.test.tsx', 'updating.test.tsx', 'stop.test.tsx', 'hold.test.tsx', 'colours.test.tsx',
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

// The engine reads no hooks file over 1 MB (1,048,576 bytes), so the shipped file leaves out the parts' whole-line comments, which
// stay in the parts: a line goes only when it starts with // in plain code, never inside a string, a template or a block comment.
// A line that starts in plain code goes without its indent too, which no code reads; one inside a template keeps it whole.
// Regular expressions are told from division by what comes before them, so a // inside one is never taken for a comment
const HOOKS_MOST = 1_048_576
const commentLinesOut = text => {
  const out = []
  // The state at each line's start: 'code', or inside a template (with ${} depth kept), a block comment, a string
  const stack = [] // template literals and the ${ depth that returns to each
  let inBlock = false
  let last = '' // the last meaningful character of code, to tell a regex from division
  let i = 0
  const lines = text.split('\n')
  for (const line of lines) {
    const isCode = !inBlock && !stack.length
    if (isCode && /^\s*\/\/(\s|$)/.test(line)) continue
    out.push(isCode ? line.trimStart() : line)
    // Walk the line to carry the state to the next
    for (i = 0; i < line.length; i++) {
      const c = line[i]
      const top = stack.at(-1)
      if (inBlock) {
        if (c === '*' && line[i + 1] === '/') ((inBlock = false), i++)
        continue
      }
      if (top && top.depth === 0) {
        // inside a template's text
        if (c === '\\') i++
        else if (c === '`') ((stack.pop()), (last = ')'))
        else if (c === '$' && line[i + 1] === '{') ((top.depth = 1), i++, (last = '('))
        continue
      }
      if (c === '/' && line[i + 1] === '/') break
      if (c === '/' && line[i + 1] === '*') ((inBlock = true), i++)
      else if (c === '"' || c === "'") {
        for (i++; i < line.length && line[i] !== c; i++) if (line[i] === '\\') i++
        last = 'a'
      } else if (c === '`') ((stack.push({ depth: 0 })), (last = 'a'))
      else if (c === '/' && (last === '' || /[(,=:[!&|?{};+\-*%<>~^]/.test(last) || /\b(return|typeof|in|of|case|void|delete|throw|new|else|do|yield|await)\s*$/.test(line.slice(0, i)))) {
        let inClass = false
        for (i++; i < line.length; i++) {
          if (line[i] === '\\') i++
          else if (line[i] === '[') inClass = true
          else if (line[i] === ']') inClass = false
          else if (line[i] === '/' && !inClass) break
        }
        last = 'a'
      } else if (c === '{' && top) ((top.depth++), (last = c))
      else if (c === '}' && top) ((top.depth--), (last = top.depth === 0 ? 'a' : c))
      else if (!/\s/.test(c)) last = c
    }
  }
  if (inBlock || stack.length) throw new Error('build.mjs: the joined file ends inside a comment or a template, so its comments were not left out right')
  return out.join('\n')
}

const shippable = text => {
  const size = Buffer.byteLength(text)
  if (size > HOOKS_MOST) throw new Error(`build.mjs: the joined hooks file is ${size} bytes, over the ${HOOKS_MOST} the engine reads: make the parts shorter`)
  return text
}

const joined = (dir, parts, out, listed = parts) => {
  // A part left off the list would be left out of the joined file
  const unlisted = readdirSync(dir).filter(name => name.endsWith('.tsx') && name !== 'imports.tsx' && !listed.includes(name))
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
  if (!process.argv.includes('--check') && !process.argv.includes('--notes')) {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const entry = `## ${version} · ${date}\n${waiting.flatMap(one => one.lines).join('\n')}\n\n`
    const at = changelog.search(/^## /m)
    changelog = at < 0 ? `${changelog.trimEnd()}\n\n${entry}` : `${changelog.slice(0, at)}${entry}${changelog.slice(at)}`
    writeFileSync(CHANGELOG, changelog)
    for (const one of waiting) rmSync(join(CHANGES, one.name))
    console.log(`Changelog: ${version} from ${waiting.map(one => one.name).join(', ')}`)
  }
}
// `--notes` prints the GitHub release's text for plugin.json's version, from its changelog entry, and writes nothing: release
// makes the version's GitHub release with it, so the repo page's latest release and its badge are always the version installs get
if (process.argv.includes('--notes')) {
  if (process.env.RELEASE_VERSION && process.env.RELEASE_VERSION !== version) {
    console.error(`Release is making ${process.env.RELEASE_VERSION}, but plugin.json says ${version}.`)
    process.exit(1)
  }
  const entry = versionsIn(changelog).find(v => v.version === version)
  if (!entry?.changes.length) {
    console.error(`Version ${version} has no changelog entry to make its GitHub release from.`)
    process.exit(1)
  }
  console.log(
    [
      '**Claude Code, with eight arms.** One chat runs many jobs at once, on your own Mac, with a panel beside it that shows each one.',
      '',
      `## What changed in ${version}`,
      '',
      ...entry.changes.map(one => `- ${one}`),
      '',
      'Every version and what it changed: [the changelog](https://www.claudopus.ai/changelog.html).',
      '',
      'Install it with one line in Terminal:',
      '',
      '```',
      'curl -fsSL https://www.claudopus.ai/install.sh | sh',
      '```',
      '',
      'A newer version shows in the panel: press Download, then Install, then type /reload-plugins. See the [README](https://github.com/dimka3553/claudopus#readme) and the [full guide](https://github.com/dimka3553/claudopus/blob/main/mods/claudopus/docs/guide.md).',
    ].join('\n'),
  )
  process.exit(0)
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

// The version page every install reads: the version, and what a download of it must be to be installed. `tree` is git's own
// fingerprint of the mod's folder as this build leaves it, the very tree the release commits (the release adds every file the build
// made and refuses files it does not track), so a copy downloaded from GitHub or installed by Claude Code is checked against it
// file for file before Claudopus offers to install it; `size` its bytes; `versions` the newest few with the first line of each's
// changes, which the panel shows as what is new. Made last, from the folder after everything else here is written
const PAGE_VERSIONS = 30
const lineOf = text => {
  const plain = text.replace(/`/g, '').replace(/\s+/g, ' ').trim()
  const first = /^(.{20,}?[.;:])(\s|$)/.exec(plain)?.[1] ?? plain
  if (first.length <= 110) return first.replace(/[.;:]$/, '')
  const comma = first.slice(0, 110).lastIndexOf(',')
  return comma > 40 ? first.slice(0, comma) : `${first.slice(0, 107).replace(/\s+\S*$/, '')}…`
}
const treeOf = () => {
  const root = join(here, '../..')
  const scratch = mkdtempSync(join(tmpdir(), 'claudopus-tree-'))
  try {
    const git = args => execFileSync('git', ['-C', root, ...args], { env: { ...process.env, GIT_INDEX_FILE: join(scratch, 'index') }, encoding: 'utf8' }).trim()
    git(['read-tree', '--empty'])
    git(['add', '-A', '--', 'mods/claudopus'])
    const tree = git(['write-tree', '--prefix=mods/claudopus/'])
    const size = git(['ls-tree', '-r', '-l', tree]).split('\n').reduce((n, line) => n + (Number(line.split(/\s+/)[3]) || 0), 0)
    return { tree, size }
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
}
const versionPage = () => {
  const { tree, size } = treeOf()
  const versions = versionsIn(changelog).slice(0, PAGE_VERSIONS).map(v => ({ version: v.version, line: v.changes[0] ? lineOf(v.changes[0]) : '', more: Math.max(0, v.changes.length - 1) }))
  return `${JSON.stringify({ version: JSON.parse(read(join(hooks, '../.claude-plugin/plugin.json'))).version, tree, size, versions })}\n`
}

const files = [
  [join(hooks, 'register.tsx'), shippable(commentLinesOut(joined(here, PARTS, 'It is the hooks module hooks.json names. Whole-line comments are only in the parts.')))],
  [join(here, 'globals.d.ts'), globalsOf(importsOf(join(here, 'imports.tsx')), m => (m.startsWith('./') ? `../../mods/claudopus/hooks/${m.slice(2)}` : m === '../types' ? '../../mods/claudopus/types' : m))],
  // Each area's tests are a file of their own, world.tsx's set-up joined before them, so the engine's plugin test runs them side by side
  ...TEST_PARTS.filter(name => name !== 'world.tsx').map(name => [
    join(TESTS_OUT, name),
    joined(join(here, 'tests'), ['world.tsx', name], "Its tests run with the engine's plugin test.", TEST_PARTS).replace(/^(import .* from )'\.\/([^']+)'$/gm, "$1'../$2'"),
  ]),
  [join(here, 'tests/globals.d.ts'), globalsOf(importsOf(join(here, 'tests/imports.tsx')), m => (m.startsWith('./') ? `../../../mods/claudopus/hooks/${m.slice(2)}` : m))],
  // The page claudopus.ai serves with the current version, which every install reads to know when to update: made from plugin.json,
  // so it moves with each release pushed to main
  [join(here, '../../site/changelog.html'), changelogPage()],
  // Last, and made only when its turn comes, once every file of the mod above is written
  [join(here, '../../site/version.json'), versionPage],
]

const isCheck = process.argv.includes('--check')
const stale = []
// The one joined test file of before, and an area's file whose part is gone, are stale: the build removes them
const leftover = [join(hooks, 'register.test.tsx'), ...(existsSync(TESTS_OUT) ? readdirSync(TESTS_OUT).filter(name => !TEST_PARTS.includes(name)).map(name => join(TESTS_OUT, name)) : [])].filter(path => existsSync(path))
for (const path of leftover) {
  stale.push(path)
  if (!isCheck) rmSync(path)
}
if (!isCheck) mkdirSync(TESTS_OUT, { recursive: true })
for (const [path, made] of files) {
  const text = typeof made === 'function' ? made() : made
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
