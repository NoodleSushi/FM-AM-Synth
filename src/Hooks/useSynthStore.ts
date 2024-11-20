import { create } from 'zustand'
import { midiToHz } from '../utils'

type SynthMode = 'FM' | 'AM'

type Voice = {
  note: number
  modOsc: OscillatorNode,
  modDepth: GainNode,
  modEnv: GainNode,
  modLevel: GainNode,
  DCOffset: ConstantSourceNode,
  modOut: GainNode,
  carOsc: OscillatorNode,
  carDepth: GainNode,
  carEnv: GainNode,
}

interface SynthState {
  audioCtx: AudioContext,
  voices: Voice[],
  started: boolean,
  noteVoiceMap: Record<number, Set<Voice>>,
  pressedNotes: Set<number>,
  modLevelConstSource: ConstantSourceNode,
  modFreqConstSource: ConstantSourceNode,
  analyzer: AnalyserNode,
  masterGain: GainNode,
  mode: SynthMode,
  maxVoices: number,
  masterVolume: number,
  modLevel: number,
  modRatio: number,
  modOffset: number,
  setMode: (mode: SynthMode) => void,
  setMaxVoices: (maxVoices: number) => void,
  setMasterVolume: (masterVolume: number) => void,
  setModLevel: (modLevel: number) => void,
  setModRatio: (modRatio: number) => void,
  setModOffset: (modOffset: number) => void,
  init: () => void,
  noteOn: (note: number) => void,
  noteOff: (note: number) => void,
}

function createVoice(note: number, mode: SynthMode, audioCtx: AudioContext, modLevelConstSource: ConstantSourceNode, dest?: AudioNode): Voice {
  const modOsc = audioCtx.createOscillator()
  const modDepth = audioCtx.createGain()
  const modEnv = new GainNode(audioCtx, { gain: 0 })
  const modLevel = new GainNode(audioCtx, { gain: 0 })
  const DCOffset = audioCtx.createConstantSource()
  const modOut = audioCtx.createGain()
  const carOsc = audioCtx.createOscillator()
  const carDepth = audioCtx.createGain()
  const carEnv = new GainNode(audioCtx, { gain: 0 })

  const now = audioCtx.currentTime

  modOsc.connect(modDepth)
  modDepth.connect(modEnv)
  modEnv.connect(modLevel)
  modLevelConstSource.connect(modLevel.gain)
  modLevel.connect(modOut)

  if (mode === 'FM') {
    modOut.connect(carOsc.frequency)
  } else {
    modOut.connect(carDepth.gain)
    DCOffset.offset.setValueAtTime(-1, now)
  }

  carOsc.connect(carDepth)
  carDepth.connect(carEnv)
  DCOffset.connect(modOut)
  DCOffset.start()
  carEnv.connect(dest ?? audioCtx.destination)

  carOsc.start()
  modOsc.start()

  return {
    note,
    modOsc,
    modDepth,
    modEnv,
    modLevel,
    DCOffset,
    modOut,
    carOsc,
    carDepth,
    carEnv,
  }
}

function killVoice(voice: Voice) {
  voice.modOsc.disconnect()
  voice.modOsc.stop()
  voice.modDepth.disconnect()
  voice.modEnv.disconnect()
  voice.modLevel.disconnect()
  voice.DCOffset.disconnect()
  voice.DCOffset.stop()
  voice.modOut.disconnect()
  voice.carOsc.disconnect()
  voice.carOsc.stop()
  voice.carDepth.disconnect()
  voice.carEnv.disconnect()
}

const useSynthStore = create<SynthState>((set, get) => ({
  audioCtx: new window.AudioContext(),
  modLevelConstSource: null as unknown as ConstantSourceNode,
  modFreqConstSource: null as unknown as ConstantSourceNode,
  analyzer: null as unknown as AnalyserNode,
  masterGain: null as unknown as GainNode,
  voices: [],
  started: false,
  pressedNotes: new Set(),
  noteVoiceMap: {},
  mode: 'FM',
  maxVoices: 4,
  modLevel: 1,
  modRatio: 1,
  modOffset: 0,
  masterVolume: 0.2,
  init: () => {
    const audioCtx = get().audioCtx
    let started = get().started
    const modLevelConstSource = get().modLevelConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modLevel,
    })

    if (!started && audioCtx.state === 'running') {
      modLevelConstSource.start()
      started = true
    }

    const analyzer = get().analyzer ?? audioCtx.createAnalyser()
    const masterGain = get().masterGain ?? audioCtx.createGain()

    get().voices.forEach(killVoice)

    analyzer.disconnect()
    analyzer.connect(masterGain)
    masterGain.disconnect()
    masterGain.connect(audioCtx.destination)

    masterGain.gain.setValueAtTime(get().masterVolume, audioCtx.currentTime)

    set({ started, noteVoiceMap: {}, modLevelConstSource, analyzer, masterGain, voices: [] })
  },
  noteOn: (note: number) => {
    const mode = get().mode
    const now = get().audioCtx.currentTime
    const noteHz = midiToHz(note)
    const voice = createVoice(note, mode, get().audioCtx, get().modLevelConstSource, get().analyzer)
    const outputFrequency = noteHz * get().modRatio + get().modOffset

    voice.carOsc.frequency.setValueAtTime(noteHz, now)
    voice.modOsc.frequency.setValueAtTime(outputFrequency, now)
    if (mode === 'FM') {
      voice.modDepth.gain.setValueAtTime(13 * outputFrequency, now)
    }

    voice.modEnv.gain.setValueAtTime(1, now)
    voice.carEnv.gain.setValueAtTime(1, now)
    
    const allVoices = [...get().voices, voice]
    const maxVoices = get().maxVoices
    const voices = allVoices.slice(Math.max(0, allVoices.length - maxVoices))
    const voicesToKill = allVoices.slice(0, allVoices.length - maxVoices)

    const noteVoiceMap = get().noteVoiceMap
    const pressedNotes = get().pressedNotes

    voicesToKill.forEach((voice) => {
      killVoice(voice)
      noteVoiceMap[voice.note]?.delete(voice)
      if (noteVoiceMap[voice.note]?.size === 0 || false) {
        pressedNotes.delete(voice.note)
      }
    })

    noteVoiceMap[note] ??= new Set()
    noteVoiceMap[note].add(voice)
    pressedNotes.add(note)

    set({ voices, pressedNotes: new Set(pressedNotes) })
  },
  noteOff: (note: number) => {
    const now = get().audioCtx.currentTime
    const noteSet = get().noteVoiceMap[note]

    if (!noteSet) return
    
    noteSet.forEach((voice) => {
      voice.carEnv.gain.setValueAtTime(0, now)
    })

    noteSet.clear()
    const pressedNotes = get().pressedNotes
    pressedNotes.delete(note)
    set({ pressedNotes: new Set(pressedNotes) })
  },
  setMode: (mode: SynthMode) => {
    set({ mode })
  },
  setModLevel: (modLevel: number) => {
    set({ modLevel })
    get().modLevelConstSource.offset.setValueAtTime(modLevel, get().audioCtx.currentTime)
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