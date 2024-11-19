import { useEffect, useRef } from 'react'

type OscilloscopeProps = {
  analyzer?: AnalyserNode
} & React.HTMLAttributes<HTMLDivElement>

function Oscilloscope({ analyzer, ...props }: OscilloscopeProps) {
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

    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgb(0, 0, 0)'
    ctx.beginPath()

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (height / 2);
    
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [analyzer])

  return <div {...props}>
    <canvas className='w-full h-full' ref={canvasRef} />
  </div>
}

export default Oscilloscope