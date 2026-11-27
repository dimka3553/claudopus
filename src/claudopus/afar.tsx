// What happens in chats this panel cannot see into: chats running without Claudopus, and the asks and finishes of another Mac's chats

// ---- Chats running without Claudopus, on this Mac or a Mac it reaches, and the Claude app's decision that starts new ones so ----

// What was found: the chats by Mac ('' for this one), and when this Mac's app decided a Mac's own install didn't load there ('' when
// it holds no such decision). Looked at every AFAR_EVERY by each chat, as the look is a ps and a grep of one log
let offChats: (Off & { host: string })[] = []
let stuckAt = ''
let afarAt = -Infinity
const AFAR_EVERY = 30_000
// Says whether what was found changed, so the panel is drawn again
const lookAfar = async ($: EngineInterface, now: number) => {
  if (now - afarAt < AFAR_EVERY) return false
  afarAt = now
  const failed = { exitCode: -1, stdout: '' }
  // On Windows no chat of this PC is looked for: what the look finds are chats another computer's app runs here over SSH, which
  // reach a Mac or Linux, and Git's ps never sees an engine there. The app's log is in its data folder there
  const here = isWindows ? failed : await runOn($, ['sh', '-c', OFF_LOOK], { timeoutMs: 10_000 }).catch(() => failed)
  const app = await runOn($, isWindows ? ['sh', '-c', APP_LOG_LOOK_IN, 'sh', ...(await appLogFolders($))] : ['sh', '-c', APP_LOG_LOOK], { timeoutMs: 10_000 }).catch(() => failed)
  const found = here.exitCode === 0 ? offOf(here.stdout).map(one => ({ ...one, host: '' })) : []
  for (const mac of macs) {
    const f = JSON.parse((await readOr($, macPath(mac))) || '{}') as Partial<Fetched>
    if (f.text && now - (f.fetchedAt ?? 0) <= STALE) found.push(...offOf(f.text).map(one => ({ ...one, host: mac })))
  }
  if (found.some(one => one.host)) await readAppIds($, now).catch(() => false)
  const stuck = stuckOf(app.stdout)
  const isChanged = JSON.stringify([found, stuck]) !== JSON.stringify([offChats, stuckAt])
  offChats = found
  stuckAt = stuck
  return isChanged
}
// The Claude app's log folders on Windows, as each of its builds keeps its data: the installer's in APPDATA, another's in
// LOCALAPPDATA, the Store's in its package's own copy of APPDATA
const appLogFolders = async ($: EngineInterface) => {
  const roaming = slashed((await $.env.get('APPDATA').catch(() => undefined)) ?? '')
  const local = slashed((await $.env.get('LOCALAPPDATA').catch(() => undefined)) ?? '')
  return [...(roaming ? [`${roaming}/Claude/logs`] : []), ...(local ? [`${local}/Claude-Data/logs`, `${local}/Packages/Claude_pzs8sxrjxfjjc/LocalCache/Roaming/Claude/logs`] : [])]
}
// A chat's name for the panel: its own title, else the one this Mac's app gives it, else a word
const offName = (one: Off) => one.title || appTitles.get(one.chat) || (one.chat === 'new' ? 'A chat just started' : 'A chat')

// The warning the panel shows under its header while any of it holds: in those chats nothing of Claudopus runs, so this is the only
// place they are seen, and what cures it
const afarPart = (ui: Ui) => {
  if (!stuckAt && !offChats.length) return null
  const there = macs.length === 1 ? macName(macs[0] ?? '') : 'the Mac it runs chats on over SSH'
  const lines = [
    ...(stuckAt ? [`New chats on ${there} start without Claudopus. At ${stuckAt} ${thisMac()}'s Claude app decided Claudopus didn't load there, so it starts every new chat there without it: no panel, tools or rules. Quit the Claude app and open it again to end this.`] : []),
    ...offChats.map(one => `“${offName(one)}”${one.host ? ` on ${macName(one.host)}` : ` on ${thisMac()}`} runs without Claudopus, so its tasks, questions and results don't reach any panel. A chat you start after reopening the app has Claudopus.`),
  ]
  return (
    <ui.Box key="afar" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{offChats.length === 1 && !stuckAt ? "Claudopus isn't running in a chat" : "Claudopus isn't running in some chats"}</ui.Text>
      {lines.map((line, i) => (
        <ui.Text key={`afar-${i}`} wrap="wrap">
          {line}
        </ui.Text>
      ))}
    </ui.Box>
  )
}

// ---- Another Mac's chats, told here: their asks, prompts and finishes as a notification on this Mac, where the person is, as that
// Mac's own notifications show only on its own screen. Only for the Macs this one reaches (config.json `macs`); each once, whichever
// chat here sees it first, and only when it is fresh, so a chat that starts tells nothing old ----
const AFAR_FRESH = 3 * 60_000
const toldDir = () => `${liveDir()}/${MACS}/told`
const tellOnce = async ($: EngineInterface, key: string, tell: () => Promise<unknown>) => {
  const path = `${toldDir()}/${key.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 150)}`
  const r = await runOn($, ['sh', '-c', 'mkdir -p "$1" && mkdir "$2" 2>/dev/null', 'sh', toldDir(), path]).catch(() => ({ exitCode: -1 }))
  if (r.exitCode === 0) await tell().catch(err => log($, `${key} not told: ${String(err)}`))
}
let toldSwept = -Infinity
const tellAfar = async ($: EngineInterface, list: readonly Shared[], now: number) => {
  if (!list.length) return
  if (now - toldSwept > 3_600_000) {
    toldSwept = now
    await runOn($, ['find', toldDir(), '-mindepth', '1', '-maxdepth', '1', '-mmin', '+120', '-exec', 'rmdir', '{}', '+']).catch(() => undefined)
  }
  let config: { notifications?: unknown } = {}
  try {
    config = JSON.parse((await readOr($, `${dir}/config.json`)) || '{}') as typeof config
  } catch {
    // A config.json being edited leaves them on
  }
  for (const s of list) {
    const opens = openUrl(s, heldApp(s))
    const where = `${chatName(s)} on ${macName(s.host)}`
    for (const card of s.cards) {
      const id = remoteId(s, card.id)
      if (card.ask && Math.abs(now - card.ask.at) < AFAR_FRESH) await tellOnce($, `ask-${id}-${card.ask.at}`, () => aloud($, 'ask', `${titleOf(card)} has a question for you`, `${card.ask?.text ?? ''} · ${where}`, `ask-${id}`, opens))
      if (card.status !== 'working' && card.endedAt && now - card.endedAt < AFAR_FRESH && config.notifications !== false) {
        const item = readyOf({ id: card.id }, [card], [])
        if (item) await tellOnce($, `end-${id}`, () => alertPerson($, 'ready', item.title, `${item.what} · ${where}`, `ready-${id}`, undefined, opens))
      }
    }
    for (const p of s.prompts ?? []) if (Math.abs(now - p.at) < AFAR_FRESH) await tellOnce($, `prompt-${s.host}-${s.chat}-${p.id}`, () => aloud($, 'prompt', `${p.title ?? chatName(s)} has a question for you`
, `${p.text} · ${where}`, `prompt-${s.chat}-${p.id}`, opens))
  }
}
