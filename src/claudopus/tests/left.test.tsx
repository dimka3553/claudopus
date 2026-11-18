// What a piece of work leaves running, however it started it, is a run under its card with what it is for, how far it is and the
// memory it holds, and leaves the card as it ends (on 15 Nov a launcher started with nohup but no `echo $!` drew 8 pages at once
// with 56 GB and its card showed no run at all)

// A process as `ps -axww -o pid=,ppid=,pgid=,stat=,etime=,rss=,command=` lists it, its memory in KB
const psLine = (pid: number, ppid: number, pgid: number, command: string, rssKb = 1_000_000, etime = '00:01') => `${pid} ${ppid} ${pgid} S ${etime} ${rssKb} ${command}`

// A world where the work's command is handed process numbers from 5000 to 5100 (the probe before it gets 5000, the one after 5100),
// and the test lays the processes on this Mac, which of them still run, and where each writes
const leftWorld = (on: On, procs: { list: string[]; logs: Record<string, string>; outputs?: Record<string, string>; owners?: Record<string, 'mine' | 'other' | 'hidden'> }) => {
  let pid = 4900
  const now = { at: 1_700_000_000_000 }
  // (the work is at a step of its own throughout, as the engine lists it: an ended run's word goes into its run)
  const w = world(on, {
    agents: { a1: 'running' },
    jobs: {
      output: file => procs.outputs?.[file] ?? '',
      wroteAt: () => now.at - 2_000,
      ps: () => procs.list.join('\n'),
      fd: () => Object.entries(procs.logs).map(([p, f]) => `${p} ${f}`).join('\n'),
      pid: () => String((pid += 100)),
      alive: p => procs.list.some(line => line.trim().startsWith(`${p} `)),
      owner: p => procs.owners?.[p] ?? 'mine',
    },
  })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now.at += ms), await w.clock.advance(ms))
  return { ...w, advance }
}
const leftTexts = async ($: Parameters<NonNullable<Parameters<typeof test>[2]>>[0], columns = 140) => {
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: columns }, surface: 'terminal' } as never)
  const all = [...(await list.findAll({ type: 'Text' })).map(one => one.text), ...(await list.findAll({ type: 'Button' })).map(one => String(one.props.label))]
  await list.unmount()
  return all
}
// How often the panel is drawn afresh, counted from the test's start (the engine takes hooks only before the session starts)
const countDraws = (on: On) => {
  const drawn = { count: 0 }
  on('ui.invalidate', (_, e, next) => ((drawn.count += 1), next(e)))
  return drawn
}
// Whether the panel is drawn afresh no more often over a minute in which the runs' memory moves by 200 MB at each look of the
// processes than over a minute in which it holds still
const panelDrawsWhile = async (drawn: { count: number }, advance: (ms: number) => Promise<void>, procs: { list: string[] }) => {
  const minute = async (isMoving: boolean) => {
    const from = drawn.count
    for (let n = 0; n < 4; n++) {
      if (isMoving) procs.list = procs.list.map(line => line.replace(/ S (\S+) (\d+) /, (_, etime, kb) => ` S ${etime} ${Number(kb) + 200_000} `))
      await advance(15_000)
    }
    return drawn.count - from
  }
  const still = await minute(false)
  const moving = await minute(true)
  return moving <= still
}
const leftStart = async ($: Parameters<NonNullable<Parameters<typeof test>[2]>>[0]) => {
  await $.session.start(start)
  await $.prompt.submit({ text: 'draw the pages', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Draw the pages', prompt: 'draw the pages' } as never)
}

test('a launcher that starts 8 drawings and exits leaves one run under its card in its own words, with how many programs, their progress and memory added up, and it leaves as they end (17 Nov: "Run Google Chrome ×4" named the program, not what the command was doing)', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs: {} as Record<string, string> }
  const leftCalls = leftWorld(on, procs)
  const { advance } = leftCalls
  await leftStart($)
  // The launcher's shell was 5050: its 8 children run on in its group once it has gone
  for (let k = 0; k < 8; k++) {
    procs.list.push(psLine(5060 + k, 1, 5050, `/u/.venvs/ct/bin/python fig4.py page PMC closed ${k}`, 7_000_000))
    procs.logs[String(5060 + k)] = `/s/figlog/page-${k}.log`
    procs.outputs[`/s/figlog/page-${k}.log`] = `progress: ${k}/16 eyes drawn (PMC closed ${k})\n`
  }
  // (held open, so its words give it no time: one said to take minutes is refused, to be sent in the background)
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l1', agentId: 'a1', command: 'cd /w && ~/.venvs/ct/bin/python launch.py 8', description: 'Run the drawing of all 25 pages, eight at a time' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the drawing of all 25 pages')) ? all : undefined
  })
  expect(shown?.filter(text => text.startsWith('Run the drawing of all 25 pages, eight at a time')).length).toBe(1)
  expect(shown?.some(text => text.includes('fig4.py'))).toBe(false)
  expect(shown?.some(text => /8 programs/.test(text))).toBe(true)
  expect(shown?.some(text => /\b8 commands\b/.test(text))).toBe(false)
  expect(shown?.some(text => /\d of 16 eyes/.test(text))).toBe(true)
  expect(shown?.some(text => text.includes('53.4 GB'))).toBe(true)
  // Half of them end first: nothing says the command has ended while the rest work, and its work is not woken
  const { appended } = leftCalls
  procs.list = procs.list.slice(4)
  await advance(20_000)
  expect(await until(async () => ((await leftTexts($)).some(text => /4 programs/.test(text)) || undefined))).toBe(true)
  expect((await leftTexts($)).some(text => /has ended|commands? ended/.test(text))).toBe(false)
  expect(appended.some(one => /has ended/.test(one))).toBe(false)
  // As the rest end, they leave, and the card counts them as the one command they were, its work told once
  procs.list = []
  await advance(20_000)
  // (the card's own line may name the command that ended, once, until the work writes again)
  expect(await until(async () => ((await leftTexts($)).every(text => !/8 programs/.test(text)) || undefined))).toBe(true)
  expect((await leftTexts($)).some(text => /1 command ended/.test(text))).toBe(true)
  expect((await leftTexts($)).some(text => /has ended, .* has ended|has ended and/.test(text))).toBe(false)
  expect(await until(async () => (appended.some(one => one.startsWith('a1: Your command "Run the drawing of all 25 pages, eight at a time" has ended')) || undefined))).toBe(true)
  expect(appended.filter(one => /has ended/.test(one)).length).toBe(1)
})

