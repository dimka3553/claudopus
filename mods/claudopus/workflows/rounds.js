export const meta = {
  name: 'rounds',
  description: 'A maker builds it, a separate checker holds it to the bar, round after round until it passes or the cap',
  whenToUse: 'Work with a bar a checker who did not build it can test',
  phases: [
    { title: 'Make', detail: 'the maker builds it, or fixes what the checker found', model: 'opus' },
    { title: 'Check', detail: 'the checker tests it against the bar', model: 'sonnet' },
  ],
}
// args: { task, bar, folder, cap } — the task as the person put it, the bar that says it passes, the folder the work happens in,
// and how many rounds at most (3 when not given)
const task = String((args && args.task) || '')
const bar = String((args && args.bar) || '')
const folder = String((args && args.folder) || '')
const cap = Math.min(Math.max(Number((args && args.cap) || 3), 1), 5)
const VERDICT = {
  type: 'object',
  properties: {
    pass: { type: 'boolean', description: 'true only when every part of the bar holds' },
    why: { type: 'string', description: 'at most 8 plain words: the main fault found, or that all of the bar holds' },
    findings: { type: 'array', items: { type: 'string' }, description: 'each fault found, one line each, for the maker to fix' },
  },
  required: ['pass', 'why', 'findings'],
}
let findings = []
let verdict = null
let round = 0
while (round < cap) {
  round += 1
  phase('Make')
  await agent(
    round === 1
      ? `${task}\n\nWork in ${folder}. A separate checker will test your work against this bar, so build to it and leave the testing to the checker:\n${bar}\n\nReply with one line saying what you built.`
      : `The checker tested your work in ${folder} against the bar and found:\n${findings.map(one => `- ${one}`).join('\n')}\n\nThe bar:\n${bar}\n\nFix every one of them. Reply with one line saying what you changed.`,
    { label: 'maker', phase: 'Make', model: 'opus' },
  )
  phase('Check')
  verdict = await agent(
    `You did not build this work and you hold it to its bar. The work is in ${folder}; what it was for:\n${task}\n\nThe bar:\n${bar}\n\nTest every part of the bar yourself: write your own checks and run them, and look at any picture the work made. Change none of the work. pass is true only when every part holds.`,
    { label: 'checker', phase: 'Check', model: 'sonnet', schema: VERDICT },
  )
  log(`Round ${round} of ${cap}: ${verdict && verdict.pass ? 'passed' : 'failed'}${verdict ? `: ${verdict.why}` : ''}`)
  if (!verdict || verdict.pass) break
  findings = verdict.findings && verdict.findings.length ? verdict.findings : [verdict.why]
}
return { passed: Boolean(verdict && verdict.pass), rounds: round, cap, why: verdict ? verdict.why : 'the checker gave no answer', findings: verdict && !verdict.pass ? findings : [] }
