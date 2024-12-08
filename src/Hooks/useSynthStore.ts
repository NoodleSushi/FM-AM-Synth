import { create } from 'zustand'
import { midiToHz, Waveform } from '../utils'
import { createPeriodicWave } from '../utils'

export type SynthMode = 'FM' | 'AM'

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
  kill: () => void,
}

interface SynthState {
  audioCtx: AudioContext,
  voices: Voice[],
  lastNoteHz: number,
  started: boolean,
  noteVoiceMap: Record<number, Set<Voice>>,
  pressedNotes: Set<number>,
  modRatioConstSource: ConstantSourceNode,
  modOffsetConstSource: ConstantSourceNode,
  modIdxConstSource: ConstantSourceNode,
  modDepthConstSource: ConstantSourceNode,
  modLevelConstSource: ConstantSourceNode,
  DCOffsetConstSource: ConstantSourceNode,
  analyzer: AnalyserNode,
  gain: GainNode,
  masterGain: GainNode,
  mode: SynthMode,
  maxVoices: number,
  masterVolume: number,
  volume: number,
  modLevel: number,
  modRatio: number,
  modOffset: number,
  modIdx: number,
  modDepth: number,
  modWaveform: Waveform,
  modWavePhase: number,
  modWaveN: number,
  modPeriodicWave: PeriodicWave,
  modComps: {
    real: Float32Array,
    imag: Float32Array,
  }
  carWaveform: Waveform,
  carWavePhase: number,
  carWaveN: number,
  carPeriodicWave: PeriodicWave,
  carComps: {
    real: Float32Array,
    imag: Float32Array,
  }
  setMode: (mode: SynthMode) => void,
  setMaxVoices: (maxVoices: number) => void,
  setMasterVolume: (masterVolume: number) => void,
  setVolume: (volume: number) => void,
  setModLevel: (modLevel: number) => void,
  setModRatio: (modRatio: number) => void,
  setModOffset: (modOffset: number) => void,
  setModIdx: (modIdx: number) => void,
  setModDepth: (modDepth: number) => void,
  setModWaveform: (modWaveType: Waveform) => void,
  setModWavePhase: (modWavePhase: number) => void,
  setModWaveN: (modWaveN: number) => void,
  updateModPeriodicWave: (ctx?: AudioContext) => void,
  setCarWaveform: (carWaveType: Waveform) => void,
  setCarWavePhase: (carWavePhase: number) => void,
  setCarWaveN: (carWaveN: number) => void,
  updateCarPeriodicWave: (ctx?: AudioContext) => void
  init: () => void,
  noteOn: (note: number) => void,
  noteOff: (note: number) => void,
  killAllVoices: () => void,
}

