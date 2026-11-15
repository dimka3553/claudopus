import { expect, test } from 'claude-code/testing'

import { leftoversOf, leftName, memOf, commandName, describedOf, detachedOf, endOf, expiresIn, leftSeconds, foldJobs, heldShellOf, isOutputEnded, isWaitOnly, jobKindOf, labelOf, latestOf, pidOf, portOf, procsOf, shellsOf, treeOf, waitOf } from './jobs'
import type { Job } from './jobs'

test('a job is told by its command: a server with its port, a download, else a script; its latest line is what a progress bar shows last', async () => {
  expect(jobKindOf('python3 -m http.server 8765 --directory out', 'Serve the mesh viewer')).toBe('server')
  expect(jobKindOf('npm run dev', 'Start the site')).toBe('server')
  expect(jobKindOf('huggingface-cli download flame/FLAME2023 --local-dir models', 'Fetch the face model')).toBe('download')
  expect(jobKindOf('curl -LO https://example.com/big.zip', 'Fetch the archive')).toBe('download')
  expect(jobKindOf('python run_all.py --video clip.mp4', 'Full pipeline rerun')).toBe('script')
  expect(portOf('python3 -m http.server 8765')).toBe('8765')
  expect(portOf('vite --port 5173')).toBe('5173')
  const bar = latestOf('Fetching 4 files\nflame.pkl:  12%|#    | 0.4G/3.0G\rflame.pkl:  47%|####   | 1.41G/3.00G [01:18<01:28, 18.0MB/s]\n')
  expect(bar.latest).toBe('flame.pkl: 47%|#### | 1.41G/3.00G [01:18<01:28, 18.0MB/s]')
  expect(bar.pct).toBe('47%')
  const log = latestOf('\x1b[32m[4/6]\x1b[0m fitting mesh\nframe 812/2000  loss 0.0123\n\n')
  expect(log.latest).toBe('frame 812/2000 loss 0.0123')
  // A count of what is named is how far it is
  expect(log.pct).toBe('40%')
  expect(log.done).toBe('812')
  expect(latestOf('127.0.0.1 - - [14/Nov/2026 11:20:03] "GET /mesh_final.ply HTTP/1.1" 200 -\n').latest).toBe('GET /mesh_final.ply 200')
  expect(latestOf('Serving HTTP on :: port 8765 (http://[::]:8765/) ...\n').port).toBe('8765')
})

test('a command started detached is known by its log and folder; one that is not, or logs nowhere, is not', async () => {
  expect(detachedOf('cd /w/run && nohup python train.py --epochs 40 > train.log 2>&1 & echo $!')).toEqual({ log: 'train.log', cd: '/w/run', core: 'python train.py --epochs 40' })
  expect(detachedOf('nohup sh -c "make all" >> "/tmp/build log.txt" 2>&1 &')?.log).toBe('/tmp/build log.txt')
  expect(detachedOf('setsid uvicorn app:api --port 8000 >/w/api.log 2>&1 < /dev/null &')?.log).toBe('/w/api.log')
  expect(detachedOf('nohup sleep 100 > /dev/null 2>&1 &')).toBeUndefined()
  expect(detachedOf('python train.py > train.log')).toBeUndefined()
  expect(pidOf('48213\n')).toBe('48213')
  expect(pidOf('started\n')).toBeUndefined()
  // curl's http code when nothing answered is no process: kill -0 0 always succeeds
  expect(pidOf('000\n')).toBeUndefined()
  expect(pidOf('0123\n')).toBeUndefined()
})

