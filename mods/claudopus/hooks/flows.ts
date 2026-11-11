// Workflows: what the panel knows of a run of the Workflow tool, read from what the engine itself reports. The call's own input
// (the script's meta: its name and stages; the args: the task and the cap), its result (the run's id, its task and the folder its
// agents' transcripts go to), each agent the script starts (agent.spawn with `workflow`), each response of theirs (turn.step), the
// run's journal in that folder (each agent's label, stage, and returned value), and the notice that it ended. Nothing of any agent's
// thinking is read: an agent's chat is its text and its tool calls alone
import type { SessionMessage, ToolUseSummary } from 'claude-code'

import type { Flow, FlowAgent, FlowPhase } from '../types'

// The panel's blue, for work that runs as a workflow: the purple of other work moved round to blue, as light and as strong
export const FLOW = '#4E93EF'
// A workflow's Details is a tab of its own, as a piece of work's is
export const FLOW_PANE = 'flow-'
export const flowPaneOf = (id: string) => `${FLOW_PANE}${id.replace(/[^A-Za-z0-9_-]/g, '-')}`.slice(0, 64)

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()
const short = (text: string, most: number) => (text.length <= most ? text : `${text.slice(0, most - 1).trimEnd()}…`)

// A string field of the script's meta, as written: meta is a pure literal, so its fields are read as text
const field = (text: string, name: string) => {
  const m = new RegExp(`\\b${name}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`).exec(text)
  return m?.[2]?.replace(/\\(.)/g, '$1') ?? ''
}
// The meta at the head of a workflow script: its name, what it does, and its stages in order
export const metaOf = (script: string): { name: string; description: string; phases: FlowPhase[] } => {
  const head = /export\s+const\s+meta\s*=\s*\{([\s\S]*?)\n\}/.exec(script)?.[1] ?? script.slice(0, 4000)
  const list = /phases\s*:\s*\[([\s\S]*?)\]/.exec(head)?.[1] ?? ''
  const phases = [...list.matchAll(/\{([^{}]*)\}/g)]
    .map(one => one[1] ?? '')
    .map(body => ({ title: field(body, 'title'), ...(field(body, 'detail') ? { detail: field(body, 'detail') } : {}), ...(field(body, 'model') ? { model: field(body, 'model') } : {}) }))
    .filter(one => one.title)
  const outside = head.replace(/phases\s*:\s*\[[\s\S]*?\]/, '')
  return { name: field(outside, 'name'), description: field(outside, 'description'), phases }
}

// One line of the run's journal, as the engine writes it: `started` (an agent's id, label and stage), `result` (what it returned),
// `failed`
type JournalLine = { type?: string; agentId?: string; label?: string; phase?: string; result?: unknown }
export const journalOf = (text: string): JournalLine[] =>
  text.split('\n').flatMap(row => {
    try {
      return row.trim() ? [JSON.parse(row) as JournalLine] : []
    } catch {
      return []
    }
  })

// What an agent returned, in a few words: a verdict's pass and why, else its text's first line
export const outcomeOf = (value: unknown): Pick<FlowAgent, 'pass' | 'why' | 'findings' | 'result'> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    const pass = typeof o.pass === 'boolean' ? o.pass : typeof o.passed === 'boolean' ? o.passed : undefined
    const why = ['why', 'summary', 'reason', 'verdict'].map(key => o[key]).find((one): one is string => typeof one === 'string') ?? ''
    const findings = Array.isArray(o.findings) ? o.findings.filter((one): one is string => typeof one === 'string' && Boolean(one.trim())).slice(0, 20).map(one => short(oneLine(one), 300)) : []
    return { ...(pass === undefined ? {} : { pass }), why: short(oneLine(why), 160), ...(findings.length ? { findings } : {}), result: short(oneLine(JSON.stringify(value)), 600) }
  }
  const text = typeof value === 'string' ? value : value === undefined || value === null ? '' : JSON.stringify(value)
  return { why: short(oneLine(text.split('\n').find(line => line.trim()) ?? ''), 160), result: short(text.trim(), 600) }
}

