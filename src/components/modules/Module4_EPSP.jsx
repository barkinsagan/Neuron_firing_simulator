import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

export default function Module4_EPSP({ onAdvance }) {
  const [sequencePlaying, setSequencePlaying] = useState(false)
  const [pausedAtThreshold, setPausedAtThreshold] = useState(false)
  const postVoltage = useStore((s) => s.postVoltage)
  const prevSpeedRef = useRef(1)

  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause when postsynaptic voltage reaches threshold
  useEffect(() => {
    if (sequencePlaying && !pausedAtThreshold && postVoltage >= -55) {
      useStore.getState().pause()
      setPausedAtThreshold(true)
    }
  }, [postVoltage, sequencePlaying, pausedAtThreshold])

  const playFullSequence = () => {
    setSequencePlaying(true)
    setPausedAtThreshold(false)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 300)
  }

  const vColor = postVoltage > -55 ? '#ff9800' : postVoltage > -65 ? '#ffb74d' : '#81c784'

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">EPSP: Excitatory Postsynaptic Potential</h3>

      <p className="m4-narration">
        When excitatory NTs bind to receptors, they open channels that let <strong>Na⁺ in</strong>.
        This creates a small depolarization called an <strong>EPSP</strong>. If enough EPSPs
        add up, the postsynaptic neuron reaches threshold and fires its own AP!
      </p>

      {/* Postsynaptic voltage meter */}
      <div className="m4-voltage-meter">
        <div className="m4-voltage-header">
          <span className="m4-voltage-label">Postsynaptic Voltage</span>
          <span className="m4-voltage-value" style={{ color: vColor }}>
            {postVoltage.toFixed(0)} mV
          </span>
        </div>
        <div className="m4-voltage-bar-track">
          <div
            className="m4-voltage-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, ((postVoltage + 80) / 110) * 100))}%`,
              background: vColor,
            }}
          />
          <div
            className="m4-voltage-threshold"
            style={{ left: `${(((-55) + 80) / 110) * 100}%` }}
          >
            <span className="m4-threshold-label">-55 mV threshold</span>
          </div>
        </div>
      </div>

      <div className="m4-action-center">
        <button
          className="m4-action-btn m4-action-btn--fire"
          onClick={playFullSequence}
        >
          {sequencePlaying ? 'Replay Full Sequence' : 'Play Full Sequence'}
        </button>
        {!sequencePlaying && (
          <p className="m4-hint">
            Watch AP → synapse → postsynaptic depolarization
          </p>
        )}
      </div>

      {sequencePlaying && !pausedAtThreshold && (
        <p className="m4-hint m4-hint--watching">
          Signal propagating... watch the postsynaptic voltage rise
        </p>
      )}

      {pausedAtThreshold && (
        <div className="m4-pause-callout">
          <div className="m4-pause-badge">THRESHOLD REACHED</div>
          <p className="m4-concept">
            The postsynaptic neuron has reached <strong>-55 mV</strong>! It will now
            fire its own action potential, continuing the signal down the neural
            circuit. This is how information flows through the brain.
          </p>
        </div>
      )}

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
