#!/usr/bin/env node
// Shows what the tests guard, by breaking code and seeing which tests fail. Each run works in a copy of this checkout in a temporary
// folder, builds it and runs the engine's plugin test there, so this checkout is never changed. Nothing here runs with the tests.
//
//   node src/claudopus/guard.mjs break <file> <text> <replacement> [<file> <text> <replacement> ...]
//       Puts a fault back: each <text> in <file> (relative to the repo) becomes <replacement>, once; prints the tests that fail.
//       A test is worth keeping when some break of the line it guards fails it and no other kept test.
//       One break proves little: a test is dropped only when every distinct input it holds (its own case, its own assertion) fails
//       a kept test under a break of its own, so a kept test that covers the path with other inputs is not enough.
//   node src/claudopus/guard.mjs new [<base>]
//       Every test this branch adds or extends (a name new since <base>, or a body changed; a test only renamed is left out), run
//       against <base>'s code, <base> being where the branch left main when left out: any that still pass guard nothing the
//       branch changed, and are listed. A new or extended test must fail here for the reason it was written.
//       Only the files that hold those tests run.
//
//   node src/claudopus/guard.mjs area <area> [<area> ...]
//       Runs only those areas' tests (cards, asking, stats: the name of a test file, with or without .test.tsx) on the code as it
//       is now: what to run while working; test-all.sh runs every test once before the release.
//
// break takes one build and one run of every test: about a minute on a quiet Mac, a few on a busy one; area and new run only
// their files, as long as the slowest of them. ENGINE names the engine (the `claude` on the PATH when unset).
import { execFileSync, spawn, spawnSync } from 'node:child_process'
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
  // A git folder of its own, as the build hashes the mod's files with git for the version page
  execFileSync('git', ['init', '-q'], { cwd: to })
  return to
}
// The test file's area: hooks/tests/cards.test.tsx and src/claudopus/tests/cards.test.tsx are both cards
const areaOf = path => path.split('/').pop().replace(/\.test\.tsx$/, '')
// The engine's plugin test, saying how many tests have ended at least every 10 seconds, as it runs; what it printed comes back
const engineTests = (dir, areas) =>
  new Promise((resolve, reject) => {
    const child = spawn(engine, ['plugin', 'test', 'mods/claudopus'], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] })
    let text = ''
    const told = () => console.log(`progress: ${(text.match(/^\((pass|fail)\) /gm) ?? []).length} tests ended, of ${areas ? areas.join(', ') : 'every area'}`)
    const every = setInterval(told, 10_000)
    child.stdout.on('data', chunk => (text += chunk))
    child.stderr.on('data', chunk => (text += chunk))
    child.on('error', error => (clearInterval(every), reject(error)))
    child.on('close', () => (clearInterval(every), told(), resolve(text)))
  })
