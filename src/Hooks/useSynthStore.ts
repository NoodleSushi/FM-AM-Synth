import { create } from 'zustand'
import { midiToHz } from '../utils'

type SynthMode = 'FM' | 'AM'

type Voice = {
  note: number
  modOsc: OscillatorNode,
  modDepth: GainNode,
  modGain: GainNode,
  carOsc: OscillatorNode,
  carDepth: GainNode,
  carGain: GainNode,
}

interface SynthState {
  audioCtx: AudioContext,
  voices: Voice[],
  noteVoiceMap: Record<number, Set<Voice>>,
  modFreqConstSource: ConstantSourceNode,
  analyzer: AnalyserNode,
  masterGain: GainNode,
  mode: SynthMode,
  maxVoices: number,
  masterVolume: number,
  modRatio: number,
  modOffset: number,
  setMaxVoices: (maxVoices: number) => void,
  setMasterVolume: (masterVolume: number) => void,
  setModRatio: (modRatio: number) => void,
  setModOffset: (modOffset: number) => void,
  init: () => void,
  noteOn: (note: number) => void,
  noteOff: (note: number) => void,
}

function createVoice(note: number, audioCtx: AudioContext, dest?: AudioNode): Voice {
  const modOsc = audioCtx.createOscillator()
  const modDepth = audioCtx.createGain()
  const modGain = audioCtx.createGain()
  const carOsc = audioCtx.createOscillator()
  const carDepth = audioCtx.createGain()
  const carGain = audioCtx.createGain()

  const now = audioCtx.currentTime

  modOsc.connect(modDepth)
  modDepth.connect(modGain)

  modGain.connect(carOsc.frequency)
  carOsc.connect(carDepth)
  carDepth.connect(carGain)
  carGain.connect(dest ?? audioCtx.destination)

  carOsc.start()
  modOsc.start()

  modDepth.gain.setValueAtTime(1, now)
  carDepth.gain.setValueAtTime(1, now)
  carGain.gain.setValueAtTime(0, now)

  return {
    note,
    modOsc,
    modDepth,
    modGain,
    carOsc,
    carDepth,
    carGain,
  }
}

function killVoice(voice: Voice) {
  voice.modOsc.stop()
  voice.carOsc.stop()
  voice.modOsc.disconnect()
  voice.modDepth.disconnect()
  voice.modGain.disconnect()
  voice.carOsc.disconnect()
  voice.carDepth.disconnect()
  voice.carGain.disconnect()
}

const useSynthStore = create<SynthState>((set, get) => ({
  audioCtx: new window.AudioContext(),
  modFreqConstSource: null as unknown as ConstantSourceNode,
  analyzer: null as unknown as AnalyserNode,
  masterGain: null as unknown as GainNode,
  voices: [],
  noteVoiceMap: {},
  mode: 'FM',
  maxVoices: 4,
  modRatio: 1,
  modOffset: 0,
  masterVolume: 0.2,
  init: () => {
    const audioCtx = get().audioCtx
    const analyzer = get().analyzer ?? audioCtx.createAnalyser()
    const masterGain = get().masterGain ?? audioCtx.createGain()

    get().voices.forEach(killVoice)

    analyzer.disconnect()
    analyzer.connect(masterGain)
    masterGain.disconnect()
    masterGain.connect(audioCtx.destination)

    masterGain.gain.setValueAtTime(get().masterVolume, audioCtx.currentTime)

    set({ noteVoiceMap: {}, analyzer, masterGain, voices: [] })
  },
  noteOn: (note: number) => {
    const now = get().audioCtx.currentTime
    const noteHz = midiToHz(note)
    const voice = createVoice(note, get().audioCtx, get().analyzer)
    const allVoices = [...get().voices, voice]
    const maxVoices = get().maxVoices
    const voices = allVoices.slice(Math.max(0, allVoices.length - maxVoices))
    const voicesToKill = allVoices.slice(0, allVoices.length - maxVoices)

    const noteVoiceMap = get().noteVoiceMap

    voicesToKill.forEach((voice) => {
      killVoice(voice)
      noteVoiceMap[voice.note]?.delete(voice)
    })

    noteVoiceMap[note] ??= new Set()
    noteVoiceMap[note].add(voice)

    const outputFrequency = noteHz * get().modRatio + get().modOffset

    voice.carOsc.frequency.setValueAtTime(noteHz, now)
    voice.modOsc.frequency.setValueAtTime(outputFrequency, now)
    voice.modGain.gain.setValueAtTime(13 * outputFrequency, now)

    voice.carGain.gain.setTargetAtTime(1, now, 0.1)

    set({ voices })
  },
  noteOff: (note: number) => {
    const now = get().audioCtx.currentTime
    const noteSet = get().noteVoiceMap[note]

    if (!noteSet) return
    
    noteSet.forEach((voice) => {
      voice.carGain.gain.setTargetAtTime(0, now, 0.25)
    })

    noteSet.clear()
  },
  setModRatio: (modRatio: number) => {
    set({ modRatio })
  },
  setModOffset: (modOffset: number) => {
    set({ modOffset })
  },
  setMasterVolume: (volume: number) => {
    set({ masterVolume: volume })
    get().masterGain.gain.setValueAtTime(volume, get().audioCtx.currentTime)
  },
  setMaxVoices: (maxVoices: number) => {
    maxVoices = Math.min(Math.max(1, maxVoices), 8)
    set({ maxVoices })
    get().voices.forEach(killVoice)
    set({ voices: [], noteVoiceMap: {} })
  },
}))

export default useSynthStore