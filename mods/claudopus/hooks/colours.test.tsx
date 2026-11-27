// Task colours: which chat reply is about which task, and the links each reply gives
import { describe, expect, test } from 'claude-code/testing'
import type { SessionMessage } from 'claude-code'

import { Builder, NO_ANSWER, linksIn } from './colours'

const PUPIL = 'a3333333333333333'
const GAPS = 'a4444444444444444'
const HAIR = 'a1111111111111111'
const VEINS = 'a2222222222222222'

const notify = (id: string, title: string, how = 'finished'): SessionMessage => ({
  role: 'user',
  text: `<task-notification>\n<task-id>${id}</task-id>\n<status>completed</status>\n<summary>Agent "${title}" ${how}</summary>\n</task-notification>`,
  toolUses: [],
})
const person = (text: string): SessionMessage => ({ role: 'user', text, toolUses: [] })
const says = (uuid: string, text: string, toolUses: SessionMessage['toolUses'] = []): SessionMessage => ({
  role: 'assistant',
  text,
  toolUses,
  uuid,
})
const NOTION = 'https://www.notion.so/Example-page-0123456789abcdef0123456789abcdef'
const SHEET = 'https://example.com/experiments/ex_1/label-form?cohort=a'
const PUPIL_REPLY = `The pupil page now works like the iris page.\n\nWhere: the "Pupil size" sheet: ${SHEET}`
const GAPS_REPLY = `The gaps page has its new When column:\n${NOTION}.`

const send = (to: string) => ({ tool_use_id: `send-${to}`, tool: 'SendMessage', input: { to, message: 'words' } })

// A stretch of a real chat: notifications, the person's words passed on, a new
// task, a follow-up question with no tool call, and a reply about two tasks.
const CHAT: SessionMessage[] = [
  notify(PUPIL, 'Pupil size: labelling and detection'),
  says('r1', PUPIL_REPLY),
  notify(VEINS, 'Under-eye vascularity: Gemini baseline', 'is waiting on its own background work'),
  notify(PUPIL, 'Pupil size: labelling and detection', 'is waiting on its own background work'),
  says('r2', NO_ANSWER),
  person('Wait, before I continue labeling more of the pupils, should I upscale them?'),
  says('r3', "They're already upscaled. Every face on the pupil page is upscaled."),
  person('Pass my page edits on, and test the hair worker for grey hair.'),
  says('r4', 'Passing your edits to the gaps task, and starting a grey hair check.', [
    send(GAPS),
    { tool_use_id: 'launch-hair', tool: 'Agent', input: { description: 'Grey hair: test the hair colour worker' } },
  ]),
  {
    role: 'user',
    text: '',
    toolUses: [],
    toolResults: [
      { tool_use_id: 'launch-hair', text: `Async agent launched successfully.\nagentId: ${HAIR}`, isError: false },
    ],
  },
  says('r5', 'Your page edits went to the gaps task, and the grey hair check has started.'),
  notify(GAPS, 'Analysis gaps: Notion page'),
  says('r6', GAPS_REPLY),
  person('What is the weather like?'),
  says('r7', 'I cannot see the weather from here.'),
]

describe('which task a reply is about', () => {
  test('notifications, words passed on, new tasks and follow-ups each find their task', async () => {
    const builder = new Builder()
    builder.ingest(CHAT)
    const { replies, tasks } = builder.index()

    expect(replies.r1).toEqual([PUPIL])
    // The chat's answer to a notification that needs none is drawn hidden, so it gets no box.
    expect(replies.r2).toBeUndefined()
    // The person's follow-up names the pupils and comes after a pupil reply.
    expect(replies.r3).toEqual([PUPIL])
    // A reply about two tasks carries both; one that names only one of them keeps both here,
    // as each of its words is shared ("gaps" and "grey hair" name one task each).
    expect(replies.r4).toEqual([GAPS, HAIR])
    expect(replies.r5).toEqual([GAPS, HAIR])
    expect(replies.r6).toEqual([GAPS])
    // A reply about nothing the tasks are named for gets no box.
    expect(replies.r7).toBeUndefined()

    expect(tasks[HAIR]?.title).toBe('Grey hair: test the hair colour worker')
    expect(tasks[GAPS]?.status).toBe('finished')
  })

  test('each task gathers the links its replies gave, named and newest first', async () => {
    const builder = new Builder()
    builder.ingest(CHAT)
    const { tasks } = builder.index()
    expect(tasks[GAPS]?.links).toEqual([
      { url: NOTION, label: 'Example page', kind: 'Notion' },
    ])
    expect(tasks[PUPIL]?.links[0]).toEqual({ url: SHEET, label: 'Where: the "Pupil size" sheet', kind: 'example.com' })

    const given = linksIn(
      `See [run 15 sheets](${SHEET}&run=15) and the Lab on http://127.0.0.1:8787/.\nhttps://github.com/acme/engine/pull/7, then ${SHEET}&run=15 again.\n- Architecture: https://app.notion.com/p/0123456789abcdef0123456789abcdef`,
    )
    expect(given).toEqual([
      { url: `${SHEET}&run=15`, label: 'run 15 sheets', kind: 'example.com' },
      { url: 'http://127.0.0.1:8787/', label: 'See run 15 sheets and the Lab on', kind: 'This Mac' },
      { url: 'https://github.com/acme/engine/pull/7', label: 'See run 15 sheets and the Lab on', kind: 'GitHub' },
      // A list line's own words name its link, without the bullet.
      { url: 'https://app.notion.com/p/0123456789abcdef0123456789abcdef', label: 'Architecture', kind: 'Notion' },
    ])
    // A bare link is named by the words before it in its own sentence
    expect(linksIn('It is merged. The new fit is on the review page at http://localhost:3000/heads/a.')[0]?.label).toBe('The new fit is on the review page at')
  })

  test('a reply that names one of its turn\'s tasks goes to that one alone', async () => {
    const builder = new Builder()
    builder.ingest([
      notify(PUPIL, 'Pupil size: labelling and detection'),
      notify(GAPS, 'Analysis gaps: Notion page'),
      says('both', 'The pupil labels are saved.'),
    ])
    expect(builder.index().replies.both).toEqual([PUPIL])
  })

  test('rows read later carry on the turn they belong to', async () => {
    const chat = [notify(GAPS, 'Analysis gaps: Notion page'), says('r0', 'The gaps page is up.'), ...CHAT]
    const upToLaunch = chat.findIndex(row => row.uuid === 'r4') + 1
    const builder = new Builder()
    builder.ingest(chat.slice(0, upToLaunch))
    expect(builder.index().replies.r4).toEqual([GAPS])
    builder.ingest(chat.slice(upToLaunch))
    expect(builder.index().replies.r4).toEqual([GAPS, HAIR])
  })

  test('each task keeps its colour, and tasks started together get different ones', async () => {
    const builder = new Builder()
    builder.ingest(CHAT)
    const { tasks } = builder.index()
    const slots = [PUPIL, GAPS, HAIR].map(id => tasks[id]?.colour)
    expect(new Set(slots).size).toBe(3)

    const again = new Builder(builder.colours)
    again.ingest(CHAT.slice(5))
    expect(again.index().tasks[GAPS]?.colour).toBe(tasks[GAPS]?.colour)
  })
})