test('a detached start is one sent off with & by nohup or setsid on this Mac; a wait is no job; a description drops the command it repeats', async () => {
  expect(detachedOf('grep nohup notes.md > hits.txt')).toBeUndefined()
  expect(detachedOf('nohup make > build.log 2>&1')).toBeUndefined()
  expect(detachedOf("ssh m4 'nohup python train.py > t.log 2>&1 &'")).toBeUndefined()
  expect(detachedOf('cd /w && nohup make > build.log 2>&1 && echo ok')).toBeUndefined()
  expect(isWaitOnly('sleep 500')).toBe(true)
  expect(isWaitOnly("python3 -c 'import time; time.sleep(480)'")).toBe(true)
  expect(isWaitOnly('python run_all.py')).toBe(false)
  expect(labelOf('FLAME model download: curl -L --limit-rate 1M', 'curl -L --limit-rate 1M -o big.bin https://x')).toBe('FLAME model download')
  expect(labelOf('Step 2: fit the mesh', 'python fit.py')).toBe('Step 2: fit the mesh')
})

test('a score a command prints is no progress: the 14 Nov "99.2%" was a coverage figure, and a progress bar still gives its percent', async () => {
  expect(latestOf('HEADLINE two-way mean: 0.804 mm (coverage 99.2% within 2 mm)\n').pct).toBeUndefined()
  expect(latestOf('flame.pkl:  47%|####   | 1.41G/3.00G [01:18<01:28, 18.0MB/s]\n').pct).toBe('47%')
  expect(latestOf('Training:  96%| 4800/5000 [12:01<00:30]\n').pct).toBe('96%')
  expect(latestOf('Training: 96%|███| 4800/5000 [12:01<00:30, acc=95.1%]\n').pct).toBe('96%')
  expect(latestOf('Computing coverage: 45%|████| 45/100\n').pct).toBe('45%')
  expect(latestOf('step 120 of 2000 (6%)\n').pct).toBe('6%')
  expect(latestOf('| model A | 99.2% |\n').pct).toBeUndefined()
  expect(latestOf('95% of tests passed\n').pct).toBeUndefined()
  expect(latestOf('frame 81/120 coverage 99.2%\n').pct).toBe('67%')
  expect(latestOf('######################                   47.2%\n').pct).toBe('47%')
  expect(latestOf('Rendering ━━━━━━━━━━  45% 0:00:10\n').pct).toBe('45%')
  expect(isOutputEnded('1794640530\n\n[exited with code 0]\n')).toBe(true)
  expect(isOutputEnded('frame 81/120\n')).toBe(false)
})

test('a command that only polls is a wait that says what for; one that does real work after its loop is not', async () => {
  const rerun = 'until grep -q "RERUN_DONE" /Users/x/contest/work/5/rerun.log; do sleep 15; done; date'
  expect(waitOf(rerun)).toEqual({ what: 'RERUN_DONE in rerun.log', file: '/Users/x/contest/work/5/rerun.log' })
  expect(waitOf('cd /x/work/2 && until [ -s run1/train_b.out ] ; do sleep 20; done; date; tail -2 /tmp/contest-queue.log')).toEqual({ what: 'train_b.out', file: '/x/work/2/run1/train_b.out' })
  // As the live ones read: a quoted alternation and a cd after the loop only report
  expect(waitOf('until grep -q "RERUN_DONE" /x/5/rerun.log; do sleep 15; done; grep "frames placed\\|RERUN_DONE\\|Traceback" /x/5/rerun.log; date; uptime')?.what).toBe('RERUN_DONE in rerun.log')
  expect(waitOf('until grep -q "RERUN_DONE" /x/5/rerun.log; do sleep 15; done; cd /x/5; grep "HEADLINE" rerun.log; date')?.what).toBe('RERUN_DONE in rerun.log')
  expect(waitOf('until grep -q X /x/f; do sleep 15; done; grep X /x/f / python summarize.py')).toBeUndefined()
  expect(waitOf("until ! pgrep -f 'src/sfm.py run/s2' >/dev/null; do sleep 10; done; date")).toMatchObject({ what: 'src/sfm.py run/s2 to end', pattern: 'src/sfm.py run/s2' })
  expect(waitOf("until ! pgrep -f 'src/sfm.py run/s2' >/dev/null; do sleep 10; done; date; ../../turn.sh python src/dense.py run/s2 run/d4 > run/d4.log 2>&1")).toBeUndefined()
  expect(waitOf('python run_all.py')).toBeUndefined()
})

