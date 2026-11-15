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

// Whether a move reported as the person's is the app's pull back to the focused box: the other way from their last move, at once
export const isPulledBack = (last: ScrollMove | undefined, move: ScrollMove, isBoxFocused: boolean) =>
  isBoxFocused && last !== undefined && last.by !== 0 && move.by !== 0 && Math.sign(move.by) !== Math.sign(last.by) && move.at - last.at >= 0 && move.at - last.at < PULL_BACK
