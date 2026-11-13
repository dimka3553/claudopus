// The chat: its role, handing work over, keys and pastes, names, the mod's tools, compaction, after a reply, the principles

test('a chat gets its role once, is told to start a fresh agent from a brief for every message, and every message is saved', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)

  const first = await $.prompt.submit({ text: 'fix the upload page', wait: false, origin: composer })
  expect(first.context?.join('\n')).toContain('CHAT ROLE')
  expect(first.context?.join('\n')).toContain('Subjects so far')
  expect(first.context?.join('\n')).toContain(`This chat's saved words: ${MEMORY}/words/engine-id.md`)
  expect(first.context?.join('\n')).toContain('start a fresh agent')
  expect(first.context?.join('\n')).toContain('Only a message that steers what listed work is already doing')
  expect(first.context?.join('\n')).toContain('A fault, a question or a new ask gets its own agent')

  // One sent while the chat is mid-turn is its own piece of work too
  const second = await $.prompt.submit({ text: 'and the nose', wait: false, origin: composer, turnId: 'turn-1' })
  expect(second.context?.length).toBe(1)
  expect(second.context?.[0]).toContain('start a fresh agent')

  const words = files.get(`${MEMORY}/words/engine-id.md`) ?? ''
  expect(words).toContain('fix the upload page')
  expect(words).toContain('and the nose')
})

test('work never starts as a copy of the chat: a fork or an agent with no model is refused, and a brief gets the rules for the work', async ($, on) => {
  const { files } = world(on, { tokens: 400_000 })
  await $.session.start(start)

  const r = await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  expect(r.context?.join('\n')).not.toContain('fork')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a1', prompt: 'fix the nose', subagent_type: 'fork' } as never)).deny).toContain('never started as a copy')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a2', prompt: 'fix the nose', subagent_type: 'general-purpose' } as never)).deny).toContain('the model named')
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'a3', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' } as never)).deny).toBeUndefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused an Agent call that copies the chat')

  // The brief reaches the work with the rules for every piece of work and the path of the chat's saved words after it
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]?.startsWith('BRIEF')).toBe(true)
  expect(prompts[0]).toContain('WORK ROLE')
  expect(prompts[0]).toContain(`${MEMORY}/words/engine-id.md`)
})

test('no agent is started on an older model or on Haiku, by the chat or by a piece of work; the three aliases and their newest versions pass', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  const call = (model: string, agentId?: string) => $.tool.call({ tool: 'Agent', tool_use_id: `m-${model}-${agentId ?? ''}`, prompt: 'fix the nose', subagent_type: 'general-purpose', model, ...(agentId ? { agentId } : {}) } as never)

  // A newer version than the mod knows is no older model; nor is an id with a date, a window or a provider around it
  for (const model of ['opus', 'sonnet', 'fable', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2', 'claude-opus-5.5', 'claude-opus-5-6', 'claude-opus-6', 'claude-fable-5-3', 'claude-sonnet-6', 'claude-opus-5-5-20261001', 'opus[1m]', 'us.anthropic.claude-opus-5-5-v1:0', 'inherit']) expect((await call(model)).deny).toBeUndefined()
  for (const model of ['haiku', 'claude-haiku-5-5', 'claude-opus-4-8', 'claude-opus-5', 'claude-sonnet-5', 'claude-fable-5-1', 'claude-3-5-sonnet-20241022', 'claude-sonnet-4-5-20250929']) expect((await call(model)).deny).toContain('No work runs on')
  expect((await call('claude-opus-4-8')).deny).toBe(
    'No work runs on Opus 4.8. Name the model by its alias: "opus" for most work, "sonnet" for long legwork, "fable" only for heavy or really complicated work, "opus" or "fable" for checking what was built, never weaker than what built it. Never an older version, never Haiku.',
  )
  // A helper a piece of work starts is held to the same, and one that names no model keeps its work's
  expect((await call('haiku', 'a1')).deny).toContain('No work runs on Haiku')
  expect((await call('claude-opus-4-8', 'a1')).deny).toContain('No work runs on Opus 4.8')
  expect((await call('sonnet', 'a1')).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'h0', prompt: 'look it up', subagent_type: 'general-purpose', agentId: 'a1' } as never)).deny).toBeUndefined()
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused an Agent call on Opus 4.8')
})

