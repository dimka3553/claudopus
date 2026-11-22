// The index: one line per subject, and the subject's page and history

// ---- The index: one line per subject, "- name | repo | session | state | summary" ----

const INDEX_HEAD = '# Topics\n\nname | repo | session | state | summary\n\n'

const parseIndex = (text: string): Stream[] =>
  text
    .split('\n')
    .filter(line => line.startsWith('- '))
    .map(line => {
      const [name = '', repo = '', session = '', state = '', ...rest] = line.slice(2).split(' | ')
      return { name: name.trim(), repo: repo.trim(), session: session.trim(), state: state.trim(), summary: rest.join(' | ').trim() }
    })

const indexLines = (list: Stream[]) => list.map(s => `- ${[s.name, s.repo, s.session, s.state, s.summary].join(' | ')}`).join('\n')

const readIndex = async ($: EngineInterface) => parseIndex(await readOr($, `${dir}/index.md`))

// Creates the subject or changes the fields given
const saveStream = async ($: EngineInterface, name: string, patch: Partial<Stream>) => {
  const list = await readIndex($)
  const old = list.find(s => slug(s.name) === slug(name))
  const given = Object.fromEntries(Object.entries(patch).filter(([, value]) => typeof value === 'string').map(([key, value]) => [key, oneLine(String(value))]))
  const next: Stream = { name: oneLine(name), repo: '', session: '', state: '', summary: '', ...old, ...given }
  await $.fs.write(`${dir}/index.md`, `${INDEX_HEAD}${indexLines(old ? list.map(s => (s === old ? next : s)) : [...list, next])}\n`)
  return next
}

// ---- A topic's notes: a short page a task reads first, streams/<slug>.md, written whole; and its history, streams/<slug>.log.md,
// only added to, never read whole or written back. A page grown past PAGE_CHARS (written by hand, or one from before the history)
// is set aside whole into the history and a short page made from it takes its place ----

// The most a topic's page holds: a fresh task reads it whole before it starts
const PAGE_CHARS = 8_000
// The most of a grown page the model reads to make its short page: the newest part, as pages are added to at their end
const PAGE_READ = 400_000
const pageOf = (name: string) => `${dir}/streams/${slug(name)}.md`
const historyOf = (name: string) => `${dir}/streams/${slug(name)}.log.md`
// A topic in a temporary folder or inside the memory folder (where test runs and notes live) is a test's, not the person's work:
// it is kept out of the index every chat is given
const isScratchTopic = (repo: string) => /^\/(?:private\/)?(?:tmp|var\/folders)\//.test(repo) || (Boolean(dir) && repo.startsWith(`${dir}/`))
// A history entry: dated, headed by who added it
const historyEntry = (at: number, by: string, text: string) => `## ${new Date(at).toISOString().slice(0, 16).replace('T', ' ')} ${oneLine(by) || 'A task'}\n\n${hideKeys(text.trim())}\n\n`
const PAGE_SYSTEM = `You keep the notes page of one topic of a person's work, which a fresh AI agent reads before it starts work on that topic. The page has grown too long; the whole of it is kept in the topic's history file, which agents search when they need the past. Write the new short page from it: plain markdown, at most 6000 characters, in this order:
1. "# <topic name>" and one line on what the topic is for.
2. Where things are: repos, branches that matter now, key folders and files, by full path or name.
3. Now: the current state of each line of work, newest facts winning over older ones.
4. Decided: standing decisions and the person's preferences an agent must not undo, with short quotes of their own words where they set a rule.
5. Open: what is waiting, on whom, and the next step for each.
6. Last line: "History: everything before <date> is in <history file>; search it with recall or grep."
Keep only what a fresh agent needs to start correctly. Never invent anything; where the page contradicts itself, the newest entry wins. Reply with the page and nothing else.`
// Pages being made short by this chat, so one is not asked for twice at once
const shortening = new Set<string>()
// Makes a grown page short. The whole page goes into the history first, once (its mark in the heading tells a second chat that set
// it aside too), then the short page takes its place, only if the page is still what was read. With no answer from the model the
// page stays as it is, for the next look
const shortenPage = async ($: EngineInterface, name: string) => {
  const path = pageOf(name)
  const text = await readOr($, path)
  if (text.length <= PAGE_CHARS || shortening.has(path)) return false
  shortening.add(path)
  try {
    const at = await $.clock.now()
    const day = new Date(at).toISOString().slice(0, 10)
    const r = await $.model.complete({
      model: 'sonnet',
      system: PAGE_SYSTEM,
      prompt: `Topic: ${name}\nToday: ${day}\nHistory file: streams/${slug(name)}.log.md\n\nThe page${text.length > PAGE_READ ? ' (its newest part)' : ''}:\n"""\n${text.slice(-PAGE_READ)}\n"""`,
      maxTokens: 4000,
      timeoutMs: 180_000,
    })
    const short = r.isAnswered ? r.text.trim().replace(/^```(?:markdown|md)?\n([\s\S]*)\n```$/, '$1').trim() : ''
    if (!short || short.length > PAGE_CHARS) {
      await log($, `page of ${name} not made short: ${r.isAnswered ? `${short.length} characters back` : 'no answer'}`)
      return false
    }
    if ((await readOr($, path)) !== text) return false
    const marked = mark(text)
    if (!(await readOr($, historyOf(name))).includes(`(${marked})`)) {
      await appendTo($, historyOf(name), historyEntry(at, `The page as it was, set aside whole when it passed ${PAGE_CHARS} characters (${marked})`, text))
    }
    await $.fs.write(path, `${short}\n`)
    await log($, `page of ${name} made short: ${text.length} to ${short.length} characters, the whole page kept in its history`)
    return true
  } finally {
    shortening.delete(path)
  }
}
// Every topic's page that has grown, looked at as a chat starts, one at a time and one chat at a time (a folder only one can make,
// taken over once its maker has been gone for ten minutes)
const SHORTEN_STALE = 10 * 60_000
const shortenPages = async ($: EngineInterface) => {
  const grown: Stream[] = []
  for (const one of await readIndex($)) if (((await $.fs.stat(pageOf(one.name)).catch(() => undefined))?.size ?? 0) > PAGE_CHARS) grown.push(one)
  if (!grown.length) return
  const lock = `${dir}/locks/pages`
  const now = await $.clock.now()
  const take = () => $.process.run(['/bin/sh', '-c', 'mkdir -p "$(dirname "$1")" && mkdir "$1" 2>/dev/null && printf %s "$2" > "$1/at"', 'sh', lock, String(now)]).then(r => r.exitCode === 0, () => false)
  if (!(await take())) {
    if (now - Number((await readOr($, `${lock}/at`)) || now) < SHORTEN_STALE) return
    await $.process.run(['rm', '-rf', lock]).catch(() => undefined)
    if (!(await take())) return
  }
  try {
    for (const one of grown) await shortenPage($, one.name).catch(err => log($, `page of ${one.name} not made short: ${String(err)}`))
  } finally {
    await $.process.run(['rm', '-rf', lock]).catch(() => undefined)
  }
}

// This session's title as the app knows it; nothing outside the desktop app, or before the app's tools connect
const appTitle = async ($: EngineInterface) => {
  try {
    return (JSON.parse(textOf(await $.mcp.call('ccd_session_mgmt', 'get_session', { session_id: 'self' }))) as { title?: string }).title
  } catch {
    return undefined
  }
}

// Tells one version of the role text from another
const mark = (text: string) => `${text.length}:${[...text].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 1_000_003, 7)}`
