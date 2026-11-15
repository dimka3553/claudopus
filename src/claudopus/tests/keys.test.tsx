// The keys remembered: names and stores only, made again from the stores, shown by the Keys button, and an ask for a kept key refused

// Made-up keys, as a person would have given them, in each store
const keysLaid = (files: Map<string, string>) => {
  files.set('secret:ELEVENLABS_API_KEY', 'el-made-up-value-0001')
  files.set('secret:KAGGLE_KEY', 'kg-made-up-value-0002')
  files.set('keychain-entry:elevenlabs-api\tsam', '')
  // An app's own storage is not a key someone gave
  files.set('keychain-entry:Chrome Safe Storage\tChrome', '')
  // An account named by what is in fact a kept value, as a slip could leave it: hidden in the list like any other
  files.set('keychain-entry:other-api\tkg-made-up-value-0002', '')
  files.set(`${MEMORY}/index.md`, '# Streams\n\nname | repo | session | state | summary\n\n- Render | /repo/render |  | going | Renders\n')
  files.set('/repo/render/.env.local', 'export OPENAI_API_KEY=env-made-up-value-0003\nVOICE_ID=abc\nDB_PASSWORD = env-made-up-value-0004\n')
  files.set('/repo/render/.env.example', 'EXAMPLE_TOKEN=x\n')
  files.set('sbos:secrets', JSON.stringify([
    { name: 'elevenlabs-key', label: 'ElevenLabs API key', put_in: false, value: 'sbos-made-up-value-0005' },
    { name: 'github-token', label: 'GitHub read-only token', put_in: true, secret: 'sbos-made-up-value-0006' },
  ]))
}
const VALUES = ['el-made-up-value-0001', 'kg-made-up-value-0002', 'env-made-up-value-0003', 'env-made-up-value-0004', 'sbos-made-up-value-0005', 'sbos-made-up-value-0006']

test('the list of keys holds every store\'s names and never a value, and the Keys button shows it in a tab', SLOW, async ($, on) => {
  const { files, tabs, logged } = world(on)
  keysLaid(files)
  await $.session.start(start)
  // SBOS's list, as a piece of work reads it, is taken in
  await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' } as never)
  const pane = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 80 }, surface: 'desktop' } as never)
  expect((await keyed(pane, 'keys-open'))?.props.label).toBe('Keys')
  await pressed(pane, 'keys-open')
  const opened = await until(async () => tabs.find(tab => /^memory-keys-md-\d+: Keys$/.test(tab)))
  expect(opened).toBeDefined()
  const tab = await $.ui.mount({ ...LIST, requestId: (opened ?? '').split(':')[0], surface: 'desktop' } as never)
  const shown = String((await tab.find({ type: 'Markdown' }))?.props.text)
  for (const name of ['ELEVENLABS_API_KEY', 'KAGGLE_KEY', "Claudopus's keychain", 'elevenlabs-api / sam', 'OPENAI_API_KEY', 'DB_PASSWORD', '/repo/render/.env.local', 'elevenlabs-key', 'asked, not given', 'github-token', 'SBOS secrets'])
    expect(shown).toContain(name)
  // Not a key: an app's own storage, a variable that holds none, and an example file
  for (const name of ['Chrome', 'VOICE_ID', 'EXAMPLE_TOKEN']) expect(shown).not.toContain(name)
  // No value anywhere: the list, its state, the log, what the work was told
  const everything = [...files].filter(([key]) => key.startsWith(MEMORY)).map(([key, text]) => `${key}\n${text}`).join('\n') + logged.join('\n')
  for (const value of VALUES) expect(everything).not.toContain(value)
  expect(files.get(`${MEMORY}/keys.md`)).toContain('[hidden KAGGLE_KEY]')
})

