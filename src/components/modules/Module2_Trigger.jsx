import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

// Educational speed: very slow so user can follow the voltage change
const EDU_SPEED = 0.06

export default function Module2_Trigger({ onAdvance }) {
  const [stimApplied, setStimApplied] = useState(false)
  const [paused, setPaused] = useState(false)
  const voltage = useStore((s) => s.voltage)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  // Start paused at resting state
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause when voltage crosses -55 mV (threshold reached)
  useEffect(() => {
    if (stimApplied && !paused && voltage >= -55) {
      useStore.getState().pause()
      setPaused(true)
    }
  }, [voltage, stimApplied, paused])

  const applyStimulus = () => {
    setStimApplied(true)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 300)
  }

  const vColor = voltage > -55 ? '#ff9800' : voltage > -65 ? '#ffb74d' : '#81c784'

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">The Trigger</h3>

      <p className="m2-narration">
        A neuron fires when it receives enough excitatory input from other neurons.
        Let's simulate a stimulus arriving at the dendrites.
      </p>

      {/* Voltage meter */}
      <div className="m2-voltage-meter">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">Membrane Voltage</span>
          <span className="m2-voltage-value" style={{ color: vColor }}>
            {voltage.toFixed(0)} mV
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
            <span className="m2-threshold-label">-55 mV threshold</span>
          </div>
        </div>
      </div>

      {!stimApplied ? (
        <div className="m2-action-center">
          <button className="m2-action-btn m2-action-btn--stimulus" onClick={applyStimulus}>
            Apply Stimulus
          </button>
          <p className="m2-hint">Click to send a signal into the dendrites</p>
        </div>
      ) : paused ? (
        <div className="m2-pause-callout">
          <div className="m2-pause-badge">PAUSED AT THRESHOLD</div>
          <p className="m2-concept">
            The stimulus caused a <strong>depolarization</strong> — the inside of the cell
            became less negative as positive ions entered through the dendrites.
            The voltage has reached <strong>-55 mV</strong>, the critical threshold.
            What happens next is dramatic...
          </p>
        </div>
      ) : (
        <p className="m2-hint m2-hint--watching">
          Watch the voltage rise slowly as ions enter the cell...
        </p>
      )}

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
