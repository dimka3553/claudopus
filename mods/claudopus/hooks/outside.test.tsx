import { expect, test } from 'claude-code/testing'

import { addedFolders, isOutsideAll, refusedAim } from './outside'

const HOME = '/home/sam'
const CHAT = '/home/sam/repo'

test('a refused call is aimed at its file, or at the folder a leading cd or a git -C moves its command to; a command that stays in the chat, or names its folder with a variable, is aimed at nothing', () => {
  const cases: [string, Record<string, unknown>, string][] = [
    ['Edit', { file_path: '/work/site/src/app.ts' }, '/work/site/src/app.ts'],
    ['Write', { file_path: 'notes/../todo.md' }, '/home/sam/repo/todo.md'],
    ['NotebookEdit', { notebook_path: '~/lab/a.ipynb' }, '/home/sam/lab/a.ipynb'],
    ['Bash', { command: 'cd ~/work/site && git push' }, '/home/sam/work/site'],
    ['Bash', { command: 'cd "/work/my site"; npm test' }, '/work/my site'],
    ['Bash', { command: 'cd ../other' }, '/home/sam/other'],
    ['Bash', { command: 'git -C /work/site/ commit -m "Fix"' }, '/work/site'],
    ['Bash', { command: 'git push' }, ''],
    ['Bash', { command: 'cd $WORK && git push' }, ''],
    ['Grep', { path: '/work/site' }, ''],
  ]
  expect(cases.map(([tool, call]) => refusedAim(tool, call, CHAT, HOME))).toEqual(cases.map(([, , aim]) => aim))
  expect(refusedAim('Edit', { file_path: '/work/site/a.ts' }, '', HOME)).toBe('')
})

test("a path is outside when it is under none of the chat's folders, those its settings add among them; the temporary folders and the scratchpad are inside, and with no chat folder nothing is outside", () => {
  const added = addedFolders(JSON.stringify({ permissions: { additionalDirectories: ['~/shared', '../sibling', 7] } }), CHAT, HOME)
  expect(added).toEqual(['/home/sam/shared', '/home/sam/sibling'])
  expect(addedFolders('not json', CHAT, HOME)).toEqual([])
  const folders = [CHAT, ...added, `${HOME}/.claude/claudopus`]
  const cases: [string, boolean][] = [
    ['/work/site', true],
    ['/home/sam/repo-two/a.ts', true],
    ['/home/sam/repo/src/a.ts', false],
    ['/home/sam/repo', false],
    ['/home/sam/shared/lib', false],
    ['/home/sam/.claude/claudopus/notes.md', false],
    ['/private/tmp/build', false],
    ['/var/folders/x/T/a', false],
    ['/home/sam/.cache/claude-501/-home-sam/0a1b/scratchpad/x.txt', false],
  ]
  expect(cases.map(([path]) => isOutsideAll(path, folders))).toEqual(cases.map(([, outside]) => outside))
  expect(isOutsideAll('C:/Work/Site', ['c:/work'], true)).toBe(false)
  expect(isOutsideAll('/work/site', ['', ...added])).toBe(false)
})