test('with Haiku named in the settings for a kind of work, an agent on Haiku is let through; an older model still is not', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ models: { legwork: 'haiku' } }))
  await $.session.start(start)
  await $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'c1', prompt: 'index', subagent_type: 'general-purpose', model: 'haiku' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'c2', prompt: 'index', subagent_type: 'general-purpose', model: 'claude-opus-4-8' } as never)).deny).toContain('No work runs on Opus 4.8')
})

test('with the handing-over switched off the mod refuses no model and moves no step', async ($, on) => {
  const { files, stepped } = world(on)
  files.set(`${MEMORY}/config.json`, JSON.stringify({ agents: false }))
  await $.session.start(start)
  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 'o1', prompt: 'index', subagent_type: 'general-purpose', model: 'haiku' } as never)).deny).toBeUndefined()
  for await (const _ of $.turn.step({ turnId: 't', index: 0, model: 'claude-opus-4-8', messageCount: 2, agentId: 'a1' })) void _
  expect(stepped).toEqual(['claude-opus-4-8'])
})

test("the work's rules name where the admin runner is, the one way work uses a Mac's password", async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'clear the disk', wait: false, origin: composer })

  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]).toMatch(/an admin command runs through `\/\S*mods\/claudopus\/bin\/admin`/)
  expect(prompts[0]).not.toContain('{admin}')
})

test('work uses a kept key without reading it: the keychain is not read, and what a tool answers comes back with the key hidden', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]).toMatch(/\/\S*mods\/claudopus\/bin\/secret NAME/)
  expect(prompts[0]).not.toContain('{secret}')

  const read = await $.tool.call({ tool: 'Bash', tool_use_id: 'k1', command: 'security find-generic-password -s claudopus-secret -a API_KEY -w', agentId: 'w1' } as never)
  expect(read.deny).toContain('never read or printed')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k2', command: 'security dump-keychain -d', agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k5', command: 'security find-generic-password -wa API_KEY', agentId: 'w1' } as never)).deny).toContain('never read')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k6', command: 'CLAUDOPUS_SECRET_SERVICE=other bin/secret API_KEY here "env"', agentId: 'w1' } as never)).deny).toContain('never read')
  // A command that only lists what the keychain holds, with no value, runs
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'k7', command: 'security find-generic-password -s claudopus-secret -a API_KEY', agentId: 'w1' } as never)).deny).toBeUndefined()

  // Nothing kept: what the tool answers passes as it was
  expect(JSON.stringify((await $.tool.call({ tool: 'Bash', tool_use_id: 'k3', command: 'echo $API_KEY', agentId: 'w1' } as never)).result)).toContain('token is none')
  files.set('keychain:API_KEY', 'sk-live-123456')
  const shown = await $.tool.call({ tool: 'Bash', tool_use_id: 'k4', command: 'bin/secret API_KEY here "echo $API_KEY"', agentId: 'w1' } as never)
  expect(JSON.stringify(shown.result)).toContain('token is [hidden API_KEY]')
  expect(JSON.stringify(shown.result)).not.toContain('sk-live-123456')
})

test('work reaches main only through the release runner: its rules name it, and a push or merge to main by hand is refused', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'ship it', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, model: 'opus', prompt: 'BRIEF' } as never)
  expect(prompts[0]).toMatch(/main is reached through `\/\S*mods\/claudopus\/bin\/release`/)
  expect(prompts[0]).not.toContain('{release}')

  const refused = [
    'git push origin main',
    'cd /repo && git push -q origin HEAD:main',
    'git -C /repo push origin +main',
    'git push origin work:refs/heads/master',
    'git push --force origin main; echo done',
    'gh pr merge 12 --squash',
    'git push origin "main"',
    "git push -u origin HEAD:'main'",
    'git push --no-verify origin work/one',
    'RELEASE_PUSH=1 git push origin HEAD',
    'gh api -X PUT repos/me/it/pulls/3/merge',
    'echo hi && git -c user.name=x push origin main',
    'sudo git push origin main',
    'env FOO=1 git push origin main',
    "bash -c 'git push origin main'",
    'git push --repo=origin main',
  ]
  for (const [i, command] of refused.entries()) {
    const r = await $.tool.call({ tool: 'Bash', tool_use_id: `p${i}`, command, agentId: 'w1' } as never)
    expect(r.deny).toContain('never pushes or merges to main itself')
    expect(r.deny).toMatch(/bin\/release\.$/)
  }
  const allowed = ['git push origin work/one', 'git push -u origin main-menu-fix', 'git pull origin main', 'git merge origin/main', 'git log origin/main', 'git checkout main', 'git commit -qam "git push of main across Macs, merges onto main"', 'echo "never git push origin main"', 'git push', 'grep -n RELEASE_PUSH= bin/release']
  for (const [i, command] of allowed.entries()) {
    expect((await $.tool.call({ tool: 'Bash', tool_use_id: `a${i}`, command, agentId: 'w1' } as never)).deny).toBeUndefined()
  }
})