test('six alike waits are one row that says six; different jobs stay apart', async () => {
  const wait = (id: string, at: number): Job => ({ id, label: 'Wait for the end-to-end rerun to finish', cmd: `until grep -q RERUN_DONE r.log; do sleep 15; done${at}`, kind: 'wait', at, waitsFor: 'RERUN_DONE in r.log' })
  const folded = foldJobs([wait('a', 1), wait('b', 5), wait('c', 3), { id: 'd', label: 'Mesh', cmd: 'python mesh.py', kind: 'script', at: 2 }])
  expect(folded).toHaveLength(2)
  expect(folded[0]).toMatchObject({ id: 'b', count: 3, at: 1 })
  expect(folded[1]?.count).toBeUndefined()
})

test("a background command is found in the engine's shells by its words: paused when a process under it is, missing when none runs it", async () => {
  const snap = "/bin/zsh -c source /Users/x/.claude/shell-snapshots/snapshot-zsh-1-a.sh 2>/dev/null || true && eval "
  const procs = procsOf([
    `11021 94084 Ss   00:10 ${snap}'until grep -q "RERUN_DONE" /Users/x/contest/work/5/rerun.log; do sleep 15; done; date'`,
    `74000 94084 Ss   00:09 ${snap}'cd /Users/x/contest/work/1 && for d in 8 9 10; do python src/poisson.py run/d1/dense.ply run/d1/poisson$d.ply $d; done'`,
    '74030 74000 S    00:09 /bin/zsh -c x',
    '77569 74030 T    00:08 /Users/x/env/bin/python src/poisson.py run/d1/dense.ply run/d1/poisson10.ply 10',
  ].join('\n'), 1_000_000)
  const shells = shellsOf(procs, [
    { id: 'wait', cmd: 'until grep -q "RERUN_DONE" /Users/x/contest/work/5/rerun.log; do sleep 15; done; date', at: 990_000 },
    { id: 'mesh', cmd: 'cd /Users/x/contest/work/1 && for d in 8 9 10; do python src/poisson.py run/d1/dense.ply run/d1/poisson$d.ply $d; done', at: 991_000 },
    { id: 'gone', cmd: 'until grep -q "RERUN_DONE" /Users/x/contest/work/5/rerun.log; do sleep 15; done; date', at: 995_000 },
  ])
  expect(shells.get('wait')).toBe('11021')
  expect(shells.get('mesh')).toBe('74000')
  expect(shells.get('gone')).toBeNull()
  expect(treeOf(procs, '74000').some(p => p.stat.startsWith('T'))).toBe(true)
  expect(treeOf(procs, '11021').some(p => p.stat.startsWith('T'))).toBe(false)
})

