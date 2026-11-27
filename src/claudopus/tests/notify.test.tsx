// Sounds and notifications, each by the card's stage: a task that is done, one that failed, and one that needs the person

test('a task that is done plays one sound and raises one notification, once, as its result is handed in; a helper, a pause, a second result within seconds, a Stop press and a reload make none; a failed one says Failed and why with no sound, and a stopped one makes no sound', SLOW, async ($, on) => {
  // Whether the app takes notifications from a mod
  const app = { noSurface: false, claudopus: 0 }
  const agents: Record<string, string> = {}
  const talk: unknown[] = []
  const { clock, played, notified, files, osa, own } = world(on, { app, agents, talk, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34', __CFBundleIdentifier: 'com.anthropic.claudefordesktop' } })
  await $.session.start(start)
  // A task's step ends, with what it said; and it hands in its result, which is what makes it done
  const end = (agentId: string, turnId: string, answer = 'Done.', extra = {}) => $.turn.complete({ answer, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId, ...extra } as never)
  const handIn = async (agentId: string, report = 'Done.') => expect(((await $.tool.call({ tool: 'SubagentHandback', tool_use_id: `hb-${agentId}-${notified.length}-${own.length}`, agentId, message: report } as never)) as { deny?: string }).deny).toBeUndefined()
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  // Its helper ends first: nothing
  await $.agent.spawn({ ...spawn, description: 'Measure the nose', prompt: 'measure', parentAgentId: 'a1' } as never)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'c1', agentId: 'a1', command: 'hold render', description: 'Render the nose', run_in_background: true } as never)
  agents.a2 = 'completed'
  await end('a2', 'h1')
  // The task ends a step in words while a command of its own runs: a pause, its card still at work, and nothing is heard or shown
  agents.a1 = 'completed'
  await end('a1', 't0', 'The render runs on.')
  await clock.advance(60_000)
  expect([played, notified]).toEqual([[], []])

  // Its command ends and it hands in its result: one sound, one line with its title and the first words of its result
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 'c1s', agentId: 'a1', task_id: 'bg-c1' } as never)
  await handIn('a1', '**The nose is fixed.** Both nostrils now match, and the tests pass.\n\nMore below.')
  expect(played).toEqual([])
  await clock.advance(1_000)
  expect(played).toEqual(['sounds/ready.wav'])
  expect(notified).toEqual(['Fix the nose | The nose is fixed.'])
  // The step it handed in with ends: nothing more
  await end('a1', 't1', '')
  await clock.advance(1_000)
  expect([played.length, notified.length]).toEqual([1, 1])

  // Sent on and handing in again within seconds: no second sound or notification
  await $.agent.spawn({ ...spawn, resume: { agentId: 'a1' }, prompt: 'One more look.' } as never)
  await handIn('a1', 'Looked once more: the nose is fixed.')
  await clock.advance(1_000)
  expect([played.length, notified.length]).toEqual([1, 1])

  // Two that finish together: one sound and one notification naming both
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await handIn('a3')
  await clock.advance(300)
  await handIn('a4')
  await clock.advance(1_000)
  // (a result asks nothing: a task that handed in is done)
  expect([played.length, notified.slice(1)]).toEqual([2, ['2 tasks are done | Check the ears: done · Draw the eyes: done']])
  await $.agent.spawn({ ...spawn, description: 'Check the chin', prompt: 'check the chin' } as never)
  await handIn('a5', 'The chin is checked.')
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Check the chin | The chin is checked.')
  expect(played).toHaveLength(3)

  // A failed task: a notification that says Failed and why, and no sound. One whose step ended with an error
  await $.agent.spawn({ ...spawn, description: 'Paint the hair', prompt: 'paint the hair' } as never)
  await end('a6', 't6', '', { reason: 'error' })
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Paint the hair | Failed · Ended with an error.')
  // and one whose run is over with no result: Claude Code pressed it for its report, and it ended in words again
  await $.agent.spawn({ ...spawn, description: 'Paint the brows', prompt: 'paint the brows' } as never)
  agents.a7 = 'completed'
  talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'The brows are painted.' }] }, { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' })
  await end('a7', 't7', 'The brows are painted.')
  talk.length = 0
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Paint the brows | Failed · Ended without its result.')
  expect([played.length, notified.length]).toEqual([3, 5])

  // A task the person stops with its Stop button: nothing
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a8' })
  await clock.advance(1_000)
  await pane.unmount()
  expect([played.length, notified.length]).toEqual([3, 5])
  // One the chat stops: no sound
  await $.agent.spawn({ ...spawn, description: 'Draw the teeth', prompt: 'draw the teeth' } as never)
  await $.tool.call({ tool: 'TaskStop', tool_use_id: 's9', task_id: 'a9' } as never)
  await clock.advance(1_000)
  expect(played).toHaveLength(3)
  const shown = notified.length

  // A reload announces nothing that ended before it, and goes on announcing what ends after it
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await $.session.start(start)
  await clock.advance(1_000)
  expect(notified).toHaveLength(shown)
  await handIn('a10', 'The ears are drawn.')
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Draw the ears | The ears are drawn.')
  expect([played.length, notified.length]).toEqual([4, shown + 1])

  // Where the app takes no notification from a mod, Claudopus.app raises it, and a click opens this chat in the Claude app
  app.noSurface = true
  await $.agent.spawn({ ...spawn, description: 'Draw the cheeks', prompt: 'draw the cheeks' } as never)
  await handIn('a11', 'The cheeks are drawn.')
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the cheeks', '--text', 'The cheeks are drawn.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ready-a11'])
  expect(own.at(-1)?.[0]).toMatch(/\/bin\/notify$/)
  expect(osa).toEqual([])

  // Claudopus notifications turned off in System Settings: macOS's plain one instead
  app.claudopus = 2
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await handIn('a12', 'The chin is drawn.')
  await clock.advance(1_000)
  expect(own.filter(one => /\/bin\/notify$/.test(one[0] ?? ''))).toHaveLength(2)
  expect(osa.at(-1)).toEqual(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', 'Draw the chin', 'The chin is drawn.'])
  app.noSurface = false

  // config.json switches each off
  ownSet(files, 'config.json', JSON.stringify({ sound: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the brows', prompt: 'draw the brows' } as never)
  await handIn('a13')
  await clock.advance(1_000)
  expect([played.length, notified.length]).toEqual([6, shown + 2])
  ownSet(files, 'config.json', JSON.stringify({ notifications: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the lips', prompt: 'draw the lips' } as never)
  await handIn('a14')
  await clock.advance(1_000)
  expect([played.length, notified.length]).toEqual([7, shown + 2])
  expect(osa).toHaveLength(1)
})

test('outside the Claude app a click on a notification brings forward the app the chat runs in, such as its terminal', async ($, on) => {
  // A session id not of the app's shape is not put in its link
  const { clock, own } = world(on, { app: { noSurface: true }, env: { CLAUDE_CODE_HOST_SESSION_ID: 'session_x', __CFBundleIdentifier: 'com.googlecode.iterm2' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'a1', message: 'The eyes are drawn.' } as never)
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--activate', 'com.googlecode.iterm2', '--key', 'ready-a1'])
})

test('with neither a chat in the Claude app nor an app to bring forward, a notification names nothing for a click to open', async ($, on) => {
  const { clock, own } = world(on, { app: { noSurface: true } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb1', agentId: 'a1', message: 'The eyes are drawn.' } as never)
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--key', 'ready-a1'])
})

test('work that needs the person is heard once: its notification comes as the amber Claudopus Asks carrying the sound, silent when sound is off', async ($, on) => {
  const app = { noSurface: true, claudopus: 0, asks: 0 }
  const { played, own, osa, files, clock } = world(on, { app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const ask = (id: string, text: string) => $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: id, agentId: 'a1', text } as never)
  const lead = (argv?: string[]) => argv?.slice(1, argv.indexOf('--title'))

  // The sound goes in the notification, so macOS plays it as the person set Claudopus Asks and as a Focus allows; no second sound
  await ask('k1', 'Paste the code.')
  expect(own).toHaveLength(1)
  expect(lead(own[0])).toEqual(['--asks', '--chime'])
  expect(own[0]?.slice(3)).toEqual(['--title', 'Hide the repo has a question for you', '--text', 'Paste the code.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ask-a1'])
  expect(played).toEqual([])
  // The same ask said again is neither shown nor heard again
  await ask('k2', 'Paste the code.')
  expect(own).toHaveLength(1)

  // Sound off in Config: the amber notification, silent, and no chime of the mod's
  ownSet(files, 'config.json', JSON.stringify({ sound: false }))
  await ask('k3', 'Press Approve.')
  expect(lead(own.at(-1))).toEqual(['--asks'])
  expect(played).toEqual([])

  // Claudopus Asks turned off in System Settings: the purple Claudopus, which carries no sound, and the mod's own chime
  ownSet(files, 'config.json', '{}')
  app.asks = 2
  await ask('k4', 'Type the code from the email.')
  expect(lead(own.at(-2))).toEqual(['--asks', '--chime'])
  expect(lead(own.at(-1))).toEqual([])
  expect(played).toEqual(['sounds/ready.wav'])
  expect(osa).toEqual([])
  // Another within five seconds is shown and not heard again
  await ask('k4b', 'Type it again.')
  expect(lead(own.at(-1))).toEqual([])
  expect(played).toHaveLength(1)

  // The first ask on a Mac waits for macOS's allow question without its sound, so the mod's chime is heard at once instead
  app.asks = 5
  await clock.advance(6_000)
  await ask('k4c', 'Allow it.')
  expect(lead(own.at(-1))).toEqual(['--asks', '--chime'])
  expect(played).toHaveLength(2)
  app.asks = 0

  // Notifications off in Config: only the chime; both off: nothing
  ownSet(files, 'config.json', JSON.stringify({ notifications: false }))
  const before = own.length
  await clock.advance(6_000)
  await ask('k5', 'Pick a name.')
  expect(own).toHaveLength(before)
  expect(played).toHaveLength(3)
  ownSet(files, 'config.json', JSON.stringify({ notifications: false, sound: false }))
  await clock.advance(6_000)
  await ask('k6', 'Pick a colour.')
  expect(own).toHaveLength(before)
  expect(played).toHaveLength(3)
})

// On Windows bin/notify raises Windows' own notification, which is silent: the mod's chime is the sound, and where Windows shows none
// nothing else is tried (there is no macOS notification there)
test('on a Windows PC an ask comes as the notification bin/notify raises, opening the chat, with the mod\'s own chime; where none can be shown, nothing else is tried', async ($, on) => {
  const app = { noSurface: true, claudopus: 0, asks: 0 }
  const { played, own, osa, files, clock } = world(on, { windows: true, app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34' } })
  await $.session.start(start)
  await $.prompt.submit({ text: 'make the repo private', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Hide the repo', prompt: 'make the repo private' } as never)
  const ask = (id: string, text: string) => $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: id, agentId: 'a1', text } as never)
  await ask('k1', 'Paste the code.')
  expect(own.at(-1)?.slice(4, 6)).toEqual(['--asks', '--chime'])
  expect(own.at(-1)).toContain('claude://code/continue?session=local_ab12-cd34')
  expect(played).toEqual(['sounds/ready.wav'])
  // None shown (no notifications on this PC): only the chime, and no other way is tried
  app.asks = 3
  app.claudopus = 3
  await clock.advance(6_000)
  await ask('k2', 'Type the code from the email.')
  expect(played).toHaveLength(2)
  expect(osa).toEqual([])
  expect(await until(async () => (files.get(`${WINDOWS_MEMORY}/log.md`) ?? '').includes('no Windows notification on this PC') || undefined)).toBe(true)
})
