import { useEffect, useRef } from 'react'

type SpectrumProps = {
  analyzer?: AnalyserNode
} & React.HTMLAttributes<HTMLDivElement>

function freq2X(freq: number) {
  const minF = Math.log(20) / Math.log(10)
  const maxF = Math.log(20000) / Math.log(10)
  
  let range = maxF - minF
  let xAxis = (Math.log(freq) / Math.log(10) - minF) / range  
   * 945
  return xAxis
}

function Spectrum({ analyzer, ...props }: SpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    [canvas.width, canvas.height] = [canvas.clientWidth, canvas.clientHeight]

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const [width, height] = [canvas.width, canvas.height]
    ctx.clearRect(0, 0, width, height)

    if (!analyzer) return

    const bufferLength = analyzer.frequencyBinCount
    const audioData = new Float32Array(bufferLength)
    analyzer.getFloatFrequencyData(audioData)
    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    for (let i = 0; i < bufferLength; i++) {
      let value = audioData[i]
      
      //finding the frequency from the index
      let frequency = Math.round(i * 44100 / 2 / bufferLength)
      //need to convert db Value because it is -120 to 0
      let y = (value / 2 + 70) * 3
      //finding the x location px from the frequency
      let x = freq2X(frequency) / 2
      ctx.lineTo(x, height / 2 - y + 128)
    }

    ctx.strokeStyle = window.getComputedStyle(canvas).color
    ctx.stroke()
    
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    if (analyzer) {
      analyzer!.smoothingTimeConstant = 0.0
      // analyzer!.fftSize = 32768
    }
    return () => cancelAnimationFrame(requestRef.current!)
  }, [analyzer])

  return <div {...props}>
    <canvas className='w-full h-full' ref={canvasRef} />
  </div>
}

export default Spectrum