test('how far a run is, read from the progress tools print and the line work is told to print: done of all, percent, speed', async () => {
  const of = (text: string) => {
    const { pct, done, total, rate } = latestOf(text)
    return { pct, done, total, rate }
  }
  // curl's meter, as it rewrites it
  expect(of('  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M')).toEqual({ pct: '45%', done: '460 MB', total: '1 GB', rate: '10.5 MB/s' })
  // wget, its bar and its dots, the total from its Length
  expect(of('Length: 1073741824 (1.0G) [application/octet-stream]\nbig.bin   45%[=====>      ] 460.12M  10.2MB/s    eta 55s')).toEqual({ pct: '45%', done: '460 MB', total: '1 GB', rate: '10.2 MB/s' })
  expect(of('Length: 1073741824 (1.0G)\n  460800K .......... .......... .......... 45% 10.2M 55s')).toEqual({ pct: '45%', done: '450 MB', total: '1 GB', rate: '10.2 MB/s' })
  expect(of('  1,234,567,890  45%   10.21MB/s    0:00:55 (xfr#3, to-chk=2/10)')).toEqual({ pct: '45%', done: '1.2 GB', total: undefined, rate: '10.2 MB/s' })
  expect(of('45.2 %, 10 Done, 0 Failed, 90 Pending, 0 Skipped, 100 Total, 2-sec Throughput (Mb/s): 85.3')).toEqual({ pct: '45%', done: '10', total: '100 files', rate: '10.7 MB/s' })
  expect(of('Alive[################                ]  45.0000%').pct).toBe('45%')
  expect(of('   ━━━━━━━━━━━━━━━━╸━━━━━━━━━ 460.1/1024.0 MB 10.2 MB/s eta 0:00:55')).toEqual({ pct: '44%', done: '460 MB', total: '1 GB', rate: '10.2 MB/s' })
  expect(of('Completed 460.0 MiB/1.0 GiB (10.2 MiB/s) with 1 file(s) remaining')).toEqual({ pct: '44%', done: '460 MB', total: '1 GB', rate: '10.2 MB/s' })
  expect(of('flame.pkl:  47%|####   | 1.41G/3.00G [01:18<01:28, 18.0MB/s]')).toEqual({ pct: '47%', done: '1.4 GB', total: '3 GB', rate: '18 MB/s' })
  expect(of('Training:  96%| 4800/5000 [12:01<00:30, 2.1it/s]')).toEqual({ pct: '96%', done: '4,800', total: '5,000', rate: '2.1 it/s' })
  // The work's own line, found among the lines after it
  expect(of('progress: 3/6 steps fitting')).toEqual({ pct: '50%', done: '3', total: '6 steps', rate: undefined })
  expect(of('progress: 4.2/10 GB uploading\nchunk 41 sent\n')).toEqual({ pct: '42%', done: '4.2 GB', total: '10 GB', rate: undefined })
  expect(of('progress: 45%').pct).toBe('45%')
  // A date, a ratio and a score are not
  expect(of('14/11/2026 done')).toEqual({ pct: undefined, done: undefined, total: undefined, rate: undefined })
  expect(of('loss 3/4 of baseline').done).toBeUndefined()
  // nor how full a memory or a disk is, a table cell, a log's date, a score or a test count (a second look on 15 Nov)
  expect(of('epoch 3/10 step 100/1000 loss 0.5 mem 12.3G/80G')).toEqual({ pct: '30%', done: '3', total: '10', rate: undefined })
  expect(of('disk 460G/1.0T 45% used').done).toBeUndefined()
  expect(of('| 12 | 3/4 | 55 |').done).toBeUndefined()
  expect(of('[11/15 12:00:01] starting').done).toBeUndefined()
  expect(of('job finished with score 3/4').done).toBeUndefined()
  expect(of('Tests: 3/4 passed').done).toBeUndefined()
  expect(of('accuracy 95% on 1000/1000 samples').pct).toBeUndefined()
  expect(of('step 300/1000 | loss 0.12 | 12.3GB/24.0GB | 45.0MB/s')).toMatchObject({ done: '300', total: '1,000' })
  expect(of('| model-a | 12/50 | 24% |').done).toBeUndefined()
  expect(of('no progress: 3/6 were skipped').done).toBeUndefined()
  expect(of('progress: 7/6').done).toBeUndefined()
  // More shapes: Keras, a plain sentence, a count with what it counts after it, make's percent, az's long percent
  expect(of('450/1000 [=====>....] - ETA: 12s')).toMatchObject({ done: '450', total: '1,000', pct: '45%' })
  expect(of('Downloaded 460 MB of 1 GB (45%)')).toMatchObject({ done: '460 MB', total: '1 GB', pct: '45%' })
  expect(of('Processed 450/1000 images')).toMatchObject({ done: '450', total: '1,000 images' })
  expect(of('[ 45%] Building CXX object').pct).toBe('45%')
  expect(of('Alive[#####      ]  8.0123%').pct).toBe('8%')
  // The work's own line with a unit after each number, and a word after the total that is no unit
  expect(of('progress: 4.2 GB / 10 GB uploading')).toMatchObject({ done: '4.2 GB', total: '10 GB', pct: '42%' })
  expect(of('progress: 3/6 fitting')).toMatchObject({ done: '3', total: '6' })
  // A bar's count is the one after it
  expect(of('Epoch 1/10 100%|██████████| 500/500 [00:10<00:00]')).toEqual({ pct: '100%', done: '500', total: '500', rate: undefined })
  // The work's own line after a log's time or level, its numbers as written
  expect(of('2026-11-15 12:00:01 INFO progress: 1200/5000 MB')).toEqual({ pct: '24%', done: '1200 MB', total: '5000 MB', rate: undefined })
  // An error after a download is the latest line: no progress hides it, and the work's own line above it says it is earlier
  expect(of(' 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M\ncurl: (56) Recv failure').done).toBeUndefined()
  expect(latestOf('progress: 3/6 steps fitting\nRuntimeError: CUDA out of memory\n')).toMatchObject({ done: '3', isEarlier: true, latest: 'RuntimeError: CUDA out of memory' })
  expect(latestOf(`progress: 3/6 steps\n${'loss 0.1\n'.repeat(40)}`)).toMatchObject({ done: '3', isEarlier: true })
  expect(of('HEADLINE two-way mean: 0.804 mm (coverage 99.2% within 2 mm)').pct).toBeUndefined()
})

