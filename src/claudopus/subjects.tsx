// The index: one line per subject, and the subject's brief

// ---- The index: one line per subject, "- name | repo | session | state | summary" ----

const INDEX_HEAD = '# Streams\n\nname | repo | session | state | summary\n\n'

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
