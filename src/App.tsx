import Piano from './Components/Piano'
import useSynthStore, { SynthMode } from './Hooks/useSynthStore'
import useKeyboardMapping from './Hooks/useKeyboardMapping'
import useMidi from './Hooks/useMidi'
import Oscilloscope from './Components/Oscilloscope'
import Spectrum from './Components/Spectrum'
import useIsMobile from './Hooks/useIsMobile'
import { create } from 'zustand'
import WaveLegend from './Components/WaveLegend'
import Presets from './presets.json'
import { Waveform, waveforms } from './utils'

type AppState = {
  octave: number
  setOctave: (octave: number) => void
}

const useAppStore = create<AppState>((set) => ({
  octave: 4,
  setOctave: (octave) => set({ octave }),
}))

function ModulatorControls() {
  const mode = useSynthStore((state) => state.mode)
  const [modLevel, setModLevel] = [useSynthStore((state) => state.modLevel), useSynthStore((state) => state.setModLevel)]
  const [modRatio, setModRatio] = [useSynthStore((state) => state.modRatio), useSynthStore((state) => state.setModRatio)]
  const [modOffset, setModOffset] = [useSynthStore((state) => state.modOffset), useSynthStore((state) => state.setModOffset)]
  const [modIdx, setModIdx] = [useSynthStore((state) => state.modIdx), useSynthStore((state) => state.setModIdx)]
  const [modDepth, setModDepth] = [useSynthStore((state) => state.modDepth), useSynthStore((state) => state.setModDepth)]
  const [modWaveform, setModWaveform] = [useSynthStore((state) => state.modWaveform), useSynthStore((state) => state.setModWaveform)]
  const [modWavePhase, setModWavePhase] = [useSynthStore((state) => state.modWavePhase), useSynthStore((state) => state.setModWavePhase)]
  const [modWaveN, setModWaveN] = [useSynthStore((state) => state.modWaveN), useSynthStore((state) => state.setModWaveN)]
  const modComps = useSynthStore((state) => state.modComps)

  return <div className="border border-black">
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
      <label>Modulator Waveform</label>
      <select
        value={modWaveform}
        onChange={(e) => setModWaveform(e.target.value as any)}
      >
        {waveforms.map((waveform) => (
          <option key={waveform.waveform} value={waveform.waveform}>{waveform.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label>Modulator Wave Phase</label>
      <input
        type='range' min={0} max={6.28} step={0.0001}
        value={modWavePhase}
        onChange={(e) => setModWavePhase(parseFloat(e.target.value))}
      />
      <input
        type='number' min={0} max={6.28}
        value={modWavePhase}
        onChange={(e) => setModWavePhase(parseFloat(e.target.value))}
      />
      <span>rad</span>
    </div>
    <div>
      <label>Modulator Partial Count</label>
      <input
        type='range' min={1} max={512} step={1}
        value={modWaveN}
        onChange={(e) => setModWaveN(parseInt(e.target.value))}
      />
      <input
        type='number' min={1} max={512}
        value={modWaveN}
        onChange={(e) => setModWaveN(parseInt(e.target.value))}
      />
    </div>
    <div>
      <label>Modulator Ratio</label>
      <input
        type='range' min={0} max={64} step={0.0001}
        value={modRatio}
        onChange={(e) => setModRatio(parseFloat(e.target.value))}
      />
      <span>x</span>
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
    {mode === 'FM' && <>
      <div>
        <label>Modulator Index</label>
        <input
          type='range' min={0} max={50} step={1}
          value={modIdx}
          onChange={(e) => setModIdx(parseFloat(e.target.value))}
        />
        <span>x</span>
        <input
          type='number' min={0} max={50}
          value={modIdx}
          onChange={(e) => setModIdx(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Modulator Depth</label>
        <input
          type='range' min={0} max={1000} step={0.0001}
          value={modDepth}
          onChange={(e) => setModDepth(parseFloat(e.target.value))}
        />
        <input
          type='number' min={0} max={1000}
          value={modDepth}
          onChange={(e) => setModDepth(parseFloat(e.target.value))}
        />
        <span>Hz</span>
      </div>
    </>}
    <div className='px-1'>
      <WaveLegend real={modComps.real} imag={modComps.imag} className='w-full h-[4rem] bg-black text-[#00ff00]' />
    </div>
  </div>
}

function CarrierControls() { 
  const [volume, setVolume] = [useSynthStore((state) => state.volume), useSynthStore((state) => state.setVolume)]
  const [carWaveform, setCarWaveform] = [useSynthStore((state) => state.carWaveform), useSynthStore((state) => state.setCarWaveform)]
  const [carWavePhase, setCarWavePhase] = [useSynthStore((state) => state.carWavePhase), useSynthStore((state) => state.setCarWavePhase)]
  const [carWaveN, setCarWaveN] = [useSynthStore((state) => state.carWaveN), useSynthStore((state) => state.setCarWaveN)]
  const carComps = useSynthStore((state) => state.carComps)

  return <div className="border border-black flex flex-col">
    <div>
      <label>Carrier Volume</label>
      <input
        type='range' min={0} max={1} step={0.0001}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      <input
        type='number' min={0} max={1}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
    <div>
      <label>Carrier Waveform</label>
      <select
        value={carWaveform}
        onChange={(e) => setCarWaveform(e.target.value as any)}
      >
        {waveforms.map((waveform) => (
          <option key={waveform.waveform} value={waveform.waveform}>{waveform.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label>Carrier Wave Phase</label>
      <input
        type='range' min={0} max={6.28} step={0.0001}
        value={carWavePhase}
        onChange={(e) => setCarWavePhase(parseFloat(e.target.value))}
      />
      <input
        type='number' min={0} max={6.28}
        value={carWavePhase}
        onChange={(e) => setCarWavePhase(parseFloat(e.target.value))}
      />
      <span>rad</span>
    </div>
    <div>
      <label>Carrier Partial Count</label>
      <input
        type='range' min={1} max={512} step={1}
        value={carWaveN}
        onChange={(e) => setCarWaveN(parseInt(e.target.value))}
      />
      <input
        type='number' min={1} max={512}
        value={carWaveN}
        onChange={(e) => setCarWaveN(parseInt(e.target.value))}
      />
    </div>
    <div className='grow' />
    <div className='px-1'>
      <WaveLegend real={carComps.real} imag={carComps.imag} className='w-full h-[4rem] bg-black text-[#00ff00]' />
    </div>
  </div>
}

function PresetsManager() {
  const setVolume = useSynthStore((state) => state.setVolume)
  const setMode = useSynthStore((state) => state.setMode)
  const setModLevel = useSynthStore((state) => state.setModLevel)
  const setModRatio = useSynthStore((state) => state.setModRatio)
  const setModOffset = useSynthStore((state) => state.setModOffset)
  const setModIdx = useSynthStore((state) => state.setModIdx)
  const setModDepth = useSynthStore((state) => state.setModDepth)
  const setModWaveform = useSynthStore((state) => state.setModWaveform)
  const setModWavePhase = useSynthStore((state) => state.setModWavePhase)
  const setModWaveN = useSynthStore((state) => state.setModWaveN)
  const setCarWaveform = useSynthStore((state) => state.setCarWaveform)
  const setCarWavePhase = useSynthStore((state) => state.setCarWavePhase)
  const setCarWaveN = useSynthStore((state) => state.setCarWaveN)

  return <div>
    <label>Presets</label>
    <select onChange={(e) => {
      const preset = Presets['presets'][parseInt(e.target.value)]
      setVolume(preset.state.volume)
      setMode(preset.state.mode as SynthMode)
      setModLevel(preset.state.modLevel)
      setModRatio(preset.state.modRatio)
      setModOffset(preset.state.modOffset)
      setModIdx(preset.state.modIdx)
      setModDepth(preset.state.modDepth)
      setModWaveform(preset.state.modWaveform as Waveform)
      setModWavePhase(preset.state.modWavePhase)
      setModWaveN(preset.state.modWaveN)
      setCarWaveform(preset.state.carWaveform as Waveform)
      setCarWavePhase(preset.state.carWavePhase)
      setCarWaveN(preset.state.carWaveN)
    }}>
      {Presets['presets'].map((preset, i) => (
        <option key={i} value={i}>{preset.name}</option>
      ))}
    </select>
  </div>
}

function Controls() {
  const lastNoteHz = useSynthStore((state) => state.lastNoteHz)
  const analyzer = useSynthStore((state) => state.analyzer)
  const initSynth = useSynthStore((state) => state.init)
  const [masterVolume, setMasterVolume] = [useSynthStore((state) => state.masterVolume), useSynthStore((state) => state.setMasterVolume)]
  const [mode, setMode] = [useSynthStore((state) => state.mode), useSynthStore((state) => state.setMode)]
  const [maxVoices, setMaxVoices] = [useSynthStore((state) => state.maxVoices), useSynthStore((state) => state.setMaxVoices)]
  const [octave, setOctave] = [useAppStore((state) => state.octave), useAppStore((state) => state.setOctave)]

  return <>
    <PresetsManager />
    <div>
      <label>Master Volume</label>
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
    <div className='flex'>
      <ModulatorControls />
      <CarrierControls />
    </div>
    <div>
      <label>Max Voices</label>
      <input
        type='range' min={1} max={8} step={1}
        value={maxVoices}
        onChange={(e) => setMaxVoices(parseInt(e.target.value))}
      />
      <input
        type='number' min={1} max={8}
        value={maxVoices}
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
    <Oscilloscope
      analyzer={analyzer}
      alignHz={lastNoteHz}
      className='w-[32rem] h-[8rem] bg-black text-[#00ff00]'
    />
    <Spectrum
      analyzer={analyzer}
      className='w-[32rem] h-[8rem] bg-black text-[#00ff00]'
    />
  </>
}

function PianoSection() {
  const octave = useAppStore((state) => state.octave)
  const pressedNotes = useSynthStore((state) => state.pressedNotes)
  const noteOn = useSynthStore((state) => state.noteOn)
  const noteOff = useSynthStore((state) => state.noteOff)

  useKeyboardMapping(
    (note) => noteOn(octave * 12 + note),
    (note) => noteOff(octave * 12 + note),
  )

  useMidi(
    (note) => noteOn(note),
    (note) => noteOff(note),
  )

  return (
    <Piano
      octave={octave}
      blackKeyRatio={0.6}
      className='w-full h-[16rem]'
      whiteKeyClassName='bg-white outline outline-1 data-[pressed=true]:bg-red-500'
      blackKeyClassName='bg-black outline outline-1 data-[pressed=true]:bg-red-500'
      onNoteDown={(note) => noteOn(note)}
      onNoteUp={(note) => noteOff(note)}
      pressedNotes={pressedNotes}
    />
  )
}


function App() {
  const initSynth = useSynthStore((state) => state.init)
  const audioCtxState = useSynthStore((state) => state.audioCtx?.state || '')
  const isMobile = useIsMobile()
  

  return (
    <>
      <div className='fixed flex flex-col w-full h-full'>
        <h1>Web Audio Synth</h1>
        <div className='grow overflow-y-auto'>
          <Controls />
        </div>
        <PianoSection />
      </div>
      {audioCtxState !== 'running' && (
        <div
          className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 select-none text-8xl w-full h-full'
          onClick={initSynth}
        >
          {isMobile && 'Touch' || 'Click'} to Start
        </div>
      )}
    </>
  )
}

export default App