test('a detached start is followed only by the process `echo $!` printed and a log it can name: the 15 Nov download stayed blank for hours', async () => {
  // Its log was under $S, set in the same command, and a curl after it printed "000", taken for the process
  const command = `cd /w/a && S=/tmp/sp && nohup sh build.sh 1 > $S/build1.log 2>&1 & curl -s -o /dev/null -w "%{http_code}\\n" "https://x"`
  expect(detachedOf(command)?.log).toBe('/tmp/sp/build1.log')
  expect(pidOf('000\n')).toBeUndefined()
  expect(pidOf('0\n')).toBeUndefined()
  expect(detachedOf('nohup python t.py > $HOME/t.log 2>&1 & echo $!')?.log).toBe('~/t.log')
  expect(detachedOf('nohup python t.py > $OUT/t.log 2>&1 & echo $!')).toBeUndefined()
  expect(detachedOf('S=/tmp/x && nohup python a.py > ${S:-/y}/run.log 2>&1 & echo $!')).toBeUndefined()
  expect(detachedOf('export S=/tmp/x && nohup python a.py > $S/run.log 2>&1 & echo $!')?.log).toBe('/tmp/x/run.log')
  // A status code printed beside the process leaves it unknown
  expect(pidOf('200\n48213\n')).toBeUndefined()
})