test('a key taken out of a store goes from the list, and nothing is written when the list cannot be checked for kept values', async ($, on) => {
  const { files } = world(on)
  keysLaid(files)
  await $.session.start(start)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'w1', command: '/plug/bin/secret KAGGLE_KEY here true' } as never)
  expect(files.get(`${MEMORY}/keys.md`)).toContain('KAGGLE_KEY')
  files.delete('secret:KAGGLE_KEY')
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b2', agentId: 'w1', command: '/plug/bin/secret KAGGLE_KEY --forget' } as never)
  expect(files.get(`${MEMORY}/keys.md`)).not.toContain('| KAGGLE_KEY |')
  expect(files.get(`${MEMORY}/keys.md`)).toContain('ELEVENLABS_API_KEY')
  // SBOS's next list drops what it no longer holds
  await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' } as never)
  expect(files.get(`${MEMORY}/keys.md`)).toContain('github-token')
  files.set('sbos:secrets', '[]')
  await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's2', agentId: 'w1' } as never)
  expect(files.get(`${MEMORY}/keys.md`)).not.toContain('github-token')
  // A hiding that fails leaves the list as it was
  const before = files.get(`${MEMORY}/keys.md`)
  files.set('secret:refused', 'yes')
  files.set('secret:NEW_TOKEN', 'new-made-up-value-0007')
  await $.tool.call({ tool: 'Bash', tool_use_id: 'b3', agentId: 'w1', command: '/plug/bin/secret NEW_TOKEN here true' } as never)
  expect(files.get(`${MEMORY}/keys.md`)).toBe(before)
})

test('an ask for a key the list has is refused with where it is; a key not kept is asked for', async ($, on) => {
  const { files } = world(on)
  keysLaid(files)
  await $.session.start(start)
  await $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' } as never)
  // SBOS asked for a key Claudopus's keychain keeps under another name: the ElevenLabs ask of 15 Nov
  const sbos = await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'a1', agentId: 'w1', name: 'elevenlabs-key', label: 'ElevenLabs API key' } as never)
  expect(sbos.deny).toContain('ELEVENLABS_API_KEY')
  expect(sbos.deny).toContain("Claudopus's keychain")
  expect(sbos.deny).toMatch(/bin\/secret ELEVENLABS_API_KEY here/)
  // one SBOS has put in already
  expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'a2', agentId: 'w1', name: 'github-token', label: 'GitHub' } as never)).deny).toContain('SBOS secrets')
  // The panel's ask for one
  expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'a3', agentId: 'w1', text: 'Paste your ElevenLabs API key', details: 'For the transcripts.' } as never)).deny).toContain('ELEVENLABS_API_KEY')
  expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'a4', agentId: 'w1', text: 'Paste KAGGLE_KEY in the box' } as never)).deny).toContain('KAGGLE_KEY')
  // The secret runner under a name it does not keep, or asked to take a kept one in again
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'a5', agentId: 'w1', command: "/plug/bin/secret ELEVENLABS_KEY here 'curl x'" } as never)).deny).toContain('ELEVENLABS_API_KEY')
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'a6', agentId: 'w1', command: '/plug/bin/secret ELEVENLABS_API_KEY --add' } as never)).deny).toMatch(/--forget/)
  // What is fine: the kept name used, a key not kept, an ask that is not for a key, and SBOS's own agents' keys
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'f1', agentId: 'w1', command: "/plug/bin/secret ELEVENLABS_API_KEY here 'curl x'" } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'f2', agentId: 'w1', name: 'stripe-customers-key', label: 'Stripe' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'f3', agentId: 'w1', text: 'Paste your Stripe key', details: 'x' } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'f4', agentId: 'w1', text: 'Release the list of keys?', details: 'It lists ElevenLabs and Kaggle.', choices: ['Release it', 'Not now'] } as never)).deny).toBeUndefined()
  expect((await $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'f5', agentId: 'w1', name: 'elevenlabs-key', label: 'x', agent: 'bot' } as never)).deny).toBeUndefined()
  // An ask made leaves its name in the list as asked, not given
  expect(files.get(`${MEMORY}/keys.md`)).toMatch(/\| stripe-customers-key \|[^\n]*asked, not given/)
})

test('work never writes the list of keys itself, by any tool', async ($, on) => {
  world(on)
  await $.session.start(start)
  expect((await $.tool.call({ tool: 'Write', tool_use_id: 'w1', agentId: 'w1', file_path: `${MEMORY}/keys.md`, content: 'X' } as never)).deny).toBeDefined()
  expect((await $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'w1', command: 'echo x > ~/.claude/claudopus/keys.json' } as never)).deny).toBeDefined()
})
