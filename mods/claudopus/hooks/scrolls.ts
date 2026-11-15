// The panel pulled back to a box the person types in. In the desktop app, while a reply box or a key box holds the focus, a scroll
// of the person's is followed, usually within 5 to 45 ms and often several times over, by a move that puts the box back in view
// (on 15 Nov, to the panel's last rows, where the box was), and the app reports that move as the person's own. Scrolling up away
// from the box was undone at every wheel tick and the panel sat at its bottom while they typed (recorded in the real app: 140 to
// 270 such turns a recording while the box held the focus, none while it did not). The move happens in the app before the mod
// hears of it, so the mod cannot stop it showing for a moment; it refuses it, and the window goes back to where the person put it.
// Nothing here touches the engine

export type ScrollMove = { at: number; by: number; to?: number }

// How soon after the person's move the app's pull back comes: 3 to 58 ms in the recording. A person turning the wheel the other
// way within this time is not seen
export const PULL_BACK = 120

// A move this many rows or more in one go, landing where the app's last pull landed, is the app's again
export const PULL_JUMP = 20
// How near, in rows, to where the last pull landed: the app's pulls landed within 63 to 70 on a 120-row panel
export const PULL_NEAR = 6
// A refused pull this many rows or more marks where the box is; smaller turns may be the trackpad's
export const PULL_MARKS = 5

// Whether a move reported as the person's is the app's pull back to the focused box: the other way from their last move at once, or,
// at any time, a jump that lands where the app's last refused pull landed (`pulledTo`), as the app pulls several times over and its
// later pulls come well after the person's tick. A jump of the person's own elsewhere, however far, is theirs
export const isPulledBack = (last: ScrollMove | undefined, move: ScrollMove, isBoxFocused: boolean, pulledTo?: number) => {
  if (!isBoxFocused || move.by === 0) return false
  if (pulledTo !== undefined && move.to !== undefined && Math.abs(move.by) >= PULL_JUMP && Math.abs(move.to - pulledTo) <= PULL_NEAR) return true
  if (last === undefined || last.by === 0 || move.at - last.at < 0 || move.at - last.at >= PULL_BACK) return false
  return Math.sign(move.by) !== Math.sign(last.by)
}
