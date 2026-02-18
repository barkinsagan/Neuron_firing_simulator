import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.06

// Time at which voltage ≈ -55 mV (threshold)
const THRESHOLD_TIME = 0.6
// Time at which voltage ≈ +30 mV (peak)
const PEAK_TIME = 1.5

export default function Module2_Rising({ onAdvance }) {
  const [playing, setPlaying] = useState(false)
  const [reachedPeak, setReachedPeak] = useState(false)
  const voltage = useStore((s) => s.voltage)
  const phase = useStore((s) => s.phase)
  const prevSpeedRef = useRef(1)

  // Start PAUSED at threshold (-55 mV) so user can see channels just opened
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(THRESHOLD_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause at peak (+30 mV)
  useEffect(() => {
    if (playing && !reachedPeak && voltage >= 28) {
      useStore.getState().pause()
      setPlaying(false)
      setReachedPeak(true)
    }
  }, [voltage, playing, reachedPeak])

  const watchRising = () => {
    setPlaying(true)
    setReachedPeak(false)
    useStore.getState().setCurrentTime(THRESHOLD_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 200)
  }

  const vColor = voltage > 0 ? '#f44336' : voltage > -55 ? '#ff9800' : '#81c784'

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">The Rising Phase: Na+ Invasion</h3>

      <p className="m2-narration">
        Voltage-gated sodium channels have just snapped open at -55 mV!
        Na+ is highly concentrated outside and attracted to the negative interior —
        when the gates open, it's like <strong>breaking a dam</strong>.
      </p>

      {/* Voltage display */}
      <div className="m2-voltage-meter">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">
            {phase === 'depolarizing' ? 'DEPOLARIZING' : phase.toUpperCase()}
          </span>
          <span className="m2-voltage-value" style={{ color: vColor }}>
            {voltage.toFixed(0)} mV
            {reachedPeak && <span className="m2-fired-badge">PEAK!</span>}
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
            style={{ left: `${(((-55) + 80) / 110) * 100}%` }}
          >
            <span className="m2-threshold-label">-55</span>
          </div>
        </div>
      </div>

      {/* Ion flow indicator */}
      <div className="m2-ion-flow">
        <div className="m2-ion-flow-item">
          <span className="m2-ion-dot" style={{ background: '#FFD700' }} />
          <span className="m2-ion-label">Na+ channels OPEN — flooding inward</span>
          <span className="m2-ion-arrow">&#8594;</span>
        </div>
      </div>

      {/* Stats */}
      <div className="m2-stats">
        <div className="m2-stat">
          <span className="m2-stat-value">~1 ms</span>
          <span className="m2-stat-label">Duration</span>
        </div>
        <div className="m2-stat">
          <span className="m2-stat-value">+30 mV</span>
          <span className="m2-stat-label">Peak Voltage</span>
        </div>
        <div className="m2-stat">
          <span className="m2-stat-value">1000s</span>
          <span className="m2-stat-label">Na+ ions entering</span>
        </div>
      </div>

      {/* Controls */}
      <div className="m2-controls-row">
        {!reachedPeak ? (
          <button
            className="m2-action-btn m2-action-btn--stimulus"
            onClick={watchRising}
            disabled={playing}
          >
            {playing ? 'Watching Na+ flood in...' : 'Watch Na+ Flood In'}
          </button>
        ) : (
          <div className="m2-pause-callout">
            <div className="m2-pause-badge">PAUSED AT PEAK (+30 mV)</div>
            <p className="m2-concept">
              Sodium has flooded in, reversing the cell's charge from negative to
              positive. The voltage peaked at <strong>+30 mV</strong>. Look at the
              3D view — notice the gold Na+ particles rushing inward through the channels.
            </p>
            <button className="m2-action-btn" onClick={watchRising}>
              Replay
            </button>
          </div>
        )}
      </div>

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