// The journal laid over what the panel knew: each agent's label and stage, and how it ended
export const withJournal = (flow: Flow, lines: JournalLine[], now: number): Flow => {
  const agents = [...flow.agents]
  for (const line of lines) {
    if (!line.agentId) continue
    const at = agents.findIndex(one => one.id === line.agentId)
    const was: FlowAgent = at >= 0 ? (agents[at] as FlowAgent) : { id: line.agentId, label: '', phase: '', status: 'working', at: now }
    const next: FlowAgent =
      line.type === 'started'
        ? { ...was, label: line.label || was.label, phase: line.phase || was.phase }
        : line.type === 'result'
          ? { ...was, status: 'done', endedAt: was.endedAt || now, ...outcomeOf(line.result) }
          : line.type === 'failed'
            ? { ...was, status: 'failed', endedAt: was.endedAt || now }
            : was
    if (at >= 0) agents[at] = next
    else agents.push(next)
  }
  return { ...flow, agents }
}

// The rounds of a run: a round begins each time its first stage starts again. Each round's outcome is what its last stage's agent
// returned, a checker's verdict
export type Round = { n: number; agents: FlowAgent[]; phase: string; isOpen: boolean; pass?: boolean; why: string; findings: string[] }
// An agent's stage: the journal's, else, before the journal names it, the stage of an earlier agent with the same label
const phaseOf = (flow: Flow, agent: FlowAgent) => agent.phase || flow.agents.find(one => one.phase && one.label && one.label === agent.label)?.phase || ''
export const roundsOf = (flow: Flow): Round[] => {
  const first = flow.phases[0]?.title
  const last = flow.phases.at(-1)?.title
  const rounds: Round[] = []
  for (const was of flow.agents) {
    const agent = { ...was, phase: phaseOf(flow, was) }
    const open = rounds.at(-1)
    // A new round begins when the first stage starts again; and, before the journal names an agent's stage, when the round so far
    // has been judged by its last stage
    const isNew =
      !open ||
      (first !== undefined && agent.phase === first && open.agents.some(one => one.phase !== first)) ||
      (!agent.phase && last !== undefined && open.agents.some(one => one.phase === last && one.status !== 'working'))
    if (isNew) rounds.push({ n: rounds.length + 1, agents: [], phase: '', isOpen: true, why: '', findings: [] })
    rounds.at(-1)?.agents.push(agent)
  }
  return rounds.map(round => {
    const judge = [...round.agents].reverse().find(one => (last ? one.phase === last : true) && one.status !== 'working')
    const running = round.agents.find(one => one.status === 'working')
    const isOpen = flow.status === 'working' && (Boolean(running) || !judge)
    return { ...round, phase: (running ?? round.agents.at(-1))?.phase ?? '', isOpen, ...(judge?.pass === undefined ? {} : { pass: judge.pass }), why: judge?.why ?? '', findings: judge?.findings ?? [] }
  })
}

// The stage being run now: the stage of the agent started last that has not ended, else of the last one started
export const stageOf = (flow: Flow) => {
  if (flow.status !== 'working') return ''
  const one = [...flow.agents].reverse().find(agent => agent.status === 'working') ?? flow.agents.at(-1)
  return (one ? phaseOf(flow, one) : '') || flow.phases[0]?.title || ''
}

// One square of the run: a step of a round. Done, running, not started, a check that passed or failed, or a step that broke
export type Square = 'done' | 'running' | 'waiting' | 'passed' | 'failed' | 'broke'
// The run as squares, one per stage of each round started, grouped by round. A round's stages not yet started are open squares
export const squaresOf = (flow: Flow, rounds: Round[] = roundsOf(flow)): Square[][] => {
  const stages = flow.phases.map(p => p.title)
  const last = stages.at(-1)
  const of = (one: FlowAgent | undefined): Square =>
    !one
      ? 'waiting'
      : one.status === 'failed'
        ? 'broke'
        : one.status === 'working'
          ? flow.status === 'working'
            ? 'running'
            : 'broke'
          : one.phase === last && one.pass !== undefined
            ? one.pass
              ? 'passed'
              : 'failed'
            : 'done'
  return rounds.map(round => {
    if (!stages.length) return round.agents.map(of)
    const slots = stages.map(stage => [...round.agents].reverse().find(one => one.phase === stage))
    // Agents the journal has not yet named take the first slots still empty
    for (const one of round.agents.filter(agent => !agent.phase)) {
      const at = slots.findIndex(slot => !slot)
      if (at >= 0) slots[at] = one
    }
    return slots.map(of)
  })
}

