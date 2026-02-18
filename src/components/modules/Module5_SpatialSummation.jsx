import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const INPUTS = [
  { id: 1, label: 'Synapse 1', mv: 3 },
  { id: 2, label: 'Synapse 2', mv: 3 },
  { id: 3, label: 'Synapse 3', mv: 3 },
  { id: 4, label: 'Synapse 4', mv: 3 },
  { id: 5, label: 'Synapse 5', mv: 3 },
]

const THRESHOLD = -55
const REST = -70

export default function Module5_SpatialSummation({ onAdvance }) {
  const [activeInputs, setActiveInputs] = useState([])

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  const toggleInput = (id) => {
    setActiveInputs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const totalMv = activeInputs.length * 3
  const voltage = REST + totalMv
  const reachedThreshold = voltage >= THRESHOLD
  const vColor = reachedThreshold ? '#ff9800' : voltage > -65 ? '#ffb74d' : '#81c784'

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Spatial Summation</h3>

      <p className="m5-narration">
        When multiple synapses activate <strong>at the same time</strong>, their effects
        add up. This is called <strong>spatial summation</strong>. Click synapses to
        activate them and try to reach threshold!
      </p>

      {/* Clickable synapses */}
      <div className="m5-synapse-row">
        {INPUTS.map((inp) => (
          <button
            key={inp.id}
            className={`m5-synapse-btn ${activeInputs.includes(inp.id) ? 'm5-synapse-btn--active' : ''}`}
            onClick={() => toggleInput(inp.id)}
          >
            <span className="m5-synapse-icon">{activeInputs.includes(inp.id) ? '⚡' : '○'}</span>
            <span className="m5-synapse-label">{inp.label}</span>
          </button>
        ))}
      </div>

      {/* Math display */}
      <div className="m5-math-display">
        {INPUTS.map((inp) => (
          <div key={inp.id} className={`m5-math-line ${activeInputs.includes(inp.id) ? 'm5-math-line--active' : ''}`}>
            <span>{inp.label}:</span>
            <span>{activeInputs.includes(inp.id) ? '+3 mV' : '—'}</span>
          </div>
        ))}
        <div className="m5-math-total">
          <span>Total:</span>
          <span style={{ color: vColor }}>
            {totalMv > 0 ? `+${totalMv} mV` : '0 mV'} → {voltage} mV
          </span>
        </div>
      </div>

      {/* Voltage meter */}
      <div className="m5-voltage-meter">
        <div className="m5-voltage-header">
          <span className="m5-voltage-label">Membrane Voltage</span>
          <span className="m5-voltage-value" style={{ color: vColor }}>
            {voltage} mV
          </span>
        </div>
        <div className="m5-voltage-bar-track">
          <div
            className="m5-voltage-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, ((voltage + 80) / 110) * 100))}%`,
              background: vColor,
            }}
          />
          <div
            className="m5-voltage-threshold"
            style={{ left: `${((THRESHOLD + 80) / 110) * 100}%` }}
          >
            <span className="m5-threshold-label">-55 mV</span>
          </div>
        </div>
      </div>

      {reachedThreshold && (
        <div className="m5-fire-callout">
          <div className="m5-fire-badge">ACTION POTENTIAL FIRES!</div>
          <p className="m5-concept">
            {activeInputs.length} simultaneous inputs provided enough depolarization
            to reach threshold. This is <strong>spatial summation</strong> — adding
            inputs across space.
          </p>
        </div>
      )}

      {!reachedThreshold && activeInputs.length > 0 && (
        <p className="m5-hint">
          {voltage} mV — still {Math.abs(THRESHOLD - voltage)} mV below threshold.
          Activate more synapses!
        </p>
      )}

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