test('a large paste is saved to a file and left out of the chat', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  const paste = `start ${'x'.repeat(20_000)} end`

  const r = await $.prompt.submit({ text: paste, wait: false, origin: composer })
  expect(r.text?.length ?? 0).toBeLessThan(2000)
  expect(r.text).toContain('were saved to')
  const saved = [...files.entries()].find(([path]) => path.startsWith(`${MEMORY}/pastes/`))
  expect(saved?.[1]).toBe(paste)
})

test("a chat's own thread may only start agents and talk to them; an agent may do the work", async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })

  const refused = await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' } as never)
  expect(refused.deny).toContain('Start a fresh agent')
  expect(files.get(`${MEMORY}/log.md`)).toContain('refused Bash')

  expect((await $.tool.call({ tool: 'Agent', tool_use_id: 't2', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', tool_use_id: 't3', recap: 'r' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't4', command: 'ls', agentId: 'fork-1' } as never)).deny).toBeUndefined()
})

test('a session the person has not typed into does its own work', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'Run the nightly check.', wait: false, origin: { kind: 'peer' } as never })

  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' } as never)).deny).toBeUndefined()
})

test('config.json can switch the handing-over off', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/config.json`, '{"agents": false}')
  await $.session.start(start)

  const r = await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  expect(r.context ?? []).toEqual([])
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' } as never)).deny).toBeUndefined()
})

test('config.json names the person the work is for; without a name the texts say the person', async ($, on) => {
  const { files } = world(on)
  files.set(`${MEMORY}/config.json`, '{"name": "Sam"}')
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  expect(prompts[0]).toContain('started from a chat for Sam, the person you work for.')
  expect(prompts[0]).toContain('Sam follows this work in a panel')
  expect(prompts[0]).toContain("Sam's messages word for word")
  expect(prompts[0]).not.toMatch(/the person(?! you work for)/i)
})

test('without a name in config.json the work is told of the person', async ($, on) => {
  world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, prompt: 'fix the nose' } as never)
  expect(prompts[0]).toContain('started from a chat for the person you work for.')
  expect(prompts[0]).toContain('The person follows this work in a panel')
})

test('the update tool records a subject and rewrites its brief', async ($, on) => {
  const { files } = world(on)
  await $.session.start(start)

  await $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 't1', name: '3D heads', repo: '/sandbox', summary: 'Fix the nose' } as never)
  await $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 't2', name: '3d heads', state: 'done: pushed', brief: 'Nose fixed.' } as never)

  expect(files.get(`${MEMORY}/index.md`)).toContain('- 3D heads | /sandbox |  | done: pushed | Fix the nose')
  expect(files.get(`${MEMORY}/streams/3d-heads.md`)).toBe('Nose fixed.\n')
})

test('recall returns matching lines without the folder prefix', async ($, on) => {
  world(on)
  await $.session.start(start)

  const r = await $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'nose' } as never)
  expect(String(r.result)).toContain('words/local_1.md:2:the nose is flawed')
})

test('rarely used tools wait behind tool search', async ($, on) => {
  world(on)
  const provider = { plugin: 'engine', tier: 'core' } as never

  expect((await $.tool.describe({ tool: 'Workflow', description: 'd', provider })).isDeferred).toBe(true)
  expect((await $.tool.describe({ tool: 'mcp__visualize__show_widget', description: 'd', provider })).isDeferred).toBe(true)
  expect((await $.tool.describe({ tool: 'Read', description: 'd', provider })).isDeferred).toBeUndefined()
})

test('a compaction is told what to keep, and the chat gets its role again after it', async ($, on) => {
  const { compacts } = world(on)
  await $.session.start(start)
  await $.prompt.submit({ text: 'one', wait: false, origin: composer })

  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'one', toolUses: [] }] as never })
  expect(compacts[0]).toContain('Keep every ask')
  expect(compacts[0]).toContain('each background agent')

  const after = await $.prompt.submit({ text: 'two', wait: false, origin: composer })
  expect(after.context?.join('\n')).toContain('CHAT ROLE')
})

test('after a reply the answer is saved, the asks and what was done are logged, and the chat is renamed when its work changed', async ($, on) => {
  const { files, titles, clock } = world(on, { reply: '- fix the upload page\n- also look at the nose\ndid: moved the upload button above the fold\ntitle: Upload page fix' })
  await $.session.start(start)
  await $.prompt.submit({ text: 'fix the upload page, also look at the nose', wait: false, origin: composer })

  await $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })
  await clock.advance(10)

  const asks = files.get(`${MEMORY}/asks/engine-id.md`) ?? ''
  expect(asks).toContain('- fix the upload page')
  expect(asks).toContain('- also look at the nose')
  expect(asks).toContain('did: moved the upload button above the fold')
  expect(files.get(`${MEMORY}/words/engine-id.md`)).toContain('### Claude ')
  expect(files.get(`${MEMORY}/words/engine-id.md`)).toContain('Done.')
  expect(titles).toEqual(['Upload page fix'])
})

test('every conversation carries the principles the mod ships, word for word and once, even where the same text was loaded from elsewhere', async ($, on) => {
  world(on)
  // The engine beneath answers what it was handed
  on('prompt.context', (_, e) => ({ blocks: e.blocks, instructionFiles: e.instructionFiles }))
  await $.session.start(start)
  const home ={ path: `${HOME}/.claude/CLAUDE.md`, kind: 'user', content: PRINCIPLES } as const
  const repo = { path: '/repo/CLAUDE.md', kind: 'project', content: 'REPO RULES' } as const
  const managed = { path: '/etc/claude/CLAUDE.md', kind: 'managed', content: 'ORG RULES' } as const
  const told = await $.prompt.context({ blocks: [{ name: 'claudeMd', text: 'files' }], instructionFiles: [managed, home, repo] })
  expect(told.instructionFiles?.map(one => [one.kind, one.path.endsWith('/rules/CLAUDE.md') ? 'mod' : one.path])).toEqual([['managed', managed.path], ['user', 'mod'], ['project', repo.path]])
  expect(told.instructionFiles?.find(one => one.kind === 'user')?.content).toBe(PRINCIPLES)
  // A machine with no instruction file of its own gets them from the mod alone
  const fresh = await $.prompt.context({ blocks: [], instructionFiles: [] })
  expect(fresh.instructionFiles?.map(one => [one.kind, one.content])).toEqual([['user', PRINCIPLES]])
  expect(told.instructionFiles?.some(one => one.content.includes('device code'))).toBe(false)
})

test('a chat the app runs on another Mac over ssh tells every conversation that what needs the person is done from their own device', async ($, on) => {
  world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } })
  on('prompt.context', (_, e) => ({ blocks: e.blocks, instructionFiles: e.instructionFiles }))
  await $.session.start(start)
  const home = { path: `${HOME}/.claude/CLAUDE.md`, kind: 'user', content: PRINCIPLES } as const
  const told = await $.prompt.context({ blocks: [], instructionFiles: [home] })
  // The same principles loaded from elsewhere are still sent once, now ending with the rule for working from afar
  expect(told.instructionFiles?.length).toBe(1)
  const ours = told.instructionFiles?.[0]?.content ?? ''
  expect(ours.startsWith(PRINCIPLES.trimEnd())).toBe(true)
  expect(ours).toContain('## This chat runs on another Mac')
  expect(ours).toContain('a sign-in by device code or a link that works opened on my device, never a browser, window, dialog or keychain prompt on this Mac')
  expect(ours).not.toContain('{name}')
  // A second copy of the mod that already added them, rule and all, does not make them go out twice
  const twice = await $.prompt.context({ blocks: [], instructionFiles: [{ path: '/other/copy/rules/CLAUDE.md', kind: 'user', content: ours }] })
  expect(twice.instructionFiles?.length).toBe(1)
})