const SQUARE = 11
const STEP_GAP = 3
const ROUND_GAP = 10
// The colours of the squares: grey for a step done, the panel's blue for one running, green and red for a check's verdict
export const SQUARE_COLOR: Record<Square, string> = { done: '#9A9A9A', running: '#4E93EF', waiting: '#8C8C8C', passed: '#3FB950', failed: '#E5534B', broke: '#E5534B' }
// How wide the squares are, in the app's pixels
export const squaresWidth = (groups: Square[][]) => Math.max(SQUARE, groups.reduce((w, g, i) => w + (i ? ROUND_GAP : 0) + g.length * SQUARE + Math.max(0, g.length - 1) * STEP_GAP, 0))
// The squares drawn, as Claude's own view of a workflow draws its agents: filled when done, blue and breathing while running, an
// outline when not started; a check filled green or red by its verdict, a step that broke outlined red
export const squaresSvg = (groups: Square[][], height: number) => {
  const width = squaresWidth(groups)
  const y = (height - SQUARE) / 2
  let x = 0
  const shapes: string[] = []
  groups.forEach((group, i) => {
    if (i) x += ROUND_GAP
    group.forEach((one, j) => {
      if (j) x += STEP_GAP
      const color = SQUARE_COLOR[one]
      const isOpen = one === 'waiting' || one === 'broke'
      const pulse = one === 'running' ? '<animate attributeName="opacity" values="1;0.7;1" dur="1.6s" repeatCount="indefinite"/>' : ''
      shapes.push(
        isOpen
          ? `<rect x="${x + 0.75}" y="${y + 0.75}" width="${SQUARE - 1.5}" height="${SQUARE - 1.5}" rx="2.5" fill="none" stroke="${color}" stroke-width="1.5" opacity="${one === 'waiting' ? 0.7 : 1}"/>`
          : `<rect x="${x}" y="${y}" width="${SQUARE}" height="${SQUARE}" rx="2.5" fill="${color}">${pulse}</rect>`,
      )
      x += SQUARE
    })
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${shapes.join('')}</svg>`
}
// The squares for a surface that draws no pictures: one letter each, grouped by round
export const SQUARE_GLYPH: Record<Square, string> = { done: '■', running: '■', waiting: '□', passed: '■', failed: '■', broke: '□' }

// A stage's name as what is being done: Make is Making, Check is Checking
export const doing = (stage: string) => {
  const word = stage.trim()
  if (!word || /ing$/i.test(word) || /\s/.test(word)) return word
  if (/[^e]e$/i.test(word)) return `${word.slice(0, -1)}ing`
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/i.test(word)) return `${word}${word.slice(-1)}ing`
  return `${word}ing`
}

// Text made to fit a number of letters by leaving out its last whole words, never cut inside a word and never marked with an ellipsis
export const fitWords = (text: string, most: number) => {
  const words = oneLine(text).split(' ')
  let kept = ''
  for (const word of words) {
    const next = kept ? `${kept} ${word}` : word
    if (next.length > most) break
    kept = next
  }
  // Shortened, it does not end on a small word that leans on the next
  if (kept.length < oneLine(text).length) kept = kept.replace(/(\s+(?:a|an|the|is|are|was|not|no|of|to|in|on|at|for|with|and|or|but|by|from|as|its|it|·|:|-))+$/i, '')
  return kept || (words[0] ?? '').slice(0, Math.max(1, most))
}
// The first of several wordings, fullest first, that fits a number of letters; the last when none does
export const firstFit = (wordings: string[][], most: number) => {
  const lines = wordings.map(parts => parts.filter(Boolean).join(' · '))
  return lines.find(line => line.length <= most) ?? lines.at(-1) ?? ''
}

// Who is in it: each role once, by its label, with the model it ran on
export const castOf = (flow: Flow) => {
  const seen = new Map<string, string>()
  for (const one of flow.agents) {
    const role = one.label.replace(/[-\s#]*\d+$/, '') || one.phase || 'agent'
    if (!seen.has(role) || (!seen.get(role) && one.model)) seen.set(role, one.model ?? '')
  }
  return [...seen.entries()].map(([role, model]) => ({ role, model }))
}

// The end of a run as the notice that it ended says it: its status, and the value it returned. Nothing when the text is no such notice
export const endOf = (text: string, taskId: string): { status: Flow['status']; result: string } | undefined => {
  if (!taskId || !text.includes('<task-notification') || !text.includes(taskId)) return undefined
  const tag = (name: string) => new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(text)?.[1]?.trim() ?? ''
  if (tag('task-id') && tag('task-id') !== taskId) return undefined
  const status = tag('status')
  // Only a notice of how it ended ends it
  if (!['completed', 'failed', 'killed', 'stopped'].includes(status)) return undefined
  return {
    status: status === 'failed' ? 'failed' : status === 'killed' || status === 'stopped' ? 'stopped' : 'done',
    result: short(tag('result') || tag('summary'), 4000),
  }
}

// An agent's saved transcript as the rows a chat is drawn from: what it was told, what it wrote and each tool call, never its thinking
export const rowsOf = (text: string): SessionMessage[] => {
  const rows: SessionMessage[] = []
  const uses = new Map<string, ToolUseSummary>()
  for (const line of text.split('\n')) {
    let o: { type?: string; message?: { role?: string; content?: unknown } } | undefined
    try {
      o = line.trim() ? JSON.parse(line) : undefined
    } catch {
      o = undefined
    }
    if (!o || (o.type !== 'user' && o.type !== 'assistant') || !o.message) continue
    const content = o.message.content
    const blocks = typeof content === 'string' ? [{ type: 'text', text: content }] : Array.isArray(content) ? (content as { type?: string; text?: string; id?: string; name?: string; input?: unknown; tool_use_id?: string; is_error?: boolean }[]) : []
    const said = blocks.filter(b => b.type === 'text' && typeof b.text === 'string').map(b => b.text ?? '').join('\n')
    const toolUses: ToolUseSummary[] = []
    for (const b of blocks) {
      if (b.type === 'tool_use' && b.id && b.name) {
        const use: ToolUseSummary = { tool_use_id: b.id, tool: b.name, input: (b.input && typeof b.input === 'object' ? b.input : {}) as Record<string, unknown> }
        uses.set(b.id, use)
        toolUses.push(use)
      }
      if (b.type === 'tool_result' && b.tool_use_id && b.is_error) {
        const use = uses.get(b.tool_use_id)
        if (use) use.isError = true
      }
    }
    // A row that only carries tool results is no message of the chat
    if (o.type === 'user' && !said.trim()) continue
    rows.push({ role: o.type, text: said, toolUses })
  }
  return rows
}

// What a run is called on its card: the title its args give, else its task's first words, else what its script says it does
export const titleOfFlow = (args: unknown, meta: { name: string; description: string }) => {
  const a = args && typeof args === 'object' ? (args as Record<string, unknown>) : {}
  const given = typeof a.title === 'string' ? a.title : ''
  const task = typeof a.task === 'string' ? a.task : typeof args === 'string' ? args : ''
  return short(oneLine(given || task.split(/(?<=[.!?])\s/)[0] || meta.description || meta.name || 'Workflow'), 90)
}
// The cap on rounds the args give; none when they give none
export const capOf = (args: unknown) => {
  const a = args && typeof args === 'object' ? (args as Record<string, unknown>) : {}
  const cap = Number(a.cap ?? a.rounds)
  return Number.isFinite(cap) && cap > 0 ? Math.min(Math.round(cap), 99) : undefined
}
