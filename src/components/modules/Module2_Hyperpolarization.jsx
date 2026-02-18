import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.08
// Hyperpolarization bottom (-80 mV at 2.5ms)
const HYPER_TIME = 2.5
// Recovery complete (4ms)
const RECOVERY_TIME = 4.0

export default function Module2_Hyperpolarization({ onAdvance }) {
  const [playing, setPlaying] = useState(false)
  const [recovered, setRecovered] = useState(false)
  const voltage = useStore((s) => s.voltage)
  const phase = useStore((s) => s.phase)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  // Start PAUSED at hyperpolarization (-80 mV)
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(HYPER_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause at recovery
  useEffect(() => {
    if (playing && !recovered && currentTime >= RECOVERY_TIME - 0.1) {
      useStore.getState().pause()
      setPlaying(false)
      setRecovered(true)
    }
  }, [currentTime, playing, recovered])

  const watchRecovery = () => {
    setPlaying(true)
    setRecovered(false)
    useStore.getState().setCurrentTime(HYPER_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 200)
  }

  const isHyper = voltage < -72
  const vColor = isHyper ? '#1565c0' : voltage < -55 ? '#81c784' : '#ff9800'

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">Hyperpolarization: The Overshoot</h3>

      {/* Voltage display */}
      <div className="m2-voltage-meter">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">{phase.toUpperCase()}</span>
          <span className="m2-voltage-value" style={{ color: vColor }}>
            {voltage.toFixed(0)} mV
            {isHyper && <span className="m2-overshoot-badge">OVERSHOOT</span>}
          </span>
        </div>
        <div className="m2-voltage-bar-track">
          <div
            className="m2-voltage-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, ((voltage + 80) / 110) * 100))}%`,
              background: vColor,
            }}
          />
          <div
            className="m2-voltage-threshold"
            style={{ left: `${(((-70) + 80) / 110) * 100}%` }}
          >
            <span className="m2-threshold-label">-70 rest</span>
          </div>
        </div>
      </div>

      <div className="m2-pause-callout">
        <div className="m2-pause-badge">PAUSED AT -80 mV</div>
        <p className="m2-narration" style={{ margin: '8px 0 0' }}>
          The voltage didn't stop at -70 mV — it <strong>overshot to -80 mV</strong>.
          Why? K+ channels close slowly. Too much potassium leaves before they shut.
        </p>
      </div>

      <div className="m2-key-concept">
        <span className="m2-concept-icon">?</span>
        <p className="m2-concept-text">
          This <strong>hyperpolarization</strong> is temporary. The voltage will return
          to -70 mV as K+ channels finally close and the Na+/K+ pump restores the
          ion balance. This brief overshoot plays an important role in the
          <em> refractory period</em> — coming up next.
        </p>
      </div>

      {/* Watch recovery */}
      <div className="m2-controls-row">
        {!recovered ? (
          <button
            className="m2-action-btn"
            onClick={watchRecovery}
            disabled={playing}
          >
            {playing ? 'Watching recovery...' : 'Watch Recovery to -70 mV'}
          </button>
        ) : (
          <p className="m2-concept">
            The membrane voltage has returned to <strong>-70 mV</strong> — resting potential
            restored. The neuron is ready to fire again (after a brief refractory period).
          </p>
        )}
      </div>

      {/* Visual showing K+ still flowing */}
      <div className="m2-ion-flow">
        <div className="m2-ion-flow-item m2-ion-flow-item--fading">
          <span className="m2-ion-dot" style={{ background: '#9C27B0' }} />
          <span className="m2-ion-label">K+ channels closing slowly... still leaking out</span>
          <span className="m2-ion-arrow">&larr;</span>
        </div>
      </div>

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
