// What a piece of work leaves running, however it started it, is a run under its card with what it is for, how far it is and the
// memory it holds, and leaves the card as it ends (on 15 Nov a launcher started with nohup but no `echo $!` drew 8 pages at once
// with 56 GB and its card showed no run at all)

// A process as `ps -axww -o pid=,ppid=,pgid=,stat=,etime=,rss=,command=` lists it, its memory in KB
const psLine = (pid: number, ppid: number, pgid: number, command: string, rssKb = 1_000_000, etime = '00:01') => `${pid} ${ppid} ${pgid} S ${etime} ${rssKb} ${command}`

// A world where the work's command is handed process numbers from 5000 to 5100 (the probe before it gets 5000, the one after 5100),
// and the test lays the processes on this Mac, which of them still run, and where each writes
const leftWorld = (on: On, procs: { list: string[]; logs: Record<string, string>; outputs?: Record<string, string> }) => {
  let pid = 4900
  const now = { at: 1_700_000_000_000 }
  const w = world(on, {
    jobs: {
      output: file => procs.outputs?.[file] ?? '',
      wroteAt: () => now.at - 2_000,
      ps: () => procs.list.join('\n'),
      fd: () => Object.entries(procs.logs).map(([p, f]) => `${p} ${f}`).join('\n'),
      pid: () => String((pid += 100)),
      alive: p => procs.list.some(line => line.trim().startsWith(`${p} `)),
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

test('a launcher that starts 8 drawings and exits leaves 8 runs under its card, each with its progress and memory, and each leaves as it ends', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs: {} as Record<string, string> }
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  // The launcher's shell was 5050: its 8 children run on in its group once it has gone
  for (let k = 0; k < 8; k++) {
    procs.list.push(psLine(5060 + k, 1, 5050, `/u/.venvs/ct/bin/python fig4.py page PMC closed ${k}`, 7_000_000))
    procs.logs[String(5060 + k)] = `/s/figlog/page-${k}.log`
    procs.outputs[`/s/figlog/page-${k}.log`] = `progress: ${k}/16 eyes drawn (PMC closed ${k})\n`
  }
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l1', agentId: 'a1', command: 'cd /w && ~/.venvs/ct/bin/python launch.py 8', description: 'Run the drawing of all 25 pages, eight at a time (about 20 min)' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.includes('python fig4.py page PMC')) ? all : undefined
  })
  expect(shown?.some(text => /^Run python fig4\.py page PMC closed \d/.test(text))).toBe(true)
  expect(shown?.some(text => /\d of 16 eyes/.test(text))).toBe(true)
  expect(shown?.some(text => text.includes('6.7 GB'))).toBe(true)
  // As they end, they leave, and the card counts them as ended
  procs.list = []
  await advance(20_000)
  // (the card's own line may name the commands of it that ended, until the work writes again)
  expect(await until(async () => ((await leftTexts($)).every(text => !text.includes('fig4.py page') || / (has|more) ended$/.test(text)) || undefined))).toBe(true)
  expect((await leftTexts($)).some(text => /8 commands ended/.test(text))).toBe(true)
})

test('a shell loop that sends scripts off with & leaves its runs under the card', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string>, outputs: {} as Record<string, string> }
  const { advance } = leftWorld(on, procs)
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
    return all.some(text => text.includes('python batch.py')) ? all : undefined
  })
  expect(shown?.some(text => /81 of 91 eyes/.test(text))).toBe(true)
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
  expect(await until(async () => ((await leftTexts($)).some(text => /^Run python render\.py [01]/.test(text)) || undefined))).toBe(true)
  // The launcher ends too (its card counts it with the two), but its renders still work: the card's line names the two that
  // really ended, how each ended, and never counts the launcher among them
  await advance(80_000)
  expect(await until(async () => ((await leftTexts($)).some(text => /3 commands ended/.test(text)) || undefined))).toBe(true)
  const shown = await leftTexts($)
  expect(shown.some(text => /^Run python render\.py [01]/.test(text))).toBe(true)
  expect(shown).toContain('Run a build of the scene has ended and Run a check of the scene has ended')
  expect(shown.some(text => /commands have ended|Run the renders (has|have) /.test(text))).toBe(false)
})

test('a script that starts a session of its own while its command runs is still that command\'s run; the system\'s own programs never are', SLOW, async ($, on) => {
  const procs = { list: [] as string[], logs: {} as Record<string, string> }
  const { advance } = leftWorld(on, procs)
  await leftStart($)
  procs.list.push(psLine(5060, 1, 5060, '/u/bin/python daemon.py --serve-tiles'), psLine(5070, 1, 5070, '/System/Library/CoreServices/mdworker_shared'))
  await $.tool.call({ tool: 'Bash', tool_use_id: 'l7', agentId: 'a1', command: 'python daemon.py --serve-tiles', description: 'Run the tile daemon' } as never)
  await advance(20_000)
  const shown = await until(async () => {
    const all = await leftTexts($)
    return all.some(text => text.startsWith('Run the tile daemon')) ? all : undefined
  })
  expect(shown?.some(text => text.includes('mdworker'))).toBe(false)
})
