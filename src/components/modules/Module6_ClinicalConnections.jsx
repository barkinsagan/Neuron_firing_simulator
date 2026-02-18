import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const CONDITIONS = [
  {
    name: 'Epilepsy',
    mechanism: 'Excitation/inhibition balance fails',
    effect: 'Runaway neural activity leading to seizures',
    module: 'Module 5 — Feedback Inhibition',
    color: '#f44336',
  },
  {
    name: 'Multiple Sclerosis',
    mechanism: 'Myelin degradation by immune system',
    effect: 'Slowed or blocked signal propagation',
    module: 'Module 3 — Myelin & Propagation',
    color: '#9c27b0',
  },
  {
    name: "Parkinson's Disease",
    mechanism: 'Dopamine neuron loss in substantia nigra',
    effect: 'Motor control circuits disrupted',
    module: 'Module 4 — Neurotransmitters',
    color: '#ff9800',
  },
  {
    name: 'Depression',
    mechanism: 'Altered serotonin & norepinephrine levels',
    effect: 'Synaptic plasticity and mood circuits affected',
    module: 'Module 4 — Synaptic Transmission',
    color: '#2196f3',
  },
]

export default function Module6_ClinicalConnections({ onAdvance }) {
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m6-step">
      <h3 className="m6-step-title">Clinical Connections</h3>

      <p className="m6-narration">
        Understanding these mechanisms isn't just academic — it directly helps
        us understand and treat neurological disorders.
      </p>

      <div className="m6-condition-cards">
        {CONDITIONS.map((c, i) => (
          <div
            key={i}
            className={`m6-condition-card ${expanded === i ? 'm6-condition-card--expanded' : ''}`}
            style={{ borderLeftColor: c.color }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="m6-condition-header">
              <span className="m6-condition-name">{c.name}</span>
              <span className="m6-condition-expand">{expanded === i ? '−' : '+'}</span>
            </div>
            <div className="m6-condition-mechanism">{c.mechanism}</div>
            {expanded === i && (
              <div className="m6-condition-details">
                <p className="m6-condition-effect">{c.effect}</p>
                <span className="m6-condition-module" style={{ color: c.color }}>
                  Related: {c.module}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="m6-key-concept">
        <strong>The takeaway:</strong> Every drug that affects the brain works by
        modifying one of the mechanisms you just learned — ion channels,
        neurotransmitters, receptors, or synaptic clearance.
      </div>

      <div className="m6-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
