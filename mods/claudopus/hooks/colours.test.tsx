// Task colours: which chat reply is about which task, and the links each reply gives
import { describe, expect, test } from 'claude-code/testing'
import type { SessionMessage } from 'claude-code'

import { Builder, NO_ANSWER, PALETTE, linksIn, passedOn, personWords, quoteFor, slotsFor } from './colours'

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

  test("what the chat says after its answer to a notice that needs none is not the noticed task's, though a task's own message to it is missing from the rows", async () => {
    const builder = new Builder()
    builder.ingest([
      notify(PUPIL, 'Pupil size: labelling and detection'),
      says('quiet', NO_ANSWER),
      says('shown', '', [{ tool_use_id: 'show', tool: 'SendUserFile', input: {} }]),
      { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'show', text: '1 file delivered', isError: false }] },
      says('after', 'The gaps page now has its When column, and the Notion page lists every gap.'),
    ])
    expect(builder.index().replies.after).not.toEqual([PUPIL])
  })

  test('a reply that passes on a result as it came is about that result\'s task, the newest given first; a short one tells nothing', async () => {
    const results = [
      { id: PUPIL, text: 'The **pupil page** now works like the iris page.\n\nEvery face is upscaled.' },
      { id: GAPS, text: 'The gaps page has its new When column, and it lists each gap with the day it was found.' },
    ]
    expect(passedOn('The pupil page now works like the iris page. Every face is upscaled.', results)).toBe(PUPIL)
    expect(passedOn('The gaps page has its new When column, and it lists each gap', results)).toBe(GAPS)
    expect(passedOn('The gaps page has its new When column, and it lists each gap', [...results, { id: HAIR, text: results[1]?.text ?? '' }])).toBe(HAIR)
    expect(passedOn('Done.', results)).toBeUndefined()
    expect(passedOn('Something else entirely, said in words of the chat\'s own.', results)).toBeUndefined()
  })

  test('each card gets the colour least used by the eleven started before it, so twelve in a row all differ; a card keeps the one it has', async () => {
    const cards = Array.from({ length: PALETTE.length + 1 }, (_, n) => ({ id: `t${n}`, startedAt: 1000 + n }))
    const fresh = slotsFor(cards)
    expect(new Set(cards.slice(0, PALETTE.length).map(one => fresh[one.id])).size).toBe(PALETTE.length)
    // The thirteenth takes the colour used longest ago: the first's
    expect(fresh[`t${PALETTE.length}`]).toBe(fresh.t0)
    // and the second is far from the first: blue after red, not orange
    expect([fresh.t0, fresh.t1]).toEqual([0, 5])
    // Cards that have a colour keep it, and a new one beside them takes another
    const kept = slotsFor([{ id: 'a', startedAt: 1, colour: 0 }, { id: 'b', startedAt: 2, colour: 0 }, { id: 'c', startedAt: 3 }])
    expect(kept.a).toBeUndefined()
    expect(kept.b).toBeUndefined()
    expect(kept.c).not.toBe(0)
  })

  test('each reply quotes the message of the person\'s it answers: the newest they sent its task before it, in the chat or on its card, never one that went to another task', async () => {
    const builder = new Builder()
    builder.ingest(CHAT)
    const index = builder.index()
    // A reply to the person's own question quotes it
    expect(quoteFor(index, PUPIL, index.rows.r3)).toBe('Wait, before I continue labeling more of the pupils, should I upscale them?')
    // A task's result, after the person's words were passed on to it, quotes those words, not the task's first message
    expect(quoteFor(index, GAPS, index.rows.r6)).toBe('Pass my page edits on, and test the hair worker for grey hair.')
    expect(quoteFor(index, GAPS)).toBe('Pass my page edits on, and test the hair worker for grey hair.')
    // Nothing the person said to a task, nothing quoted
    expect(quoteFor(index, PUPIL, index.rows.r1)).toBeUndefined()

    // A message sent while the chat was at work has no row: the chat passed it on to the task it was for, and the message of the
    // turn went to the task the chat started for it, never to that one (27 Nov)
    const GDPR = 'a5555555555555555'
    const ALLOW = 'a6666666666666666'
    const WHY = 'Why was there only one "Don\'t Allow" button and no "Allow" button?'
    const OOPS = 'Accidentally clicked "Don\'t Allow," but I wanted to click "Allow." There was no "Allow" button.'
    const ON_CARD = "The abandoned email, that's old. It's not used. We did include an under-18 stop, though."
    const talk: SessionMessage[] = [
      person('Check the GDPR status of the app'),
      says('g1', 'Starting a GDPR check.', [{ tool_use_id: 'gdpr', tool: 'Agent', input: { description: 'Check FaceIQ GDPR status now', prompt: 'Dima\'s words: "Check the GDPR status of the app"' }, agentId: GDPR }]),
      person(WHY),
      says('g2', 'Starting a task for the missing button.', [{ tool_use_id: 'allow', tool: 'Agent', input: { description: 'Fix missing Allow button on cards', prompt: `Dima's words: "${WHY}"` }, agentId: ALLOW }]),
      says('g3', '', [{ tool_use_id: 'oops', tool: 'SendMessage', input: { to: GDPR, message: `Dima's words: “${OOPS.replace(/"/g, '')}”` } }]),
      says('g4', "I've told the GDPR check you meant Allow."),
    ]
    const heard = ['Check the GDPR status of the app', WHY, OOPS]
    const chat = new Builder()
    chat.ingest(talk)
    // What the person then writes on the task's card goes after those rows; its result comes after it
    const card = { id: GDPR, text: ON_CARD, ...chat.stamp() }
    const later = [notify(GDPR, 'Check FaceIQ GDPR status now'), says('g5', 'The age stop is mostly closed: sign-in asks for 18 or older.')]
    chat.ingest(later)
    const told = chat.index({ cards: [card], heard })
    expect(quoteFor(told, GDPR, told.rows.g4)).toBe(OOPS)
    expect(quoteFor(told, ALLOW, told.rows.g2)).toBe(WHY)
    // The result after the message on its card quotes that message
    expect(quoteFor(told, GDPR, told.rows.g5)).toBe(ON_CARD)
    // Read again after a reload, the message on the card falls in the same place
    const again = new Builder()
    again.ingest([...talk, ...later])
    const reread = again.index({ cards: [card] })
    expect(quoteFor(reread, GDPR, reread.rows.g5)).toBe(ON_CARD)
    // and with the chat's messages not known yet, the one passed on to the other task is still never quoted for this one
    expect(quoteFor(reread, GDPR, reread.rows.g4)).toBe('Check the GDPR status of the app')
    // Words written on a result go to the chat after the result they continue from: the words alone are the person's
    expect(personWords('Continue from the result "Fix the nose" (27 Nov, 16:07), /Users/x/.claude/claudopus/reports/20261127-0807-fix-the-nose/report.md: Make the tip rounder')).toBe('Make the tip rounder')
    // Text the person pasted is quoted as their words, without the app's marks around it
    expect(personWords('\n\n<pasted_content id="de2c">\nCan you change the emails?\n</pasted_content id="de2c">\n')).toBe('Can you change the emails?')
    expect(personWords('<system-reminder>A note.</system-reminder>\nMy words')).toBe('My words')
  })
})