function createVoice(
  note: number,
  mode: SynthMode,
  audioCtx: AudioContext,
  modPeriodicWave: PeriodicWave,
  carPeriodicWave: PeriodicWave,
  modRatioCS: ConstantSourceNode,
  modOffsetCS: ConstantSourceNode,
  modIdxCS: ConstantSourceNode,
  modDepthCS: ConstantSourceNode,
  modLevelCS: ConstantSourceNode,
  DCOffsetCS: ConstantSourceNode,
  dest?: AudioNode
): Voice {
  const noteFreq = new ConstantSourceNode(audioCtx, { offset: midiToHz(note) })
  const noteRatio = new GainNode(audioCtx, { gain: 0 })
  const modFreq = audioCtx.createGain()
  const modIdx = new GainNode(audioCtx, { gain: 0 })
  const modOsc = new OscillatorNode(audioCtx, { frequency: 0 })
  const modDepth = audioCtx.createGain()
  const modEnv = audioCtx.createGain()
  const modLevel = new GainNode(audioCtx, { gain: 0 })
  const modOut = audioCtx.createGain()
  const carOsc = audioCtx.createOscillator()
  const carDepth = audioCtx.createGain()
  const carEnv = audioCtx.createGain()

  noteFreq.connect(noteRatio)
  modRatioCS.connect(noteRatio.gain)
  noteRatio.connect(modFreq)
  modOffsetCS.connect(modFreq)
  modFreq.connect(modOsc.frequency)

  modOsc.setPeriodicWave(modPeriodicWave)
  modOsc.connect(modDepth)
  modDepth.connect(modEnv)
  modEnv.connect(modLevel)
  modLevelCS.connect(modLevel.gain)
  modLevel.connect(modOut)

  if (mode === 'FM') {
    modFreq.connect(modIdx)
    modIdxCS.connect(modIdx.gain)
    modIdx.connect(modDepth.gain)
    modOut.connect(carOsc.frequency)
    modDepthCS.connect(modDepth.gain)
  } else {
    modOut.connect(carDepth.gain)
    DCOffsetCS.connect(modOut)
  }

  carOsc.setPeriodicWave(carPeriodicWave)
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
    kill: () => {
      noteFreq.stop()
      modOsc.stop()
      carOsc.stop()
      modRatioCS.disconnect(noteRatio.gain)
      modOffsetCS.disconnect(modFreq)
      modLevelCS.disconnect(modLevel.gain)
      if (mode === 'FM') {
        modIdxCS.disconnect(modIdx.gain)
        modDepthCS.disconnect(modDepth.gain)
      }
      else if (mode === 'AM')
        DCOffsetCS.disconnect(modOut)
    }
  }
}

