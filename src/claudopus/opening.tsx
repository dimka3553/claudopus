// Files handed to the person, made to open on their click

// A click on a file card or on a file's path in the chat opens the app's file pane, which opens only files inside the chat's own
// folder, or in folders added to the chat, which would let Claude touch them too, so the mod adds none. A file a task wrote
// anywhere else said "This file is outside this session's folders". Each such file reaches the person as a copy in OPENABLE in the
// chat's folder, kept under its path from the home folder. Git leaves the copies out, and on the Mac a copy shares the file's room
// until either changes
const OPENABLE = '.claudopus-files'
// The most files of one report made to open
const OPENABLE_MOST = 20
// Where a file a task made for the person can be: never on another disk, where a copy would take the file's room again. On Windows,
// the drive the chat's folder is on
const isMadeHere = (path: string, home: string) =>
  /^\/(?:Users|private|tmp|var)\//.test(path) || (isAbsPath(home) && isWithin(path, home)) || (isWindows && /^[A-Za-z]:\//.test(path) && path.slice(0, 2).toLowerCase() === cwd.slice(0, 2).toLowerCase())
// The folder the copies go in, in the chat's own folder
const openablesDir = () => (isAbsPath(cwd) && cwd !== '/' ? `${cwd.replace(/\/+$/, '')}/${OPENABLE}` : '')
// (Windows names a file the same in capitals or not)
const isWithin = (path: string, folder: string) => {
  const [one, top] = isWindows ? [path.toLowerCase(), folder.toLowerCase()] : [path, folder]
  return one === top || one.startsWith(`${top}/`)
}
const homeOf = async ($: EngineInterface) => (await homeFolder($).catch(() => undefined)) ?? ''
// Where the copy of a file goes: under its path from the home folder, else from the top (on Windows from its drive's letter)
const openableOf = (path: string, home: string) => `${openablesDir()}/${isAbsPath(home) && isWithin(path, home) && path !== home ? path.slice(home.length + 1) : path.replace(/^([A-Za-z]):\//, '$1/').replace(/^\/+/, '')}`
// The file a copy was made from: under the home folder, else from the top; '' when it is gone
const originalOf = async ($: EngineInterface, copy: string, home: string) => {
  const rel = copy.slice(openablesDir().length + 1)
  const fromTop = isWindows && /^[A-Za-z]\//.test(rel) ? `${rel[0]}:/${rel.slice(2)}` : `/${rel}`
  for (const one of [isAbsPath(home) ? `${home}/${rel}` : '', fromTop].filter(Boolean)) if ((await $.fs.stat(one).catch(() => undefined))?.kind === 'file') return one
  return ''
}
// Copies a file to `to` anew, as it is now, where git leaves it out
const copyOpenable = async ($: EngineInterface, from: string, to: string) => {
  const ignore = `${openablesDir()}/.gitignore`
  await runOn($, ['mkdir', '-p', to.slice(0, to.lastIndexOf('/'))])
  if (!(await $.fs.exists(ignore).catch(() => false))) await $.fs.write(ignore, '*\n').catch(() => undefined)
  await runOn($, ['rm', '-f', to]).catch(() => undefined)
  return (await runOn($, ['cp', '-cp', from, to]).catch(() => ({ exitCode: 1 }))).exitCode === 0 || (await runOn($, ['cp', '-p', from, to]).catch(() => ({ exitCode: 1 }))).exitCode === 0
}
// The copy the person can open of a file outside the chat's folder; '' for one inside it, one that is no file here, or no copy
const openable = async ($: EngineInterface, path: string, home: string) => {
  if (!openablesDir() || !isAbsPath(path) || isWithin(path, cwd) || !isMadeHere(path, home)) return ''
  if ((await $.fs.stat(path).catch(() => undefined))?.kind !== 'file') return ''
  const to = openableOf(path, home)
  return (await copyOpenable($, path, to)) ? to : ''
}

// The files a SendUserFile call sends from outside the chat's folder are copied in, and the call is refused with the copies to
// send instead: a call is never changed on its way, as auto mode refuses one a hook changed. A copy it sends is made again from
// its file as that is now. Answers what the call is refused with, '' to let it run
const sentOpenable = async ($: EngineInterface, e: { files?: unknown }) => {
  const into = openablesDir()
  const sent = Array.isArray(e.files) ? e.files.filter((one): one is string => typeof one === 'string') : []
  if (!into || !sent.length) return ''
  const home = await homeOf($)
  const made: [string, string][] = []
  for (const given of sent) {
    const path = slashed(given)
    if (isWithin(path, into)) {
      const from = await originalOf($, path, home)
      if (from) await copyOpenable($, from, path)
      continue
    }
    const to = await openable($, path, home)
    if (to) made.push([given, to])
  }
  if (made.length) await log($, `copied ${made.length} sent file${made.length === 1 ? '' : 's'} into the chat's folder to open`)
  return made.length ? named(SENT_OPENABLE(made)) : ''
}

// A report's text, with each file it names outside the chat's folder given as the copy the person can open: a path as the text
// has it, and a whole line that is one path, spaces and all, as a report gives a file. A path written with backslashes (Windows) is
// given its copy with backslashes too
const withOpenables = async ($: EngineInterface, text: string) => {
  const copies = await openablesOf($, text)
  if (!copies.size) return text
  const quoted = [...copies.keys()].map(path => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return text.replace(new RegExp(`(${quoted.join('|')})(?![\\w/${isWindows ? '\\\\' : ''}-]|\\.\\w)`, 'g'), path => copies.get(path) ?? path)
}
// Each file a text names outside the chat's folder, as the text has it, with the copy made of it
const openablesOf = async ($: EngineInterface, text: string) => {
  const copies = new Map<string, string>()
  if (!openablesDir() || !(text.includes('/') || (isWindows && text.includes('\\')))) return copies
  const home = await homeOf($)
  const lines = text.split('\n').map(line => line.trim().replace(/^(?:[-*]\s+)?`?/, '').replace(/`$/, '').replace(/[.:]$/, ''))
  const named = [...new Map([...lines.filter(line => isAbsPath(line) && !line.includes('`')).map(line => ({ written: line, path: keptPath(line) })), ...pathsWritten(text)].map(one => [one.written, one.path])).entries()].filter(([, path]) => isMadeHere(path, home))
  for (const [written, path] of named.sort((a, b) => b[0].length - a[0].length)) {
    if (copies.size >= OPENABLE_MOST) break
    const to = await openable($, path, home)
    if (to) copies.set(written, isWindows && written.includes('\\') ? to.replace(/\//g, '\\') : to)
  }
  return copies
}
