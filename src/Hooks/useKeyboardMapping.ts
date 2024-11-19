import { useEffect } from 'react'

const KEY_MAPPINGS: { [key: string]: number } = {
  'KeyZ': 0,
  'KeyS': 1,
  'KeyX': 2,
  'KeyD': 3,
  'KeyC': 4,
  'KeyV': 5,
  'KeyG': 6,
  'KeyB': 7,
  'KeyH': 8,
  'KeyN': 9,
  'KeyJ': 10,
  'KeyM': 11,
  'Comma': 12,
  'KeyL': 13,
  'Period': 14,
  'Semicolon': 15,
  'Slash': 16,
  'KeyQ': 12,
  'Digit2': 13,
  'KeyW': 14,
  'Digit3': 15,
  'KeyE': 16,
  'KeyR': 17,
  'Digit5': 18,
  'KeyT': 19,
  'Digit6': 20,
  'KeyY': 21,
  'Digit7': 22,
  'KeyU': 23,
  'KeyI': 24,
  'Digit9': 25,
  'KeyO': 26,
  'Digit0': 27,
  'KeyP': 28,
  'BracketLeft': 29,
  'Equal': 30,
  'BracketRight': 31,
}

const useKeyboardMapping = (onNoteOn?: (note: number) => void, onNoteOff?: (note: number) => void) => useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    const note = KEY_MAPPINGS[e.code]
    if (note !== undefined && !e.repeat) {
      e.preventDefault()
      if (onNoteOn) onNoteOn(note)
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }
    const note = KEY_MAPPINGS[e.code]
    if (note !== undefined) {
      e.preventDefault()
      if (onNoteOff) onNoteOff(note)
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  }
}, [onNoteOn, onNoteOff])

export default useKeyboardMapping