test('a shell loop that sends scripts off with & leaves them under the card as one run in its own words, which one Stop ends whole', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs: {} as Record<string, string> }
  const { advance, killed, appended } = leftWorld(on, procs)
  await leftStart($)
  for (let i = 0; i < 4; i++) {
    procs.list.push(psLine(5060 + i, 1, 5050, `/u/bin/python batch.py ${i} 12 /s/batch_${i}.json`))
    procs.logs[String(5060 + i)] = `/s/batch_${i}.log`
    procs.outputs[`/s/batch_${i}.log`] = 'progress: 81/91 eyes\n'
  }
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l2', agentId: 'a1', command: 'for i in 0 1 2 3; do nohup python batch.py $i 12 /s/batch_$i.json > /s/batch_$i.log 2>&1 & done; echo started', description: 'Run the new mesh on a third of the eyes (about 3 min)' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the new mesh on a third of the eyes')) ? all : undefined
  })
  expect(shown?.some(text => /81 of 91 eyes/.test(text))).toBe(true)
  expect(shown?.some(text => /4 programs/.test(text))).toBe(true)
  expect(shown?.some(text => text.includes('python batch.py'))).toBe(false)
  // Stop on its one row ends all four, and the card keeps them as the one command, stopped, its work told once
  const list = await $.ui.mount({ ...LIST, props: { ...LIST.props, bodyColumns: 140 }, surface: 'terminal' } as never)
  const stop = (await list.findAll({ type: 'Button' })).filter(b => b.props.label === 'Stop' && String(b.key ?? '').startsWith('stop-list-job-'))
  expect(stop.length).toBe(1)
  await list.press({ key: stop[0]?.key ?? '' })
  await list.unmount()
  expect(await until(async () => ([0, 1, 2, 3].every(i => killed.includes(String(5060 + i))) || undefined))).toBe(true)
  procs.list = []
  await advance(20_000)
  expect(await until(async () => ((await leftTexts($)).some(text => /1 command ended/.test(text)) || undefined))).toBe(true)
  expect(appended.filter(one => one.startsWith('a1: ') && /Run the new mesh/.test(one)).length).toBe(1)
})

