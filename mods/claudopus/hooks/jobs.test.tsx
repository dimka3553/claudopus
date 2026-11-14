import { expect, test } from 'claude-code/testing'

import { detachedOf, foldJobs, isOutputEnded, isWaitOnly, jobKindOf, labelOf, latestOf, pidOf, portOf, procsOf, shellsOf, treeOf, waitOf } from './jobs'
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
  expect(log.pct).toBeUndefined()
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
