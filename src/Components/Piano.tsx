import * as _ from "lodash"
import { twMerge } from 'tailwind-merge'

/*
  0b00 0 - white key
  0b01 1 - black key
  0b10 2 - black key nudged left
  0b11 3 - black key nudged right
*/

type PianoProps = {
  octave?: number
  octaves?: number
  blackKeyRatio?: number
  whiteKeyClassName: string
  blackKeyClassName: string
  onNoteDown?: (note: number) => void
  onNoteUp?: (note: number) => void
  pressedNotes?: Set<number>
} & React.HTMLAttributes<HTMLDivElement>

function Piano({
  octave = 4,
  octaves = 7,
  blackKeyRatio = 0.5,
  whiteKeyClassName,
  blackKeyClassName,
  onNoteDown,
  onNoteUp,
  pressedNotes,
  ...props
}: PianoProps) {
  const BLACK_KEY_NUDGES = [2, 3, 0, 2, 1, 3, 0]
  const WHITE_NOTE_MAPPING = [0, 2, 4, 5, 7, 9, 11]
  const noteStart = octave * 12

  const handleMouseDown = (note: number) => () => {
    onNoteDown?.(note);
    const handleMouseUp = () => {
      onNoteUp?.(note);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("pointerout", handleMouseUp);
    };
    document.addEventListener("mouseup", handleMouseUp, { once: true });
    document.addEventListener("pointerout", handleMouseUp, { once: true });
  }

  const handleMouseEnter = (note: number) => (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Only handle if a button is pressed
    handleMouseDown(note)();
  }

  const handleTouchStart = (note: number) => () => onNoteDown?.(note);
  const handleTouchEnd = (note: number) => () => onNoteUp?.(note);

  return (
    <div {...props}>
      <div className="relative w-full h-full">
        {/* Render White Keys */}
        {_.range(7 * octaves).map((i) => {
          const width = 100 / (7 * octaves)
          const relOctave = Math.floor(i / 7)
          const note = noteStart + WHITE_NOTE_MAPPING[i % 7] + 12 * relOctave
          const isC = i % 7 === 0
          return (
            <div
              key={i}
              data-pressed={pressedNotes?.has(note) ? true : undefined}
              className={twMerge("absolute h-full", whiteKeyClassName)}
              style={{
                left: `${width * i}%`,
                right: `${100 - width * (i + 1)}%`,
                zIndex: 0,
              }}
              onMouseDown={handleMouseDown(note)}
              onMouseEnter={handleMouseEnter(note)}
              onTouchStart={handleTouchStart(note)}
              onTouchEnd={handleTouchEnd(note)}
            >
              {isC && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 select-none">
                C{octave + relOctave}
              </div>}
            </div>
          )
        })}
        {/* Render Black Keys */}
        {_.range(octaves)
          .flatMap(() => BLACK_KEY_NUDGES)
          .map((v, i) => {
            if (v === 0) return null
            const whiteSpan = 100 / (7 * octaves)
            const center = whiteSpan * (i + 1)
            const ratio = i % 7 < 3 ? 3 / 5 : 4 / 7
            const width = whiteSpan * ratio
            const nudgeFactor = ((i % 7 < 3 ? 3 : 4) * width) / (whiteSpan * octaves)
            const nudge = (v & 0b10) !== 0 ? nudgeFactor * (-1 + (v & 0b1) * 2) : 0
            const note = noteStart + WHITE_NOTE_MAPPING[i % 7] + 12 * Math.floor(i / 7) + 1
            return (
              <div
                key={i}
                data-pressed={pressedNotes?.has(note) ? true : undefined}
                className={twMerge("absolute", blackKeyClassName)}
                style={{
                  left: `${center - width / 2 + nudge}%`,
                  right: `${100 - (center + width / 2 + nudge)}%`,
                  top: 0,
                  bottom: `${100 - blackKeyRatio*100}%`,
                  zIndex: 1,
                }}
                onMouseDown={handleMouseDown(note)}
                onMouseEnter={handleMouseEnter(note)}
                onTouchStart={handleTouchStart(note)}
                onTouchEnd={handleTouchEnd(note)}
              />
            )
          })}
      </div>
    </div>
  )
}

export default Piano