test('a row is named by what it does and its kind by its own program; time left is only what a run said; 15 Nov rows read "Download · Reload page" and "cd /private/tmp/..."', async () => {
  // `vercel curl` reads a page: vercel is the program, not curl
  expect(jobKindOf('cd /w && vercel curl /ct --deployment d -- -s -o ct3.html; timeout 25 vercel logs d | grep -i storage', 'Reload page and check function logs')).toBe('script')
  expect(jobKindOf('S=/x; nohup /usr/bin/curl -L -o a.zip https://e.com/a.zip > $S/f.log 2>&1 & echo $!', 'Fetch the archive')).toBe('download')
  expect(jobKindOf('ls; wget --progress=dot:giga https://e.com/a.zip', 'Fetch it')).toBe('download')
  // A command given no words of its own is named by what it runs
  expect(labelOf('', 'bash /private/tmp/s/round3b_figs.sh')).toBe('bash round3b_figs.sh')
  expect(labelOf('cd /w/review3 && ~/.venvs/ct/bin/python rc.py > rc.log 2>&1', 'cd /w/review3 && ~/.venvs/ct/bin/python rc.py > rc.log 2>&1')).toBe('python rc.py')
  expect(commandName('S=/x && cd $S; CUDA=1 nohup python3 -m train --epochs 4 > t.log 2>&1 & echo $!')).toBe('python3 train')
  expect(labelOf('Redraw all pictures', 'bash figs.sh')).toBe('Redraw all pictures')
  // A wait led by `cd <folder>;` is a wait, named by what it waits for
  expect(waitOf('cd /private/tmp/s; until grep -qE "exit [0-9]" vsd-sheet.log && grep -qE "exit [0-9]" idc-thin.log; do sleep 15; done; tail -2 vsd-sheet.log idc-thin.log; ls /d/sheets/')).toEqual({ what: 'exit [0-9] in vsd-sheet.log', file: '/private/tmp/s/vsd-sheet.log' })
  // Time left, as each tool says it
  expect(latestOf('  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M').left).toBe('55s left')
  expect(latestOf('big.bin   45%[=====>      ] 460.12M  10.2MB/s    eta 1m 35s').left).toBe('1m 35s left')
  expect(latestOf('flame.pkl:  47%|####   | 1.41G/3.00G [01:18<01:28, 18.0MB/s]').left).toBe('1m 28s left')
  expect(latestOf('  1,234,567,890  45%   10.21MB/s    0:00:55 (xfr#3, to-chk=2/10)').left).toBe('55s left')
  expect(latestOf('progress: 3/6 steps fitting, eta 25m').left).toBe('25m left')
  expect(latestOf('progress: 40/120 scans thumbnails 2h 5m remaining').left).toBe('2h 05m left')
  // No time said, none shown; a percent alone is never made into one
  expect(latestOf('progress: 3/6 steps fitting').left).toBeUndefined()
  expect(latestOf('Receiving objects:  45% (450/1000), 460.00 MiB | 10.20 MiB/s').left).toBeUndefined()
})

test('a command held open is found by its own shell however few its words; times past an hour, units and names read true', async () => {
  // A real shell line as ps listed it on 15 Nov, quotes and new lines as ps writes them
  const shell = (pid: string, etime: string, body: string) => `${pid}  1423 Ss      ${etime} /bin/zsh -c source /Users/x/.claude/shell-snapshots/snapshot-zsh-1-ab.sh 2>/dev/null || true && \\builtin setopt NO_EXTENDED_GLOB 2>/dev/null || true && eval '${body}' < /dev/null && pwd -P >| /tmp/claude-a9a2-cwd`
  const now = 1_700_000_100_000
  const procs = procsOf([shell('31654', '00:08', 'python3 train.py'), shell('31700', '00:08', 'python3 train.py --epochs 4'), shell('31800', '00:30', `bash -c '"'"'echo hi'"'"'\\012sleep 9`)].join('\n'), now)
  expect(heldShellOf(procs, 'python3 train.py', now - 8_000)).toBe('31654')
  expect(heldShellOf(procs, "bash -c 'echo hi' sleep 9", now - 30_000)).toBe('31800')
  // never one started far from when the call began
  expect(heldShellOf(procs, 'python3 train.py', now - 120_000)).toBeUndefined()
  // Time left past an hour, as it was said
  expect(latestOf('progress: 3/60 scans fitting eta 1:59:59').left).toBe('2h left')
  expect(latestOf('fit:   5%|  | 1/20 [00:08<1:59:40, 0.2it/s]').left).toBe('2h left')
  expect(latestOf('progress: 3/6 steps fitting eta 5m20s').left).toBe('5m 20s left')
  expect(latestOf('Copied 3 of 9 files, 5 minutes left').left).toBe('5m left')
  // What a count counts is kept
  expect(latestOf('Processed 9 of 20 files').total).toBe('20 files')
  // Names and kinds
  expect(labelOf('', 'for i in $(seq 1 20); do echo "progress: $i/20 x"; sleep 1; done')).toBe('a shell loop')
  expect(labelOf('', 'uv run python train.py')).toBe('python train.py')
  expect(labelOf('', 'git -C /repo pull')).toBe('git pull')
  expect(labelOf('', '"/Applications/Some App/bin/tool" --go')).toBe('tool')
  expect(jobKindOf('azcopy copy ./scans https://acct.blob.core.windows.net/c --recursive', 'Send the scans to Azure')).toBe('download')
})