test('a launcher started with nohup but no echo $! is a run under the card in the work\'s own words, read from its log', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs: {} as Record<string, string> }
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  // The launcher runs on, with xargs and its drawings under it
  procs.list.push(psLine(5060, 1, 5050, '/bin/zsh /s/figs.sh /s', 2_000), psLine(5061, 5060, 5050, 'xargs -P 8 -L 1 sh -c ...', 1_000), psLine(5062, 5061, 5050, '/u/bin/python fig4.py page PMC closed 0', 7_000_000))
  procs.logs['5060'] = '/s/figs.out'
  procs.outputs['/s/figs.out'] = 'progress: 3/25 pages drawn (page-PMC-closed-2)\n'
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l3', agentId: 'a1', command: 'S="/s"; rm -f "$S"/figlog/*.log; nohup "$S/figs.sh" "$S" > "$S/figs.out" 2>&1 &\nsleep 1; echo started', description: 'Run the drawing of all 25 picture pages again in the background, eight at a time (about 35 min, prints pages done of 25)' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the drawing of all 25 picture pages')) ? all : undefined
  })
  expect(shown?.some(text => /3 of 25 pages/.test(text))).toBe(true)
  expect(shown?.some(text => text.includes('6.7 GB'))).toBe(true)
})

test('xargs -P sending its output nowhere is a run that says it runs and gives no progress, with its memory', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string> }
  const drawn = countDraws(on)
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  procs.list.push(psLine(5060, 1, 5050, 'xargs -P 8 -n 1 /u/bin/python draw.py', 1_000), ...[0, 1, 2].map(k => psLine(5070 + k, 5060, 5050, `/u/bin/python draw.py ${k}`, 2_000_000)))
  procs.logs['5060'] = '/dev/null'
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l4', agentId: 'a1', command: 'ls jobs | xargs -P 8 -n 1 python draw.py > /dev/null 2>&1 &', description: 'Run every drawing eight at a time (about 10 min)' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => /GB memory$/.test(text)) ? all : undefined
  })
  expect(shown?.some(text => text.startsWith('Run every drawing eight at a time'))).toBe(true)
  expect(shown?.some(text => text.includes('5.7 GB'))).toBe(true)
  // Its memory moving at each look of the processes draws the panel afresh no more than when it holds still: it is shown
  // at the next drawing, so the panel keeps still under the pointer
  expect(await panelDrawsWhile(drawn, advance, procs)).toBe(true)
  // and the card shows the new figure once it is drawn again
  await advance(10_000)
  expect(await until(async () => ((await leftTexts($)).some(text => text.includes('8.8 GB')) || undefined))).toBe(true)
})

test('a command that only waits is stopped as it runs, whatever its words: when over a minute its processes did nothing but sleeps that come and go, and its work is told what wakes it instead; one that ever did work, as a retry or a script that sleeps between steps, runs on', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string> }
  const { advance, killed, appended } = leftWorld(on, procs)
  await leftStart($)
  // Words the check before it runs reads as work: a function of its own, defined in a script it runs
  await $.tool.call({ tool: 'Bash', tool_use_id: 'w1', agentId: 'a1', command: 'cd /w && nohup bash ./poll.sh > poll.log 2>&1 & echo $!', description: 'Run the poll for the sheets' } as never)
  const napping = (pid: number) => [psLine(48213, 1, 48213, 'bash ./poll.sh'), psLine(pid, 48213, 48213, 'sleep 8')]
  // Two looks of sleeping are not enough: a script may be between two steps
  for (const pid of [48300, 48311]) ((procs.list = napping(pid)), await advance(20_000))
  expect(killed).toEqual([])
  // Still only sleeping, a new sleep at each look, for over a minute: stopped, and the work told why
  for (const pid of [48322, 48333, 48344]) ((procs.list = napping(pid)), await advance(20_000))
  expect(await until(async () => killed.includes('48213') || undefined)).toBe(true)
  expect(await until(async () => appended.find(one => /^a1: Claudopus stopped your command "Run the poll for the sheets": all it did was wait/.test(one)))).toBeDefined()
  // A retry of real work, seen once at its work, is never stopped however long it sleeps between its tries
  killed.length = 0
  await $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'a1', command: 'cd /w && nohup bash ./copy.sh > copy.log 2>&1 & echo $!', description: 'Run the copy again until it goes through' } as never)
  procs.list = [psLine(48213, 1, 48213, 'bash ./copy.sh'), psLine(48400, 48213, 48213, 'rclone copy /a remote:')]
  await advance(20_000)
  for (let n = 0; n < 6; n++) ((procs.list = [psLine(48213, 1, 48213, 'bash ./copy.sh'), psLine(48410 + n, 48213, 48213, 'sleep 30')]), await advance(20_000))
  expect(killed).toEqual([])
})

test('a Python pool left running is one run with its workers\' memory added up', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs: {} as Record<string, string> }
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  procs.list.push(psLine(5060, 1, 5050, '/u/bin/python pool.py', 500_000), ...[0, 1, 2, 3].map(k => psLine(5070 + k, 5060, 5050, '/u/bin/python -c from multiprocessing.spawn import spawn_main', 1_000_000)))
  procs.logs['5060'] = '/w/pool.log'
  procs.outputs['/w/pool.log'] = 'progress: 10/40 tiles\n'
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l5', agentId: 'a1', command: 'cd /w && (python pool.py > pool.log 2>&1 &)', description: 'Run the tiles in a pool of four (about 5 min)' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the tiles in a pool of four')) ? all : undefined
  })
  expect(shown?.some(text => /10 of 40 tiles/.test(text))).toBe(true)
  expect(shown?.some(text => text.includes('4.3 GB'))).toBe(true)
  // one run, not one per worker
  expect(shown?.filter(text => text.startsWith('Run the tiles in a pool of four')).length).toBe(1)
})

test('a background command whose shell ends leaving its scripts running hands them to its card as runs, and the card never says commands have ended above them (16 Nov "2 commands have ended" over two still working)', SLOW, async ($, on) => {
  // (the launcher's own output says it exited once its shell has gone)
  let isLaunched = false
  const outputs = new Proxy({} as Record<string, string>, { get: (kept, file) => kept[String(file)] ?? (isLaunched && String(file).includes('l6') ? 'starting the renders\n[exited with code 0]\n' : undefined) })
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs }
  const { advance, appended } = leftWorld(on, procs)
  await leftStart($)
  await $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am building the scene before the renders.' } as never)
  // Two commands it left going end after that line, before it starts the renders
  procs.list.push(psLine(5060, 1, 5050, '/u/bin/python build_scene.py'))
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l0', agentId: 'a1', command: 'python build_scene.py &', description: 'Run a build of the scene' } as never)
  await advance(20_000)
  procs.list = [psLine(5260, 1, 5250, '/u/bin/python check_scene.py')]
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l1', agentId: 'a1', command: 'python check_scene.py &', description: 'Run a check of the scene' } as never)
  await advance(20_000)
  procs.list = []
  await advance(20_000)
  expect(await until(async () => appended.find(one => one.startsWith('a1: Your command "Run a check of the scene" has ended')))).toBeDefined()
  // While its shell runs, the background command is its own row; nothing is taken from it
  procs.list.push(psLine(5450, 900, 5450, "/bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval 'python launch.py 4' < /dev/null"), ...[0, 1].map(k => psLine(5460 + k, 5450, 5450, `/u/bin/python render.py ${k}`)))
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l6', agentId: 'a1', command: 'python launch.py 4', description: 'Run the renders (about 8 min)', run_in_background: true } as never)
  await advance(20_000)
  expect((await leftTexts($)).some(text => text.includes('python render.py'))).toBe(false)
  // Its shell ends; the renders run on
  procs.list = [0, 1].map(k => psLine(5460 + k, 1, 5450, `/u/bin/python render.py ${k}`))
  isLaunched = true
  for (const k of [0, 1]) ((procs.logs[String(5460 + k)] = `/w/r${k}.log`), (procs.outputs[`/w/r${k}.log`] = 'progress: 2/9 frames\n'))
  await advance(20_000)
  expect(await until(async () => ((await leftTexts($)).some(text => /2 programs/.test(text)) || undefined))).toBe(true)
  expect((await leftTexts($)).some(text => text.startsWith('Run the renders'))).toBe(true)
  // The launcher ends too (its card counts it with the two), but its renders still work: the card's line names the two that
  // really ended, how each ended, and never counts the launcher among them
  await advance(80_000)
  expect(await until(async () => ((await leftTexts($)).some(text => /3 commands ended/.test(text)) || undefined))).toBe(true)
  const shown = await leftTexts($)
  expect(shown.some(text => /2 programs/.test(text))).toBe(true)
  expect(shown).toContain('Run a build of the scene: ended · Run a check of the scene: ended')
  expect(shown.some(text => /commands have ended|Run the renders (has|have) /.test(text))).toBe(false)
})

test('a script that starts a session of its own while its command runs is still that command\'s run, even where its environment cannot be read; the system\'s own programs, and what another chat or app started at that moment, never are (17 Nov: a git push and a dig took headless Chrome\'s crash reporters as runs they left, "Run Google Chrome")', SLOW, async ($, on) => {
  // (another chat's headless browser: its crash reporter forks away from it, its group's leader gone, its number within the command's)
  const crashpad = '/u/.cache/puppeteer/chrome/mac_arm-148/chrome-mac-arm64/Google Chrome for Testing.app/Contents/Frameworks/Google Chrome for Testing Framework.framework/Helpers/chrome_crashpad_handler --monitor-self'
  const procs = { list: [] as string[], logs: {} as Record<string, string>, owners: { '5060': 'hidden', '5080': 'other' } as Record<string, 'mine' | 'other' | 'hidden'> }
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  procs.list.push(psLine(5060, 1, 5060, '/u/bin/python daemon.py --serve-tiles'), psLine(5070, 1, 5070, '/System/Library/CoreServices/mdworker_shared'), psLine(5080, 1, 5077, crashpad))
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l7', agentId: 'a1', command: 'python daemon.py --serve-tiles', description: 'Run the tile daemon' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the tile daemon')) ? all : undefined
  })
  expect(shown?.some(text => text.includes('mdworker'))).toBe(false)
  expect(shown?.some(text => /Chrome|crashpad|programs/.test(text))).toBe(false)
})

test('what another task of the same chat starts while its command runs in the background is never taken by a short command of another task beside it (17 Nov: a screenshot script sent to the background started headless Chrome while a git push ran, and the push\'s card showed its crash reporters)', SLOW, async ($, on) => {
  const crashpad = '/u/.cache/puppeteer/chrome/mac_arm-148/chrome-mac-arm64/Google Chrome for Testing.app/Contents/Frameworks/Google Chrome for Testing Framework.framework/Helpers/chrome_crashpad_handler --monitor-self'
  const procs = { list: [] as string[], logs: {} as Record<string, string> }
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  await $.agent.spawn({ ...spawn, description: 'Shoot the pictures', prompt: 'shoot the pictures' } as never)
  // The other task's script, sent to the background, is handed 5000 to 5100 as it goes there and runs on
  procs.list.push(psLine(5050, 900, 5050, "/bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval './run.sh old & ./run.sh new; wait; node shoot.mjs' < /dev/null"))
  await $.tool.call({ tool: 'Bash', tool_use_id: 's1', agentId: 'a2', command: './run.sh old & ./run.sh new; wait; node shoot.mjs', description: 'Run the screenshots of both sides (about 3 min)', run_in_background: true } as never)
  // Its headless browser's crash reporters fork away while this task's git push is handed 5200 to 5300, and carry this chat's session
  procs.list.push(psLine(5260, 1, 5250, crashpad, 30_000), psLine(5262, 1, 5251, crashpad, 30_000))
  await $.tool.call({ tool: 'Bash', tool_use_id: 'p1', agentId: 'a1', command: 'git push -q origin fix', description: 'Upload the fix' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the screenshots of both sides')) ? all : undefined
  })
  // (they are the other task's, whose command started them, a row named as what it started while it runs; never the push's)
  expect(shown?.some(text => /^Upload the fix|Chrome/.test(text))).toBe(false)
  expect(shown?.filter(text => text.startsWith('Run the screenshots of both sides')).length).toBe(1)
  expect(shown?.some(text => text.startsWith('What “Run the screenshots of both sides” started'))).toBe(true)
})

test('a task whose step ends while only a preview server it left going runs, its helper\'s result just passed on and to-dos still to do, is not done: it stays at work and is started again, and it is done only once it hands back its result (18 Nov: a site task\'s card showed done for half an hour, no result ever came)', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string> }
  let pid = 4900
  const now = { at: 1_700_000_000_000 }
  const agents: Record<string, string> = { a1: 'running' }
  const kinds: Record<string, string> = {}
  const PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' }
  const QUIET = { role: 'assistant', content: [{ type: 'text', text: '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>' }] }
  const talk: unknown[] = []
  const pressedAfter = (words: string) => talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: words }] }, PRESS, QUIET, PRESS, QUIET, PRESS, QUIET)
  const w = world(on, {
    agents,
    talk,
    kinds,
    jobs: {
      output: () => '',
      wroteAt: () => now.at - 2_000,
      ps: () => procs.list.join('\n'),
      fd: () => '',
      pid: () => String((pid += 100)),
      alive: p => procs.list.some(line => line.trim().startsWith(`${p} `)),
      owner: () => 'mine',
    },
  })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  const advance = async (ms: number) => ((now.at += ms), await w.clock.advance(ms))
  const { resumed, notified, stepped } = w
  await $.session.start(start)
  await $.prompt.submit({ text: 'build and deploy the site', wait: false, origin: composer })
  await $.agent.spawn({ ...spawn, description: 'Build and deploy the site', prompt: 'build it' } as never)
  kinds.a1 = 'general-purpose'
  const call = (tool: string, id: string, input: Record<string, unknown> = {}) => $.tool.call({ tool, tool_use_id: id, agentId: 'a1', ...input } as never)
  const ends = async (id: string, answer: string, turn: string) => $.turn.complete({ answer, durationMs: 1, isAborted: false, turnId: turn, reason: 'answer', agentId: id } as never)
  const card = async () => {
    const pane = await $.ui.mount({ ...LIST, surface: 'desktop' } as never)
    const texts = (await pane.findAll({ type: 'Text' })).map(one => one.text ?? '')
    await pane.unmount()
    return texts
  }
  for (const [n, item] of ['Find where the site is hosted', 'Say whether its domain takes email', 'Put a first page live', 'Build the full page'].entries()) await call('mcp__claudopus__todo', `t${n}`, { item, state: 'done' })
  await call('mcp__claudopus__todo', 't5', { item: 'Have a second Claude check the page, then put it live', state: 'doing' })
  // Its command builds the page, leaves a preview server going in its group, and takes pictures of it
  procs.list.push(psLine(5060, 1, 5050, 'node /repo/node_modules/.bin/vite preview --port 4174'))
  await call('Bash', 'b1', { command: 'npm run build && (npx vite preview --port 4174 >/dev/null 2>&1 &) && node shot.mjs http://localhost:4174 desktop.png', description: 'Run build of the full page and capture desktop and phone pictures' })
  await advance(20_000)
  expect(await until(async () => ((await leftTexts($)).some(text => text.startsWith('Run build of the full page')) || undefined))).toBe(true)
  // It starts a second look and ends its step to wait for it, pressed for its report
  await $.agent.spawn({ ...spawn, description: 'Check the page', prompt: 'check it', parentAgentId: 'a1' } as never)
  kinds.a2 = 'general-purpose'
  agents.a2 = 'running'
  agents.a1 = 'completed'
  pressedAfter("Waiting for the second Claude's findings.")
  await ends('a1', "Waiting for the second Claude's findings.", 'w1')
  await advance(6_000)
  // The helper hands back and ends: Claudopus passes its result on to the task, which takes it in a step of its own, misreads it as
  // still to come and ends its step again, pressed for its report three times, with only the server running
  agents.a2 = 'completed'
  await $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'a2', message: 'I found 1 serious fault: the 3D covers the headline at tablet width.' } as never)
  await ends('a2', '', 'h1')
  expect(await until(async () => resumed.find(line => line.startsWith('a1: From Claudopus: your helper "Check the page"')))).toBeDefined()
  agents.a1 = 'running'
  for await (const _ of $.turn.step({ turnId: 'w2', index: 0, model: 'm', messageCount: 1, agentId: 'a1' })) void _
  pressedAfter("Waiting for the checker's report, which is due in the next message.")
  // Claude Code presses it for its report: with only a server of its own running, nothing would start it again, so the press goes
  // to Claude (before, Claudopus answered it itself, telling it to end its step and wait)
  talk.splice(2)
  const sent = stepped.length
  for await (const _ of $.turn.step({ turnId: 'w2', index: 1, model: 'm', messageCount: 3, agentId: 'a1' })) void _
  expect(stepped.length).toBe(sent + 1)
  pressedAfter("Waiting for the checker's report, which is due in the next message.")
  agents.a1 = 'completed'
  await ends('a1', "Waiting for the checker's report, which is due in the next message.", 'w2')
  await advance(6_000)
  // Not done, no ready note, no result: its card stays at work, and Claudopus starts it again to carry on
  expect((await card()).some(text => text === '✓ Done' || /^Done · /.test(text))).toBe(false)
  expect(notified).toEqual([])
  expect(resumed.filter(line => line.startsWith('a1: From Claudopus, not ') && line.includes('Carry on from where you were'))).toHaveLength(1)
  // Started again, it runs a command, and its run ends again without its result where Claudopus hears no end of its turn, only the
  // engine listing it as over: still not done, and started again once more
  agents.a1 = 'running'
  await call('Bash', 'b2', { command: 'git status', description: 'Run a look at what is committed' })
  agents.a1 = 'completed'
  await advance(25_000)
  await advance(6_000)
  expect((await card()).some(text => text === '✓ Done' || /^Done · /.test(text))).toBe(false)
  expect(notified).toEqual([])
  expect(resumed.filter(line => line.startsWith('a1: From Claudopus, not ') && line.includes('Carry on from where you were'))).toHaveLength(2)
  // It does the rest and hands back its result: only now is it done
  agents.a1 = 'running'
  await call('mcp__claudopus__todo', 't6', { item: 'Have a second Claude check the page, then put it live', state: 'done' })
  await call('SubagentHandback', 'hb1', { message: 'The full page is live, checked by a second Claude.' })
  agents.a1 = 'completed'
  await ends('a1', '', 'w3')
  expect(await until(async () => ((await card()).includes('✓ Done') || undefined))).toBe(true)
  await advance(2_000)
  expect(notified.map(line => line.split(' | ')[1])).toEqual(['The full page is live, checked by a second Claude.'])
})
