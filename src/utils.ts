export function midiToHz(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'reverseSawtooth'

export function createPeriodicWave(audioCtx: AudioContext, waveform: Waveform, phase: number = 0, N: number = 512) {
  N++
  const real = new Float32Array(N)
  const imag = new Float32Array(N)
  switch (waveform) {
    case 'sine':
      imag[1] = Math.cos(phase)
      real[1] = Math.sin(phase)
      break;
    case 'square':
      for (let k = 1; k < N; k += 2) {
        const val = 4 / (Math.PI * k)
        real[k] = Math.sin(phase * k) * val
        imag[k] = Math.cos(phase * k) * val
      }
      break;
    case 'sawtooth':
      for (let k = 1; k < N; k++) {
        const val = -2 / (Math.PI * k)
        real[k] = Math.sin(phase * k) * val
        imag[k] = Math.cos(phase * k) * val
      }
      break;
    case 'reverseSawtooth':
      for (let k = 1; k < N; k++) {
        const val = 2 / (Math.PI * k)
        real[k] = Math.sin(phase * k) * val
        imag[k] = Math.cos(phase * k) * val
      }
      break;
    case 'triangle':
      for (let k = 1; k < N; k += 2) {
        const val = (8 / Math.PI ** 2) * ((-1) ** ((k - 1) / 2)) / (k ** 2)
        real[k] = val * Math.sin(phase * k)
        imag[k] = val * Math.cos(phase * k)
      }
      break;
  }
  return audioCtx.createPeriodicWave(real, imag, { disableNormalization: true })
}