test('a wait or check that reads pages with curl is no download: the 15 Nov "Download · Wait for deploy and verify the live pages"', async () => {
  const deploy = `for i in $(seq 1 50); do n=$(curl -s --max-time 30 "https://example.com/support/terms?v=$i" | grep -c 'Governors'); [ "$n" -gt 0 ] && break; sleep 10; done; for p in terms privacy; do printf "$p %s\\n" $(curl -s "https://example.com/support/$p" | tee /tmp/p.html | grep -o 'Governors' | wc -l); done`
  expect(jobKindOf(deploy, 'Wait for deploy and verify the live pages')).toBe('wait')
  expect(jobKindOf(deploy, 'Verify the live pages')).toBe('script')
  expect(jobKindOf('curl -s https://example.com/health | grep ok', 'Look at the site')).toBe('script')
  expect(jobKindOf('wget --spider https://example.com/a.zip', 'See the file is there')).toBe('script')
  expect(jobKindOf('curl -sL https://example.com/a.zip -o a.zip', 'Get the archive')).toBe('download')
  expect(jobKindOf('curl -L https://example.com/a.zip > a.zip', 'Get the archive')).toBe('download')
  expect(jobKindOf('curl -LO https://example.com/a.zip', 'Get the archive')).toBe('download')
  expect(jobKindOf('wget https://example.com/a.zip', 'Get the archive')).toBe('download')
  expect(jobKindOf('python3 check.py', 'Check the download finished')).toBe('script')
})

test('the work names each run in one form, its kind first and how long it should take in brackets, and the card reads that as it is', async () => {
  expect(describedOf('Download the CT scans (about 3 min)')).toEqual({ text: 'Download the CT scans', kind: 'download', expect: 180_000, expectText: '3m' })
  expect(describedOf('Wait for the deploy to go live (about 90s)')).toMatchObject({ text: 'Wait for the deploy to go live', kind: 'wait', expect: 90_000 })
  expect(describedOf('Upload the fits to Azure (~1h 30m)')).toMatchObject({ kind: 'download', expectText: '1h 30m' })
  expect(describedOf('Run the fit on all scans (about 20 min)')).toMatchObject({ kind: 'script', expectText: '20m' })
  // Its words decide its kind, whatever the command: a wait that polls with curl is a wait
  expect(jobKindOf('for i in $(seq 1 50); do curl -L -o p.html https://e.com; sleep 10; done', 'Wait for the deploy to go live (about 2 min)')).toBe('wait')
  expect(jobKindOf('python3 fetch.py', 'Download the weights (about 5 min)')).toBe('download')
  // Words in another form keep their own name and no time
  expect(describedOf('Redraw all pictures')).toEqual({ text: 'Redraw all pictures', kind: undefined })
})

test('a description is read only as far as it is sure: a count in brackets is no time, a wait may say waiting, a range takes its end', async () => {
  expect(describedOf('Run thumbnails (about 120 scans)')).toEqual({ text: 'Run thumbnails (about 120 scans)', kind: 'script' })
  expect(describedOf('Run one more step (about 1 more min)').expect).toBeUndefined()
  expect(describedOf('Download the CT scans (3 min)')).toMatchObject({ text: 'Download the CT scans', expectText: '3m' })
  expect(describedOf('Waiting on Azure (about 2-3 min)')).toMatchObject({ kind: 'wait', expectText: '3m' })
  expect(describedOf('Watch the queue (about 1h)')).toMatchObject({ kind: 'watch', expectText: '1h' })
  // a curl in a loop that keeps its files is still a download
  expect(jobKindOf('for i in 1 2; do curl -o f$i.bin https://e.com/f$i.bin; done', 'Get two files')).toBe('download')
})