const useSynthStore = create<SynthState>((set, get) => ({
  audioCtx: null as unknown as AudioContext,
  modRatioConstSource: null as unknown as ConstantSourceNode,
  modOffsetConstSource: null as unknown as ConstantSourceNode,
  modLevelConstSource: null as unknown as ConstantSourceNode,
  modIdxConstSource: null as unknown as ConstantSourceNode,
  modDepthConstSource: null as unknown as ConstantSourceNode,
  DCOffsetConstSource: null as unknown as ConstantSourceNode,
  analyzer: null as unknown as AnalyserNode,
  masterGain: null as unknown as GainNode,
  gain: null as unknown as GainNode,
  voices: [],
  lastNoteHz: 440.0,
  started: false,
  pressedNotes: new Set(),
  noteVoiceMap: {},
  mode: 'FM',
  maxVoices: 4,
  modLevel: 1,
  modRatio: 1,
  modOffset: 0,
  modIdx: 13,
  modDepth: 0,
  modWaveform: 'sin',
  modWavePhase: 0,
  modWaveN: 512,
  modPeriodicWave: null as unknown as PeriodicWave,
  modComps: {
    real: new Float32Array(512),
    imag: new Float32Array(512),
  },
  carWaveform: 'sin',
  carWavePhase: 0,
  carWaveN: 512,
  carPeriodicWave: null as unknown as PeriodicWave,
  carComps: {
    real: new Float32Array(512),
    imag: new Float32Array(512),
  },
  volume: 1,
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
    const modIdxConstSource = get().modIdxConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modIdx,
    })
    const modDepthConstSource = get().modDepthConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modDepth,
    })
    const modLevelConstSource = get().modLevelConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: get().modLevel,
    })
    const DCOffsetConstSource = get().DCOffsetConstSource ?? new ConstantSourceNode(audioCtx, {
      offset: -1,
    })

    const gain = get().gain ?? audioCtx.createGain()
    const analyzer = get().analyzer ?? audioCtx.createAnalyser()
    const masterGain = get().masterGain ?? audioCtx.createGain()

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    }

    if (!started && audioCtx.state === 'running') {
      modRatioConstSource.start()
      modOffsetConstSource.start()
      modIdxConstSource.start()
      modDepthConstSource.start()
      modLevelConstSource.start()
      DCOffsetConstSource.start()

      get().updateModPeriodicWave(audioCtx)
      get().updateCarPeriodicWave(audioCtx)

      gain.connect(analyzer)
      analyzer.connect(masterGain)
      masterGain.connect(audioCtx.destination)

      gain.gain.setValueAtTime(get().volume, audioCtx.currentTime)
      masterGain.gain.setValueAtTime(get().masterVolume, audioCtx.currentTime)

      started = true
    }

    get().killAllVoices()

    set({
      audioCtx,
      modRatioConstSource,
      modOffsetConstSource,
      modIdxConstSource,
      modDepthConstSource,
      modLevelConstSource,
      DCOffsetConstSource,
      analyzer,
      gain,
      masterGain,
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
      get().modPeriodicWave,
      get().carPeriodicWave,
      get().modRatioConstSource,
      get().modOffsetConstSource,
      get().modIdxConstSource,
      get().modDepthConstSource,
      get().modLevelConstSource,
      get().DCOffsetConstSource,
      get().gain,
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
      voice.kill()
      noteVoiceMap[voice.note]?.delete(voice)
      if (noteVoiceMap[voice.note]?.size === 0 || false) {
        pressedNotes.delete(voice.note)
      }
    })

    noteVoiceMap[note] ??= new Set()
    noteVoiceMap[note].add(voice)
    pressedNotes.add(note)

    set({ voices, lastNoteHz: noteHz, pressedNotes: new Set(pressedNotes) })
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
  setModWaveform: (modWaveType: Waveform) => {
    set({ modWaveform: modWaveType })
    get().updateModPeriodicWave()
  },
  setModWavePhase: (modWavePhase: number) => {
    set({ modWavePhase })
    get().updateModPeriodicWave()
  },
  setModWaveN: (modWaveN: number) => {
    set({ modWaveN })
    get().updateModPeriodicWave()
  },
  updateModPeriodicWave: (ctx?: AudioContext) => {
    const { periodicWave, real, imag } = createPeriodicWave(ctx ?? get().audioCtx, get().modWaveform, get().modWavePhase, get().modWaveN)
    set({ modPeriodicWave: periodicWave, modComps: { real, imag } })
    get().voices.forEach((voice) => {
      voice.modOsc.setPeriodicWave(get().modPeriodicWave)
    })
  },
  setCarWaveform: (carWaveType: Waveform) => {
    set({ carWaveform: carWaveType })
    get().updateCarPeriodicWave()
  },
  setCarWavePhase: (carWavePhase: number) => {
    set({ carWavePhase })
    get().updateCarPeriodicWave()
  },
  setCarWaveN: (carWaveN: number) => {
    set({ carWaveN })
    get().updateCarPeriodicWave()
  },
  updateCarPeriodicWave: (ctx?: AudioContext) => {
    const { periodicWave, real, imag } = createPeriodicWave(ctx ?? get().audioCtx, get().carWaveform, get().carWavePhase, get().carWaveN)
    set({ carPeriodicWave: periodicWave, carComps: { real, imag } })
    get().voices.forEach((voice) => {
      voice.carOsc.setPeriodicWave(get().carPeriodicWave)
    })
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
  setModIdx: (modIdx: number) => {
    set({ modIdx })
    get().modIdxConstSource.offset.setValueAtTime(modIdx, get().audioCtx.currentTime)
  },
  setModDepth: (modDepth: number) => {
    set({ modDepth })
    get().modDepthConstSource.offset.setValueAtTime(modDepth, get().audioCtx.currentTime)
  },
  setMasterVolume: (volume: number) => {
    set({ masterVolume: volume })
    get().masterGain.gain.setValueAtTime(volume, get().audioCtx.currentTime)
  },
  setVolume: (volume: number) => {
    set({ volume })
    get().gain.gain.setValueAtTime(volume, get().audioCtx.currentTime)
  },
  setMaxVoices: (maxVoices: number) => {
    get().killAllVoices()
    set({ maxVoices: Math.min(Math.max(1, maxVoices), 8) })
  },
  killAllVoices: () => {
    get().voices.forEach((voice) => voice.kill())
    set({ voices: [], noteVoiceMap: {}, pressedNotes: new Set() })
  },
}))

export default useSynthStore