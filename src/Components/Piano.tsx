import * as _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { twMerge } from 'tailwind-merge'

/*
  0b00 0 - white key
  0b01 1 - black key
  0b10 2 - black key nudged left
  0b11 3 - black key nudged right
*/

const BLACK_KEY_NUDGES = [2, 3, 0, 2, 1, 3, 0]
const WHITE_NOTE_MAPPING = [0, 2, 4, 5, 7, 9, 11]

type PianoProps = {
  octave?: number
  pxPerKey?: number
  blackKeyRatio?: number
  whiteKeyClassName: string
  blackKeyClassName: string
  onNoteDown?: (note: number) => void
  onNoteUp?: (note: number) => void
  pressedNotes?: Set<number>
} & React.HTMLAttributes<HTMLDivElement>

function Piano({
  octave = 4,
  pxPerKey = 72,
  blackKeyRatio = 0.5,
  whiteKeyClassName,
  blackKeyClassName,
  onNoteDown,
  onNoteUp,
  pressedNotes,
  ...props
}: PianoProps) {
  const noteStart = octave * 12

  const handlePointerDown = (note: number) => (e: React.PointerEvent) => {
    onNoteDown?.(note);
    const handlePointerUp = () => {
      onNoteUp?.(note);
      e.target.removeEventListener("pointerleave", handlePointerUp);
      e.target.removeEventListener("pointerup", handlePointerUp);
    };
    e.target.addEventListener("pointerleave", handlePointerUp, { once: true });
    e.target.addEventListener("pointerup", handlePointerUp, { once: true });
  }

  const handlePointerEnter = (note: number) => (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    handlePointerDown(note)(e);
  }

  const [octaves, setOctaves] = useState(4)

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      var rect = divRef.current?.getBoundingClientRect();
      if (!rect) return;
      setOctaves(Math.round(rect.width / (pxPerKey * 7)) || 1);
    });

    resizeObserver.observe(divRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pxPerKey]);

  return (
    <div {...props}>
      <div
        className="relative w-full h-full"
        ref={divRef}
      >
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
              className={twMerge("absolute h-full ", whiteKeyClassName)}
              style={{
                left: `${width * i}%`,
                right: `${100 - width * (i + 1)}%`,
                zIndex: 0,
              }}
              onPointerDown={handlePointerDown(note)}
              onPointerEnter={handlePointerEnter(note)}
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
                onPointerDown={handlePointerDown(note)}
                onPointerEnter={handlePointerEnter(note)}
              />
            )
          })}
      </div>
    </div>
  )
}

export default Piano