// Builds the copy and runs its tests, giving back the tests by name, passed or failed: with `areas`, only the joined test files of
// those areas
const run = async (dir, areas) => {
  const built = spawnSync('node', ['src/claudopus/build.mjs'], { cwd: dir, encoding: 'utf8' })
  if (built.status !== 0) throw new Error(`the build failed:\n${built.stdout}${built.stderr}`.trimEnd())
  if (areas) {
    const joined = [join(dir, 'mods/claudopus/hooks'), join(dir, 'mods/claudopus/hooks/tests')].flatMap(folder =>
      existsSync(folder) ? readdirSync(folder).filter(name => name.endsWith('.test.tsx')).map(name => join(folder, name)) : [],
    )
    const unknown = areas.filter(area => !joined.some(path => areaOf(path) === area))
    if (unknown.length) throw new Error(`no test file for ${unknown.join(', ')}`)
    for (const path of joined) if (!areas.includes(areaOf(path))) rmSync(path)
  }
  const text = await engineTests(dir, areas)
  const of = mark => [...text.matchAll(new RegExp(`^\\(${mark}\\) (.*?)(?: \\[[\\d.]+m?s\\])?$`, 'gm'))].map(m => m[1])
  const ran = Number(/^Ran (\d+) tests/m.exec(text)?.[1] ?? 0)
  // A file that broke as it loaded runs fewer tests than it declares, and an error outside a test fails "the file ran to its end"
  const declared = testFiles(dir).filter(path => !areas || areas.includes(areaOf(path))).reduce((n, path) => n + testsIn(readFileSync(path, 'utf8')).length, 0)
  const isWhole = ran >= declared && !of('fail').includes('the file ran to its end')
  if (!isWhole) console.log(`Warning: ${ran} tests ran of ${declared} declared, or a file failed outside its tests: some tests did not run at all.`)
  return { passed: of('pass'), failed: of('fail').filter(name => name !== 'the file ran to its end') }
}
// The tests a file declares, by test('name' ...), each with its body: from its function's arrow to where the next test starts (or
// the file ends), so a one-line test is one, and a time limit given or taken away is no change to what it guards
const testsIn = text => {
  const starts = [...text.matchAll(/^test\(\s*(['"`])((?:\\.|(?!\1).)*)\1/gm)]
  return starts.map((m, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : text.length
    const whole = text.slice(m.index, end)
    const arrow = whole.indexOf('=>', m[0].length)
    return { name: m[2].replace(/\\(['"`\\])/g, '$1'), body: whole.slice(arrow < 0 ? m[0].length : arrow).trimEnd() }
  })
}
const testFiles = dir =>
  [join(dir, 'src/claudopus/tests'), join(dir, 'mods/claudopus/hooks')].flatMap(folder =>
    readdirSync(folder).filter(name => name.endsWith('.test.tsx') && name !== 'register.test.tsx').map(name => join(folder, name)),
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
    const { passed, failed } = await run(dir)
    console.log(`${failed.length} of ${passed.length + failed.length} tests fail with the break${failed.length ? ':' : ''}`)
    for (const name of failed) console.log(`  ${name}`)
    process.exitCode = failed.length ? 0 : 1
  } finally {
    rmSync(dirname(dir), { recursive: true, force: true })
  }
} else if (verb === 'new') {
  const base = args[0] || execFileSync('git', ['-C', repo, 'merge-base', 'HEAD', 'origin/main'], { encoding: 'utf8' }).trim()
  const was = execFileSync('git', ['-C', repo, 'ls-tree', '-r', '--name-only', base], { encoding: 'utf8' })
    .split('\n')
    .filter(path => /^(src\/claudopus\/tests|mods\/claudopus\/hooks)\/[^/]+\.test\.tsx$/.test(path))
    .flatMap(path => testsIn(execFileSync('git', ['-C', repo, 'show', `${base}:${path}`], { encoding: 'utf8' })))
  const bodies = new Map(was.map(one => [one.name, one.body]))
  const sameBody = new Set(was.map(one => one.body))
  const dir = copy()
  try {
    // New or extended: a body the base never had, under any name
    const fresh = testFiles(dir).flatMap(path => testsIn(readFileSync(path, 'utf8')).map(one => ({ ...one, area: areaOf(path) }))).filter(one => bodies.get(one.name) !== one.body && !sameBody.has(one.body))
    const added = fresh.map(one => one.name)
    if (!added.length) {
      console.log(`No test is new or changed since ${base.slice(0, 12)}.`)
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
      const { passed } = await run(dir, [...new Set(fresh.map(one => one.area))])
      const useless = added.filter(name => passed.includes(name))
      console.log(`${added.length} new or changed tests; ${useless.length} pass without this branch's code${useless.length ? ', so guard nothing it changed:' : '.'}`)
      for (const name of useless) console.log(`  ${name}`)
      process.exitCode = useless.length ? 1 : 0
    }
  } finally {
    rmSync(dirname(dir), { recursive: true, force: true })
  }
} else if (verb === 'area') {
  if (!args.length) throw new Error('area takes one or more areas, such as cards')
  const areas = args.map(areaOf)
  const dir = copy()
  try {
    const { passed, failed } = await run(dir, areas)
    console.log(`${passed.length} passed, ${failed.length} failed in ${areas.join(', ')}${failed.length ? ':' : ''}`)
    for (const name of failed) console.log(`  ${name}`)
    process.exitCode = failed.length ? 1 : 0
  } finally {
    rmSync(dirname(dir), { recursive: true, force: true })
  }
} else {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 21).map(line => line.replace(/^\/\/ ?/, '')).join('\n'))
}
