#!/usr/bin/env node
// Shows what the tests guard, by breaking code and seeing which tests fail. Each run works in a copy of this checkout in a temporary
// folder, builds it and runs the engine's plugin test there, so this checkout is never changed. Nothing here runs with the tests.
//
//   node src/claudopus/guard.mjs break <file> <text> <replacement> [<file> <text> <replacement> ...]
//       Puts a fault back: each <text> in <file> (relative to the repo) becomes <replacement>, once; prints the tests that fail.
//       A test is worth keeping when some break of the line it guards fails it and no other kept test.
//   node src/claudopus/guard.mjs new [<base>]
//       The tests this branch adds or changes, run against <base>'s code (origin/main when left out): any that still pass guard
//       nothing the branch changed, and are listed. A new test must fail here for the reason it was written.
//
// Each takes about a minute (one build and one run of every test). ENGINE names the engine (the `claude` on the PATH when unset).
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = join(dirname(fileURLToPath(import.meta.url)), '../..')
const engine = process.env.ENGINE || 'claude'
const [verb, ...args] = process.argv.slice(2)

// A copy of the checkout's files as they are now, without git's own folder
const copy = () => {
  const to = join(mkdtempSync(join(tmpdir(), 'claudopus-guard-')), 'repo')
  cpSync(repo, to, { recursive: true, filter: path => !/\/(\.git|node_modules)(\/|$)/.test(path.slice(repo.length)) })
  return to
}
// The tests of a run by name, passed or failed
const run = dir => {
  const built = spawnSync('node', ['src/claudopus/build.mjs'], { cwd: dir, encoding: 'utf8' })
  if (built.status !== 0) throw new Error(`the build failed:\n${built.stdout}${built.stderr}`.trimEnd())
  const out = spawnSync(engine, ['plugin', 'test', 'mods/claudopus'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 28 })
  const text = `${out.stdout}\n${out.stderr}`
  const of = mark => [...text.matchAll(new RegExp(`^\\(${mark}\\) (.*?)(?: \\[[\\d.]+m?s\\])?$`, 'gm'))].map(m => m[1])
  return { passed: of('pass'), failed: of('fail').filter(name => name !== 'the file ran to its end') }
}
// The names a set of test parts declares, by test('name' ...)
const namesIn = text => [...text.matchAll(/^test\(\s*(['"`])((?:\\.|(?!\1).)*)\1/gm)].map(m => m[2].replace(/\\(['"`\\])/g, '$1'))
const testFiles = dir =>
  [join(dir, 'src/claudopus/tests'), join(dir, 'mods/claudopus/hooks')].flatMap(folder =>
    readdirSync(folder).filter(name => name.endsWith('.test.tsx')).map(name => join(folder, name)),
  )

if (verb === 'break') {
  if (!args.length || args.length % 3) throw new Error('break takes <file> <text> <replacement>, one or more times')
  const dir = copy()
  try {
    for (let i = 0; i < args.length; i += 3) {
      const path = join(dir, args[i])
      const text = readFileSync(path, 'utf8')
      if (!text.includes(args[i + 1])) throw new Error(`${args[i]} has no ${JSON.stringify(args[i + 1].slice(0, 80))}`)
      writeFileSync(path, text.replace(args[i + 1], () => args[i + 2]))
    }
    const { passed, failed } = run(dir)
    console.log(`${failed.length} of ${passed.length + failed.length} tests fail with the break${failed.length ? ':' : ''}`)
    for (const name of failed) console.log(`  ${name}`)
    process.exitCode = failed.length ? 0 : 1
  } finally {
    rmSync(dirname(dir), { recursive: true, force: true })
  }
} else if (verb === 'new') {
  const base = args[0] || 'origin/main'
  const before = new Set(
    execFileSync('git', ['-C', repo, 'ls-tree', '-r', '--name-only', base], { encoding: 'utf8' })
      .split('\n')
      .filter(path => /^(src\/claudopus\/tests|mods\/claudopus\/hooks)\/[^/]+\.test\.tsx$/.test(path))
      .flatMap(path => namesIn(execFileSync('git', ['-C', repo, 'show', `${base}:${path}`], { encoding: 'utf8' }))),
  )
  const dir = copy()
  try {
    const added = testFiles(dir).flatMap(path => namesIn(readFileSync(path, 'utf8'))).filter(name => !before.has(name))
    if (!added.length) {
      console.log(`No test is new since ${base}.`)
    } else {
      // The branch's tests and test set-up over the base's code: everything else in the copy goes back to the base
      const changed = execFileSync('git', ['-C', repo, 'diff', '--name-only', base, '--'], { encoding: 'utf8' }).split('\n').filter(Boolean)
      for (const path of changed) {
        if (/^src\/claudopus\/tests\/|\.test\.tsx$/.test(path)) continue
        const shown = spawnSync('git', ['-C', repo, 'show', `${base}:${path}`], { maxBuffer: 1 << 28 })
        if (shown.status === 0) writeFileSync(join(dir, path), shown.stdout)
        else if (existsSync(join(dir, path))) rmSync(join(dir, path))
      }
      // The base's build joins the tests as it did then: given the branch's test parts it did not list, and none of what this
      // checkout's build joined before
      const build = join(dir, 'src/claudopus/build.mjs')
      const listed = /const TEST_PARTS = \[([^\]]*)\]/.exec(readFileSync(build, 'utf8'))
      if (listed) {
        const parts = readdirSync(join(dir, 'src/claudopus/tests')).filter(name => name.endsWith('.test.tsx') && !listed[1].includes(`'${name}'`))
        writeFileSync(build, readFileSync(build, 'utf8').replace(listed[0], `const TEST_PARTS = [${listed[1].trimEnd().replace(/,?$/, ',')} ${parts.map(name => `'${name}'`).join(', ')}]`))
      }
      rmSync(join(dir, 'mods/claudopus/hooks/tests'), { recursive: true, force: true })
      rmSync(join(dir, 'mods/claudopus/hooks/register.test.tsx'), { force: true })
      const { passed } = run(dir)
      const useless = added.filter(name => passed.includes(name))
      console.log(`${added.length} new tests; ${useless.length} pass without this branch's code${useless.length ? ', so guard nothing it changed:' : '.'}`)
      for (const name of useless) console.log(`  ${name}`)
      process.exitCode = useless.length ? 1 : 0
    }
  } finally {
    rmSync(dirname(dir), { recursive: true, force: true })
  }
} else {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 13).map(line => line.replace(/^\/\/ ?/, '')).join('\n'))
}
