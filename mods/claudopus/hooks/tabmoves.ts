// Tab moves a press asks for in the terminal, done by that press's own hook. A button's onPress runs with the handle of the drawing
// it sits in, which the engine never counts as the person asking, so a narrow terminal (under 144 columns, a phone over ssh) left
// every tab a press opened undrawn. While a press of the mod's is answered, an open or close is handed here as data, and the press's
// `ui.press` hook, whose handle the engine counts as the person's, does it. Nothing here touches the engine: the hook passes in what
// does a move and what sleeps

export type TabMove = { kind: 'front'; id: string; title: string } | { kind: 'back'; id: string }

// The engine counts an open as the person's for 10 s after their press; past that a press's hook waits no longer
export const TAB_MOVES_WAIT = 10_000

export const tabMoveQueue = () => {
  // Presses being answered: two may overlap (a double tap, x while a Details tab reads its card)
  let pressing = 0
  // Opens a press started that read something before their move, counted until they settle
  let coming = 0
  const queue: { move: TabMove; done: () => void; failed: (err: unknown) => void }[] = []
  // Every press's hook waiting for a move or a coming open to settle: each is woken, so none is left waiting
  const waiting = new Set<() => void>()
  const wake = () => {
    const all = [...waiting]
    waiting.clear()
    for (const one of all) one()
  }
  return {
    isPressing: () => pressing > 0,
    // A move from a press: done by a press's hook, settling once it is done
    handOver: (move: TabMove) =>
      new Promise<void>((done, failed) => {
        queue.push({ move, done, failed })
        wake()
      }),
    // An open that reads first, started by a press: the press's hook waits for its move
    coming: <T>(opening: Promise<T>): Promise<T> => {
      if (!pressing) return opening
      coming += 1
      return opening.finally(() => {
        coming -= 1
        wake()
      })
    },
    begin: () => {
      pressing += 1
    },
    // The press's hook, once its onPress has run: every move handed over, as they come, until none is on its way, waiting at most
    // TAB_MOVES_WAIT for an open still reading. The press ends in the same step as the last look, so no move is handed over after it
    // with nobody to do it
    finish: async (run: (move: TabMove) => Promise<void>, sleep: (ms: number) => Promise<void>) => {
      let isLate = false
      let timer: Promise<void> | undefined
      try {
        while (queue.length || (coming > 0 && !isLate)) {
          const one = queue.shift()
          if (one) {
            await run(one.move).then(one.done, one.failed)
            continue
          }
          timer ??= sleep(TAB_MOVES_WAIT)
            .then(() => {
              isLate = true
              wake()
            })
            .catch(() => undefined)
          await new Promise<void>(woken => waiting.add(woken))
        }
      } finally {
        pressing -= 1
      }
    },
  }
}
