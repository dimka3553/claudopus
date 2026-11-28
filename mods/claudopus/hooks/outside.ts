// A call Claude Code blocked in a folder outside the chat's: which folder it was aimed at, whether that is outside, and what the
// card says of it. Plain code, nothing here touches the engine: src/claudopus/prompts.tsx reads the settings and the folders and
// puts the block on the card. A chat opened in one project whose task works in another (27 Nov: a person's pushes and edits in a
// second project failed one after another, and nothing said why): Claude Code lets a task act only in the chat's folders and
// blocks what it does outside them, where a background task has nobody to ask. /add-dir changes the session's permissions, which
// a running task reads afresh at each call (Claude Code 2.1.330), so typed in the chat it lets every task of the chat work there

import { slashed } from './windows'

/** The tools that change a file, whose block outside the chat's folders asks the person. */
export const CHANGE_TOOLS = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit']
/** The start of the rule an ask about a folder keeps, which its answer is told by (asking.tsx, as a connector's). */
export const FOLDER_RULE = 'folder:'

/** A path whole: ~ as `home`, a relative one from `from`, with no `.`, `..` or slash at its end. */
export const pathWhole = (path: string, from: string, home: string) => {
  const p = slashed(path.trim())
  const isAbs = p.startsWith('/') || /^[A-Za-z]:\//.test(p)
  const whole = p === '~' ? home : p.startsWith('~/') ? `${home}${p.slice(1)}` : isAbs ? p : `${from}/${p}`
  const [head = '', ...rest] = whole.split('/')
  const kept: string[] = []
  for (const part of rest) if (part === '..') kept.pop()
  else if (part && part !== '.') kept.push(part)
  return `${head}/${kept.join('/')}`
}

const WORD = `('[^']+'|"[^"$\`\\\\]+"|[^\\s;&|'"$\`\\\\()<>]+)`
const MOVED = new RegExp(`^\\s*(?:cd|pushd)\\s+${WORD}\\s*(?:&&|;|\\n|$)`)
const GIT_IN = new RegExp(`(?:^|[\\s;&|(])git\\s+-C\\s+${WORD}`)
/** What a refused call was aimed at: a file tool's file, else a command's folder where a leading `cd <path>` or a `git -C <path>`
 * moves it from the chat's (a path with a variable in it is not followed); '' for none. */
export const refusedAim = (tool: string, call: Record<string, unknown>, cwd: string, home: string) => {
  if (!cwd) return ''
  const file = typeof call.file_path === 'string' ? call.file_path : typeof call.notebook_path === 'string' ? call.notebook_path : ''
  if (CHANGE_TOOLS.includes(tool) || tool === 'Read') return file.trim() ? pathWhole(file, cwd, home) : ''
  if (tool !== 'Bash') return ''
  const command = typeof call.command === 'string' ? call.command : ''
  const moved = MOVED.exec(command)?.[1] ?? GIT_IN.exec(command)?.[1]
  return moved ? pathWhole(moved.replace(/^(['"])(.*)\1$/, '$2'), cwd, home) : ''
}

/** The folders a settings file adds, `permissions.additionalDirectories`, each whole. */
export const addedFolders = (text: string, cwd: string, home: string): string[] => {
  try {
    const dirs = (JSON.parse(text) as { permissions?: { additionalDirectories?: unknown } } | null)?.permissions?.additionalDirectories
    return Array.isArray(dirs) ? dirs.filter((one): one is string => typeof one === 'string' && Boolean(one.trim())).map(one => pathWhole(one, cwd, home)) : []
  } catch {
    return []
  }
}

/** Whether `path` is `folder` or inside it. */
export const isInFolder = (path: string, folder: string, isWindows = false) => {
  const [p, f] = isWindows ? [path.toLowerCase(), folder.toLowerCase()] : [path, folder]
  return Boolean(f) && (p === f || p.startsWith(f.endsWith('/') ? f : `${f}/`))
}
const TEMP_FOLDER = /^\/(?:private\/)?(?:tmp|var\/folders)(?:\/|$)|^[A-Za-z]:\/(?:tmp|Users\/[^/]+\/AppData\/Local\/Temp)(?:\/|$)/i
const SCRATCHPAD = /\/claude-\d+\/[^/]+\/[^/]+\/scratchpad(?:\/|$)/
/** Whether `path` is outside every one of `folders` (the chat's first, then those it adds, then the memory folder). The system's
 * temporary folders and the scratchpad count as inside; with no folder known, nothing is outside. */
export const isOutsideAll = (path: string, folders: string[], isWindows = false) =>
  Boolean(path && folders[0]) && !TEMP_FOLDER.test(path) && !SCRATCHPAD.test(path) && !folders.some(folder => isInFolder(path, folder, isWindows))

/** What a blocked command's block adds: why it was blocked, and how to let tasks work there. `chat` and `shown` are the two
 * folders as the person reads them, `folder` the one to add as it is typed. */
export const OUTSIDE_COMMAND = (chat: string, shown: string, folder: string) =>
  `This chat was opened in ${chat}, and ${shown} is outside it, so Claude Code blocks what the task does there, one command at a time. To let tasks work there, type /add-dir ${folder} in the chat, or open a chat in ${shown} or in a folder that holds both.`
/** The question for a file change blocked there. */
export const FOLDER_ASK = (shown: string) => `Claude Code blocked changes in ${shown}. Let this chat work there?`
/** What it is about. */
export const FOLDER_DETAILS = (chat: string, shown: string, file: string, tryAgain: string) => [
  `This chat was opened in ${chat}, and ${shown} is outside it, so Claude Code blocks the task's changes there.`,
  `It wanted to change ${file || 'a file'}.`,
  `Type the line below in the chat to let every task of this chat work there, then press ${tryAgain}.`,
]
/** What the task is told of the person's answer to it. `who` is the person as the task names them. */
export const FOLDER_ANSWERED = (folder: string, said: string, isReply: boolean, who: string, tryAgain: string, dontAllow: string) =>
  isReply
    ? `${who} replied, in their own words, when asked to let this chat work in ${folder}, where Claude Code blocked your change: ${said}\nTheir words let nothing through: only \`/add-dir ${folder}\` typed in the chat does. If they say they have typed it, make the same change once more exactly as before; otherwise answer them with the \`ask\` tool, or carry on without it.`
    : said === tryAgain
      ? `${who} pressed "${tryAgain}" after being shown the line that lets this chat's tasks work in ${folder}. Make the same change once more now, exactly as before. If Claude Code blocks it again, the folder isn't added yet and your card asks again: do not ask in words, and do not make the change another way.`
      : `${who} pressed "${dontAllow}" when asked to let this chat work in ${folder}, where Claude Code blocked your change. Do not change files there, nor reach the same end by other means. Carry on without it, and say in your report what was left out.`
