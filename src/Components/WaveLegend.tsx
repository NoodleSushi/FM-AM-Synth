import { useEffect, useRef } from 'react'

type WaveLegendProps = {
  real: Float32Array,
  imag: Float32Array,
  lineWidth?: number,
  lineColor?: string;
} & React.HTMLAttributes<HTMLDivElement>

function WaveLegend({ real, imag, lineWidth = 4, lineColor, ...props }: WaveLegendProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    [canvas.width, canvas.height] = [canvas.clientWidth, canvas.clientHeight]

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const [width, height] = [canvas.width, canvas.height]
    ctx.clearRect(0, 0, width, height)

    ctx.lineWidth = lineWidth
    // ctx.strokeStyle = window.getComputedStyle(canvas).color
    ctx.strokeStyle = lineColor
      ? lineColor
      : window.getComputedStyle(canvas).color;
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      let val = 0
      const len = Math.min(real.length, imag.length, )
      for (let i = 1; i < len; i++) {
        const angle = Math.atan2(imag[i], real[i])
        val += Math.hypot(real[i], imag[i]) * Math.cos(i * (width - x) * Math.PI * 2 / width + angle)
      }
      const y = (height - lineWidth / 2) - ((val * 0.8) / 2 + 0.5) * (height - lineWidth)
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }

  useEffect(() => {
    requestAnimationFrame(animate)
  }, [imag, real])

  // to change the line color whenever selectedTheme changes
  useEffect(() => {
    animate(); 
  }, [lineColor, real, imag]);

  return <div {...props}>
    <canvas className={`w-full h-full`} ref={canvasRef} />
  </div>
}

export default WaveLegend