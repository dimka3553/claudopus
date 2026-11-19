import { expect, test } from 'claude-code/testing'

import { NAMING_SYSTEM, namedHead, namingKey, namingOf, namingPrompt, redacted, TITLE_MOST } from './naming'

test('nothing secret or personal goes to the model: keys, tokens, passwords, logins in links, signed links, private keys, emails and the name in home folders are hidden, while plain words, settings and variables by name stay', async () => {
  const cases: [string, string[], string[]][] = [
    ['curl -H "Authorization: Bearer abcdef1234567890abcdef" https://api.example.com/v1', ['abcdef1234567890abcdef'], ['curl', 'https://api.example.com/v1']],
    ['export OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl && python3 run.py', ['sk-proj-abc123def456ghi789jkl'], ['python3 run.py', 'OPENAI_API_KEY=']],
    ['git clone https://dima:ghp_abcdefghijklmnop1234@github.com/acme/app', ['ghp_abcdefghijklmnop1234', 'dima:'], ['github.com/acme/app']],
    ['az storage blob upload --account-key Zm9vYmFyYmF6cXV4MTIzNDU2Nzg5MGFiY2RlZg== --container-name films', ['Zm9vYmFyYmF6cXV4MTIzNDU2Nzg5MGFiY2RlZg=='], ['--container-name films']],
    ['azcopy cp "https://acct.blob.core.windows.net/c/f.mp4?sv=2022-11-02&se=2026-12-01&sp=r&sig=AbC%2Bdef123xyz" .', ['AbC%2Bdef123xyz'], ['acct.blob.core.windows.net']],
    ['AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE aws s3 sync out s3://bucket', ['AKIAIOSFODNN7EXAMPLE'], ['aws s3 sync out']],
    ['token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U', ['eyJhbGciOiJIUzI1NiJ9'], []],
    ['{"user": "x", "password": "hunter2"}', ['hunter2'], ['"user": "x"']],
    ['mysql -u root -phunter2 films', ['hunter2'], ['mysql -u root']],
    ['--token=abc123secretvalue --name v13-films3', ['abc123secretvalue'], ['--name v13-films3']],
    ['mailing the results to dima@faceiqlabs.com', ['dima@faceiqlabs.com'], ['mailing the results to']],
    ['cd /Users/dima/Documents/GitHub/smooth && bash batch.sh', ['dima'], ['~/Documents/GitHub/smooth', 'bash batch.sh']],
    ['tail /private/tmp/claude-501/-Users-dima-Documents-GitHub/tasks/x.output', ['dima'], ['/private/tmp/claude-501/-Users-~-Documents-GitHub/tasks/x.output']],
    ['-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmU\n-----END OPENSSH PRIVATE KEY-----', ['b3BlbnNzaC1rZXktdjEAAAAABG5vbmU'], []],
    ['using hf_abcdefghijklmnopqrstuvwxyz12 to fetch the weights', ['hf_abcdefghijklmnopqrstuvwxyz12'], ['to fetch the weights']],
    // (a variable named, never its value, stays as it is written)
    ['GH_TOKEN=$GH_TOKEN gh release download --token "$GH_TOKEN"', [], ['GH_TOKEN=$GH_TOKEN', '--token "$GH_TOKEN"']],
    // (plain lines and plain settings are left alone)
    ['THREADS=5 PAR=6 bash batch.sh v13_3.txt v13', [], ['THREADS=5 PAR=6 bash batch.sh v13_3.txt v13']],
    ['progress: 12/47 films scoring with the basic smoothing', [], ['progress: 12/47 films scoring with the basic smoothing']],
    // (a path stays a path, its folders' long names too: 19 Nov a whole path was hidden as one key)
    ['tail: /Users/dima/Documents/faceiq-sweeps/video-free/films-smooth/f0/films.md: No such file', ['dima'], ['~/Documents/faceiq-sweeps/video-free/films-smooth/f0/films.md']],
  ]
  for (const [line, gone, kept] of cases) {
    const out = redacted(line)
    for (const secret of gone) expect({ line, out, has: out.includes(secret) }).toEqual({ line, out, has: false })
    for (const plain of kept) expect({ line, out, has: out.includes(plain) }).toEqual({ line, out, has: true })
  }
  // The question itself holds none of it, in any of its parts: the task, the label, the folder, the command or the log
  const asked = namingPrompt({ task: 'Mail dima@faceiqlabs.com', label: 'Upload with sk-ant-api03-abcdefghijklmnop', folder: '/Users/dima/x', cmd: 'curl -u dima:hunter2pass https://x.io -H "x-api-key: abcdefgh12345678"', state: 'failed', ran: '20s', lines: ['Authorization: Bearer abcdefghijklmnop123456', 'error: 401'] })
  for (const secret of ['dima', 'sk-ant-api03', 'hunter2pass', 'abcdefgh12345678', 'abcdefghijklmnop123456']) expect({ secret, has: asked.includes(secret) }).toEqual({ secret, has: false })
  expect(asked).toContain('State: failed after 20s')
  expect(asked).toContain('error: 401')
  // and asks for one JSON object of the four parts
  for (const part of ['"title"', '"kind"', '"now"', '"why"', 'JSON']) expect(NAMING_SYSTEM).toContain(part)
})

