import { useRef, useEffect } from 'react'
import useStore from '../../lib/store'

const TAKEAWAYS = [
  'Threshold at -55 mV triggers all-or-nothing response',
  'Rising phase: Voltage-gated Na+ channels open, Na+ rushes in',
  'Peak at +30 mV, Na+ channels inactivate',
  'Falling phase: K+ channels open, K+ rushes out',
  'Hyperpolarization: Brief overshoot to -80 mV',
  'Refractory period prevents immediate re-firing',
]

// Simple canvas voltage curve
function VoltageCurve() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    for (let y = 0; y < h; y += h / 5) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    const vToY = (v) => h - ((v + 80) / 110) * h

    // Voltage labels
    ctx.fillStyle = '#666'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'right'
    const voltages = [30, 0, -55, -70, -80]
    voltages.forEach((v) => {
      const y = vToY(v)
      ctx.fillText(`${v}`, 30, y + 3)
      ctx.strokeStyle = v === -55 ? 'rgba(255,152,0,0.3)' : 'rgba(255,255,255,0.04)'
      ctx.setLineDash(v === -55 ? [4, 4] : [])
      ctx.beginPath()
      ctx.moveTo(34, y)
      ctx.lineTo(w - 10, y)
      ctx.stroke()
    })
    ctx.setLineDash([])

    // Draw AP curve
    const points = []
    for (let x = 0; x <= 1; x += 0.005) {
      let v
      const t = x * 4
      if (t < 0.5) {
        v = -70
      } else if (t < 1.5) {
        const p = (t - 0.5) / 1.0
        v = -70 + 100 * Math.sin(p * Math.PI / 2)
      } else if (t < 2.5) {
        const p = (t - 1.5) / 1.0
        v = 30 - 110 * Math.sin(p * Math.PI / 2)
      } else {
        const p = (t - 2.5) / 1.5
        v = -80 + 10 * (1 - Math.cos(p * Math.PI / 2))
      }
      const px = 38 + x * (w - 48)
      const py = vToY(v)
      points.push([px, py])
    }

    const gradient = ctx.createLinearGradient(38, 0, w - 10, 0)
    gradient.addColorStop(0, '#81c784')
    gradient.addColorStop(0.15, '#ff9800')
    gradient.addColorStop(0.3, '#f44336')
    gradient.addColorStop(0.5, '#9c27b0')
    gradient.addColorStop(0.7, '#1565c0')
    gradient.addColorStop(1, '#81c784')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Phase labels
    ctx.fillStyle = '#888'
    ctx.font = '9px system-ui'
    ctx.textAlign = 'center'
    const labels = [
      { text: 'Rest', x: 0.06 },
      { text: 'Rising', x: 0.25 },
      { text: 'Peak', x: 0.38 },
      { text: 'Falling', x: 0.5 },
      { text: 'Hyper', x: 0.7 },
      { text: 'Recovery', x: 0.9 },
    ]
    labels.forEach((l) => {
      ctx.fillText(l.text, 38 + l.x * (w - 48), h - 4)
    })

    // Time axis
    ctx.fillStyle = '#555'
    ctx.font = '9px system-ui'
    ctx.textAlign = 'center'
    for (let ms = 0; ms <= 4; ms++) {
      const x = 38 + (ms / 4) * (w - 48)
      ctx.fillText(`${ms}ms`, x, h - 14)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={180}
      className="m2-voltage-canvas"
    />
  )
}

export default function Module2_Summary({ onAdvance }) {
  // Pause simulation on mount
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m2-step m2-step--summary">
      <h3 className="m2-step-title">Module 2 Complete: The Action Potential</h3>

      <VoltageCurve />

      <div className="m2-takeaways">
        {TAKEAWAYS.map((t, i) => (
          <div key={i} className="m2-takeaway">
            <span className="m2-takeaway-check">&#10003;</span>
            <span className="m2-takeaway-text">{t}</span>
          </div>
        ))}
      </div>

      <div className="m2-preview-next">
        <p className="m2-preview-text">
          <strong>Up Next:</strong> You now understand how a neuron fires at one location.
          But how does this signal travel down the long axon? Module 3 explores
          <em> propagation and saltatory conduction</em>.
        </p>
      </div>

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue to Module 3
        </button>
      </div>
    </div>
  )
}
