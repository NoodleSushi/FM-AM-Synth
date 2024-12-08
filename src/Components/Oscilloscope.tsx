import { useEffect, useRef } from 'react'

type OscilloscopeProps = {
  alignHz?: number,
  analyzer?: AnalyserNode,
} & React.HTMLAttributes<HTMLDivElement>

function Oscilloscope({ analyzer, alignHz = 440, ...props }: OscilloscopeProps) {
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
    const dataArray = new Uint8Array(bufferLength)
    analyzer.getByteTimeDomainData(dataArray)

    const sliceWidth = width / bufferLength;
    const sampleRate = analyzer.context.sampleRate
    const sampleTime = analyzer.context.currentTime * sampleRate
    const period = sampleRate / alignHz
    const sampleOffset = (sampleTime % period)
    let x = (-period + sampleOffset) * sliceWidth;
    const offset = x % 1
    x = Math.floor(x)

    ctx.lineWidth = 2
    ctx.strokeStyle = window.getComputedStyle(canvas).color
    ctx.beginPath()

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = height - v * (height / 2);
    
      if (i === 0) {
        ctx.moveTo(x + offset, y);
      } else {
        ctx.lineTo(x + offset, y);
      }
    
      x += sliceWidth;
    }

    ctx.stroke();
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [analyzer, alignHz])

  return <div {...props}>
    <canvas className='w-full h-full' ref={canvasRef} />
  </div>
}

export default Oscilloscope