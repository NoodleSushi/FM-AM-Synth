import { useEffect } from 'react'

function useMidi(onNoteOn?: (note: number) => void, onNoteOff?: (note: number) => void) {
  useEffect(() => {
    navigator.requestMIDIAccess().then((midiAccess) => {
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = (e) => {
          if (e.data) {
            const [command, note] = e.data
            if (command === 144) {
              if (onNoteOn) onNoteOn(note)
            } else if (command === 128) {
              if (onNoteOff) onNoteOff(note)
            }
          }
        }
      }
    }).catch((err) => {
      console.error('Failed to get MIDI access', err);
    })
  }, [])
}

export default useMidi