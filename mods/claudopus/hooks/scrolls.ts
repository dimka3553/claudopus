// The panel pulled back to a box the person types in. In the desktop app, while a reply box or a key box holds the focus, each
// scroll of the person's is followed within a few hundredths of a second by a move the other way that puts the box back in view:
// the app rebuilds the pane at the drawing each scroll asks for and its scroller moves back to the focused box, and it reports that
// move as the person's own. Scrolling up away from the box was undone at every wheel tick, and the panel sat at its bottom while
// they typed (15 Nov, recorded in the real app: 264 such turns while the box held the focus, none while it did not). Such a move is
// refused: the engine then leaves the window where the person put it and draws nothing, so nothing pulls again. Nothing here
// touches the engine

export type ScrollMove = { at: number; by: number }

// How soon after the person's move the app's pull back comes: 3 to 58 ms in the recording. A person turning the wheel the other
// way within this time is not seen
export const PULL_BACK = 120

// A move this many rows or more in one go, many times the person's last, is no wheel tick of theirs: theirs were at most 9 rows in
// the recordings, while the app's pulls in the person's own direction were 50 to 62
export const PULL_JUMP = 20

// Whether a move reported as the person's is the app's pull back to the focused box: at once after their last move, either the other
// way, or the same way but a jump many times as far
export const isPulledBack = (last: ScrollMove | undefined, move: ScrollMove, isBoxFocused: boolean) => {
  if (!isBoxFocused || last === undefined || last.by === 0 || move.by === 0 || move.at - last.at < 0 || move.at - last.at >= PULL_BACK) return false
  return Math.sign(move.by) !== Math.sign(last.by) || (Math.abs(move.by) >= PULL_JUMP && Math.abs(move.by) >= 4 * Math.abs(last.by))
}
