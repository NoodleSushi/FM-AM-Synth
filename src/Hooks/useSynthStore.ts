import { create } from 'zustand'
import { midiToHz } from '../utils'

type SynthMode = 'FM' | 'AM'

type Voice = {
  note: number,
  noteFreq: ConstantSourceNode,
  noteRatio: GainNode,
  modFreq: GainNode,
  modIdx: GainNode,
  modOsc: OscillatorNode,
  modDepth: GainNode,
  modEnv: GainNode,
  modLevel: GainNode,
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
  modRatioConstSource: ConstantSourceNode,
  modOffsetConstSource: ConstantSourceNode,
  modLevelConstSource: ConstantSourceNode,
  DCOffsetConstSource: ConstantSourceNode,
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

function createVoice(
  note: number,
  mode: SynthMode,
  audioCtx: AudioContext,
  modRatioCS: ConstantSourceNode,
  modOffsetCS: ConstantSourceNode,
  modLevelCS: ConstantSourceNode,
  DCOffsetCS: ConstantSourceNode,
  dest?: AudioNode
): Voice {
  const noteFreq = new ConstantSourceNode(audioCtx, { offset: midiToHz(note) })
  const noteRatio = new GainNode(audioCtx, { gain: 0 })
  const modFreq = audioCtx.createGain()
  const modIdx = audioCtx.createGain()
  const modOsc = new OscillatorNode(audioCtx, { frequency: 0 })
  const modDepth = audioCtx.createGain()
  const modEnv = audioCtx.createGain()
  const modLevel = new GainNode(audioCtx, { gain: 0 })
  const modOut = audioCtx.createGain()
  const carOsc = audioCtx.createOscillator()
  const carDepth = audioCtx.createGain()
  const carEnv = audioCtx.createGain()

  const now = audioCtx.currentTime

  noteFreq.connect(noteRatio)
  modRatioCS.connect(noteRatio.gain)
  noteRatio.connect(modFreq)
  modOffsetCS.connect(modFreq)
  modFreq.connect(modOsc.frequency)

  modOsc.connect(modDepth)
  modDepth.connect(modEnv)
  modEnv.connect(modLevel)
  modLevelCS.connect(modLevel.gain)
  modLevel.connect(modOut)

  if (mode === 'FM') {
    modFreq.connect(modIdx)
    modIdx.gain.setValueAtTime(13, now)
    modIdx.connect(modDepth.gain)
    modOut.connect(carOsc.frequency)
  } else {
    modOut.connect(carDepth.gain)
    DCOffsetCS.connect(modOut)
  }

  carOsc.connect(carDepth)
  carDepth.connect(carEnv)
  carEnv.connect(dest ?? audioCtx.destination)

  carOsc.start()
  modOsc.start()
  noteFreq.start()

  return {
    note,
    noteFreq,
    noteRatio,
    modFreq,
    modIdx,
    modOsc,
    modDepth,
    modEnv,
    modLevel,
    modOut,
    carOsc,
    carDepth,
    carEnv,
  }
}

function killVoice(voice: Voice) {
  voice.noteFreq.stop()
  voice.modOsc.stop()
  voice.carOsc.stop()
}

const useSynthStore = create<SynthState>((set, get) => ({
  audioCtx: null as unknown as AudioContext,
  modRatioConstSource: null as unknown as ConstantSourceNode,
  modOffsetConstSource: null as unknown as ConstantSourceNode,
  modLevelConstSource: null as unknown as ConstantSourceNode,
  DCOffsetConstSource: null as unknown as ConstantSourceNode,
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
  init: async () => {
    const audioCtx = get().audioCtx ?? new window.AudioContext({sampleRate: 44100})
    let started = get().started
    const modRatioConstSource = get().modRatioConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modRatio,
    })
    const modOffsetConstSource = get().modOffsetConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modOffset,
    })
    const modLevelConstSource = get().modLevelConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modLevel,
    })
    const DCOffsetConstSource = get().DCOffsetConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: -1,
    })

    const analyzer = get().analyzer ?? audioCtx.createAnalyser()
    const masterGain = get().masterGain ?? audioCtx.createGain()

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    }

    if (!started && audioCtx.state === 'running') {
      modRatioConstSource.start()
      modOffsetConstSource.start()
      modLevelConstSource.start()
      DCOffsetConstSource.start()

      analyzer.connect(masterGain)
      masterGain.connect(audioCtx.destination)

      masterGain.gain.setValueAtTime(get().masterVolume, audioCtx.currentTime)

      started = true
    }

    get().voices.forEach(killVoice)

    set({
      audioCtx,
      noteVoiceMap: {},
      modRatioConstSource,
      modOffsetConstSource,
      modLevelConstSource,
      DCOffsetConstSource,
      analyzer,
      masterGain,
      voices: [],
      pressedNotes: new Set(),
      started,
    })
  },
  noteOn: (note: number) => {
    const mode = get().mode
    const now = get().audioCtx.currentTime
    const noteHz = midiToHz(note)
    const voice = createVoice(
      note,
      mode,
      get().audioCtx,
      get().modRatioConstSource,
      get().modOffsetConstSource,
      get().modLevelConstSource,
      get().DCOffsetConstSource,
      get().analyzer,
    )
    voice.carOsc.frequency.setValueAtTime(noteHz, now)

    voice.modEnv.gain.setValueAtTime(1, now)
    voice.carEnv.gain.setValueAtTime(1, now)
    
    const allVoices = [...get().voices, voice]
    const maxVoices = get().maxVoices
    const voices = allVoices.slice(Math.max(0, allVoices.length - maxVoices))
    const voicesToKill = (allVoices.length > maxVoices) ? allVoices.slice(0, allVoices.length - maxVoices) : []

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
    get().modRatioConstSource.offset.setValueAtTime(modRatio, get().audioCtx.currentTime)
  },
  setModOffset: (modOffset: number) => {
    set({ modOffset })
    get().modOffsetConstSource.offset.setValueAtTime(modOffset, get().audioCtx.currentTime)
  },
  setMasterVolume: (volume: number) => {
    set({ masterVolume: volume })
    get().masterGain.gain.setValueAtTime(volume, get().audioCtx.currentTime)
  },
  setMaxVoices: (maxVoices: number) => {
    get().voices.forEach(killVoice)
    set({ maxVoices: Math.min(Math.max(1, maxVoices), 8), voices: [], noteVoiceMap: {} })
  },
}))

export default useSynthStore