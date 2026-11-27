// A short answer the person types in the chat ("allow", "yes", "release it", a button's own words), taken as their press on the
// block that waits for them: the newest one it fits, or the one whose task it names ("allow the nose fix"). Only their own typed
// message counts (chatHooks' prompt.submit, from the composer or the phone), never a task's message, the chat's own words or what
// Claudopus sends. A message that fits more than one named card, or a long one, answers nothing. A command Claude Code blocked runs
// only on the person's own press on its card (runit.tsx): a typed answer to it answers nothing and the chat says so. Keys and
// passwords are never typed in the chat (24 Nov, the person: "it counts if I type allow ... in any of the subagents if they are asking")

// Longer than this, a message is more than an answer
const TYPED_MOST = 80
// A yes, alone or with what it allows, then what names the task, if anything
const TYPED_YES =
  /^(?:(?:yes|yeah|yep|yup|ok|okay|sure)(?: please)?(?: (?:go ahead|do it|allow it|allow|approve it|approve|release it|release|deploy it|deploy|run it|ship it|push it))?|allow(?: it)?|approve(?:d| it)?|go ahead|do it|run it|release(?: it)?|deploy(?: it)?|ship(?: it)?|push(?: it)?|merge(?: it)?|publish(?: it)?|confirm(?:ed)?|proceed|let it through)(?: please)?(?: (.+))?$/
// A question's own button that is its yes, such as Release it: the one a typed yes presses
const YES_CHOICE = /^(?:yes|ok|okay|allow|approve|go ahead|release|deploy|ship|push|merge|publish|run|confirm|proceed|do it)\b/
// Words around a task's name that are not of it
const TYPED_FILLER = new Set(['it', 'this', 'that', 'one', 'now', 'please', 'pls', 'the', 'task', 'card', 'for', 'on', 'to', 'in', 'of', 'thanks', 'thank', 'you'])

// Whether a block is one of a card's own questions
const isAskOf = (need: Need, card: string) => need.id === `ask-${card}` || need.id.startsWith(`ask-${card}-`)
type Typed = { need: Need; card?: Todo; title: string; isPressOnly: boolean }
// What waits for an answer in this chat: its own cards' blocks, and its own thread's, as drawn with no box of their own (surface ''),
// with what a press there already answered left out. Keys, passwords and the disk are never answered in words
const typedWaiting = async ($: EngineInterface): Promise<Typed[]> => {
  const now = await $.clock.now()
  const cards = (await ownCards($)).filter(one => !one.parentId && !one.chat)
  const own = new Set(cards.map(one => one.id))
  const onCards = cards.flatMap(one => needsOf($, asPressed(one), '', now).map(need => ({ need, card: one, title: titleOf(one), isPressOnly: Boolean(isAskOf(need, one.id) && need.card?.ask?.refused) })))
  const loose = [
    ...looseGates.filter(gate => !gatePressed.has(gate.id)).map(gate => gateNeed($, gate, '', false, 'This chat')),
    ...waiting.filter(p => !p.card || !own.has(p.card)).map(p => promptNeed($, p)),
  ].map(need => ({ need, title: '', isPressOnly: false }))
  return [...onCards, ...loose].filter(one => (one.need.kind === 'permission' || one.need.kind === 'question') && !one.need.isActing && one.need.buttons.some(b => !b.isOpener))
}
// The button a typed message presses on one block, and the words left over that name its task
const typedButton = (one: Typed, words: string): { button: NeedButton; rest: string } | undefined => {
  const buttons = one.need.buttons.filter(b => !b.isOpener)
  for (const button of buttons) {
    const label = plainWords(button.label)
    if (label && (words === label || words.startsWith(`${label} `))) return { button, rest: words.slice(label.length).trim() }
  }
  const yes = TYPED_YES.exec(words)
  if (!yes) return undefined
  // (the question of the block, of those its card holds)
  const ask = one.need.card?.ask
  const isAsk = Boolean(one.card && isAskOf(one.need, one.card.id))
  // A question's yes: the first button of a go-ahead to release, else its one button that says yes
  const choices = isAsk && !ask?.refused ? (ask?.release && ask.choices?.[0] ? [ask.choices[0]] : (ask?.choices ?? []).filter(choice => YES_CHOICE.test(plainWords(choice)))) : [ALLOW]
  const button = choices.length === 1 ? buttons.find(b => b.label === choices[0]) : undefined
  return button ? { button, rest: yes[1] ?? '' } : undefined
}
const nameWords = (rest: string) => rest.split(' ').filter(word => word && !TYPED_FILLER.has(word))
// Whether the words left over name this block's task: each is a word of its title
const isNamed = (one: Typed, name: string[]) => {
  const title = new Set(plainWords(one.title).split(' '))
  return Boolean(one.title) && name.every(word => title.has(word))
}

// The person's typed message as an answer: pressed on its block, and what the chat's model is told of it; nothing when it is no answer
const typedAnswer = async ($: EngineInterface, text: string): Promise<string | undefined> => {
  const typed = text.trim()
  if (!typed || typed.length > TYPED_MOST || /\n/.test(typed)) return undefined
  const words = plainWords(typed)
  if (!words) return undefined
  const fits = (await typedWaiting($)).flatMap(one => {
    const found = typedButton(one, words)
    return found ? [{ ...one, ...found, name: nameWords(found.rest) }] : []
  })
  if (!fits.length) return undefined
  // Named: only the blocks of the one task it names. Words left over that name no waiting task make it no answer: a request
  const isNaming = fits.some(one => one.name.length)
  const chosen = isNaming ? fits.filter(one => one.name.length && isNamed(one, one.name)) : fits
  if (!chosen.length) return undefined
  const tasks = [...new Set(chosen.map(one => one.title))]
  if (isNaming && tasks.length > 1) {
    await log($, `typed answer "${cut(oneLine(typed), 40)}" fits more than one task, so it answered nothing`)
    return named(TYPED_UNSURE(typed, tasks))
  }
  const one = chosen.reduce((a, b) => (b.need.at > a.need.at ? b : a))
  const where = one.title ? `the task "${one.title}"'s` : "this chat's own"
  if (one.isPressOnly) {
    await log($, `typed answer "${cut(oneLine(typed), 40)}" not taken: the newest that waits is a command Claude Code blocked, which only a press runs`)
    return named(TYPED_PRESS_ONLY(typed, one.title, cut(oneLine(one.need.command ?? ''), 160)))
  }
  one.button.onPress({ surface: '' })
  await Promise.allSettled([...answersOnWay])
  // A permission's grey line says it was typed; a question's says the answer, as for a press
  if (!one.need.id.startsWith('ask-')) pressedLine($, one.card?.id ?? '', one.button.label, '', `You typed “${cut(oneLine(typed), 40)}” in the chat`)
  await log($, `typed answer "${cut(oneLine(typed), 40)}" taken as "${one.button.label}" on ${one.card?.id ?? 'this chat'}`)
  return named(TYPED_ANSWERED(typed, one.button.label, where, cut(oneLine(one.need.text), 160)))
}
