import { useState } from 'react'

import Piano from './Components/Piano'
import useSynthStore from './Hooks/useSynthStore'
import useKeyboardMapping from './Hooks/useKeyboardMapping'
import useMidi from './Hooks/useMidi'
import Oscilloscope from './Components/Oscilloscope'
import { mobileAndTabletCheck } from './utils'


function App() {
  const initSynth = useSynthStore((state) => state.init)
  const audioCtxState = useSynthStore((state) => state.audioCtx?.state || '')
  const noteOn = useSynthStore((state) => state.noteOn)
  const noteOff = useSynthStore((state) => state.noteOff)
  const [masterVolume, setMasterVolume] = [useSynthStore((state) => state.masterVolume), useSynthStore((state) => state.setMasterVolume)]
  const [mode, setMode] = [useSynthStore((state) => state.mode), useSynthStore((state) => state.setMode)]
  const [modLevel, setModLevel] = [useSynthStore((state) => state.modLevel), useSynthStore((state) => state.setModLevel)]
  const [modRatio, setModRatio] = [useSynthStore((state) => state.modRatio), useSynthStore((state) => state.setModRatio)]
  const [modOffset, setModOffset] = [useSynthStore((state) => state.modOffset), useSynthStore((state) => state.setModOffset)]
  const [maxVoicse, setMaxVoices] = [useSynthStore((state) => state.maxVoices), useSynthStore((state) => state.setMaxVoices)]
  const analyzer = useSynthStore((state) => state.analyzer)
  const pressedNotes = useSynthStore((state) => state.pressedNotes)

  const [octave, setOctave] = useState(4)

  useKeyboardMapping(
    (note) => noteOn(octave * 12 + note),
    (note) => noteOff(octave * 12 + note),
  )

  useMidi(
    (note) => noteOn(note),
    (note) => noteOff(note),
  )

  return (
    <>
      <h1>Web Audio Synth</h1>
      {/* modulator ratio */}
      <div>
        <label>Volume</label>
        <input
          type='range' min={0} max={1} step={0.0001}
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
        />
        <input
          type='number' min={0} max={1}  
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
        >
          <option value='FM'>FM</option>
          <option value='AM'>AM</option>
        </select>
      </div>
      <div>
        <label>Modulator Level</label>
        <input
          type='range' min={0} max={1} step={0.0001}
          value={modLevel}
          onChange={(e) => setModLevel(parseFloat(e.target.value))}
        />
        <input
          type='number' min={0} max={1}
          value={modLevel}
          onChange={(e) => setModLevel(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Modulator Ratio</label>
        <input
          type='range' min={0} max={64} step={0.0001}
          value={modRatio}
          onChange={(e) => setModRatio(parseFloat(e.target.value))}
        />
        <input
          type='number' min={0} max={64}
          value={modRatio}
          onChange={(e) => setModRatio(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Modulator Offset</label>
        <input
          type='range' min={-1000} max={1000} step={0.0001}
          value={modOffset}
          onChange={(e) => setModOffset(parseFloat(e.target.value))}
        />
        <input
          type='number' min={-1000} max={1000}
          value={modOffset}
          onChange={(e) => setModOffset(parseFloat(e.target.value))}
        />
        <span>Hz</span>
      </div>
      <div>
        <label>Max Voices</label>
        <input
          type='range' min={1} max={8} step={1}
          value={maxVoicse}
          onChange={(e) => setMaxVoices(parseInt(e.target.value))}
        />
        <input
          type='number' min={1} max={8}
          value={maxVoicse}
          onChange={(e) => setMaxVoices(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Octave</label>
        <input
          type='range' min={0} max={8} step={1}
          value={octave}
          onChange={(e) => setOctave(parseInt(e.target.value))}
        />
        <input
          type='number' min={0} max={8}
          value={octave}
          onChange={(e) => setOctave(parseInt(e.target.value))}
        />
      </div>
      <div>
        <button onClick={initSynth} className='outline outline-1'>Kill Synth</button>
      </div>
      <Piano
        octave={octave}
        octaves={4}
        blackKeyRatio={0.6}
        className='w-[64rem] h-[8rem]'
        whiteKeyClassName='bg-white outline outline-1 data-[pressed=true]:bg-red-500'
        blackKeyClassName='bg-black outline outline-1 data-[pressed=true]:bg-red-500'
        onNoteDown={(note) => noteOn(note)}
        onNoteUp={(note) => noteOff(note)}
        pressedNotes={pressedNotes}
      />
      <Oscilloscope
        analyzer={analyzer}
        className={`w-[32rem] h-[8rem] bg-slate-400`}
      />
      {audioCtxState !== 'running' && (
        <div
          className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 select-none text-8xl w-full h-full'
          onClick={initSynth}
        >
          {mobileAndTabletCheck() && 'Touch' || 'Click'} to Start
        </div>
      )}
    </>
  )
}

export default App