test("the model's answer is read as four plain parts or not at all: each part that is code, a path, a setting or hidden is left out, a kind not on the list is none, a long part is cut at a word, and a reply that is no JSON gives nothing, so the row keeps today's name", async () => {
  const cases: [string, ReturnType<typeof namingOf>][] = [
    ['{"title": "Score smoothed heads against the 47 test films.", "kind": "test", "now": "Scoring film 12", "why": ""}', { title: 'Score smoothed heads against the 47 test films', kind: 'test', now: 'Scoring film 12' }],
    // (in a code fence, with words around it, and a kind in capitals)
    ['Here it is:\n```json\n{"title": "smooth the last quarter of the films", "kind": "Cloud job", "now": "waiting for the cloud machine to start"}\n```', { title: 'Smooth the last quarter of the films', kind: 'cloud job', now: 'Waiting for the cloud machine to start' }],
    ['{"title": "Fit the heads", "kind": "failed", "why": "Ran out of memory while loading the films"}', { title: 'Fit the heads', why: 'Ran out of memory while loading the films' }],
    // code, a path, a setting, a flag, a web address or anything hidden is no plain part
    ['{"title": "Run `python3 eval.py`", "kind": "script", "now": "Reading /Users/x/films", "why": "THREADS=5 too high"}', { kind: 'script' }],
    ['{"title": "Run batch.sh --name v13", "now": "Fetching https://x.io", "why": "Key [hidden] refused"}', undefined],
    ['{"title": 42, "kind": ["test"]}', undefined],
    ['Score the films', undefined],
    ['{"title": "Score the films", ', undefined],
    ['', undefined],
  ]
  for (const [reply, want] of cases) expect({ reply, got: namingOf(reply) }).toEqual({ reply, got: want })
  const long = namingOf(`{"title": "${'Score the smoothed heads against every one of the forty seven test films '.repeat(2)}"}`)?.title ?? ''
  expect(long.length).toBeLessThanOrEqual(TITLE_MOST)
  expect(long.endsWith('…')).toBe(true)
  expect(long.at(-2)).not.toBe(' ')
  // A row's name leads with its kind in words, unless its title does already
  expect(namedHead({ title: 'Score smoothed heads against the 47 test films', kind: 'test' })).toBe('Test · Score smoothed heads against the 47 test films')
  expect(namedHead({ title: 'Test the panel order', kind: 'test' })).toBe('Test the panel order')
  expect(namedHead({ title: 'Smooth the films', kind: 'cloud job' })).toBe('Cloud job · Smooth the films')
  expect(namedHead({ title: 'Smooth the films' })).toBe('Smooth the films')
  // A command is the same command only with the same line, words and folder
  expect(namingKey({ cmd: 'bash a.sh', label: 'Run a', folder: '/r' })).toBe(namingKey({ cmd: 'bash a.sh', label: 'Run a', folder: '/r' }))
  expect(namingKey({ cmd: 'bash a.sh', label: 'Run a', folder: '/r' })).not.toBe(namingKey({ cmd: 'bash a.sh', label: 'Run b', folder: '/r' }))
})
