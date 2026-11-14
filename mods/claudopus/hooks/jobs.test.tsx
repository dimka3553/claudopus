import { expect, test } from 'claude-code/testing'

import { detachedOf, isWaitOnly, jobKindOf, labelOf, latestOf, pidOf, portOf } from './jobs'

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
