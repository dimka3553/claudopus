// Sounds and notifications: work that is ready, and work that needs the person

test('work that is ready plays one sound and raises one notification; helpers, a second report, a Stop press and a reload make none; stopped work says so silently', async ($, on) => {
  // Whether the app takes notifications from a mod
  const app = { noSurface: false, claudopus: 0 }
  const { clock, played, notified, files, osa, own } = world(on, { app, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_ab12-cd34', __CFBundleIdentifier: 'com.anthropic.claudefordesktop' } })
  await $.session.start(start)
  const end = (agentId: string, turnId: string, answer = 'Done.', extra = {}) => $.turn.complete({ answer, durationMs: 1, isAborted: false, turnId, reason: 'answer', agentId, ...extra } as never)
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  // Its helper ends first: nothing
  await $.agent.spawn({ ...spawn, description: 'Measure the nose', prompt: 'measure', parentAgentId: 'a1' } as never)
  await end('a2', 'h1')
  await clock.advance(1_000)
  expect(played).toEqual([])
  expect(notified).toEqual([])

  // The work finishes: one sound, one line with its title and the first words of its answer
  await end('a1', 't1', '**The nose is fixed.** Both nostrils now match, and the tests pass.\n\nMore below.')
  expect(played).toEqual([])
  await clock.advance(1_000)
  expect(played).toEqual(['sounds/ready.wav'])
  expect(notified).toEqual(['Fix the nose | The nose is fixed.'])

  // Sent on and ending again within seconds: no second sound or notification
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'One more look.' } as never)
  await end('a1', 't2')
  await clock.advance(1_000)
  expect(played).toHaveLength(1)
  expect(notified).toHaveLength(1)

  // Two that finish together: one sound and one notification naming both; what waits on the person comes first
  await $.agent.spawn({ ...spawn, description: 'Check the ears', prompt: 'check the ears' } as never)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w1', agentId: 'a3', items: ['Do you want the left ear bigger?'] } as never)
  await end('a3', 't3')
  await clock.advance(300)
  await end('a4', 't4')
  await clock.advance(1_000)
  expect(played).toHaveLength(2)
  expect(notified.at(-1)).toBe('2 pieces of work are ready | Check the ears: ready · Draw the eyes: ready')
  await $.agent.spawn({ ...spawn, description: 'Check the chin', prompt: 'check the chin' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w2', agentId: 'a5', items: ['Do you want the chin rounder?'] } as never)
  await end('a5', 't5')
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Check the chin | Waits on the person: Do you want the chin rounder?')

  // Failed work: a notification that says so, and no sound
  await $.agent.spawn({ ...spawn, description: 'Paint the hair', prompt: 'paint the hair' } as never)
  await end('a6', 't6', '', { reason: 'error' })
  await clock.advance(1_000)
  expect(played).toHaveLength(3)
  expect(notified.at(-1)).toBe('Paint the hair | Stopped by an error.')

  // Work the person stops with its Stop button: nothing
  await $.agent.spawn({ ...spawn, description: 'Draw the mouth', prompt: 'draw the mouth' } as never)
  const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
  await pane.press({ key: 'stop-a7' })
  await clock.advance(1_000)
  await pane.unmount()
  expect(notified).toHaveLength(4)

  // A reload announces nothing that ended before it, and goes on announcing what ends after it
  await $.agent.spawn({ ...spawn, description: 'Draw the ears', prompt: 'draw the ears' } as never)
  await $.session.start(start)
  await clock.advance(1_000)
  expect(notified).toHaveLength(4)
  await end('a8', 't8', 'The ears are drawn.')
  await clock.advance(1_000)
  expect(notified.at(-1)).toBe('Draw the ears | The ears are drawn.')
  expect(played).toHaveLength(4)

  // Where the app takes no notification from a mod, Claudopus.app raises it, and a click opens this chat in the Claude app
  app.noSurface = true
  await $.agent.spawn({ ...spawn, description: 'Draw the cheeks', prompt: 'draw the cheeks' } as never)
  await end('a9', 't11', 'The cheeks are drawn.')
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the cheeks', '--text', 'The cheeks are drawn.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ready-a9'])
  expect(own.at(-1)?.[0]).toMatch(/\/bin\/notify$/)
  expect(osa).toEqual([])

  // Claudopus notifications turned off in System Settings: macOS's plain one instead
  app.claudopus = 2
  await $.agent.spawn({ ...spawn, description: 'Draw the chin', prompt: 'draw the chin' } as never)
  await end('a10', 't12', 'The chin is drawn.')
  await clock.advance(1_000)
  expect(own).toHaveLength(2)
  expect(osa.at(-1)).toEqual(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', 'Draw the chin', 'The chin is drawn.'])
  app.noSurface = false

  // config.json switches each off
  files.set(`${MEMORY}/config.json`, JSON.stringify({ sound: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the brows', prompt: 'draw the brows' } as never)
  await end('a11', 't9')
  await clock.advance(1_000)
  expect(played).toHaveLength(6)
  expect(notified).toHaveLength(6)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false }))
  await $.agent.spawn({ ...spawn, description: 'Draw the lips', prompt: 'draw the lips' } as never)
  await end('a12', 't10')
  await clock.advance(1_000)
  expect(played).toHaveLength(7)
  expect(notified).toHaveLength(6)
  expect(osa).toHaveLength(1)
})

test('outside the Claude app a click on a notification brings forward the app the chat runs in, such as its terminal', async ($, on) => {
  // A session id not of the app's shape is not put in its link
  const { clock, own } = world(on, { app: { noSurface: true }, env: { CLAUDE_CODE_HOST_SESSION_ID: 'session_x', __CFBundleIdentifier: 'com.googlecode.iterm2' } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.turn.complete({ answer: 'The eyes are drawn.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
  await clock.advance(1_000)
  expect(own.at(-1)?.slice(1)).toEqual(['--title', 'Draw the eyes', '--text', 'The eyes are drawn.', '--activate', 'com.googlecode.iterm2', '--key', 'ready-a1'])
})

test('with neither a chat in the Claude app nor an app to bring forward, a notification names nothing for a click to open', async ($, on) => {
  const { clock, own } = world(on, { app: { noSurface: true } })
  await $.session.start(start)
  await $.agent.spawn({ ...spawn, description: 'Draw the eyes', prompt: 'draw the eyes' } as never)
  await $.turn.complete({ answer: 'The eyes are drawn.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' } as never)
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
  expect(own[0]?.slice(3)).toEqual(['--title', 'Hide the repo needs you', '--text', 'Paste the code.', '--open', 'claude://code/continue?session=local_ab12-cd34', '--key', 'ask-a1'])
  expect(played).toEqual([])
  // The same ask said again is neither shown nor heard again
  await ask('k2', 'Paste the code.')
  expect(own).toHaveLength(1)

  // Sound off in Config: the amber notification, silent, and no chime of the mod's
  files.set(`${MEMORY}/config.json`, JSON.stringify({ sound: false }))
  await ask('k3', 'Press Approve.')
  expect(lead(own.at(-1))).toEqual(['--asks'])
  expect(played).toEqual([])

  // Claudopus Asks turned off in System Settings: the purple Claudopus, which carries no sound, and the mod's own chime
  files.set(`${MEMORY}/config.json`, '{}')
  app.asks = 2
  await ask('k4', 'Type your password.')
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
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false }))
  const before = own.length
  await clock.advance(6_000)
  await ask('k5', 'Pick a name.')
  expect(own).toHaveLength(before)
  expect(played).toHaveLength(3)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ notifications: false, sound: false }))
  await clock.advance(6_000)
  await ask('k6', 'Pick a colour.')
  expect(own).toHaveLength(before)
  expect(played).toHaveLength(3)
})