test('how a run ended, from the last line the engine writes on its output: finished, failed with its code, killed (15 Nov watches ended [killed]), or still going', async () => {
  expect(endOf('done\n\n[exited with code 0]\n')).toEqual({ how: 'finished' })
  expect(endOf('Traceback\n\n[exited with code 137]\n')).toEqual({ how: 'failed', code: '137' })
  expect(endOf('\n[killed]\n')).toEqual({ how: 'killed' })
  expect(endOf('progress: 3/6 steps\n')).toBeUndefined()
  expect(endOf('it printed [killed] mid-line and goes on\n')).toBeUndefined()
  expect(isOutputEnded('\n[killed]\n')).toBe(true)
  expect(expiresIn('Monitor started (task b0zhjoyke, expires in 30m unless the source ends first')).toBe(1_800_000)
  expect(expiresIn('expires in 26m 40s unless')).toBe(1_600_000)
  expect(leftSeconds('1h 05m left')).toBe(3900)
  expect(leftSeconds('55s left')).toBe(55)
})

test('what a command left running is told by its group and by when it started: old app helpers, other commands and runs still deciding are never taken for it', () => {
  const now = 1_700_000_000_000
  const at = now - 10_000
  const ps = (lines: string[]) => procsOf(lines.join('\n'), now)
  const span = { id: 'c1', from: 5000, to: 5100, at, endAt: now - 2_000, until: now - 2_000, cmd: 'python launch.py 8' }
  // Left by the command: its group's leader (5050) is gone, it started while the command ran
  const mine = '5060 1 5050 S 00:05 7000000 /u/bin/python fig4.py page PMC closed 0'
  // An app helper orphaned 20 hours ago, whose dead group leader's number falls in the range after the numbers came round
  const old = '5070 1 5040 S 20:01:00 90000 /Applications/Telegram.app/Contents/Frameworks/Helper'
  const found = leftoversOf(ps([mine, old]), [span])
  expect(found.map(l => l.top.pid)).toEqual(['5060'])
  expect(memOf(found[0]?.tree ?? [])).toBe('6.7 GB')
  // Numbers that wrapped round past the most macOS hands out
  expect(leftoversOf(ps(['120 1 99990 S 00:05 1000 sleep 60']), [{ ...span, from: 99_950, to: 300 }]).length).toBe(1)
  // A run a command still running may have started waits for that one
  const daemon = '5080 1 5080 S 00:05 1000 /u/bin/python daemon.py'
  expect(leftoversOf(ps([daemon]), [span], new Set(), [{ from: 5070, at: now - 8_000 }]).length).toBe(0)
  expect(leftoversOf(ps([daemon]), [span]).length).toBe(1)
  // The rest of a pipeline whose last command is followed by its printed number is that run's
  expect(leftoversOf(ps([mine, '5061 1 5050 S 00:05 1000 tee out.log']), [span], new Set(['5061'])).length).toBe(0)
  // A command sent to the background takes what starts after it as long as it is open
  expect(leftoversOf(ps(['5060 1 5050 S 00:01 1000 sleep 60']), [{ ...span, until: undefined }]).length).toBe(1)
  // Two commands at once: each group goes to the command whose first number is nearest below its leader, whichever is newer
  const a = { ...span, id: 'a', from: 5000, to: 5200, at: now - 20_000, until: now - 1_000 }
  const b = { ...span, id: 'b', from: 5100, to: 5150, at: now - 9_000, until: now - 6_000 }
  const both = leftoversOf(ps(['5003 1 5002 S 00:08 1000 sleep 600', '5110 1 5102 S 00:08 1000 sleep 601']), [b, a])
  expect(both.map(l => `${l.top.pid}>${l.span}`).sort()).toEqual(['5003>a', '5110>b'])
  // A call still open past the wrap holds back what it may have started
  expect(leftoversOf(ps(['20 1 20 S 00:05 1000 /u/bin/python daemon.py']), [{ ...span, from: 99_990, to: 40 }], new Set(), [{ from: 99_995, at: now - 8_000 }]).length).toBe(0)
  expect(leftName('/opt/homebrew/Cellar/python/Python.app/Contents/MacOS/Python fig4.py page 3')).toBe('Run python fig4.py page 3')
})
